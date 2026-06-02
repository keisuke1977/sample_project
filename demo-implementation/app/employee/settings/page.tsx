import { mockUser } from '@/lib/mock-data'
import { ChevronRight, Bell, Lock, HelpCircle, LogOut, User } from 'lucide-react'

const SETTINGS_ITEMS = [
  {
    group: 'アカウント',
    items: [
      { icon: User, label: 'プロフィール設定', href: '#' },
      { icon: Bell, label: '通知設定', href: '#' },
    ],
  },
  {
    group: 'プライバシー',
    items: [
      { icon: Lock, label: 'データ利用への同意', href: '#' },
      { icon: Lock, label: 'データのエクスポート', href: '#' },
    ],
  },
  {
    group: 'サポート',
    items: [
      { icon: HelpCircle, label: 'よくある質問', href: '#' },
      { icon: HelpCircle, label: 'お問い合わせ', href: '#' },
    ],
  },
]

export default function SettingsPage() {
  return (
    <div className="max-w-lg mx-auto">
      <header
        className="sticky top-0 z-40 px-4 py-4 border-b"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <h1 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
          設定
        </h1>
      </header>

      <div className="px-4 py-5 space-y-6">
        <div
          className="rounded-2xl p-5 flex items-center gap-4"
          style={{ backgroundColor: 'var(--color-primary-light)' }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            {mockUser.name[0]}
          </div>
          <div>
            <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              {mockUser.name}さん
            </p>
            <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
              {mockUser.company} / {mockUser.department}
            </p>
            <div className="badge-privacy mt-2">
              🔒 あなたのデータは企業に特定されません
            </div>
          </div>
        </div>

        {SETTINGS_ITEMS.map((group) => (
          <div key={group.group}>
            <h2 className="text-xs font-semibold mb-2 px-1" style={{ color: 'var(--color-text-secondary)' }}>
              {group.group}
            </h2>
            <div
              className="rounded-xl overflow-hidden border"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
            >
              {group.items.map((item, i) => {
                const Icon = item.icon
                return (
                  <a
                    key={i}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3.5 border-b last:border-b-0 transition-colors hover:opacity-80"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--color-text-secondary)' }} />
                    <span className="flex-1 text-sm" style={{ color: 'var(--color-text-primary)' }}>
                      {item.label}
                    </span>
                    <ChevronRight className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />
                  </a>
                )
              })}
            </div>
          </div>
        ))}

        <button
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border text-sm font-medium transition-opacity hover:opacity-80"
          style={{ borderColor: 'var(--color-error)', color: 'var(--color-error)' }}
        >
          <LogOut className="w-4 h-4" />
          ログアウト
        </button>

        <p className="text-center text-xs" style={{ color: 'var(--color-text-secondary)' }}>
          Femcare v0.1.0
        </p>
      </div>
    </div>
  )
}
