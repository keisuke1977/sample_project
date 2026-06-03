'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, RotateCcw, BookOpen } from 'lucide-react'

/* ──────────────────────────────────────────────
   質問定義
────────────────────────────────────────────── */
type Category = 'sleep' | 'fatigue' | 'mood'

const CATEGORIES: {
  id: Category
  label: string
  emoji: string
  color: string
  gradient: string
  description: string
}[] = [
  {
    id: 'sleep',
    label: '睡眠',
    emoji: '🌙',
    color: '#7B68B5',
    gradient: 'linear-gradient(135deg, #EDE8F5, #F3EFFE)',
    description: '睡眠の質と量を確認します',
  },
  {
    id: 'fatigue',
    label: '疲れ',
    emoji: '⚡',
    color: '#C97A72',
    gradient: 'linear-gradient(135deg, #F2E0DE, #FDEAE8)',
    description: '身体・精神的な疲労度を確認します',
  },
  {
    id: 'mood',
    label: '気分',
    emoji: '💭',
    color: '#4A7C6F',
    gradient: 'linear-gradient(135deg, #DCF0EB, #E8F5F0)',
    description: '心の状態・気分の波を確認します',
  },
]

const QUESTIONS: Record<Category, { id: string; text: string; reverse?: boolean }[]> = {
  sleep: [
    { id: 'sleep_duration',  text: '昨夜は6〜8時間ほど眠れましたか？' },
    { id: 'sleep_onset',     text: '布団に入ってから30分以内に眠れましたか？' },
    { id: 'sleep_wake',      text: '夜中に目が覚めることなく眠れましたか？' },
    { id: 'sleep_refresh',   text: '朝起きたとき、すっきりした感覚がありましたか？' },
  ],
  fatigue: [
    { id: 'fatigue_body',    text: '体が軽く、だるさや重さを感じていませんか？' },
    { id: 'fatigue_focus',   text: '仕事や作業に集中できていますか？' },
    { id: 'fatigue_energy',  text: '動きたい、活動したいという気力がありますか？' },
    { id: 'fatigue_ache',    text: '肩こり・目の疲れ・頭痛を感じていませんか？' },
  ],
  mood: [
    { id: 'mood_calm',       text: '気持ちが穏やかで安定していますか？' },
    { id: 'mood_irritable',  text: 'イライラや怒りを感じにくい状態ですか？' },
    { id: 'mood_enjoy',      text: '日常の小さなことを楽しめていますか？' },
    { id: 'mood_anxiety',    text: '不安や心配が少ない状態ですか？' },
  ],
}

type Answer = 'yes' | 'somewhat' | 'no'

const ANSWER_OPTIONS: { value: Answer; label: string; emoji: string; score: number; color: string }[] = [
  { value: 'yes',      label: 'はい',    emoji: '😄', score: 5, color: '#4A7C6F' },
  { value: 'somewhat', label: 'まあまあ', emoji: '🙂', score: 3, color: '#E8A87C' },
  { value: 'no',       label: 'いいえ',  emoji: '😔', score: 1, color: '#C97A72' },
]

/* スコア → レベル変換 */
function scoreToLevel(score: number): { level: number; label: string; color: string; message: string } {
  if (score >= 17) return { level: 5, label: '良好',     color: '#4A7C6F', message: '非常に良い状態です。この調子を続けましょう。' }
  if (score >= 13) return { level: 4, label: 'やや良好',  color: '#6BAB8F', message: '概ね良い状態です。少し意識するともっと良くなりますよ。' }
  if (score >= 9)  return { level: 3, label: '普通',      color: '#E8A87C', message: '平均的な状態です。ケアを意識してみましょう。' }
  if (score >= 5)  return { level: 2, label: 'やや注意',  color: '#D4956A', message: '少し疲れが出ているかもしれません。休息を大切に。' }
  return                  { level: 1, label: '要ケア',    color: '#C97A72', message: '無理せず休みましょう。専門家への相談も検討を。' }
}

/* コンテンツ推薦リンク */
const RECOMMENDED_LINKS: Record<Category, { label: string; href: string }[]> = {
  sleep:   [{ label: '睡眠の質を上げる方法', href: '/employee/contents/content-001' }, { label: '夜のリラックスルーティン', href: '/employee/contents/content-002' }],
  fatigue: [{ label: '疲れを感じたら試したいこと', href: '/employee/contents/content-003' }, { label: 'ランチタイムの回復術', href: '/employee/contents/content-004' }],
  mood:    [{ label: 'PMSと気分の波を知ろう', href: '/employee/contents/content-005' }, { label: 'ストレス対処法', href: '/employee/contents/content-002' }],
}

/* ────────────────────────────────────────────── */

type Phase = 'menu' | 'checking' | 'result'

