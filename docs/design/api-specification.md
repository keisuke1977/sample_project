# API 仕様書 — Femcare（仮）

**バージョン:** 1.0.0  
**作成日:** 2026-06-02  
**参照元:** `docs/output/detailed_requirements_specification.md` § 8  
**ベース URL:** `https://femcare.example.com/api`（本番）/ `http://localhost:3000/api`（開発）

---

## 1. 設計原則

| 原則 | 詳細 |
|------|------|
| **RESTful 設計** | リソース名は名詞・複数形。HTTP メソッド（GET / POST / PATCH / DELETE）でアクション表現 |
| **Next.js Route Handlers** | `src/app/api/[endpoint]/route.ts` として実装。サーバーレス関数として Vercel にデプロイ |
| **JSON 形式** | リクエスト・レスポンスはすべて `application/json`（PDF ダウンロードを除く） |
| **snake_case** | フィールド名はすべて snake_case |
| **エラーレスポンス統一** | 全エラーは `{ "error": { "code": "...", "message": "..." } }` 形式 |
| **冪等性** | GET は副作用なし。POST は冪等でないリソース作成。PATCH は部分更新 |

---

## 2. 認証・認可

### 2.1 認証方式

全 API エンドポイントは **Clerk JWT** による Bearer トークン認証が必要（一部公開 API を除く）。

```
Authorization: Bearer <clerk_jwt_token>
```

Clerk JWT に含まれる `sub`（Clerk User ID）を使って Supabase RLS が自動的にアクセス制御を行う。

### 2.2 権限（ロール）

| ロール | 対象エンドポイント |
|--------|-----------------|
| `employee` | `/api/checkins/*`, `/api/consultations/*`, `/api/contents/*`, `/api/appointments/*`, `/api/users/me` |
| `admin` | `/api/admin/*` |
| `specialist` | `/api/specialist/*` |

### 2.3 共通エラーコード

| HTTP ステータス | コード | 説明 |
|----------------|--------|------|
| 400 | `INVALID_INPUT` | バリデーションエラー |
| 401 | `UNAUTHORIZED` | 認証トークン不正・期限切れ |
| 403 | `FORBIDDEN` | 権限不足 |
| 404 | `NOT_FOUND` | リソースが存在しない |
| 409 | `CONFLICT` | 重複リソース・競合 |
| 429 | `RATE_LIMITED` | レート制限超過 |
| 500 | `INTERNAL_ERROR` | サーバー内部エラー |

---

## 3. エンドポイント一覧

### 3.1 認証・ユーザー管理

| メソッド | パス | 説明 | ロール |
|---------|------|------|--------|
| `POST` | `/api/auth/validate-invite` | 招待コードの有効性検証 | 未認証 |
| `POST` | `/api/users/me/profile` | プロフィール初期設定 | employee |
| `GET` | `/api/users/me` | 自分のプロフィール取得 | employee |
| `PATCH` | `/api/users/me` | プロフィール更新 | employee |
| `POST` | `/api/users/me/consent` | プライバシー同意記録 | employee |

---

### 3.2 体調チェックイン

| メソッド | パス | 説明 | ロール |
|---------|------|------|--------|
| `POST` | `/api/checkins` | チェックイン送信・フィードバック取得 | employee |
| `GET` | `/api/checkins/today` | 本日のチェックイン状態確認 | employee |
| `GET` | `/api/checkins/history` | チェックイン履歴一覧（ページネーション） | employee |

---

### 3.3 コンテンツ

| メソッド | パス | 説明 | ロール |
|---------|------|------|--------|
| `GET` | `/api/contents` | コンテンツ一覧（カテゴリ・種別フィルタ） | employee |
| `GET` | `/api/contents/:id` | コンテンツ詳細 | employee |
| `GET` | `/api/contents/recommended` | チェックイン結果に基づくレコメンド | employee |

---

### 3.4 専門家相談（チャット）

