import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { mockUser, todayCheckin, mockContents, CONTENT_CATEGORIES } from '@/lib/mock-data'
import { getCategoryColor } from '@/lib/utils'

export default function HomePage() {
  const today = new Date()
  const dateStr = today.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })
  const recommended = mockContents.slice(0, 3)

  return (
    <div className="max-w-lg mx-auto">
      {/* ヘッダー */}
      <header
        className="sticky top-0 z-40 px-4 py-3 flex items-center justify-between border-b"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            F
          </div>
          <span className="font-bold text-base" style={{ color: 'var(--color-text-primary)' }}>
            Femcare
          </span>
        </div>
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-white"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          {mockUser.name[0]}
        </div>
      </header>

      <div className="px-4 pt-5 pb-2 space-y-5">
        {/* グリーティング */}
        <div>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            {dateStr}
          </p>
          <p className="text-lg font-semibold mt-1" style={{ color: 'var(--color-text-primary)' }}>
            こんにちは、{mockUser.name}さん ☀️
          </p>
        </div>

        {/* 今日の気づきカード */}
        <div
          className="rounded-2xl p-5"
          style={{
            backgroundColor: 'var(--color-primary-light)',
            borderLeft: '4px solid var(--color-primary)',
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
            <span
              className="text-xs font-semibold tracking-wide"
              style={{ color: 'var(--color-primary)' }}
            >
              今日の気づき
            </span>
          </div>
          <p
            className="text-sm leading-relaxed mb-4"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {todayCheckin.feedbackMessage}
          </p>
          <Link
            href="/employee/contents/content-001"
            className="inline-flex items-center gap-1 text-sm font-medium"
            style={{ color: 'var(--color-primary)' }}
          >
            詳しく読む <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* チェックインCTA */}
        <Link href="/employee/checkin">
          <div
            className="rounded-2xl p-5 flex items-center justify-between cursor-pointer transition-opacity hover:opacity-90 active:scale-95"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <div>
              <p className="text-white font-semibold text-base">今日の体調チェックをしましょう</p>
              <p className="text-white/80 text-sm mt-1">約1分で完了します</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white/90 text-sm font-medium">チェックイン</span>
              <ArrowRight className="w-5 h-5 text-white" />
            </div>
          </div>
        </Link>

        {/* カテゴリクイックアクセス */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              カテゴリ
            </p>
            <Link
              href="/employee/contents"
              className="text-xs font-medium"
              style={{ color: 'var(--color-primary)' }}
            >
              すべて見る
            </Link>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
            {CONTENT_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/employee/contents?category=${cat.id}`}
                className="flex-shrink-0 px-3 py-2 rounded-full text-xs font-medium border transition-colors"
                style={{
                  borderColor: cat.color,
                  color: cat.color,
                  backgroundColor: `${cat.color}15`,
                }}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>

        {/* おすすめコンテンツ */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              おすすめコンテンツ
            </p>
            <Link
              href="/employee/contents"
              className="text-xs font-medium"
              style={{ color: 'var(--color-primary)' }}
            >
              もっと見る
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
            {recommended.map((content) => (
              <Link
                key={content.id}
                href={`/employee/contents/${content.id}`}
                className="flex-shrink-0 w-44 rounded-xl overflow-hidden border card-hover"
                style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
              >
                <div className="w-full h-24 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={content.thumbnailUrl}
                    alt={content.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <span
                    className="inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-2"
                    style={{
                      backgroundColor: `${getCategoryColor(content.category)}20`,
                      color: getCategoryColor(content.category),
                    }}
                  >
                    {CONTENT_CATEGORIES.find((c) => c.id === content.category)?.label}
                  </span>
                  <p
                    className="text-xs font-medium leading-snug line-clamp-2"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {content.title}
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                    {content.readTime}分で読める
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 専門家相談バナー */}
        <Link href="/employee/consultation">
          <div
            className="rounded-xl p-4 flex items-center gap-4 border card-hover"
            style={{ backgroundColor: 'var(--color-medical)', borderColor: '#C8D8E8' }}
          >
            <div className="text-2xl">👩‍⚕️</div>
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                専門家に相談する
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                看護師・助産師・産婦人科医に気軽に相談
              </p>
            </div>
            <ArrowRight className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-text-secondary)' }} />
          </div>
        </Link>
      </div>
    </div>
  )
}