export default function ToolsPage() {
  const [phase, setPhase]           = useState<Phase>('menu')
  const [activeCategory, setActive] = useState<Category>('sleep')
  const [qIndex, setQIndex]         = useState(0)
  const [answers, setAnswers]       = useState<Record<string, Answer>>({})
  const [allScores, setAllScores]   = useState<Record<Category, number>>({} as Record<Category, number>)
  const [doneCategories, setDone]   = useState<Category[]>([])

  const questions = QUESTIONS[activeCategory]
  const currentQ  = questions[qIndex]
  const catInfo   = CATEGORIES.find((c) => c.id === activeCategory)!
  const progress  = ((qIndex) / questions.length) * 100

  /* 回答を選択 */
  const handleAnswer = (value: Answer) => {
    const opt   = ANSWER_OPTIONS.find((o) => o.value === value)!
    const key   = currentQ.id
    const newAnswers = { ...answers, [key]: value }
    setAnswers(newAnswers)

    if (qIndex + 1 < questions.length) {
      setQIndex(qIndex + 1)
    } else {
      // スコア計算
      const catQIds = questions.map((q) => q.id)
      const score = catQIds.reduce((sum, qid) => {
        const a = newAnswers[qid]
        const o = ANSWER_OPTIONS.find((x) => x.value === a)
        return sum + (o?.score ?? 3)
      }, 0)
      const newScores = { ...allScores, [activeCategory]: score }
      setAllScores(newScores)
      const newDone = [...doneCategories, activeCategory]
      setDone(newDone)

      if (newDone.length === 3) {
        setPhase('result')
      } else {
        setPhase('menu')
        setQIndex(0)
      }
    }
  }

  /* リセット */
  const handleReset = () => {
    setPhase('menu')
    setQIndex(0)
    setAnswers({})
    setAllScores({} as Record<Category, number>)
    setDone([])
  }

  /* カテゴリ選択して開始 */
  const startCategory = (cat: Category) => {
    setActive(cat)
    setQIndex(0)
    setPhase('checking')
  }

  /* ────────── メニュー画面 ────────── */
  if (phase === 'menu') {
    return (
      <div style={{ maxWidth: 480, margin: '0 auto', backgroundColor: '#FAF8F5', minHeight: '100vh' }}>
        {/* ヘッダー */}
        <div
          style={{
            padding: '20px 16px 0',
            background: 'linear-gradient(160deg, #F5E8F3 0%, #EDE8F5 60%, #E8F2F0 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #9B87B5, #C97A72)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 3px 10px rgba(155,135,181,0.35)',
              }}
            >
              <span style={{ fontSize: 16 }}>🔍</span>
            </div>
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 700, color: '#2D2D2D' }}>セルフチェック</h1>
              <p style={{ fontSize: 11, color: '#6B6B6B' }}>今の自分の状態を把握しよう</p>
            </div>
          </div>

          {/* 説明バナー */}
          <div
            style={{
              margin: '14px 0 0',
              borderRadius: '16px 16px 0 0',
              padding: '16px',
              backgroundColor: 'rgba(255,255,255,0.75)',
            }}
          >
            <p style={{ fontSize: 13, lineHeight: 1.7, color: '#2D2D2D' }}>
              睡眠・疲れ・気分の3カテゴリ、各4問の質問に答えるだけで、あなたの現在の状態がわかります。
              チェックイン時のスコアの目安としても使えます 📊
            </p>
          </div>
        </div>

        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* 各カテゴリカード */}
          {CATEGORIES.map((cat) => {
            const done  = doneCategories.includes(cat.id)
            const score = allScores[cat.id]
            const level = done ? scoreToLevel(score) : null
            return (
              <button
                key={cat.id}
                onClick={() => !done && startCategory(cat.id)}
                disabled={done}
                style={{
                  width: '100%',
                  borderRadius: 20,
                  padding: '18px',
                  background: done ? cat.gradient : 'white',
                  border: done ? `2px solid ${cat.color}40` : '2px solid #EDE9E6',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  cursor: done ? 'default' : 'pointer',
                  boxShadow: done ? `0 4px 16px ${cat.color}20` : '0 3px 12px rgba(0,0,0,0.06)',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                }}
              >
                {/* アイコン */}
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 16,
                    background: cat.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 26,
                    flexShrink: 0,
                    boxShadow: `0 2px 10px ${cat.color}25`,
                    border: done ? `2px solid ${cat.color}40` : 'none',
                  }}
                >
                  {cat.emoji}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#2D2D2D' }}>{cat.label}チェック</span>
                    {done && level && (
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '3px 10px',
                          borderRadius: 9999,
                          backgroundColor: `${level.color}20`,
                          color: level.color,
                        }}
                      >
                        {level.label}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 12, color: '#6B6B6B' }}>
                    {done ? `スコア: ${score}/20点` : `${cat.description} · 4問`}
                  </p>
                </div>

                {done ? (
                  <span style={{ fontSize: 22, flexShrink: 0 }}>✅</span>
                ) : (
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${cat.color}, ${cat.color}BB)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <ArrowRight size={16} color="white" />
                  </div>
                )}
              </button>
            )
          })}

          {/* 全完了前の進捗 */}
          {doneCategories.length > 0 && doneCategories.length < 3 && (
            <div
              style={{
                borderRadius: 16,
                padding: '14px',
                background: 'linear-gradient(135deg, #F5E8F3, #EDE8F5)',
                textAlign: 'center',
              }}
            >
              <p style={{ fontSize: 13, color: '#2D2D2D', fontWeight: 600, marginBottom: 4 }}>
                あと {3 - doneCategories.length} カテゴリで完了です ✨
              </p>
              <p style={{ fontSize: 11, color: '#6B6B6B' }}>残りのカテゴリをチェックしてください</p>
            </div>
          )}

          {/* リセットボタン */}
          {doneCategories.length > 0 && (
            <button
              onClick={handleReset}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 16,
                border: '1.5px solid #EDE9E6',
                backgroundColor: 'white',
                color: '#9B9B9B',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              <RotateCcw size={14} />
              もう一度チェックする
            </button>
          )}
        </div>
      </div>
    )
  }

  /* ────────── 質問画面 ────────── */
  if (phase === 'checking') {
    return (
      <div style={{ maxWidth: 480, margin: '0 auto', backgroundColor: '#FAF8F5', minHeight: '100vh' }}>
        {/* ヘッダー（プログレスバー） */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 40,
            padding: '12px 16px',
            backgroundColor: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderBottom: '1px solid #EDE9E6',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => { setPhase('menu'); setQIndex(0) }}
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                border: 'none',
                backgroundColor: '#F2E0DE',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontSize: 16,
              }}
            >
              ←
            </button>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: catInfo.color }}>
                  {catInfo.emoji} {catInfo.label}チェック
                </span>
                <span style={{ fontSize: 11, color: '#9B9B9B' }}>
                  {qIndex + 1} / {questions.length}
                </span>
              </div>
              <div style={{ height: 6, borderRadius: 3, backgroundColor: '#EDE9E6', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    borderRadius: 3,
                    background: `linear-gradient(90deg, ${catInfo.color}88, ${catInfo.color})`,
                    width: `${((qIndex + 1) / questions.length) * 100}%`,
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: '32px 20px 40px' }}>
          {/* 質問ヘッダー */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: 22,
                background: catInfo.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 30,
                margin: '0 auto 16px',
                boxShadow: `0 4px 16px ${catInfo.color}22`,
              }}
            >
              {catInfo.emoji}
            </div>
            <p style={{ fontSize: 11, fontWeight: 700, color: catInfo.color, letterSpacing: '1px', marginBottom: 14 }}>
              Q{qIndex + 1}
            </p>
            <h2
              style={{
                fontSize: 19,
                fontWeight: 700,
                lineHeight: 1.55,
                color: '#2D2D2D',
                padding: '0 8px',
              }}
            >
              {currentQ.text}
            </h2>
          </div>

          {/* 回答ボタン */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {ANSWER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleAnswer(opt.value)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '18px 20px',
                  borderRadius: 20,
                  border: `2px solid #EDE9E6`,
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  textAlign: 'left',
                  boxShadow: '0 3px 12px rgba(0,0,0,0.06)',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = opt.color
                  ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = `${opt.color}10`
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#EDE9E6'
                  ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = 'white'
                }}
              >
                <span style={{ fontSize: 30, flexShrink: 0 }}>{opt.emoji}</span>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#2D2D2D' }}>{opt.label}</span>
                </div>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: opt.color,
                    flexShrink: 0,
                  }}
                />
              </button>
            ))}
          </div>

          {/* ヒント */}
          <p style={{ textAlign: 'center', fontSize: 11, color: '#ABABAB', marginTop: 20 }}>
            正直に答えるほど、より正確な結果が出ます 💕
          </p>
        </div>
      </div>
    )
  }

  /* ────────── 結果画面 ────────── */
  const resultItems = CATEGORIES.map((cat) => {
    const score = allScores[cat.id] ?? 0
    const level = scoreToLevel(score)
    return { ...cat, score, level }
  })
  const totalScore = resultItems.reduce((s, r) => s + r.score, 0)
  const overallLevel = scoreToLevel(Math.round(totalScore / 3))

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', backgroundColor: '#FAF8F5', minHeight: '100vh' }}>

      {/* 結果ヘッダー */}
      <div
        style={{
          padding: '32px 20px 24px',
          background: 'linear-gradient(160deg, #FDF0EE 0%, #F5E8F3 50%, #E8F2F0 100%)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 52, marginBottom: 12 }} className="animate-float">
          {totalScore >= 45 ? '🌟' : totalScore >= 35 ? '🌸' : totalScore >= 25 ? '🌤' : '🌧'}
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#2D2D2D', marginBottom: 6 }}>
          チェック完了！
        </h2>
        <p style={{ fontSize: 14, color: '#6B6B6B', marginBottom: 16 }}>
          あなたの現在の状態がわかりました
        </p>

        {/* 総合スコア */}
        <div
          style={{
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '16px 32px',
            borderRadius: 20,
            backgroundColor: 'rgba(255,255,255,0.85)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 700, color: '#9B9B9B', letterSpacing: '1px', marginBottom: 4 }}>
            総合スコア
          </span>
          <span style={{ fontSize: 36, fontWeight: 700, color: overallLevel.color }}>{totalScore}</span>
          <span style={{ fontSize: 12, color: '#9B9B9B' }}>/ 60点</span>
          <span
            style={{
              marginTop: 8,
              padding: '5px 14px',
              borderRadius: 9999,
              fontSize: 12,
              fontWeight: 700,
              backgroundColor: `${overallLevel.color}20`,
              color: overallLevel.color,
            }}
          >
            総合：{overallLevel.label}
          </span>
        </div>
      </div>

      <div style={{ padding: '20px 16px 40px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* 各カテゴリ結果 */}
        {resultItems.map((item) => (
          <div
            key={item.id}
            style={{
              borderRadius: 20,
              overflow: 'hidden',
              backgroundColor: 'white',
              boxShadow: '0 3px 16px rgba(0,0,0,0.07)',
            }}
          >
            {/* カードヘッダー */}
            <div
              style={{
                padding: '16px',
                background: item.gradient,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <span style={{ fontSize: 26 }}>{item.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#2D2D2D' }}>{item.label}</span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: 9999,
                      backgroundColor: `${item.level.color}22`,
                      color: item.level.color,
                    }}
                  >
                    {item.level.label}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {/* スコアバー */}
                  <div style={{ flex: 1, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.6)', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        borderRadius: 4,
                        width: `${(item.score / 20) * 100}%`,
                        background: `linear-gradient(90deg, ${item.level.color}80, ${item.level.color})`,
                      }}
                    />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: item.level.color, flexShrink: 0 }}>
                    {item.score}/20
                  </span>
                </div>
              </div>
            </div>

            {/* アドバイス */}
            <div style={{ padding: '14px 16px' }}>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: '#2D2D2D', marginBottom: 12 }}>
                {item.level.message}
              </p>

              {/* 関連コンテンツ */}
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#9B9B9B', marginBottom: 8 }}>
                  <BookOpen size={10} style={{ display: 'inline', marginRight: 4 }} />
                  おすすめコンテンツ
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {RECOMMENDED_LINKS[item.id].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '10px 12px',
                        borderRadius: 12,
                        backgroundColor: `${item.color}10`,
                        textDecoration: 'none',
                      }}
                    >
                      <span style={{ fontSize: 11, color: item.color, flex: 1, fontWeight: 600 }}>
                        {link.label}
                      </span>
                      <ArrowRight size={12} color={item.color} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* チェックインへ誘導 */}
        <div
          style={{
            borderRadius: 20,
            padding: '18px',
            background: 'linear-gradient(135deg, #F2E0DE 0%, #EDE8F5 100%)',
            boxShadow: '0 3px 14px rgba(201,122,114,0.12)',
          }}
        >
          <p style={{ fontSize: 14, fontWeight: 700, color: '#2D2D2D', marginBottom: 6 }}>
            💡 この結果をチェックインに活かそう
          </p>
          <p style={{ fontSize: 12, lineHeight: 1.65, color: '#6B6B6B', marginBottom: 14 }}>
            今日の体調チェックインで、このスコアを参考にスコアを入力してみてください。
            継続することで体調の変化が見えてきます。
          </p>
          <Link
            href="/employee/checkin"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '10px 20px',
              borderRadius: 9999,
              background: 'linear-gradient(135deg, #C97A72, #D4958D)',
              color: 'white',
              fontSize: 13,
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 3px 12px rgba(201,122,114,0.35)',
            }}
          >
            チェックインへ <ArrowRight size={14} />
          </Link>
        </div>

        {/* もう一度ボタン */}
        <button
          onClick={handleReset}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: 18,
            border: '1.5px solid #EDE9E6',
            backgroundColor: 'white',
            color: '#6B6B6B',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <RotateCcw size={16} />
          もう一度チェックする
        </button>

      </div>
    </div>
  )
}
