import { Copy, UserPlus, Mail } from 'lucide-react'

const mockInviteCodes = [
  { code: 'FEMCARE-2026-ABC123', used: 12, limit: 20, department: '営業部', expiry: '2026-12-31' },
  { code: 'FEMCARE-2026-DEF456', used: 8, limit: 15, department: '開発部', expiry: '2026-12-31' },
  { code: 'FEMCARE-2026-GHI789', used: 5, limit: 10, department: '人事部', expiry: '2026-12-31' },
]

export default function EmployeesPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">従業員管理</h1>
          <p className="text-sm text-gray-500 mt-0.5">招待コードの発行と利用状況を管理します</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <UserPlus className="w-4 h-4" />
          招待コードを発行
        </button>
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'white', borderColor: '#E5E7EB' }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: '#F3F4F6' }}>
          <h2 className="text-base font-semibold text-gray-900">発行済み招待コード</h2>
        </div>
        <div className="divide-y" style={{ borderColor: '#F3F4F6' }}>
          {mockInviteCodes.map((ic) => (
            <div key={ic.code} className="px-5 py-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <code className="text-sm font-mono font-bold text-gray-900">{ic.code}</code>
                  <button className="p-1 rounded hover:bg-gray-100 transition-colors" aria-label="コピー">
                    <Copy className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>{ic.department}</span>
                  <span>有効期限: {ic.expiry}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold text-gray-900">
                  {ic.used} <span className="text-gray-400 font-normal">/ {ic.limit}名</span>
                </p>
                <div className="h-1.5 w-24 rounded-full mt-1 overflow-hidden" style={{ backgroundColor: '#F3F4F6' }}>
                  <div
                    className="h-1.5 rounded-full"
                    style={{ width: `${(ic.used / ic.limit) * 100}%`, backgroundColor: 'var(--color-primary)' }}
                  />
                </div>
              </div>
              <button
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-colors hover:bg-gray-50 flex-shrink-0"
                style={{ borderColor: '#E5E7EB', color: '#374151' }}
              >
                <Mail className="w-3.5 h-3.5" />
                メール送信
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
