'use client'

import { useTransition, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { registerEmployee } from '@/app/actions/user'
import { Heart, ChevronRight } from 'lucide-react'

const AGE_GROUPS = [
  { id: '20s', label: '20代' },
  { id: '30s', label: '30代' },
  { id: '40s', label: '40代' },
  { id: '50s', label: '50代以上' },
] as const

const LIFE_STAGES = [
  { id: 'menstrual',          label: '月経あり',   emoji: '🌸', desc: '現在月経がある方' },
  { id: 'trying_to_conceive', label: '妊活中',     emoji: '🌱', desc: '妊娠を希望している方' },
  { id: 'postpartum',         label: '産後',       emoji: '👶', desc: '出産後の方' },
  { id: 'menopause',          label: '更年期・閉経後', emoji: '🌿', desc: '更年期症状がある・閉経した方' },
] as const

export default function OnboardingForm({ preview = false }: { preview?: boolean }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [ageGroup, setAgeGroup] = useState<string>('')
  const [lifeStage, setLifeStage] = useState<string>('')
  const [previewDone, setPreviewDone] = useState(false)
  const [countdown, setCountdown] = useState(3)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    // デモ用プレビューの場合は保存せず完了画面へ
    if (preview) {
      setPreviewDone(true)
      return
    }

    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await registerEmployee(formData)
      if (result?.error) setError(result.error)
    })
  }

  useEffect(() => {
    if (!previewDone) return
    if (countdown <= 0) {
      router.push('/employee/home')
      return
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [previewDone, countdown, router])

  if (previewDone) {
    return (
      <div style={{
        minHeight: '100vh', backgroundColor: '#FAF8F5',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '24px 16px',
      }}>
        <div style={{ textAlign: 'center', maxWidth: 360 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 20,
            background: 'linear-gradient(135deg, #C97A72, #D4958D)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 6px 20px rgba(201,122,114,0.35)',
          }}>
            <Heart size={30} color="white" fill="white" />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#2D2D2D', marginBottom: 12 }}>
            登録完了！
          </h2>
          <p style={{ fontSize: 14, color: '#6B6B6B', lineHeight: 1.8, marginBottom: 20 }}>
            Femcareへようこそ。<br />
            <strong style={{ color: '#C97A72' }}>{countdown}秒後</strong>にホーム画面へ移動します。
          </p>
          <button
            onClick={() => router.push('/employee/home')}
            style={{
              padding: '12px 28px', borderRadius: 12, border: 'none',
              background: 'linear-gradient(135deg, #C97A72, #D4958D)',
              color: 'white', fontWeight: 700, fontSize: 14,
              cursor: 'pointer', marginBottom: 16,
              boxShadow: '0 4px 14px rgba(201,122,114,0.35)',
            }}
          >
            今すぐホームへ
          </button>
          <p style={{ fontSize: 12, color: '#ABABAB' }}>
            ※ デモ表示です（データは保存されません）
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#FAF8F5',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
      }}
    >
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* ロゴ */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            style={{
              width: 56, height: 56, borderRadius: 18,
              background: 'linear-gradient(135deg, #C97A72, #D4958D)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 12px',
              boxShadow: '0 6px 20px rgba(201,122,114,0.35)',
            }}
          >
            <Heart size={26} color="white" fill="white" />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#2D2D2D', marginBottom: 6 }}>
            Femcareへようこそ
          </h1>
          <p style={{ fontSize: 13, color: '#6B6B6B', lineHeight: 1.6 }}>
            はじめに、あなたのことを教えてください
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* 年代 */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#2D2D2D', marginBottom: 10 }}>
              年代を選択してください
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {AGE_GROUPS.map((ag) => (
                <label
                  key={ag.id}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '14px', borderRadius: 14,
                    border: `2px solid ${ageGroup === ag.id ? '#C97A72' : '#EDE9E6'}`,
                    backgroundColor: ageGroup === ag.id ? '#FDF0EE' : 'white',
                    cursor: 'pointer', fontWeight: 700, fontSize: 15,
                    color: ageGroup === ag.id ? '#C97A72' : '#6B6B6B',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <input
                    type="radio" name="age_group" value={ag.id}
                    checked={ageGroup === ag.id}
                    onChange={() => setAgeGroup(ag.id)}
                    style={{ display: 'none' }} required
                  />
                  {ag.label}
                </label>
              ))}
            </div>
          </div>

          {/* ライフステージ */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#2D2D2D', marginBottom: 10 }}>
              現在のライフステージを教えてください
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {LIFE_STAGES.map((ls) => (
                <label
                  key={ls.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '14px 16px', borderRadius: 16,
                    border: `2px solid ${lifeStage === ls.id ? '#C97A72' : '#EDE9E6'}`,
                    backgroundColor: lifeStage === ls.id ? '#FDF0EE' : 'white',
                    cursor: 'pointer', transition: 'all 0.15s ease',
                  }}
                >
                  <input
                    type="radio" name="life_stage" value={ls.id}
                    checked={lifeStage === ls.id}
                    onChange={() => setLifeStage(ls.id)}
                    style={{ display: 'none' }} required
                  />
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{ls.emoji}</span>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: lifeStage === ls.id ? '#C97A72' : '#2D2D2D', marginBottom: 2 }}>
                      {ls.label}
                    </p>
                    <p style={{ fontSize: 11, color: '#9B9B9B' }}>{ls.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* 同意 */}
          <div
            style={{
              marginBottom: 24, padding: '16px', borderRadius: 14,
              backgroundColor: '#F0F8F5', border: '1px solid #DCF0EB',
            }}
          >
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
              <input
                type="checkbox" name="consent" value="true" required
                style={{ marginTop: 2, accentColor: '#4A7C6F', width: 16, height: 16, flexShrink: 0 }}
              />
              <p style={{ fontSize: 12, color: '#4A7C6F', lineHeight: 1.7 }}>
                体調データはプライバシーポリシーに従って管理され、
                <strong>会社に個人が特定される形では共有されません</strong>。
                同意の上で利用を開始します。
              </p>
            </label>
          </div>

          {error && (
            <div
              style={{
                marginBottom: 16, padding: '12px 14px', borderRadius: 12,
                backgroundColor: '#FEF2F2', border: '1px solid #FECACA',
                color: '#DC2626', fontSize: 13,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending || !ageGroup || !lifeStage}
            style={{
              width: '100%', padding: '16px', borderRadius: 16, border: 'none',
              background: isPending || !ageGroup || !lifeStage
                ? '#E5E5E5'
                : 'linear-gradient(135deg, #C97A72, #D4958D)',
              color: isPending || !ageGroup || !lifeStage ? '#9B9B9B' : 'white',
              fontSize: 15, fontWeight: 700,
              cursor: isPending || !ageGroup || !lifeStage ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: isPending || !ageGroup || !lifeStage
                ? 'none'
                : '0 6px 20px rgba(201,122,114,0.35)',
              transition: 'all 0.2s ease',
            }}
          >
            {isPending ? '登録中...' : 'Femcareをはじめる'}
            {!isPending && <ChevronRight size={18} />}
          </button>
        </form>
      </div>
    </div>
  )
}
