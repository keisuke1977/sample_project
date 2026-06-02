'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, FileText, Settings, Heart, ArrowLeft } from 'lucide-react'

const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'ダッシュボード' },
  { href: '/admin/employees', icon: Users, label: '従業員管理' },
  { href: '/admin/reports', icon: FileText, label: 'レポート' },
  { href: '/admin/settings', icon: Settings, label: '設定' },
]

export default function AdminSideNav() {
  const pathname = usePathname()

  return (
    <aside
      className="w-60 flex-shrink-0 flex flex-col border-r min-h-screen sticky top-0 h-screen"
      style={{ backgroundColor: 'white', borderColor: '#E5E7EB' }}
    >
      {/* ロゴ */}
      <div className="px-5 py-5 border-b" style={{ borderColor: '#E5E7EB' }}>
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <Heart className="w-4 h-4" />
          </div>
          <span className="font-bold text-base" style={{ color: 'var(--color-text-primary)' }}>
            Femcare
          </span>
        </div>
        <span
          className="text-xs px-2 py-0.5 rounded-full"
          style={{ backgroundColor: '#F0F7F4', color: 'var(--color-accent)' }}
        >
          管理者画面
        </span>
      </div>

      {/* ナビ */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{
                backgroundColor: isActive ? 'var(--color-primary-light)' : 'transparent',
                color: isActive ? 'var(--color-primary)' : '#4B5563',
              }}
            >
              <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={isActive ? 2.5 : 1.5} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* 従業員アプリへ戻る */}
      <div className="px-3 py-4 border-t" style={{ borderColor: '#E5E7EB' }}>
        <Link
          href="/employee/home"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-colors hover:opacity-80"
          style={{ color: '#9CA3AF' }}
        >
          <ArrowLeft className="w-4 h-4" />
          従業員アプリに戻る
        </Link>
      </div>
    </aside>
  )
}
