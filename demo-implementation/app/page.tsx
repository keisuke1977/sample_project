import Image from 'next/image'
import { BarChart3, BookOpen, Heart, Lock, MessageCircle, Shield, Sparkles, Users } from 'lucide-react'
import { LandingFooter } from '@/components/landing/LandingFooter'

const FAQ_ITEMS = [
  { q: 'Femcare とは何ですか？', a: '企業向けの女性健康管理 Web サービスです。従業員向けのチェックイン・相談機能と、人事向けの匿名集計ダッシュボードを提供します。' },
  { q: '個人の体調データは会社に見えますか？', a: 'いいえ。個人の記録・相談内容は企業管理者から閲覧できません。匿名化された集計データのみが共有されます。' },
  { q: 'どのように利用を開始しますか？', a: '企業が契約後、従業員に招待コードを配布します。従業員はブラウザからログインして利用を開始できます。' },
  { q: '医療行為は行われますか？', a: '本サービスは医療行為ではありません。診断・処方は行いません。必要に応じて受診を促す情報提供にとどまります。' },
] as const

export default function LandingPage() {
  return (
    <div style={{ backgroundColor: '#ffffff', color: '#1A1A1A' }}>

      {/* ── HERO ── 日本人女性・働く写真 + コンセプト文 */}
      <section>
        <div style={{
          position: 'relative',
          width: '100%',
          height: '88vh',
          minHeight: '580px',
          overflow: 'hidden',
          backgroundImage: 'url(https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1920&h=1080&q=85)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 25%',
        }}>
          {/* 下から上に暗くなるグラデーション */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(5,3,2,0.93) 0%, rgba(5,3,2,0.62) 38%, rgba(5,3,2,0.22) 65%, transparent 100%)',
          }} />
          {/* テキスト：画像の下部に確実に重ねる */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 32px 72px' }}>
            <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
              <p style={{ fontSize: '11px', letterSpacing: '0.22em', color: 'rgba(255,255,255,0.5)', marginBottom: '18px' }}>
                企業向け女性健康管理 Web サービス
              </p>
              <h1 className="font-display" style={{ fontSize: 'clamp(28px, 4.2vw, 52px)', fontWeight: 500, lineHeight: 1.45, color: '#fff', maxWidth: '680px', marginBottom: '24px' }}>
                毎日1分の体調チェックで<br />女性従業員の健康を支える
              </h1>
              <p style={{ fontSize: '15px', lineHeight: 2.1, color: 'rgba(255,255,255,0.82)', maxWidth: '560px', marginBottom: '36px' }}>
                職場で抱えがちな月経・PMS・更年期の不調を、<br />
                ひとりで我慢させない。<br />
                「気づき → 学び → 相談」の3ステップで、<br />
                働く女性が健康を守れる環境をつくります。
              </p>
              <a href="#service" style={{ display: 'inline-block', fontSize: '13px', letterSpacing: '0.06em', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.5)', paddingBottom: '3px', textDecoration: 'none' }}>
                サービスを見る
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICE ── 画像＋テキスト、左右交互 */}
      <section id="service" style={{ padding: '100px 32px', backgroundColor: '#FAF8F5' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
          <h2 className="font-display" style={{ fontSize: '34px', fontWeight: 500, marginBottom: '12px' }}>サービス</h2>
          <p style={{ fontSize: '15px', lineHeight: 1.9, color: '#6B6B6B', maxWidth: '520px', marginBottom: '72px' }}>
            従業員と管理者、それぞれに最適化した2つの機能をブラウザからご利用いただけます。
          </p>

          {/* 01 従業員向け */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center', marginBottom: '80px', paddingBottom: '80px', borderBottom: '1px solid #EDE9E6' }}>
            <div style={{ position: 'relative', height: '420px', borderRadius: '16px', overflow: 'hidden' }}>
              <Image
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&h=700&fit=crop&q=85"
                alt="従業員の健康チェックイン"
                fill
                unoptimized
                sizes="50vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#9B87B5', marginBottom: '20px' }}>01 — 従業員向け Web サービス</p>
              <h3 className="font-display" style={{ fontSize: '26px', fontWeight: 500, lineHeight: 1.5, marginBottom: '20px' }}>
                毎日1分のチェックインと<br />パーソナライズされたケア
              </h3>
              <p style={{ fontSize: '15px', lineHeight: 2.1, color: '#6B6B6B', marginBottom: '28px' }}>
                招待された従業員がブラウザからログインして利用。タップ式チェックイン、「今日の気づき」、専門家監修コンテンツ、看護師・助産師・産婦人科医へのオンライン相談まで、ひとつのプラットフォームで提供します。
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  'タップ式チェックイン（約1分）で毎日の体調を記録',
                  'AIが体調パターンを解析し「今日の気づき」を表示',
                  '看護師・助産師・産婦人科医へのオンライン相談',
                  'ライフステージ別の専門家監修コンテンツ',
                ].map((t) => (
                  <li key={t} style={{ display: 'flex', gap: '12px', fontSize: '14px', color: '#4A4A4A', lineHeight: 1.7 }}>
                    <span style={{ color: '#C97A72', flexShrink: 0, marginTop: '3px' }}>—</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 02 管理者向け */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#9B87B5', marginBottom: '20px' }}>02 — 管理者向けダッシュボード</p>
              <h3 className="font-display" style={{ fontSize: '26px', fontWeight: 500, lineHeight: 1.5, marginBottom: '20px' }}>
                匿名集計データによる<br />健康経営の支援
              </h3>
              <p style={{ fontSize: '15px', lineHeight: 2.1, color: '#6B6B6B', marginBottom: '28px' }}>
                個人を特定せず、部署別・年代別の体調傾向をリアルタイムで可視化。健康経営優良法人認定に必要なレポートを自動生成し、人事担当者の工数を大幅に削減します。
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  'リアルタイム KPI ダッシュボード（匿名集計）',
                  '部署別・年代別の体調傾向グラフ',
                  '健康経営優良法人認定向けレポート PDF 自動出力',
                  '従業員の招待・利用状況の一元管理',
                ].map((t) => (
                  <li key={t} style={{ display: 'flex', gap: '12px', fontSize: '14px', color: '#4A4A4A', lineHeight: 1.7 }}>
                    <span style={{ color: '#9B87B5', flexShrink: 0, marginTop: '3px' }}>—</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ position: 'relative', height: '420px', borderRadius: '16px', overflow: 'hidden' }}>
              <Image
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&h=700&fit=crop&q=85"
                alt="健康経営ダッシュボード"
                fill
                unoptimized
                sizes="50vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 3 STEPS ── 画像カード付き */}
      <section style={{ padding: '100px 32px', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
          <h2 className="font-display" style={{ fontSize: '34px', fontWeight: 500, marginBottom: '12px' }}>3ステップでサポート</h2>
          <p style={{ fontSize: '15px', lineHeight: 1.9, color: '#6B6B6B', marginBottom: '56px' }}>
            気づき → 学び → 相談。その流れが、女性の健康を継続的に守ります。
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px' }}>
            {[
              {
                step: '01', icon: Sparkles, color: '#C97A72', accent: '#F2E0DE',
                title: '気づく',
                desc: '毎朝1分のチェックインで体調を記録。AIが体調パターンを分析し、その日に合った「気づき」メッセージを届けます。',
                img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=700&h=480&fit=crop&q=85',
                imgAlt: 'ウェルネス・体調チェック',
              },
              {
                step: '02', icon: BookOpen, color: '#9B87B5', accent: '#EDE8F5',
                title: '学ぶ',
                desc: '産婦人科医・看護師が監修したコンテンツで、ライフステージに合った正しい知識を身につけられます。',
                img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&h=480&fit=crop&q=85',
                imgAlt: '学習・コンテンツ',
              },
              {
                step: '03', icon: MessageCircle, color: '#4A7C6F', accent: '#DCF0EB',
                title: '相談する・繋がる',
                desc: '専門家への相談はもちろん、同じ悩みを持つ女性同士がコミュニティで繋がり、経験や気持ちを匿名で共有できます。',
                img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=700&h=480&fit=crop&q=85',
                imgAlt: 'オンライン相談・コミュニティ',
              },
            ].map(({ step, icon: Icon, color, accent, title, desc, img, imgAlt }) => (
              <article key={title} style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #EDE9E6', backgroundColor: '#fff' }}>
                <div style={{ position: 'relative', height: '220px' }}>
                  <Image src={img} alt={imgAlt} fill unoptimized sizes="33vw" style={{ objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)' }} />
                  <div style={{ position: 'absolute', bottom: '16px', left: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '34px', height: '34px', borderRadius: '8px', backgroundColor: accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon style={{ width: '16px', height: '16px', color }} strokeWidth={1.5} />
                    </div>
                    <span style={{ fontSize: '11px', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.8)' }}>{step}</span>
                  </div>
                </div>
                <div style={{ padding: '28px 28px 32px' }}>
                  <h3 className="font-display" style={{ fontSize: '20px', fontWeight: 500, marginBottom: '12px', color }}>{title}</h3>
                  <p style={{ fontSize: '14px', lineHeight: 1.9, color: '#6B6B6B' }}>{desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR BUSINESS ── */}
      <section id="for-business" style={{ padding: '100px 32px', backgroundColor: '#FAF8F5' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
          <h2 className="font-display" style={{ fontSize: '34px', fontWeight: 500, marginBottom: '12px' }}>企業・団体等の皆さまへ</h2>
          <p style={{ fontSize: '15px', lineHeight: 1.9, color: '#6B6B6B', maxWidth: '560px', marginBottom: '56px' }}>
            女性従業員の活躍推進・健康経営に取り組む企業向けにご提供しています。
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            {[
              { icon: BarChart3, color: '#C97A72', bg: '#F2E0DE', title: '健康傾向の可視化', desc: '部署別・年代別の匿名集計でトレンドをリアルタイムに把握できます。' },
              { icon: Shield, color: '#9B87B5', bg: '#EDE8F5', title: 'レポート自動生成', desc: '健康経営優良法人認定に必要なデータをPDFで自動出力します。' },
              { icon: Users, color: '#4A7C6F', bg: '#DCF0EB', title: '従業員管理', desc: '招待コードの配布から利用状況の確認まで、管理画面で一元管理。' },
              { icon: Lock, color: '#C97A72', bg: '#F2E0DE', title: 'プライバシー保護', desc: '個人の体調記録・相談内容は企業管理者から完全に非公開です。' },
            ].map(({ icon: Icon, color, bg, title, desc }) => (
              <div key={title} style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '32px 28px', border: '1px solid #EDE9E6' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <Icon style={{ width: '20px', height: '20px', color }} strokeWidth={1.5} />
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '10px' }}>{title}</h3>
                <p style={{ fontSize: '13px', lineHeight: 1.85, color: '#6B6B6B' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ padding: '100px 32px', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h2 className="font-display" style={{ fontSize: '34px', fontWeight: 500, marginBottom: '56px' }}>よくあるご質問</h2>
          <dl>
            {FAQ_ITEMS.map(({ q, a }, i) => (
              <div key={q} style={{ padding: '28px 0', borderTop: '1px solid #EDE9E6', borderBottom: i === FAQ_ITEMS.length - 1 ? '1px solid #EDE9E6' : 'none' }}>
                <dt style={{ fontSize: '16px', fontWeight: 600, color: '#1A1A1A', marginBottom: '12px', lineHeight: 1.6 }}>{q}</dt>
                <dd style={{ fontSize: '14px', lineHeight: 2, color: '#6B6B6B', margin: 0 }}>{a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <LandingFooter />
    </div>
  )
}
