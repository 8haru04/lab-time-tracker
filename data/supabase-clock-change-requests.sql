create table if not exists public.lab_clock_change_requests (
  id text primary key,
  requester_user_id text not null references public.lab_users(user_id) on delete cascade,
  target_user_id text not null references public.lab_users(user_id) on delete cascade,
  date_key date not null,
  start_time text not null default '',
  end_time text not null default '',
  break_minutes integer not null default 0,
  note text not null default '',
  status text not null default 'pending',
  reviewed_by text null references public.lab_users(user_id) on delete set null,
  reviewed_at timestamptz null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.lab_clock_change_requests enable row level security;

drop policy if exists "lab_clock_change_requests_public_select" on public.lab_clock_change_requests;
drop policy if exists "lab_clock_change_requests_public_insert" on public.lab_clock_change_requests;
drop policy if exists "lab_clock_change_requests_public_update" on public.lab_clock_change_requests;
drop policy if exists "lab_clock_change_requests_public_delete" on public.lab_clock_change_requests;

create policy "lab_clock_change_requests_public_select"
on public.lab_clock_change_requests
for select
to anon, authenticated
using (true);

create policy "lab_clock_change_requests_public_insert"
on public.lab_clock_change_requests
for insert
to anon, authenticated
with check (true);

create policy "lab_clock_change_requests_public_update"
on public.lab_clock_change_requests
for update
to anon, authenticated
using (true)
with check (true);

create policy "lab_clock_change_requests_public_delete"
on public.lab_clock_change_requests
for delete
to anon, authenticated
using (true);
