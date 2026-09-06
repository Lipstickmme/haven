import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent, type ReactNode } from "react";

import { BookingsTab } from "@/components/admin/BookingsTab";
import { ChatTab } from "@/components/admin/ChatTab";
import { EmailTab } from "@/components/admin/EmailTab";
import { EnquiriesTab } from "@/components/admin/EnquiriesTab";
import { useAdminAuth, type AdminAuth } from "@/hooks/useAdminAuth";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Studio dashboard — Blueprint Haven Architects" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const TABS = [
  { id: "enquiries", label: "Enquiries" },
  { id: "chat", label: "Live chat" },
  { id: "email", label: "Email" },
  { id: "bookings", label: "Bookings" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function AdminPage() {
  const auth = useAdminAuth();

  if (!auth.configured) return <Gate title="Dashboard unavailable" body={auth.error} />;
  if (auth.loading) return <Gate title="Checking your session…" />;
  if (!auth.user) return <SignIn auth={auth} />;
  if (!auth.isAdmin) {
    return (
      <Gate
        title="Not on the admin list"
        body={`You are signed in as ${auth.user.email ?? "this account"}, but it has not been granted staff access. Edit supabase/grant-admin.sql with that address and run it in the Supabase SQL editor.`}
        action={
          <button
            type="button"
            onClick={() => void auth.signOut()}
            className="eyebrow mt-8 border border-border px-6 py-3 transition-colors hover:border-accent hover:text-accent"
          >
            Sign out
          </button>
        }
      />
    );
  }

  return <Dashboard email={auth.user.email ?? ""} onSignOut={() => void auth.signOut()} />;
}

function Dashboard({ email, onSignOut }: { email: string; onSignOut: () => void }) {
  const [tab, setTab] = useState<TabId>("enquiries");

  return (
    <section className="min-h-screen bg-background pb-24 pt-32">
      <div className="mx-auto max-w-[92rem] px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-accent">Studio dashboard</p>
            <h1 className="mt-3 font-display text-4xl">Everything coming in</h1>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">{email}</p>
            <button
              type="button"
              onClick={onSignOut}
              className="eyebrow mt-2 text-muted-foreground transition-colors hover:text-accent"
            >
              Sign out
            </button>
          </div>
        </div>

        <div
          role="tablist"
          aria-label="Dashboard sections"
          className="mt-10 flex flex-wrap gap-8 border-b border-border"
        >
          {TABS.map((entry) => (
            <button
              key={entry.id}
              type="button"
              role="tab"
              aria-selected={tab === entry.id}
              onClick={() => setTab(entry.id)}
              className={`eyebrow -mb-px border-b-2 pb-4 transition-colors ${
                tab === entry.id
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {entry.label}
            </button>
          ))}
        </div>

        <div className="mt-10">
          {tab === "enquiries" ? <EnquiriesTab enabled /> : null}
          {tab === "chat" ? <ChatTab enabled /> : null}
          {tab === "email" ? <EmailTab enabled /> : null}
          {tab === "bookings" ? <BookingsTab enabled /> : null}
        </div>
      </div>
    </section>
  );
}

function Gate({
  title,
  body,
  action,
}: {
  title: string;
  body?: string | null;
  action?: ReactNode;
}) {
  return (
    <section className="flex min-h-screen items-center bg-background py-32">
      <div className="mx-auto max-w-xl px-5 md:px-10">
        <p className="eyebrow text-accent">Studio dashboard</p>
        <h1 className="mt-4 font-display text-4xl">{title}</h1>
        {body ? <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{body}</p> : null}
        {action}
      </div>
    </section>
  );
}

/** Signed out: the gate renders the login itself rather than redirecting.
 *  It takes the caller's auth instance — a second `useAdminAuth()` here would
 *  open a second auth listener and hold its own copy of the same state. */
function SignIn({ auth }: { auth: AdminAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void auth.signIn(email.trim(), password);
  }

  return (
    <section className="flex min-h-screen items-center bg-background py-32">
      <div className="mx-auto w-full max-w-md px-5 md:px-10">
        <p className="eyebrow text-accent">Studio dashboard</p>
        <h1 className="mt-4 font-display text-4xl">Sign in</h1>

        <form onSubmit={onSubmit} className="mt-10 space-y-8">
          <div>
            <label htmlFor="admin-email" className="eyebrow text-muted-foreground">
              Email address
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-3 w-full border-b border-border bg-transparent pb-3 text-lg outline-none transition-colors focus:border-accent"
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="eyebrow text-muted-foreground">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-3 w-full border-b border-border bg-transparent pb-3 text-lg outline-none transition-colors focus:border-accent"
            />
          </div>

          {auth.error ? <p className="text-sm text-destructive">{auth.error}</p> : null}

          <button
            type="submit"
            disabled={auth.loading}
            className="eyebrow w-full bg-primary px-9 py-4 text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-40"
          >
            {auth.loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </section>
  );
}
