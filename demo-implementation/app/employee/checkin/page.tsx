'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check, Heart, Sparkles, BookOpen, Users, ChevronRight } from 'lucide-react'
import { SYMPTOMS, mockContents, type MenstrualStatus, type Content } from '@/lib/mock-data'
import { generateAIAdvice } from '@/lib/ai-advice'
import { submitCheckIn } from '@/app/actions/checkin'

type Step = 'sleep' | 'fatigue' | 'mood' | 'menstrual' | 'symptoms' | 'done'
const STEPS: Step[] = ['sleep', 'fatigue', 'mood', 'menstrual', 'symptoms', 'done']

interface FormState {
  sleepScore:      number | null
  fatigueScore:    number | null
  moodScore:       number | null
  menstrualStatus: MenstrualStatus | null
  symptoms:        string[]
}

const SCORE_OPTIONS = [
  { value: 1, emoji: '😫', label: '最悪',   color: '#D95B4A', bg: '#FFF0EF' },
  { value: 2, emoji: '😔', label: 'つらい', color: '#E8A87C', bg: '#FFF6F0' },
  { value: 3, emoji: '😐', label: '普通',   color: '#9B9B9B', bg: '#F5F5F5' },
  { value: 4, emoji: '🙂', label: '良い',   color: '#6BAB8F', bg: '#F0F8F4' },
  { value: 5, emoji: '😄', label: '最高',   color: '#4A7C6F', bg: '#E8F5F0' },
]

const MENSTRUAL_OPTIONS = [
  { value: 'menstrual'    as MenstrualStatus, emoji: '🌸', label: '月経中',  sub: '月経が来ています',    color: '#C97A72', gradient: 'linear-gradient(135deg,#F2E0DE,#FDEAE8)' },
  { value: 'premenstrual' as MenstrualStatus, emoji: '🌙', label: '月経前',  sub: '月経の前の時期です',  color: '#9B87B5', gradient: 'linear-gradient(135deg,#EDE8F5,#F3EFFE)' },
  { value: 'normal'       as MenstrualStatus, emoji: '☀️', label: '通常期',  sub: '月経以外の時期です',  color: '#4A7C6F', gradient: 'linear-gradient(135deg,#DCF0EB,#E8F5F0)' },
]

const FEEDBACK: Record<MenstrualStatus, string> = {
  menstrual:    '月経中です。無理せず温かくして過ごしましょう。鎮痛剤の使用も適切な対処の一つです。',
  premenstrual: '月経前の時期です。イライラや集中力の低下はPMSのサインかもしれません。無理せず休息を取りましょう。',
  normal:       '体調が安定している時期です。栄養と睡眠を意識して過ごしましょう。',
}

const STEP_META: Record<Exclude<Step, 'done'>, { title: string; sub: string; emoji: string }> = {
  sleep:     { title: '睡眠の質',    sub: '昨夜の眠りはいかがでしたか？',          emoji: '🌙' },
  fatigue:   { title: '体の疲れ',    sub: '今の身体の疲れ具合はどのくらい？',      emoji: '⚡' },
  mood:      { title: '気分・心',    sub: '今の気分はいかがですか？',              emoji: '💭' },
  menstrual: { title: '月経の状態',  sub: '現在の月経の状況を教えてください。',    emoji: '🌸' },
  symptoms:  { title: '気になる症状', sub: '当てはまるものを選んでください（複数可）', emoji: '💊' },
}

