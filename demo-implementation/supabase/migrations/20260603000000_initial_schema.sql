-- ============================================
-- Migration: 初期スキーマ作成
-- Purpose: Femcare の基本テーブル構造を作成
-- Tables: companies, departments, invite_codes, users, admin_users,
--         consent_records, check_ins, check_in_symptoms, contents,
--         content_categories, specialists, specialist_slots,
--         consultations, consultation_messages, appointments, notifications
-- ============================================

-- 企業
create table public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  plan text not null default 'lite' check (plan in ('lite', 'standard', 'premium')),
  employee_limit integer not null default 1000,
  created_at timestamptz not null default now()
);
comment on table public.companies is '契約企業の基本情報を管理';

-- 部署
create table public.departments (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);
comment on table public.departments is '企業内の部署情報を管理';

create index idx_departments_company_id on public.departments (company_id);

-- 招待コード
create table public.invite_codes (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  code text not null unique,
  max_uses integer not null default 0,
  used_count integer not null default 0,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
comment on table public.invite_codes is '従業員登録用の招待コードを管理';

create index idx_invite_codes_company_id on public.invite_codes (company_id);
create index idx_invite_codes_code on public.invite_codes (code);

-- 従業員ユーザー
create table public.users (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null unique,
  company_id uuid not null references public.companies (id),
  department_id uuid references public.departments (id),
  age_group text not null check (age_group in ('20s', '30s', '40s', '50s')),
  life_stage text not null check (life_stage in ('menstrual', 'trying_to_conceive', 'postpartum', 'menopause')),
  consent_at timestamptz not null,
  deleted_at timestamptz,
  created_at timestamptz not null default now()
);
comment on table public.users is '従業員ユーザーのプロフィールと所属情報を管理';

create index idx_users_clerk_user_id on public.users (clerk_user_id);
create index idx_users_company_id on public.users (company_id);
create index idx_users_department_id on public.users (department_id);

-- 管理者ユーザー
create table public.admin_users (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null unique,
  company_id uuid not null references public.companies (id),
  role text not null default 'viewer' check (role in ('admin', 'viewer')),
  created_at timestamptz not null default now()
);
comment on table public.admin_users is '企業の人事担当者など管理者アカウントを管理';

create index idx_admin_users_clerk_user_id on public.admin_users (clerk_user_id);
create index idx_admin_users_company_id on public.admin_users (company_id);

-- 同意記録
create table public.consent_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  policy_version text not null,
  consented_at timestamptz not null default now()
);
comment on table public.consent_records is 'プライバシーポリシーへの同意履歴を管理';

create index idx_consent_records_user_id on public.consent_records (user_id);

-- 体調チェックイン
create table public.check_ins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  sleep_score smallint not null check (sleep_score between 1 and 5),
  fatigue_score smallint not null check (fatigue_score between 1 and 5),
  mood_score smallint not null check (mood_score between 1 and 5),
  menstrual_status text not null check (menstrual_status in ('menstrual', 'premenstrual', 'normal')),
  feedback_message text,
  check_date date not null,
  created_at timestamptz not null default now(),
  unique (user_id, check_date)
);
comment on table public.check_ins is '従業員の日次体調チェックイン記録を管理';

create index idx_check_ins_user_date on public.check_ins (user_id, check_date desc);
create index idx_check_ins_check_date on public.check_ins (check_date);

-- チェックイン症状
create table public.check_in_symptoms (
  id uuid primary key default gen_random_uuid(),
  check_in_id uuid not null references public.check_ins (id) on delete cascade,
  symptom text not null check (symptom in ('headache', 'abdominal_pain', 'bloating', 'hot_flash', 'fatigue', 'other'))
);
comment on table public.check_in_symptoms is 'チェックイン時に報告された症状を管理';

create index idx_check_in_symptoms_check_in_id on public.check_in_symptoms (check_in_id);

-- コンテンツカテゴリ
create table public.content_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  sort_order integer not null default 0
);
comment on table public.content_categories is 'コンテンツカテゴリのマスタデータを管理';

