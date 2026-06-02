import Link from 'next/link'
import { Heart, BarChart3, MessageCircle, Shield, CheckCircle, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* ヘッダー */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              Femcare
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/employee/home"
              className="text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              従業員デモ
            </Link>
            <Link
              href="/admin/dashboard"
              className="text-sm font-medium px-4 py-2 rounded-lg text-white transition-colors"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              管理者デモ
            </Link>
          </div>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8"
            style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
          >
            <Shield className="w-4 h-4" />
            企業向け女性健康管理プラットフォーム
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
            style={{ color: 'var(--color-text-primary)' }}
          >
            毎日1分の体調チェックが、
            <br />
            <span style={{ color: 'var(--color-primary)' }}>女性の健康</span>を変える
          </h1>
          <p className="text-lg mb-10 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            「気づき→学び→相談」の3ステップで、忙しい女性従業員の体調変化を早期に発見。
            <br className="hidden md:block" />
            看護師・産婦人科医への相談と、企業向け健康経営レポートを一体提供します。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/employee/home"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-medium text-base transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              従業員アプリを体験する
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-medium text-base border-2 transition-all hover:opacity-80"
              style={{
                borderColor: 'var(--color-primary)',
                color: 'var(--color-primary)',
                backgroundColor: 'var(--color-surface)',
              }}
            >
              管理ダッシュボードを見る
            </Link>
          </div>
        </div>
      </section>

      {/* 3ステップ説明 */}
      <section className="py-16 px-4" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-2xl font-bold text-center mb-12"
            style={{ color: 'var(--color-text-primary)' }}
          >
            3ステップでサポート
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: <CheckCircle className="w-8 h-8" />,
                title: '気づく',
                desc: '毎朝1分のタップ式チェックインで体調を記録。AIが「今日の気づき」をパーソナライズして提供。',
                color: 'var(--color-primary)',
                bg: 'var(--color-primary-light)',
              },
              {
                step: '02',
                icon: <Heart className="w-8 h-8" />,
                title: '学ぶ',
                desc: '月経・PMS・更年期・妊活など、ライフステージに合った専門家監修コンテンツを提供。',
                color: 'var(--color-accent)',
                bg: 'var(--color-accent-light)',
              },
              {
                step: '03',
                icon: <MessageCircle className="w-8 h-8" />,
                title: '相談する',
                desc: '看護師・助産師へのチャット相談と、産婦人科医へのオンライン相談で安心をサポート。',
                color: '#7B68B5',
                bg: '#F0EEF8',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-2xl p-6 text-center"
                style={{ backgroundColor: item.bg }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: item.color, color: 'white' }}
                >
                  {item.icon}
                </div>
                <div
                  className="text-xs font-bold mb-2 tracking-widest"
                  style={{ color: item.color }}
                >
                  STEP {item.step}
                </div>
                <h3
                  className="text-xl font-bold mb-3"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 企業向け価値提案 */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-2xl font-bold text-center mb-12"
            style={{ color: 'var(--color-text-primary)' }}
          >
            企業・人事担当者の課題を解決
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: '女性従業員の健康傾向を可視化',
                desc: '部署別・年代別の体調傾向を匿名集計ダッシュボードで把握。個人を特定せずに職場の健康課題を発見できます。',
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: '健康経営レポートを自動生成',
                desc: '健康経営優良法人認定の申請に必要なデータを一括出力。月次レポートも自動生成で人事工数を大幅削減。',
              },
              {
                icon: <CheckCircle className="w-6 h-6" />,
                title: '継続率の高いツール',
                desc: 'MAU 60%以上を目標とした使いやすいUX設計。従業員が続けやすい「1分チェックイン」が習慣化の鍵。',
              },
              {
                icon: <Heart className="w-6 h-6" />,
                title: '完全な匿名性でプライバシーを保護',
                desc: '個人の体調データは企業側から絶対に特定できない設計。5名未満のグループデータは非表示にします。',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-xl p-6 border card-hover"
                style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
                >
                  {item.icon}
                </div>
                <h3
                  className="font-bold mb-2"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA セクション */}
      <section
        className="py-20 px-4 text-center"
        style={{ backgroundColor: 'var(--color-primary-light)' }}
      >
        <div className="max-w-2xl mx-auto">
          <h2
            className="text-3xl font-bold mb-4"
            style={{ color: 'var(--color-text-primary)' }}
          >
            まずはデモをお試しください
          </h2>
          <p className="mb-8" style={{ color: 'var(--color-text-secondary)' }}>
            従業員向けアプリと管理ダッシュボードの両方をデモ環境でご体験いただけます。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/employee/home"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-medium text-base transition-all hover:opacity-90"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <Heart className="w-5 h-5" />
              従業員アプリ
            </Link>
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-medium text-base border-2 transition-all hover:opacity-80"
              style={{
                borderColor: 'var(--color-primary)',
                color: 'var(--color-primary)',
                backgroundColor: 'white',
              }}
            >
              <BarChart3 className="w-5 h-5" />
              管理ダッシュボード
            </Link>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer
        className="py-8 px-4 text-center text-sm border-t"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
          color: 'var(--color-text-secondary)',
        }}
      >
        <p>© 2026 Femcare. All rights reserved.</p>
        <p className="mt-1 text-xs">
          このサービスは医療行為ではありません。診断・処方は行いません。
        </p>
      </footer>
    </div>
  )
}
