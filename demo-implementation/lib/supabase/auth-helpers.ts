import { auth } from '@clerk/nextjs/server'
import { createServiceRoleClient } from './service-role'
import type { Database } from './types'

type EmployeeUser = Database['public']['Tables']['users']['Row']
type AdminUser = Database['public']['Tables']['admin_users']['Row']
type Specialist = Database['public']['Tables']['specialists']['Row']

export type SupabaseAppUser =
  | ({ type: 'employee' } & EmployeeUser)
  | ({ type: 'admin' } & AdminUser)
  | ({ type: 'specialist' } & Specialist)

export async function getSupabaseUserByClerkId(): Promise<SupabaseAppUser | null> {
  const { userId } = await auth()
  if (!userId) return null

  const supabase = createServiceRoleClient()

  const { data: employee } = await supabase
    .from('users')
    .select('*')
    .eq('clerk_user_id', userId)
    .is('deleted_at', null)
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
 * Clerk 認証済みユーザーの Supabase レコードを取得する。
 * Femcare では招待コード登録が必要なため、未登録時は null を返す。
 */
export async function ensureSupabaseUser(): Promise<SupabaseAppUser | null> {
  const { userId } = await auth()
  if (!userId) return null

  return getSupabaseUserByClerkId()
}

export async function getEmployeeUserId(): Promise<string | null> {
  const user = await getSupabaseUserByClerkId()
  if (user?.type === 'employee') return user.id
  return null
}
