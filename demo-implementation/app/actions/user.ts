'use server'

import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createServiceRoleClient } from '@/lib/supabase/service-role'

const DEMO_COMPANY_ID = '00000000-0000-0000-0000-000000000001'
const DEMO_DEPARTMENT_ID = '00000000-0000-0000-0000-000000000002'

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

  const supabase = createServiceRoleClient()
  const clerkUser = await currentUser()
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? `${userId}@placeholder.local`

  const { error } = await supabase.from('users').upsert(
    {
      clerk_user_id: userId,
      company_id: DEMO_COMPANY_ID,
      email,
      age_group: result.data.age_group,
      life_stage: result.data.life_stage,
      consent_at: new Date().toISOString(),
    },
    { onConflict: 'clerk_user_id' }
  )

  if (error) {
    return { error: '登録に失敗しました: ' + error.message }
  }

  redirect('/employee/home')
}
