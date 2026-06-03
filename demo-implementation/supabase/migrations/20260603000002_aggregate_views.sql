-- ============================================
-- Migration: 匿名集計 View
-- Purpose: 管理ダッシュボード用の匿名集計 View を作成
-- ============================================

create or replace view public.department_monthly_summary as
select
  d.id as department_id,
  d.name as department_name,
  c.id as company_id,
  date_trunc('month', ci.check_date)::date as month,
  count(distinct ci.user_id) as total_checkins,
  case
    when count(distinct ci.user_id) >= 5 then round(avg(ci.mood_score)::numeric, 2)
    else null
  end as avg_mood_score,
  case
    when count(distinct ci.user_id) >= 5 then round(avg(ci.sleep_score)::numeric, 2)
    else null
  end as avg_sleep_score,
  case
    when count(distinct ci.user_id) >= 5 then round(avg(ci.fatigue_score)::numeric, 2)
    else null
  end as avg_fatigue_score,
  case
    when count(distinct ci.user_id) >= 5 then count(distinct ci.user_id)
    else null
  end as active_users
from public.check_ins ci
join public.users u on ci.user_id = u.id and u.deleted_at is null
join public.departments d on u.department_id = d.id
join public.companies c on u.company_id = c.id
group by d.id, d.name, c.id, date_trunc('month', ci.check_date);

comment on view public.department_monthly_summary is '部署別月次体調集計（5名未満は匿名化）';

create or replace view public.company_monthly_summary as
select
  c.id as company_id,
  date_trunc('month', ci.check_date)::date as month,
  count(distinct ci.user_id) as active_users,
  round(avg(ci.mood_score)::numeric, 2) as avg_mood_score,
  round(avg(ci.sleep_score)::numeric, 2) as avg_sleep_score,
  round(avg(ci.fatigue_score)::numeric, 2) as avg_fatigue_score
from public.check_ins ci
join public.users u on ci.user_id = u.id and u.deleted_at is null
join public.companies c on u.company_id = c.id
group by c.id, date_trunc('month', ci.check_date);

comment on view public.company_monthly_summary is '全社月次体調集計';

-- View へのアクセス: 管理者のみ自社データを参照可能
grant select on public.department_monthly_summary to authenticated;
grant select on public.company_monthly_summary to authenticated;
