export type AgeGroup = '20s' | '30s' | '40s' | '50s'
export type LifeStage = 'menstrual' | 'trying_to_conceive' | 'postpartum' | 'menopause'
export type MenstrualStatus = 'menstrual' | 'premenstrual' | 'normal'
export type ContentCategory = 'menstrual' | 'pms' | 'menopause' | 'pregnancy' | 'mental'
export type ContentType = 'article' | 'video'
export type ConsultationCategory = 'menstrual' | 'pms' | 'menopause' | 'pregnancy' | 'mental' | 'other'
export type SenderType = 'user' | 'specialist'

export interface MockUser {
  id: string
  name: string
  ageGroup: AgeGroup
  lifeStage: LifeStage
  company: string
  department: string
}

export interface CheckInRecord {
  id: string
  date: string
  sleepScore: number
  fatigueScore: number
  moodScore: number
  menstrualStatus: MenstrualStatus
  symptoms: string[]
  feedbackMessage: string
}

export interface Content {
  id: string
  title: string
  category: ContentCategory
  contentType: ContentType
  thumbnailUrl: string
  readTime: number
  publishedAt: string
  excerpt: string
  body?: string
}

export interface ConsultationMessage {
  id: string
  senderType: SenderType
  body: string
  createdAt: string
}

export interface Consultation {
  id: string
  category: ConsultationCategory
  status: 'pending' | 'active' | 'closed'
  specialistName: string
  messages: ConsultationMessage[]
  createdAt: string
}

export interface SpecialistSlot {
  id: string
  specialistName: string
  role: 'obgyn'
  date: string
  time: string
  available: boolean
}

// --- モックユーザー ---
export const mockUser: MockUser = {
  id: 'user-001',
  name: 'さやか',
  ageGroup: '30s',
  lifeStage: 'menstrual',
  company: '株式会社サンプル',
  department: '営業部',
}

// --- 今日のチェックイン ---
export const todayCheckin: CheckInRecord = {
  id: 'ci-001',
  date: new Date().toISOString().split('T')[0],
  sleepScore: 3,
  fatigueScore: 2,
  moodScore: 2,
  menstrualStatus: 'premenstrual',
  symptoms: ['headache', 'bloating'],
  feedbackMessage:
    '月経前の時期です。イライラや集中力の低下はPMSのサインかもしれません。無理せず休息を取りましょう。',
}

// --- 体調履歴 ---
export const checkInHistory: CheckInRecord[] = [
  {
    id: 'ci-002',
    date: '2026-05-31',
    sleepScore: 4,
    fatigueScore: 3,
    moodScore: 3,
    menstrualStatus: 'premenstrual',
    symptoms: ['headache'],
    feedbackMessage: '睡眠が取れています。引き続きよく眠れるよう心がけましょう。',
  },
  {
    id: 'ci-003',
    date: '2026-05-30',
    sleepScore: 5,
    fatigueScore: 4,
    moodScore: 4,
    menstrualStatus: 'normal',
    symptoms: [],
    feedbackMessage: '体調が良好ですね！この調子を維持しましょう。',
  },
  {
    id: 'ci-004',
    date: '2026-05-29',
    sleepScore: 2,
    fatigueScore: 2,
    moodScore: 1,
    menstrualStatus: 'menstrual',
    symptoms: ['abdominal_pain', 'fatigue'],
    feedbackMessage: '月経中で辛い時期ですね。無理せず、温かくして過ごしましょう。',
  },
  {
    id: 'ci-005',
    date: '2026-05-28',
    sleepScore: 3,
    fatigueScore: 2,
    moodScore: 2,
    menstrualStatus: 'menstrual',
    symptoms: ['abdominal_pain'],
    feedbackMessage: '腹痛が続いているようです。市販の鎮痛剤で対応できますが、続く場合は受診を検討してください。',
  },
  {
    id: 'ci-006',
    date: '2026-05-27',
    sleepScore: 4,
    fatigueScore: 3,
    moodScore: 3,
    menstrualStatus: 'normal',
    symptoms: [],
    feedbackMessage: 'バランスの取れた体調ですね。',
  },
]

