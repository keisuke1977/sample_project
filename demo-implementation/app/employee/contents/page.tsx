'use client'

import { useState } from 'react'
import Link from 'next/link'
import { mockContents, CONTENT_CATEGORIES, type ContentCategory } from '@/lib/mock-data'
import { getCategoryColor } from '@/lib/utils'
import { Clock } from 'lucide-react'

export default function ContentsPage() {
  const [activeCategory, setActiveCategory] = useState<ContentCategory | 'all'>('all')

  const filtered =
    activeCategory === 'all'
      ? mockContents
      : mockContents.filter((c) => c.category === activeCategory)

  return (
    <div className="max-w-lg mx-auto">
      <header
        className="sticky top-0 z-40 px-4 pt-4 border-b"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <h1 className="text-lg font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>
          コンテンツ
        </h1>
        <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4">
          <button
            onClick={() => setActiveCategory('all')}
            className="flex-shrink-0 text-xs font-medium px-3 py-2 rounded-full border transition-colors"
            style={{
              borderColor: activeCategory === 'all' ? 'var(--color-primary)' : 'var(--color-border)',
              backgroundColor: activeCategory === 'all' ? 'var(--color-primary-light)' : 'transparent',
              color: activeCategory === 'all' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            }}
          >
            すべて
          </button>
          {CONTENT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="flex-shrink-0 text-xs font-medium px-3 py-2 rounded-full border transition-colors"
              style={{
                borderColor: activeCategory === cat.id ? cat.color : 'var(--color-border)',
                backgroundColor: activeCategory === cat.id ? `${cat.color}20` : 'transparent',
                color: activeCategory === cat.id ? cat.color : 'var(--color-text-secondary)',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </header>

      <div className="px-4 py-4 space-y-3">
        {filtered.map((content) => (
          <Link
            key={content.id}
            href={`/employee/contents/${content.id}`}
            className="flex gap-4 rounded-xl overflow-hidden border card-hover"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <div className="w-28 h-24 flex-shrink-0 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={content.thumbnailUrl}
                alt={content.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 py-3 pr-4">
              <span
                className="inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-1"
                style={{
                  backgroundColor: `${getCategoryColor(content.category)}18`,
                  color: getCategoryColor(content.category),
                }}
              >
                {CONTENT_CATEGORIES.find((c) => c.id === content.category)?.label}
              </span>
              <h3
                className="text-sm font-semibold leading-snug mb-1 line-clamp-2"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {content.title}
              </h3>
              <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                <Clock className="w-3 h-3" />
                <span>{content.readTime}分</span>
              </div>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16" style={{ color: 'var(--color-text-secondary)' }}>
            <p>このカテゴリのコンテンツはまだありません</p>
          </div>
        )}
      </div>
    </div>
  )
}
