'use client'

import {
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
} from '@clerk/nextjs'
import Link from 'next/link'
import { Heart } from 'lucide-react'

export function Header() {
  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
    >
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                Femcare
              </span>
            </Link>

            <Show when="signed-in">
              <nav className="hidden md:flex gap-6">
                <Link
                  href="/employee/home"
                  className="text-sm font-medium transition-colors hover:opacity-80"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  従業員アプリ
                </Link>
                <Link
                  href="/admin/dashboard"
                  className="text-sm font-medium transition-colors hover:opacity-80"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  管理ダッシュボード
                </Link>
              </nav>
            </Show>
          </div>

          <div className="flex items-center gap-3">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button
                  className="text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  ログイン
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button
                  className="text-sm font-medium px-4 py-2 rounded-lg text-white transition-colors"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  新規登録
                </button>
              </SignUpButton>
            </Show>

            <Show when="signed-in">
              <UserButton />
            </Show>
          </div>
        </div>
      </div>
    </header>
  )
}