// --- コンテンツ ---
export const mockContents: Content[] = [
  {
    id: 'content-001',
    title: 'PMSを乗り越える5つのセルフケア',
    category: 'pms',
    contentType: 'article',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop',
    readTime: 5,
    publishedAt: '2026-05-20',
    excerpt: '月経前に感じるイライラや気分の落ち込みはPMSのサインかもしれません。日常でできるセルフケアを紹介します。',
    body: `## PMSとは？\n\nPMS（月経前症候群）とは、月経の3〜10日前から始まり、月経が始まると症状が軽くなる心身の不調のことです。\n\n## 5つのセルフケア\n\n### 1. 規則正しい睡眠\n毎日同じ時間に寝起きすることで、ホルモンバランスが整います。\n\n### 2. 適度な運動\nウォーキングや軽いストレッチが効果的です。無理のない範囲で続けましょう。\n\n### 3. 食事の見直し\n甘いものやカフェインを控えめにし、マグネシウムを多く含む食品（ナッツ・豆類）を取り入れてみましょう。\n\n### 4. リラックスタイムを確保\nぬるめのお風呂につかる、好きな音楽を聴くなど、意識的にリラックスする時間を作りましょう。\n\n### 5. 記録をつける\n体調を記録することで、自分のパターンを把握できます。「なぜこんなに辛いのか」という不安が和らぎます。`,
  },
  {
    id: 'content-002',
    title: '月経痛を和らげる食事と生活習慣',
    category: 'menstrual',
    contentType: 'article',
    thumbnailUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop',
    readTime: 4,
    publishedAt: '2026-05-18',
    excerpt: '月経痛は多くの女性が経験するものですが、食事や生活習慣を少し変えるだけで症状が軽くなることがあります。',
    body: `## 月経痛の原因\n\nプロスタグランジンという物質の過剰分泌が月経痛の主な原因です。\n\n## 食事の工夫\n\n- **オメガ3脂肪酸**（サバ・サーモン）を積極的に摂る\n- **マグネシウム**（ほうれん草・アボカド）で筋肉の緊張を緩和\n- カフェイン・アルコールを控える\n\n## 生活習慣のポイント\n\n- 身体を温める（腹巻き・温かい飲み物）\n- 軽いヨガやストレッチ\n- 十分な睡眠を取る`,
  },
  {
    id: 'content-003',
    title: '更年期症状に気づくためのチェックリスト',
    category: 'menopause',
    contentType: 'article',
    thumbnailUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=300&fit=crop',
    readTime: 6,
    publishedAt: '2026-05-15',
    excerpt: '40代以降の体調変化は更年期のサインかもしれません。早期に気づき、適切なケアをすることが大切です。',
    body: `## 更年期とは？\n\n更年期とは閉経前後の約10年間を指し、女性ホルモン（エストロゲン）が急激に減少する時期です。\n\n## 主な症状チェックリスト\n\n- [ ] 急なほてり・発汗\n- [ ] 動悸・息切れ\n- [ ] 睡眠障害\n- [ ] 気分の落ち込み・イライラ\n- [ ] 関節痛・筋肉痛\n\n上記の症状が複数当てはまる場合、更年期の可能性があります。婦人科での相談をお勧めします。`,
  },
  {
    id: 'content-004',
    title: '職場でのストレスとホルモンバランスの関係',
    category: 'mental',
    contentType: 'article',
    thumbnailUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    readTime: 5,
    publishedAt: '2026-05-12',
    excerpt: '仕事のストレスが月経周期に影響することをご存知ですか？ストレスとホルモンの関係を解説します。',
    body: `## ストレスとホルモンの関係\n\nコルチゾール（ストレスホルモン）が過剰に分泌されると、女性ホルモンのバランスが乱れ、月経不順やPMSが悪化することがあります。\n\n## 職場でできるストレスケア\n\n1. **深呼吸**: 1日3回、腹式呼吸を意識する\n2. **マインドフルネス**: 5分間の瞑想を日課にする\n3. **休憩を取る**: ランチは必ずデスクを離れる\n4. **相談できる環境を作る**: 信頼できる人に話せる場を持つ`,
  },
  {
    id: 'content-005',
    title: '妊活中の体調管理のポイント',
    category: 'pregnancy',
    contentType: 'article',
    thumbnailUrl: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=400&h=300&fit=crop',
    readTime: 7,
    publishedAt: '2026-05-10',
    excerpt: '妊活中は体調管理がより重要になります。日常でできる準備と心構えについて解説します。',
    body: `## 妊活中に大切なこと\n\n### 基礎体温をつける\n毎朝起き上がる前に体温を計測することで、排卵日の予測ができます。\n\n### 葉酸の摂取\n妊活開始前から葉酸を摂取しておくことが推奨されています。\n\n### 生活習慣の見直し\n- 禁煙・禁酒\n- 適度な体重管理\n- ストレス軽減`,
  },
  {
    id: 'content-006',
    title: '月経周期を知ることの大切さ',
    category: 'menstrual',
    contentType: 'article',
    thumbnailUrl: 'https://images.unsplash.com/photo-1499578124509-1611b77778c8?w=400&h=300&fit=crop',
    readTime: 3,
    publishedAt: '2026-05-08',
    excerpt: '自分の月経周期を知ることは、体調管理の第一歩。周期の乱れに気づく方法をご紹介します。',
    body: `## 月経周期の基本\n\n平均的な月経周期は28日ですが、25〜38日は正常範囲内です。\n\n## 周期の記録をつけよう\n\n毎月の開始日を記録するだけで、自分のパターンが見えてきます。\n\n## 気をつけるサイン\n\n- 2ヶ月以上月経がない\n- 出血量が急に増えた・減った\n- 月経前後に強い痛みがある`,
  },
]

