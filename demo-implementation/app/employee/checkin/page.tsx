'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check, Heart } from 'lucide-react'
import { SYMPTOMS, type MenstrualStatus } from '@/lib/mock-data'

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

  /* ── 完了画面 ── */
  if (step === 'done') {
    const feedback = form.menstrualStatus ? FEEDBACK[form.menstrualStatus] : 'お疲れ様でした。今日も健康に過ごしましょう。'
    const scores = [
      { label: '睡眠', score: form.sleepScore ?? 3,   icon: '🌙' },
      { label: '疲れ', score: form.fatigueScore ?? 3, icon: '⚡' },
      { label: '気分', score: form.moodScore ?? 3,    icon: '💭' },
    ]
    return (
      <div
        style={{
          minHeight: '100vh',
          maxWidth: 480,
          margin: '0 auto',
          padding: '40px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'linear-gradient(160deg, #FDF0EE 0%, #F5E8F3 50%, #E8F2F0 100%)',
        }}
      >
        {/* 完了バッジ */}
        <div className="animate-check" style={{ marginBottom: 20, marginTop: 32 }}>
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #C97A72, #D4958D)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 24px rgba(201,122,114,0.42)',
            }}
          >
            <Check size={44} color="white" strokeWidth={3} />
          </div>
        </div>

        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6, color: '#2D2D2D' }}>記録完了！🎉</h2>
        <p style={{ fontSize: 14, color: '#6B6B6B', marginBottom: 28, textAlign: 'center' }}>
          7日連続チェックイン達成！素晴らしいです ✨
        </p>

        {/* スコアカード */}
        <div
          style={{
            width: '100%',
            borderRadius: 20,
            padding: '20px',
            backgroundColor: 'white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            marginBottom: 12,
          }}
        >
          <p style={{ fontSize: 12, fontWeight: 700, color: '#6B6B6B', textAlign: 'center', marginBottom: 16 }}>今日のスコア</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {scores.map(({ label, score, icon }) => {
              const opt = SCORE_OPTIONS.find((o) => o.value === score) ?? SCORE_OPTIONS[2]
              return (
                <div key={label} style={{ borderRadius: 14, padding: '12px 8px', textAlign: 'center', backgroundColor: opt.bg }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: opt.color }}>{score}/5</div>
                  <div style={{ fontSize: 11, color: '#6B6B6B', marginTop: 2 }}>{label}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 気づきメッセージ */}
        <div
          style={{
            width: '100%',
            borderRadius: 20,
            padding: '18px',
            background: 'linear-gradient(135deg, #F2E0DE 0%, #EDE8F5 100%)',
            marginBottom: 24,
            boxShadow: '0 2px 12px rgba(201,122,114,0.12)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <Heart size={14} color="#C97A72" fill="#C97A72" />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#C97A72' }}>今日の気づき</span>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.7, color: '#2D2D2D' }}>{feedback}</p>
        </div>

        <button
          onClick={() => router.push('/employee/contents')}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: 18,
            border: 'none',
            background: 'linear-gradient(135deg, #C97A72, #D4958D)',
            color: 'white',
            fontWeight: 700,
            fontSize: 15,
            cursor: 'pointer',
            marginBottom: 10,
            boxShadow: '0 4px 18px rgba(201,122,114,0.38)',
          }}
        >
          関連コンテンツを読む
        </button>
        <button
          onClick={() => router.push('/employee/home')}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: 18,
            border: 'none',
            backgroundColor: 'rgba(255,255,255,0.8)',
            color: '#6B6B6B',
            fontWeight: 600,
            fontSize: 15,
            cursor: 'pointer',
          }}
        >
          ホームに戻る
        </button>
      </div>
    )
  }

  const meta  = STEP_META[step as Exclude<Step, 'done'>]
  const ready = canNext()

  return (
    <div style={{ minHeight: '100vh', maxWidth: 480, margin: '0 auto', backgroundColor: '#FAF8F5' }}>

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

        {/* ── 次へボタン ── */}
        <div style={{ marginTop: 32 }}>
          <button
            onClick={goNext}
            disabled={!ready}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '18px',
              borderRadius: 20,
              border: 'none',
              background: ready ? 'linear-gradient(135deg, #C97A72 0%, #D4958D 100%)' : '#E5E2DF',
              color: ready ? 'white' : '#9B9B9B',
              fontWeight: 700,
              fontSize: 16,
              cursor: ready ? 'pointer' : 'not-allowed',
              boxShadow: ready ? '0 5px 22px rgba(201,122,114,0.40)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            {step === 'symptoms' ? '✓ 記録する' : <>次へ <ArrowRight size={20} /></>}
          </button>
        </div>
      </div>
    </div>
  )
}
