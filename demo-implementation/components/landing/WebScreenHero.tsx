import {
  BarChart3, BookOpen, Heart, Home, LogIn, MessageCircle,
  Sparkles, TrendingUp, Users,
} from 'lucide-react'

const NAV = [
  { icon: Home, label: 'ホーム', active: true },
  { icon: BookOpen, label: 'コンテンツ', active: false },
  { icon: MessageCircle, label: '相談', active: false },
  { icon: BarChart3, label: '記録', active: false },
] as const

/** ランディング用：ログイン前の Web アプリ画面イメージ（個人名なし） */
export function WebScreenHero() {
  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden"
      style={{
        boxShadow: '0 24px 64px rgba(45, 45, 45, 0.12), 0 0 0 1px rgba(237, 233, 230, 0.9)',
      }}
    >
      {/* ── 従業員 Web 画面 ── */}
      <div className="bg-white">
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#EDE9E6]">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #C97A72, #D4958D)' }}
              >
                <Heart className="w-3.5 h-3.5 text-white" fill="white" />
              </div>
              <span className="text-[13px] font-bold text-[#2D2D2D]">Femcare</span>
            </div>
            <div className="hidden sm:flex items-center gap-1">
              {NAV.map(({ icon: Icon, label, active }) => (
                <span
                  key={label}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium"
                  style={{
                    backgroundColor: active ? '#F2E0DE' : 'transparent',
                    color: active ? '#C97A72' : '#9B9B9B',
                  }}
                >
                  <Icon className="w-3 h-3" />
                  {label}
                </span>
              ))}
            </div>
          </div>
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium text-[#9B9B9B] bg-[#FAF8F5] border border-[#EDE9E6]"
            aria-hidden
          >
            <LogIn className="w-3 h-3" />
            ログイン
          </div>
        </div>

        <div className="bg-[#FAF8F5] p-5">
          <p className="text-[11px] text-[#9B9B9B] mb-4">従業員ポータル · ホーム</p>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            <div className="sm:col-span-3 space-y-3">
              <div
                className="rounded-xl p-4"
                style={{ backgroundColor: '#F2E0DE', borderLeft: '3px solid #C97A72' }}
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#C97A72]" />
                  <span className="text-[10px] font-bold text-[#C97A72]">今日の気づき</span>
                </div>
                <p className="text-[12px] leading-relaxed text-[#2D2D2D]">
                  チェックイン後、体調に合わせたメッセージが表示されます。
                </p>
              </div>
              <div
                className="rounded-xl px-4 py-3 text-[12px] font-semibold text-white text-center"
                style={{ background: 'linear-gradient(135deg, #C97A72, #D4958D)' }}
              >
                今日の体調を記録する（約1分）
              </div>
            </div>
            <div className="sm:col-span-2 space-y-2">
              {['PMSのセルフケア', '睡眠の質を上げる'].map((title) => (
                <div key={title} className="rounded-lg bg-white border border-[#EDE9E6] p-3">
                  <p className="text-[10px] text-[#9B87B5] font-semibold mb-1">コンテンツ</p>
                  <p className="text-[11px] font-medium text-[#2D2D2D]">{title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 管理ダッシュボード（下部に接続） ── */}
      <div className="border-t border-[#EDE9E6] bg-white">
        <div className="px-5 py-2.5 bg-[#FAF8F5] border-b border-[#EDE9E6]">
          <p className="text-[10px] font-semibold text-[#9B87B5]">管理者ダッシュボード · 匿名集計</p>
        </div>
        <div className="p-4 grid grid-cols-4 gap-2">
          {[
            { icon: Users, label: 'MAU', value: '62%', color: '#C97A72', bg: '#F2E0DE' },
            { icon: MessageCircle, label: '相談率', value: '18%', color: '#4A7C6F', bg: '#DCF0EB' },
            { icon: TrendingUp, label: '気分', value: '3.8', color: '#9B87B5', bg: '#EDE8F5' },
            { icon: BarChart3, label: 'チェックイン', value: '74%', color: '#C97A72', bg: '#F2E0DE' },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} className="rounded-lg border border-[#EDE9E6] p-2.5 bg-white">
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center mb-1.5"
                style={{ backgroundColor: bg, color }}
              >
                <Icon className="w-3 h-3" />
              </div>
              <p className="text-[9px] text-[#9B9B9B]">{label}</p>
              <p className="text-[13px] font-bold text-[#2D2D2D]">{value}</p>
            </div>
          ))}
        </div>
        <div className="px-4 pb-4">
          <div className="h-16 rounded-lg bg-[#FAF8F5] border border-[#EDE9E6] flex items-end gap-1 px-3 pb-2">
            {[40, 55, 45, 60, 50, 65, 58].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t"
                style={{ height: `${h}%`, backgroundColor: i === 6 ? '#C97A72' : '#F2E0DE' }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
