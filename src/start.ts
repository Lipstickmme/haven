import { createCsrfMiddleware, createMiddleware, createStart } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { isSupabaseConfigured } from "./lib/public-config";
import { supabase } from "./lib/supabase";

/**
 * Attaches the visitor's (or staff member's) Supabase access token to every
 * server function call, so `requireAdmin` has something to validate.
 *
 * This runs for *every* server function — including `loadPublicConfig`, which
 * is the call that delivers the Supabase config in the first place. Touching
 * the client before then would throw on an empty URL, so bail out early while
 * the config is still unset.
 */
const attachSupabaseAuth = createMiddleware({ type: "function" }).client(async ({ next }) => {
  if (!isSupabaseConfigured()) return next();

  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return next({ headers: token ? { Authorization: `Bearer ${token}` } : {} });
});

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

// Start installs CSRF protection automatically only when src/start.ts is
// absent. Defining this file opts out, so re-add it explicitly.
const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
  requestMiddleware: [errorMiddleware, csrfMiddleware],
}));
