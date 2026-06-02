import { FileText, Download, Calendar } from 'lucide-react'

const REPORTS = [
  { title: '2026年5月 月次健康レポート', date: '2026-06-01', status: '生成済み', size: '2.4MB' },
  { title: '2026年4月 月次健康レポート', date: '2026-05-01', status: '生成済み', size: '2.1MB' },
  { title: '2026年Q1 四半期レポート', date: '2026-04-01', status: '生成済み', size: '5.8MB' },
  { title: '2026年3月 月次健康レポート', date: '2026-04-01', status: '生成済み', size: '1.9MB' },
]

export default function ReportsPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">レポート</h1>
          <p className="text-sm text-gray-500 mt-0.5">月次・四半期レポートを管理します</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <FileText className="w-4 h-4" />
          レポートを生成
        </button>
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'white', borderColor: '#E5E7EB' }}>
        <div className="divide-y" style={{ borderColor: '#F3F4F6' }}>
          {REPORTS.map((r, i) => (
            <div key={i} className="px-5 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'var(--color-primary-light)' }}
              >
                <FileText className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{r.title}</p>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span>{r.date}</span>
                  <span>・</span>
                  <span>{r.size}</span>
                </div>
              </div>
              <span className="text-xs px-2 py-1 rounded-full flex-shrink-0" style={{ backgroundColor: '#F0F7F4', color: 'var(--color-accent)' }}>
                {r.status}
              </span>
              <button
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-colors hover:bg-gray-50 flex-shrink-0"
                style={{ borderColor: '#E5E7EB', color: '#374151' }}
              >
                <Download className="w-3.5 h-3.5" />
                DL
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
