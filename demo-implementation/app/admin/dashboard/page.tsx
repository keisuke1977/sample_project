'use client'

import { mockDashboard } from '@/lib/mock-data'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { TrendingUp, Users, MessageCircle, BarChart3, Download, AlertTriangle } from 'lucide-react'

function KpiCard({
  icon, label, value, sub, color, bg,
}: {
  icon: React.ReactNode; label: string; value: string; sub: string; color: string; bg: string
}) {
  return (
    <div className="rounded-xl p-5 border" style={{ backgroundColor: 'white', borderColor: '#E5E7EB' }}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-gray-500">{label}</p>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: bg, color }}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{sub}</p>
    </div>
  )
}

export default function AdminDashboardPage() {
  const d = mockDashboard

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
          <p className="text-sm text-gray-500 mt-0.5">{d.month} の集計データ</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors hover:bg-gray-50"
          style={{ borderColor: '#E5E7EB', color: '#374151' }}
        >
          <Download className="w-4 h-4" />
          CSVエクスポート
        </button>
      </div>

      <div
        className="flex items-start gap-3 rounded-xl p-4 mb-6"
        style={{ backgroundColor: '#F0F7F4', border: '1px solid #C8E6DA' }}
      >
        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--color-accent)' }} />
        <p className="text-xs text-gray-600">
          表示されているデータはすべて<strong>匿名集計</strong>です。個人を特定することはできません。
          5名未満のグループデータは表示されません。
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KpiCard
          icon={<Users className="w-5 h-5" />}
          label="月間アクティブ率"
          value={`${Math.round(d.activeRate * 100)}%`}
          sub="目標: 60%"
          color="var(--color-primary)"
          bg="var(--color-primary-light)"
        />
        <KpiCard
          icon={<MessageCircle className="w-5 h-5" />}
          label="相談利用率"
          value={`${Math.round(d.consultationRate * 100)}%`}
          sub="前月比 +3%"
          color="var(--color-accent)"
          bg="var(--color-accent-light)"
        />
        <KpiCard
          icon={<BarChart3 className="w-5 h-5" />}
          label="平均気分スコア"
          value={d.avgMoodScore.toFixed(1)}
          sub="5段階評価"
          color="#7B68B5"
          bg="#F0EEF8"
        />
        <KpiCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="チェックイン継続率"
          value="72%"
          sub="7日間連続記録"
          color="#E8A87C"
          bg="#FBF1E8"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="rounded-xl p-5 border" style={{ backgroundColor: 'white', borderColor: '#E5E7EB' }}>
          <h2 className="text-base font-semibold text-gray-900 mb-4">スコアトレンド（月次）</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={d.trendData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9CA3AF' }} />
              <YAxis domain={[1, 5]} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="moodScore" name="気分" stroke="var(--color-primary)" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="sleepScore" name="睡眠" stroke="var(--color-accent)" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="fatigueScore" name="疲労感" stroke="#7B68B5" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl p-5 border" style={{ backgroundColor: 'white', borderColor: '#E5E7EB' }}>
          <h2 className="text-base font-semibold text-gray-900 mb-4">多い症状 Top5</h2>
          <div className="space-y-3">
            {d.topSymptoms.map((sym) => (
              <div key={sym.name}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-700">{sym.name}</span>
                  <span className="font-medium text-gray-900">{sym.count}件</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#F3F4F6' }}>
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{ width: `${sym.percentage}%`, backgroundColor: 'var(--color-primary)' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'white', borderColor: '#E5E7EB' }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: '#F3F4F6' }}>
          <h2 className="text-base font-semibold text-gray-900">部署別サマリ</h2>
          <p className="text-xs text-gray-500 mt-0.5">※ 5名未満の部署は表示されません（プライバシー保護）</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: '#F9FAFB' }}>
                {['部署名', 'アクティブ人数', '平均気分', '平均睡眠'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: '#F3F4F6' }}>
              {d.departments.map((dept) => (
                <tr key={dept.name} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3.5 font-medium text-gray-900">{dept.name}</td>
                  <td className="px-4 py-3.5 text-gray-600">{dept.activeUsers}名</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 rounded-full overflow-hidden" style={{ backgroundColor: '#F3F4F6' }}>
                        <div className="h-1.5 rounded-full" style={{ width: `${(dept.avgMoodScore / 5) * 100}%`, backgroundColor: 'var(--color-primary)' }} />
                      </div>
                      <span className="text-gray-700 font-medium">{dept.avgMoodScore.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 rounded-full overflow-hidden" style={{ backgroundColor: '#F3F4F6' }}>
                        <div className="h-1.5 rounded-full" style={{ width: `${(dept.avgSleepScore / 5) * 100}%`, backgroundColor: 'var(--color-accent)' }} />
                      </div>
                      <span className="text-gray-700 font-medium">{dept.avgSleepScore.toFixed(1)}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
