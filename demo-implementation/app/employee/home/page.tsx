import Link from 'next/link'
import { ArrowRight, Sparkles, Heart, BookOpen, Users, BarChart2, Bell, ChevronRight, MessageCircle } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import { auth, currentUser } from '@clerk/nextjs/server'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { getCategoryColor } from '@/lib/utils'
import { CONTENT_CATEGORIES, mockContents } from '@/lib/mock-data'
import { generateAIAdvice } from '@/lib/ai-advice'

const PHASE_INFO = {
  premenstrual: {
    label: '月経前期', emoji: '🌙', color: '#9B87B5',
    gradient: 'linear-gradient(135deg, #EDE8F5 0%, #F0EBFC 100%)',
    badge: 'PMSに注意',
  },
  menstrual: {
    label: '月経中', emoji: '🌸', color: '#C97A72',
    gradient: 'linear-gradient(135deg, #F2E0DE 0%, #FDEAE8 100%)',
    badge: '無理せず休んで',
  },
  normal: {
    label: '通常期', emoji: '☀️', color: '#4A7C6F',
    gradient: 'linear-gradient(135deg, #DCF0EB 0%, #E8F5F0 100%)',
    badge: '体調安定期',
  },
}

const SCORE_EMOJI = ['', '😫', '😔', '😐', '🙂', '😄']


