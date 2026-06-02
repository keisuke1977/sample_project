'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Send } from 'lucide-react'
import type { ConsultationCategory } from '@/lib/mock-data'

const CATEGORIES: { id: ConsultationCategory; label: string; emoji: string }[] = [
  { id: 'menstrual', label: '月経ケア', emoji: '🌸' },
  { id: 'pms', label: 'PMS', emoji: '🌙' },
  { id: 'menopause', label: '更年期', emoji: '🍃' },
  { id: 'pregnancy', label: '妊活', emoji: '🌱' },
  { id: 'mental', label: 'メンタル', emoji: '💭' },
  { id: 'other', label: 'その他', emoji: '💬' },
]

export default function NewConsultationPage() {
  const router = useRouter()
  const [category, setCategory] = useState<ConsultationCategory | null>(null)
  const [body, setBody] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/employee/consultation/consult-001')
  }

  return (
    <div className="max-w-lg mx-auto">
      <header
        className="sticky top-0 z-40 px-4 py-3 flex items-center gap-3 border-b"
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
        <span className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>
          新しい相談
        </span>
      </header>

      <form onSubmit={handleSubmit} className="px-4 py-5 space-y-6">
        <div>
          <p className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
            相談カテゴリを選んでください
          </p>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all"
                style={{
                  borderColor: category === cat.id ? 'var(--color-primary)' : 'var(--color-border)',
                  backgroundColor: category === cat.id ? 'var(--color-primary-light)' : 'var(--color-surface)',
                  color: category === cat.id ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                }}
              >
                <span className="text-2xl">{cat.emoji}</span>
                <span className="text-xs font-medium">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
            相談内容を入力してください
          </p>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="気になる症状や困っていることを教えてください..."
            rows={6}
            className="w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 resize-none"
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-primary)',
              backgroundColor: 'var(--color-surface)',
            }}
          />
          <p className="text-xs mt-1.5" style={{ color: 'var(--color-text-secondary)' }}>
            🔒 入力内容は企業に共有されません
          </p>
        </div>

        <button
          type="submit"
          disabled={!category || !body.trim()}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-white transition-all disabled:opacity-40"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <Send className="w-4 h-4" />
          相談を送信する
        </button>
      </form>
    </div>
  )
}
