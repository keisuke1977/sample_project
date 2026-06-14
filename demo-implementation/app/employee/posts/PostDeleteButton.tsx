'use client'

import { useTransition, useState } from 'react'
import { useRouter } from 'next/navigation'
import { deletePost } from '@/app/actions/posts'
import { Trash2 } from 'lucide-react'

export function PostDeleteButton({ postId, postTitle }: { postId: string; postTitle: string }) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deletePost(postId)
      if (result.success) {
        setShowConfirm(false)
        router.refresh()
      } else {
        alert(result.error ?? '削除に失敗しました')
      }
    })
  }

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        style={{
          padding: '6px 10px', borderRadius: 8, fontSize: 12, fontWeight: 600,
          border: '1.5px solid #FCCACA', color: '#D95B4A',
          backgroundColor: '#FFF5F5', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 4,
        }}
      >
        <Trash2 size={13} />
        削除
      </button>

      {showConfirm && (
        <div
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
            padding: '0 16px',
          }}
        >
          <div
            style={{
              backgroundColor: 'white', borderRadius: 20, padding: '24px',
              maxWidth: 360, width: '100%',
              boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#2D2D2D', marginBottom: 8 }}>
              投稿を削除しますか？
            </h3>
            <p style={{ fontSize: 13, color: '#6B6B6B', marginBottom: 20, lineHeight: 1.6 }}>
              「{postTitle}」を削除します。この操作は取り消せません。
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={handleDelete}
                disabled={isPending}
                style={{
                  flex: 1, padding: '12px', borderRadius: 12, border: 'none',
                  backgroundColor: '#D95B4A', color: 'white',
                  fontWeight: 700, fontSize: 14,
                  cursor: isPending ? 'not-allowed' : 'pointer',
                  opacity: isPending ? 0.7 : 1,
                }}
              >
                {isPending ? '削除中...' : '削除する'}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isPending}
                style={{
                  flex: 1, padding: '12px', borderRadius: 12,
                  border: '1.5px solid #EDE9E6',
                  backgroundColor: 'white', color: '#6B6B6B',
                  fontWeight: 600, fontSize: 14, cursor: 'pointer',
                }}
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
