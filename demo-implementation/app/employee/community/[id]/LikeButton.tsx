'use client'

import { useState, useTransition } from 'react'
import { Heart } from 'lucide-react'
import { toggleLike } from '@/app/actions/community'

interface Props {
  postId: string
  initialLiked: boolean
  initialCount: number
}

export function LikeButton({ postId, initialLiked, initialCount }: Props) {
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    // オプティミスティック UI（即座に見た目を更新）
    setLiked((prev) => !prev)
    setCount((prev) => liked ? prev - 1 : prev + 1)

    startTransition(async () => {
      const result = await toggleLike(postId)
      if (!result.success) {
        // 失敗時は元に戻す
        setLiked(liked)
        setCount(initialCount)
      }
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 16px', borderRadius: 12, border: 'none',
        backgroundColor: liked ? '#FEE2E2' : '#F9F7F6',
        cursor: isPending ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s ease',
      }}
    >
      <Heart
        size={20}
        fill={liked ? '#EF4444' : 'none'}
        color={liked ? '#EF4444' : '#9B9B9B'}
        strokeWidth={2}
        style={{ transition: 'all 0.15s ease' }}
      />
      <span
        style={{
          fontSize: 15, fontWeight: 700,
          color: liked ? '#EF4444' : '#9B9B9B',
        }}
      >
        {count} グッド
      </span>
    </button>
  )
}
