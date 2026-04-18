create table if not exists public.lab_shared_schedule_items (
  id text primary key,
  title text not null,
  type text not null,
  date_key date not null,
  start_time text not null default '',
  end_time text not null default '',
  note text not null default '',
  created_by text not null references public.lab_users(user_id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.lab_shared_schedule_items enable row level security;

drop policy if exists "lab_shared_schedule_items_public_select" on public.lab_shared_schedule_items;
drop policy if exists "lab_shared_schedule_items_public_insert" on public.lab_shared_schedule_items;
drop policy if exists "lab_shared_schedule_items_public_update" on public.lab_shared_schedule_items;
drop policy if exists "lab_shared_schedule_items_public_delete" on public.lab_shared_schedule_items;

create policy "lab_shared_schedule_items_public_select"
on public.lab_shared_schedule_items
for select
to anon, authenticated
using (true);

create policy "lab_shared_schedule_items_public_insert"
on public.lab_shared_schedule_items
for insert
to anon, authenticated
with check (true);

create policy "lab_shared_schedule_items_public_update"
on public.lab_shared_schedule_items
for update
to anon, authenticated
using (true)
with check (true);

create policy "lab_shared_schedule_items_public_delete"
on public.lab_shared_schedule_items
for delete
to anon, authenticated
using (true);
