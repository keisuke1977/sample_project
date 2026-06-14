import Link from 'next/link'
import { getCommunityPosts, getLikedPostIds } from '@/app/actions/community'
import { COMMUNITY_CATEGORIES } from '@/lib/community-categories'
import { CommunityPostCard } from './CommunityPostCard'
import { Users, Plus } from 'lucide-react'
import type { CommunityCategory } from '@/lib/supabase/types'

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const selectedCategory = (category as CommunityCategory) || undefined

  const { data: posts, currentUserId } = await getCommunityPosts(selectedCategory)
  const likedIds = await getLikedPostIds(posts.map((p) => p.id))

  return (
    <div className="emp-page" style={{ padding: '24px 16px 80px' }}>

      {/* ヘッダー */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #C97A72, #D4958D)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Users size={18} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: '#2D2D2D', lineHeight: 1 }}>コミュニティ</h1>
            <p style={{ fontSize: 11, color: '#9B9B9B', marginTop: 2 }}>同じ悩みを持つ女性と繋がろう</p>
          </div>
        </div>
        <Link
          href="/employee/community/new"
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 12,
            background: 'linear-gradient(135deg, #C97A72, #D4958D)',
            color: 'white', fontWeight: 700, fontSize: 13,
            textDecoration: 'none',
            boxShadow: '0 3px 12px rgba(201,122,114,0.35)',
          }}
        >
          <Plus size={16} />
          投稿する
        </Link>
      </div>

      {/* カテゴリフィルター */}
      <div
        style={{
          display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: 20,
          scrollbarWidth: 'none',
        }}
      >
        <Link
          href="/employee/community"
          style={{
            flexShrink: 0, padding: '6px 14px', borderRadius: 20,
            fontSize: 12, fontWeight: 600, textDecoration: 'none',
            backgroundColor: !selectedCategory ? '#C97A72' : '#F2EBE9',
            color: !selectedCategory ? 'white' : '#6B6B6B',
            border: !selectedCategory ? 'none' : '1.5px solid #EDE9E6',
          }}
        >
          すべて
        </Link>
        {COMMUNITY_CATEGORIES.map((cat) => (
          <Link
            key={cat.value}
            href={`/employee/community?category=${cat.value}`}
            style={{
              flexShrink: 0, padding: '6px 14px', borderRadius: 20,
              fontSize: 12, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap',
              backgroundColor: selectedCategory === cat.value ? '#C97A72' : '#F2EBE9',
              color: selectedCategory === cat.value ? 'white' : '#6B6B6B',
              border: selectedCategory === cat.value ? 'none' : '1.5px solid #EDE9E6',
            }}
          >
            {cat.emoji} {cat.label}
          </Link>
        ))}
      </div>

      {/* 投稿件数 */}
      <p style={{ fontSize: 12, color: '#ABABAB', marginBottom: 14 }}>{posts.length}件の投稿</p>

      <style>{`
        @media (min-width: 768px) {
          .community-grid { display: grid !important; grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      {/* 投稿一覧 */}
      {posts.length === 0 ? (
        <div
          style={{
            textAlign: 'center', padding: '60px 20px',
            borderRadius: 20, backgroundColor: 'white',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>🌸</div>
          <p style={{ fontSize: 16, fontWeight: 700, color: '#2D2D2D', marginBottom: 8 }}>
            まだ投稿がありません
          </p>
          <p style={{ fontSize: 13, color: '#9B9B9B', lineHeight: 1.6 }}>
            悩みや経験を共有して、<br />同じ気持ちの仲間と繋がりましょう。<br />
            <span style={{ color: '#C97A72', fontWeight: 600 }}>右上の「＋ 投稿する」から始めてみましょう</span>
          </p>
        </div>
      ) : (
        <div className="community-grid" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {posts.map((post) => (
            <CommunityPostCard
              key={post.id}
              post={post}
              isLiked={likedIds.includes(post.id)}
              isOwner={post.user_id === currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  )
}
