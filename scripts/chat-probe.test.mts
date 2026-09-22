// Run with:  node --experimental-strip-types --no-warnings scripts/chat-probe.test.mts
//
// Three different faults make the chat widget say the same sentence, and
// telling them apart has meant reading a browser console. These are the exact
// errors each one produces, and what the health probe says about them.
import { createServer, type ViteDevServer } from "vite";

const vite: ViteDevServer = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "silent",
  configFile: false,
  resolve: { alias: { "@": new URL("../src", import.meta.url).pathname } },
});

process.env["SUPABASE_URL"] = "https://stub.supabase.co";
process.env["SUPABASE_ANON_KEY"] = "anon";
process.env["SUPABASE_SERVICE_ROLE_KEY"] = "service";
const { explainRefusal } = (await vite.ssrLoadModule("/src/lib/api/health.server.ts")) as {
  explainRefusal: (e: { message: string; code?: string; hint?: string }, t: string, a: string) => string;
};

let pass = 0, fail = 0;
const ok = (name: string, cond: boolean, got = "") => {
  if (cond) { pass++; console.log(`  PASS  ${name}`); }
  else { fail++; console.log(`  FAIL  ${name}${got ? "\n          got: " + got : ""}`); }
};

console.log("\nThe three faults behind one sentence\n");

{
  // Reproduced on real Postgres by revoking the grant and leaving every policy.
  const out = explainRefusal(
    { message: "permission denied for table chat_messages", code: "42501" },
    "chat_messages", "insert",
  );
  ok("a missing grant is named as a grant", /missing GRANT/.test(out), out);
  ok("it does not blame a policy", !/missing POLICY/.test(out), out);
  ok("it names the migration", /0001_init/.test(out), out);
  console.log(`        -> ${out}\n`);
}
{
  // Reproduced by dropping chat_messages_visitor_insert.
  const out = explainRefusal(
    { message: 'new row violates row-level security policy for table "chat_messages"', code: "42501" },
    "chat_messages", "insert",
  );
  ok("a missing policy is named as a policy", /missing POLICY/.test(out), out);
  ok("it does not blame a grant", !/missing GRANT/.test(out), out);
  ok("it points at the schema section", /schema section/.test(out), out);
  console.log(`        -> ${out}\n`);
}
{
  const out = explainRefusal({ message: "JWT expired", code: "PGRST301" }, "chat_messages", "insert");
  ok("an expired session is called an auth problem", /auth problem/.test(out), out);
  ok("it does not blame the schema", !/GRANT|POLICY/.test(out), out);
  console.log(`        -> ${out}\n`);
}
{
  const out = explainRefusal(
    { message: "something else went wrong", code: "XX000", hint: "try turning it off and on" },
    "chat_messages", "insert",
  );
  ok("an unrecognised error keeps its own words", /something else went wrong/.test(out), out);
  ok("the hint is carried", /try turning it off/.test(out), out);
  ok("the code is carried", /XX000/.test(out), out);
}
{
  const out = explainRefusal({ message: "" }, "chat_messages", "insert");
  ok("an empty message does not throw", typeof out === "string");
}

await vite.close();
console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
