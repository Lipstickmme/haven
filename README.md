# Blueprint Haven — site, chat and studio dashboard

A TanStack Start (SSR) app on Vercel, backed by Supabase and Resend. The public
site carries a visitor chat widget and a contact/booking form; `/admin` is a
staff dashboard for everything that comes in.

## How it fits together

Five rules drive the rest of the design.

1. **Visitors authenticate for real.** The chat widget calls
   `supabase.auth.signInAnonymously()`, so every row a visitor creates carries a
   genuine `auth.uid()` and row level security can grant them their own chat and
   nothing else. There is no bearer-token scheme to forge, and no service-role
   key in the browser — ever.
2. **Form submissions never touch the database from the browser.** `enquiries`
   and `bookings` have no anon policy at all. Writes go through `submitForm`, a
   server function holding the service-role key, so a leaked anon key cannot
   stuff the inbox.
3. **Chat rows _are_ written from the browser**, under the visitor's own
   session, because RLS expresses "your own session" precisely. The server
   function is used only to send the staff notification.
4. **The browser's Supabase config is served at runtime** from the root route's
   loader, never inlined at build time behind a `VITE_` prefix.
   `SUPABASE_URL`, `VITE_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_URL` are
   accepted as equivalent (and the same for the anon key), so connecting
   Vercel's Supabase integration is enough on its own.
5. **Missing configuration is never silent.** The page renders a notice naming
   exactly which variables are unset and where to set them, and `/api/health`
   prints what the running server can actually see.

## Setup

### 1. Enable anonymous sign-ins

Supabase dashboard → **Authentication → Sign In / Providers → Anonymous
sign-ins** → on.

Without this the chat widget shows "Anonymous sign-ins are disabled" and nothing
else works in the widget. Enable it on **the project this deployment points
at**, which is not necessarily the one last opened in the dashboard — open
`/api/health` on the deployment to see which URL is actually in use.

### 2. Run the migrations

In the Supabase SQL editor, run in order:

| File                                 | Needed for                                                  |
| ------------------------------------ | ----------------------------------------------------------- |
| `supabase/migrations/0001_init.sql`  | everything: admins, enquiries, bookings, chat               |
| `supabase/migrations/0002_email.sql` | optional — only to receive mail through the inbound webhook |

Both are guarded and re-runnable: applying them twice is a no-op, not an error.

Then check your work with `supabase/verify.sql`, which asserts every table,
policy, trigger and publication membership exists and raises one exception
listing anything missing.

### 3. Put yourself on the admin list

Sign in once at `/auth` (or create the user under **Authentication → Users**),
then edit the single `admin_email` variable at the top of
`supabase/grant-admin.sql` and run it. It looks the address up in `auth.users`
and raises a clear exception if that login does not exist yet.

### 4. Set the environment variables

In Vercel → **Settings → Environment Variables** (Production _and_ Preview).

| Variable                    | Visibility          | Required | What it does                                                                                                                           |
| --------------------------- | ------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `SUPABASE_URL`              | reaches the browser | yes      | Project URL. Also accepts `VITE_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_URL`.                                                           |
| `SUPABASE_ANON_KEY`         | reaches the browser | yes      | Anon / publishable key. Also accepts `VITE_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, or the `…PUBLISHABLE_KEY` spellings.   |
| `SUPABASE_SERVICE_ROLE_KEY` | **server only**     | yes      | Writes `enquiries`, `bookings` and email rows. Never exposed to the browser. Also accepts `SUPABASE_SECRET_KEY` or `SERVICE_ROLE_KEY`. |
| `RESEND_API_KEY`            | **server only**     | no       | Sends notifications and email replies. Unset means mail is skipped and logged; nothing else breaks.                                    |
| `RESEND_WEBHOOK_SECRET`     | **server only**     | no       | `whsec_…` Svix signing secret for `/api/inbound-email`. Required only to receive mail.                                                 |
| `MAIL_DOMAIN`               | server only         | no       | One domain drives every address below.                                                                                                 |
| `MAIL_FROM`                 | server only         | no       | Defaults to `Blueprint Haven <no-reply@$MAIL_DOMAIN>`.                                                                                 |
| `MAIL_REPLY_TO`             | server only         | no       | Defaults to `hello@$MAIL_DOMAIN`.                                                                                                      |
| `MAIL_NOTIFY_TO`            | server only         | no       | Where visitor notifications land. Defaults to `MAIL_REPLY_TO`.                                                                         |

"Reaches the browser" means the value is delivered to the client at runtime by
the root route's loader — that is expected and safe for the anon key, which RLS
governs. Everything marked **server only** stays in `*.server.ts` modules,
which the bundler keeps out of the client build.

Confirm with `/api/health`: it lists every accepted spelling of anything
missing, prints which Supabase project is in use, and says whether the webhook
secret decodes to a usable key.

### 5. Deploy

`vercel.json` pins the install and build commands, so Vercel runs
`npm ci && npm run build` and picks up the Nitro Build Output API in
`.vercel/output`.

**Vercel deploys the repository's default branch.** Pushing to `main` when the
default branch is something else deploys nothing — check
Settings → Git → Production Branch.

## Receiving email (optional)

1. Apply `supabase/migrations/0002_email.sql`.
2. In Resend, add an inbound route for your domain and point it at
   `https://<your-deployment>/api/inbound-email`.
