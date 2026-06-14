import {
  BarChart3, BookOpen, Heart, Home, MessageCircle, Sparkles,
} from 'lucide-react'

const NAV = [
  { icon: Home, label: 'ホーム', active: true },
  { icon: BookOpen, label: 'コンテンツ', active: false },
  { icon: MessageCircle, label: '相談', active: false },
  { icon: BarChart3, label: '記録', active: false },
] as const

export function EmployeeScreenPreview() {
  return (
    <div className="rounded-xl overflow-hidden border border-[#EDE9E6] bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#EDE9E6]">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #C97A72, #D4958D)' }}
          >
            <Heart className="w-3 h-3 text-white" fill="white" />
          </div>
          <span className="text-[12px] font-bold text-[#2D2D2D]">Femcare</span>
        </div>
        <div className="hidden sm:flex items-center gap-1">
          {NAV.map(({ icon: Icon, label, active }) => (
            <span
              key={label}
              className="px-2 py-1 rounded-md text-[10px] font-medium"
              style={{
                backgroundColor: active ? '#F2E0DE' : 'transparent',
                color: active ? '#C97A72' : '#9B9B9B',
              }}
            >
              <Icon className="w-3 h-3 inline mr-0.5" />
              {label}
            </span>
          ))}
        </div>
      </div>
      <div className="bg-[#FAF8F5] p-4 space-y-3">
        <div
          className="rounded-lg p-3"
          style={{ backgroundColor: '#F2E0DE', borderLeft: '3px solid #C97A72' }}
        >
          <div className="flex items-center gap-1 mb-1">
            <Sparkles className="w-3 h-3 text-[#C97A72]" />
            <span className="text-[10px] font-bold text-[#C97A72]">今日の気づき</span>
          </div>
          <p className="text-[11px] text-[#2D2D2D] leading-relaxed">
            チェックイン後、体調に合わせたメッセージが表示されます。
          </p>
        </div>
        <div
          className="rounded-lg py-2.5 text-[11px] font-semibold text-white text-center"
          style={{ background: 'linear-gradient(135deg, #C97A72, #D4958D)' }}
        >
          今日の体調を記録する（約1分）
        </div>
      </div>
    </div>
  )
}
