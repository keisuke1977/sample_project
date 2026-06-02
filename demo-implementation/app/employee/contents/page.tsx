'use client'

import { useState } from 'react'
import Link from 'next/link'
import { mockContents, CONTENT_CATEGORIES, type ContentCategory } from '@/lib/mock-data'
import { getCategoryColor } from '@/lib/utils'
import { Clock, Sparkles } from 'lucide-react'

export default function ContentsPage() {
  const [activeCategory, setActiveCategory] = useState<ContentCategory | 'all'>('all')

  const filtered =
    activeCategory === 'all'
      ? mockContents
      : mockContents.filter((c) => c.category === activeCategory)

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', backgroundColor: '#FAF8F5', minHeight: '100vh' }}>

      {/* ヘッダー */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          padding: '16px 16px 0',
          backgroundColor: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderBottom: '1px solid #EDE9E6',
        }}
      >
        {/* タイトル */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 9,
              background: 'linear-gradient(135deg, #9B87B5, #C97A72)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={14} color="white" />
          </div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#2D2D2D' }}>コンテンツ</h1>
        </div>

        {/* カテゴリフィルター */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            overflowX: 'auto',
            paddingBottom: 12,
            margin: '0 -16px',
            padding: '0 16px 12px',
          }}
        >
          {[{ id: 'all' as const, label: 'すべて', color: '#9B9B9B' }, ...CONTENT_CATEGORIES].map((cat) => {
            const isActive = activeCategory === cat.id
            const col = cat.id === 'all' ? '#C97A72' : cat.color
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  flexShrink: 0,
                  padding: '8px 16px',
                  borderRadius: 9999,
                  border: `1.5px solid ${isActive ? col : '#EDE9E6'}`,
                  background: isActive ? `linear-gradient(135deg, ${col}28, ${col}12)` : 'white',
                  color: isActive ? col : '#9B9B9B',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: isActive ? `0 2px 10px ${col}20` : 'none',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {cat.label}
              </button>
            )
          })}
        </div>
      </header>

      {/* コンテンツ一覧 */}
      <div style={{ padding: '16px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#9B9B9B' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🌸</div>
            <p style={{ fontSize: 14 }}>このカテゴリのコンテンツはまだありません</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* 1件目：大カード */}
            {filtered[0] && (
              <Link href={`/employee/contents/${filtered[0].id}`} style={{ textDecoration: 'none', display: 'block' }}>
                <div
                  className="card-hover"
                  style={{
                    borderRadius: 22,
                    overflow: 'hidden',
                    backgroundColor: 'white',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.09)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ position: 'relative', height: 200 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={filtered[0].thumbnailUrl}
                      alt={filtered[0].title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.55) 100%)',
                      }}
                    />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '4px 10px',
                          borderRadius: 9999,
                          marginBottom: 8,
                          backgroundColor: `${getCategoryColor(filtered[0].category)}CC`,
                          color: 'white',
                        }}
                      >
                        {CONTENT_CATEGORIES.find((c) => c.id === filtered[0].category)?.label}
                      </span>
                      <p style={{ color: 'white', fontWeight: 700, fontSize: 16, lineHeight: 1.4, marginBottom: 6 }}>
                        {filtered[0].title}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,0.75)' }}>
                        <Clock size={11} />
                        <span style={{ fontSize: 11 }}>{filtered[0].readTime}分で読める</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* 2件目以降：横長カード */}
            {filtered.slice(1).map((content) => {
              const catColor = getCategoryColor(content.category)
              return (
                <Link
                  key={content.id}
                  href={`/employee/contents/${content.id}`}
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  <div
                    className="card-hover"
                    style={{
                      display: 'flex',
                      gap: 0,
                      borderRadius: 18,
                      overflow: 'hidden',
                      backgroundColor: 'white',
                      boxShadow: '0 3px 14px rgba(0,0,0,0.07)',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ width: 100, flexShrink: 0, position: 'relative' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={content.thumbnailUrl}
                        alt={content.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </div>
                    <div style={{ flex: 1, padding: '14px 14px 14px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          fontSize: 10,
                          fontWeight: 700,
                          padding: '3px 9px',
                          borderRadius: 9999,
                          marginBottom: 6,
                          backgroundColor: `${catColor}18`,
                          color: catColor,
                          alignSelf: 'flex-start',
                        }}
                      >
                        {CONTENT_CATEGORIES.find((c) => c.id === content.category)?.label}
                      </span>
                      <p
                        className="line-clamp-2"
                        style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.45, color: '#2D2D2D', marginBottom: 6 }}
                      >
                        {content.title}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#9B9B9B' }}>
                        <Clock size={10} />
                        <span style={{ fontSize: 11 }}>{content.readTime}分</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