3. Copy the endpoint's `whsec_…` signing secret into `RESEND_WEBHOOK_SECRET`.

The route verifies the Svix HMAC-SHA256 signature over the raw body before
parsing anything, ignores every event type other than `email.received`, and
dedupes on the Resend email id because inbound webhooks retry.

> **Do not point a forwarding address on `MAIL_DOMAIN` back at your own inbound
> route.** Mail loops through the webhook until the sending quota is gone.

## Local development

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build → .vercel/output
npm run typecheck  # tsc --noEmit
```

Put the same variables in a local `.env`. `/api/health` works in dev too.

## Layout

```
src/
  server.ts                  SSR entry + the /api/* route table
  start.ts                   global server-fn auth middleware + CSRF
  lib/
    public-config.ts         loadPublicConfig / setPublicConfig / isSupabaseConfigured
    supabase.ts              lazy Proxy around the browser client
    database.types.ts        row types, kept in step with the SQL
    api/
      _shared.server.ts      env, adminClient, sendEmail, requireAdmin, webhook verify
      forms.ts               submitForm  (enquiry | booking | chat)
      email.ts               sendEmailReply (admin only)
      inbound-email.server.ts  POST /api/inbound-email
      health.server.ts         GET  /api/health
  hooks/                     useVisitorChat, useAdminAuth, useFormSubmit, useRealtimeRows
  components/chat/           the floating visitor widget
  components/admin/          the four dashboard tabs
  routes/                    file-based routes; /admin and /auth are noindex
supabase/
  migrations/0001_init.sql   admins, enquiries, bookings, chat, RLS, realtime
  migrations/0002_email.sql  email threads and messages (optional)
  grant-admin.sql            put a person on the staff list
  verify.sql                 assert the schema is what the app expects
```

## If a deploy does not show your changes

Vercel keeps serving the **last successful** deployment when a build fails, so a
broken build looks exactly like "nothing was deployed". Check the deployment log
in Vercel first, then:

- **`npm ci` fails with "package.json and package-lock.json are not in sync".**
  This one is nasty, because it can pass locally and still fail on Vercel.
  Vercel's image runs **npm 11**; Node 22 bundles **npm 10**. npm 10 writes a
  lockfile carrying only the current platform's optional binaries
  (`@tailwindcss/oxide-*`, rolldown bindings), while npm 11 demands every
  platform variant and refuses to install without them.

  Always regenerate the lockfile with npm 11 — `rm -rf node_modules
package-lock.json && npx npm@11 install` — and verify with
  `npx npm@11 ci && npm run build`. A lockfile written by npm 11 is a superset
  that npm 10 also accepts; the reverse is not true. `.github/workflows/ci.yml`
  pins npm 11 and runs a strict `npm ci` so this fails in CI rather than in a
  deploy. `vercel.json` additionally falls back to `npm install`, so drift can
  never take the live site down again.

- **The site loads but `/api/health` 404s.** The build did not produce
  `.vercel/output` — check the build command in Vercel matches `vercel.json`.
- **Everything renders but chat and the dashboard are off.** That is
  configuration, not deployment: `/api/health` names the missing variables.

## Notes for future edits

- `package.json` sets `"sideEffects": false`, so a bare `import "./x"` for its
  side effect alone is tree-shaken away. Export a function and call it — see
  `installErrorCapture()` in `src/server.ts`.
- The global function middleware in `src/start.ts` runs for _every_ server
  function, including `loadPublicConfig`, which is what delivers the config.
  It is guarded with `if (!isSupabaseConfigured()) return next();` — keep it.
- Defining `src/start.ts` opts out of Start's automatic CSRF middleware, so it
  is re-added explicitly there.
- Avoid committing a lockfile produced by a hosted builder: it can pin a private
  registry the Vercel build cannot authenticate to.
