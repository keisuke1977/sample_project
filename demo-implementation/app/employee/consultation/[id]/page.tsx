'use client'

import { notFound, useRouter } from 'next/navigation'
import { use, useState, useRef, useEffect } from 'react'
import { ArrowLeft, Send } from 'lucide-react'
import { mockConsultations } from '@/lib/mock-data'
import { formatTime } from '@/lib/utils'

interface Props {
  params: Promise<{ id: string }>
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
      {
        id: `msg-new-${Date.now()}`,
        senderType: 'user' as const,
        body: input.trim(),
        createdAt: new Date().toISOString(),
      },
    ])
    setInput('')
  }

  const categoryLabel: Record<string, string> = {
    menstrual: '月経ケア', pms: 'PMS', menopause: '更年期',
    pregnancy: '妊活', mental: 'メンタル', other: 'その他',
  }

  return (
    <div className="max-w-lg mx-auto flex flex-col h-screen">
      <header
        className="sticky top-0 z-40 px-4 py-3 flex items-center gap-3 border-b flex-shrink-0"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <button
          onClick={() => router.back()}
          className="tap-target rounded-full"
          style={{ color: 'var(--color-text-secondary)' }}
          aria-label="戻る"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>
            {consultation.specialistName}
          </p>
          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            {categoryLabel[consultation.category]}
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-4">
        {messages.map((msg) => {
          const isUser = msg.senderType === 'user'
          return (
            <div key={msg.id} className={`flex gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
              {!isUser && (
                <div
                  className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-semibold"
                  style={{ backgroundColor: 'var(--color-accent)' }}
                >
                  医
                </div>
              )}
              <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[78%]`}>
                <div
                  className="rounded-2xl px-4 py-3 text-sm leading-relaxed"
                  style={{
                    backgroundColor: isUser ? 'var(--color-primary)' : 'var(--color-surface)',
                    color: isUser ? 'white' : 'var(--color-text-primary)',
                    border: isUser ? 'none' : '1px solid var(--color-border)',
                  }}
                >
                  {msg.body}
                </div>
                <span className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                  {formatTime(msg.createdAt)}
                </span>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      <div
        className="flex-shrink-0 px-4 py-3 border-t pb-safe"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="メッセージを入力..."
            rows={2}
            className="flex-1 resize-none rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-primary)',
              backgroundColor: 'var(--color-background)',
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-11 h-11 rounded-full flex items-center justify-center text-white disabled:opacity-40 transition-opacity flex-shrink-0"
            style={{ backgroundColor: 'var(--color-primary)' }}
            aria-label="送信"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs mt-2 text-center" style={{ color: 'var(--color-text-secondary)' }}>
          🔒 あなたの情報は企業に共有されません
        </p>
      </div>
    </div>
  )
}
