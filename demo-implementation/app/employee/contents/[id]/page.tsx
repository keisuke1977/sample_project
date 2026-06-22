import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, Calendar, MessageCircle, ChevronRight, BookOpen } from 'lucide-react'
import { CONTENT_CATEGORIES, mockContents } from '@/lib/mock-data'
import { getCategoryColor, formatDate } from '@/lib/utils'
import { createServiceRoleClient } from '@/lib/supabase/service-role'

function calcReadTime(body: string): number {
  return Math.max(1, Math.round(body.length / 400))
}

function renderInline(text: string, catColor: string): ReactNode {
  const parts = text.split(/(\*\*.*?\*\*)/g)
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) {
      return <strong key={i} style={{ fontWeight: 700, color: catColor }}>{p.slice(2, -2)}</strong>
    }
    return p
  })
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function ContentDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = createServiceRoleClient()

  const { data: content } = await supabase
    .from('contents')
    .select('id, title, category, thumbnail_url, body, is_published, published_at')
    .eq('id', id)
    .eq('is_published', true)
    .maybeSingle()

  const fallback = mockContents.find((c) => c.id === id)
  const article = content ?? (fallback ? {
    id: fallback.id, title: fallback.title, category: fallback.category,
    thumbnail_url: fallback.thumbnailUrl, body: fallback.body ?? '',
    is_published: true, published_at: fallback.publishedAt,
  } : null)

  if (!article) notFound()

  const catColor  = getCategoryColor(article.category)
  const catLabel  = CONTENT_CATEGORIES.find((c) => c.id === article.category)?.label ?? article.category
  const paragraphs: string[] = article.body?.split('\n') ?? []
  const readTime  = calcReadTime(article.body ?? '')

  // 関連記事（同カテゴリから2件、自分以外）
  const relatedFallback = mockContents
    .filter((c) => c.category === article.category && c.id !== article.id)
    .slice(0, 2)

  return (
    <div className="emp-page" style={{ backgroundColor: '#FAF8F5' }}>

      {/* ── スティッキーヘッダー ── */}
      <header
        style={{
          position: 'sticky', top: 0, zIndex: 40,
          padding: '12px 16px',
          backgroundColor: 'rgba(250,248,245,0.95)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid #EDE9E6',
          display: 'flex', alignItems: 'center', gap: 12,
        }}
      >
        <Link
          href="/employee/contents"
          style={{
            width: 38, height: 38, borderRadius: '50%',
            backgroundColor: `${catColor}18`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}
          aria-label="戻る"
        >
          <ArrowLeft size={18} color={catColor} />
        </Link>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#2D2D2D', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {article.title}
        </span>
      </header>

      {/* ── ヒーロー画像 ── */}
      <div style={{ position: 'relative', height: 260, overflow: 'hidden' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={article.thumbnail_url ?? ''}
          alt={article.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.65) 100%)' }} />
        {/* カテゴリ＋読了時間バッジ */}
        <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 9999, backgroundColor: catColor, color: 'white' }}>
              {catLabel}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'rgba(255,255,255,0.85)', background: 'rgba(0,0,0,0.3)', padding: '4px 10px', borderRadius: 9999 }}>
              <Clock size={11} /> {readTime}分で読める
            </span>
          </div>
        </div>
      </div>

      {/* ── 本文エリア ── */}
      <div style={{ padding: '24px 20px 60px' }}>

        {/* メタ情報 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#9B9B9B' }}>
            <Calendar size={11} /> {article.published_at ? formatDate(article.published_at) : ''}
          </span>
        </div>

        {/* タイトル */}
        <h1 style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.45, color: '#1A1A1A', marginBottom: 20 }}>
          {article.title}
        </h1>

        {/* 医療免責バナー */}
        <div
          style={{
            borderRadius: 14, padding: '11px 14px',
            background: 'linear-gradient(135deg, #EEF3F7, #E8EFF5)',
            marginBottom: 28, display: 'flex', alignItems: 'flex-start', gap: 8,
          }}
        >
          <span style={{ fontSize: 15, flexShrink: 0 }}>🏥</span>
          <p style={{ fontSize: 11, color: '#4A6C8A', lineHeight: 1.65 }}>
            このコンテンツは医療行為ではありません。症状が続く場合は医師にご相談ください。
          </p>
        </div>

        {/* ── 本文レンダリング ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {paragraphs.map((line, i) => {
            if (line.startsWith('## ')) {
              return (
                <h2
                  key={i}
                  style={{
                    fontSize: 18, fontWeight: 800, color: '#1A1A1A',
                    marginTop: 32, marginBottom: 8,
                    paddingLeft: 12,
                    borderLeft: `4px solid ${catColor}`,
                  }}
                >
                  {line.replace('## ', '')}
                </h2>
              )
            }
            if (line.startsWith('### ')) {
              return (
                <h3
                  key={i}
                  style={{
                    fontSize: 15, fontWeight: 700, color: catColor,
                    marginTop: 20, marginBottom: 4,
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: catColor, display: 'inline-block', flexShrink: 0 }} />
                  {line.replace('### ', '')}
                </h3>
              )
            }
            if (line.startsWith('- ') || line.startsWith('- [ ] ')) {
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex', gap: 10, alignItems: 'flex-start',
                    background: `${catColor}08`, borderRadius: 10, padding: '8px 12px',
                  }}
                >
                  <span style={{ color: catColor, fontWeight: 800, flexShrink: 0, fontSize: 16, lineHeight: 1.5 }}>·</span>
                  <p style={{ fontSize: 14, lineHeight: 1.75, color: '#2D2D2D' }}>
                    {renderInline(line.replace(/^-\s(\[.\]\s)?/, ''), catColor)}
                  </p>
                </div>
              )
            }
            if (line.match(/^\d+\./)) {
              const num = line.match(/^(\d+)\./)?.[1]
              const rest = line.replace(/^\d+\.\s*/, '')
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex', gap: 12, alignItems: 'flex-start',
                    background: `${catColor}0A`, borderRadius: 10, padding: '8px 12px',
                  }}
                >
                  <span style={{ width: 22, height: 22, borderRadius: '50%', backgroundColor: catColor, color: 'white', fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {num}
                  </span>
                  <p style={{ fontSize: 14, lineHeight: 1.75, color: '#2D2D2D' }}>
                    {renderInline(rest, catColor)}
                  </p>
                </div>
              )
            }
            if (line.trim() === '') return <div key={i} style={{ height: 10 }} />
            return (
              <p key={i} style={{ fontSize: 14, lineHeight: 1.9, color: '#3A3A3A' }}>
                {renderInline(line, catColor)}
              </p>
            )
          })}
        </div>

        {/* ── 関連記事 ── */}
        {relatedFallback.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <BookOpen size={15} color={catColor} />
              <h3 style={{ fontSize: 14, fontWeight: 800, color: '#2D2D2D' }}>関連記事</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {relatedFallback.map((related) => (
                <Link key={related.id} href={`/employee/contents/${related.id}`} style={{ textDecoration: 'none' }}>
                  <div
                    className="card-hover"
                    style={{
                      display: 'flex', gap: 12, background: 'white', borderRadius: 16,
                      overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', cursor: 'pointer',
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={related.thumbnailUrl} alt={related.title} style={{ width: 84, height: 84, objectFit: 'cover', flexShrink: 0 }} />
                    <div style={{ flex: 1, padding: '12px 12px 12px 0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A', lineHeight: 1.45, marginBottom: 6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {related.title}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#9B9B9B' }}>
                        <Clock size={10} />
                        <span style={{ fontSize: 11 }}>{related.readTime}分</span>
                        <ChevronRight size={11} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── 専門家相談バナー ── */}
        <Link href="/employee/consultation" style={{ textDecoration: 'none', display: 'block', marginTop: 32 }}>
          <div
            className="card-hover"
            style={{
              borderRadius: 20, padding: '18px',
              background: 'linear-gradient(135deg, #F5E8F3 0%, #EDE8F5 100%)',
              display: 'flex', alignItems: 'center', gap: 14,
              boxShadow: '0 4px 18px rgba(155,135,181,0.18)', cursor: 'pointer',
              border: '1px solid rgba(155,135,181,0.18)',
            }}
          >
            <div
              style={{
                width: 52, height: 52, borderRadius: 16, backgroundColor: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}
            >
              👩‍⚕️
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 800, color: '#2D2D2D', marginBottom: 4 }}>
                もっと詳しく知りたいですか？
              </p>
              <p style={{ fontSize: 12, color: '#6B6B6B', lineHeight: 1.5 }}>専門家に直接相談できます</p>
            </div>
            <MessageCircle size={18} color="#9B87B5" style={{ flexShrink: 0 }} />
          </div>
        </Link>

        {/* コミュニティへ誘導 */}
        <Link href="/employee/community" style={{ textDecoration: 'none', display: 'block', marginTop: 12 }}>
          <div
            style={{
              borderRadius: 16, padding: '14px 18px',
              background: 'white', border: `1.5px solid ${catColor}28`,
              display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 20 }}>💬</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#2D2D2D' }}>同じ悩みを持つ仲間に相談する</p>
              <p style={{ fontSize: 11, color: '#9B9B9B' }}>コミュニティで体験をシェアしましょう</p>
            </div>
            <ChevronRight size={16} color={catColor} />
          </div>
        </Link>
      </div>
    </div>
  )
}
