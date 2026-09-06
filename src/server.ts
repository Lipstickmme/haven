import { consumeLastCapturedError, installErrorCapture } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

// A bare `import "./lib/error-capture"` would be dropped: package.json sets
// `"sideEffects": false`, so side-effect-only imports are tree-shaken away.
installErrorCapture();

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

type RouteHandler = (request: Request) => Response | Promise<Response>;

// This version of TanStack Start has no file-based server routes, so API
// endpoints live here: a small table checked before the request is handed to
// Start's server entry. Handlers are `.server.ts` modules, imported lazily so
// nothing server-only is pulled in on an ordinary page render.
const API_ROUTES: Record<string, () => Promise<RouteHandler>> = {
  "/api/inbound-email": () =>
    import("./lib/api/inbound-email.server").then((m) => m.handleInboundEmail),
  "/api/health": () => import("./lib/api/health.server").then((m) => m.handleHealthCheck),
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

function routeKey(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
  return pathname;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const load = API_ROUTES[routeKey(new URL(request.url).pathname)];
      if (load) {
        const handler = await load();
        return await handler(request);
      }

      const entry = await getServerEntry();
      const response = await entry.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
