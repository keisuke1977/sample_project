import type { ReactNode } from 'react'
import BottomNav from '@/components/employee/BottomNav'

export default function EmployeeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-background)' }}>
      <main className="flex-1 pb-20">{children}</main>
      <BottomNav />
    </div>
  )
}
