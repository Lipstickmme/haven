import { useEffect, useRef, useState, type FormEvent } from "react";

import { useRealtimeRows } from "@/hooks/useRealtimeRows";
import { ITEM_STATUSES, type ChatMessage, type ChatSession } from "@/lib/database.types";
import { supabase } from "@/lib/supabase";

import {
  EmptyState,
  ListDetail,
  ListRow,
  PanelError,
  StatusSelect,
  formatWhen,
} from "./primitives";

export function ChatTab({ enabled }: { enabled: boolean }) {
  const { rows, loading, error } = useRealtimeRows<ChatSession>("chat_sessions", {
    orderBy: "last_message_at",
    enabled,
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = rows.find((row) => row.id === selectedId) ?? rows[0] ?? null;

  return (
    <div className="space-y-4">
      <PanelError message={error} />
      <ListDetail
        list={
          loading ? (
            <EmptyState>Loading conversations…</EmptyState>
          ) : rows.length === 0 ? (
            <EmptyState>No conversations yet.</EmptyState>
          ) : (
            rows.map((row) => (
              <ListRow
                key={row.id}
                active={selected?.id === row.id}
                onSelect={() => setSelectedId(row.id)}
                title={row.visitor_name || "Anonymous visitor"}
                subtitle={row.visitor_email || "no email given"}
                meta={formatWhen(row.last_message_at)}
                status={row.status}
              />
            ))
          )
        }
        detail={
          selected ? (
            <Conversation key={selected.id} session={selected} enabled={enabled} />
          ) : (
            <EmptyState>Select a conversation.</EmptyState>
          )
        }
      />
    </div>
  );
}

function Conversation({ session, enabled }: { session: ChatSession; enabled: boolean }) {
  const { rows: messages, error } = useRealtimeRows<ChatMessage>("chat_messages", {
    orderBy: "created_at",
    ascending: true,
    enabled,
    filter: { column: "session_id", value: session.id },
  });

  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const threadRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = draft.trim();
    if (!body || sending) return;

    setSending(true);
    setSendError(null);
    void (async () => {
      // RLS lets an admin post only as 'agent'; the trigger leaves the status
      // alone for agent replies, so answering does not reopen a closed thread.
      const { error: insertError } = await supabase
        .from("chat_messages")
        .insert({ session_id: session.id, sender: "agent", body });
      if (insertError) setSendError(insertError.message);
      else setDraft("");
      setSending(false);
    })();
  }

  return (
    <div className="flex h-full min-h-[24rem] flex-col">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-6">
        <div>
          <h3 className="font-display text-2xl">{session.visitor_name || "Anonymous visitor"}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {session.visitor_email || "no email given"} · started {formatWhen(session.created_at)}
          </p>
        </div>
        <StatusSelect
          table="chat_sessions"
          id={session.id}
          value={session.status}
          options={ITEM_STATUSES}
        />
      </div>

      <PanelError message={error ?? sendError} />

      <div ref={threadRef} className="flex-1 space-y-3 overflow-y-auto p-6">
        {messages.length === 0 ? (
          <p className="text-sm text-muted-foreground">No messages.</p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={
                message.sender === "agent"
                  ? "ml-auto max-w-[80%] bg-primary px-4 py-2.5 text-sm text-primary-foreground"
                  : "mr-auto max-w-[80%] bg-secondary px-4 py-2.5 text-sm text-secondary-foreground"
              }
            >
              <p className="whitespace-pre-wrap break-words">{message.body}</p>
              <p className="mt-1 text-[0.625rem] uppercase tracking-widest opacity-60">
                {formatWhen(message.created_at)}
              </p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={onSubmit} className="flex items-end gap-3 border-t border-border p-4">
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          rows={2}
          maxLength={4000}
          placeholder="Reply as the studio"
          aria-label="Reply"
          className="min-w-0 flex-1 resize-none border-b border-border bg-transparent px-1 py-2 text-sm outline-none transition-colors focus:border-accent"
        />
        <button
          type="submit"
          disabled={sending || draft.trim() === ""}
          className="eyebrow shrink-0 bg-primary px-5 py-3 text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-40"
        >
          {sending ? "Sending…" : "Send"}
        </button>
      </form>
    </div>
  );
}
