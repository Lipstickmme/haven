import { createServerFn } from "@tanstack/react-start";

/**
 * The browser's Supabase config is served at runtime from the root route's
 * loader, not inlined at build time behind a `VITE_` prefix. That way the same
 * build works against any project, and connecting Vercel's Supabase
 * integration is enough on its own — no rebuild, no extra variables to copy.
 */
export type PublicConfig = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  /** Groups of accepted spellings that are all unset. Empty when configured. */
  missing: Array<{ label: string; names: string[] }>;
};

export const PUBLIC_URL_NAMES = ["SUPABASE_URL", "VITE_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_URL"];

export const PUBLIC_ANON_KEY_NAMES = [
  "SUPABASE_ANON_KEY",
  "VITE_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_PUBLISHABLE_KEY",
  "VITE_SUPABASE_PUBLISHABLE_KEY",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
];

export const loadPublicConfig = createServerFn({ method: "GET" }).handler(
  async (): Promise<PublicConfig> => {
    const first = (names: string[]) => {
      for (const name of names) {
        const value = process.env[name];
        if (typeof value === "string" && value.trim() !== "") return value.trim();
      }
      return "";
    };

    const supabaseUrl = first(PUBLIC_URL_NAMES);
    const supabaseAnonKey = first(PUBLIC_ANON_KEY_NAMES);

    return {
      supabaseUrl,
      supabaseAnonKey,
      missing: [
        ...(supabaseUrl ? [] : [{ label: "Supabase project URL", names: PUBLIC_URL_NAMES }]),
        ...(supabaseAnonKey
          ? []
          : [{ label: "Supabase anon / publishable key", names: PUBLIC_ANON_KEY_NAMES }]),
      ],
    };
  },
);

// ---------------------------------------------------------------------------
// Module-level store.
//
// The root route sets this during render, before any child mounts, so anything
// reaching for `supabase` already has real values. It lives at module scope
// rather than in React context because non-component code (the Supabase proxy,
// the auth middleware) has to read it too.
// ---------------------------------------------------------------------------

let current: PublicConfig | undefined;

export function setPublicConfig(config: PublicConfig): void {
  current = config;
}

export function getPublicConfig(): PublicConfig | undefined {
  return current;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(current?.supabaseUrl && current.supabaseAnonKey);
}
