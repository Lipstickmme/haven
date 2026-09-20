// Turning whatever a rejection carries into a sentence someone can act on.
//
// Not everything supabase-js throws is an `Error`. A query that fails on the
// server rejects with a PostgrestError, which is one; a request that never
// completes rejects with a plain object literal,
// `{ message: "FetchError: ...", details, hint, code }`, and `String()` turns
// that into "[object Object]". That is the one case where the reason matters
// most, so read the fields rather than trusting the type.
//
// Deliberately free of imports so it can be exercised directly by
// scripts/chat-errors.test.mts without a bundler in the way.

export type ErrorKind = "network" | "anonymous-disabled" | "unconfigured" | "other";

export type DescribedError = {
  /** A sentence, never empty, never "[object Object]". */
  message: string;
  kind: ErrorKind;
  /** Postgres puts the actionable fix here when it knows one. */
  hint: string;
  /** PostgREST or Postgres code, e.g. "42501". */
  code: string;
};

/** Browsers word a failed request differently; all of them mean the same thing. */
const NETWORK = /fetch|networkerror|failed to fetch|load failed|err_(connection|network|internet)/i;

function firstString(row: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string" && value.trim() !== "") return value;
  }
  return "";
}

export function describeError(error: unknown): DescribedError {
  let message = "";
  let hint = "";
  let code = "";

  if (typeof error === "string") {
    message = error;
  } else if (error && typeof error === "object") {
    // An Error subclass may still carry Postgres's extra fields.
    const row = error as Record<string, unknown>;
    message =
      error instanceof Error && error.message
        ? error.message
        : firstString(row, ["message", "error_description", "error", "msg", "details"]);
    hint = firstString(row, ["hint"]);
    code = firstString(row, ["code"]);
  }

  if (!message) message = "Something went wrong.";

  const kind: ErrorKind = /anonymous sign-ins are disabled/i.test(message)
    ? "anonymous-disabled"
    : NETWORK.test(message)
      ? "network"
      : /not configured/i.test(message)
        ? "unconfigured"
        : "other";

  return { message, kind, hint, code };
}

/**
 * The same thing as one string, with Postgres's hint and code appended when
 * they add something. For call sites with no domain wording of their own.
 */
export function readableError(error: unknown): string {
  const { message, hint, code } = describeError(error);
  const suffix = [hint, code ? `(${code})` : ""].filter(Boolean).join(" ");
  return suffix ? `${message} ${suffix}` : message;
}
