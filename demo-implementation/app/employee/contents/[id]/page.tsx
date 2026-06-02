import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, Calendar, MessageCircle } from 'lucide-react'
import { mockContents, CONTENT_CATEGORIES } from '@/lib/mock-data'
import { getCategoryColor, formatDate } from '@/lib/utils'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ContentDetailPage({ params }: Props) {
  const { id } = await params
  const content = mockContents.find((c) => c.id === id)
  if (!content) notFound()

  const catColor  = getCategoryColor(content.category)
  const catLabel  = CONTENT_CATEGORIES.find((c) => c.id === content.category)?.label ?? content.category
  const paragraphs = content.body?.split('\n') ?? []

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', backgroundColor: '#FAF8F5', minHeight: '100vh' }}>

      {/* ヘッダー */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          padding: '12px 16px',
          backgroundColor: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderBottom: '1px solid #EDE9E6',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <Link
          href="/employee/contents"
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            backgroundColor: '#F2E0DE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
          aria-label="戻る"
        >
          <ArrowLeft size={18} color="#C97A72" />
        </Link>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#2D2D2D', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          コンテンツ
        </span>
      </header>

      {/* ヒーロー画像 */}
      <div style={{ position: 'relative', height: 240, overflow: 'hidden' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={content.thumbnailUrl}
          alt={content.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.5) 100%)',
          }}
        />
      </div>

      {/* 本文エリア */}
      <div style={{ padding: '24px 20px 40px', backgroundColor: '#FAF8F5' }}>

        {/* メタ情報 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              padding: '5px 12px',
              borderRadius: 9999,
              backgroundColor: `${catColor}20`,
              color: catColor,
            }}
          >
            {catLabel}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#9B9B9B' }}>
            <Clock size={11} /> {content.readTime}分
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#9B9B9B' }}>
            <Calendar size={11} /> {formatDate(content.publishedAt)}
          </span>
        </div>

        {/* タイトル */}
        <h1 style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.4, color: '#2D2D2D', marginBottom: 16 }}>
          {content.title}
        </h1>

        {/* 医療免責 */}
        <div
          style={{
            borderRadius: 14,
            padding: '12px 14px',
            background: 'linear-gradient(135deg, #EEF3F7, #E8EFF5)',
            marginBottom: 24,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 8,
          }}
        >
          <span style={{ fontSize: 16, flexShrink: 0 }}>🏥</span>
          <p style={{ fontSize: 11, color: '#4A6C8A', lineHeight: 1.6 }}>
            このコンテンツは医療行為ではありません。診断・処方は行いません。
          </p>
        </div>

        {/* 本文 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {paragraphs.map((line, i) => {
            if (line.startsWith('## ')) {
              return (
                <h2 key={i} style={{ fontSize: 17, fontWeight: 700, color: '#2D2D2D', marginTop: 24, marginBottom: 4, paddingBottom: 8, borderBottom: `2px solid ${catColor}30` }}>
                  {line.replace('## ', '')}
                </h2>
              )
            }
            if (line.startsWith('### ')) {
              return (
                <h3 key={i} style={{ fontSize: 14, fontWeight: 700, color: catColor, marginTop: 16 }}>
                  {line.replace('### ', '')}
                </h3>
              )
            }
            if (line.startsWith('- ') || line.startsWith('- [ ] ')) {
              return (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{ color: catColor, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>•</span>
                  <p style={{ fontSize: 14, lineHeight: 1.75, color: '#2D2D2D' }}>
                    {line.replace(/^-\s(\[.\]\s)?/, '')}
                  </p>
                </div>
              )
            }
            if (line.match(/^\d+\./)) {
              return (
                <p key={i} style={{ fontSize: 14, lineHeight: 1.75, color: '#2D2D2D', paddingLeft: 16 }}>
                  {line}
                </p>
              )
            }
            if (line.trim() === '') return <div key={i} style={{ height: 8 }} />
            return (
              <p key={i} style={{ fontSize: 14, lineHeight: 1.85, color: '#3D3D3D' }}>
                {line.replace(/\*\*(.*?)\*\*/g, '$1')}
              </p>
            )
          })}
        </div>

        {/* 専門家相談バナー */}
        <Link
          href="/employee/consultation"
          style={{ textDecoration: 'none', display: 'block', marginTop: 32 }}
        >
          <div
            className="card-hover"
            style={{
              borderRadius: 20,
              padding: '18px',
              background: 'linear-gradient(135deg, #F5E8F3 0%, #EDE8F5 100%)',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              boxShadow: '0 4px 18px rgba(155,135,181,0.18)',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}
            >
              👩‍⚕️
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#2D2D2D', marginBottom: 4 }}>
                もっと詳しく知りたいですか？
              </p>
              <p style={{ fontSize: 12, color: '#6B6B6B' }}>専門家に直接相談できます</p>
            </div>
            <MessageCircle size={18} color="#9B87B5" style={{ flexShrink: 0 }} />
          </div>
        </Link>
      </div>
    </div>
  )
}
