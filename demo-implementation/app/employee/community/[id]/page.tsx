import { notFound } from 'next/navigation'
import { getCommunityPost } from '@/app/actions/community'
import { COMMUNITY_CATEGORIES } from '@/lib/community-categories'
import { LikeButton } from './LikeButton'
import { ReplySection } from './ReplySection'
import Link from 'next/link'
import { ArrowLeft, MessageCircle } from 'lucide-react'

export default async function CommunityPostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { success, post, replies, likedByMe, currentUserId } = await getCommunityPost(id)

  if (!success || !post) notFound()

  const cat = COMMUNITY_CATEGORIES.find((c) => c.value === post.category)

  return (
    <div className="emp-page" style={{ padding: '16px 16px 80px' }}>

      {/* 戻るボタン */}
      <Link
        href="/employee/community"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          marginBottom: 20, textDecoration: 'none', color: '#C97A72',
          fontSize: 14, fontWeight: 600,
        }}
      >
        <ArrowLeft size={16} />
        コミュニティへ戻る
      </Link>

      {/* 投稿カード */}
      <div
        style={{
          backgroundColor: 'white', borderRadius: 20, padding: '20px',
          boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
          border: '1px solid #F0EBE8', marginBottom: 24,
        }}
      >
        {/* カテゴリ・匿名バッジ */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          {cat && (
            <span
              style={{
                fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 20,
                backgroundColor: cat.color + '33', color: '#4A4A4A',
              }}
            >
              {cat.emoji} {cat.label}
            </span>
          )}
          {post.is_anonymous && (
            <span
              style={{
                fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20,
                backgroundColor: '#F3F4F6', color: '#9CA3AF',
              }}
            >
              匿名投稿
            </span>
          )}
        </div>

        {/* タイトル */}
        <h1 style={{ fontSize: 20, fontWeight: 800, color: '#2D2D2D', lineHeight: 1.4, marginBottom: 12 }}>
          {post.title}
        </h1>

        {/* 日時 */}
        <p style={{ fontSize: 12, color: '#ABABAB', marginBottom: 16 }}>
          {new Date(post.created_at).toLocaleDateString('ja-JP', {
            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
          })}
        </p>

        {/* 本文 */}
        <p style={{ fontSize: 15, color: '#3D3D3D', lineHeight: 1.8, marginBottom: 20, whiteSpace: 'pre-wrap' }}>
          {post.content}
        </p>

        {/* いいね・返信数 */}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 16,
            paddingTop: 16, borderTop: '1px solid #F0EBE8',
          }}
        >
          <LikeButton postId={post.id} initialLiked={likedByMe} initialCount={post.likes_count} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <MessageCircle size={18} color="#9B9B9B" />
            <span style={{ fontSize: 14, color: '#9B9B9B', fontWeight: 600 }}>
              {post.replies_count} 件の返信
            </span>
          </div>
        </div>
      </div>

      {/* 返信セクション */}
      <ReplySection postId={post.id} replies={replies} currentUserId={currentUserId} />
    </div>
  )
}