// --- 相談スレッド ---
export const mockConsultations: Consultation[] = [
  {
    id: 'consult-001',
    category: 'pms',
    status: 'active',
    specialistName: '看護師 A',
    createdAt: '2026-06-01T10:00:00Z',
    messages: [
      {
        id: 'msg-001',
        senderType: 'user',
        body: '月経前になると頭痛がひどくなります。受診すべきでしょうか？',
        createdAt: '2026-06-01T10:00:00Z',
      },
      {
        id: 'msg-002',
        senderType: 'specialist',
        body: 'ご相談ありがとうございます。月経前の頭痛はPMSの症状の一つです。いつ頃から頭痛が始まりますか？月経の何日前頃でしょうか？',
        createdAt: '2026-06-01T11:30:00Z',
      },
      {
        id: 'msg-003',
        senderType: 'user',
        body: '月経の1週間前くらいから始まります。鎮痛剤を飲めば治まりますが、毎月続いています。',
        createdAt: '2026-06-01T12:00:00Z',
      },
      {
        id: 'msg-004',
        senderType: 'specialist',
        body: '月経1週間前からの頭痛でPMSの可能性が高いです。鎮痛剤で改善しているとのことで、まずはセルフケアを試してみましょう。カフェインを控えめにし、十分な睡眠を取ることが効果的です。もし毎月市販薬に頼る状況が続くようであれば、婦人科への受診をお勧めします。',
        createdAt: '2026-06-01T14:00:00Z',
      },
    ],
  },
  {
    id: 'consult-002',
    category: 'menopause',
    status: 'closed',
    specialistName: '助産師 B',
    createdAt: '2026-05-20T09:00:00Z',
    messages: [
      {
        id: 'msg-005',
        senderType: 'user',
        body: '最近、夜中に急に汗をかいて目が覚めます。更年期でしょうか？',
        createdAt: '2026-05-20T09:00:00Z',
      },
      {
        id: 'msg-006',
        senderType: 'specialist',
        body: '夜間の発汗は更年期症状の一つである「ホットフラッシュ」の可能性があります。年齢はおいくつですか？また、月経の変化はありますか？',
        createdAt: '2026-05-20T10:00:00Z',
      },
    ],
  },
]