| メソッド | パス | 説明 | ロール |
|---------|------|------|--------|
| `POST` | `/api/consultations` | 相談スレッド作成 | employee |
| `GET` | `/api/consultations` | 自分の相談一覧 | employee |
| `GET` | `/api/consultations/:id` | 相談詳細・メッセージ一覧 | employee / specialist |
| `POST` | `/api/consultations/:id/messages` | メッセージ送信 | employee / specialist |

---

### 3.5 医師予約・ビデオ相談

| メソッド | パス | 説明 | ロール |
|---------|------|------|--------|
| `GET` | `/api/specialists/slots` | 利用可能な空き枠一覧 | employee |
| `POST` | `/api/appointments` | 予約作成 | employee |
| `GET` | `/api/appointments/:id` | 予約詳細取得 | employee / specialist |
| `PATCH` | `/api/appointments/:id/cancel` | 予約キャンセル | employee |
| `POST` | `/api/appointments/:id/video-room` | Daily.co ビデオルーム作成 | employee / specialist |

---

### 3.6 通知設定

| メソッド | パス | 説明 | ロール |
|---------|------|------|--------|
| `GET` | `/api/notifications/settings` | 通知設定取得 | employee |
| `PATCH` | `/api/notifications/settings` | 通知設定更新 | employee |
| `POST` | `/api/notifications/push/subscribe` | Web Push 購読登録 | employee |

---

### 3.7 管理ダッシュボード

| メソッド | パス | 説明 | ロール |
|---------|------|------|--------|
| `GET` | `/api/admin/dashboard/summary` | 全社月次サマリー | admin |
| `GET` | `/api/admin/dashboard/departments` | 部署別分析データ | admin |
| `GET` | `/api/admin/employees` | 従業員一覧・利用状況 | admin |
| `POST` | `/api/admin/employees/invite` | 従業員一括招待（CSV） | admin |
| `POST` | `/api/admin/reports/generate` | PDF レポート生成 | admin |
| `GET` | `/api/admin/reports/:id/download` | 生成済みレポートのダウンロード | admin |

---

## 4. エンドポイント詳細仕様

### `POST /api/auth/validate-invite`

**概要:** 招待コードの有効性・期限・使用可能回数を検証する（認証不要）

**リクエスト:**
```json
{
  "code": "FEMCARE2026AB"
}
```

**レスポンス 200 OK:**
```json
{
  "valid": true,
  "company_name": "株式会社サンプル",
  "expires_at": "2026-07-01T00:00:00Z"
}
```

**エラーレスポンス 400:**
```json
{
  "error": {
    "code": "INVALID_INVITE_CODE",
    "message": "このリンクは無効または期限切れです。人事担当者にご確認ください。"
  }
}
```

---

### `POST /api/checkins`

**概要:** 体調チェックイン回答を送信し、パーソナライズされたフィードバックを返す

**認証:** Bearer JWT（employee ロール）

**リクエスト:**
```json
{
  "sleep_score": 3,
  "fatigue_score": 2,
  "mood_score": 2,
  "menstrual_status": "premenstrual",
  "symptoms": ["headache", "bloating"],
  "check_date": "2026-06-02"
}
```

**バリデーション:**
- `sleep_score`, `fatigue_score`, `mood_score`: 1〜5 の整数
- `menstrual_status`: `menstrual` / `premenstrual` / `normal` のいずれか
- `symptoms`: 配列（空配列可）。各要素は許可リスト内の値
- `check_date`: YYYY-MM-DD 形式・当日の日付のみ受付

**レスポンス 201 Created:**
```json
{
  "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "check_date": "2026-06-02",
  "feedback_message": "月経前の時期です。イライラや集中力の低下はPMSのサインかもしれません。無理せず休息を取りましょう。",
  "recommended_contents": [
    {
      "id": "content-001",
      "title": "PMSを乗り越える5つのセルフケア",
      "category": "pms",
      "thumbnail_url": "https://..."
    },
    {
      "id": "content-002",
      "title": "月経前の食事で症状を和らげる方法",
      "category": "menstrual",
      "thumbnail_url": "https://..."
    }
  ]
}
```

**エラーレスポンス 409:**
```json
{
  "error": {
    "code": "ALREADY_CHECKED_IN",
    "message": "本日分のチェックインはすでに完了しています。"
  }
}
```