export default async function HomePage() {
  const { userId } = await auth()
  const clerkUser = await currentUser()

  const supabase = createServiceRoleClient()
  const today = new Date().toISOString().split('T')[0]

  const { data: userProfile } = await supabase
    .from('users').select('id, life_stage')
    .eq('clerk_user_id', userId!).maybeSingle()

  const { data: todayCheckIn } = await supabase
    .from('check_ins')
    .select('sleep_score, fatigue_score, mood_score, menstrual_status, feedback_message')
    .eq('user_id', userProfile?.id ?? '').eq('check_date', today).maybeSingle()

  const { data: contentsFromDB } = await supabase
    .from('contents').select('id, title, category, thumbnail_url, body')
    .eq('is_published', true).order('published_at', { ascending: false }).limit(4)

  const contents = (contentsFromDB && contentsFromDB.length > 0)
    ? contentsFromDB
    : mockContents.slice(0, 4).map((c) => ({
        id: c.id, title: c.title, category: c.category,
        thumbnail_url: c.thumbnailUrl, body: c.body ?? null,
      }))

  const { data: recentCheckIns } = await supabase
    .from('check_ins').select('check_date')
    .eq('user_id', userProfile?.id ?? '')
    .order('check_date', { ascending: false }).limit(30)

  let streak = 0
  if (recentCheckIns && recentCheckIns.length > 0) {
    const dates = recentCheckIns.map((r) => r.check_date)
    const todayDate = new Date(today)
    for (let i = 0; i < 30; i++) {
      const d = new Date(todayDate)
      d.setDate(d.getDate() - i)
      if (dates.includes(d.toISOString().split('T')[0])) streak++
      else break
    }
  }

  const firstName = clerkUser?.firstName ?? clerkUser?.emailAddresses?.[0]?.emailAddress?.split('@')[0] ?? 'ゲスト'
  const phase = PHASE_INFO[(todayCheckIn?.menstrual_status as keyof typeof PHASE_INFO) ?? 'normal']

  const aiAdvice = todayCheckIn ? generateAIAdvice({
    menstrualStatus: (todayCheckIn.menstrual_status as 'menstrual' | 'premenstrual' | 'normal' | null) ?? null,
    symptoms: [],
    sleepScore:   todayCheckIn.sleep_score   ?? 3,
    fatigueScore: todayCheckIn.fatigue_score ?? 3,
    moodScore:    todayCheckIn.mood_score    ?? 3,
  }) : null

  const aiRelatedArticles = aiAdvice ? (() => {
    const result: typeof mockContents = []
    for (const cat of aiAdvice.relatedCategories) {
      const found = mockContents.find((c) => c.category === cat && !result.includes(c))
      if (found) result.push(found)
      if (result.length >= 3) break
    }
    if (result.length < 3) {
      for (const c of mockContents) {
        if (!result.includes(c)) { result.push(c); if (result.length >= 3) break }
      }
    }
    return result.slice(0, 3)
  })() : []

  const today2 = new Date()
  const DOW = ['日', '月', '火', '水', '木', '金', '土'][today2.getDay()]
  const dateStr = `${today2.getMonth() + 1}月${today2.getDate()}日（${DOW}）`
  const hour = today2.getHours()
  const greeting = hour < 11 ? 'おはようございます' : hour < 17 ? 'こんにちは' : 'お疲れ様です'
  const recommended = contents ?? []

  return (
    <>
      {/* ======= PC レイアウト ======= */}
      <div className="home-desktop" style={{ display: 'none' }}>

        {/* PC ページヘッダー */}
        <div style={{
          borderBottom: '1px solid #EDE9E6',
          padding: '20px 32px',
          backgroundColor: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <p style={{ fontSize: 12, color: '#9B9B9B', marginBottom: 2 }}>📅 {dateStr}</p>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1A1A1A', letterSpacing: '-0.4px' }}>
              {greeting}、<span style={{ color: '#C97A72' }}>{firstName}</span>さん ✨
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'rgba(201,122,114,0.10)', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Bell size={16} color="#C97A72" />
            </button>
            <UserButton />
          </div>
        </div>

        {/* PC コンテンツエリア */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 0, minHeight: 'calc(100vh - 73px)' }}>

          {/* 左カラム */}
          <div style={{ padding: '28px 32px', borderRight: '1px solid #EDE9E6', overflowY: 'auto' }}>

            {/* チェックインカード */}
            <div style={{ marginBottom: 28 }}>
              {todayCheckIn ? (
                <div style={{
                  borderRadius: 20, padding: '20px 24px',
                  background: phase.gradient,
                  border: `1.5px solid ${phase.color}22`,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 32 }}>{phase.emoji}</span>
                      <div>
                        <p style={{ fontSize: 11, fontWeight: 700, color: phase.color, marginBottom: 3 }}>本日のフェーズ</p>
                        <p style={{ fontSize: 18, fontWeight: 700, color: '#1A1A1A' }}>{phase.label}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{
                        fontSize: 12, fontWeight: 700, padding: '6px 14px', borderRadius: 9999,
                        backgroundColor: `${phase.color}1A`, color: phase.color,
                      }}>{phase.badge}</span>
                      <Link href="/employee/checkin" style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '8px 16px', borderRadius: 9999, textDecoration: 'none',
                        background: 'linear-gradient(135deg, #C97A72, #D4958D)',
                        color: 'white', fontSize: 12, fontWeight: 700,
                        boxShadow: '0 3px 12px rgba(201,122,114,0.30)',
                      }}>
                        記録を更新 <ChevronRight size={13} />
                      </Link>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    {[
                      { label: '睡眠', score: todayCheckIn.sleep_score, icon: '🌙' },
                      { label: '疲れ', score: todayCheckIn.fatigue_score, icon: '⚡' },
                      { label: '気分', score: todayCheckIn.mood_score, icon: '💭' },
                    ].map(({ label, score, icon }) => (
                      <div key={label} style={{
                        flex: 1, borderRadius: 14, padding: '14px', textAlign: 'center',
                        backgroundColor: 'rgba(255,255,255,0.75)',
                        boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
                      }}>
                        <div style={{ fontSize: 22, marginBottom: 4 }}>{SCORE_EMOJI[score]}</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A' }}>{score}/5</div>
                        <div style={{ fontSize: 11, color: '#7A7A7A', marginTop: 2 }}>{label}</div>
                      </div>
                    ))}
                  </div>
                  {todayCheckIn.feedback_message && (
                    <div style={{
                      marginTop: 14, padding: '14px 16px', borderRadius: 14,
                      backgroundColor: 'rgba(255,255,255,0.7)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
                        <Sparkles size={13} color={phase.color} />
                        <span style={{ fontSize: 11, fontWeight: 700, color: phase.color }}>今日の気づき</span>
                      </div>
                      <p style={{ fontSize: 13, lineHeight: 1.7, color: '#2D2D2D' }}>{todayCheckIn.feedback_message}</p>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/employee/checkin" style={{ textDecoration: 'none', display: 'block' }}>
                  <div style={{
                    borderRadius: 20, padding: '24px 28px',
                    background: 'linear-gradient(135deg, #C97A72 0%, #D4958D 60%, #B8685F 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    boxShadow: '0 8px 32px rgba(201,122,114,0.38)', cursor: 'pointer',
                  }}>
                    <div>
                      <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 11, fontWeight: 700, letterSpacing: '1px', marginBottom: 8 }}>DAILY CHECK-IN</p>
                      <p style={{ color: 'white', fontWeight: 800, fontSize: 18, marginBottom: 6 }}>今日の体調を記録する</p>
                      <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 13 }}>約1分で完了 · 毎日の記録が気づきになります</p>
                    </div>
                    <div style={{
                      width: 56, height: 56, borderRadius: 18,
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <ArrowRight size={28} color="white" />
                    </div>
                  </div>
                </Link>
              )}
            </div>

            {/* ── AIパーソナライズアドバイス（チェックイン済みの場合） ── */}
            {aiAdvice && (
              <div style={{ marginBottom: 28 }}>
                <div
                  style={{
                    borderRadius: 20, padding: '20px 22px',
                    background: aiAdvice.gradient,
                    border: `1px solid ${aiAdvice.color}22`,
                    boxShadow: `0 4px 22px ${aiAdvice.color}18`,
                  }}
                >
                  {/* AIラベル */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.85)', borderRadius: 20, padding: '4px 10px' }}>
                      <Sparkles size={12} color={aiAdvice.color} />
                      <span style={{ fontSize: 10, fontWeight: 800, color: aiAdvice.color, letterSpacing: '0.06em' }}>AI パーソナライズアドバイス</span>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'white', background: aiAdvice.color, borderRadius: 9999, padding: '3px 8px' }}>
                      {aiAdvice.todayKeyword}
                    </span>
                  </div>
                  {/* ヘッドライン */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                    <span style={{ fontSize: 26, lineHeight: 1, flexShrink: 0 }}>{aiAdvice.icon}</span>
                    <h3 style={{ fontSize: 15, fontWeight: 800, color: '#1A1A1A', lineHeight: 1.5 }}>{aiAdvice.headline}</h3>
                  </div>
                  {/* アクション */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {aiAdvice.actions.map((action, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.65)', borderRadius: 10, padding: '8px 12px' }}>
                        <span style={{ fontSize: 16, flexShrink: 0 }}>{action.emoji}</span>
                        <span style={{ fontSize: 12, lineHeight: 1.6, color: '#2D2D2D' }}>{action.text}</span>
                      </div>
                    ))}
                  </div>
                  {/* 関連記事へ */}
                  {aiRelatedArticles.length > 0 && (
                    <div style={{ marginTop: 14 }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: aiAdvice.color, marginBottom: 8 }}>今日のあなたへのおすすめ記事</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                        {aiRelatedArticles.slice(0, 2).map((article) => (
                          <Link key={article.id} href={`/employee/contents/${article.id}`} style={{ textDecoration: 'none' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.7)', borderRadius: 12, padding: '8px 12px', cursor: 'pointer' }}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={article.thumbnailUrl} alt={article.title} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                              <p style={{ fontSize: 12, fontWeight: 600, color: '#1A1A1A', lineHeight: 1.45, flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                {article.title}
                              </p>
                              <ChevronRight size={14} color={aiAdvice.color} style={{ flexShrink: 0 }} />
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* おすすめコンテンツ */}
            {recommended.length > 0 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 800, color: '#1A1A1A' }}>おすすめ記事</h2>
                  <Link href="/employee/contents" style={{ fontSize: 13, fontWeight: 700, color: '#C97A72', textDecoration: 'none' }}>
                    すべて見る →
                  </Link>
                </div>
                {/* カテゴリチップ */}
                <div style={{ display: 'flex', gap: 7, marginBottom: 16, flexWrap: 'wrap' }}>
                  {CONTENT_CATEGORIES.map((cat) => (
                    <Link key={cat.id} href={`/employee/contents?category=${cat.id}`} style={{
                      padding: '5px 14px', borderRadius: 9999, fontSize: 11, fontWeight: 700,
                      backgroundColor: `${cat.color}12`, color: cat.color,
                      border: `1.5px solid ${cat.color}25`, textDecoration: 'none',
                    }}>{cat.label}</Link>
                  ))}
                </div>
                {/* 記事グリッド */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {recommended.map((content, i) => {
                    const catColor = getCategoryColor(content.category)
                    return (
                      <Link key={content.id} href={`/employee/contents/${content.id}`} style={{ textDecoration: 'none' }}>
                        <div style={{
                          borderRadius: 16, overflow: 'hidden', backgroundColor: 'white',
                          boxShadow: '0 3px 18px rgba(0,0,0,0.08)', cursor: 'pointer',
                          border: '1px solid #EDE9E6',
                          transition: 'transform 0.2s, box-shadow 0.2s',
                        }}>
                          <div style={{ height: i === 0 ? 160 : 120, overflow: 'hidden', position: 'relative' }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={content.thumbnail_url ?? 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=500&fit=crop'}
                              alt={content.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            {i === 0 && (
                              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.5) 100%)' }} />
                            )}
                          </div>
                          <div style={{ padding: '12px 14px 14px' }}>
                            <span style={{
                              display: 'inline-block', fontSize: 10, fontWeight: 700,
                              padding: '3px 9px', borderRadius: 9999, marginBottom: 7,
                              backgroundColor: `${catColor}14`, color: catColor,
                            }}>
                              {CONTENT_CATEGORIES.find((c) => c.id === content.category)?.label}
                            </span>
                            <p style={{
                              fontSize: 13, fontWeight: 600, lineHeight: 1.5, color: '#1A1A1A',
                              display: '-webkit-box', WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical', overflow: 'hidden',
                            }}>{content.title}</p>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 右カラム */}
          <div style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 20, backgroundColor: '#FAF8F5' }}>

            {/* クイックアクセス */}
            <div style={{
              backgroundColor: 'white', borderRadius: 18, padding: '18px 18px',
              boxShadow: '0 2px 14px rgba(0,0,0,0.05)', border: '1px solid #EDE9E6',
            }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A', marginBottom: 12 }}>クイックアクセス</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { href: '/employee/checkin', icon: '✏️', label: '体調チェックイン', sub: '毎日の記録', color: '#C97A72' },
                  { href: '/employee/community', icon: '💬', label: 'コミュニティ', sub: 'みんなの声を見る', color: '#9B87B5' },
                  { href: '/employee/consultation', icon: '👩‍⚕️', label: '専門家に相談', sub: '看護師・産婦人科医', color: '#4A7C6F' },
                  { href: '/employee/records', icon: '📊', label: '体調の記録を見る', sub: streak > 0 ? `連続${streak}日` : '履歴を確認', color: '#E8A87C' },
                ].map((item) => (
                  <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                      borderRadius: 12, cursor: 'pointer',
                      backgroundColor: '#F9F7F5',
                      border: '1px solid transparent',
                      transition: 'background-color 0.15s',
                    }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        backgroundColor: `${item.color}14`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 16, flexShrink: 0,
                      }}>{item.icon}</div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>{item.label}</p>
                        <p style={{ fontSize: 11, color: '#9B9B9B' }}>{item.sub}</p>
                      </div>
                      <ChevronRight size={14} color="#C0C0C0" style={{ marginLeft: 'auto', flexShrink: 0 }} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* コミュニティプレビュー */}
            <div style={{
              backgroundColor: 'white', borderRadius: 18, padding: '18px',
              boxShadow: '0 2px 14px rgba(0,0,0,0.05)', border: '1px solid #EDE9E6',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A' }}>コミュニティ</h3>
                <Link href="/employee/community" style={{ fontSize: 11, fontWeight: 700, color: '#C97A72', textDecoration: 'none' }}>
                  すべて見る →
                </Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { category: 'PMS', text: '月経前のイライラ、どうやって乗り越えてますか？', likes: 12 },
                  { category: 'メンタル', text: '仕事と体調管理のバランスについて話したいです', likes: 8 },
                  { category: '更年期', text: '最近ほてりがひどくて…同じ方いますか', likes: 5 },
                ].map((post, i) => (
                  <div key={i} style={{
                    padding: '10px 12px', borderRadius: 12,
                    backgroundColor: '#FAF8F5', border: '1px solid #EDE9E6',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 9999,
                        backgroundColor: 'rgba(201,122,114,0.12)', color: '#C97A72',
                      }}>{post.category}</span>
                      <span style={{ fontSize: 9, color: '#ABABAB' }}>匿名</span>
                    </div>
                    <p style={{
                      fontSize: 12, color: '#2D2D2D', lineHeight: 1.5,
                      display: '-webkit-box', WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>{post.text}</p>
                    <p style={{ fontSize: 10, color: '#ABABAB', marginTop: 4 }}>♡ {post.likes}</p>
                  </div>
                ))}
              </div>
              <Link href="/employee/community/new" style={{ textDecoration: 'none', display: 'block', marginTop: 10 }}>
                <div style={{
                  padding: '10px 14px', borderRadius: 12, textAlign: 'center',
                  background: 'linear-gradient(135deg, #C97A72, #D4958D)',
                  color: 'white', fontSize: 12, fontWeight: 700,
                  boxShadow: '0 3px 12px rgba(201,122,114,0.28)',
                }}>
                  投稿する
                </div>
              </Link>
            </div>

            {/* 専門家相談バナー */}
            <Link href="/employee/consultation" style={{ textDecoration: 'none', display: 'block' }}>
              <div style={{
                borderRadius: 18, padding: '16px 18px',
                background: 'linear-gradient(135deg, #EEF3F7, #E5EEF5)',
                border: '1px solid rgba(74,108,138,0.14)',
                display: 'flex', alignItems: 'center', gap: 12,
                boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
              }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 13, backgroundColor: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                }}>
                  👩‍⚕️
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A', marginBottom: 2 }}>専門家に相談する</p>
                  <p style={{ fontSize: 11, color: '#7A7A7A' }}>看護師・助産師・産婦人科医が対応</p>
                </div>
                <ChevronRight size={15} color="#9CA3AF" />
              </div>
            </Link>

          </div>
        </div>
      </div>

      {/* ======= モバイル レイアウト ======= */}
      <div className="home-mobile" style={{ display: 'block' }}>

        {/* モバイルヘッダー */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 40,
          backgroundColor: 'rgba(250,248,245,0.92)',
          backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
          borderBottom: '1px solid rgba(237,233,230,0.8)',
          padding: '10px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: 'linear-gradient(135deg, #C97A72 0%, #E8A87C 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 3px 12px rgba(201,122,114,0.38)',
            }}>
              <Heart size={15} color="white" fill="white" />
            </div>
            <span style={{ fontWeight: 800, fontSize: 16, color: '#1A1A1A', letterSpacing: '-0.4px' }}>Femcare</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'rgba(201,122,114,0.10)', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Bell size={15} color="#C97A72" />
            </button>
            <UserButton />
          </div>
        </header>

        {/* モバイル ヒーロー */}
        <div style={{
          background: 'linear-gradient(150deg, #FEF0EE 0%, #F7EAFA 45%, #EAF4F0 100%)',
          padding: '24px 20px 20px', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -50, right: -50, width: 180, height: 180, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,122,114,0.18) 0%, transparent 65%)',
            pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: 11, color: '#7A7A7A', marginBottom: 6, fontWeight: 500 }}>📅 {dateStr}</p>
            <h1 style={{ fontSize: 21, fontWeight: 800, lineHeight: 1.42, marginBottom: 18, color: '#1A1A1A' }}>
              {greeting}、<br />
              <span style={{ color: '#C97A72' }}>{firstName}</span>さん ✨
            </h1>

            {todayCheckIn ? (
              <div style={{
                borderRadius: 22, padding: '16px',
                background: phase.gradient,
                border: `1.5px solid ${phase.color}22`,
                boxShadow: '0 6px 24px rgba(0,0,0,0.08)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 28 }}>{phase.emoji}</span>
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 700, color: phase.color, marginBottom: 2 }}>現在のフェーズ</p>
                      <p style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A' }}>{phase.label}</p>
                    </div>
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: '5px 12px', borderRadius: 9999,
                    backgroundColor: `${phase.color}1A`, color: phase.color,
                  }}>{phase.badge}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  {[
                    { label: '睡眠', score: todayCheckIn.sleep_score },
                    { label: '疲れ', score: todayCheckIn.fatigue_score },
                    { label: '気分', score: todayCheckIn.mood_score },
                  ].map(({ label, score }) => (
                    <div key={label} style={{
                      borderRadius: 14, padding: '10px 6px', textAlign: 'center',
                      backgroundColor: 'rgba(255,255,255,0.72)',
                    }}>
                      <div style={{ fontSize: 18, marginBottom: 3 }}>{SCORE_EMOJI[score]}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A' }}>{score}/5</div>
                      <div style={{ fontSize: 10, color: '#7A7A7A', marginTop: 1 }}>{label}</div>
                    </div>
                  ))}
                </div>
                {todayCheckIn.feedback_message && (
                  <div style={{
                    marginTop: 12, padding: '12px 14px', borderRadius: 14,
                    backgroundColor: 'rgba(255,255,255,0.7)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
                      <Sparkles size={12} color={phase.color} />
                      <span style={{ fontSize: 10, fontWeight: 700, color: phase.color }}>今日の気づき</span>
                    </div>
                    <p style={{ fontSize: 12, lineHeight: 1.7, color: '#2D2D2D' }}>{todayCheckIn.feedback_message}</p>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/employee/checkin" style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{
                  borderRadius: 22, padding: '18px 20px',
                  background: 'linear-gradient(135deg, #C97A72 0%, #D4958D 50%, #B8685F 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  boxShadow: '0 8px 28px rgba(201,122,114,0.40)', cursor: 'pointer',
                }}>
                  <div>
                    <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 10, fontWeight: 700, letterSpacing: '1px', marginBottom: 6 }}>DAILY CHECK-IN</p>
                    <p style={{ color: 'white', fontWeight: 800, fontSize: 16, marginBottom: 4 }}>今日の体調を記録する</p>
                    <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 12 }}>約1分で完了</p>
                  </div>
                  <div style={{
                    width: 48, height: 48, borderRadius: 16,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <ArrowRight size={24} color="white" />
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>

        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 28 }}>

          {todayCheckIn && (
            <Link href="/employee/checkin" style={{ textDecoration: 'none' }}>
              <div style={{
                borderRadius: 18, padding: '14px 18px',
                background: 'linear-gradient(135deg, #C97A72 0%, #D4958D 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                boxShadow: '0 4px 18px rgba(201,122,114,0.30)',
              }}>
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: 10, fontWeight: 700, letterSpacing: '0.8px', marginBottom: 3 }}>DAILY CHECK-IN</p>
                  <p style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>
                    今日のチェックイン済み ✓
                    {streak > 0 && <span style={{ marginLeft: 8, fontSize: 12, opacity: 0.85 }}>連続 {streak}日🔥</span>}
                  </p>
                </div>
                <ChevronRight size={18} color="rgba(255,255,255,0.7)" />
              </div>
            </Link>
          )}

          {/* ── モバイル：AIパーソナライズアドバイス ── */}
          {aiAdvice && (
            <section>
              <div style={{
                borderRadius: 20, padding: '18px',
                background: aiAdvice.gradient,
                border: `1px solid ${aiAdvice.color}22`,
                boxShadow: `0 4px 20px ${aiAdvice.color}18`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 11 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.85)', borderRadius: 20, padding: '3px 9px' }}>
                    <Sparkles size={11} color={aiAdvice.color} />
                    <span style={{ fontSize: 9, fontWeight: 800, color: aiAdvice.color, letterSpacing: '0.06em' }}>AI アドバイス</span>
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: 'white', background: aiAdvice.color, borderRadius: 9999, padding: '2px 7px' }}>
                    {aiAdvice.todayKeyword}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>{aiAdvice.icon}</span>
                  <p style={{ fontSize: 13, fontWeight: 800, color: '#1A1A1A', lineHeight: 1.5 }}>{aiAdvice.headline}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {aiAdvice.actions.map((action, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.65)', borderRadius: 10, padding: '7px 10px' }}>
                      <span style={{ fontSize: 15, flexShrink: 0 }}>{action.emoji}</span>
                      <span style={{ fontSize: 11, lineHeight: 1.6, color: '#2D2D2D' }}>{action.text}</span>
                    </div>
                  ))}
                </div>
                {aiRelatedArticles.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: aiAdvice.color, marginBottom: 7 }}>おすすめ記事</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {aiRelatedArticles.slice(0, 2).map((article) => (
                        <Link key={article.id} href={`/employee/contents/${article.id}`} style={{ textDecoration: 'none' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.7)', borderRadius: 10, padding: '7px 10px', cursor: 'pointer' }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={article.thumbnailUrl} alt={article.title} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 7, flexShrink: 0 }} />
                            <p style={{ fontSize: 11, fontWeight: 600, color: '#1A1A1A', lineHeight: 1.45, flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                              {article.title}
                            </p>
                            <ChevronRight size={13} color={aiAdvice.color} style={{ flexShrink: 0 }} />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* クイックアクセス */}
          <section>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: '#1A1A1A', marginBottom: 14 }}>今日できること</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              {[
                { href: '/employee/contents', icon: <BookOpen size={20} color="#9B87B5" />, label: '記事を読む', sub: `${contents.length}本`, gradient: 'linear-gradient(145deg, #EDE8F5, #F3EFFE)', iconBg: 'rgba(155,135,181,0.14)' },
                { href: '/employee/community', icon: <Users size={20} color="#C97A72" />, label: 'コミュニティ', sub: 'みんなと繋がる', gradient: 'linear-gradient(145deg, #FDF0EE, #FDEAE8)', iconBg: 'rgba(201,122,114,0.14)' },
                { href: '/employee/records', icon: <BarChart2 size={20} color="#4A7C6F" />, label: '体調記録', sub: streak > 0 ? `${streak}日連続` : '履歴を見る', gradient: 'linear-gradient(145deg, #DCF0EB, #E8F5F0)', iconBg: 'rgba(74,124,111,0.14)' },
              ].map((item) => (
                <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                  <div style={{
                    borderRadius: 18, padding: '14px 10px', background: item.gradient,
                    textAlign: 'center', boxShadow: '0 2px 14px rgba(0,0,0,0.055)', cursor: 'pointer',
                  }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: 14, backgroundColor: item.iconBg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 9px',
                    }}>{item.icon}</div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#1A1A1A', marginBottom: 2 }}>{item.label}</p>
                    <p style={{ fontSize: 10, fontWeight: 500, color: '#7A7A7A' }}>{item.sub}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* おすすめコンテンツ */}
          {recommended.length > 0 && (
            <section>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <h2 style={{ fontSize: 15, fontWeight: 800, color: '#1A1A1A' }}>おすすめ記事</h2>
                <Link href="/employee/contents" style={{ fontSize: 12, fontWeight: 700, color: '#C97A72', textDecoration: 'none' }}>もっと見る →</Link>
              </div>
              <div style={{ display: 'flex', gap: 7, overflowX: 'auto', margin: '0 -16px', padding: '0 16px 12px', scrollbarWidth: 'none' }}>
                {CONTENT_CATEGORIES.map((cat) => (
                  <Link key={cat.id} href={`/employee/contents?category=${cat.id}`} style={{
                    flexShrink: 0, padding: '6px 14px', borderRadius: 9999, fontSize: 11, fontWeight: 700,
                    backgroundColor: `${cat.color}14`, color: cat.color, border: `1.5px solid ${cat.color}28`, textDecoration: 'none', whiteSpace: 'nowrap',
                  }}>{cat.label}</Link>
                ))}
              </div>
              <Link href={`/employee/contents/${recommended[0].id}`} style={{ textDecoration: 'none', display: 'block', marginBottom: 10 }}>
                <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 6px 24px rgba(0,0,0,0.11)' }}>
                  <div style={{ position: 'relative', height: 190, overflow: 'hidden' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={recommended[0].thumbnail_url ?? 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=500&fit=crop'} alt={recommended[0].title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.62) 100%)' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px' }}>
                      <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 9999, marginBottom: 8, backgroundColor: `${getCategoryColor(recommended[0].category)}DD`, color: 'white' }}>
                        {CONTENT_CATEGORIES.find((c) => c.id === recommended[0].category)?.label}
                      </span>
                      <p style={{ color: 'white', fontWeight: 700, fontSize: 15, lineHeight: 1.42 }}>{recommended[0].title}</p>
                    </div>
                  </div>
                </div>
              </Link>
              {recommended.length > 1 && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {recommended.slice(1, 3).map((content) => {
                    const catColor = getCategoryColor(content.category)
                    return (
                      <Link key={content.id} href={`/employee/contents/${content.id}`} style={{ textDecoration: 'none' }}>
                        <div style={{ borderRadius: 16, overflow: 'hidden', backgroundColor: 'white', boxShadow: '0 3px 16px rgba(0,0,0,0.08)' }}>
                          <div style={{ height: 98, overflow: 'hidden' }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={content.thumbnail_url ?? ''} alt={content.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                          <div style={{ padding: '10px 10px 12px' }}>
                            <span style={{ display: 'inline-block', fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 9999, marginBottom: 5, backgroundColor: `${catColor}14`, color: catColor }}>
                              {CONTENT_CATEGORIES.find((c) => c.id === content.category)?.label}
                            </span>
                            <p style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.45, color: '#1A1A1A', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {content.title}
                            </p>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </section>
          )}

          {/* コミュニティ */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h2 style={{ fontSize: 15, fontWeight: 800, color: '#1A1A1A' }}>コミュニティ</h2>
              <Link href="/employee/community" style={{ fontSize: 12, fontWeight: 700, color: '#C97A72', textDecoration: 'none' }}>すべて見る →</Link>
            </div>
            <Link href="/employee/community" style={{ textDecoration: 'none', display: 'block' }}>
              <div style={{
                borderRadius: 20, background: 'linear-gradient(135deg, #FDF0EE 0%, #F5E8F8 50%, #EAF4F1 100%)',
                border: '1.5px solid rgba(201,122,114,0.14)', boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              }}>
                <div style={{ padding: '18px 18px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 14,
                      background: 'linear-gradient(135deg, #C97A72, #E8A87C)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 4px 14px rgba(201,122,114,0.30)', flexShrink: 0,
                    }}>
                      <Users size={20} color="white" />
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A', marginBottom: 2 }}>みんなの声を見てみる</p>
                      <p style={{ fontSize: 12, color: '#7A7A7A' }}>同じ悩みをもつ仲間と繋がれます</p>
                    </div>
                  </div>
                  {[
                    { category: 'PMS', text: '月経前のイライラ、どうやって乗り越えてますか？', likes: 12 },
                    { category: 'メンタル', text: '仕事と体調管理のバランスについて話したいです', likes: 8 },
                  ].map((post, i) => (
                    <div key={i} style={{
                      padding: '10px 12px', borderRadius: 12, marginBottom: 8,
                      backgroundColor: 'rgba(255,255,255,0.75)',
                      boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 9999, backgroundColor: 'rgba(201,122,114,0.14)', color: '#C97A72' }}>{post.category}</span>
                        <span style={{ fontSize: 9, color: '#ABABAB' }}>匿名</span>
                      </div>
                      <p style={{ fontSize: 12, color: '#2D2D2D', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.text}</p>
                      <p style={{ fontSize: 10, color: '#ABABAB', marginTop: 4 }}>♡ {post.likes}</p>
                    </div>
                  ))}
                  <div style={{
                    padding: '10px 14px', borderRadius: 12, textAlign: 'center',
                    background: 'linear-gradient(135deg, #C97A72, #D4958D)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'white' }}>投稿を見る・参加する</span>
                    <ArrowRight size={13} color="white" />
                  </div>
                </div>
              </div>
            </Link>
          </section>

          <div style={{ textAlign: 'center', paddingBottom: 8 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              fontSize: 11, fontWeight: 600, color: '#9B9B9B',
              padding: '7px 14px', borderRadius: 9999,
              backgroundColor: 'rgba(155,155,155,0.08)',
              border: '1px solid rgba(155,155,155,0.15)',
            }}>
              🔒 あなたの情報は会社に特定されません
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .home-desktop { display: block !important; }
          .home-mobile  { display: none  !important; }
        }
      `}</style>
    </>
  )
}
