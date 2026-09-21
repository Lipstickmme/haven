import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useState } from "react";

import type { ChatMessage } from "@/lib/database.types";
import { submitForm } from "@/lib/api/forms";
import { describeError } from "@/lib/readable-error";
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
  send: (body: string) => Promise<boolean>;
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

const UNREACHABLE =
  "Live chat could not reach the database, so that message was not sent. This is usually the Supabase project being paused or asleep. /api/health shows which project this deployment points at.";

const REFUSED =
  "We could not save that message. Live chat is not set up correctly on this site, which is our problem rather than yours. Please email us or use the contact form and we will pick it up there.";

/** The shared reader, plus the failures worth naming their own fix for. */
export function readableError(error: unknown): string {
  const { message, kind, hint, code } = describeError(error);
  if (kind === "anonymous-disabled") return ANON_DISABLED;
  if (kind === "network") return UNREACHABLE;
  if (kind === "unconfigured") return message;

  // A visitor cannot act on "new row violates row-level security policy", and
  // should not have to read it. Whoever runs the site can: put the real reason
  // where they will find it and point at the page that names the fix.
  if (code === "42501" || /row-level security|permission denied/i.test(message)) {
    console.error(
      `[chat] the database refused the write: ${message}${hint ? ` — ${hint}` : ""}${code ? ` (${code})` : ""}\n` +
        "[chat] /api/health reports which policy is missing; it is usually chat_messages_visitor_insert, restored by re-running supabase/migrations/0001_init.sql.",
    );
    return REFUSED;
  }

  const suffix = [hint, code ? `(${code})` : ""].filter(Boolean).join(" ");
  return suffix ? `${message} ${suffix}` : message;
}

async function sessionIsLost(sessionId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("chat_sessions")
    .select("id")
    .eq("id", sessionId)
    .maybeSingle();
  if (error) return false;
  return data === null;
}

/** Signs in anonymously, reusing an existing session rather than making a new
 *  user on every reload. Every chat row then carries a real `auth.uid()`. */
async function ensureVisitorSession(): Promise<string> {
  const { data: existing } = await supabase.auth.getSession();
  if (existing.session?.user) {
    armRealtime(existing.session.access_token);
    return existing.session.user.id;
  }

  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  if (!data.user) throw new Error("Supabase returned no user for the anonymous sign-in.");
  armRealtime(data.session?.access_token);
  return data.user.id;
}

/**
 * Hand the access token to the realtime socket.
 *
 * postgres_changes on an RLS-protected table are filtered against the socket's
 * own JWT, not the REST one. supabase-js normally syncs this on auth state
 * change, but the client here is built lazily on first access, so the sign-in
 * can land before anything is listening. Setting it outright is cheap.
 */
function armRealtime(token: string | undefined): void {
  if (!token) return;
  try {
    supabase.realtime.setAuth(token);
  } catch {
    /* older clients sync this themselves */
  }
}

export function useVisitorChat(): VisitorChat {
  const [status, setStatus] = useState<ChatStatus>("loading");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [live, setLive] = useState(false);

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

  const syncMessages = useCallback(
    async (id: string) => {
      const { data, error: readError } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("session_id", id)
        .order("created_at", { ascending: true });
      if (readError) return;
      for (const row of (data ?? []) as ChatMessage[]) mergeMessage(row);
    },
    [mergeMessage],
  );

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
      // A silent .subscribe() hides CHANNEL_ERROR and TIMED_OUT, which is how a
      // thread ends up looking connected while no reply ever arrives.
      .subscribe((status, err) => {
        setLive(status === "SUBSCRIBED");
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.warn(`[realtime] chat channel ${status}`, err ?? "");
        }
        if (status === "SUBSCRIBED") void syncMessages(sessionId);
      });

    return () => {
      setLive(false);
      void supabase.removeChannel(channel);
    };
  }, [sessionId, mergeMessage, syncMessages]);

  // Poll as well: slowly while the channel is up, quickly when it is not, so a
  // staff reply still lands even where realtime is unavailable.
  useEffect(() => {
    if (!sessionId || !isSupabaseConfigured()) return;
    const id = setInterval(() => void syncMessages(sessionId), live ? 20000 : 4000);
    return () => clearInterval(id);
  }, [sessionId, live, syncMessages]);

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
    async (body: string): Promise<boolean> => {
      if (!sessionId || body.trim() === "") return false;
      setSending(true);
      setError(null);
      try {
        // The conversation is restored from localStorage, which outlives the
        // access token. Without this the insert can go out unauthenticated and
        // be refused by RLS for a reason that reads like a bug in the chat.
        await ensureVisitorSession();

        // .select().single() so the message appears immediately instead of
        // waiting on the realtime round trip; mergeMessage drops the echo.
        const { data: message, error: insertError } = await supabase
          .from("chat_messages")
          .insert({ session_id: sessionId, sender: "visitor", body: body.trim() })
          .select("*")
          .single();

        if (insertError) throw insertError;
        mergeMessage(message as ChatMessage);
        return true;
      } catch (caught) {
        // Order matters. A request that never completed says nothing about who
        // owns the conversation, and asking the database about it is both
        // pointless and liable to answer "gone" for the same reason the write
        // failed. Only a refusal is worth investigating.
        const { kind, code, message } = describeError(caught);
        const refused =
          kind !== "network" &&
          (code === "42501" ||
            code === "PGRST301" ||
            /row-level security|permission denied|not authorized|jwt/i.test(message));

        if (refused && (await sessionIsLost(sessionId))) {
          writeStoredSession(null);
          setSessionId(null);
          setMessages([]);
          setStatus("new");
          setError(
            "That conversation is no longer open on this browser. Your message was not sent; start a new one below and it will reach us.",
          );
          return false;
        }
        setError(readableError(caught));
        return false;
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
