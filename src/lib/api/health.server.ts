// Server route handler for GET /api/health.
//
// Reports what the *running* server can see, not what the repository expects.
// The most common deploy failure is pointing at a different Supabase project
// than the one whose dashboard is open, so the resolved URL is printed.

import {
  MAIL_DOMAIN,
  MAIL_FROM,
  MAIL_NOTIFY_TO,
  MAIL_REPLY_TO,
  RESEND_API_KEY,
  RESEND_API_KEY_NAMES,
  RESEND_WEBHOOK_SECRET,
  RESEND_WEBHOOK_SECRET_NAMES,
  SERVICE_ROLE_KEY,
  SERVICE_ROLE_KEY_NAMES,
  SUPABASE_ANON_KEY,
  SUPABASE_ANON_KEY_NAMES,
  SUPABASE_URL,
  SUPABASE_URL_NAMES,
  decodeWebhookSecret,
  env,
  json,
} from "./_shared.server";

type ChatReport = {
  reachable: boolean;
  detail: string;
  sessions?: number;
  messages?: number;
  latestMessageAt?: string | null;
  realtime?: string;
};

async function inspectChat(): Promise<ChatReport> {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return { reachable: false, detail: "Supabase is not configured on this server." };
  }
  try {
    const { adminClient } = await import("./_shared.server");
    const db = adminClient();

    const sessions = await db.from("chat_sessions").select("id", { count: "exact", head: true });
    if (sessions.error) {
      return {
        reachable: false,
        detail: `chat_sessions is unreadable: ${sessions.error.message}. Apply supabase/migrations/0001_init.sql.`,
      };
    }

    const messages = await db.from("chat_messages").select("id", { count: "exact", head: true });
    const latest = await db
      .from("chat_messages")
      .select("created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    return {
      reachable: true,
      detail:
        (messages.count ?? 0) > 0
          ? "Visitor messages are reaching the database. If the dashboard is not showing them, the problem is on the read side — the widget and dashboard now poll as well as subscribe, so reload both."
          : "No chat messages stored yet. If a visitor has sent one, the write is failing — check that anonymous sign-ins are enabled on this project.",
      sessions: sessions.count ?? 0,
      messages: messages.count ?? 0,
      latestMessageAt: (latest.data?.["created_at"] as string | undefined) ?? null,
      realtime:
        "Realtime is a bonus, not a requirement: both surfaces poll as a fallback, so messages arrive within a few seconds either way.",
    };
  } catch (error) {
    return { reachable: false, detail: `Could not reach the database: ${String(error)}` };
  }
}

type Check = {
  name: string;
  set: boolean;
  /** Which spelling actually supplied the value. */
  from?: string;
  /** Every accepted spelling — printed when nothing is set. */
  accepts?: string[];
  detail?: string;
};

function check(label: string, names: string[], value: string | undefined, detail?: string): Check {
  const source = names.find((name) => {
    const candidate = process.env[name];
    return typeof candidate === "string" && candidate.trim() !== "";
  });
  return {
    name: label,
    set: Boolean(value),
    ...(source ? { from: source } : { accepts: names }),
    ...(detail ? { detail } : {}),
  };
}

export async function handleHealthCheck(request: Request): Promise<Response> {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return json({ error: "Use GET." }, 405);
  }

  const webhookSecretDetail = RESEND_WEBHOOK_SECRET
    ? decodeWebhookSecret(RESEND_WEBHOOK_SECRET)
      ? "decodes to a usable key"
      : "SET BUT UNUSABLE — it does not base64-decode to a key; copy the whsec_… value from Resend again"
    : undefined;

  const checks: Check[] = [
    check("Supabase URL", SUPABASE_URL_NAMES, SUPABASE_URL, SUPABASE_URL),
    check("Supabase anon key", SUPABASE_ANON_KEY_NAMES, SUPABASE_ANON_KEY),
    check("Supabase service role key", SERVICE_ROLE_KEY_NAMES, SERVICE_ROLE_KEY),
    check(
      "Resend API key",
      RESEND_API_KEY_NAMES,
      RESEND_API_KEY,
      RESEND_API_KEY
        ? undefined
        : "unset — notification mail is skipped, everything else still works",
    ),
    check(
      "Resend webhook secret",
      RESEND_WEBHOOK_SECRET_NAMES,
      RESEND_WEBHOOK_SECRET,
      webhookSecretDetail,
    ),
    check(
      "Mail domain",
      ["MAIL_DOMAIN"],
      env(["MAIL_DOMAIN"]),
      `addresses resolve to ${MAIL_FROM} / reply-to ${MAIL_REPLY_TO} / notify ${MAIL_NOTIFY_TO}`,
    ),
  ];

  // Chat and the dashboard need Supabase; mail is optional.
  const required = checks.slice(0, 3);
  const missing = required.filter((entry) => !entry.set);

  // Whether visitor messages are actually landing in the database. This is the
  // one thing that separates "chat is broken" into a write problem or a read
  // problem, and it cannot be answered from the browser.
  const chat = await inspectChat();

  return json(
    {
      status: missing.length === 0 ? "ok" : "misconfigured",
      chat,
      supabaseProject: SUPABASE_URL ?? null,
      mailDomain: MAIL_DOMAIN,
      missing: missing.map((entry) => ({ name: entry.name, setAnyOf: entry.accepts ?? [] })),
      checks,
      hint: "Set these in Vercel → Settings → Environment Variables (Production and Preview), then redeploy. Anonymous sign-ins must be enabled on the Supabase project printed above, under Authentication → Sign In / Providers.",
    },
    missing.length === 0 ? 200 : 503,
  );
}