-- コンテンツ
create table public.contents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  category text not null check (category in ('menstrual', 'pms', 'menopause', 'pregnancy', 'mental')),
  content_type text not null default 'article' check (content_type in ('article', 'video')),
  thumbnail_url text,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now()
);
comment on table public.contents is '従業員向け健康コンテンツ（記事・動画）を管理';

create index idx_contents_category_published on public.contents (category, is_published, published_at desc);

-- 医療専門家
create table public.specialists (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null unique,
  display_name text not null,
  role text not null check (role in ('nurse', 'midwife', 'obgyn')),
  bio text,
  created_at timestamptz not null default now()
);
comment on table public.specialists is '看護師・助産師・産婦人科医などの専門家情報を管理';

create index idx_specialists_clerk_user_id on public.specialists (clerk_user_id);

-- 専門家の空き枠
create table public.specialist_slots (
  id uuid primary key default gen_random_uuid(),
  specialist_id uuid not null references public.specialists (id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  is_booked boolean not null default false,
  created_at timestamptz not null default now()
);
comment on table public.specialist_slots is '専門家の予約可能枠を管理';

create index idx_specialist_slots_specialist_starts on public.specialist_slots (specialist_id, starts_at);
create index idx_specialist_slots_starts_booked on public.specialist_slots (starts_at, is_booked);

-- 相談スレッド
create table public.consultations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id),
  specialist_id uuid references public.specialists (id),
  category text not null check (category in ('menstrual', 'pms', 'menopause', 'pregnancy', 'mental', 'other')),
  status text not null default 'pending' check (status in ('pending', 'active', 'closed')),
  created_at timestamptz not null default now(),
  closed_at timestamptz
);
comment on table public.consultations is '従業員と専門家間の相談スレッドを管理';

create index idx_consultations_user_id on public.consultations (user_id);
create index idx_consultations_specialist_id on public.consultations (specialist_id);

-- 相談メッセージ
create table public.consultation_messages (
  id uuid primary key default gen_random_uuid(),
  consultation_id uuid not null references public.consultations (id) on delete cascade,
  sender_type text not null check (sender_type in ('user', 'specialist', 'system')),
  body text not null,
  created_at timestamptz not null default now()
);
comment on table public.consultation_messages is '相談スレッド内のメッセージを管理';

create index idx_consultation_messages_consultation_created on public.consultation_messages (consultation_id, created_at asc);

-- 医師予約
create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id),
  specialist_id uuid not null references public.specialists (id),
  slot_id uuid not null unique references public.specialist_slots (id),
  consultation_type text not null check (consultation_type in ('text', 'video')),
  status text not null default 'scheduled' check (status in ('scheduled', 'completed', 'cancelled')),
  video_room_url text,
  scheduled_at timestamptz not null,
  created_at timestamptz not null default now()
);
comment on table public.appointments is '専門家との予約情報を管理';

create index idx_appointments_user_id on public.appointments (user_id);
create index idx_appointments_specialist_id on public.appointments (specialist_id);

-- 通知設定
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  type text not null check (type in ('checkin_reminder', 'consultation_reply')),
  channel text not null check (channel in ('push', 'email', 'both')),
  scheduled_time text,
  is_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  unique (user_id, type)
);
comment on table public.notifications is 'ユーザーごとの通知設定を管理';

create index idx_notifications_user_id on public.notifications (user_id);

-- RLS ヘルパー関数
create or replace function public.current_clerk_user_id()
returns text
language sql
stable
as $$
  select auth.jwt() ->> 'sub';
$$;

create or replace function public.current_user_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.users
  where clerk_user_id = public.current_clerk_user_id()
  and deleted_at is null
  limit 1;
$$;

create or replace function public.current_specialist_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.specialists
  where clerk_user_id = public.current_clerk_user_id()
  limit 1;
$$;

create or replace function public.current_admin_company_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select company_id from public.admin_users
  where clerk_user_id = public.current_clerk_user_id()
  limit 1;
$$;
