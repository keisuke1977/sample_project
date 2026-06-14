'use client'

import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useState } from 'react'

const SLIDES = [
  {
    src: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=1600&h=720&fit=crop&q=85',
    alt: '女性のウェルネス',
    catch: '毎日1分の体調チェックで、',
    catchLine2: '女性従業員の健康を支える',
    sub: 'ブラウザから利用する法人向け女性健康管理 Web サービス',
  },
  {
    src: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1600&h=720&fit=crop&q=85',
    alt: '心身のケア',
    catch: '「気づき → 学び → 相談」で、',
    catchLine2: '働きやすい職場環境をつくる',
    sub: '専門家監修コンテンツと匿名集計ダッシュボード',
  },
  {
    src: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1600&h=720&fit=crop&q=85',
    alt: '健康的なライフスタイル',
    catch: '言いづらい健康の悩みを、',
    catchLine2: 'ひとりで抱え込まない社会へ',
    sub: '健康経営と女性活躍推進を支援します',
  },
] as const

export function LandingHero() {
  const [index, setIndex] = useState(0)
  const slide = SLIDES[index]

  const prev = useCallback(() => {
    setIndex((i) => (i === 0 ? SLIDES.length - 1 : i - 1))
  }, [])

  const next = useCallback(() => {
    setIndex((i) => (i === SLIDES.length - 1 ? 0 : i + 1))
  }, [])

  return (
    <section className="relative bg-white">
      <div className="relative w-full aspect-[21/9] min-h-[280px] max-h-[520px] overflow-hidden">
        {SLIDES.map((s, i) => (
          <div
            key={s.src}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{ opacity: i === index ? 1 : 0 }}
            aria-hidden={i !== index}
          >
            <Image
              src={s.src}
              alt={s.alt}
              fill
              className="object-cover"
              priority={i === 0}
              sizes="100vw"
            />
          </div>
        ))}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, rgba(45,45,45,0.55) 0%, rgba(45,45,45,0.15) 45%, transparent 100%)',
          }}
        />
        <div className="absolute inset-x-0 bottom-0 max-w-6xl mx-auto px-6 pb-10 md:pb-14">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-white/80 mb-3">
            企業向け女性健康管理 Web サービス
          </p>
          <h1 className="font-display text-[26px] md:text-[38px] lg:text-[42px] font-semibold leading-[1.35] text-white mb-3">
            {slide.catch}
            <br />
            {slide.catchLine2}
          </h1>
          <p className="text-[13px] md:text-[15px] text-white/85 max-w-xl leading-relaxed">
            {slide.sub}
          </p>
          <a
            href="#for-business"
            className="inline-flex mt-6 text-[13px] font-medium text-white border border-white/50 rounded-full px-6 py-2.5 hover:bg-white/15 transition-colors"
          >
            企業・団体等の皆さまへ
          </a>
        </div>

        <button
          type="button"
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-[#6B6B6B] hover:bg-white shadow-sm transition-colors"
          aria-label="前のスライド"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-[#6B6B6B] hover:bg-white shadow-sm transition-colors"
          aria-label="次のスライド"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className="w-2 h-2 rounded-full transition-colors"
              style={{ backgroundColor: i === index ? 'white' : 'rgba(255,255,255,0.45)' }}
              aria-label={`スライド ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
