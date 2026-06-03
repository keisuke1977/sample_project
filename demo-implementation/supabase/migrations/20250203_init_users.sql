-- ============================================
-- Migration: 初期スキーマ作成 (Clerk統合版)
-- Purpose: ユーザーテーブルの作成とRLS設定
-- 注意: 開発環境向け。先頭で public.users を削除してから作り直します
-- ============================================

-- ① 既存の残骸を完全削除（Table Editor から消した後もポリシー等が残る場合がある）
drop table if exists public.users cascade;

-- ② テーブル作成
create table public.users (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text unique not null,
  email text not null,
  full_name text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);
comment on table public.users is 'アプリケーションのユーザー情報を管理 (Clerkと同期)';

-- ③ RLS の有効化
alter table public.users enable row level security;

-- ④ RLS ポリシー
create policy "users_select_own_data" on public.users
  for select to authenticated
  using (clerk_user_id = auth.jwt() ->> 'sub');

create policy "users_insert_own_data" on public.users
  for insert to authenticated
  with check (clerk_user_id = auth.jwt() ->> 'sub');

create policy "users_update_own_data" on public.users
  for update to authenticated
  using (clerk_user_id = auth.jwt() ->> 'sub')
  with check (clerk_user_id = auth.jwt() ->> 'sub');

-- ⑤ インデックス
create index idx_users_clerk_user_id on public.users (clerk_user_id);

-- ⑥ 確認用（Success 後、Results に 1 行返れば OK）
select 'users テーブル作成完了' as status, count(*) as row_count from public.users;
