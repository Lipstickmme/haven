-- verify.sql — assert the schema the app expects is actually there.
--
-- Run this in the Supabase SQL editor after applying the migrations. It raises
-- one exception listing everything that is missing, or prints "schema OK".
--
-- 0002_email.sql is optional. If its tables are absent the email section is
-- skipped with a notice rather than reported as a failure.

do $$
declare
  problems text[] := '{}';
  has_email boolean;
  r record;

  -- expected: table name
  core_tables text[] := array[
    'admins', 'enquiries', 'bookings', 'chat_sessions', 'chat_messages'
  ];
  email_tables text[] := array['email_threads', 'email_messages'];

  -- expected: table.policy
  core_policies text[] := array[
    'admins.admins_select_self',
    'admins.admins_select_all',
    'enquiries.enquiries_admin_select',
    'enquiries.enquiries_admin_update',
    'bookings.bookings_admin_select',
    'bookings.bookings_admin_update',
    'chat_sessions.chat_sessions_visitor_insert',
    'chat_sessions.chat_sessions_visitor_select',
    'chat_sessions.chat_sessions_admin_select',
    'chat_sessions.chat_sessions_admin_update',
    'chat_messages.chat_messages_visitor_insert',
    'chat_messages.chat_messages_visitor_select',
    'chat_messages.chat_messages_admin_select',
    'chat_messages.chat_messages_admin_insert'
  ];
  email_policies text[] := array[
    'email_threads.email_threads_admin_select',
    'email_threads.email_threads_admin_update',
    'email_messages.email_messages_admin_select'
  ];

  -- expected: table.trigger
  core_triggers text[] := array[
    'enquiries.enquiries_touch_updated_at',
    'bookings.bookings_touch_updated_at',
    'chat_messages.chat_messages_touch_session'
  ];
  email_triggers text[] := array['email_messages.email_messages_touch_thread'];

  core_realtime text[] := array['chat_sessions', 'chat_messages', 'bookings'];
  email_realtime text[] := array['email_threads', 'email_messages'];

  core_functions text[] := array['is_admin', 'touch_updated_at', 'touch_chat_session'];
  core_types text[] := array['item_status', 'booking_status'];

  name text;
  parts text[];
begin
  has_email := to_regclass('public.email_threads') is not null;

  -- Tables -------------------------------------------------------------
  foreach name in array (core_tables || case when has_email then email_tables else '{}'::text[] end) loop
    if to_regclass('public.' || quote_ident(name)) is null then
      problems := problems || format('missing table public.%s', name);
    elsif not exists (
      select 1 from pg_class c
      join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public' and c.relname = name and c.relrowsecurity
    ) then
      problems := problems || format('row level security is OFF on public.%s', name);
    end if;
  end loop;

  -- Types --------------------------------------------------------------
  foreach name in array core_types loop
    if to_regtype('public.' || quote_ident(name)) is null then
      problems := problems || format('missing type public.%s', name);
    end if;
  end loop;

  -- Functions ----------------------------------------------------------
  foreach name in array (core_functions || case when has_email then array['touch_email_thread'] else '{}'::text[] end) loop
    if not exists (
      select 1 from pg_proc p
      join pg_namespace n on n.oid = p.pronamespace
      where n.nspname = 'public' and p.proname = name
    ) then
      problems := problems || format('missing function public.%s()', name);
    end if;
  end loop;

  if not exists (
    select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = 'is_admin' and p.prosecdef
  ) then
    problems := problems || 'public.is_admin() is not SECURITY DEFINER (policies will recurse on admins)';
  end if;

  -- Policies -----------------------------------------------------------
  foreach name in array (core_policies || case when has_email then email_policies else '{}'::text[] end) loop
    parts := string_to_array(name, '.');
    if not exists (
      select 1 from pg_policies
      where schemaname = 'public' and tablename = parts[1] and policyname = parts[2]
    ) then
      problems := problems || format('missing policy %s on public.%s', parts[2], parts[1]);
    end if;
  end loop;

  -- enquiries and bookings must have NO policy granted to anon.
  for r in
    select tablename, policyname, roles
    from pg_policies
    where schemaname = 'public' and tablename in ('enquiries', 'bookings')
  loop
    if 'anon' = any (r.roles) or 'public' = any (r.roles) then
      problems := problems || format(
        'policy %s on public.%s is exposed to anon — form writes must go through the service role only',
        r.policyname, r.tablename
      );
    end if;
  end loop;

  -- Triggers -----------------------------------------------------------
  foreach name in array (core_triggers || case when has_email then email_triggers else '{}'::text[] end) loop
    parts := string_to_array(name, '.');
    if not exists (
      select 1 from pg_trigger t
      join pg_class c on c.oid = t.tgrelid
      join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public' and c.relname = parts[1] and t.tgname = parts[2] and not t.tgisinternal
    ) then
      problems := problems || format('missing trigger %s on public.%s', parts[2], parts[1]);
    end if;
  end loop;

  -- Realtime publication ------------------------------------------------
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    problems := problems || 'missing publication supabase_realtime';
  else
    foreach name in array (core_realtime || case when has_email then email_realtime else '{}'::text[] end) loop
      if not exists (
        select 1 from pg_publication_tables
        where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = name
      ) then
        problems := problems || format('public.%s is not in the supabase_realtime publication', name);
      end if;
    end loop;
  end if;

  -- Report ---------------------------------------------------------------
  if not has_email then
    raise notice 'email tables absent — 0002_email.sql has not been applied (optional; only needed to receive mail)';
  end if;

  if array_length(problems, 1) is null then
    raise notice 'schema OK — every table, policy, trigger and publication membership is present';
  else
    raise exception E'schema verification failed:\n  - %', array_to_string(problems, E'\n  - ');
  end if;
end $$;
