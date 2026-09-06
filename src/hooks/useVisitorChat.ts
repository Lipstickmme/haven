import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useState } from "react";

import type { ChatMessage } from "@/lib/database.types";
import { submitForm } from "@/lib/api/forms";
import { isSupabaseConfigured } from "@/lib/public-config";
import { supabase } from "@/lib/supabase";

const STORAGE_KEY = "haven.chat.session";

export type ChatStatus = "loading" | "new" | "open" | "error";

export type VisitorChat = {
  status: ChatStatus;
  sessionId: string | null;
  messages: ChatMessage[];
  error: string | null;
  sending: boolean;
  start: (input: { name: string; email: string; message: string }) => Promise<void>;
  send: (body: string) => Promise<void>;
  reset: () => void;
};

function readStoredSession(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStoredSession(id: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (id) window.localStorage.setItem(STORAGE_KEY, id);
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* private mode — the conversation just will not survive a reload */
  }
}

const ANON_DISABLED =
  "Live chat is switched off on this project: anonymous sign-ins are disabled. Turn them on in the Supabase dashboard under Authentication → Sign In / Providers → Anonymous sign-ins, then reload this page.";

function readableError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error ?? "Something went wrong");
  // Supabase's raw wording gives no clue where the setting lives.
  if (/anonymous sign-ins are disabled/i.test(message)) return ANON_DISABLED;
  if (/not configured/i.test(message)) return message;
  return message;
}

/** Signs in anonymously, reusing an existing session rather than making a new
 *  user on every reload. Every chat row then carries a real `auth.uid()`. */
async function ensureVisitorSession(): Promise<string> {
  const { data: existing } = await supabase.auth.getSession();
  if (existing.session?.user) return existing.session.user.id;

  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  if (!data.user) throw new Error("Supabase returned no user for the anonymous sign-in.");
  return data.user.id;
}

export function useVisitorChat(): VisitorChat {
  const [status, setStatus] = useState<ChatStatus>("loading");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const notify = useServerFn(submitForm);

  // Realtime echoes back the row we just inserted. Both paths funnel through
  // here, and the id decides.
  const mergeMessage = useCallback((incoming: ChatMessage) => {
    setMessages((current) =>
      current.some((message) => message.id === incoming.id)
        ? current
        : [...current, incoming].sort((a, b) => a.created_at.localeCompare(b.created_at)),
    );
  }, []);

  // Rejoin an existing conversation on mount.
  useEffect(() => {
    let cancelled = false;

    void (async () => {
      if (!isSupabaseConfigured()) {
        if (!cancelled) {
          setStatus("error");
          setError(
            "Live chat is unavailable: Supabase is not configured for this deployment. See /api/health.",
          );
        }
        return;
      }

      const stored = readStoredSession();
      if (!stored) {
        if (!cancelled) setStatus("new");
        return;
      }

      try {
        await ensureVisitorSession();

        const { data: session, error: sessionError } = await supabase
          .from("chat_sessions")
          .select("id")
          .eq("id", stored)
          .maybeSingle();

        if (sessionError) throw sessionError;

        // The row is gone (deleted, or a different anonymous user now) —
        // forget the id rather than retrying against it forever.
        if (!session) {
          writeStoredSession(null);
          if (!cancelled) setStatus("new");
          return;
        }

        const { data: history, error: historyError } = await supabase
          .from("chat_messages")
          .select("*")
          .eq("session_id", stored)
          .order("created_at", { ascending: true });

        if (historyError) throw historyError;

        if (cancelled) return;
        setMessages((history ?? []) as ChatMessage[]);
        setSessionId(stored);
        setStatus("open");
      } catch (caught) {
        if (cancelled) return;
        setError(readableError(caught));
        setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // One subscription, filtered to this conversation.
  useEffect(() => {
    if (!sessionId || !isSupabaseConfigured()) return;

    const channel = supabase
      .channel(`chat:${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => mergeMessage(payload.new as ChatMessage),
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [sessionId, mergeMessage]);

  const start = useCallback(
    async (input: { name: string; email: string; message: string }) => {
      setSending(true);
      setError(null);
      try {
        await ensureVisitorSession();

        // visitor_id defaults to auth.uid() in the database, so the row can
        // only ever belong to the session that created it.
        const { data: session, error: sessionError } = await supabase
          .from("chat_sessions")
          .insert({
            visitor_name: input.name,
            visitor_email: input.email || null,
          })
          .select("id")
          .single();

        if (sessionError) throw sessionError;
        const id = String(session["id"]);

        const { data: message, error: messageError } = await supabase
          .from("chat_messages")
          .insert({ session_id: id, sender: "visitor", body: input.message })
          .select("*")
          .single();

        if (messageError) throw messageError;

        writeStoredSession(id);
        setMessages([message as ChatMessage]);
        setSessionId(id);
        setStatus("open");

        // Server function only rings the bell — the rows above are already written.
        void notify({
          data: {
            kind: "chat",
            sessionId: id,
            name: input.name,
            email: input.email || undefined,
            message: input.message,
          },
        }).catch(() => undefined);
      } catch (caught) {
        setError(readableError(caught));
      } finally {
        setSending(false);
      }
    },
    [notify],
  );

  const send = useCallback(
    async (body: string) => {
      if (!sessionId || body.trim() === "") return;
      setSending(true);
      setError(null);
      try {
        // .select().single() so the message appears immediately instead of
        // waiting on the realtime round trip; mergeMessage drops the echo.
        const { data: message, error: insertError } = await supabase
          .from("chat_messages")
          .insert({ session_id: sessionId, sender: "visitor", body: body.trim() })
          .select("*")
          .single();

        if (insertError) throw insertError;
        mergeMessage(message as ChatMessage);
      } catch (caught) {
        setError(readableError(caught));
      } finally {
        setSending(false);
      }
    },
    [sessionId, mergeMessage],
  );

  const reset = useCallback(() => {
    writeStoredSession(null);
    setSessionId(null);
    setMessages([]);
    setError(null);
    setStatus("new");
  }, []);

  return { status, sessionId, messages, error, sending, start, send, reset };
}
