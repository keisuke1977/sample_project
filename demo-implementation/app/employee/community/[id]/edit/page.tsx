'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { updateCommunityPost, getCommunityPost } from '@/app/actions/community'
import { COMMUNITY_CATEGORIES } from '@/lib/community-categories'
import { ArrowLeft, Save } from 'lucide-react'
import type { CommunityCategory } from '@/lib/supabase/types'

export default function EditCommunityPostPage() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string

  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<CommunityCategory>('other')
  const [isAnonymous, setIsAnonymous] = useState(false)

  useEffect(() => {
    getCommunityPost(postId).then(({ post }) => {
      if (post) {
        setTitle(post.title)
        setContent(post.content)
        setSelectedCategory(post.category as CommunityCategory)
        setIsAnonymous(post.is_anonymous)
      }
      setLoading(false)
    })
  }, [postId])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    formData.set('is_anonymous', String(isAnonymous))

    startTransition(async () => {
      const result = await updateCommunityPost(postId, formData)
      if (result.success) {
        router.push(`/employee/community/${postId}`)
      } else {
        setError(result.error ?? '更新に失敗しました')
      }
    })
  }

  if (loading) {
    return (
      <div className="emp-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
        <p style={{ color: '#9B9B9B', fontSize: 14 }}>読み込み中...</p>
      </div>
    )
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
            flexShrink: 0,
          }}
        >
          <ArrowLeft size={18} color="#C97A72" />
        </button>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#2D2D2D', lineHeight: 1 }}>投稿を編集する</h1>
          <p style={{ fontSize: 11, color: '#9B9B9B', marginTop: 3 }}>内容を修正して保存しましょう</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {error && (
          <div style={{
            padding: '12px 16px', borderRadius: 12,
            backgroundColor: '#FFF0EF', border: '1px solid #FCCACA',
            color: '#D95B4A', fontSize: 13,
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* カテゴリ */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 700, color: '#2D2D2D', display: 'block', marginBottom: 10 }}>
            カテゴリ <span style={{ color: '#C97A72' }}>*</span>
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {COMMUNITY_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setSelectedCategory(cat.value as CommunityCategory)}
                style={{
                  padding: '7px 14px', borderRadius: 9999, fontSize: 12, fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.15s',
                  backgroundColor: selectedCategory === cat.value ? '#C97A72' : '#F2EBE9',
                  color: selectedCategory === cat.value ? 'white' : '#6B6B6B',
                  border: selectedCategory === cat.value ? 'none' : '1.5px solid #EDE9E6',
                }}
              >
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>
          <input type="hidden" name="category" value={selectedCategory} />
        </div>

        {/* タイトル */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 700, color: '#2D2D2D', display: 'block', marginBottom: 8 }}>
            タイトル <span style={{ color: '#C97A72' }}>*</span>
          </label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={200}
            placeholder="悩みや経験を一言で…"
            style={{
              width: '100%', padding: '12px 14px', borderRadius: 12, fontSize: 14,
              border: '1.5px solid #EDE9E6', backgroundColor: 'white', color: '#2D2D2D',
              outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* 本文 */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 700, color: '#2D2D2D', display: 'block', marginBottom: 8 }}>
            内容 <span style={{ color: '#C97A72' }}>*</span>
          </label>
          <textarea
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={6}
            placeholder="詳しく教えてください…"
            style={{
              width: '100%', padding: '12px 14px', borderRadius: 12, fontSize: 14,
              border: '1.5px solid #EDE9E6', backgroundColor: 'white', color: '#2D2D2D',
              outline: 'none', resize: 'vertical', lineHeight: 1.7, boxSizing: 'border-box',
            }}
          />
        </div>

        {/* 匿名オプション */}
        <button
          type="button"
          onClick={() => setIsAnonymous(!isAnonymous)}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 16px', borderRadius: 12, cursor: 'pointer',
            backgroundColor: isAnonymous ? '#FDF0EE' : '#F9F7F5',
            border: `1.5px solid ${isAnonymous ? '#C97A72' : '#EDE9E6'}`,
            width: '100%', textAlign: 'left',
          }}
        >
          <div style={{
            width: 20, height: 20, borderRadius: 6,
            backgroundColor: isAnonymous ? '#C97A72' : 'white',
            border: `1.5px solid ${isAnonymous ? '#C97A72' : '#D1D5DB'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            {isAnonymous && <span style={{ color: 'white', fontSize: 12, fontWeight: 700 }}>✓</span>}
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#2D2D2D' }}>匿名で投稿する</p>
            <p style={{ fontSize: 11, color: '#9B9B9B' }}>名前は表示されません</p>
          </div>
        </button>

        {/* 送信 */}
        <button
          type="submit"
          disabled={isPending || !title.trim() || !content.trim()}
          style={{
            padding: '14px', borderRadius: 14, fontSize: 15, fontWeight: 700,
            border: 'none', cursor: isPending ? 'not-allowed' : 'pointer',
            background: isPending ? '#E0D0CF' : 'linear-gradient(135deg, #C97A72, #D4958D)',
            color: 'white', boxShadow: isPending ? 'none' : '0 4px 18px rgba(201,122,114,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'all 0.2s',
          }}
        >
          <Save size={16} />
          {isPending ? '保存中...' : '変更を保存する'}
        </button>

      </form>
    </div>
  )
}
