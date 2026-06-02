'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { SYMPTOMS, type MenstrualStatus } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

type Step = 'sleep' | 'fatigue' | 'mood' | 'menstrual' | 'symptoms' | 'done'

interface FormState {
  sleepScore: number | null
  fatigueScore: number | null
  moodScore: number | null
  menstrualStatus: MenstrualStatus | null
  symptoms: string[]
}

const STEPS: Step[] = ['sleep', 'fatigue', 'mood', 'menstrual', 'symptoms', 'done']

const SCORE_OPTIONS = [
  { value: 1, emoji: '😫', label: '非常に悪い' },
  { value: 2, emoji: '😔', label: 'やや悪い' },
  { value: 3, emoji: '😐', label: '普通' },
  { value: 4, emoji: '🙂', label: 'やや良い' },
  { value: 5, emoji: '😄', label: '非常に良い' },
]

const MENSTRUAL_OPTIONS = [
  { value: 'menstrual' as MenstrualStatus, emoji: '🌸', label: '月経中' },
  { value: 'premenstrual' as MenstrualStatus, emoji: '🌙', label: '月経前' },
  { value: 'normal' as MenstrualStatus, emoji: '☀️', label: '通常期' },
]

const FEEDBACK_MAP: Record<MenstrualStatus, string> = {
  menstrual: '月経中です。無理せず、温かくして過ごしましょう。鎮痛剤の使用も適切な対処の一つです。',
  premenstrual: '月経前の時期です。イライラや集中力の低下はPMSのサインかもしれません。無理せず休息を取りましょう。',
  normal: '体調が安定している時期です。栄養と睡眠を意識して過ごしましょう。',
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-300"
          style={{
            width: i < current ? 20 : 8,
            height: 8,
            backgroundColor: i < current ? 'var(--color-primary)' : 'var(--color-border)',
          }}
        />
      ))}
    </div>
  )
}

function ScoreButton({
  emoji,
  label,
  selected,
  onClick,
}: {
  emoji: string
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all',
        'tap-target w-full cursor-pointer'
      )}
      style={{
        borderColor: selected ? 'var(--color-primary)' : 'var(--color-border)',
        backgroundColor: selected ? 'var(--color-primary-light)' : 'var(--color-surface)',
      }}
    >
      <span className="text-3xl">{emoji}</span>
      <span
        className="text-xs font-medium"
        style={{ color: selected ? 'var(--color-primary)' : 'var(--color-text-secondary)' }}
      >
        {label}
      </span>
    </button>
  )
}

