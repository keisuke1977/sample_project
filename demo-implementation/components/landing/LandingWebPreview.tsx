import {
  BarChart3, Bell, BookOpen, Download, Heart, Home,
  MessageCircle, Sparkles, TrendingUp, Users,
} from 'lucide-react'

type Variant = 'employee' | 'admin'

export function LandingWebPreview({ variant }: { variant: Variant }) {
  if (variant === 'admin') {
    return (
      <div className="rounded-xl overflow-hidden bg-white border border-[#EDE9E6] shadow-[0_20px_60px_rgba(45,45,45,0.08)]">
        <div className="px-6 py-4 border-b border-[#EDE9E6] flex items-center justify-between bg-white">
          <div>
            <p className="text-[15px] font-semibold text-[#2D2D2D]">ダッシュボード</p>
            <p className="text-[12px] text-[#9B9B9B] mt-0.5">2026年6月 · 匿名集計</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#EDE9E6] text-[12px] text-[#6B6B6B]">
            <Download className="w-3.5 h-3.5" />
            CSV
          </div>
        </div>
        <div className="px-6 py-3 bg-[#F0F7F4] border-b border-[#C8E6DA] text-[12px] text-[#6B6B6B]">
          表示データはすべて匿名集計です。個人を特定することはできません。
        </div>
        <div className="p-6 grid grid-cols-2 gap-4">
          {[
            { icon: Users, label: '月間アクティブ率', value: '62%', sub: '目標 60%', color: '#C97A72', bg: '#F2E0DE' },
            { icon: MessageCircle, label: '相談利用率', value: '18%', sub: '前月比 +3%', color: '#4A7C6F', bg: '#DCF0EB' },
            { icon: TrendingUp, label: '平均気分', value: '3.8', sub: '5段階評価', color: '#9B87B5', bg: '#EDE8F5' },
            { icon: BarChart3, label: 'チェックイン率', value: '74%', sub: '週次', color: '#C97A72', bg: '#F2E0DE' },
          ].map(({ icon: Icon, label, value, sub, color, bg }) => (
            <div key={label} className="rounded-lg border border-[#EDE9E6] p-4">
              <div className="flex items-start justify-between mb-3">
                <p className="text-[12px] text-[#9B9B9B]">{label}</p>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: bg, color }}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-[22px] font-bold text-[#2D2D2D]">{value}</p>
              <p className="text-[11px] text-[#9B9B9B] mt-1">{sub}</p>
            </div>
          ))}
        </div>
        <div className="px-6 pb-6">
          <p className="text-[12px] text-[#9B9B9B] mb-3">体調スコア推移（匿名）</p>
          <div className="h-24 rounded-lg bg-[#FAF8F5] border border-[#EDE9E6] flex items-end gap-1.5 px-4 pb-3">
            {[38, 52, 45, 58, 50, 62, 55, 68, 60].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-sm"
                style={{ height: `${h}%`, backgroundColor: i >= 7 ? '#C97A72' : '#F2E0DE' }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const NAV = [
    { icon: Home, label: 'ホーム', active: true },
    { icon: BookOpen, label: 'コンテンツ', active: false },
    { icon: MessageCircle, label: '相談', active: false },
    { icon: BarChart3, label: '記録', active: false },
  ]

  return (
    <div className="rounded-xl overflow-hidden bg-white border border-[#EDE9E6] shadow-[0_20px_60px_rgba(45,45,45,0.08)]">
      <div className="px-6 py-3.5 border-b border-[#EDE9E6] flex items-center justify-between bg-white">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #C97A72, #D4958D)' }}
            >
              <Heart className="w-4 h-4 text-white" fill="white" />
            </div>
            <span className="text-[15px] font-bold text-[#2D2D2D]">Femcare</span>
          </div>
          <nav className="hidden sm:flex items-center gap-1">
            {NAV.map(({ icon: Icon, label, active }) => (
              <span
                key={label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium"
                style={{
                  backgroundColor: active ? '#F2E0DE' : 'transparent',
                  color: active ? '#C97A72' : '#9B9B9B',
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </span>
            ))}
          </nav>
        </div>
        <Bell className="w-4 h-4 text-[#9B9B9B]" />
      </div>

      <div className="bg-[#FAF8F5] p-6">
        <p className="text-[13px] text-[#9B9B9B] mb-5">6月14日（日）</p>
        <div className="grid sm:grid-cols-5 gap-4">
          <div className="sm:col-span-3 space-y-4">
            <div
              className="rounded-xl p-5"
              style={{ backgroundColor: '#F2E0DE', borderLeft: '4px solid #C97A72' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-[#C97A72]" />
                <span className="text-[13px] font-bold text-[#C97A72]">今日の気づき</span>
              </div>
              <p className="text-[14px] leading-relaxed text-[#2D2D2D]">
                チェックイン後、体調に合わせたメッセージが表示されます。
              </p>
            </div>
            <div
              className="rounded-xl py-3.5 text-[14px] font-semibold text-white text-center"
              style={{ background: 'linear-gradient(135deg, #C97A72, #D4958D)' }}
            >
              今日の体調を記録する（約1分）
            </div>
          </div>
          <div className="sm:col-span-2 space-y-3">
            {['PMSのセルフケア', '睡眠の質を上げる'].map((title) => (
              <div key={title} className="rounded-lg bg-white border border-[#EDE9E6] p-4">
                <p className="text-[11px] font-semibold text-[#9B87B5] mb-1">おすすめコンテンツ</p>
                <p className="text-[13px] font-medium text-[#2D2D2D]">{title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
