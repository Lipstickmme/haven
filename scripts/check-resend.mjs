#!/usr/bin/env node
// Checks the Resend configuration end to end, against the real API.
//
//   node scripts/check-resend.mjs                 # read-only checks
//   node scripts/check-resend.mjs you@gmail.com   # also sends one real email
//
// Reads the same variable names the app reads, in the same order. Pass them in
// however you like:
//
//   RESEND_API_KEY=re_... MAIL_DOMAIN=meastroarchitecture.com \
//     node scripts/check-resend.mjs you@gmail.com
//
// Or pull them straight out of the deployment, which is the version worth
// trusting because it tests what Vercel actually has:
//
//   vercel env pull .env.local && node --env-file=.env.local scripts/check-resend.mjs you@gmail.com
//
// Nothing is written and no secret is printed.

const pick = (...names) => {
  for (const n of names) {
    const v = process.env[n];
    if (typeof v === "string" && v.trim() !== "") return { name: n, value: v.trim() };
  }
  return null;
};

const apiKey = pick("RESEND_API_KEY");
const webhookSecret = pick("RESEND_WEBHOOK_SECRET", "RESEND_SIGNING_SECRET");
const domain = pick("MAIL_DOMAIN");
const MAIL_DOMAIN = domain?.value ?? "example.com";
const MAIL_FROM = pick("MAIL_FROM")?.value ?? `Meastro Architecture <no-reply@${MAIL_DOMAIN}>`;
const MAIL_REPLY_TO = pick("MAIL_REPLY_TO")?.value ?? `hello@${MAIL_DOMAIN}`;
const MAIL_NOTIFY_TO = pick("MAIL_NOTIFY_TO", "NOTIFY_TO", "STAFF_EMAIL")?.value ?? MAIL_REPLY_TO;

/** A newline inside an address is a broken header, not just a bad address. */
const addressIssue = (value) => {
  const trimmed = value.replace(/^[\s\r\n]+|[\s\r\n]+$/g, "");
  if (/[\r\n]/.test(trimmed)) {
    const lines = trimmed
      .split(/[\r\n]+/)
      .map((l) => l.trim())
      .filter(Boolean);
    return new Set(lines).size === 1
      ? `holds the same address ${lines.length} times on separate lines; it should be one line`
      : `holds ${lines.length} addresses on separate lines; it should be one`;
  }
  const bare = (/<([^>]*)>/.exec(trimmed)?.[1] ?? trimmed).trim();
  if (!bare) return "is empty";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bare)) return `is not an email address: ${bare}`;
  return null;
};

const out = [];
let failed = 0;
const say = (s = "") => out.push(s);
const good = (s) => say(`  ok    ${s}`);
const bad = (s) => {
  failed++;
  say(`  FAIL  ${s}`);
};
const warn = (s) => say(`  note  ${s}`);

const fromAddress = (/<([^>]+)>/.exec(MAIL_FROM)?.[1] ?? MAIL_FROM).trim();

say("\nAddresses these settings resolve to");
say(`  from        ${MAIL_FROM}`);
say(`  reply-to    ${MAIL_REPLY_TO}`);
say(
  `  notify-to   ${MAIL_NOTIFY_TO}${pick("MAIL_NOTIFY_TO", "NOTIFY_TO", "STAFF_EMAIL") ? "" : "   (defaulted from reply-to)"}`,
);
say("");

say("Configuration");
if (!domain)
  warn(`MAIL_DOMAIN is unset, so addresses fall back to ${MAIL_DOMAIN}, which will not send`);
else good(`MAIL_DOMAIN is ${MAIL_DOMAIN}`);

if (!apiKey)
  bad("RESEND_API_KEY is unset, so no mail is sent at all (the app logs and carries on)");
else if (!apiKey.value.startsWith("re_"))
  bad("RESEND_API_KEY does not start with re_, which every Resend key does");
else good(`RESEND_API_KEY is set (${apiKey.name})`);

if (!webhookSecret)
  warn("RESEND_WEBHOOK_SECRET is unset, which only matters if you want to receive mail");
else if (webhookSecret.value.startsWith("re_"))
  bad(
    "RESEND_WEBHOOK_SECRET holds a Resend API key. The signing secret starts whsec_ and lives on the inbound endpoint, not the API keys page",
  );
else if (!webhookSecret.value.startsWith("whsec_"))
  bad("RESEND_WEBHOOK_SECRET does not start with whsec_, so it is probably the wrong value");
