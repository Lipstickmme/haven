import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";

import { useAdminAuth } from "@/hooks/useAdminAuth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Staff sign in — Blueprint Haven Architects" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const auth = useAdminAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (auth.user) void router.navigate({ to: "/admin" });
  }, [auth.user, router]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void auth.signIn(email.trim(), password);
  }

  return (
    <section className="relative flex min-h-screen items-center bg-background py-32">
      <div className="pointer-events-none absolute inset-0 plan-grid opacity-60" />
      <div className="relative mx-auto w-full max-w-md px-5 md:px-10">
        <p className="eyebrow text-accent">Blueprint Haven</p>
        <h1 className="mt-4 font-display text-4xl">Staff sign in</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          For the studio dashboard. Visitors do not need an account — the chat widget signs itself
          in anonymously.
        </p>

        <form onSubmit={onSubmit} className="mt-10 space-y-8">
          <div>
            <label htmlFor="email" className="eyebrow text-muted-foreground">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-3 w-full border-b border-border bg-transparent pb-3 text-lg outline-none transition-colors focus:border-accent"
            />
          </div>
          <div>
            <label htmlFor="password" className="eyebrow text-muted-foreground">
              Password
            </label>
            <input
              id="password"
              name="password"
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
            disabled={auth.loading || !auth.configured}
            className="eyebrow w-full bg-primary px-9 py-4 text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-40"
          >
            {auth.loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </section>
  );
}
