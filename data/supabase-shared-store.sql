create table if not exists public.lab_users (
  user_id text primary key,
  display_name text not null,
  role text not null,
  is_owner boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.lab_presence_plans (
  user_id text not null references public.lab_users(user_id) on delete cascade,
  date_key date not null,
  availability text not null,
  start_time text not null default '',
  end_time text not null default '',
  note text not null default '',
  updated_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, date_key)
);

create table if not exists public.lab_tasks (
  id text primary key,
  user_id text not null references public.lab_users(user_id) on delete cascade,
  title text not null,
  due_date date null,
  note text not null default '',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.lab_clock_records (
  user_id text primary key references public.lab_users(user_id) on delete cascade,
  status text not null default 'out',
  last_action_type text not null default '',
  last_action_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.lab_clock_logs (
  id text primary key,
  user_id text not null references public.lab_users(user_id) on delete cascade,
  action_type text not null,
  status text not null,
  timestamp timestamptz not null,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.lab_users enable row level security;
alter table public.lab_presence_plans enable row level security;
alter table public.lab_tasks enable row level security;
alter table public.lab_clock_records enable row level security;
alter table public.lab_clock_logs enable row level security;

drop policy if exists "lab_users_public_select" on public.lab_users;
drop policy if exists "lab_users_public_insert" on public.lab_users;
drop policy if exists "lab_users_public_update" on public.lab_users;
drop policy if exists "lab_users_public_delete" on public.lab_users;
drop policy if exists "lab_presence_public_select" on public.lab_presence_plans;
drop policy if exists "lab_presence_public_insert" on public.lab_presence_plans;
drop policy if exists "lab_presence_public_update" on public.lab_presence_plans;
drop policy if exists "lab_presence_public_delete" on public.lab_presence_plans;
drop policy if exists "lab_tasks_public_select" on public.lab_tasks;
drop policy if exists "lab_tasks_public_insert" on public.lab_tasks;
drop policy if exists "lab_tasks_public_update" on public.lab_tasks;
drop policy if exists "lab_tasks_public_delete" on public.lab_tasks;
drop policy if exists "lab_clock_records_public_select" on public.lab_clock_records;
drop policy if exists "lab_clock_records_public_insert" on public.lab_clock_records;
drop policy if exists "lab_clock_records_public_update" on public.lab_clock_records;
drop policy if exists "lab_clock_records_public_delete" on public.lab_clock_records;
drop policy if exists "lab_clock_logs_public_select" on public.lab_clock_logs;
drop policy if exists "lab_clock_logs_public_insert" on public.lab_clock_logs;
drop policy if exists "lab_clock_logs_public_update" on public.lab_clock_logs;
drop policy if exists "lab_clock_logs_public_delete" on public.lab_clock_logs;

create policy "lab_users_public_select"
on public.lab_users
for select
to anon, authenticated
using (true);

create policy "lab_users_public_insert"
on public.lab_users
for insert
to anon, authenticated
with check (true);

create policy "lab_users_public_update"
on public.lab_users
for update
to anon, authenticated
using (true)
with check (true);

create policy "lab_users_public_delete"
on public.lab_users
for delete
to anon, authenticated
using (true);

create policy "lab_presence_public_select"
on public.lab_presence_plans
for select
to anon, authenticated
using (true);

create policy "lab_presence_public_insert"
on public.lab_presence_plans
for insert
to anon, authenticated
with check (true);

create policy "lab_presence_public_update"
on public.lab_presence_plans
for update
to anon, authenticated
using (true)
with check (true);

create policy "lab_presence_public_delete"
on public.lab_presence_plans
for delete
to anon, authenticated
using (true);

create policy "lab_tasks_public_select"
on public.lab_tasks
for select
to anon, authenticated
using (true);

create policy "lab_tasks_public_insert"
on public.lab_tasks
for insert
to anon, authenticated
with check (true);

create policy "lab_tasks_public_update"
on public.lab_tasks
for update
to anon, authenticated
using (true)
with check (true);

create policy "lab_tasks_public_delete"
on public.lab_tasks
for delete
to anon, authenticated
using (true);

create policy "lab_clock_records_public_select"
on public.lab_clock_records
for select
to anon, authenticated
using (true);

create policy "lab_clock_records_public_insert"
on public.lab_clock_records
for insert
to anon, authenticated
with check (true);

create policy "lab_clock_records_public_update"
on public.lab_clock_records
for update
to anon, authenticated
using (true)
with check (true);

create policy "lab_clock_records_public_delete"
on public.lab_clock_records
for delete
to anon, authenticated
using (true);

create policy "lab_clock_logs_public_select"
on public.lab_clock_logs
for select
to anon, authenticated
using (true);

create policy "lab_clock_logs_public_insert"
on public.lab_clock_logs
for insert
to anon, authenticated
with check (true);

create policy "lab_clock_logs_public_update"
on public.lab_clock_logs
for update
to anon, authenticated
using (true)
with check (true);

create policy "lab_clock_logs_public_delete"
on public.lab_clock_logs
for delete
to anon, authenticated
using (true);
