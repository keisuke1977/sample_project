'use client'

import { notFound, useRouter } from 'next/navigation'
import { use, useState, useRef, useEffect } from 'react'
import { ArrowLeft, Send, Lock } from 'lucide-react'
import { mockConsultations } from '@/lib/mock-data'
import { formatTime } from '@/lib/utils'

interface Props {
  params: Promise<{ id: string }>
}

const CATEGORY_LABEL: Record<string, string> = {
  menstrual: '月経ケア', pms: 'PMS', menopause: '更年期',
  pregnancy: '妊活', mental: 'メンタル', other: 'その他',
}

export default function ConsultationDetailPage({ params }: Props) {
  const { id } = use(params)
  const router = useRouter()
  const consultation = mockConsultations.find((c) => c.id === id)
  if (!consultation) notFound()

  const [messages, setMessages] = useState(consultation.messages)
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return
    setMessages((prev) => [
      ...prev,
      { id: `msg-${Date.now()}`, senderType: 'user' as const, body: input.trim(), createdAt: new Date().toISOString() },
    ])
    setInput('')
  }

  return (
    <div
      className="emp-page"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',
      }}
    >
      {/* ヘッダー */}
      <header
        style={{
          padding: '12px 16px',
          backgroundColor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderBottom: '1px solid #EDE9E6',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexShrink: 0,
          boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
          aria-label="戻る"
        >
          <ArrowLeft size={18} color="#C97A72" />
        </button>

        {/* 専門家アバター */}
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4A7C6F, #6BAB8F)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 13,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          医
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#2D2D2D', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {consultation.specialistName}
          </p>
          <p style={{ fontSize: 11, color: '#9B9B9B' }}>
            {CATEGORY_LABEL[consultation.category]} · オンライン
          </p>
        </div>
      </header>

      {/* メッセージエリア */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {messages.map((msg) => {
          const isUser = msg.senderType === 'user'
          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                gap: 10,
                flexDirection: isUser ? 'row-reverse' : 'row',
                alignItems: 'flex-end',
              }}
            >
              {/* 専門家アバター */}
              {!isUser && (
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4A7C6F, #6BAB8F)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: 11,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  医
                </div>
              )}

              <div
                style={{
                  maxWidth: '72%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isUser ? 'flex-end' : 'flex-start',
                  gap: 4,
                }}
              >
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: isUser ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
                    fontSize: 14,
                    lineHeight: 1.65,
                    background: isUser
                      ? 'linear-gradient(135deg, #C97A72, #D4958D)'
                      : 'white',
                    color: isUser ? 'white' : '#2D2D2D',
                    boxShadow: isUser
                      ? '0 3px 14px rgba(201,122,114,0.30)'
                      : '0 2px 10px rgba(0,0,0,0.07)',
                  }}
                >
                  {msg.body}
                </div>
                <span style={{ fontSize: 10, color: '#ABABAB' }}>
                  {formatTime(msg.createdAt)}
                </span>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* 入力バー */}
      <div
        style={{
          padding: '12px 16px',
          paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
          backgroundColor: 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderTop: '1px solid #EDE9E6',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="メッセージを入力..."
            rows={2}
            style={{
              flex: 1,
              resize: 'none',
              borderRadius: 16,
              border: '1.5px solid #EDE9E6',
              padding: '12px 14px',
              fontSize: 14,
              lineHeight: 1.5,
              color: '#2D2D2D',
              backgroundColor: '#FAF8F5',
              outline: 'none',
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            style={{
              width: 46,
              height: 46,
              borderRadius: '50%',
              border: 'none',
              background: input.trim()
                ? 'linear-gradient(135deg, #C97A72, #D4958D)'
                : '#E5E2DF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: input.trim() ? 'pointer' : 'not-allowed',
              flexShrink: 0,
              boxShadow: input.trim() ? '0 3px 14px rgba(201,122,114,0.35)' : 'none',
              transition: 'all 0.2s ease',
            }}
            aria-label="送信"
          >
            <Send size={18} color="white" />
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 8 }}>
          <Lock size={10} color="#ABABAB" />
          <span style={{ fontSize: 10, color: '#ABABAB' }}>あなたの情報は企業に共有されません</span>
        </div>
      </div>
    </div>
  )
}
