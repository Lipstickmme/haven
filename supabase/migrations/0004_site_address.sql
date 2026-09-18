-- 0004_site_address.sql — the studio address, alongside the other editable
-- contact details. Guarded and re-runnable like the rest.

alter table public.site_settings
  add column if not exists address text not null
  default '54-A Sager Dr, Rochester, NY 14607, United States';

-- Fill the existing row if it predates the column.
update public.site_settings
   set address = '54-A Sager Dr, Rochester, NY 14607, United States'
 where coalesce(address, '') = '';
