-- ============================================
-- Migration: Realtime Triggers
-- Purpose: consultation_messages のリアルタイム更新（broadcast）
-- ============================================

create or replace function public.broadcast_consultation_message_changes()
returns trigger
security definer
language plpgsql
set search_path = public
as $$
begin
  perform realtime.broadcast_changes(
    'consultation:' || coalesce(new.consultation_id, old.consultation_id)::text || ':messages',
    tg_op,
    tg_op,
    tg_table_name,
    tg_table_schema,
    new,
    old
  );
  return coalesce(new, old);
end;
$$;

create trigger consultation_messages_realtime_trigger
  after insert or update or delete on public.consultation_messages
  for each row execute function public.broadcast_consultation_message_changes();

-- realtime.messages テーブルの RLS ポリシー
create policy "consultation_participants_can_receive" on realtime.messages
  for select to authenticated
  using (
    topic like 'consultation:%:messages'
    and (
      exists (
        select 1 from public.consultations c
        join public.users u on c.user_id = u.id
        where c.id = split_part(topic, ':', 2)::uuid
        and u.clerk_user_id = public.current_clerk_user_id()
      )
      or exists (
        select 1 from public.consultations c
        join public.specialists s on c.specialist_id = s.id
        where c.id = split_part(topic, ':', 2)::uuid
        and s.clerk_user_id = public.current_clerk_user_id()
      )
    )
  );

create policy "consultation_participants_can_send" on realtime.messages
  for insert to authenticated
  with check (
    topic like 'consultation:%:messages'
    and (
      exists (
        select 1 from public.consultations c
        join public.users u on c.user_id = u.id
        where c.id = split_part(topic, ':', 2)::uuid
        and u.clerk_user_id = public.current_clerk_user_id()
      )
      or exists (
        select 1 from public.consultations c
        join public.specialists s on c.specialist_id = s.id
        where c.id = split_part(topic, ':', 2)::uuid
        and s.clerk_user_id = public.current_clerk_user_id()
      )
    )
  );

create index idx_consultations_id_user on public.consultations (id, user_id);
create index idx_consultations_id_specialist on public.consultations (id, specialist_id);
