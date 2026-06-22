'use client'

import { Show, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Heart, LogIn, Menu, X } from 'lucide-react'
import { useState } from 'react'

const LANDING_NAV = [
  { label: 'サービス', href: '#service' },
  { label: '企業の方へ', href: '#for-business' },
  { label: 'よくある質問', href: '#faq' },
] as const

export function Header() {
  const pathname = usePathname()
  const isLanding = pathname === '/'
  const isEmployee = pathname.startsWith('/employee')
  const [menuOpen, setMenuOpen] = useState(false)

  // 従業員・オンボーディングページは独自レイアウトのため非表示
  if (isEmployee || pathname === '/onboarding') return null

  if (isLanding) {
    return (
      <header style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: '#fff', borderBottom: '1px solid #EDE9E6' }}>

        {/* 上部バー：ログイン / FAQ */}
        <div style={{ borderBottom: '1px solid #F0ECE8' }}>
          <div style={{
            maxWidth: '1152px',
            margin: '0 auto',
            padding: '0 32px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '20px',
          }}>
            <Show when="signed-in">
              <Link href="/employee/home" style={{ fontSize: '12px', color: '#6B6B6B', textDecoration: 'none' }}
                className="hover:text-[#C97A72] transition-colors">
                マイページ
              </Link>
              <span style={{ color: '#DDD9D5', fontSize: '12px' }}>|</span>
              <UserButton />
            </Show>

            <Show when="signed-out">
              <Link
                href="/sign-in"
                style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#6B6B6B', textDecoration: 'none' }}
                className="hover:text-[#C97A72] transition-colors"
              >
                <LogIn style={{ width: '14px', height: '14px' }} />
                ログイン
              </Link>
              <span style={{ color: '#DDD9D5', fontSize: '12px' }}>|</span>
            </Show>
          </div>
        </div>

        {/* メインナビ */}
        <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #C97A72, #D4958D)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Heart style={{ width: '16px', height: '16px', color: '#fff' }} fill="white" />
            </div>
            <span className="font-display" style={{ fontSize: '18px', fontWeight: 600, color: '#1A1A1A' }}>
              Femcare
            </span>
          </Link>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '36px' }} className="hidden md:flex">
            {LANDING_NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                style={{ fontSize: '13px', color: '#4A4A4A', textDecoration: 'none', letterSpacing: '0.03em' }}
                className="hover:text-[#C97A72] transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            className="md:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            style={{ padding: '8px', color: '#6B6B6B', background: 'none', border: 'none', cursor: 'pointer', display: 'none' }}
            aria-label="メニュー"
          >
            {menuOpen ? <X style={{ width: '20px', height: '20px' }} /> : <Menu style={{ width: '20px', height: '20px' }} />}
          </button>
        </div>

        {menuOpen && (
          <nav style={{ borderTop: '1px solid #EDE9E6', padding: '16px 32px', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {LANDING_NAV.map((item) => (
              <a key={item.href} href={item.href} style={{ fontSize: '14px', color: '#4A4A4A', textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>
                {item.label}
              </a>
            ))}
            <Show when="signed-out">
              <Link href="/sign-in" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#C97A72', textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>
                <LogIn style={{ width: '16px', height: '16px' }} />
                ログイン
              </Link>
            </Show>
          </nav>
        )}
      </header>
    )
  }

  // ログイン後の画面用ヘッダー
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      backgroundColor: 'rgba(255,255,255,0.96)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #EDE9E6',
    }}>
      <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '9px',
              background: 'linear-gradient(135deg, #C97A72, #D4958D)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Heart style={{ width: '15px', height: '15px', color: '#fff' }} fill="white" />
            </div>
            <span className="font-display" style={{ fontSize: '17px', fontWeight: 600, color: '#1A1A1A' }}>Femcare</span>
          </Link>
          <Show when="signed-in">
            <nav style={{ display: 'flex', gap: '24px' }} className="hidden md:flex">
              <Link href="/employee/home" style={{ fontSize: '13px', color: '#6B6B6B', textDecoration: 'none' }} className="hover:text-[#C97A72]">ホーム</Link>
              <Link href="/admin/dashboard" style={{ fontSize: '13px', color: '#6B6B6B', textDecoration: 'none' }} className="hover:text-[#C97A72]">管理画面</Link>
            </nav>
          </Show>
        </div>
        <Show when="signed-out">
          <Link href="/sign-in" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#6B6B6B', textDecoration: 'none' }} className="hover:text-[#C97A72]">
            <LogIn style={{ width: '15px', height: '15px' }} />
            ログイン
          </Link>
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </div>
    </header>
  )
}
