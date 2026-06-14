import type { ReactNode } from 'react'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import BottomNav from '@/components/employee/BottomNav'
import SideNav from '@/components/employee/SideNav'
import { ensureSupabaseUser } from '@/lib/supabase/auth-helpers'

export default async function EmployeeLayout({ children }: { children: ReactNode }) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  // ユーザー作成 or 取得（未作成 or age_group 未設定ならオンボーディングへ）
  const supabaseUser = await ensureSupabaseUser().catch(() => null)
  const needsOnboarding =
    !supabaseUser ||
    (supabaseUser.type === 'employee' && !supabaseUser.age_group)
  if (needsOnboarding) {
    redirect('/onboarding')
  }

  return (
    <>
      {/* ── PC: サイドバー + コンテンツ ── */}
      <div
        className="employee-desktop-layout"
        style={{ display: 'none' }}
      >
        <SideNav />
        <main style={{
          flex: 1,
          minHeight: '100vh',
          overflowY: 'auto',
          backgroundColor: '#FAF8F5',
        }}>
          {children}
        </main>
      </div>

      {/* ── モバイル: 通常 + BottomNav ── */}
      <div
        className="employee-mobile-layout"
        style={{ display: 'block' }}
      >
        <main style={{ paddingBottom: 80, backgroundColor: '#FAF8F5', minHeight: '100vh' }}>
          {children}
        </main>
        <BottomNav />
      </div>

      <style>{`
        @media (min-width: 768px) {
          .employee-desktop-layout { display: flex !important; }
          .employee-mobile-layout  { display: none  !important; }
        }
      `}</style>
    </>
  )
}
