import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import OnboardingForm from './OnboardingForm'

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ preview?: string }>
}) {
  const { preview } = await searchParams

  // ?preview=true のときはデモ表示（リダイレクトしない・保存しない）
  if (preview === 'true') {
    return <OnboardingForm preview={true} />
  }

  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  // オンボーディング完了済み（age_groupあり）ならホームへ
  const supabase = createServiceRoleClient()
  const { data: existing } = await supabase
    .from('users')
    .select('id, age_group')
    .eq('clerk_user_id', userId)
    .maybeSingle()

  if (existing?.age_group) redirect('/employee/home')

  return <OnboardingForm />
}
