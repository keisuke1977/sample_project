import Link from 'next/link'
import { ArrowRight, Sparkles, Heart, BookOpen, MessageCircle, Bell } from 'lucide-react'
import { mockUser, todayCheckin, mockContents, CONTENT_CATEGORIES } from '@/lib/mock-data'
import { getCategoryColor } from '@/lib/utils'

const PHASE_INFO = {
  premenstrual: {
    label: '月経前期',
    emoji: '🌙',
    color: '#9B87B5',
    gradient: 'linear-gradient(135deg, #EDE8F5 0%, #F3EFFE 100%)',
    badge: 'PMSに注意',
  },
  menstrual: {
    label: '月経中',
    emoji: '🌸',
    color: '#C97A72',
    gradient: 'linear-gradient(135deg, #F2E0DE 0%, #FDEAE8 100%)',
    badge: '無理せず休んで',
  },
  normal: {
    label: '通常期',
    emoji: '☀️',
    color: '#4A7C6F',
    gradient: 'linear-gradient(135deg, #DCF0EB 0%, #E8F5F0 100%)',
    badge: '体調安定期',
  },
}

const SCORE_EMOJI = ['', '😫', '😔', '😐', '🙂', '😄']

export default function HomePage() {
  const today    = new Date()
  const DOW      = ['日', '月', '火', '水', '木', '金', '土'][today.getDay()]
  const dateStr  = `${today.getMonth() + 1}月${today.getDate()}日（${DOW}）`
  const hour     = today.getHours()
  const greeting = hour < 11 ? 'おはようございます' : hour < 17 ? 'こんにちは' : 'お疲れ様です'
  const phase    = PHASE_INFO[todayCheckin.menstrualStatus]
  const recommended = mockContents.slice(0, 3)

  return (
    <div className="max-w-lg mx-auto" style={{ backgroundColor: 'var(--color-background)' }}>

      {/* ══════════════════════════════
          ヘッダー
      ══════════════════════════════ */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          backgroundColor: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderBottom: '1px solid #EDE9E6',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* ロゴ */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #C97A72, #D4958D)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 3px 10px rgba(201,122,114,0.35)',
            }}
          >
            <Heart size={16} color="white" fill="white" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 17, color: '#2D2D2D', letterSpacing: '-0.3px' }}>
            Femcare
          </span>
        </div>

        {/* 右：通知＋アバター */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            aria-label="通知"
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: '#F2E0DE',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <Bell size={16} color="#C97A72" />
            <span
              style={{
                position: 'absolute',
                top: 6,
                right: 6,
                width: 7,
                height: 7,
                borderRadius: '50%',
                backgroundColor: '#E8A87C',
                border: '1.5px solid white',
              }}
            />
          </button>
          <Link href="/employee/settings" style={{ textDecoration: 'none' }} aria-label="設定">
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #C97A72, #B8685F)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 700,
                fontSize: 14,
                boxShadow: '0 3px 10px rgba(201,122,114,0.30)',
              }}
            >
              {mockUser.name[0]}
            </div>
          </Link>
        </div>
      </header>

      {/* ══════════════════════════════
          ヒーローセクション
      ══════════════════════════════ */}
      <div
        style={{
          background: 'linear-gradient(160deg, #FDF0EE 0%, #F5E8F3 55%, #E8F2F0 100%)',
          padding: '28px 16px 24px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 背景装飾（絶対配置の装飾円） */}
        <div
          style={{
            position: 'absolute',
            top: -60,
            right: -60,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,122,114,0.22) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -40,
            left: -40,
            width: 160,
            height: 160,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(74,124,111,0.18) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* 日付 */}
          <p style={{ fontSize: 12, color: '#6B6B6B', marginBottom: 8 }}>📅 {dateStr}</p>

          {/* グリーティング */}
          <h1 style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.4, marginBottom: 20, color: '#2D2D2D' }}>
            {greeting}、<br />
            <span style={{ color: '#C97A72' }}>{mockUser.name}</span>さん ✨
          </h1>

          {/* フェーズカード */}
          <div
            style={{
              borderRadius: 20,
              padding: '16px',
              background: phase.gradient,
              border: `1.5px solid ${phase.color}28`,
              boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
              marginBottom: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 26 }} className="animate-float">{phase.emoji}</span>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: phase.color, marginBottom: 2 }}>現在のフェーズ</p>
                  <p style={{ fontSize: 16, fontWeight: 700, color: '#2D2D2D' }}>{phase.label}</p>
                </div>
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '6px 12px',
                  borderRadius: 9999,
                  backgroundColor: `${phase.color}20`,
                  color: phase.color,
                }}
              >
                {phase.badge}
              </span>
            </div>

            {/* スコア 3列 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {[
                { label: '睡眠', score: todayCheckin.sleepScore,   icon: '🌙' },
                { label: '疲れ', score: todayCheckin.fatigueScore, icon: '⚡' },
                { label: '気分', score: todayCheckin.moodScore,    icon: '💭' },
              ].map(({ label, score, icon }) => (
                <div
                  key={label}
                  style={{
                    borderRadius: 14,
                    padding: '10px 6px',
                    textAlign: 'center',
                    backgroundColor: 'rgba(255,255,255,0.7)',
                  }}
                >
                  <div style={{ fontSize: 20, marginBottom: 2 }}>{SCORE_EMOJI[score]}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#2D2D2D' }}>{score}/5</div>
                  <div style={{ fontSize: 10, color: '#6B6B6B' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 今日の気づき */}
          <div
            style={{
              borderRadius: 18,
              padding: '14px 16px',
              backgroundColor: 'rgba(255,255,255,0.85)',
              boxShadow: '0 2px 12px rgba(201,122,114,0.10)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <Sparkles size={14} color="#C97A72" />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#C97A72', letterSpacing: '0.5px' }}>
                今日の気づき
              </span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: '#2D2D2D', marginBottom: 10 }}>
              {todayCheckin.feedbackMessage}
            </p>
            <Link
              href="/employee/contents/content-001"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 12,
                fontWeight: 700,
                padding: '6px 12px',
                borderRadius: 9999,
                backgroundColor: `${phase.color}18`,
                color: phase.color,
                textDecoration: 'none',
              }}
            >
              詳しく読む <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* ══════════════════════════════
            チェックインCTA
        ══════════════════════════════ */}
        <Link href="/employee/checkin" style={{ textDecoration: 'none' }}>
          <div
            className="card-hover"
            style={{
              borderRadius: 22,
              padding: '20px',
              background: 'linear-gradient(135deg, #C97A72 0%, #D4958D 50%, #B8685F 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 6px 24px rgba(201,122,114,0.38)',
              cursor: 'pointer',
            }}
          >
            <div>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: 700, letterSpacing: '0.8px', marginBottom: 4 }}>
                DAILY CHECK-IN
              </p>
              <p style={{ color: 'white', fontWeight: 700, fontSize: 17, marginBottom: 4 }}>
                今日の体調を記録する
              </p>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>
                約1分で完了 · 連続 <strong style={{ color: 'white' }}>7日目</strong> 🔥
              </p>
            </div>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                backgroundColor: 'rgba(255,255,255,0.22)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <ArrowRight size={28} color="white" />
            </div>
          </div>
        </Link>

        {/* ══════════════════════════════
            クイックアクセス 3列グリッド
        ══════════════════════════════ */}
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#2D2D2D', marginBottom: 12 }}>今日のケア</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {[
              {
                href: '/employee/contents',
                icon: <BookOpen size={22} color="#9B87B5" />,
                label: 'コンテンツ',
                sub: '6記事',
                gradient: 'linear-gradient(135deg, #EDE8F5, #F3EFFE)',
                iconBg: 'rgba(255,255,255,0.75)',
              },
              {
                href: '/employee/consultation',
                icon: <MessageCircle size={22} color="#4A7C6F" />,
                label: '専門家相談',
                sub: '返信あり',
                gradient: 'linear-gradient(135deg, #DCF0EB, #E8F5F0)',
                iconBg: 'rgba(255,255,255,0.75)',
              },
              {
                href: '/employee/records',
                icon: <Heart size={22} color="#C97A72" fill="#C97A72" />,
                label: '体調記録',
                sub: '7日間',
                gradient: 'linear-gradient(135deg, #F2E0DE, #FDEAE8)',
                iconBg: 'rgba(255,255,255,0.75)',
              },
            ].map((item) => (
              <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                <div
                  className="card-hover"
                  style={{
                    borderRadius: 18,
                    padding: '14px 10px',
                    background: item.gradient,
                    textAlign: 'center',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      backgroundColor: item.iconBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 8px',
                    }}
                  >
                    {item.icon}
                  </div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#2D2D2D', marginBottom: 2 }}>
                    {item.label}
                  </p>
                  <p style={{ fontSize: 10, fontWeight: 600, color: '#6B6B6B' }}>{item.sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════
            カテゴリバッジ
        ══════════════════════════════ */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#2D2D2D' }}>カテゴリ</h2>
            <Link href="/employee/contents" style={{ fontSize: 12, fontWeight: 700, color: '#C97A72', textDecoration: 'none' }}>
              すべて →
            </Link>
          </div>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, margin: '0 -16px', padding: '0 16px 4px' }}>
            {CONTENT_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/employee/contents?category=${cat.id}`}
                style={{
                  flexShrink: 0,
                  padding: '8px 16px',
                  borderRadius: 9999,
                  fontSize: 12,
                  fontWeight: 700,
                  background: `linear-gradient(135deg, ${cat.color}22, ${cat.color}12)`,
                  color: cat.color,
                  border: `1.5px solid ${cat.color}30`,
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════
            おすすめコンテンツ
        ══════════════════════════════ */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#2D2D2D' }}>あなたへのおすすめ</h2>
            <Link href="/employee/contents" style={{ fontSize: 12, fontWeight: 700, color: '#C97A72', textDecoration: 'none' }}>
              もっと見る →
            </Link>
          </div>

          {/* フィーチャーカード（大） */}
          <Link href={`/employee/contents/${recommended[0].id}`} style={{ textDecoration: 'none', display: 'block', marginBottom: 12 }}>
            <div
              className="card-hover"
              style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.10)', cursor: 'pointer' }}
            >
              <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={recommended[0].thumbnailUrl}
                  alt={recommended[0].title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.58) 100%)',
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
                      backgroundColor: `${getCategoryColor(recommended[0].category)}DD`,
                      color: 'white',
                    }}
                  >
                    {CONTENT_CATEGORIES.find((c) => c.id === recommended[0].category)?.label}
                  </span>
                  <p style={{ color: 'white', fontWeight: 700, fontSize: 15, lineHeight: 1.4, marginBottom: 4 }}>
                    {recommended[0].title}
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 11 }}>
                    ⏱ {recommended[0].readTime}分
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {/* 小カード 2列 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {recommended.slice(1).map((content) => (
              <Link
                key={content.id}
                href={`/employee/contents/${content.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  className="card-hover"
                  style={{
                    borderRadius: 16,
                    overflow: 'hidden',
                    backgroundColor: 'white',
                    boxShadow: '0 3px 16px rgba(0,0,0,0.08)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ height: 100, overflow: 'hidden' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={content.thumbnailUrl}
                      alt={content.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ padding: '10px 10px 12px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: 9999,
                        marginBottom: 6,
                        backgroundColor: `${getCategoryColor(content.category)}18`,
                        color: getCategoryColor(content.category),
                      }}
                    >
                      {CONTENT_CATEGORIES.find((c) => c.id === content.category)?.label}
                    </span>
                    <p
                      style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.45, color: '#2D2D2D' }}
                      className="line-clamp-2"
                    >
                      {content.title}
                    </p>
                    <p style={{ fontSize: 10, color: '#6B6B6B', marginTop: 4 }}>{content.readTime}分</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════
            専門家相談バナー
        ══════════════════════════════ */}
        <Link href="/employee/consultation" style={{ textDecoration: 'none' }}>
          <div
            className="card-hover"
            style={{
              borderRadius: 20,
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              background: 'linear-gradient(135deg, #EEF3F7 0%, #E8EFF5 100%)',
              border: '1.5px solid rgba(74,108,138,0.15)',
              boxShadow: '0 3px 16px rgba(0,0,0,0.06)',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
              }}
            >
              👩‍⚕️
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#2D2D2D', marginBottom: 3 }}>
                専門家に相談する
              </p>
              <p style={{ fontSize: 12, color: '#6B6B6B' }}>看護師・助産師・産婦人科医が対応</p>
            </div>
            <ArrowRight size={18} color="#9CA3AF" style={{ flexShrink: 0 }} />
          </div>
        </Link>

        {/* プライバシーバッジ */}
        <div style={{ textAlign: 'center', paddingBottom: 8 }}>
          <div className="badge-privacy" style={{ display: 'inline-flex' }}>
            🔒 あなたの情報は会社に特定されません
          </div>
        </div>

      </div>
    </div>
  )
}
