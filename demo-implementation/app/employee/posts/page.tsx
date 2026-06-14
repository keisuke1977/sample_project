import Link from 'next/link'
import { getPosts } from '@/app/actions/posts'
import { PostDeleteButton } from './PostDeleteButton'
import { PenLine, Plus } from 'lucide-react'

export default async function PostsPage() {
  const { data: posts } = await getPosts()

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '24px 16px 40px' }}>

      {/* ヘッダー */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #C97A72, #D4958D)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <PenLine size={18} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: '#2D2D2D', lineHeight: 1 }}>投稿</h1>
            <p style={{ fontSize: 11, color: '#9B9B9B', marginTop: 2 }}>{posts.length}件の投稿</p>
          </div>
        </div>
        <Link
          href="/employee/posts/new"
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', borderRadius: 12,
            background: 'linear-gradient(135deg, #C97A72, #D4958D)',
            color: 'white', fontWeight: 700, fontSize: 13,
            textDecoration: 'none',
            boxShadow: '0 3px 12px rgba(201,122,114,0.35)',
          }}
        >
          <Plus size={16} />
          新規投稿
        </Link>
      </div>

      {/* 投稿一覧 */}
      {posts.length === 0 ? (
        <div
          style={{
            textAlign: 'center', padding: '60px 20px',
            borderRadius: 20, backgroundColor: 'white',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>📝</div>
          <p style={{ fontSize: 16, fontWeight: 700, color: '#2D2D2D', marginBottom: 8 }}>
            まだ投稿がありません
          </p>
          <p style={{ fontSize: 13, color: '#9B9B9B', marginBottom: 24 }}>
            最初の投稿を作成してみましょう
          </p>
          <Link
            href="/employee/posts/new"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '10px 24px', borderRadius: 12,
              background: 'linear-gradient(135deg, #C97A72, #D4958D)',
              color: 'white', fontWeight: 700, fontSize: 14,
              textDecoration: 'none',
            }}
          >
            <Plus size={16} />
            投稿を作成
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {posts.map((post) => (
            <div
              key={post.id}
              style={{
                backgroundColor: 'white', borderRadius: 16, padding: '16px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                border: '1px solid #F0EBE8',
              }}
            >
              <p style={{ fontSize: 15, fontWeight: 700, color: '#2D2D2D', marginBottom: 6 }}>
                {post.title}
              </p>
              <p
                style={{
                  fontSize: 13, color: '#6B6B6B', lineHeight: 1.6,
                  marginBottom: 12,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {post.content}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, color: '#ABABAB' }}>
                  {new Date(post.created_at).toLocaleDateString('ja-JP', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Link
                    href={`/employee/posts/${post.id}/edit`}
                    style={{
                      padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                      border: '1.5px solid #EDE9E6', color: '#6B6B6B',
                      textDecoration: 'none', backgroundColor: 'white',
                    }}
                  >
                    編集
                  </Link>
                  <PostDeleteButton postId={post.id} postTitle={post.title} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
