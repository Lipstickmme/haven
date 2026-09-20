// Run with:  node --experimental-strip-types --no-warnings scripts/resend.test.mts
// Drives the real sendEmail() and verifyResendWebhook() from _shared.server.ts.
// api.resend.com is unreachable from this container, so requests to it are
// redirected to a local stand-in that answers exactly as Resend does.
import { createHmac, randomUUID } from "node:crypto";
import { createServer } from "node:http";

const MOD = new URL("../src/lib/api/_shared.server.ts", import.meta.url).pathname;

let pass = 0, fail = 0;
const ok = (name: string, cond: boolean, detail = "") => {
  if (cond) { pass++; console.log(`  PASS  ${name}`); }
  else { fail++; console.log(`  FAIL  ${name}${detail ? "  :: " + detail : ""}`); }
};

// ---- the stand-in for api.resend.com -------------------------------------
type Captured = { auth: string; contentType: string; body: any };
let captured: Captured | null = null;
let nextStatus = 200;
let nextBody: any = { id: "re_stub_0000" };

const server = createServer((req, res) => {
  let raw = "";
  req.on("data", (c) => (raw += c));
  req.on("end", () => {
    captured = {
      auth: req.headers["authorization"] ?? "",
      contentType: req.headers["content-type"] ?? "",
      body: JSON.parse(raw || "{}"),
    };
    res.writeHead(nextStatus, { "content-type": "application/json" });
    res.end(JSON.stringify(nextBody));
  });
});
await new Promise<void>((r) => server.listen(0, "127.0.0.1", r));
const port = (server.address() as any).port;

const realFetch = globalThis.fetch;
globalThis.fetch = ((input: any, init?: any) => {
  const url = typeof input === "string" ? input : input.url;
  if (url.startsWith("https://api.resend.com")) {
    return realFetch(url.replace("https://api.resend.com", `http://127.0.0.1:${port}`), init);
  }
  return realFetch(input, init);
}) as typeof fetch;

// Each scenario needs a fresh module load: the env is read at import time.
let bust = 0;
async function load(env: Record<string, string | undefined>) {
  for (const k of ["RESEND_API_KEY","RESEND_WEBHOOK_SECRET","RESEND_SIGNING_SECRET",
                   "MAIL_DOMAIN","MAIL_FROM","MAIL_REPLY_TO","MAIL_NOTIFY_TO","NOTIFY_TO","STAFF_EMAIL"]) {
    delete process.env[k];
  }
  for (const [k, v] of Object.entries(env)) if (v !== undefined) process.env[k] = v;
  return import(`${MOD}?v=${bust++}`);
}

const DOMAIN = "meastroarchitecture.com";

// ---------------------------------------------------------------------------
console.log("\n1. Address resolution from MAIL_DOMAIN alone");
{
  const m = await load({ MAIL_DOMAIN: DOMAIN });
  ok("MAIL_DOMAIN is read", m.MAIL_DOMAIN === DOMAIN, m.MAIL_DOMAIN);
  ok(`MAIL_FROM defaults to no-reply@${DOMAIN}`,
     m.MAIL_FROM === `Meastro Architecture <no-reply@${DOMAIN}>`, m.MAIL_FROM);
  ok(`MAIL_REPLY_TO defaults to hello@${DOMAIN}`,
     m.MAIL_REPLY_TO === `hello@${DOMAIN}`, m.MAIL_REPLY_TO);
  ok("MAIL_NOTIFY_TO falls back to MAIL_REPLY_TO",
     m.MAIL_NOTIFY_TO === m.MAIL_REPLY_TO, m.MAIL_NOTIFY_TO);
  console.log(`        -> mail would be sent from "${m.MAIL_FROM}", replies to ${m.MAIL_REPLY_TO}, notifications to ${m.MAIL_NOTIFY_TO}`);
}

console.log("\n2. Address resolution with every variable set");
{
  const m = await load({
    MAIL_DOMAIN: DOMAIN,
    MAIL_FROM: `Meastro Architecture <studio@${DOMAIN}>`,
    MAIL_REPLY_TO: `frontdesk@${DOMAIN}`,
    MAIL_NOTIFY_TO: "someone@gmail.com",
  });
  ok("MAIL_FROM override wins", m.MAIL_FROM === `Meastro Architecture <studio@${DOMAIN}>`, m.MAIL_FROM);
  ok("MAIL_REPLY_TO override wins", m.MAIL_REPLY_TO === `frontdesk@${DOMAIN}`, m.MAIL_REPLY_TO);
  ok("MAIL_NOTIFY_TO override wins", m.MAIL_NOTIFY_TO === "someone@gmail.com", m.MAIL_NOTIFY_TO);
}
{
  const m = await load({ MAIL_DOMAIN: DOMAIN, STAFF_EMAIL: "staff@gmail.com" });
  ok("STAFF_EMAIL is accepted as an alias for MAIL_NOTIFY_TO",
     m.MAIL_NOTIFY_TO === "staff@gmail.com", m.MAIL_NOTIFY_TO);
}

