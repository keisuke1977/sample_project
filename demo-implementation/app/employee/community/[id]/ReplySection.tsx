'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createReply, deleteReply } from '@/app/actions/community'
import { Send, Trash2 } from 'lucide-react'
import type { CommunityReply } from '@/lib/supabase/types'

interface Props {
  postId: string
  replies: CommunityReply[]
  currentUserId: string | null
}

export function ReplySection({ postId, replies, currentUserId }: Props) {
  const [content, setContent] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    setError(null)

    const formData = new FormData()
    formData.append('content', content.trim())
    formData.append('is_anonymous', String(isAnonymous))

    startTransition(async () => {
      const result = await createReply(postId, formData)
      if (result.success) {
        setContent('')
        router.refresh()
      } else {
        setError(result.error ?? '返信に失敗しました')
      }
    })
  }

  const handleDelete = (replyId: string) => {
    if (!confirm('この返信を削除しますか？')) return
    startTransition(async () => {
      await deleteReply(replyId, postId)
      router.refresh()
    })
  }

  return (
    <div>
      {/* 返信一覧 */}
      <h2 style={{ fontSize: 15, fontWeight: 700, color: '#4A4A4A', marginBottom: 16 }}>
        返信 {replies.length}件
      </h2>

      {replies.length === 0 ? (
        <div
          style={{
            textAlign: 'center', padding: '32px 20px',
            backgroundColor: '#FAF7F5', borderRadius: 16, marginBottom: 24,
          }}
        >
          <p style={{ fontSize: 13, color: '#ABABAB' }}>まだ返信はありません。最初に返信してみましょう！</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {replies.map((reply) => (
            <div
              key={reply.id}
              style={{
                backgroundColor: reply.user_id === currentUserId ? '#FDF2F1' : '#FAF7F5',
                borderRadius: 14, padding: '14px 16px',
                border: reply.user_id === currentUserId ? '1px solid #F2D5D2' : '1px solid #EDE9E6',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      width: 28, height: 28, borderRadius: '50%',
                      backgroundColor: reply.user_id === currentUserId ? '#F2D5D2' : '#E5E7EB',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700,
                      color: reply.user_id === currentUserId ? '#C97A72' : '#6B7280',
                    }}
                  >
                    {reply.is_anonymous ? '匿' : (reply.user_id === currentUserId ? '自' : '他')}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#6B6B6B' }}>
                    {reply.is_anonymous ? '匿名さん' : (reply.user_id === currentUserId ? 'あなた' : 'メンバー')}
                  </span>
                  <span style={{ fontSize: 11, color: '#ABABAB' }}>
                    {new Date(reply.created_at).toLocaleDateString('ja-JP', {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                    })}
                  </span>
                </div>
                {reply.user_id === currentUserId && (
                  <button
                    onClick={() => handleDelete(reply.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
                  >
                    <Trash2 size={14} color="#ABABAB" />
                  </button>
                )}
              </div>
              <p style={{ fontSize: 14, color: '#3D3D3D', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>
                {reply.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 返信入力フォーム */}
      <div
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
          backgroundColor: 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderTop: '1px solid #EDE9E6',
          padding: '12px 16px',
          paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
        }}
      >
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          {/* 匿名トグル */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <button
              type="button"
              onClick={() => setIsAnonymous((v) => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '4px 12px', borderRadius: 20, border: 'none',
                backgroundColor: isAnonymous ? '#F2D5D2' : '#F3F4F6',
                color: isAnonymous ? '#C97A72' : '#9CA3AF',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}
            >
              <span>{isAnonymous ? '✓' : '○'}</span>
              匿名で返信
            </button>
          </div>

          {error && (
            <p style={{ fontSize: 12, color: '#D95B4A', marginBottom: 8 }}>⚠️ {error}</p>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10 }}>
            <input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="返信を入力..."
              disabled={isPending}
              style={{
                flex: 1, padding: '11px 14px', borderRadius: 12,
                border: '1.5px solid #EDE9E6', fontSize: 14,
                backgroundColor: 'white', outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={isPending || !content.trim()}
              style={{
                width: 44, height: 44, borderRadius: 12, border: 'none',
                background: content.trim()
                  ? 'linear-gradient(135deg, #C97A72, #D4958D)'
                  : '#E5E2DF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: content.trim() ? 'pointer' : 'not-allowed',
                flexShrink: 0,
              }}
            >
              <Send size={18} color={content.trim() ? 'white' : '#ABABAB'} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
