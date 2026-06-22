'use server'

import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { ensureDefaultCompanyId } from '@/lib/supabase/auth-helpers'

const registerSchema = z.object({
  age_group: z.enum(['20s', '30s', '40s', '50s']),
  life_stage: z.enum(['menstrual', 'trying_to_conceive', 'postpartum', 'menopause']),
  consent: z.literal('true'),
})

export async function registerEmployee(formData: FormData) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const result = registerSchema.safeParse({
    age_group: formData.get('age_group'),
    life_stage: formData.get('life_stage'),
    consent: formData.get('consent'),
  })

  if (!result.success) {
    return { error: '入力内容を確認してください' }
  }

  try {
    const supabase = createServiceRoleClient()
    const clerkUser = await currentUser()
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? `${userId}@placeholder.local`
    const companyId = await ensureDefaultCompanyId(supabase)

    const { error } = await supabase.from('users').upsert(
      {
        clerk_user_id: userId,
        company_id: companyId,
        email,
        age_group: result.data.age_group,
        life_stage: result.data.life_stage,
        consent_at: new Date().toISOString(),
      },
      { onConflict: 'clerk_user_id' }
    )

    if (error) {
      console.error('registerEmployee db error:', error)
      return { error: '登録に失敗しました: ' + error.message }
    }
  } catch (err) {
    console.error('registerEmployee error:', err)
    const message = err instanceof Error ? err.message : String(err)
    if (message.includes('fetch failed') || message.includes('SUPABASE')) {
      return {
        error: '登録に失敗しました: Supabaseに接続できません。Vercelの環境変数（NEXT_PUBLIC_SUPABASE_URL、SUPABASE_SERVICE_ROLE_KEY）を確認してください。',
      }
    }
    return { error: '登録に失敗しました: ' + message }
  }

  redirect('/employee/home')
}
