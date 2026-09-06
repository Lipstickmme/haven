import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { type ReactNode } from "react";

import appCss from "../styles.css?url";
import { loadPublicConfig, setPublicConfig, type PublicConfig } from "../lib/public-config";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ScrollUp } from "@/components/site/ScrollUp";
import { ChatWidget } from "@/components/chat/ChatWidget";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  // The browser's Supabase config is delivered at runtime, from here — never
  // inlined at build time behind a VITE_ prefix. One build, any project.
  loader: () => loadPublicConfig(),
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Blueprint Haven Architects" },
      {
        name: "description",
        content: "Architecture and interior design studio based in Rochester, New York.",
      },
      { name: "author", content: "Blueprint Haven Architects" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&family=Jost:wght@300;400;500;600&display=swap",
      },
      // SVG first for modern browsers; .ico is the fallback Windows/older UAs want.
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "icon", href: "/favicon.ico", sizes: "48x48" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function ConfigNotice({ missing }: { missing: PublicConfig["missing"] }) {
  // Ink, not the light secondary: the header is fixed and transparent at the
  // top of the page, and its link colour is built for a dark backdrop. The
  // pt-28 clears the header's own height so the two do not collide.
  return (
    <div className="border-b border-ink-foreground/15 bg-ink px-5 pb-6 pt-28 text-sm text-ink-foreground md:px-10">
      <p className="font-medium">
        Chat, the contact form and the dashboard are switched off: this deployment has no Supabase
        configuration.
      </p>
      <ul className="mt-2 space-y-1 text-ink-foreground/60">
        {missing.map((entry) => (
          <li key={entry.label}>
            <span className="text-ink-foreground">{entry.label}</span> — set any one of{" "}
            <code className="text-xs">{entry.names.join(", ")}</code>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-ink-foreground/60">
        Add them in Vercel → Settings → Environment Variables and redeploy.{" "}
        <a href="/api/health" className="text-accent link-underline">
          /api/health
        </a>{" "}
        shows what the running server can see.
      </p>
    </div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const config = Route.useLoaderData();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  // Set before any child renders, so anything reaching for `supabase` during
  // its first mount already has real values. Module scope, not context: the
  // Supabase proxy and the server-function middleware read it too, and neither
  // is a component.
  setPublicConfig(config);

  // Staff surfaces do not get the visitor widget. Everywhere else it renders
  // unconditionally — when Supabase is unconfigured the panel says so, rather
  // than the launcher quietly not existing.
  const showChat = !(pathname.startsWith("/admin") || pathname.startsWith("/auth"));

  return (
    <QueryClientProvider client={queryClient}>
      {config.missing.length > 0 ? <ConfigNotice missing={config.missing} /> : null}
      <Header />
      <main>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </main>
      <Footer />
      <ScrollUp />
      {showChat ? <ChatWidget /> : null}
    </QueryClientProvider>
  );
}
