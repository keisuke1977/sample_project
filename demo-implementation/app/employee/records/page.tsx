'use client'

import { checkInHistory, todayCheckin } from '@/lib/mock-data'
import { getMenstrualLabel } from '@/lib/utils'

const allRecords = [todayCheckin, ...checkInHistory]

function ScoreBar({ score, max = 5 }: { score: number; max?: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 rounded-full flex-1" style={{ backgroundColor: 'var(--color-border)' }}>
        <div
          className="h-2 rounded-full transition-all"
          style={{ width: `${(score / max) * 100}%`, backgroundColor: 'var(--color-primary)' }}
        />
      </div>
      <span className="text-xs font-medium w-3" style={{ color: 'var(--color-text-primary)' }}>
        {score}
      </span>
    </div>
  )
}

export default function RecordsPage() {
  return (
    <div className="max-w-lg mx-auto">
      <header
        className="sticky top-0 z-40 px-4 py-4 border-b"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <h1 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
          体調記録
        </h1>
      </header>

      <div className="px-4 py-5 space-y-4">
        {allRecords.map((record, idx) => {
          const date = new Date(record.date)
          const dateLabel =
            idx === 0
              ? '今日'
              : date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric', weekday: 'short' })

          return (
            <div
              key={record.id}
              className="rounded-2xl p-5 border"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: idx === 0 ? 'var(--color-primary)' : 'var(--color-border)',
                borderWidth: idx === 0 ? 2 : 1,
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <p
                  className="text-sm font-semibold"
                  style={{ color: idx === 0 ? 'var(--color-primary)' : 'var(--color-text-primary)' }}
                >
                  {dateLabel}
                </p>
                <span
                  className="text-xs px-2 py-1 rounded-full"
                  style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
                >
                  {getMenstrualLabel(record.menstrualStatus)}
                </span>
              </div>

              <div className="space-y-2.5">
                {[
                  { label: '睡眠の質', score: record.sleepScore },
                  { label: '倦怠感', score: record.fatigueScore },
                  { label: '気分', score: record.moodScore },
                ].map(({ label, score }) => (
                  <div key={label} className="grid grid-cols-[80px_1fr] items-center gap-3">
                    <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                      {label}
                    </span>
                    <ScoreBar score={score} />
                  </div>
                ))}
              </div>

              {record.symptoms.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {record.symptoms.map((s) => {
                    const labels: Record<string, string> = {
                      headache: '頭痛', abdominal_pain: '腹痛', bloating: 'むくみ',
                      fatigue: '倦怠感', hot_flash: 'ほてり',
                    }
                    return (
                      <span
                        key={s}
                        className="text-xs px-2 py-1 rounded-full"
                        style={{ backgroundColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
                      >
                        {labels[s] ?? s}
                      </span>
                    )
                  })}
                </div>
              )}

              <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                {record.feedbackMessage}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
