-- grant-admin.sql — put a person on the staff list.
--
-- Edit `admin_email` below, then run this in the Supabase SQL editor.
-- The address must already have signed up (Authentication -> Users, or by
-- signing in once at /auth); this looks the login up rather than inventing it.

do $$
declare
  admin_email text := 'you@example.com';  -- <<< edit this
  target_id uuid;
begin
  select id into target_id
  from auth.users
  where lower(email) = lower(admin_email)
  limit 1;

  if target_id is null then
    raise exception
      'No auth.users row for %. Create the login first (Supabase dashboard -> Authentication -> Users -> Add user, or sign up once at /auth), then re-run this file.',
      admin_email;
  end if;

  insert into public.admins (user_id, email)
  values (target_id, admin_email)
  on conflict (user_id) do nothing;

  raise notice 'Granted admin to % (%)', admin_email, target_id;
end $$;
