'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, MessageCircle, BarChart2, Settings } from 'lucide-react'

const navItems = [
  { href: '/employee/home', icon: Home, label: 'ホーム' },
  { href: '/employee/contents', icon: BookOpen, label: 'コンテンツ' },
  { href: '/employee/consultation', icon: MessageCircle, label: '相談' },
  { href: '/employee/records', icon: BarChart2, label: '記録' },
  { href: '/employee/settings', icon: Settings, label: '設定' },
]



export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t pb-safe"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="flex items-stretch h-16 max-w-lg mx-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors"
              style={{
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              }}
            >
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 1.5} />
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