else {
  const bytes = Buffer.from(webhookSecret.value.slice(6), "base64").length;
  if (bytes < 16)
    bad(`RESEND_WEBHOOK_SECRET decodes to only ${bytes} bytes, so it looks truncated`);
  else good(`RESEND_WEBHOOK_SECRET looks right (whsec_, ${bytes} bytes)`);
}

for (const [name, value] of [
  ["MAIL_FROM", MAIL_FROM],
  ["MAIL_REPLY_TO", MAIL_REPLY_TO],
  ["MAIL_NOTIFY_TO", MAIL_NOTIFY_TO],
]) {
  const issue = addressIssue(value);
  if (issue) bad(`${name} ${issue}`);
}

if (MAIL_NOTIFY_TO.endsWith(`@${MAIL_DOMAIN}`)) {
  warn(
    `MAIL_NOTIFY_TO is on ${MAIL_DOMAIN}. If that address forwards into /api/inbound-email, notifications loop until the quota is gone. Point it at a mailbox outside the domain if you are unsure`,
  );
} else {
  good(`MAIL_NOTIFY_TO is outside ${MAIL_DOMAIN}, so notifications cannot loop`);
}

if (!fromAddress.endsWith(`@${MAIL_DOMAIN}`)) {
  warn(
    `MAIL_FROM sends as ${fromAddress}, which is not on ${MAIL_DOMAIN}. Resend will reject it unless that domain is verified too`,
  );
}

// --- live checks against the API ------------------------------------------
async function resend(path, init) {
  const res = await fetch(`https://api.resend.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey.value}`,
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const body = await res.json().catch(() => null);
  return { status: res.status, ok: res.ok, body };
}

if (apiKey) {
  say("\nAgainst the Resend API");
  const domains = await resend("/domains", { method: "GET" }).catch((e) => ({
    status: 0,
    ok: false,
    body: { message: String(e) },
  }));

  if (domains.status === 401 || domains.status === 403) {
    bad(
      `the API key was rejected (${domains.status}: ${domains.body?.message ?? "no reason given"})`,
    );
  } else if (!domains.ok) {
    bad(
      `could not list domains (${domains.status}: ${domains.body?.message ?? "no reason given"})`,
    );
  } else {
    good("the API key is accepted");
    const list = domains.body?.data ?? [];
    if (!list.length) bad("no domains on this Resend account, so nothing can be sent yet");
    const match = list.find((d) => d.name === MAIL_DOMAIN);
    if (!match) {
      bad(
        `${MAIL_DOMAIN} is not on this account. Domains present: ${list.map((d) => d.name).join(", ") || "none"}`,
      );
    } else if (match.status !== "verified") {
      bad(
        `${MAIL_DOMAIN} is on the account but its status is "${match.status}", not "verified". Sending will fail until the DNS records are in`,
      );
    } else {
      good(`${MAIL_DOMAIN} is verified${match.region ? ` (region ${match.region})` : ""}`);
    }
  }

  const to = process.argv[2];
  if (to) {
    say("\nSending one real email");
    const send = await resend("/emails", {
      method: "POST",
      body: JSON.stringify({
        from: MAIL_FROM,
        to: [to],
        reply_to: MAIL_REPLY_TO,
        subject: "Meastro Architecture: Resend configuration test",
        html: `<p>This is the test sent by <code>scripts/check-resend.mjs</code>.</p>
               <p>If it reached you, sending works with these settings:</p>
               <ul>
                 <li>from: ${MAIL_FROM}</li>
                 <li>reply-to: ${MAIL_REPLY_TO}</li>
                 <li>notify-to: ${MAIL_NOTIFY_TO}</li>
               </ul>
               <p>Hit reply. It should arrive at ${MAIL_REPLY_TO}.</p>`,
        text: `Test from scripts/check-resend.mjs. from=${MAIL_FROM} reply-to=${MAIL_REPLY_TO} notify-to=${MAIL_NOTIFY_TO}`,
      }),
    }).catch((e) => ({ status: 0, ok: false, body: { message: String(e) } }));

    if (send.ok) {
      good(`accepted by Resend, id ${send.body?.id}`);
      say(`        Now check two things: that it arrives at ${to}, and that it is not in spam.`);
      say(`        Then reply to it and check the reply reaches ${MAIL_REPLY_TO}.`);
    } else {
      bad(`Resend rejected the send (${send.status}): ${send.body?.message ?? "no reason given"}`);
    }
  } else {
    say(
      "\n  note  pass an address to send a real test email, e.g. node scripts/check-resend.mjs you@gmail.com",
    );
  }
}

say("");
say(failed ? `${failed} problem(s) found.` : "No problems found.");
say("");
console.log(out.join("\n"));
process.exit(failed ? 1 : 0);
