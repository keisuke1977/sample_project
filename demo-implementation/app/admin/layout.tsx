import type { ReactNode } from 'react'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import AdminSideNav from '@/components/admin/AdminSideNav'
import { ensureSupabaseUser } from '@/lib/supabase/auth-helpers'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  await ensureSupabaseUser()

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F5F7FA' }}>
      <AdminSideNav />
      <main className="flex-1 min-w-0 overflow-auto">{children}</main>
    </div>
  )
}