export default function CheckInPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('sleep')
  const [form, setForm] = useState<FormState>({
    sleepScore: null,
    fatigueScore: null,
    moodScore: null,
    menstrualStatus: null,
    symptoms: [],
  })

  const stepIndex = STEPS.indexOf(step)
  const totalSteps = STEPS.length - 1

  const canProceed = () => {
    if (step === 'sleep') return form.sleepScore !== null
    if (step === 'fatigue') return form.fatigueScore !== null
    if (step === 'mood') return form.moodScore !== null
    if (step === 'menstrual') return form.menstrualStatus !== null
    return true
  }

  const handleNext = () => {
    const nextIndex = stepIndex + 1
    if (nextIndex < STEPS.length) setStep(STEPS[nextIndex])
  }

  const handleBack = () => {
    if (stepIndex > 0) setStep(STEPS[stepIndex - 1])
    else router.push('/employee/home')
  }

  const toggleSymptom = (id: string) => {
    setForm((prev) => ({
      ...prev,
      symptoms: prev.symptoms.includes(id)
        ? prev.symptoms.filter((s) => s !== id)
        : [...prev.symptoms, id],
    }))
  }

  if (step === 'done') {
    const feedback =
      form.menstrualStatus ? FEEDBACK_MAP[form.menstrualStatus] : 'お疲れ様でした。今日も健康に過ごしましょう。'
    return (
      <div className="max-w-lg mx-auto px-4 py-12 flex flex-col items-center text-center">
        <div className="animate-check mb-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--color-primary-light)' }}
          >
            <Check className="w-10 h-10" style={{ color: 'var(--color-primary)' }} />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>
          チェックイン完了！
        </h2>
        <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          今日も記録できました。継続は力なりです 💪
        </p>
        <div
          className="w-full rounded-2xl p-5 mb-8 text-left"
          style={{ backgroundColor: 'var(--color-primary-light)' }}
        >
          <p className="text-xs font-semibold mb-2" style={{ color: 'var(--color-primary)' }}>
            ✨ 今日の気づき
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-primary)' }}>
            {feedback}
          </p>
        </div>
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={() => router.push('/employee/contents')}
            className="py-3 px-6 rounded-xl font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            関連コンテンツを読む
          </button>
          <button
            onClick={() => router.push('/employee/home')}
            className="py-3 px-6 rounded-xl font-medium border transition-opacity hover:opacity-80"
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-secondary)',
              backgroundColor: 'var(--color-surface)',
            }}
          >
            ホームに戻る
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto">
      <div
        className="sticky top-0 z-40 px-4 py-3 flex items-center gap-3 border-b"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <button
          onClick={handleBack}
          className="tap-target rounded-full"
          style={{ color: 'var(--color-text-secondary)' }}
          aria-label="戻る"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <p className="text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>
            {stepIndex + 1} / {totalSteps}
          </p>
          <StepIndicator current={stepIndex + 1} total={totalSteps} />
        </div>
      </div>

      <div className="px-4 pt-8 pb-6">
        {step === 'sleep' && (
          <ScoreStep
            title="睡眠の質"
            description="昨夜の眠りはいかがでしたか？"
            value={form.sleepScore}
            onChange={(v) => setForm((f) => ({ ...f, sleepScore: v }))}
          />
        )}
        {step === 'fatigue' && (
          <ScoreStep
            title="倦怠感"
            description="今の体の疲れ具合はどのくらいですか？"
            value={form.fatigueScore}
            onChange={(v) => setForm((f) => ({ ...f, fatigueScore: v }))}
          />
        )}
        {step === 'mood' && (
          <ScoreStep
            title="気分"
            description="今の気分はいかがですか？"
            value={form.moodScore}
            onChange={(v) => setForm((f) => ({ ...f, moodScore: v }))}
          />
        )}
        {step === 'menstrual' && (
          <div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
              月経の状態
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
              現在の月経の状況を教えてください。
            </p>
            <div className="flex flex-col gap-3">
              {MENSTRUAL_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setForm((f) => ({ ...f, menstrualStatus: opt.value }))}
                  className="flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all"
                  style={{
                    borderColor:
                      form.menstrualStatus === opt.value ? 'var(--color-primary)' : 'var(--color-border)',
                    backgroundColor:
                      form.menstrualStatus === opt.value ? 'var(--color-primary-light)' : 'var(--color-surface)',
                  }}
                >
                  <span className="text-3xl">{opt.emoji}</span>
                  <span
                    className="font-medium"
                    style={{
                      color:
                        form.menstrualStatus === opt.value
                          ? 'var(--color-primary)'
                          : 'var(--color-text-primary)',
                    }}
                  >
                    {opt.label}
                  </span>
                  {form.menstrualStatus === opt.value && (
                    <Check className="w-5 h-5 ml-auto flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
        {step === 'symptoms' && (
          <div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
              症状（任意）
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
              今日気になる症状があれば選んでください。（複数選択可）
            </p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {SYMPTOMS.map((symptom) => {
                const selected = form.symptoms.includes(symptom.id)
                return (
                  <button
                    key={symptom.id}
                    onClick={() => toggleSymptom(symptom.id)}
                    className="flex items-center gap-2 p-4 rounded-xl border-2 text-sm font-medium transition-all"
                    style={{
                      borderColor: selected ? 'var(--color-primary)' : 'var(--color-border)',
                      backgroundColor: selected ? 'var(--color-primary-light)' : 'var(--color-surface)',
                      color: selected ? 'var(--color-primary)' : 'var(--color-text-primary)',
                    }}
                  >
                    {selected && <Check className="w-4 h-4 flex-shrink-0" />}
                    {symptom.label}
                  </button>
                )
              })}
            </div>
            <p className="text-xs text-center" style={{ color: 'var(--color-text-secondary)' }}>
              ない場合はそのまま「次へ」をタップ
            </p>
          </div>
        )}

        <div className="mt-8">
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-white transition-all disabled:opacity-40"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            {step === 'symptoms' ? '記録する' : '次へ'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

function ScoreStep({
  title,
  description,
  value,
  onChange,
}: {
  title: string
  description: string
  value: number | null
  onChange: (v: number) => void
}) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
        {title}
      </h2>
      <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
        {description}
      </p>
      <div className="grid grid-cols-5 gap-2">
        {SCORE_OPTIONS.map((opt) => (
          <ScoreButton
            key={opt.value}
            emoji={opt.emoji}
            label={opt.label}
            selected={value === opt.value}
            onClick={() => onChange(opt.value)}
          />
        ))}
      </div>
    </div>
  )
}