console.log("\n3. sendEmail with no key: skips, does not throw");
{
  const m = await load({ MAIL_DOMAIN: DOMAIN });
  captured = null;
  const id = await m.sendEmail({ to: "a@b.com", subject: "Test", html: "<p>x</p>" });
  ok("returns null instead of throwing", id === null);
  ok("no request was made", captured === null);
}

console.log("\n4. sendEmail with a key: the request Resend actually receives");
{
  const m = await load({ MAIL_DOMAIN: DOMAIN, RESEND_API_KEY: "re_test_key_123" });
  captured = null; nextStatus = 200; nextBody = { id: "re_abc123" };
  const id = await m.sendEmail({
    to: m.MAIL_NOTIFY_TO,
    subject: "New enquiry from the website",
    html: "<p>Someone filled in the form.</p>",
    text: "Someone filled in the form.",
    replyTo: "visitor@example.com",
  });
  ok("returns the Resend message id", id === "re_abc123", String(id));
  ok("Authorization is a bearer token", captured?.auth === "Bearer re_test_key_123", captured?.auth);
  ok("content-type is JSON", String(captured?.contentType).includes("application/json"));
  ok("from is MAIL_FROM", captured?.body.from === m.MAIL_FROM, captured?.body.from);
  ok("to is an array", Array.isArray(captured?.body.to), JSON.stringify(captured?.body.to));
  ok("to is MAIL_NOTIFY_TO", captured?.body.to?.[0] === m.MAIL_NOTIFY_TO, captured?.body.to?.[0]);
  ok("subject carried", captured?.body.subject === "New enquiry from the website");
  ok("html carried", captured?.body.html === "<p>Someone filled in the form.</p>");
  ok("text carried", captured?.body.text === "Someone filled in the form.");
  ok("reply_to uses Resend's snake_case key", captured?.body.reply_to === "visitor@example.com",
     JSON.stringify(captured?.body));
  console.log("        -> payload:", JSON.stringify(captured?.body));
}

console.log("\n5. Threading a reply sets In-Reply-To and References");
{
  const m = await load({ MAIL_DOMAIN: DOMAIN, RESEND_API_KEY: "re_test_key_123" });
  captured = null; nextStatus = 200; nextBody = { id: "re_thread" };
  await m.sendEmail({ to: "v@example.com", subject: "Re: your enquiry", html: "<p>hi</p>",
                      inReplyTo: "<msg-1@mail.example.com>" });
  ok("In-Reply-To set", captured?.body.headers?.["In-Reply-To"] === "<msg-1@mail.example.com>");
  ok("References set", captured?.body.headers?.["References"] === "<msg-1@mail.example.com>");
}

console.log("\n6. A rejected send surfaces Resend's own message");
{
  const m = await load({ MAIL_DOMAIN: DOMAIN, RESEND_API_KEY: "re_bad" });
  nextStatus = 403;
  nextBody = { message: "The meastroarchitecture.com domain is not verified. Please add and verify your domain on https://resend.com/domains" };
  let msg = "";
  try { await m.sendEmail({ to: "a@b.com", subject: "x", html: "<p>x</p>" }); }
  catch (e: any) { msg = String(e.message); }
  ok("throws with the status", msg.includes("403"), msg);
  ok("throws with Resend's reason", msg.includes("domain is not verified"), msg);
  console.log("        -> what you would see in the Vercel log:", msg);
  nextStatus = 200; nextBody = { id: "re_ok" };
}

