import { auth, currentUser } from '@clerk/nextjs/server'
import { createServiceRoleClient } from './service-role'
import type { Database } from './types'

type EmployeeUser = Database['public']['Tables']['users']['Row']
type AdminUser = Database['public']['Tables']['admin_users']['Row']
type Specialist = Database['public']['Tables']['specialists']['Row']

export type SupabaseAppUser =
  | ({ type: 'employee' } & EmployeeUser)
  | ({ type: 'admin' } & AdminUser)
  | ({ type: 'specialist' } & Specialist)

/** ローカル開発用のデフォルト企業 ID（自動作成） */
const DEFAULT_COMPANY_ID = '00000000-0000-0000-0000-000000000001'

export async function getSupabaseUserByClerkId(): Promise<SupabaseAppUser | null> {
  const { userId } = await auth()
  if (!userId) return null

  const supabase = createServiceRoleClient()

  const { data: employee } = await supabase
    .from('users')
    .select('*')
    .eq('clerk_user_id', userId)
    .maybeSingle()

  if (employee) return { type: 'employee', ...employee }

  const { data: admin } = await supabase
    .from('admin_users')
    .select('*')
    .eq('clerk_user_id', userId)
    .maybeSingle()

  if (admin) return { type: 'admin', ...admin }

  const { data: specialist } = await supabase
    .from('specialists')
    .select('*')
    .eq('clerk_user_id', userId)
    .maybeSingle()

  if (specialist) return { type: 'specialist', ...specialist }

  return null
}

/**
 * Clerk 認証済みユーザーの Supabase レコードを確保する。
 * 未登録の場合はデフォルト企業に紐づけてユーザーを自動作成する（ローカル開発用）。
 */
export async function ensureSupabaseUser(): Promise<SupabaseAppUser | null> {
  const { userId } = await auth()
  if (!userId) return null

  const existing = await getSupabaseUserByClerkId()
  if (existing) return existing

  const supabase = createServiceRoleClient()

  // Clerk からメールアドレスを取得
  const clerkUserData = await currentUser()
  const email = clerkUserData?.emailAddresses?.[0]?.emailAddress ?? `${userId}@placeholder.local`

  // 既存の会社を1件取得するか、なければデフォルト会社を作成
  let companyId = DEFAULT_COMPANY_ID
  const { data: anyCompany } = await supabase
    .from('companies')
    .select('id')
    .limit(1)
    .maybeSingle()

  if (anyCompany) {
    companyId = anyCompany.id
  } else {
    await supabase
      .from('companies')
      .upsert({ id: DEFAULT_COMPANY_ID, name: 'テスト会社' }, { onConflict: 'id' })
  }

  // ユーザーを作成（age_group/life_stageはnullableなので省略可）
  const { data, error } = await supabase
    .from('users')
    .upsert(
      { clerk_user_id: userId, company_id: companyId, email },
      { onConflict: 'clerk_user_id' }
    )
    .select()
    .single()

  if (error) {
    console.error('ensureSupabaseUser error:', error)
    const { data: retry } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_user_id', userId)
      .maybeSingle()
    if (retry) return { type: 'employee', ...retry }
    return null
  }

  return { type: 'employee', ...data }
}

export async function getEmployeeUserId(): Promise<string | null> {
  const user = await getSupabaseUserByClerkId()
  if (user?.type === 'employee') return user.id
  return null
}

/** ログイン済みユーザーの Supabase ID を確保して返す（投稿などの書き込み用） */
export async function requireEmployeeUserId(): Promise<string> {
  const user = await ensureSupabaseUser()
  if (!user || user.type !== 'employee') {
    throw new Error('ユーザー登録が必要です')
  }
  return user.id
}
