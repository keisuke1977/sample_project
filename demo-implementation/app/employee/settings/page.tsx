import { auth, currentUser } from '@clerk/nextjs/server'
import { SignOutButton } from '@clerk/nextjs'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { ChevronRight, Bell, Lock, HelpCircle, LogOut, User, Shield, FileText, Heart } from 'lucide-react'

const SETTINGS_GROUPS = [
  {
    title: 'アカウント',
    emoji: '👤',
    items: [
      { Icon: User,     label: 'プロフィール設定', sub: '名前・部署を変更', href: '#' },
      { Icon: Bell,     label: '通知設定',         sub: 'プッシュ通知の管理', href: '#' },
    ],
  },
  {
    title: 'プライバシー',
    emoji: '🔒',
    items: [
      { Icon: Shield,   label: 'データ利用への同意', sub: 'いつでも変更できます', href: '#' },
      { Icon: FileText, label: 'データのエクスポート', sub: '記録データをダウンロード', href: '#' },
    ],
  },
  {
    title: 'サポート',
    emoji: '💬',
    items: [
      { Icon: HelpCircle, label: 'よくある質問', sub: '使い方・機能について', href: '#' },
      { Icon: HelpCircle, label: 'お問い合わせ', sub: '不具合・ご要望はこちら', href: '#' },
    ],
  },
]

const LIFE_STAGE_LABEL: Record<string, string> = {
  menstrual:          '月経あり',
  trying_to_conceive: '妊活中',
  postpartum:         '産後',
  menopause:          '更年期・閉経後',
}

const AGE_GROUP_LABEL: Record<string, string> = {
  '20s': '20代',
  '30s': '30代',
  '40s': '40代',
  '50s': '50代以上',
}

