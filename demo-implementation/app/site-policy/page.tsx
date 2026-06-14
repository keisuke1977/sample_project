import Link from 'next/link'

export default function SitePolicyPage() {
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
          サイトポリシー
        </h1>
        <p style={{ fontSize: 14, lineHeight: 1.9, color: '#4A4A4A', marginBottom: 48 }}>
          本ホームページは、BIRD INITIATIVE 株式会社（以下、当社）により開設・運営されています。
          本ホームページのご利用に先立ち、以下のサイトポリシーをご熟読いただきたくお願い申しあげます。
          なお、ご利用を開始されました後は、以下のご利用条件および関連する全ての法律を遵守いただくことに同意されたものといたします。
        </p>

        {[
          {
            num: '1', title: '著作権について',
            content: '本ホームページの内容は、全て当社が所有・管理しており、著作権法で保護されております。非商業的目的のための個人的利用に限り複製（ダウンロードを含む）を認めますが、内容に変更を加えたり、更なる複製を行うことは禁じます。それ以外の目的および手段での複製および利用についても禁じます。',
          },
          {
            num: '2', title: '商標・商号等について',
            content: '本ホームページ上の商標、サービスマーク、商号等の権利は法的に保護されています。これらを承諾なく使用してはなりません。',
          },
          {
            num: '3', title: '内容について',
            content: '本ホームページには、サービスについての情報が含まれています。本ホームページで提供する情報は、医師等の医療従事者が行うべきアドバイスやサービスを提供するものではありませんし、決してその代わりになるものでもありません。',
          },
          {
            num: '4', title: 'サービス・コンテンツについて',
            content: '当社は、本ホームページに正確な情報を掲載する細心の注意を払っていますが、その内容の正確性・有用性・完全性およびコンピュータ・ウィルス感染等の危険がないこと等のいずれについても、保証するものではありません。また当社は、本ホームページないしは本ホームページに掲載された情報を利用されたこと、または利用できなかったことによって生じるいかなる損害についても責任を負うものではありません。',
          },
          {
            num: '5', title: '内容の変更・サービス停止について',
            content: '当社は、予告なしに本ホームページに掲載する情報の内容を変更したり、ホームページを閉鎖させていただくことがあります。',
          },
          {
            num: '6', title: 'リンクについて',
            content: '当社は、本ホームページからリンクしている第三者のホームページの内容、または本ホームページへリンクを設けている第三者のホームページの内容について、一切の責任を負いません。',
          },
          {
            num: '7', title: 'Googleアナリティクス利用について',
            content: '当社のホームページでは、サイトの利用状況を把握するためにGoogle Analyticsを利用しております。Google Analyticsは、クッキーを利用して利用者の情報を収集しておりますが、お名前、ご住所、電話番号、メールアドレス等の個人を特定可能な情報を取得することは一切ございません。',
          },
          {
            num: '8', title: '電子メールによる情報について',
            content: '電子メール等の手段で当社に提供された情報・資料は、ご利用者の個人情報以外は、機密の取り扱いが義務づけられていません。当社は提供された情報・資料について複製・掲示・情報開示等いかなる目的にも自由に利用することができるものとします。また、電子メール等の手段でお送りいただいた情報等に対しては、当社は返答する義務を負いません。',
          },
          {
            num: '9', title: '準拠法',
            content: '本サイトポリシーは、日本法を準拠法として、それに基づいて解釈されるものとします。本サイトポリシーに関して生ずる紛争については、東京地方裁判所を第一審の専属的管轄裁判所とするものとします。',
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
            <p style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 1.9 }}>
              {section.content}
            </p>
          </section>
        ))}

        {/* ご利用上の注意 */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{
            fontSize: 16, fontWeight: 700, color: '#1A1A1A',
            paddingBottom: 10, borderBottom: '2px solid #F2E0DE',
            marginBottom: 16,
          }}>
            ご利用上の注意
          </h2>
          <div style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 1.9 }}>
            <p style={{ marginBottom: 16 }}>
              本サービスの内容は正確な情報の提供に努めておりますが、掲載情報の正確性・完全性について保証するものではありません。
            </p>
            <p style={{ marginBottom: 16 }}>
              本サービスで提供するコンテンツは、一般的な健康情報の提供を目的としており、医療行為、診断、処方を行うものではありません。体調に関するお悩みは、医療機関にてご相談ください。
            </p>
            <p>
              本サービスの利用に際して生じたいかなる損害についても、当社は責任を負いません。
            </p>
          </div>
        </section>

        <div style={{
          padding: '20px 24px', borderRadius: 12,
          backgroundColor: 'white', border: '1px solid #EDE9E6',
          marginTop: 48,
        }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#4A4A4A', marginBottom: 8 }}>運営会社</p>
          <p style={{ fontSize: 13, color: '#6B6B6B', lineHeight: 1.9 }}>
            BIRD INITIATIVE 株式会社<br />
            東京都港区港南2-16-5 NBF品川タワー6F
          </p>
        </div>

        <p style={{ fontSize: 13, color: '#9B9B9B', textAlign: 'right', marginTop: 40 }}>以上</p>
      </main>

      {/* フッター */}
      <footer style={{ borderTop: '1px solid #EDE9E6', padding: '20px 32px', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: '#ABABAB' }}>© 2026 BIRD INITIATIVE 株式会社 All rights reserved.</p>
      </footer>
    </div>
  )
}
