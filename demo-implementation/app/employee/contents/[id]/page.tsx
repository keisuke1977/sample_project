import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, Calendar } from 'lucide-react'
import { mockContents, CONTENT_CATEGORIES } from '@/lib/mock-data'
import { getCategoryColor, formatDate } from '@/lib/utils'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ContentDetailPage({ params }: Props) {
  const { id } = await params
  const content = mockContents.find((c) => c.id === id)
  if (!content) notFound()

  const categoryName = CONTENT_CATEGORIES.find((c) => c.id === content.category)?.label ?? content.category
  const bodyParagraphs = content.body?.split('\n') ?? []

  return (
    <div className="max-w-lg mx-auto">
      <header
        className="sticky top-0 z-40 px-4 py-3 flex items-center gap-3 border-b"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <Link
          href="/employee/contents"
          className="tap-target rounded-full"
          style={{ color: 'var(--color-text-secondary)' }}
          aria-label="戻る"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
          コンテンツ
        </span>
      </header>

      <div className="w-full h-52 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={content.thumbnailUrl}
          alt={content.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="px-4 py-5">
        <div className="flex items-center gap-3 mb-3">
          <span
            className="text-xs font-semibold px-3 py-1 rounded-full"
            style={{
              backgroundColor: `${getCategoryColor(content.category)}20`,
              color: getCategoryColor(content.category),
            }}
          >
            {categoryName}
          </span>
          <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            <Clock className="w-3 h-3" />
            <span>{content.readTime}分</span>
          </div>
          <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            <Calendar className="w-3 h-3" />
            <span>{formatDate(content.publishedAt)}</span>
          </div>
        </div>

        <h1 className="text-xl font-bold mb-3 leading-snug" style={{ color: 'var(--color-text-primary)' }}>
          {content.title}
        </h1>

        <div className="badge-medical mb-5">
          🏥 このコンテンツは医療行為ではありません。診断・処方は行いません。
        </div>

        <div className="space-y-4">
          {bodyParagraphs.map((line, i) => {
            if (line.startsWith('## ')) {
              return (
                <h2 key={i} className="text-base font-bold mt-6" style={{ color: 'var(--color-text-primary)' }}>
                  {line.replace('## ', '')}
                </h2>
              )
            }
            if (line.startsWith('### ')) {
              return (
                <h3 key={i} className="text-sm font-semibold mt-4" style={{ color: 'var(--color-text-primary)' }}>
                  {line.replace('### ', '')}
                </h3>
              )
            }
            if (line.startsWith('- ') || line.startsWith('- [ ] ')) {
              return (
                <p key={i} className="text-sm pl-4 leading-relaxed" style={{ color: 'var(--color-text-primary)' }}>
                  {'• ' + line.replace(/^-\s(\[.\]\s)?/, '')}
                </p>
              )
            }
            if (line.match(/^\d+\./)) {
              return (
                <p key={i} className="text-sm pl-4 leading-relaxed" style={{ color: 'var(--color-text-primary)' }}>
                  {line}
                </p>
              )
            }
            if (line.trim() === '') return <div key={i} className="h-2" />
            return (
              <p key={i} className="text-sm leading-relaxed" style={{ color: 'var(--color-text-primary)' }}>
                {line.replace(/\*\*(.*?)\*\*/g, '$1')}
              </p>
            )
          })}
        </div>

        <Link
          href="/employee/consultation"
          className="mt-8 flex items-center gap-4 rounded-xl p-4 border"
          style={{ backgroundColor: 'var(--color-medical)', borderColor: '#C8D8E8' }}
        >
          <span className="text-2xl">👩‍⚕️</span>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              もっと詳しく知りたいですか？
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
              専門家に直接相談できます
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}
