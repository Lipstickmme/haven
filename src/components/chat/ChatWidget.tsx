import { MessageSquare, Send, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";

import { useVisitorChat } from "@/hooks/useVisitorChat";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const chat = useVisitorChat();
  const [draft, setDraft] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [intro, setIntro] = useState("");
  const threadRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: "smooth" });
  }, [chat.messages.length, open]);

  function onStart(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void chat.start({ name: name.trim(), email: email.trim(), message: intro.trim() });
  }

  function onSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = draft.trim();
    if (!body) return;
    setDraft("");
    void chat.send(body);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close chat" : "Chat with the studio"}
        aria-expanded={open}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center bg-primary text-primary-foreground shadow-lg transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        {open ? <X size={20} strokeWidth={1.5} /> : <MessageSquare size={20} strokeWidth={1.5} />}
      </button>

      {open ? (
        <div className="fixed bottom-24 right-6 z-50 flex h-[30rem] w-[min(22rem,calc(100vw-3rem))] flex-col border border-border bg-card shadow-2xl">
          <header className="border-b border-border px-5 py-4">
            <p className="eyebrow text-accent">Blueprint Haven</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {chat.status === "open"
                ? "We usually reply within a working day."
                : "Tell us who you are and we'll pick it up from here."}
            </p>
          </header>

          {chat.error ? (
            <p className="border-b border-border bg-secondary px-5 py-3 text-xs leading-relaxed text-muted-foreground">
              {chat.error}
            </p>
          ) : null}

          {chat.status === "loading" ? (
            <p className="flex-1 px-5 py-6 text-sm text-muted-foreground">Loading…</p>
          ) : chat.status === "open" ? (
            <>
              <div ref={threadRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
                {chat.messages.map((message) => (
                  <div
                    key={message.id}
                    className={
                      message.sender === "visitor"
                        ? "ml-auto max-w-[85%] bg-primary px-4 py-2.5 text-sm text-primary-foreground"
                        : "mr-auto max-w-[85%] bg-secondary px-4 py-2.5 text-sm text-secondary-foreground"
                    }
                  >
                    <p className="whitespace-pre-wrap break-words">{message.body}</p>
                  </div>
                ))}
              </div>

              <form
                onSubmit={onSend}
                className="flex items-center gap-2 border-t border-border p-3"
              >
                <input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Write a message"
                  maxLength={4000}
                  aria-label="Message"
                  className="min-w-0 flex-1 border-b border-border bg-transparent px-1 py-2 text-sm outline-none transition-colors focus:border-accent"
                />
                <button
                  type="submit"
                  disabled={chat.sending || draft.trim() === ""}
                  aria-label="Send message"
                  className="flex h-9 w-9 shrink-0 items-center justify-center bg-primary text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-40"
                >
                  <Send size={15} strokeWidth={1.6} />
                </button>
              </form>
            </>
          ) : (
            <form onSubmit={onStart} className="flex flex-1 flex-col gap-4 overflow-y-auto p-5">
              <div>
                <label htmlFor="chat-name" className="eyebrow text-muted-foreground">
                  Your name
                </label>
                <input
                  id="chat-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  maxLength={200}
                  className="mt-2 w-full border-b border-border bg-transparent pb-2 text-sm outline-none transition-colors focus:border-accent"
                />
              </div>
              <div>
                <label htmlFor="chat-email" className="eyebrow text-muted-foreground">
                  Email (optional)
                </label>
                <input
                  id="chat-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  maxLength={320}
                  className="mt-2 w-full border-b border-border bg-transparent pb-2 text-sm outline-none transition-colors focus:border-accent"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="chat-intro" className="eyebrow text-muted-foreground">
                  Message
                </label>
                <textarea
                  id="chat-intro"
                  value={intro}
                  onChange={(event) => setIntro(event.target.value)}
                  required
                  rows={4}
                  maxLength={4000}
                  className="mt-2 w-full resize-none border-b border-border bg-transparent pb-2 text-sm outline-none transition-colors focus:border-accent"
                />
              </div>
              <button
                type="submit"
                disabled={chat.sending || chat.status === "error"}
                className="eyebrow bg-primary px-6 py-3 text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-40"
              >
                {chat.sending ? "Starting…" : "Start chat"}
              </button>
            </form>
          )}
        </div>
      ) : null}
    </>
  );
}
