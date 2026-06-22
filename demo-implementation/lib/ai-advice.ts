import type { ContentCategory, MenstrualStatus } from './mock-data'

export interface AIAdvice {
  headline: string
  icon: string
  color: string
  gradient: string
  insight: string
  actions: { emoji: string; text: string }[]
  relatedCategories: ContentCategory[]
  todayKeyword: string
}

const SYMPTOM_ADVICE: Record<string, { emoji: string; text: string }> = {
  headache:       { emoji: '💧', text: '水分をこまめに補給し、カフェインは控えめにしましょう。' },
  abdominal_pain: { emoji: '🔥', text: 'お腹や腰を温めると筋肉がほぐれ、痛みが和らぎます。' },
  fatigue:        { emoji: '🛌', text: '鉄分が不足しがちです。ほうれん草・レバーを意識して摂りましょう。' },
  bloating:       { emoji: '🥗', text: '塩分を控え、食物繊維を意識して腸内環境を整えましょう。' },
  insomnia:       { emoji: '🌙', text: '就寝1時間前はスマホをオフに。ぬるめの入浴も効果的です。' },
  mood_swing:     { emoji: '🧘', text: '深呼吸を5回。気持ちを紙に書き出すのも気持ちが落ち着きます。' },
  back_pain:      { emoji: '♨️', text: '腰にカイロを当て、座る姿勢を意識して過ごしましょう。' },
  breast_pain:    { emoji: '🍵', text: '締め付けの少ないブラを選び、カフェインを控えましょう。' },
  nausea:         { emoji: '🍋', text: '少量をこまめに食べ、空腹を避けると吐き気が和らぎます。' },
  dizziness:      { emoji: '⬇️', text: '急に立ち上がらず、ゆっくり動作しましょう。鉄分補給も大切。' },
}

