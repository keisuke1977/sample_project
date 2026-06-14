'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, BookOpen, MessageCircle, BarChart2, Heart, Settings } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'

const NAV_ITEMS = [
  { href: '/employee/home',         Icon: Home,          label: 'ホーム' },
  { href: '/employee/community',    Icon: Users,         label: 'コミュニティ' },
  { href: '/employee/contents',     Icon: BookOpen,      label: 'コンテンツ' },
  { href: '/employee/consultation', Icon: MessageCircle, label: '専門家相談' },
  { href: '/employee/records',      Icon: BarChart2,     label: '体調記録' },
]

export default function SideNav() {
  const pathname = usePathname()

  return (
    <aside
      style={{
        width: 220,
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
        borderRight: '1px solid #EDE9E6',
        padding: '0',
        overflowY: 'auto',
      }}
    >
      {/* ロゴ */}
      <div style={{
        padding: '20px 20px 16px',
        borderBottom: '1px solid #EDE9E6',
      }}>
        <Link href="/employee/home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, #C97A72 0%, #E8A87C 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 3px 12px rgba(201,122,114,0.35)',
            flexShrink: 0,
          }}>
            <Heart size={16} color="white" fill="white" />
          </div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 800, color: '#1A1A1A', letterSpacing: '-0.4px' }}>Femcare</p>
            <p style={{ fontSize: 10, color: '#9B9B9B', fontWeight: 500 }}>女性健康サポート</p>
          </div>
        </Link>
      </div>

      {/* ナビゲーション */}
      <nav style={{ flex: 1, padding: '12px 12px' }}>
        <p style={{
          fontSize: 10, fontWeight: 700, color: '#ABABAB',
          letterSpacing: '0.8px', padding: '4px 8px 10px', textTransform: 'uppercase',
        }}>
          メニュー
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV_ITEMS.map(({ href, Icon, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', borderRadius: 12,
                  backgroundColor: isActive ? '#FDF0EE' : 'transparent',
                  transition: 'background-color 0.15s',
                  cursor: 'pointer',
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 9,
                    backgroundColor: isActive ? '#F2E0DE' : '#F5F5F5',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon
                      size={16}
                      color={isActive ? '#C97A72' : '#9B9B9B'}
                      strokeWidth={isActive ? 2.5 : 1.8}
                    />
                  </div>
                  <span style={{
                    fontSize: 13, fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#C97A72' : '#4A4A4A',
                  }}>
                    {label}
                  </span>
                  {isActive && (
                    <div style={{
                      marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%',
                      backgroundColor: '#C97A72',
                    }} />
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* 設定 */}
      <div style={{ padding: '12px', borderTop: '1px solid #EDE9E6' }}>
        <Link href="/employee/settings" style={{ textDecoration: 'none' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 12,
            backgroundColor: pathname === '/employee/settings' ? '#FDF0EE' : 'transparent',
            cursor: 'pointer',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9, backgroundColor: '#F5F5F5',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Settings size={16} color="#9B9B9B" strokeWidth={1.8} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#4A4A4A' }}>設定</span>
          </div>
        </Link>
        {/* UserButton */}
        <div style={{
          marginTop: 10, padding: '10px 12px', borderRadius: 12,
          backgroundColor: '#F9F7F5',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <UserButton />
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#4A4A4A' }}>アカウント</p>
            <p style={{ fontSize: 10, color: '#9B9B9B' }}>クリックで設定・ログアウト</p>
          </div>
        </div>

        <div style={{
          marginTop: 8, padding: '10px 12px', borderRadius: 12,
          background: 'linear-gradient(135deg, #FDF0EE, #F5E8F8)',
          border: '1px solid rgba(201,122,114,0.14)',
        }}>
          <p style={{ fontSize: 10, color: '#9B9B9B', marginBottom: 3 }}>🔒 プライバシー保護</p>
          <p style={{ fontSize: 11, color: '#7A7A7A', lineHeight: 1.5 }}>
            あなたの情報は<br />会社に特定されません
          </p>
        </div>
      </div>
    </aside>
  )
}
