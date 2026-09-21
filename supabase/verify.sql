-- verify.sql — assert the schema the app expects is actually there.
--
-- Run this in the Supabase SQL editor after applying the migrations. It raises
-- one exception listing everything that is missing, or prints "schema OK".
--
-- The expectations themselves live in public.schema_report(), defined by
-- 0006_schema_report.sql, so that /api/health can ask the same question. This
-- file is the version you paste into the SQL editor.
--
-- 0002_email.sql is optional. If its tables are absent the email section is
-- skipped with a notice rather than reported as a failure.

do $$
declare
  problems text[];
begin
  if to_regprocedure('public.schema_report()') is null then
    raise exception E'public.schema_report() is not there, so nothing can be checked.\n  Apply supabase/migrations/0006_schema_report.sql, then run this again.';
  end if;

  if to_regclass('public.email_threads') is null then
    raise notice 'email tables absent — 0002_email.sql has not been applied (optional; only needed to receive mail)';
  end if;

  problems := public.schema_report();

  if array_length(problems, 1) is null then
    raise notice 'schema OK — every table, column, policy, trigger and publication membership is present';
  else
    raise exception E'schema verification failed:\n  - %', array_to_string(problems, E'\n  - ');
  end if;
end $$;