---

### `GET /api/checkins/today`

**概要:** 本日のチェックイン完了状態を確認する（ホーム画面の CTA 表示制御に使用）

**認証:** Bearer JWT（employee ロール）

**レスポンス 200 OK（未完了）:**
```json
{
  "completed": false,
  "check_date": "2026-06-02"
}
```

**レスポンス 200 OK（完了済み）:**
```json
{
  "completed": true,
  "check_date": "2026-06-02",
  "checkin_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "feedback_message": "...",
  "recommended_contents": [...]
}
```

---

### `GET /api/contents`

**概要:** コンテンツ一覧を取得する（カテゴリ・種別フィルタ対応）

**認証:** Bearer JWT（employee ロール）

**クエリパラメータ:**
- `category`: `menstrual` / `pms` / `menopause` / `pregnancy` / `mental`（任意）
- `content_type`: `article` / `video`（任意）
- `limit`: 取得件数（デフォルト: 20、最大: 50）
- `offset`: オフセット（デフォルト: 0）

**レスポンス 200 OK:**
```json
{
  "contents": [
    {
      "id": "content-001",
      "title": "PMSを乗り越える5つのセルフケア",
      "category": "pms",
      "content_type": "article",
      "thumbnail_url": "https://...",
      "published_at": "2026-05-15T09:00:00Z"
    }
  ],
  "total": 42,
  "limit": 20,
  "offset": 0
}
```

---

### `POST /api/consultations`

**概要:** 新しい相談スレッドを作成し、担当看護師・助産師へ通知する

**認証:** Bearer JWT（employee ロール）

**リクエスト:**
```json
{
  "category": "pms",
  "initial_message": "月経前になると頭痛がひどくなります。受診すべきでしょうか？",
  "attach_check_in_history": true
}
```

**レスポンス 201 Created:**
```json
{
  "consultation_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "status": "pending",
  "category": "pms",
  "estimated_response_hours": 24,
  "created_at": "2026-06-02T10:00:00Z"
}
```

---

### `POST /api/consultations/:id/messages`

**概要:** 既存の相談スレッドにメッセージを送信する。Supabase Realtime で相手に即時通知される

**認証:** Bearer JWT（employee または specialist ロール）

**リクエスト:**
```json
{
  "body": "いつ頃から頭痛が始まりますか？"
}
```

**レスポンス 201 Created:**
```json
{
  "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "consultation_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "sender_type": "specialist",
  "body": "いつ頃から頭痛が始まりますか？",
  "created_at": "2026-06-02T11:30:00Z"
}
```

---

### `POST /api/appointments`

**概要:** 産婦人科医の空き枠を予約する。Daily.co ビデオルームを非同期で作成（video の場合）

**認証:** Bearer JWT（employee ロール）

**リクエスト:**
```json
{
  "slot_id": "slot-uuid",
  "consultation_type": "video"
}
```

**レスポンス 201 Created:**
```json
{
  "id": "appointment-uuid",
  "specialist": {
    "display_name": "産婦人科医 B",
    "role": "obgyn"
  },
  "consultation_type": "video",
  "scheduled_at": "2026-06-05T14:00:00Z",
  "status": "scheduled",
  "video_room_url": null
}
```

> `video_room_url` はビデオ通話開始 15 分前に `/api/appointments/:id/video-room` を呼び出して取得する。

---

### `POST /api/appointments/:id/video-room`

**概要:** Daily.co ビデオルームを作成し、入室 URL を返す

**認証:** Bearer JWT（employee または specialist ロール）

**リクエスト:** なし（パラメータなし）

**レスポンス 200 OK:**
```json
{
  "video_room_url": "https://femcare.daily.co/room-xxxxxxxx",
  "token": "eyJ...",
  "expires_at": "2026-06-05T15:00:00Z"
}
```

---

### `POST /api/admin/employees/invite`

**概要:** CSV ファイルをアップロードして従業員に招待メールを一括送信する

**認証:** Bearer JWT（admin ロール）  
**Content-Type:** `multipart/form-data`

