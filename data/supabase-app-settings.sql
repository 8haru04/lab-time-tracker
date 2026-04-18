create table if not exists public.lab_app_settings (
  setting_key text primary key,
  setting_value text not null default '',
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.lab_app_settings enable row level security;

drop policy if exists "lab_app_settings_public_select" on public.lab_app_settings;
drop policy if exists "lab_app_settings_public_insert" on public.lab_app_settings;
drop policy if exists "lab_app_settings_public_update" on public.lab_app_settings;
drop policy if exists "lab_app_settings_public_delete" on public.lab_app_settings;

create policy "lab_app_settings_public_select"
on public.lab_app_settings
for select
to anon, authenticated
using (true);

create policy "lab_app_settings_public_insert"
on public.lab_app_settings
for insert
to anon, authenticated
with check (true);

create policy "lab_app_settings_public_update"
on public.lab_app_settings
for update
to anon, authenticated
using (true)
with check (true);

create policy "lab_app_settings_public_delete"
on public.lab_app_settings
for delete
to anon, authenticated
using (true);