export function generateAIAdvice(params: {
  menstrualStatus: MenstrualStatus | null
  symptoms: string[]
  sleepScore: number
  fatigueScore: number
  moodScore: number
}): AIAdvice {
  const { menstrualStatus, symptoms, sleepScore, fatigueScore, moodScore } = params
  const avgScore = (sleepScore + fatigueScore + moodScore) / 3

  // ─── ベースメッセージ（月経状態 × スコア）───
  const base = ((): Omit<AIAdvice, 'actions' | 'relatedCategories'> => {
    if (menstrualStatus === 'menstrual') {
      if (avgScore <= 2) return {
        headline: '月経中で体がつらい時期です。まず休息を。',
        icon: '🌸', color: '#C97A72',
        gradient: 'linear-gradient(135deg, #F2E0DE 0%, #FDEAE8 100%)',
        insight: '今日は無理をせず、温かく過ごすことが最優先です。痛みが強い場合は鎮痛剤も適切な対処法のひとつです。',
        todayKeyword: '月経中ケア',
      }
      return {
        headline: '月経中です。今日は自分をいたわって。',
        icon: '🌸', color: '#C97A72',
        gradient: 'linear-gradient(135deg, #F2E0DE 0%, #FDEAE8 100%)',
        insight: '月経中はプロスタグランジンの分泌が多く、体に負担がかかっています。激しい運動は避け、体を温めながらゆったり過ごしましょう。',
        todayKeyword: '月経ケア',
      }
    }
    if (menstrualStatus === 'premenstrual') {
      if (avgScore <= 2) return {
        headline: 'PMSのサインが出ています。無理せずセルフケアを。',
        icon: '🌙', color: '#9B87B5',
        gradient: 'linear-gradient(135deg, #EDE8F5 0%, #F3EFFE 100%)',
        insight: 'ホルモンの急激な変動がイライラや気分の落ち込みを引き起こしています。今日は「感情的になりやすい日」と受け入れ、自分を責めないで。',
        todayKeyword: 'PMS重点ケア',
      }
      return {
        headline: 'PMSの時期です。心と体のバランスを整えましょう。',
        icon: '🌙', color: '#9B87B5',
        gradient: 'linear-gradient(135deg, #EDE8F5 0%, #F3EFFE 100%)',
        insight: '月経前のホルモン変動ピーク時期です。食事・睡眠・軽い運動でバランスを整えると、症状が和らぎやすくなります。',
        todayKeyword: 'PMSケア',
      }
    }
    // normal
    if (avgScore <= 2) return {
      headline: '疲れが溜まっています。今日は回復に集中を。',
      icon: '⚡', color: '#E8A87C',
      gradient: 'linear-gradient(135deg, #FFF3E8 0%, #FFF8F0 100%)',
      insight: 'スコアから疲労のサインが見られます。今日は「頑張る日」ではなく「回復する日」と決めて、無理のない過ごし方をしましょう。',
      todayKeyword: '疲労回復',
    }
    if (avgScore <= 3.5) return {
      headline: 'まずまずの体調です。予防ケアを意識しましょう。',
      icon: '☀️', color: '#4A7C6F',
      gradient: 'linear-gradient(135deg, #DCF0EB 0%, #E8F5F0 100%)',
      insight: '体調安定期は次のサイクルに向けた土台を作る絶好の機会です。栄養・運動・睡眠の3本柱を意識しましょう。',
      todayKeyword: 'コンディション維持',
    }
    return {
      headline: '体調は良好です！この調子を維持しましょう。',
      icon: '✨', color: '#4A7C6F',
      gradient: 'linear-gradient(135deg, #E8F5F0 0%, #DCF0EB 100%)',
      insight: '今日の体調スコアは優秀です。継続的な記録と規則正しい生活が、この良いコンディションを生み出しています。',
      todayKeyword: '良好コンディション',
    }
  })()

  // ─── アドバイスアクション（症状 → スコア → 月経状態 → 汎用の順）───
  const actions: { emoji: string; text: string }[] = []

  for (const s of symptoms) {
    if (SYMPTOM_ADVICE[s] && actions.length < 3) actions.push(SYMPTOM_ADVICE[s])
  }

  if (sleepScore <= 2 && actions.length < 3)
    actions.push({ emoji: '🌙', text: '昨夜の睡眠不足を補うため、今夜は22時には就寝を目指しましょう。' })
  if (fatigueScore <= 2 && actions.length < 3)
    actions.push({ emoji: '🫖', text: '身体が疲れています。温かい飲み物を飲んで10分間目を閉じましょう。' })
  if (moodScore <= 2 && actions.length < 3)
    actions.push({ emoji: '💌', text: '気分が落ちている時こそ、好きな音楽を5分聴いてみましょう。' })

  if (menstrualStatus === 'menstrual') {
    if (actions.length < 3) actions.push({ emoji: '🔥', text: 'お腹や腰にカイロを当てて血行を促進しましょう。' })
    if (actions.length < 3) actions.push({ emoji: '🚶‍♀️', text: '激しい運動は避け、軽いストレッチ程度にとどめましょう。' })
  }
  if (menstrualStatus === 'premenstrual') {
    if (actions.length < 3) actions.push({ emoji: '🥜', text: 'マグネシウム豊富なナッツや豆類でPMS症状を緩和しましょう。' })
    if (actions.length < 3) actions.push({ emoji: '☕', text: 'カフェインと砂糖を控えると、イライラが和らぎます。' })
  }

  const fallbacks = [
    { emoji: '💧', text: '1日2Lを目安に水分を補給しましょう。' },
    { emoji: '🥦', text: '野菜・タンパク質・鉄分を意識した食事を心がけましょう。' },
    { emoji: '🧘', text: '5分間の腹式呼吸でストレスホルモンを下げましょう。' },
    { emoji: '📝', text: '体調を記録する習慣がパターン把握に繋がります。' },
  ]
  let fi = 0
  while (actions.length < 3 && fi < fallbacks.length) actions.push(fallbacks[fi++])

  // ─── 関連記事カテゴリ───
  const relatedCategories: ContentCategory[] = []
  if (menstrualStatus === 'menstrual') relatedCategories.push('menstrual')
  if (menstrualStatus === 'premenstrual') relatedCategories.push('pms')
  if (moodScore <= 2 || symptoms.includes('mood_swing') || symptoms.includes('insomnia'))
    relatedCategories.push('mental')
  const defaults: ContentCategory[] = ['menstrual', 'pms', 'mental', 'menopause', 'pregnancy']
  for (const c of defaults) {
    if (!relatedCategories.includes(c) && relatedCategories.length < 3) relatedCategories.push(c)
  }

  return { ...base, actions: actions.slice(0, 3), relatedCategories: relatedCategories.slice(0, 3) }
}