export default async function SettingsPage() {
  const { userId } = await auth()
  const clerkUser = await currentUser()

  const supabase = createServiceRoleClient()
  const { data: profile } = userId
    ? await supabase
        .from('users')
        .select('age_group, life_stage')
        .eq('clerk_user_id', userId)
        .maybeSingle()
    : { data: null }

  const { data: checkinCount } = userId && profile
    ? await supabase
        .from('check_ins')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
    : { data: null }

  const { data: consultCount } = userId
    ? await supabase
        .from('consultations')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
    : { data: null }

  const displayName =
    (clerkUser?.firstName ? clerkUser.firstName + (clerkUser.lastName ? ' ' + clerkUser.lastName : '') : null)
    ?? clerkUser?.emailAddresses?.[0]?.emailAddress?.split('@')[0]
    ?? 'ゲスト'

  const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? ''
  const avatarInitial = displayName[0]?.toUpperCase() ?? '?'

  return (
    <div className="emp-page">

      {/* ヘッダー */}
      <header
        style={{
          position: 'sticky', top: 0, zIndex: 40,
          padding: '16px', backgroundColor: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
          borderBottom: '1px solid #EDE9E6',
          display: 'flex', alignItems: 'center', gap: 8,
        }}
      >
        <div style={{
          width: 30, height: 30, borderRadius: 9,
          background: 'linear-gradient(135deg, #9B87B5, #C97A72)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 14 }}>⚙️</span>
        </div>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: '#2D2D2D' }}>設定</h1>
      </header>

      <div style={{ padding: '20px 16px 40px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* プロフィールカード */}
        <div style={{ borderRadius: 24, overflow: 'hidden', boxShadow: '0 4px 20px rgba(201,122,114,0.13)' }}>
          <div style={{
            padding: '24px 20px 20px',
            background: 'linear-gradient(160deg, #FDF0EE 0%, #F5E8F3 60%, #E8F2F0 100%)',
            display: 'flex', alignItems: 'center', gap: 16,
          }}>
            {/* アバター */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'linear-gradient(135deg, #C97A72, #D4958D)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 700, fontSize: 24,
                boxShadow: '0 4px 16px rgba(201,122,114,0.35)',
              }}>
                {avatarInitial}
              </div>
              <div style={{
                position: 'absolute', bottom: 0, right: 0,
                width: 20, height: 20, borderRadius: '50%',
                background: 'linear-gradient(135deg, #4A7C6F, #6BAB8F)',
                border: '2px solid white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Heart size={9} color="white" fill="white" />
              </div>
            </div>

            {/* 名前・情報 */}
            <div>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#2D2D2D', marginBottom: 2 }}>
                {displayName}さん
              </p>
              {email && (
                <p style={{ fontSize: 11, color: '#9B9B9B', marginBottom: 4 }}>{email}</p>
              )}
              {profile?.age_group && (
                <p style={{ fontSize: 12, color: '#6B6B6B', marginBottom: 8 }}>
                  {AGE_GROUP_LABEL[profile.age_group] ?? profile.age_group}
                  {profile.life_stage ? ` ・ ${LIFE_STAGE_LABEL[profile.life_stage] ?? profile.life_stage}` : ''}
                </p>
              )}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '5px 12px', borderRadius: 9999,
                background: 'linear-gradient(135deg, #DCF0EB, #E8F5F0)',
                color: '#4A7C6F', fontSize: 11, fontWeight: 700,
              }}>
                <Lock size={9} />
                データは企業に特定されません
              </div>
            </div>
          </div>

          {/* 統計 */}
          <div style={{
            padding: '14px 20px', backgroundColor: 'white',
            display: 'flex', justifyContent: 'space-around',
          }}>
            {[
              { label: '連続チェックイン', value: '–', emoji: '🔥' },
              { label: '総記録数',         value: '–', emoji: '📊' },
              { label: '相談履歴',         value: '–', emoji: '💬' },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, marginBottom: 3 }}>{stat.emoji}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#2D2D2D', marginBottom: 2 }}>{stat.value}</div>
                <div style={{ fontSize: 10, color: '#9B9B9B' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 設定グループ */}
        {SETTINGS_GROUPS.map((group) => (
          <div key={group.title}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, paddingLeft: 2 }}>
              <span style={{ fontSize: 13 }}>{group.emoji}</span>
              <h2 style={{ fontSize: 12, fontWeight: 700, color: '#9B9B9B', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                {group.title}
              </h2>
            </div>
            <div style={{
              borderRadius: 18, overflow: 'hidden',
              backgroundColor: 'white', boxShadow: '0 3px 14px rgba(0,0,0,0.06)',
            }}>
              {group.items.map(({ Icon, label, sub, href }, i) => (
                <a
                  key={i}
                  href={href}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '15px 16px', textDecoration: 'none',
                    borderBottom: i < group.items.length - 1 ? '1px solid #F5F3F0' : 'none',
                    backgroundColor: 'transparent',
                  }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    backgroundColor: '#FAF8F5',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Icon size={17} color="#C97A72" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#2D2D2D', marginBottom: 2 }}>{label}</p>
                    <p style={{ fontSize: 11, color: '#9B9B9B' }}>{sub}</p>
                  </div>
                  <ChevronRight size={16} color="#C0C0C0" style={{ flexShrink: 0 }} />
                </a>
              ))}
            </div>
          </div>
        ))}

        {/* ログアウト（Clerk SignOutButton） */}
        <SignOutButton redirectUrl="/">
          <button
            style={{
              width: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '16px', borderRadius: 18,
              border: '1.5px solid #EDE9E6', backgroundColor: 'white',
              color: '#D95B4A', fontSize: 14, fontWeight: 700,
              cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
            }}
          >
            <LogOut size={16} />
            ログアウト
          </button>
        </SignOutButton>

        {/* バージョン */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '6px 14px', borderRadius: 9999, backgroundColor: '#F2E0DE',
          }}>
            <Heart size={10} color="#C97A72" fill="#C97A72" />
            <span style={{ fontSize: 11, color: '#C97A72', fontWeight: 600 }}>Femcare v0.1.0</span>
          </div>
        </div>

      </div>
    </div>
  )
}