**リクエスト:**
```
FormData:
  - file: employees.csv (UTF-8, カラム: email, department_name)
  - department_id: uuid (任意)
```

**CSV フォーマット例:**
```csv
email,department_name
tanaka@example.com,営業部
suzuki@example.com,人事部
```

**レスポンス 200 OK:**
```json
{
  "total": 50,
  "success": 48,
  "failed": 2,
  "errors": [
    { "row": 12, "email": "invalid-email", "reason": "メールアドレスの形式が正しくありません" },
    { "row": 31, "email": "already@example.com", "reason": "すでに登録済みのメールアドレスです" }
  ]
}
```

---

### `GET /api/admin/dashboard/summary`

**概要:** 全社または部署別の月次体調傾向サマリーを取得する（匿名集計・5 名未満グループは null）

**認証:** Bearer JWT（admin ロール）

**クエリパラメータ:**
- `month`: YYYY-MM 形式（デフォルト: 当月）
- `department_id`: 部署 UUID（任意。未指定で全社）

**レスポンス 200 OK:**
```json
{
  "month": "2026-05",
  "company": {
    "active_rate": 0.65,
    "consultation_rate": 0.22,
    "avg_mood_score": 3.4,
    "avg_sleep_score": 3.1,
    "avg_fatigue_score": 2.8
  },
  "departments": [
    {
      "department_id": "dept-001",
      "department_name": "営業部",
      "active_users": 28,
      "avg_mood_score": 3.2,
      "avg_sleep_score": 2.9,
      "top_symptoms": ["fatigue", "headache", "bloating"]
    },
    {
      "department_id": "dept-002",
      "department_name": "開発部",
      "active_users": null,
      "avg_mood_score": null,
      "avg_sleep_score": null,
      "top_symptoms": null,
      "anonymization_note": "5名未満のためデータを表示できません"
    }
  ]
}
```

---

### `POST /api/admin/reports/generate`

**概要:** 指定した期間・フォーマットで PDF レポートを生成する（非同期生成）

**認証:** Bearer JWT（admin ロール）

**リクエスト:**
```json
{
  "report_type": "monthly",
  "period": {
    "from": "2026-05-01",
    "to": "2026-05-31"
  },
  "department_ids": ["dept-001", "dept-002"],
  "format": "kenkokeiei_v2026"
}
```

**`format` の選択肢:**
- `monthly_internal`: 社内月次レポート
- `kenkokeiei_v2026`: 健康経営優良法人認定用（経産省 2026 年度版）
- `kenpo`: 健保組合提出用（Phase 2）

**レスポンス 202 Accepted（非同期生成）:**
```json
{
  "report_id": "report-uuid",
  "status": "generating",
  "estimated_seconds": 30
}
```

**レスポンス 200 OK（生成完了後、ポーリングまたは完了通知で取得）:**
```json
{
  "report_id": "report-uuid",
  "status": "ready",
  "download_url": "https://storage.supabase.co/object/sign/reports/...",
  "expires_at": "2026-06-03T10:00:00Z"
}
```

---

## 5. レート制限

| エンドポイント | 制限 |
|--------------|------|
| `POST /api/checkins` | 10 回 / ユーザー / 時間 |
| `POST /api/consultations` | 5 回 / ユーザー / 日 |
| `POST /api/consultations/:id/messages` | 30 回 / ユーザー / 時間 |
| `POST /api/admin/reports/generate` | 10 回 / 管理者 / 時間 |
| その他 GET 系 | 100 回 / ユーザー / 分 |

レート制限超過時は HTTP 429 と `Retry-After` ヘッダーを返す。

---

## 6. Webhook

### `POST /api/webhooks/clerk` — Clerk イベント受信

Clerk からのユーザー作成・削除イベントを受信し、Supabase の `users` / `admin_users` テーブルと同期する。

**検証:** `svix-id`, `svix-timestamp`, `svix-signature` ヘッダーで署名を検証

**処理するイベント:**
- `user.created` → `users` テーブルにレコード作成
- `user.deleted` → `users.deleted_at` を更新（論理削除）
- `organizationMembership.created` → 管理者ロールの付与
