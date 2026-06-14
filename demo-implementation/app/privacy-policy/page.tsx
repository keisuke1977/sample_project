import Link from 'next/link'

export default function PrivacyPolicyPage() {
  return (
    <div style={{ backgroundColor: '#FAF8F5', minHeight: '100vh' }}>
      {/* ヘッダー */}
      <header style={{
        backgroundColor: 'white', borderBottom: '1px solid #EDE9E6',
        padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link href="/" style={{ textDecoration: 'none', fontSize: 18, fontWeight: 700, color: '#1A1A1A' }}>
          Femcare
        </Link>
        <Link href="/" style={{ fontSize: 13, color: '#C97A72', textDecoration: 'none' }}>
          ← トップページへ戻る
        </Link>
      </header>

      {/* コンテンツ */}
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '60px 32px 100px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1A1A1A', marginBottom: 8 }}>
          プライバシーポリシー
        </h1>
        <p style={{ fontSize: 13, color: '#9B9B9B', marginBottom: 48 }}>（個人情報保護方針）</p>

        <div style={{
          backgroundColor: '#FDF0EE', border: '1px solid rgba(201,122,114,0.2)',
          borderRadius: 12, padding: '16px 20px', marginBottom: 40, fontSize: 13,
          color: '#6B3D38', lineHeight: 1.8,
        }}>
          この入力フォームで取得する個人情報の取り扱いは下記3項の利用目的のためであり、この目的の範囲を超えて利用することはございません。
        </div>

        {[
          {
            num: '1', title: '組織の名称',
            content: (
              <p>BIRD INITIATIVE 株式会社</p>
            ),
          },
          {
            num: '2', title: '個人情報に関する管理者の所属及び連絡先',
            content: (
              <p>
                管理者名：個人情報保護管理者<br />
                所在地：東京都港区港南2-16-5 NBF品川タワー6F
              </p>
            ),
          },
          {
            num: '3', title: '個人情報の利用目的',
            content: (
              <ul style={{ paddingLeft: 20, lineHeight: 2 }}>
                <li>当社が運営するFemcareサービス内の機能利用に必要なユーザー情報の管理のため。</li>
                <li>同サービスの会員が、ログインパスワード等の変更を行う際のシステム処理のため。</li>
                <li>問い合わせへの回答のため。</li>
                <li>関連する当社サービスの案内のため。</li>
              </ul>
            ),
          },
          {
            num: '4', title: '個人情報の第三者提供',
            content: (
              <>
                <p style={{ marginBottom: 12 }}>当社は、ご提供いただいた個人情報を次の場合を除き第三者に提供いたしません。</p>
                <ul style={{ paddingLeft: 20, lineHeight: 2 }}>
                  <li>ご本人の同意がある場合</li>
                  <li>法令に基づく場合</li>
                  <li>人の生命、身体又は財産の保護のために必要がある場合であって、本人の同意を得ることが困難であるとき</li>
                  <li>公衆衛生の向上又は児童の健全な育成の推進のために特に必要がある場合であって本人の同意を得ることが困難であるとき</li>
                  <li>国の機関若しくは地方公共団体又はその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、本人の同意を得ることによって当該事務の遂行に支障を及ぼすおそれがあるとき</li>
                </ul>
              </>
            ),
          },
          {
            num: '5', title: '個人情報取扱いの委託',
            content: (
              <p>当社は、事業運営上、お客様により良いサービスを提供するために業務の一部を外部に委託しています。業務委託先に対しては、個人情報を預けることがあります。この場合、個人情報を適切に取り扱っていると認められる委託先を選定し、契約等において個人情報の適正管理・機密保持などによりお客様の個人情報の漏洩防止に必要な事項を取決め、適切な管理を実施させます。</p>
            ),
          },
          {
            num: '6', title: '個人情報の開示等の請求',
            content: (
              <p>
                お客様が当社に対してご自身の個人情報の開示等（利用目的の通知、開示、内容の訂正・追加・削除、利用の停止または消去、第三者への提供の停止）に関して申し出ることができます。その際、当社はご本人を確認させていただいたうえで、合理的な期間内に対応いたします。<br /><br />
                〒108-0075<br />
                東京都港区港南2-16-5 NBF品川タワー6F<br />
                BIRD INITIATIVE 株式会社 個人情報相談窓口
              </p>
            ),
          },
          {
            num: '7', title: '個人情報を提供されることの任意性について',
            content: (
              <p>お客様が当社に個人情報を提供されるかどうかは、お客様の任意によるものです。ただし、必要な項目をいただけない場合、各サービス等が適切な状態で提供できない場合があります。</p>
            ),
          },
          {
            num: '8', title: '本Webサイトへアクセスしたことを契機として機械的に取得される情報',
            content: (
              <p>当社は、閲覧されたWebサイトのセキュリティ確保・ユーザーサービス向上のため、Cookieにより閲覧された方の情報を取得することがあります。</p>
            ),
          },
        ].map((section) => (
          <section key={section.num} style={{ marginBottom: 40 }}>
            <h2 style={{
              fontSize: 16, fontWeight: 700, color: '#1A1A1A',
              paddingBottom: 10, borderBottom: '2px solid #F2E0DE',
              marginBottom: 16,
            }}>
              {section.num}. {section.title}
            </h2>
            <div style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 1.9 }}>
              {section.content}
            </div>
          </section>
        ))}

        <p style={{ fontSize: 13, color: '#9B9B9B', textAlign: 'right', marginTop: 40 }}>以上</p>
      </main>

      {/* フッター */}
      <footer style={{ borderTop: '1px solid #EDE9E6', padding: '20px 32px', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: '#ABABAB' }}>© 2026 BIRD INITIATIVE 株式会社 All rights reserved.</p>
      </footer>
    </div>
  )
}