// --- 医師空き枠 ---
export const mockSlots: SpecialistSlot[] = [
  { id: 'slot-001', specialistName: '産婦人科医 田中先生', role: 'obgyn', date: '2026-06-05', time: '14:00', available: true },
  { id: 'slot-002', specialistName: '産婦人科医 田中先生', role: 'obgyn', date: '2026-06-05', time: '15:00', available: true },
  { id: 'slot-003', specialistName: '産婦人科医 田中先生', role: 'obgyn', date: '2026-06-05', time: '16:00', available: false },
  { id: 'slot-004', specialistName: '産婦人科医 鈴木先生', role: 'obgyn', date: '2026-06-06', time: '10:00', available: true },
  { id: 'slot-005', specialistName: '産婦人科医 鈴木先生', role: 'obgyn', date: '2026-06-06', time: '11:00', available: true },
  { id: 'slot-006', specialistName: '産婦人科医 鈴木先生', role: 'obgyn', date: '2026-06-07', time: '14:00', available: true },
]

// --- 管理ダッシュボード用モックデータ ---
export const mockDashboard = {
  month: '2026年5月',
  activeRate: 0.65,
  consultationRate: 0.22,
  avgMoodScore: 3.4,
  departments: [
    { name: '営業部', activeUsers: 28, avgMoodScore: 3.2, avgSleepScore: 2.9 },
    { name: '開発部', activeUsers: 15, avgMoodScore: 3.6, avgSleepScore: 3.2 },
    { name: '人事部', activeUsers: 8, avgMoodScore: 3.8, avgSleepScore: 3.5 },
    { name: 'マーケティング部', activeUsers: 12, avgMoodScore: 3.1, avgSleepScore: 2.8 },
  ],
  topSymptoms: [
    { name: '倦怠感', count: 42, percentage: 42 },
    { name: '頭痛', count: 31, percentage: 31 },
    { name: 'むくみ', count: 22, percentage: 22 },
    { name: '腹痛', count: 18, percentage: 18 },
    { name: 'ほてり', count: 12, percentage: 12 },
  ],
  trendData: [
    { month: '1月', moodScore: 3.2, sleepScore: 3.0, fatigueScore: 2.8 },
    { month: '2月', moodScore: 3.0, sleepScore: 2.9, fatigueScore: 2.6 },
    { month: '3月', moodScore: 3.3, sleepScore: 3.1, fatigueScore: 2.9 },
    { month: '4月', moodScore: 3.5, sleepScore: 3.3, fatigueScore: 3.1 },
    { month: '5月', moodScore: 3.4, sleepScore: 3.2, fatigueScore: 3.0 },
  ],
}

export const SYMPTOMS = [
  { id: 'headache', label: '頭痛' },
  { id: 'abdominal_pain', label: '腹痛' },
  { id: 'bloating', label: 'むくみ' },
  { id: 'hot_flash', label: 'ほてり' },
  { id: 'fatigue', label: '倦怠感' },
  { id: 'other', label: 'その他' },
]

export const CONTENT_CATEGORIES: { id: ContentCategory; label: string; color: string }[] = [
  { id: 'menstrual', label: '月経ケア', color: '#C97A72' },
  { id: 'pms', label: 'PMS', color: '#E8A87C' },
  { id: 'menopause', label: '更年期', color: '#9B7BB5' },
  { id: 'pregnancy', label: '妊活', color: '#6BAB8F' },
  { id: 'mental', label: 'メンタル', color: '#4A7C6F' },
]
