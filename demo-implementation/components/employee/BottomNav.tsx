'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, BookOpen, MessageCircle, BarChart2 } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/employee/home',         Icon: Home,          label: 'ホーム' },
  { href: '/employee/community',    Icon: Users,         label: 'コミュニティ' },
  { href: '/employee/contents',     Icon: BookOpen,      label: 'コンテンツ' },
  { href: '/employee/consultation', Icon: MessageCircle, label: '相談' },
  { href: '/employee/records',      Icon: BarChart2,     label: '記録' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: 'rgba(255,255,255,0.96)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: '1px solid #EDE9E6',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.06)',
      }}
    >
      <div style={{ display: 'flex', height: 60, maxWidth: 480, margin: '0 auto' }}>
        {NAV_ITEMS.map(({ href, Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                textDecoration: 'none',
                padding: '6px 0',
                position: 'relative',
              }}
            >
              {/* アクティブインジケーター */}
              {isActive && (
                <span
                  style={{
                    position: 'absolute',
                    top: -1,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 28,
                    height: 3,
                    borderRadius: '0 0 3px 3px',
                    background: 'linear-gradient(90deg, #C97A72, #D4958D)',
                  }}
                />
              )}

              {/* アイコンラッパー */}
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isActive ? '#F2E0DE' : 'transparent',
                  transition: 'background-color 0.2s ease',
                }}
              >
                <Icon
                  size={19}
                  color={isActive ? '#C97A72' : '#9B9B9B'}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
              </div>

              <span
                style={{
                  fontSize: 10,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#C97A72' : '#9B9B9B',
                  letterSpacing: '0.2px',
                }}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
