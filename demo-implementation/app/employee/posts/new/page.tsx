'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createPost } from '@/app/actions/posts'
import { ArrowLeft } from 'lucide-react'

export default function NewPostPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await createPost(formData)
      if (result.success) {
        router.push('/employee/posts')
        router.refresh()
      } else {
        setError(result.error ?? '作成に失敗しました')
      }
    })
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '16px' }}>

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
        <h1 style={{ fontSize: 18, fontWeight: 700, color: '#2D2D2D' }}>新規投稿</h1>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

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

        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#4A4A4A', display: 'block', marginBottom: 8 }}>
            タイトル <span style={{ color: '#D95B4A' }}>*</span>
          </label>
          <input
            type="text"
            name="title"
            required
            maxLength={200}
            placeholder="投稿のタイトルを入力"
            disabled={isPending}
            style={{
              width: '100%', padding: '12px 14px', borderRadius: 12,
              border: '1.5px solid #EDE9E6', fontSize: 14,
              backgroundColor: 'white', outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#4A4A4A', display: 'block', marginBottom: 8 }}>
            内容 <span style={{ color: '#D95B4A' }}>*</span>
          </label>
          <textarea
            name="content"
            required
            rows={8}
            placeholder="投稿の内容を入力"
            disabled={isPending}
            style={{
              width: '100%', padding: '12px 14px', borderRadius: 12,
              border: '1.5px solid #EDE9E6', fontSize: 14,
              backgroundColor: 'white', outline: 'none', resize: 'vertical',
              fontFamily: 'inherit', lineHeight: 1.6,
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
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
            {isPending ? '投稿中...' : '投稿する'}
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
