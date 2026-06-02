'use client'

import { checkInHistory, todayCheckin } from '@/lib/mock-data'
import { getMenstrualLabel } from '@/lib/utils'
import { BarChart2 } from 'lucide-react'

const allRecords = [todayCheckin, ...checkInHistory]

const MENSTRUAL_STYLE: Record<string, { color: string; gradient: string; emoji: string }> = {
  menstrual:    { color: '#C97A72', gradient: 'linear-gradient(135deg,#F2E0DE,#FDEAE8)', emoji: '🌸' },
  premenstrual: { color: '#9B87B5', gradient: 'linear-gradient(135deg,#EDE8F5,#F3EFFE)', emoji: '🌙' },
  normal:       { color: '#4A7C6F', gradient: 'linear-gradient(135deg,#DCF0EB,#E8F5F0)', emoji: '☀️' },
}

const SYMPTOM_LABEL: Record<string, string> = {
  headache: '頭痛', abdominal_pain: '腹痛', bloating: 'むくみ',
  fatigue: '倦怠感', hot_flash: 'ほてり',
}

const SCORE_COLOR = ['', '#D95B4A', '#E8A87C', '#9B9B9B', '#6BAB8F', '#4A7C6F']
const SCORE_EMOJI = ['', '😫', '😔', '😐', '🙂', '😄']

function ScoreRow({ label, score, icon }: { label: string; score: number; icon: string }) {
  const color = SCORE_COLOR[score] ?? '#9B9B9B'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ fontSize: 12, color: '#6B6B6B', width: 60, flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: 7, borderRadius: 4, backgroundColor: '#EDE9E6', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            borderRadius: 4,
            width: `${(score / 5) * 100}%`,
            background: `linear-gradient(90deg, ${color}80, ${color})`,
            transition: 'width 0.6s ease',
          }}
        />
      </div>
      <span style={{ fontSize: 14, flexShrink: 0 }}>{SCORE_EMOJI[score]}</span>
      <span style={{ fontSize: 12, fontWeight: 700, color, width: 20, flexShrink: 0 }}>{score}</span>
    </div>
  )
}

export default function RecordsPage() {
  return (
    <div style={{ maxWidth: 480, margin: '0 auto', backgroundColor: '#FAF8F5', minHeight: '100vh' }}>

      {/* ヘッダー */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          padding: '16px',
          backgroundColor: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderBottom: '1px solid #EDE9E6',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 9,
              background: 'linear-gradient(135deg, #C97A72, #D4958D)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BarChart2 size={14} color="white" />
          </div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#2D2D2D' }}>体調記録</h1>
        </div>

        {/* 週サマリーバー */}
        <div style={{ marginTop: 14, display: 'flex', gap: 6 }}>
          {allRecords.slice(0, 7).map((r, i) => {
            const avg = Math.round((r.sleepScore + r.fatigueScore + r.moodScore) / 3)
            const col = SCORE_COLOR[avg] ?? '#9B9B9B'
            const d = new Date(r.date)
            return (
              <div key={r.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div
                  style={{
                    width: '100%',
                    height: 36,
                    borderRadius: 10,
                    background: i === 0
                      ? `linear-gradient(180deg, ${col}, ${col}88)`
                      : `linear-gradient(180deg, ${col}60, ${col}30)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    boxShadow: i === 0 ? `0 3px 10px ${col}40` : 'none',
                  }}
                >
                  {SCORE_EMOJI[avg]}
                </div>
                <span style={{ fontSize: 9, color: i === 0 ? col : '#9B9B9B', fontWeight: i === 0 ? 700 : 400 }}>
                  {i === 0 ? '今日' : ['日', '月', '火', '水', '木', '金', '土'][d.getDay()]}
                </span>
              </div>
            )
          })}
        </div>
      </header>

      {/* 記録一覧 */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {allRecords.map((record, idx) => {
          const date  = new Date(record.date)
          const style = MENSTRUAL_STYLE[record.menstrualStatus] ?? MENSTRUAL_STYLE.normal
          const dateLabel = idx === 0
            ? '今日'
            : date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric', weekday: 'short' })

          return (
            <div
              key={record.id}
              style={{
                borderRadius: 20,
                overflow: 'hidden',
                backgroundColor: 'white',
                boxShadow: idx === 0 ? '0 4px 20px rgba(201,122,114,0.15)' : '0 3px 12px rgba(0,0,0,0.06)',
                border: idx === 0 ? '1.5px solid #C97A7230' : 'none',
              }}
            >
              {/* カードヘッダー */}
              <div
                style={{
                  padding: '14px 16px 12px',
                  background: idx === 0 ? style.gradient : 'transparent',
                  borderBottom: '1px solid #F0EDE9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 22 }}>{style.emoji}</span>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: idx === 0 ? style.color : '#2D2D2D', marginBottom: 2 }}>
                      {dateLabel}
                    </p>
                    <p style={{ fontSize: 11, color: '#9B9B9B' }}>
                      {date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '5px 12px',
                    borderRadius: 9999,
                    backgroundColor: `${style.color}18`,
                    color: style.color,
                  }}
                >
                  {style.emoji} {getMenstrualLabel(record.menstrualStatus)}
                </span>
              </div>

              {/* スコア */}
              <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <ScoreRow label="睡眠の質" score={record.sleepScore}   icon="🌙" />
                <ScoreRow label="疲れ具合" score={record.fatigueScore} icon="⚡" />
                <ScoreRow label="気分・心" score={record.moodScore}    icon="💭" />
              </div>

              {/* 症状タグ */}
              {record.symptoms.length > 0 && (
                <div style={{ padding: '0 16px 12px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {record.symptoms.map((s) => (
                    <span
                      key={s}
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '4px 10px',
                        borderRadius: 9999,
                        backgroundColor: '#F2E0DE',
                        color: '#C97A72',
                      }}
                    >
                      {SYMPTOM_LABEL[s] ?? s}
                    </span>
                  ))}
                </div>
              )}

              {/* フィードバック */}
              <div
                style={{
                  margin: '0 16px 14px',
                  padding: '10px 12px',
                  borderRadius: 12,
                  backgroundColor: '#FAF8F5',
                  borderLeft: `3px solid ${style.color}60`,
                }}
              >
                <p style={{ fontSize: 12, lineHeight: 1.65, color: '#6B6B6B' }}>
                  {record.feedbackMessage}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