export default function CheckInPage() {
  const router  = useRouter()
  const [step, setStep]  = useState<Step>('sleep')
  const [form, setForm]  = useState<FormState>({
    sleepScore: null, fatigueScore: null, moodScore: null,
    menstrualStatus: null, symptoms: [],
  })
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const idx      = STEPS.indexOf(step)
  const total    = STEPS.length - 1
  const progress = (idx / total) * 100

  const canNext = () => {
    if (step === 'sleep')     return form.sleepScore    !== null
    if (step === 'fatigue')   return form.fatigueScore  !== null
    if (step === 'mood')      return form.moodScore     !== null
    if (step === 'menstrual') return form.menstrualStatus !== null
    return true
  }

  const goNext = () => { if (idx + 1 < STEPS.length) setStep(STEPS[idx + 1]) }
  const goBack = () => { idx > 0 ? setStep(STEPS[idx - 1]) : router.push('/employee/home') }
  const toggleSymptom = (id: string) =>
    setForm((p) => ({
      ...p,
      symptoms: p.symptoms.includes(id) ? p.symptoms.filter((s) => s !== id) : [...p.symptoms, id],
    }))

  const handleRecord = () => {
    setSubmitError(null)
    const formData = new FormData()
    formData.append('sleep_score',      String(form.sleepScore    ?? 3))
    formData.append('fatigue_score',    String(form.fatigueScore  ?? 3))
    formData.append('mood_score',       String(form.moodScore     ?? 3))
    formData.append('menstrual_status', form.menstrualStatus ?? 'normal')
    form.symptoms.forEach((s) => formData.append('symptoms', s))
    formData.append('check_date', new Date().toISOString().split('T')[0])

    startTransition(async () => {
      const result = await submitCheckIn(formData)
      // success: true はDB保存成功・デモモード両方で返る
      if (result.success) {
        setStep('done')
      } else if ('error' in result) {
        setSubmitError((result as { error?: string }).error ?? '保存に失敗しました')
      }
    })
  }

  /* ── 完了画面（AIアドバイス＋関連記事） ── */
  if (step === 'done') {
    const advice = generateAIAdvice({
      menstrualStatus: form.menstrualStatus,
      symptoms: form.symptoms,
      sleepScore:   form.sleepScore   ?? 3,
      fatigueScore: form.fatigueScore ?? 3,
      moodScore:    form.moodScore    ?? 3,
    })

    const relatedArticles = (() => {
      const result: Content[] = []
      for (const cat of advice.relatedCategories) {
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
    })()

    const scores = [
      { label: '睡眠', score: form.sleepScore ?? 3,   icon: '🌙' },
      { label: '疲れ', score: form.fatigueScore ?? 3, icon: '⚡' },
      { label: '気分', score: form.moodScore ?? 3,    icon: '💭' },
    ]

    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #FDF0EE 0%, #F5E8F3 50%, #E8F2F0 100%)' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 16px 80px' }}>

          {/* ── 完了バッジ ── */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div
              style={{
                width: 80, height: 80, borderRadius: '50%',
                background: 'linear-gradient(135deg, #C97A72, #D4958D)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(201,122,114,0.42)',
                marginBottom: 14,
              }}
            >
              <Check size={40} color="white" strokeWidth={3} />
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#2D2D2D', marginBottom: 6 }}>記録完了！🎉</h2>
            <p style={{ fontSize: 13, color: '#6B6B6B' }}>体調を記録する習慣が、あなたの健康を守ります ✨</p>
          </div>

          {/* ── 今日のスコア ── */}
          <div
            style={{
              borderRadius: 20, padding: '18px 20px', backgroundColor: 'white',
              boxShadow: '0 4px 20px rgba(0,0,0,0.07)', marginBottom: 16,
            }}
          >
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9B9B9B', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>今日のスコア</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              {scores.map(({ label, score, icon }) => {
                const opt = SCORE_OPTIONS.find((o) => o.value === score) ?? SCORE_OPTIONS[2]
                return (
                  <div key={label} style={{ borderRadius: 14, padding: '12px 8px', textAlign: 'center', background: opt.bg }}>
                    <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: opt.color }}>{score}<span style={{ fontSize: 11, fontWeight: 400, color: '#9B9B9B' }}>/5</span></div>
                    <div style={{ fontSize: 11, color: '#6B6B6B', marginTop: 2 }}>{label}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── AIパーソナライズアドバイス ── */}
          <div
            style={{
              borderRadius: 20, padding: '20px',
              background: advice.gradient,
              boxShadow: `0 6px 28px ${advice.color}28`,
              marginBottom: 16,
              border: `1px solid ${advice.color}20`,
            }}
          >
            {/* AIラベル */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
              <div
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  background: 'rgba(255,255,255,0.85)', borderRadius: 20,
                  padding: '4px 10px', backdropFilter: 'blur(4px)',
                }}
              >
                <Sparkles size={12} color={advice.color} />
                <span style={{ fontSize: 10, fontWeight: 800, color: advice.color, letterSpacing: '0.06em' }}>AI パーソナライズアドバイス</span>
              </div>
              <span
                style={{
                  fontSize: 10, fontWeight: 700, color: 'white',
                  background: advice.color, borderRadius: 9999, padding: '3px 8px',
                }}
              >
                {advice.todayKeyword}
              </span>
            </div>

            {/* 見出し */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 28, lineHeight: 1, flexShrink: 0 }}>{advice.icon}</span>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1A1A1A', lineHeight: 1.45 }}>{advice.headline}</h3>
            </div>

            {/* インサイト */}
            <p style={{ fontSize: 13, lineHeight: 1.75, color: '#333', marginBottom: 14, paddingLeft: 4 }}>
              {advice.insight}
            </p>

            {/* アクションリスト */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {advice.actions.map((action, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    background: 'rgba(255,255,255,0.7)', borderRadius: 12, padding: '10px 12px',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0, marginTop: 1 }}>{action.emoji}</span>
                  <span style={{ fontSize: 12, lineHeight: 1.65, color: '#2D2D2D' }}>{action.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── 学ぶ：あなたへのおすすめ記事 ── */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <BookOpen size={16} color="#C97A72" />
              <h3 style={{ fontSize: 14, fontWeight: 800, color: '#2D2D2D' }}>今日のあなたにおすすめの記事</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {relatedArticles.map((article) => (
                <a
                  key={article.id}
                  href={`/employee/contents/${article.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    style={{
                      display: 'flex', gap: 12, alignItems: 'stretch',
                      background: 'white', borderRadius: 16, overflow: 'hidden',
                      boxShadow: '0 2px 14px rgba(0,0,0,0.07)',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
                      ;(e.currentTarget as HTMLElement).style.boxShadow = '0 6px 24px rgba(0,0,0,0.12)'
                    }}
                    onMouseLeave={(e) => {
                      ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                      ;(e.currentTarget as HTMLElement).style.boxShadow = '0 2px 14px rgba(0,0,0,0.07)'
                    }}
                  >
                    {/* サムネイル */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={article.thumbnailUrl}
                      alt={article.title}
                      style={{ width: 88, height: 88, objectFit: 'cover', flexShrink: 0 }}
                    />
                    {/* テキスト */}
                    <div style={{ flex: 1, padding: '12px 12px 12px 0', display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 }}>
                      <span
                        style={{
                          display: 'inline-block', fontSize: 10, fontWeight: 700,
                          color: advice.color, marginBottom: 5,
                          background: `${advice.color}18`, borderRadius: 9999, padding: '2px 8px',
                          alignSelf: 'flex-start',
                        }}
                      >
                        {article.category === 'pms' ? 'PMS' : article.category === 'menstrual' ? '月経ケア' : article.category === 'menopause' ? '更年期' : article.category === 'pregnancy' ? '妊活' : 'メンタル'}
                      </span>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A', lineHeight: 1.45, marginBottom: 4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {article.title}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ fontSize: 10, color: '#9B9B9B' }}>約{article.readTime}分</span>
                        <ChevronRight size={12} color="#9B9B9B" />
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
            <a
              href="/employee/contents"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                marginTop: 10, padding: '10px', borderRadius: 12,
                border: '1.5px solid #C97A7230', color: '#C97A72',
                fontSize: 13, fontWeight: 700, textDecoration: 'none',
                background: 'rgba(201,122,114,0.06)',
              }}
            >
              <BookOpen size={14} color="#C97A72" />
              すべての記事を見る
            </a>
          </div>

          {/* ── つながる：コミュニティバナー ── */}
          <a
            href="/employee/community"
            style={{ textDecoration: 'none', display: 'block', marginBottom: 16 }}
          >
            <div
              style={{
                borderRadius: 20, padding: '16px 18px',
                background: 'linear-gradient(135deg, #F5E8F3 0%, #EDE8F5 100%)',
                display: 'flex', alignItems: 'center', gap: 14,
                boxShadow: '0 4px 18px rgba(155,135,181,0.18)',
                border: '1px solid rgba(155,135,181,0.18)',
              }}
            >
              <div
                style={{
                  width: 48, height: 48, borderRadius: 16, background: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}
              >
                <Users size={22} color="#9B87B5" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 800, color: '#2D2D2D', marginBottom: 3 }}>
                  同じ悩みを持つ人と繋がる
                </p>
                <p style={{ fontSize: 12, color: '#6B6B6B', lineHeight: 1.5 }}>
                  コミュニティで体験・アドバイスをシェアしましょう
                </p>
              </div>
              <ChevronRight size={18} color="#9B87B5" />
            </div>
          </a>

          {/* ── ホームボタン ── */}
          <button
            onClick={() => router.push('/employee/home')}
            style={{
              width: '100%', padding: '15px', borderRadius: 16,
              border: 'none', background: 'rgba(255,255,255,0.75)',
              color: '#6B6B6B', fontWeight: 600, fontSize: 14,
              cursor: 'pointer', backdropFilter: 'blur(8px)',
            }}
          >
            ホームに戻る
          </button>
        </div>
      </div>
    )
  }

  const meta  = STEP_META[step as Exclude<Step, 'done'>]
  const ready = canNext()

  return (
    <div className="emp-page">

      {/* ── ヘッダー ── */}
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
            onClick={goBack}
            style={{
              width: 40, height: 40, borderRadius: '50%', border: 'none',
              backgroundColor: '#F2E0DE', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
            aria-label="戻る"
          >
            <ArrowLeft size={18} color="#C97A72" />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: '#6B6B6B' }}>STEP {idx + 1} / {total}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#C97A72' }}>{Math.round(progress)}%</span>
            </div>
            <div style={{ height: 6, borderRadius: 3, backgroundColor: '#EDE9E6', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  borderRadius: 3,
                  background: 'linear-gradient(90deg, #C97A72, #D4958D)',
                  width: `${progress}%`,
                  transition: 'width 0.5s ease',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '32px 20px 40px' }}>

        {/* ── ステップヘッダー ── */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              background: 'linear-gradient(135deg, #F2E0DE, #EDE8F5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              margin: '0 auto 14px',
              boxShadow: '0 2px 12px rgba(201,122,114,0.15)',
            }}
          >
            {meta.emoji}
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#2D2D2D', marginBottom: 6 }}>{meta.title}</h2>
          <p style={{ fontSize: 14, color: '#6B6B6B' }}>{meta.sub}</p>
        </div>

        {/* ── スコア選択 ── */}
        {(step === 'sleep' || step === 'fatigue' || step === 'mood') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {SCORE_OPTIONS.map((opt) => {
              const cur = step === 'sleep' ? form.sleepScore : step === 'fatigue' ? form.fatigueScore : form.moodScore
              const sel = cur === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    if (step === 'sleep')   setForm((f) => ({ ...f, sleepScore:   opt.value }))
                    if (step === 'fatigue') setForm((f) => ({ ...f, fatigueScore: opt.value }))
                    if (step === 'mood')    setForm((f) => ({ ...f, moodScore:    opt.value }))
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '16px',
                    borderRadius: 18,
                    border: `2px solid ${sel ? opt.color : '#EDE9E6'}`,
                    backgroundColor: sel ? opt.bg : 'white',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                    boxShadow: sel ? `0 4px 16px ${opt.color}28` : '0 2px 8px rgba(0,0,0,0.05)',
                    transform: sel ? 'scale(1.01)' : 'scale(1)',
                  }}
                >
                  <span style={{ fontSize: 28, flexShrink: 0 }}>{opt.emoji}</span>
                  <span style={{ fontSize: 15, fontWeight: 600, flex: 1, color: sel ? opt.color : '#2D2D2D' }}>
                    {opt.label}
                  </span>
                  {sel && (
                    <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: opt.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Check size={13} color="white" strokeWidth={3} />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        )}

        {/* ── 月経状態 ── */}
        {step === 'menstrual' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {MENSTRUAL_OPTIONS.map((opt) => {
              const sel = form.menstrualStatus === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => setForm((f) => ({ ...f, menstrualStatus: opt.value }))}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '18px',
                    borderRadius: 20,
                    border: `2px solid ${sel ? opt.color : '#EDE9E6'}`,
                    background: sel ? opt.gradient : 'white',
                    cursor: 'pointer',
                    textAlign: 'left',
                    boxShadow: sel ? `0 4px 18px ${opt.color}28` : '0 2px 8px rgba(0,0,0,0.05)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{ fontSize: 28, flexShrink: 0 }}>{opt.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: sel ? opt.color : '#2D2D2D', marginBottom: 3 }}>{opt.label}</p>
                    <p style={{ fontSize: 12, color: '#6B6B6B' }}>{opt.sub}</p>
                  </div>
                  {sel && (
                    <div style={{ width: 26, height: 26, borderRadius: '50%', backgroundColor: opt.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Check size={14} color="white" strokeWidth={3} />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        )}

        {/* ── 症状チェック ── */}
        {step === 'symptoms' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              {SYMPTOMS.map((symptom) => {
                const sel = form.symptoms.includes(symptom.id)
                return (
                  <button
                    key={symptom.id}
                    onClick={() => toggleSymptom(symptom.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '14px',
                      borderRadius: 16,
                      border: `2px solid ${sel ? '#C97A72' : '#EDE9E6'}`,
                      background: sel ? 'linear-gradient(135deg,#F2E0DE,#FDEAE8)' : 'white',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: 13,
                      color: sel ? '#C97A72' : '#2D2D2D',
                      boxShadow: sel ? '0 4px 14px rgba(201,122,114,0.22)' : '0 2px 6px rgba(0,0,0,0.05)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        flexShrink: 0,
                        backgroundColor: sel ? '#C97A72' : 'transparent',
                        border: sel ? 'none' : '2px solid #EDE9E6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {sel && <Check size={11} color="white" strokeWidth={3} />}
                    </div>
                    {symptom.label}
                  </button>
                )
              })}
            </div>
            <p style={{ fontSize: 12, color: '#9B9B9B', textAlign: 'center' }}>
              ない場合はそのまま「記録する」をタップ ✓
            </p>
          </div>
        )}

        {/* ── 次へ / 記録するボタン ── */}
        <div style={{ marginTop: 32 }}>
          {submitError && (
            <p style={{ color: '#D95B4A', fontSize: 13, textAlign: 'center', marginBottom: 12 }}>
              ⚠️ {submitError}
            </p>
          )}
          <button
            onClick={step === 'symptoms' ? handleRecord : goNext}
            disabled={!ready || isPending}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '18px',
              borderRadius: 20,
              border: 'none',
              background: (ready && !isPending) ? 'linear-gradient(135deg, #C97A72 0%, #D4958D 100%)' : '#E5E2DF',
              color: (ready && !isPending) ? 'white' : '#9B9B9B',
              fontWeight: 700,
              fontSize: 16,
              cursor: (ready && !isPending) ? 'pointer' : 'not-allowed',
              boxShadow: (ready && !isPending) ? '0 5px 22px rgba(201,122,114,0.40)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            {step === 'symptoms'
              ? (isPending ? '保存中...' : '✓ 記録する')
              : <>次へ <ArrowRight size={20} /></>}
          </button>
        </div>
      </div>
    </div>
  )
}
