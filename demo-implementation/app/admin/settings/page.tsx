import { Building, Bell, Shield, Save } from 'lucide-react'

export default function AdminSettingsPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">設定</h1>
        <p className="text-sm text-gray-500 mt-0.5">企業アカウントの設定を管理します</p>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border p-5" style={{ backgroundColor: 'white', borderColor: '#E5E7EB' }}>
          <div className="flex items-center gap-2 mb-4">
            <Building className="w-5 h-5 text-gray-500" />
            <h2 className="text-base font-semibold text-gray-900">企業情報</h2>
          </div>
          <div className="space-y-4">
            {[
              { label: '企業名', defaultValue: '株式会社サンプル', type: 'text' },
              { label: '担当者名', defaultValue: '山田 花子', type: 'text' },
              { label: '担当者メール', defaultValue: 'hr@sample.co.jp', type: 'email' },
            ].map(({ label, defaultValue, type }) => (
              <div key={label}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                <input
                  type={type}
                  defaultValue={defaultValue}
                  className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-offset-1"
                  style={{ borderColor: '#E5E7EB', color: '#374151' }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border p-5" style={{ backgroundColor: 'white', borderColor: '#E5E7EB' }}>
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-gray-500" />
            <h2 className="text-base font-semibold text-gray-900">通知設定</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: '月次レポートをメールで受け取る', checked: true },
              { label: 'アクティブ率が50%を下回ったら通知', checked: true },
              { label: '新機能のお知らせを受け取る', checked: false },
            ].map(({ label, checked }, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">{label}</span>
                <button
                  className="relative w-10 h-6 rounded-full transition-colors"
                  style={{ backgroundColor: checked ? 'var(--color-primary)' : '#D1D5DB' }}
                  role="switch"
                  aria-checked={checked}
                >
                  <span
                    className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform"
                    style={{ left: checked ? 'calc(100% - 20px)' : '4px' }}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border p-5" style={{ backgroundColor: 'white', borderColor: '#E5E7EB' }}>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-gray-500" />
            <h2 className="text-base font-semibold text-gray-900">プライバシー設定</h2>
          </div>
          <div className="rounded-lg p-4 text-sm" style={{ backgroundColor: '#F0F7F4', color: '#1F5C47' }}>
            <p className="font-medium mb-1">匿名化設定（変更不可）</p>
            <p className="text-xs">
              従業員の個人データは企業側から特定できないよう設計されています。この設定は変更できません。
            </p>
          </div>
        </div>

        <button
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <Save className="w-4 h-4" />
          変更を保存
        </button>
      </div>
    </div>
  )
}
