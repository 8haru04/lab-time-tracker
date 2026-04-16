create table if not exists public.lab_chat_messages (
  id text primary key,
  user_id text not null references public.lab_users(user_id) on delete cascade,
  message text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.lab_chat_messages enable row level security;

drop policy if exists "lab_chat_messages_public_select" on public.lab_chat_messages;
drop policy if exists "lab_chat_messages_public_insert" on public.lab_chat_messages;
drop policy if exists "lab_chat_messages_public_update" on public.lab_chat_messages;
drop policy if exists "lab_chat_messages_public_delete" on public.lab_chat_messages;

create policy "lab_chat_messages_public_select"
on public.lab_chat_messages
for select
to anon, authenticated
using (true);

create policy "lab_chat_messages_public_insert"
on public.lab_chat_messages
for insert
to anon, authenticated
with check (true);

create policy "lab_chat_messages_public_update"
on public.lab_chat_messages
for update
to anon, authenticated
using (true)
with check (true);

create policy "lab_chat_messages_public_delete"
on public.lab_chat_messages
for delete
to anon, authenticated
using (true);