// ---------------------------------------------------------------------------
console.log("\n7. Inbound webhook signature (Svix HMAC-SHA256)");
{
  const keyBytes = Buffer.from("a-test-signing-key-32-bytes-long", "utf8");
  const secret = "whsec_" + keyBytes.toString("base64");
  const m = await load({ MAIL_DOMAIN: DOMAIN, RESEND_WEBHOOK_SECRET: secret });

  const body = JSON.stringify({ type: "email.received", data: { from: "v@example.com" } });
  const id = `msg_${randomUUID()}`;
  const ts = Math.floor(Date.now() / 1000).toString();
  const sign = (i: string, t: string, b: string, k: Buffer) =>
    "v1," + createHmac("sha256", k).update(`${i}.${t}.${b}`).digest("base64");

  const good = new Headers({ "svix-id": id, "svix-timestamp": ts, "svix-signature": sign(id, ts, body, keyBytes) });
  ok("a correctly signed delivery is accepted", m.verifyResendWebhook(body, good).ok === true,
     JSON.stringify(m.verifyResendWebhook(body, good)));

  const alias = new Headers({ "webhook-id": id, "webhook-timestamp": ts, "webhook-signature": sign(id, ts, body, keyBytes) });
  ok("webhook-* header aliases are accepted", m.verifyResendWebhook(body, alias).ok === true);

  const multi = new Headers({ "svix-id": id, "svix-timestamp": ts,
    "svix-signature": `v1,AAAA ${sign(id, ts, body, keyBytes)}` });
  ok("a second signature version in the header still matches", m.verifyResendWebhook(body, multi).ok === true);

  const tampered = m.verifyResendWebhook(body.replace("v@example.com", "attacker@evil.com"), good);
  ok("a tampered body is rejected", tampered.ok === false, JSON.stringify(tampered));

  const wrongKey = sign(id, ts, body, Buffer.from("a-different-key-entirely--32byte", "utf8"));
  ok("a signature from the wrong secret is rejected",
     m.verifyResendWebhook(body, new Headers({ "svix-id": id, "svix-timestamp": ts, "svix-signature": wrongKey })).ok === false);

  const oldTs = (Math.floor(Date.now() / 1000) - 3600).toString();
  const replay = m.verifyResendWebhook(body, new Headers({ "svix-id": id, "svix-timestamp": oldTs, "svix-signature": sign(id, oldTs, body, keyBytes) }));
  ok("an hour-old replay is rejected", replay.ok === false, JSON.stringify(replay));
  console.log("        -> replay reason:", (replay as any).reason);

  const missing = m.verifyResendWebhook(body, new Headers({ "svix-id": id }));
  ok("missing headers are named, not guessed", missing.ok === false && /svix-timestamp/.test((missing as any).reason),
     JSON.stringify(missing));
  console.log("        -> missing reason:", (missing as any).reason);
}

console.log("\n8. What /api/health says about the webhook secret");
{
  const m = await load({ MAIL_DOMAIN: DOMAIN });
  const good = "whsec_" + Buffer.from("32-bytes-of-signing-key-material", "utf8").toString("base64");
  const verdicts: [string, string][] = [
    ["the real signing secret", good],
    ["the Resend API key pasted into this slot", "re_ABC123def456GHI789jkl"],
    ["a Supabase key pasted into this slot", "sb_publishable_AbC123"],
    ["junk with no whsec_ prefix", "!!!not base64!!!"],
    ["whsec_ with nothing after it", "whsec_"],
    ["a truncated secret", "whsec_" + Buffer.from("short", "utf8").toString("base64")],
  ];
  for (const [name, value] of verdicts) {
    console.log(`        ${name}\n          -> ${m.describeWebhookSecret(value)}`);
  }
  ok("the real secret is reported as fine", m.describeWebhookSecret(good).startsWith("looks right"));
  ok("an API key in this slot is caught", /Resend API key/.test(m.describeWebhookSecret("re_ABC123def456GHI789jkl")));
  ok("a Supabase key in this slot is caught", /Supabase/.test(m.describeWebhookSecret("sb_publishable_AbC123")));
  ok("junk is caught", /SUSPECT|UNUSABLE/.test(m.describeWebhookSecret("!!!not base64!!!")));
  ok("an empty whsec_ is caught", /UNUSABLE/.test(m.describeWebhookSecret("whsec_")));
  ok("a truncated secret is caught", /SUSPECT/.test(m.describeWebhookSecret("whsec_" + Buffer.from("short","utf8").toString("base64"))));
  ok("unset is not reported as an error", /only needed to receive/.test(m.describeWebhookSecret(undefined)));
}
{
  const m = await load({ MAIL_DOMAIN: DOMAIN });
  const r = m.verifyResendWebhook("{}", new Headers());
  ok("an unset secret says which variable to set",
     r.ok === false && r.reason.includes("RESEND_WEBHOOK_SECRET"), JSON.stringify(r));
}

console.log("\n9. The mail-loop trap");
{
  const m = await load({ MAIL_DOMAIN: DOMAIN, MAIL_NOTIFY_TO: `studio@${DOMAIN}` });
  const loops = m.MAIL_NOTIFY_TO.endsWith("@" + m.MAIL_DOMAIN);
  console.log(`        MAIL_NOTIFY_TO=${m.MAIL_NOTIFY_TO} is on MAIL_DOMAIN: ${loops ? "YES, check it does not forward into /api/inbound-email" : "no"}`);
  ok("the loop condition is detectable from config alone", loops === true);
}

server.close();
console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
