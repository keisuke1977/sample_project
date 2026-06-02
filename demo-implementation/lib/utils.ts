import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, locale = 'ja-JP') {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatTime(date: string | Date) {
  return new Date(date).toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getScoreLabel(score: number): string {
  const labels: Record<number, string> = {
    1: '非常に悪い',
    2: 'やや悪い',
    3: '普通',
    4: 'やや良い',
    5: '非常に良い',
  }
  return labels[score] ?? '不明'
}

export function getMenstrualLabel(status: string): string {
  const labels: Record<string, string> = {
    menstrual: '月経中',
    premenstrual: '月経前',
    normal: '通常期',
  }
  return labels[status] ?? status
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    menstrual: '月経ケア',
    pms: 'PMS',
    menopause: '更年期',
    pregnancy: '妊活',
    mental: 'メンタル',
    other: 'その他',
  }
  return labels[category] ?? category
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    menstrual: '#C97A72',
    pms: '#E8A87C',
    menopause: '#9B7BB5',
    pregnancy: '#6BAB8F',
    mental: '#4A7C6F',
    other: '#6B6B6B',
  }
  return colors[category] ?? '#6B6B6B'
}
