import type { ReactNode } from 'react'
import AdminSideNav from '@/components/admin/AdminSideNav'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F5F7FA' }}>
      <AdminSideNav />
      <main className="flex-1 min-w-0 overflow-auto">{children}</main>
    </div>
  )
}
