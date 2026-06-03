import type { ReactNode } from 'react'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import BottomNav from '@/components/employee/BottomNav'
import { ensureSupabaseUser } from '@/lib/supabase/auth-helpers'

export default async function EmployeeLayout({ children }: { children: ReactNode }) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  await ensureSupabaseUser()

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-background)' }}>
      <main className="flex-1 pb-20">{children}</main>
      <BottomNav />
    </div>
  )
}
