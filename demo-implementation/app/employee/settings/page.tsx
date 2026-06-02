import { mockUser } from '@/lib/mock-data'
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

export default function SettingsPage() {
  return (
    <div style={{ maxWidth: 480, margin: '0 auto', backgroundColor: '#FAF8F5', minHeight: '100vh' }}>

      {/* ヘッダー */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          padding: '16px',
          backgroundColor: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderBottom: '1px solid #EDE9E6',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 9,
            background: 'linear-gradient(135deg, #9B87B5, #C97A72)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: 14 }}>⚙️</span>
        </div>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: '#2D2D2D' }}>設定</h1>
      </header>

      <div style={{ padding: '20px 16px 40px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* プロフィールカード */}
        <div
          style={{
            borderRadius: 24,
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(201,122,114,0.13)',
          }}
        >
          {/* 背景グラデーション */}
          <div
            style={{
              padding: '24px 20px 20px',
              background: 'linear-gradient(160deg, #FDF0EE 0%, #F5E8F3 60%, #E8F2F0 100%)',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            {/* アバター */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #C97A72, #D4958D)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: 24,
                  boxShadow: '0 4px 16px rgba(201,122,114,0.35)',
                }}
              >
                {mockUser.name[0]}
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4A7C6F, #6BAB8F)',
                  border: '2px solid white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Heart size={9} color="white" fill="white" />
              </div>
            </div>

            {/* 名前・所属 */}
            <div>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#2D2D2D', marginBottom: 4 }}>
                {mockUser.name}さん
              </p>
              <p style={{ fontSize: 12, color: '#6B6B6B', marginBottom: 10 }}>
                {mockUser.company} / {mockUser.department}
              </p>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '5px 12px',
                  borderRadius: 9999,
                  background: 'linear-gradient(135deg, #DCF0EB, #E8F5F0)',
                  color: '#4A7C6F',
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                <Lock size={9} />
                データは企業に特定されません
              </div>
            </div>
          </div>

          {/* ストリーク表示 */}
          <div
            style={{
              padding: '14px 20px',
              backgroundColor: 'white',
              display: 'flex',
              justifyContent: 'space-around',
            }}
          >
            {[
              { label: '連続チェックイン', value: '7日', emoji: '🔥' },
              { label: '総記録数',         value: '23回', emoji: '📊' },
              { label: '相談履歴',          value: '2件', emoji: '💬' },
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
            <div
              style={{
                borderRadius: 18,
                overflow: 'hidden',
                backgroundColor: 'white',
                boxShadow: '0 3px 14px rgba(0,0,0,0.06)',
              }}
            >
              {group.items.map(({ Icon, label, sub, href }, i) => (
                <a
                  key={i}
                  href={href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '15px 16px',
                    textDecoration: 'none',
                    borderBottom: i < group.items.length - 1 ? '1px solid #F5F3F0' : 'none',
                    transition: 'background-color 0.15s',
                    backgroundColor: 'transparent',
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      backgroundColor: '#FAF8F5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
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

        {/* ログアウト */}
        <button
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '16px',
            borderRadius: 18,
            border: '1.5px solid #EDE9E6',
            backgroundColor: 'white',
            color: '#D95B4A',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
          }}
        >
          <LogOut size={16} />
          ログアウト
        </button>

        {/* バージョン */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '6px 14px',
              borderRadius: 9999,
              backgroundColor: '#F2E0DE',
            }}
          >
            <Heart size={10} color="#C97A72" fill="#C97A72" />
            <span style={{ fontSize: 11, color: '#C97A72', fontWeight: 600 }}>Femcare v0.1.0</span>
          </div>
        </div>

      </div>
    </div>
  )
}
