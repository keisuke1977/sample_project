import { BarChart3, MessageCircle, TrendingUp, Users } from 'lucide-react'

export function AdminScreenPreview() {
  return (
    <div className="rounded-xl overflow-hidden border border-[#EDE9E6] bg-white shadow-sm">
      <div className="px-4 py-2.5 bg-[#FAF8F5] border-b border-[#EDE9E6]">
        <p className="text-[10px] font-semibold text-[#9B87B5]">管理者ダッシュボード · 匿名集計</p>
      </div>
      <div className="p-4 grid grid-cols-2 gap-2">
        {[
          { icon: Users, label: 'MAU', value: '62%', color: '#C97A72', bg: '#F2E0DE' },
          { icon: MessageCircle, label: '相談率', value: '18%', color: '#4A7C6F', bg: '#DCF0EB' },
          { icon: TrendingUp, label: '平均気分', value: '3.8', color: '#9B87B5', bg: '#EDE8F5' },
          { icon: BarChart3, label: 'チェックイン', value: '74%', color: '#C97A72', bg: '#F2E0DE' },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="rounded-lg border border-[#EDE9E6] p-2.5">
            <div
              className="w-5 h-5 rounded flex items-center justify-center mb-1"
              style={{ backgroundColor: bg, color }}
            >
              <Icon className="w-2.5 h-2.5" />
            </div>
            <p className="text-[9px] text-[#9B9B9B]">{label}</p>
            <p className="text-[12px] font-bold text-[#2D2D2D]">{value}</p>
          </div>
        ))}
      </div>
      <div className="px-4 pb-4">
        <div className="h-14 rounded-lg bg-[#FAF8F5] border border-[#EDE9E6] flex items-end gap-1 px-2 pb-2">
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
  )
}
