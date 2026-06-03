# ✅ Supabase + Clerk 統合完了レポート

実装日: 2026-06-03

## 📦 インストールされたパッケージ

- @clerk/nextjs: ^7.4.2
- @supabase/supabase-js: ^2.107.0
- @supabase/ssr: ^0.10.3
- zod: ^4.4.3

## 🗄️ データベース構造

### 作成されたテーブル（16テーブル）

| テーブル | 説明 |
|---------|------|
| `companies` | 契約企業 |
| `departments` | 部署 |
| `invite_codes` | 従業員招待コード |
| `users` | 従業員ユーザー |
| `admin_users` | 管理者（人事担当） |
| `consent_records` | プライバシーポリシー同意記録 |
| `check_ins` | 日次体調チェックイン |
| `check_in_symptoms` | チェックイン症状 |
| `contents` | 健康コンテンツ |
| `content_categories` | コンテンツカテゴリ |
| `specialists` | 医療専門家 |
| `specialist_slots` | 専門家の予約枠 |
| `consultations` | 相談スレッド |
| `consultation_messages` | 相談メッセージ（Realtime 対象） |
| `appointments` | 医師予約 |
| `notifications` | 通知設定 |

### 集計 View

- `department_monthly_summary` — 部署別月次集計（5名未満は匿名化）
- `company_monthly_summary` — 全社月次集計

### マイグレーションファイル

```
supabase/migrations/
├── 20260603000000_initial_schema.sql
├── 20260603000001_rls_policies.sql
├── 20260603000002_aggregate_views.sql
└── 20260603000003_realtime_triggers.sql
```

## 🔐 認証フロー

1. ユーザーが Clerk（Google OAuth / Email）でサインイン
2. `middleware.ts` が Clerk セッションと Supabase セッションを更新
3. Protected Layout（`/employee/*`, `/admin/*`）で `auth()` による認証チェック
4. `ensureSupabaseUser()` で Supabase 上のユーザーレコード（従業員 / 管理者 / 専門家）を取得
5. CRUD 操作は Server Actions 経由で `createServiceRoleClient()` を使用
6. RLS ポリシーは `auth.jwt() ->> 'sub'` = `clerk_user_id` でアクセス制御

> **注意:** Clerk JWT を Supabase RLS で使用するには、Clerk Dashboard と Supabase Dashboard で JWT 統合を設定する必要があります。
> 参考: https://clerk.com/docs/integrations/databases/supabase

## 🔌 Server Actions

| ファイル | 操作 |
|---------|------|
| `app/actions/checkin.ts` | チェックイン送信・取得 |
| `app/actions/consultation.ts` | 相談作成・メッセージ送信・取得 |

## 📁 作成されたファイル

```
demo-implementation/
├── middleware.ts
├── .env.local.example
├── lib/
│   ├── clerk/utils.ts
│   └── supabase/
│       ├── client.ts
│       ├── server.ts
│       ├── service-role.ts
│       ├── auth-helpers.ts
│       ├── types.ts
│       └── realtime.ts
├── app/
│   ├── sign-in/[[...sign-in]]/page.tsx
│   ├── sign-up/[[...sign-up]]/page.tsx
│   ├── actions/checkin.ts
│   ├── actions/consultation.ts
│   └── employee/loading.tsx, error.tsx
├── components/header.tsx
└── hooks/use-supabase-user.ts
```

## 📝 次のステップ

1. [ ] `.env.local` に Clerk / Supabase の API キーを設定
2. [ ] Supabase SQL Editor または CLI でマイグレーションを実行
3. [ ] Clerk Dashboard で Google OAuth を有効化
4. [ ] Clerk ↔ Supabase JWT 統合を設定
5. [ ] 招待コード登録フローの UI 実装
6. [ ] デモ画面の mock-data から Supabase データへの移行
7. [ ] Realtime 機能の動作確認（相談チャット）

## 🐛 既知の制限事項

- 従業員ユーザーは招待コード登録が必要（`ensureSupabaseUser()` は既存レコードの取得のみ）
- デモ画面は引き続き `mock-data.ts` を使用（DB 接続後に段階的に移行可能）
- Clerk JWT 統合未設定の場合、クライアント側 Supabase クエリの RLS は動作しない（Server Actions の Service Role は動作）

## 📖 参考リソース

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk + Supabase 統合ガイド](https://clerk.com/docs/integrations/databases/supabase)
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase RLS ガイド](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js App Router](https://nextjs.org/docs/app)
