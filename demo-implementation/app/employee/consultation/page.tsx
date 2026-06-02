import Link from 'next/link'
import { mockConsultations, mockSlots } from '@/lib/mock-data'
import { ChevronRight, Plus, Video } from 'lucide-react'
import { formatDate } from '@/lib/utils'

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; gradient: string }> = {
  pending: { label: '返信待ち', color: '#E8A87C', bg: '#FBF1E8', gradient: 'linear-gradient(135deg,#FBF1E8,#FFF6F0)' },
  active:  { label: '回答あり', color: '#4A7C6F', bg: '#DCF0EB', gradient: 'linear-gradient(135deg,#DCF0EB,#E8F5F0)' },
  closed:  { label: 'クローズ', color: '#9B9B9B', bg: '#F0F0F0', gradient: 'linear-gradient(135deg,#F5F5F5,#F0F0F0)' },
}

const CATEGORY_LABEL: Record<string, string> = {
  menstrual: '月経ケア', pms: 'PMS', menopause: '更年期',
  pregnancy: '妊活', mental: 'メンタル', other: 'その他',
}

export default function ConsultationPage() {
  const availableSlots = mockSlots.filter((s) => s.available).slice(0, 3)

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', backgroundColor: '#FAF8F5', minHeight: '100vh' }}>

      {/* ヘッダー */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          padding: '16px 16px 14px',
          backgroundColor: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderBottom: '1px solid #EDE9E6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 9,
              background: 'linear-gradient(135deg, #4A7C6F, #6BAB8F)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: 14 }}>💬</span>
          </div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#2D2D2D' }}>専門家相談</h1>
        </div>
        <Link
          href="/employee/consultation/new"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '8px 14px',
            borderRadius: 9999,
            background: 'linear-gradient(135deg, #C97A72, #D4958D)',
            color: 'white',
            fontSize: 12,
            fontWeight: 700,
            textDecoration: 'none',
            boxShadow: '0 3px 12px rgba(201,122,114,0.35)',
          }}
        >
          <Plus size={13} />
          新しい相談
        </Link>
      </header>

      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* チャット相談一覧 */}
        <section>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#2D2D2D', marginBottom: 12 }}>チャット相談</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {mockConsultations.map((c) => {
              const status = STATUS_MAP[c.status]
              const lastMsg = c.messages[c.messages.length - 1]
              return (
                <Link
                  key={c.id}
                  href={`/employee/consultation/${c.id}`}
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  <div
                    className="card-hover"
                    style={{
                      borderRadius: 18,
                      padding: '16px',
                      backgroundColor: 'white',
                      boxShadow: '0 3px 16px rgba(0,0,0,0.07)',
                      cursor: 'pointer',
                    }}
                  >
                    {/* ステータス行 */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            padding: '4px 10px',
                            borderRadius: 9999,
                            background: 'linear-gradient(135deg,#EDE8F5,#F3EFFE)',
                            color: '#9B87B5',
                          }}
                        >
                          {CATEGORY_LABEL[c.category]}
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            padding: '4px 10px',
                            borderRadius: 9999,
                            background: status.gradient,
                            color: status.color,
                          }}
                        >
                          {status.label}
                        </span>
                      </div>
                      <ChevronRight size={16} color="#C0C0C0" />
                    </div>

                    {/* 最新メッセージ */}
                    <p
                      className="line-clamp-2"
                      style={{ fontSize: 13, lineHeight: 1.6, color: '#2D2D2D', marginBottom: 8 }}
                    >
                      {lastMsg?.body}
                    </p>

                    {/* 専門家・日付 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #4A7C6F, #6BAB8F)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: 9,
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        医
                      </div>
                      <span style={{ fontSize: 11, color: '#9B9B9B' }}>
                        {c.specialistName} · {formatDate(c.createdAt)}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* ビデオ相談 */}
        <section>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#2D2D2D', marginBottom: 12 }}>産婦人科医 オンライン相談</h2>

          {/* バナー */}
          <div
            style={{
              borderRadius: 20,
              padding: '18px',
              background: 'linear-gradient(135deg, #EEF3F7 0%, #E5EEF5 100%)',
              marginBottom: 12,
              display: 'flex',
              gap: 14,
              alignItems: 'center',
              boxShadow: '0 3px 14px rgba(0,0,0,0.06)',
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}
            >
              <Video size={22} color="#4A6C8A" />
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#2D2D2D', marginBottom: 4 }}>
                産婦人科医にビデオで直接相談
              </p>
              <p style={{ fontSize: 12, color: '#6B6B6B' }}>30分の1on1相談。予約は3日前まで。</p>
            </div>
          </div>

          {/* 予約枠 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {availableSlots.map((slot) => (
              <div
                key={slot.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderRadius: 16,
                  backgroundColor: 'white',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  gap: 12,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#2D2D2D', marginBottom: 3 }}>
                    {slot.specialistName}
                  </p>
                  <p style={{ fontSize: 11, color: '#9B9B9B' }}>
                    {formatDate(slot.date)} {slot.time}〜
                  </p>
                </div>
                <button
                  style={{
                    padding: '8px 18px',
                    borderRadius: 9999,
                    border: 'none',
                    background: 'linear-gradient(135deg, #4A7C6F, #6BAB8F)',
                    color: 'white',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    flexShrink: 0,
                    boxShadow: '0 3px 10px rgba(74,124,111,0.30)',
                  }}
                >
                  予約する
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 医療免責 */}
        <div
          style={{
            borderRadius: 14,
            padding: '12px 14px',
            background: 'linear-gradient(135deg, #EEF3F7, #E8EFF5)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 8,
          }}
        >
          <span style={{ fontSize: 14, flexShrink: 0 }}>🏥</span>
          <p style={{ fontSize: 11, color: '#4A6C8A', lineHeight: 1.6 }}>
            このサービスは医療行為ではありません。診断・処方は行いません。
          </p>
        </div>

      </div>
    </div>
  )
}
