import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { ChevronRight, Plus, Video } from 'lucide-react'
import { formatDate } from '@/lib/utils'

const STATUS_MAP: Record<string, { label: string; color: string; gradient: string }> = {
  pending: { label: '返信待ち', color: '#E8A87C', gradient: 'linear-gradient(135deg,#FBF1E8,#FFF6F0)' },
  active:  { label: '回答あり', color: '#4A7C6F', gradient: 'linear-gradient(135deg,#DCF0EB,#E8F5F0)' },
  closed:  { label: 'クローズ', color: '#9B9B9B', gradient: 'linear-gradient(135deg,#F5F5F5,#F0F0F0)' },
}

const CATEGORY_LABEL: Record<string, string> = {
  menstrual: '月経ケア', pms: 'PMS', menopause: '更年期',
  pregnancy: '妊活', mental: 'メンタル', other: 'その他',
}

export default async function ConsultationPage() {
  const { userId } = await auth()
  const supabase = createServiceRoleClient()

  const { data: userProfile } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_user_id', userId!)
    .maybeSingle()

  const { data: consultations } = await supabase
    .from('consultations')
    .select(`
      id, category, status, created_at,
      specialists(display_name),
      consultation_messages(body, sender_type, created_at)
    `)
    .eq('user_id', userProfile?.id ?? '')
    .order('created_at', { ascending: false })

  const allConsultations = consultations ?? []

  return (
    <div className="emp-page">

      {/* ヘッダー */}
      <header
        style={{
          position: 'sticky', top: 0, zIndex: 40,
          padding: '16px 16px 14px',
          backgroundColor: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderBottom: '1px solid #EDE9E6',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 30, height: 30, borderRadius: 9,
              background: 'linear-gradient(135deg, #4A7C6F, #6BAB8F)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: 14 }}>💬</span>
          </div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#2D2D2D' }}>専門家相談</h1>
        </div>
        <Link
          href="/employee/consultation/new"
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '8px 14px', borderRadius: 9999,
            background: 'linear-gradient(135deg, #C97A72, #D4958D)',
            color: 'white', fontSize: 12, fontWeight: 700,
            textDecoration: 'none', boxShadow: '0 3px 12px rgba(201,122,114,0.35)',
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

          {allConsultations.length === 0 ? (
            <div
              style={{
                borderRadius: 18, padding: '32px 20px', backgroundColor: 'white',
                boxShadow: '0 3px 16px rgba(0,0,0,0.07)', textAlign: 'center',
              }}
            >
              <p style={{ fontSize: 32, marginBottom: 10 }}>👩‍⚕️</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#2D2D2D', marginBottom: 6 }}>
                まだ相談がありません
              </p>
              <p style={{ fontSize: 12, color: '#9B9B9B' }}>
                右上の「＋ 新しい相談」から始めてみましょう
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {allConsultations.map((c) => {
                const status = STATUS_MAP[c.status] ?? STATUS_MAP.pending
                const messages = (c.consultation_messages as { body: string; sender_type: string; created_at: string }[] | null) ?? []
                const sortedMessages = [...messages].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                const lastMsg = sortedMessages[0]
                const specialistRaw = c.specialists as unknown
                const specialist = Array.isArray(specialistRaw)
                  ? ((specialistRaw[0] as { display_name: string } | undefined) ?? null)
                  : (specialistRaw as { display_name: string } | null)

                return (
                  <Link
                    key={c.id}
                    href={`/employee/consultation/${c.id}`}
                    style={{ textDecoration: 'none', display: 'block' }}
                  >
                    <div
                      className="card-hover"
                      style={{
                        borderRadius: 18, padding: '16px', backgroundColor: 'white',
                        boxShadow: '0 3px 16px rgba(0,0,0,0.07)', cursor: 'pointer',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span
                            style={{
                              fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 9999,
                              background: 'linear-gradient(135deg,#EDE8F5,#F3EFFE)', color: '#9B87B5',
                            }}
                          >
                            {CATEGORY_LABEL[c.category] ?? c.category}
                          </span>
                          <span
                            style={{
                              fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 9999,
                              background: status.gradient, color: status.color,
                            }}
                          >
                            {status.label}
                          </span>
                        </div>
                        <ChevronRight size={16} color="#C0C0C0" />
                      </div>

                      {lastMsg && (
                        <p className="line-clamp-2" style={{ fontSize: 13, lineHeight: 1.6, color: '#2D2D2D', marginBottom: 8 }}>
                          {lastMsg.body}
                        </p>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div
                          style={{
                            width: 22, height: 22, borderRadius: '50%',
                            background: 'linear-gradient(135deg, #4A7C6F, #6BAB8F)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontSize: 9, fontWeight: 700, flexShrink: 0,
                          }}
                        >
                          医
                        </div>
                        <span style={{ fontSize: 11, color: '#9B9B9B' }}>
                          {specialist?.display_name ?? '専門家'} · {formatDate(c.created_at)}
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </section>

        {/* ビデオ相談バナー */}
        <section>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#2D2D2D', marginBottom: 12 }}>産婦人科医 オンライン相談</h2>
          <div
            style={{
              borderRadius: 20, padding: '18px',
              background: 'linear-gradient(135deg, #EEF3F7 0%, #E5EEF5 100%)',
              display: 'flex', gap: 14, alignItems: 'center',
              boxShadow: '0 3px 14px rgba(0,0,0,0.06)',
            }}
          >
            <div
              style={{
                width: 52, height: 52, borderRadius: 16, backgroundColor: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
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
        </section>

        {/* 医療免責 */}
        <div
          style={{
            borderRadius: 14, padding: '12px 14px',
            background: 'linear-gradient(135deg, #EEF3F7, #E8EFF5)',
            display: 'flex', alignItems: 'flex-start', gap: 8,
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
