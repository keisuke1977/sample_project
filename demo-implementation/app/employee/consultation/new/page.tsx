'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Send, Lock } from 'lucide-react'
import type { ConsultationCategory } from '@/lib/mock-data'

const CATEGORIES: { id: ConsultationCategory; label: string; emoji: string; gradient: string; color: string }[] = [
  { id: 'menstrual', label: '月経ケア',  emoji: '🌸', color: '#C97A72', gradient: 'linear-gradient(135deg,#F2E0DE,#FDEAE8)' },
  { id: 'pms',       label: 'PMS',       emoji: '🌙', color: '#9B87B5', gradient: 'linear-gradient(135deg,#EDE8F5,#F3EFFE)' },
  { id: 'menopause', label: '更年期',    emoji: '🍃', color: '#4A7C6F', gradient: 'linear-gradient(135deg,#DCF0EB,#E8F5F0)' },
  { id: 'pregnancy', label: '妊活',      emoji: '🌱', color: '#6BAB8F', gradient: 'linear-gradient(135deg,#E0F5EC,#ECF9F3)' },
  { id: 'mental',    label: 'メンタル',  emoji: '💭', color: '#7B9EC4', gradient: 'linear-gradient(135deg,#E0EAF5,#ECF3FB)' },
  { id: 'other',     label: 'その他',    emoji: '💬', color: '#B88B6A', gradient: 'linear-gradient(135deg,#F5EBE0,#FBF3EB)' },
]

export default function NewConsultationPage() {
  const router = useRouter()
  const [category, setCategory] = useState<ConsultationCategory | null>(null)
  const [body, setBody] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/employee/consultation/consult-001')
  }

  const ready = category !== null && body.trim().length > 0

  return (
    <div className="emp-page">

      {/* ヘッダー */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          padding: '12px 16px',
          backgroundColor: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderBottom: '1px solid #EDE9E6',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            backgroundColor: '#F2E0DE',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
          aria-label="戻る"
        >
          <ArrowLeft size={18} color="#C97A72" />
        </button>
        <span style={{ fontSize: 16, fontWeight: 700, color: '#2D2D2D' }}>新しい相談</span>
      </header>

      <form onSubmit={handleSubmit} style={{ padding: '24px 16px 40px', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* カテゴリ選択 */}
        <div>
          <div style={{ marginBottom: 14 }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#2D2D2D', marginBottom: 4 }}>
              相談カテゴリを選んでください
            </p>
            <p style={{ fontSize: 12, color: '#9B9B9B' }}>あなたの状況に近いものを選んでください</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {CATEGORIES.map((cat) => {
              const sel = category === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    padding: '16px 10px',
                    borderRadius: 18,
                    border: `2px solid ${sel ? cat.color : '#EDE9E6'}`,
                    background: sel ? cat.gradient : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: sel ? `0 4px 16px ${cat.color}28` : '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                >
                  <span style={{ fontSize: 28 }}>{cat.emoji}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: sel ? cat.color : '#6B6B6B' }}>
                    {cat.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 相談内容入力 */}
        <div>
          <div style={{ marginBottom: 10 }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#2D2D2D', marginBottom: 4 }}>相談内容</p>
            <p style={{ fontSize: 12, color: '#9B9B9B' }}>気になる症状や困っていることを書いてください</p>
          </div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="例: 月経前になるとひどい頭痛と気分の落ち込みがあります。どのように対処すればよいでしょうか？"
            rows={6}
            style={{
              width: '100%',
              borderRadius: 16,
              border: '1.5px solid #EDE9E6',
              padding: '14px 16px',
              fontSize: 14,
              lineHeight: 1.65,
              color: '#2D2D2D',
              backgroundColor: 'white',
              boxSizing: 'border-box',
              resize: 'none',
              outline: 'none',
              boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
            }}
          />
          {/* プライバシー表示 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 8 }}>
            <Lock size={11} color="#9B9B9B" />
            <span style={{ fontSize: 11, color: '#9B9B9B' }}>入力内容は企業に共有されません</span>
          </div>
        </div>

        {/* 送信ボタン */}
        <button
          type="submit"
          disabled={!ready}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '18px',
            borderRadius: 20,
            border: 'none',
            background: ready
              ? 'linear-gradient(135deg, #C97A72 0%, #D4958D 100%)'
              : '#E5E2DF',
            color: ready ? 'white' : '#9B9B9B',
            fontWeight: 700,
            fontSize: 16,
            cursor: ready ? 'pointer' : 'not-allowed',
            boxShadow: ready ? '0 5px 22px rgba(201,122,114,0.40)' : 'none',
            transition: 'all 0.2s ease',
          }}
        >
          <Send size={18} />
          相談を送信する
        </button>

        {/* 安心メッセージ */}
        <div
          style={{
            borderRadius: 16,
            padding: '16px',
            background: 'linear-gradient(135deg, #F2E0DE 0%, #EDE8F5 100%)',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: 13, color: '#2D2D2D', fontWeight: 600, marginBottom: 4 }}>安心してご相談ください 💕</p>
          <p style={{ fontSize: 11, color: '#6B6B6B', lineHeight: 1.6 }}>
            看護師・助産師・産婦人科医が丁寧に対応します。<br />通常24時間以内に返信いたします。
          </p>
        </div>

      </form>
    </div>
  )
}
