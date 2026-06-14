-- ============================================
-- Migration: コミュニティ機能
-- Purpose: 同じ悩みを持つ女性従業員同士のコミュニティ
-- Tables: community_posts, community_post_likes, community_replies
-- ============================================

-- カテゴリ enum
create type public.community_category as enum (
  'menstruation',   -- 生理・月経
  'pregnancy',      -- 妊活・妊娠
  'menopause',      -- 更年期
  'work_life',      -- 仕事と育児
  'mental_health',  -- メンタルヘルス
  'career',         -- キャリア
  'other'           -- その他
);

-- 投稿テーブル
create table public.community_posts (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.users (id) on delete cascade,
  category     public.community_category not null default 'other',
  title        text not null,
  content      text not null,
  is_anonymous boolean not null default false,
  likes_count  integer not null default 0,
  replies_count integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
comment on table public.community_posts is 'コミュニティへの投稿';

create index idx_community_posts_user_id  on public.community_posts (user_id);
create index idx_community_posts_category on public.community_posts (category);
create index idx_community_posts_created  on public.community_posts (created_at desc);

-- いいねテーブル（1ユーザー1投稿につき1いいね）
create table public.community_post_likes (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references public.community_posts (id) on delete cascade,
  user_id    uuid not null references public.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (post_id, user_id)
);
comment on table public.community_post_likes is '投稿へのいいね（1ユーザー1投稿まで）';

create index idx_community_likes_post_id on public.community_post_likes (post_id);
create index idx_community_likes_user_id on public.community_post_likes (user_id);

-- 返信テーブル
create table public.community_replies (
  id           uuid primary key default gen_random_uuid(),
  post_id      uuid not null references public.community_posts (id) on delete cascade,
  user_id      uuid not null references public.users (id) on delete cascade,
  content      text not null,
  is_anonymous boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
comment on table public.community_replies is '投稿への返信';

create index idx_community_replies_post_id on public.community_replies (post_id);
create index idx_community_replies_user_id on public.community_replies (user_id);

-- ============================================
-- RLS
-- ============================================

alter table public.community_posts      enable row level security;
alter table public.community_post_likes enable row level security;
alter table public.community_replies    enable row level security;

-- community_posts: 認証済みユーザー全員が閲覧・投稿可能、編集削除は本人のみ
create policy "cp_select_all"  on public.community_posts for select to authenticated using (true);
create policy "cp_insert_own"  on public.community_posts for insert to authenticated with check (user_id = public.current_user_id());
create policy "cp_update_own"  on public.community_posts for update to authenticated using (user_id = public.current_user_id());
create policy "cp_delete_own"  on public.community_posts for delete to authenticated using (user_id = public.current_user_id());

-- community_post_likes: 認証済みユーザー全員が閲覧・操作可能
create policy "cpl_select_all" on public.community_post_likes for select to authenticated using (true);
create policy "cpl_insert_own" on public.community_post_likes for insert to authenticated with check (user_id = public.current_user_id());
create policy "cpl_delete_own" on public.community_post_likes for delete to authenticated using (user_id = public.current_user_id());

-- community_replies: 認証済みユーザー全員が閲覧・返信可能、削除は本人のみ
create policy "cr_select_all"  on public.community_replies for select to authenticated using (true);
create policy "cr_insert_own"  on public.community_replies for insert to authenticated with check (user_id = public.current_user_id());
create policy "cr_delete_own"  on public.community_replies for delete to authenticated using (user_id = public.current_user_id());

-- ============================================
-- いいね数・返信数を自動更新するトリガー
-- ============================================

-- いいね追加時: likes_count +1
create or replace function public.increment_likes_count()
returns trigger language plpgsql as $$
begin
  update public.community_posts
  set likes_count = likes_count + 1
  where id = new.post_id;
  return new;
end;
$$;

create trigger community_likes_insert
  after insert on public.community_post_likes
  for each row execute function public.increment_likes_count();

-- いいね削除時: likes_count -1
create or replace function public.decrement_likes_count()
returns trigger language plpgsql as $$
begin
  update public.community_posts
  set likes_count = greatest(0, likes_count - 1)
  where id = old.post_id;
  return old;
end;
$$;

create trigger community_likes_delete
  after delete on public.community_post_likes
  for each row execute function public.decrement_likes_count();

-- 返信追加時: replies_count +1
create or replace function public.increment_replies_count()
returns trigger language plpgsql as $$
begin
  update public.community_posts
  set replies_count = replies_count + 1
  where id = new.post_id;
  return new;
end;
$$;

create trigger community_replies_insert
  after insert on public.community_replies
  for each row execute function public.increment_replies_count();

-- 返信削除時: replies_count -1
create or replace function public.decrement_replies_count()
returns trigger language plpgsql as $$
begin
  update public.community_posts
  set replies_count = greatest(0, replies_count - 1)
  where id = old.post_id;
  return old;
end;
$$;

create trigger community_replies_delete
  after delete on public.community_replies
  for each row execute function public.decrement_replies_count();

-- updated_at 自動更新（投稿）
create trigger community_posts_updated_at
  before update on public.community_posts
  for each row execute function public.set_updated_at();

-- updated_at 自動更新（返信）
create trigger community_replies_updated_at
  before update on public.community_replies
  for each row execute function public.set_updated_at();
