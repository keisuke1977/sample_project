-- ============================================
-- Migration: RLS ポリシー
-- Purpose: Femcare 全テーブルの Row Level Security を設定
-- ============================================

-- companies
alter table public.companies enable row level security;

create policy "companies_select_admin" on public.companies
  for select to authenticated
  using (id = public.current_admin_company_id());

-- departments
alter table public.departments enable row level security;

create policy "departments_select_admin" on public.departments
  for select to authenticated
  using (company_id = public.current_admin_company_id());

create policy "departments_select_employee" on public.departments
  for select to authenticated
  using (
    company_id in (
      select company_id from public.users
      where clerk_user_id = public.current_clerk_user_id()
      and deleted_at is null
    )
  );

-- invite_codes
alter table public.invite_codes enable row level security;

create policy "invite_codes_select_admin" on public.invite_codes
  for select to authenticated
  using (company_id = public.current_admin_company_id());

-- users
alter table public.users enable row level security;

create policy "users_select_own" on public.users
  for select to authenticated
  using (clerk_user_id = public.current_clerk_user_id());

create policy "users_update_own" on public.users
  for update to authenticated
  using (clerk_user_id = public.current_clerk_user_id())
  with check (clerk_user_id = public.current_clerk_user_id());

-- admin_users
alter table public.admin_users enable row level security;

create policy "admin_users_select_own" on public.admin_users
  for select to authenticated
  using (clerk_user_id = public.current_clerk_user_id());

-- consent_records
alter table public.consent_records enable row level security;

create policy "consent_records_select_own" on public.consent_records
  for select to authenticated
  using (user_id = public.current_user_id());

create policy "consent_records_insert_own" on public.consent_records
  for insert to authenticated
  with check (user_id = public.current_user_id());

-- check_ins
alter table public.check_ins enable row level security;

create policy "check_ins_select_own" on public.check_ins
  for select to authenticated
  using (user_id = public.current_user_id());

create policy "check_ins_insert_own" on public.check_ins
  for insert to authenticated
  with check (user_id = public.current_user_id());

create policy "check_ins_update_own" on public.check_ins
  for update to authenticated
  using (user_id = public.current_user_id())
  with check (user_id = public.current_user_id());

create policy "check_ins_delete_own" on public.check_ins
  for delete to authenticated
  using (user_id = public.current_user_id());

-- check_in_symptoms
alter table public.check_in_symptoms enable row level security;

create policy "check_in_symptoms_select_own" on public.check_in_symptoms
  for select to authenticated
  using (
    check_in_id in (
      select id from public.check_ins where user_id = public.current_user_id()
    )
  );

create policy "check_in_symptoms_insert_own" on public.check_in_symptoms
  for insert to authenticated
  with check (
    check_in_id in (
      select id from public.check_ins where user_id = public.current_user_id()
    )
  );

-- contents（公開コンテンツは全認証ユーザーが閲覧可能）
alter table public.contents enable row level security;

create policy "contents_select_published" on public.contents
  for select to authenticated
  using (is_published = true);

-- content_categories
alter table public.content_categories enable row level security;

create policy "content_categories_select_all" on public.content_categories
  for select to authenticated
  using (true);

-- specialists
alter table public.specialists enable row level security;

create policy "specialists_select_all" on public.specialists
  for select to authenticated
  using (true);

create policy "specialists_update_own" on public.specialists
  for update to authenticated
  using (clerk_user_id = public.current_clerk_user_id())
  with check (clerk_user_id = public.current_clerk_user_id());

-- specialist_slots
alter table public.specialist_slots enable row level security;

create policy "specialist_slots_select_all" on public.specialist_slots
  for select to authenticated
  using (true);

-- consultations
alter table public.consultations enable row level security;

create policy "consultations_select_employee" on public.consultations
  for select to authenticated
  using (user_id = public.current_user_id());

create policy "consultations_insert_employee" on public.consultations
  for insert to authenticated
  with check (user_id = public.current_user_id());

create policy "consultations_update_employee" on public.consultations
  for update to authenticated
  using (user_id = public.current_user_id())
  with check (user_id = public.current_user_id());

create policy "consultations_select_specialist" on public.consultations
  for select to authenticated
  using (specialist_id = public.current_specialist_id());

create policy "consultations_update_specialist" on public.consultations
  for update to authenticated
  using (specialist_id = public.current_specialist_id())
  with check (specialist_id = public.current_specialist_id());

-- consultation_messages
alter table public.consultation_messages enable row level security;

create policy "consultation_messages_select_employee" on public.consultation_messages
  for select to authenticated
  using (
    consultation_id in (
      select id from public.consultations where user_id = public.current_user_id()
    )
  );

create policy "consultation_messages_insert_employee" on public.consultation_messages
  for insert to authenticated
  with check (
    consultation_id in (
      select id from public.consultations where user_id = public.current_user_id()
    )
    and sender_type = 'user'
  );

create policy "consultation_messages_select_specialist" on public.consultation_messages
  for select to authenticated
  using (
    consultation_id in (
      select id from public.consultations where specialist_id = public.current_specialist_id()
    )
  );

create policy "consultation_messages_insert_specialist" on public.consultation_messages
  for insert to authenticated
  with check (
    consultation_id in (
      select id from public.consultations where specialist_id = public.current_specialist_id()
    )
    and sender_type = 'specialist'
  );

-- appointments
alter table public.appointments enable row level security;

create policy "appointments_select_own" on public.appointments
  for select to authenticated
  using (user_id = public.current_user_id());

create policy "appointments_insert_own" on public.appointments
  for insert to authenticated
  with check (user_id = public.current_user_id());

create policy "appointments_update_own" on public.appointments
  for update to authenticated
  using (user_id = public.current_user_id())
  with check (user_id = public.current_user_id());

create policy "appointments_select_specialist" on public.appointments
  for select to authenticated
  using (specialist_id = public.current_specialist_id());

-- notifications
alter table public.notifications enable row level security;

create policy "notifications_select_own" on public.notifications
  for select to authenticated
  using (user_id = public.current_user_id());

create policy "notifications_insert_own" on public.notifications
  for insert to authenticated
  with check (user_id = public.current_user_id());

create policy "notifications_update_own" on public.notifications
  for update to authenticated
  using (user_id = public.current_user_id())
  with check (user_id = public.current_user_id());

create policy "notifications_delete_own" on public.notifications
  for delete to authenticated
  using (user_id = public.current_user_id());
