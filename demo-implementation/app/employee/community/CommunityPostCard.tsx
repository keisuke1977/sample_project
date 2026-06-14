'use client'

import Link from 'next/link'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, MessageCircle, Trash2, Pencil } from 'lucide-react'
import { toggleLike, deleteCommunityPost } from '@/app/actions/community'
import { COMMUNITY_CATEGORIES } from '@/lib/community-categories'
import type { CommunityPost } from '@/lib/supabase/types'

interface Props {
  post: CommunityPost
  isLiked: boolean
  isOwner: boolean
}

export function CommunityPostCard({ post, isLiked, isOwner }: Props) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const cat = COMMUNITY_CATEGORIES.find((c) => c.value === post.category)

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    startTransition(async () => {
      await toggleLike(post.id)
      router.refresh()
    })
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!confirm(`「${post.title}」を削除しますか？`)) return
    startTransition(async () => {
      await deleteCommunityPost(post.id)
      router.refresh()
    })
  }

  return (
    <Link
      href={`/employee/community/${post.id}`}
      style={{ textDecoration: 'none' }}
    >
      <div
        style={{
          backgroundColor: 'white', borderRadius: 16, padding: '16px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          border: '1px solid #F0EBE8', cursor: 'pointer',
          transition: 'box-shadow 0.15s ease',
        }}
      >
        {/* カテゴリバッジ・匿名バッジ */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          {cat && (
            <span
              style={{
                fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                backgroundColor: cat.color + '33',
                color: '#4A4A4A',
              }}
            >
              {cat.emoji} {cat.label}
            </span>
          )}
          {post.is_anonymous && (
            <span
              style={{
                fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                backgroundColor: '#F3F4F6', color: '#9CA3AF',
              }}
            >
              匿名
            </span>
          )}
        </div>

        {/* タイトル */}
        <p style={{ fontSize: 15, fontWeight: 700, color: '#2D2D2D', marginBottom: 6, lineHeight: 1.4 }}>
          {post.title}
        </p>

        {/* 本文プレビュー */}
        <p
          style={{
            fontSize: 13, color: '#6B6B6B', lineHeight: 1.6, marginBottom: 12,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {post.content}
        </p>

        {/* フッター */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, color: '#ABABAB' }}>
            {new Date(post.created_at).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* いいね */}
            <button
              onClick={handleLike}
              disabled={isPending}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '4px 8px', borderRadius: 8,
                backgroundColor: isLiked ? '#FEE2E2' : '#F9F7F6',
              }}
            >
              <Heart
                size={15}
                fill={isLiked ? '#EF4444' : 'none'}
                color={isLiked ? '#EF4444' : '#9B9B9B'}
                strokeWidth={2}
              />
              <span style={{ fontSize: 12, fontWeight: 600, color: isLiked ? '#EF4444' : '#9B9B9B' }}>
                {post.likes_count}
              </span>
            </button>

            {/* 返信数 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <MessageCircle size={15} color="#9B9B9B" strokeWidth={2} />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#9B9B9B' }}>
                {post.replies_count}
              </span>
            </div>

            {/* 編集・削除（本人のみ） */}
            {isOwner && (
              <>
                <button
                  onClick={(e) => { e.preventDefault(); router.push(`/employee/community/${post.id}/edit`) }}
                  disabled={isPending}
                  style={{
                    display: 'flex', alignItems: 'center',
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: '4px', borderRadius: 6,
                  }}
                >
                  <Pencil size={14} color="#C97A72" />
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isPending}
                  style={{
                    display: 'flex', alignItems: 'center',
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: '4px', borderRadius: 6,
                  }}
                >
                  <Trash2 size={14} color="#ABABAB" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
