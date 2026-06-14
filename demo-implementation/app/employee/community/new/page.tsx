'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createCommunityPost } from '@/app/actions/community'
import { COMMUNITY_CATEGORIES } from '@/lib/community-categories'
import { ArrowLeft } from 'lucide-react'
import type { CommunityCategory } from '@/lib/supabase/types'

export default function NewCommunityPostPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<CommunityCategory>('other')
  const [isAnonymous, setIsAnonymous] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const form = e.currentTarget
    const formData = new FormData(form)
    formData.set('category', selectedCategory)
    formData.set('is_anonymous', String(isAnonymous))

    startTransition(async () => {
      const result = await createCommunityPost(formData)
      if (result.success) {
        router.push('/employee/community')
        router.refresh()
      } else {
        setError(result.error ?? '投稿に失敗しました')
      }
    })
  }

  return (
    <div className="emp-page" style={{ padding: '16px 16px 80px' }}>

      {/* ヘッダー */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button
          onClick={() => router.back()}
          style={{
            width: 38, height: 38, borderRadius: '50%',
            backgroundColor: '#F2E0DE', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <ArrowLeft size={18} color="#C97A72" />
        </button>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#2D2D2D', lineHeight: 1 }}>悩みを投稿する</h1>
          <p style={{ fontSize: 11, color: '#9B9B9B', marginTop: 3 }}>同じ気持ちの仲間に届けましょう</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {error && (
          <div
            style={{
              padding: '12px 16px', borderRadius: 12,
              backgroundColor: '#FFF0EF', border: '1px solid #FCCACA',
              color: '#D95B4A', fontSize: 13,
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* カテゴリ選択 */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 700, color: '#4A4A4A', display: 'block', marginBottom: 10 }}>
            カテゴリ <span style={{ color: '#D95B4A' }}>*</span>
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {COMMUNITY_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setSelectedCategory(cat.value)}
                style={{
                  padding: '8px 14px', borderRadius: 20, border: 'none',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  backgroundColor: selectedCategory === cat.value ? '#C97A72' : '#F2EBE9',
                  color: selectedCategory === cat.value ? 'white' : '#6B6B6B',
                  transition: 'all 0.15s ease',
                }}
              >
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* タイトル */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 700, color: '#4A4A4A', display: 'block', marginBottom: 8 }}>
            タイトル <span style={{ color: '#D95B4A' }}>*</span>
          </label>
          <input
            type="text"
            name="title"
            required
            maxLength={200}
            placeholder="例：生理痛がひどくて仕事に集中できない..."
            disabled={isPending}
            style={{
              width: '100%', padding: '12px 14px', borderRadius: 12,
              border: '1.5px solid #EDE9E6', fontSize: 14,
              backgroundColor: 'white', outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* 本文 */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 700, color: '#4A4A4A', display: 'block', marginBottom: 8 }}>
            内容 <span style={{ color: '#D95B4A' }}>*</span>
          </label>
          <textarea
            name="content"
            required
            rows={7}
            placeholder="悩みや経験を自由に書いてください。匿名での投稿もできます。"
            disabled={isPending}
            style={{
              width: '100%', padding: '12px 14px', borderRadius: 12,
              border: '1.5px solid #EDE9E6', fontSize: 14,
              backgroundColor: 'white', outline: 'none', resize: 'vertical',
              fontFamily: 'inherit', lineHeight: 1.7, boxSizing: 'border-box',
            }}
          />
        </div>

        {/* 匿名オプション */}
        <button
          type="button"
          onClick={() => setIsAnonymous((v) => !v)}
          style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
            borderRadius: 14, border: `1.5px solid ${isAnonymous ? '#C97A72' : '#EDE9E6'}`,
            backgroundColor: isAnonymous ? '#FDF2F1' : 'white', cursor: 'pointer', textAlign: 'left',
          }}
        >
          <div
            style={{
              width: 22, height: 22, borderRadius: 6, flexShrink: 0,
              backgroundColor: isAnonymous ? '#C97A72' : 'white',
              border: `2px solid ${isAnonymous ? '#C97A72' : '#D1D5DB'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {isAnonymous && <span style={{ color: 'white', fontSize: 14, fontWeight: 900 }}>✓</span>}
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#2D2D2D', margin: 0 }}>匿名で投稿する</p>
            <p style={{ fontSize: 12, color: '#9B9B9B', margin: '2px 0 0' }}>
              名前が表示されません。安心して投稿できます
            </p>
          </div>
        </button>

        {/* 送信ボタン */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            type="submit"
            disabled={isPending}
            style={{
              flex: 1, padding: '14px', borderRadius: 14, border: 'none',
              background: isPending ? '#E5E2DF' : 'linear-gradient(135deg, #C97A72, #D4958D)',
              color: isPending ? '#9B9B9B' : 'white',
              fontWeight: 700, fontSize: 15,
              cursor: isPending ? 'not-allowed' : 'pointer',
              boxShadow: isPending ? 'none' : '0 4px 16px rgba(201,122,114,0.38)',
            }}
          >
            {isPending ? '投稿中...' : '🌸 投稿する'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isPending}
            style={{
              padding: '14px 20px', borderRadius: 14,
              border: '1.5px solid #EDE9E6', backgroundColor: 'white',
              color: '#6B6B6B', fontWeight: 600, fontSize: 15, cursor: 'pointer',
            }}
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  )
}
