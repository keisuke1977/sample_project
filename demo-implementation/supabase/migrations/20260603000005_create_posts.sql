-- ============================================
-- Migration: 投稿テーブル作成
-- Purpose: 従業員ユーザーの投稿（CRUD デモ用）
-- Tables: posts
-- ============================================

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  title text not null,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.posts is '従業員ユーザーの投稿データを管理（CRUD デモ用）';

-- インデックス
create index idx_posts_user_id on public.posts (user_id);
create index idx_posts_created_at on public.posts (created_at desc);

-- RLS 有効化
alter table public.posts enable row level security;

-- SELECT: 本人のみ
create policy "posts_select_own" on public.posts
  for select to authenticated
  using (user_id = public.current_user_id());

-- INSERT: 本人のみ
create policy "posts_insert_own" on public.posts
  for insert to authenticated
  with check (user_id = public.current_user_id());

-- UPDATE: 本人のみ
create policy "posts_update_own" on public.posts
  for update to authenticated
  using (user_id = public.current_user_id())
  with check (user_id = public.current_user_id());

-- DELETE: 本人のみ
create policy "posts_delete_own" on public.posts
  for delete to authenticated
  using (user_id = public.current_user_id());

-- updated_at 自動更新トリガー
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();
