import type { CommunityCategory } from '@/lib/supabase/types'

export const COMMUNITY_CATEGORIES: {
  value: CommunityCategory
  label: string
  emoji: string
  color: string
}[] = [
  { value: 'menstruation',  label: '生理・月経',     emoji: '🌸', color: '#F9A8D4' },
  { value: 'pregnancy',     label: '妊活・妊娠',     emoji: '🤰', color: '#FCD34D' },
  { value: 'menopause',     label: '更年期',         emoji: '🌿', color: '#6EE7B7' },
  { value: 'work_life',     label: '仕事と育児',     emoji: '👶', color: '#93C5FD' },
  { value: 'mental_health', label: 'メンタルヘルス', emoji: '💭', color: '#C4B5FD' },
  { value: 'career',        label: 'キャリア',       emoji: '💼', color: '#FCA5A5' },
  { value: 'other',         label: 'その他',         emoji: '💬', color: '#D1D5DB' },
]
