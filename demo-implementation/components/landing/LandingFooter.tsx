import Link from 'next/link'

export function LandingFooter() {
  return (
    <footer style={{ backgroundColor: '#1A1A1A', color: '#ffffff' }}>
      {/* メインエリア */}
      <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '80px 32px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '64px', alignItems: 'start' }}>

          {/* ブランド */}
          <div>
            <p className="font-display" style={{ fontSize: '22px', fontWeight: 500, color: '#fff', marginBottom: '16px' }}>
              Femcare
            </p>
            <p style={{ fontSize: '14px', lineHeight: 2, color: 'rgba(255,255,255,0.48)', maxWidth: '320px' }}>
              働く女性の健康を支える法人向け Web サービスです。「気づき → 学び → 相談」の3ステップで、健康経営と女性活躍推進をサポートします。
            </p>
          </div>

          {/* メニュー */}
          <div>
            <p style={{ fontSize: '11px', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.35)', marginBottom: '20px' }}>
              MENU
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { label: 'サービス', href: '#service' },
                { label: '企業の方へ', href: '#for-business' },
                { label: 'よくある質問', href: '#faq' },
                { label: 'ログイン', href: '/sign-in' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}
                    className="hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ポリシー */}
          <div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {['プライバシーポリシー', 'サイトポリシー・ご利用上の注意'].map((label) => (
                <li key={label}>
                  <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)' }}>
                    {label}
                  </span>
                </li>
              ))}
            </ul>
            <p style={{ fontSize: '12px', lineHeight: 1.9, color: 'rgba(255,255,255,0.3)', marginTop: 20 }}>
              本サービスは医療行為ではありません。必要に応じて医療機関への受診をお勧めします。
            </p>
          </div>
        </div>
      </div>

      {/* コピーライト */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '20px 32px' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.06em' }}>
            © 2026 BIRD INITIATIVE 株式会社 All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
