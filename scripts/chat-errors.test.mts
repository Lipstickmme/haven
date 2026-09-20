// Run with:  node --experimental-strip-types --no-warnings scripts/chat-errors.test.mts
//
// Covers readableError against every rejection shape supabase-js actually
// produces. The banner once showed "[object Object]" because a request that
// never completes rejects with a plain object literal, not an Error, and the
// one case where the reason matters most was the one case that was thrown away.
import { PostgrestError } from "@supabase/postgrest-js";
import { AuthError } from "@supabase/auth-js";
import { describeError, readableError } from "../src/lib/readable-error.ts";

let pass = 0, fail = 0;
const ok = (name: string, cond: boolean, got = "") => {
  if (cond) { pass++; console.log(`  PASS  ${name}`); }
  else { fail++; console.log(`  FAIL  ${name}\n          got: ${got}`); }
};

console.log("\nEvery shape supabase-js rejects with\n");

// The regression: a request that never completes.
{
  const networkFailure = { message: "FetchError: Failed to fetch", details: "TypeError: Failed to fetch", hint: "", code: "" };
  const got = readableError(networkFailure);
  ok("a plain-object fetch failure is not [object Object]", got !== "[object Object]", got);
  ok("the real reason survives", /FetchError|Failed to fetch/.test(got), got);
  ok("it is classified as a network failure", describeError(networkFailure).kind === "network");
  console.log(`        -> ${got}\n`);
}

// A real query failure, which is an Error subclass.
{
  const rls = new PostgrestError({
    message: 'new row violates row-level security policy for table "chat_messages"',
    details: "", hint: "", code: "42501",
  });
  const got = readableError(rls);
  ok("a PostgrestError keeps its message", /row-level security/.test(got), got);
  ok("the Postgres code is carried through", /42501/.test(got), got);
  console.log(`        -> ${got}\n`);
}

// A hint is the actionable half of a Postgres error.
{
  const withHint = { message: "permission denied for table chat_messages", hint: "Grant the required privileges to the current role.", code: "42501" };
  const got = readableError(withHint);
  ok("a hint on a plain object is surfaced", /Grant the required privileges/.test(got), got);
}

// Auth failures.
{
  const d = describeError(new AuthError("Anonymous sign-ins are disabled", 422, "anonymous_provider_disabled"));
  ok("anonymous sign-ins disabled is classified so the chat can name the fix",
     d.kind === "anonymous-disabled", d.kind);
}
{
  const got = readableError({ error: "invalid_grant", error_description: "Invalid Refresh Token: Refresh Token Not Found" });
  ok("an OAuth-shaped rejection uses error_description", /Refresh Token Not Found/.test(got), got);
}

// Shapes that must not produce a bare object or an empty banner.
for (const [name, value] of [
  ["a bare string", "something broke"],
  ["null", null],
  ["undefined", undefined],
  ["an empty object", {}],
  ["a number", 500],
] as [string, unknown][]) {
  const got = readableError(value);
  ok(`${name} still yields a sentence`, typeof got === "string" && got.length > 0 && got !== "[object Object]", got);
}

// Browser wordings differ; all of them mean the same thing.
for (const message of ["Failed to fetch", "NetworkError when attempting to fetch resource.", "Load failed", "FetchError: request to https://x.supabase.co failed"]) {
  ok(`"${message}" is classified as a network failure`, describeError({ message }).kind === "network");
}

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
