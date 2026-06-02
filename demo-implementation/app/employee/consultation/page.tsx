import Link from 'next/link'
import { mockConsultations, mockSlots } from '@/lib/mock-data'
import { ChevronRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'

const statusLabel: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: '返信待ち', color: '#E8A87C', bg: '#FBF1E8' },
  active: { label: '回答あり', color: 'var(--color-accent)', bg: 'var(--color-accent-light)' },
  closed: { label: 'クローズ', color: '#9B9B9B', bg: '#F0F0F0' },
}

const categoryLabel: Record<string, string> = {
  menstrual: '月経ケア',
  pms: 'PMS',
  menopause: '更年期',
  pregnancy: '妊活',
  mental: 'メンタル',
  other: 'その他',
}

export default function ConsultationPage() {
  const availableSlots = mockSlots.filter((s) => s.available).slice(0, 3)

  return (
    <div className="max-w-lg mx-auto">
      <header
        className="sticky top-0 z-40 px-4 py-4 border-b"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <h1 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
          相談
        </h1>
      </header>

      <div className="px-4 py-5 space-y-6">
        {/* チャット相談 */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>
              チャット相談
            </h2>
            <Link
              href="/employee/consultation/new"
              className="text-xs font-medium px-3 py-1.5 rounded-full text-white"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              ＋ 新しい相談
            </Link>
          </div>

          <div className="space-y-3">
            {mockConsultations.map((c) => {
              const status = statusLabel[c.status]
              const lastMsg = c.messages[c.messages.length - 1]
              return (
                <Link
                  key={c.id}
                  href={`/employee/consultation/${c.id}`}
                  className="block rounded-xl border p-4 card-hover"
                  style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: '#F0EEF8', color: '#7B68B5' }}>
                        {categoryLabel[c.category]}
                      </span>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: status.bg, color: status.color }}>
                        {status.label}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--color-text-secondary)' }} />
                  </div>
                  <p className="text-sm line-clamp-2 mb-2" style={{ color: 'var(--color-text-primary)' }}>
                    {lastMsg?.body}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    {c.specialistName} ・ {formatDate(c.createdAt)}
                  </p>
                </Link>
              )
            })}
          </div>
        </section>

        {/* ビデオ相談 */}
        <section>
          <h2 className="text-sm font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>
            産婦人科医 オンライン相談
          </h2>
          <div
            className="rounded-2xl p-4 mb-3 flex items-start gap-3"
            style={{ backgroundColor: 'var(--color-medical)' }}
          >
            <span className="text-2xl">🎥</span>
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                産婦人科医にビデオで直接相談
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                30分の1on1相談。予約は3日前まで。
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {availableSlots.map((slot) => (
              <div
                key={slot.id}
                className="flex items-center justify-between rounded-xl border p-3.5"
                style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
              >
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                    {slot.specialistName}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                    {formatDate(slot.date)} {slot.time}〜
                  </p>
                </div>
                <button
                  className="text-xs font-semibold px-4 py-2 rounded-full text-white"
                  style={{ backgroundColor: 'var(--color-accent)' }}
                >
                  予約する
                </button>
              </div>
            ))}
          </div>
        </section>

        <div className="badge-medical w-full justify-center">
          🏥 このサービスは医療行為ではありません。診断・処方は行いません。
        </div>
      </div>
    </div>
  )
}
