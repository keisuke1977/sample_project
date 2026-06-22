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
  {
    id: 'content-007',
    title: '睡眠とホルモンの深い関係 — 質の良い眠りが体を変える',
    category: 'mental',
    contentType: 'article',
    thumbnailUrl: 'https://images.unsplash.com/photo-1531353826977-0941b4779a1c?w=400&h=300&fit=crop',
    readTime: 5,
    publishedAt: '2026-06-05',
    excerpt: '睡眠不足が続くと、女性ホルモンのバランスが崩れ、PMS・肌荒れ・体重増加に繋がることが。良質な睡眠を手に入れるヒントをお届けします。',
    body: `## なぜ睡眠がホルモンに影響するのか\n\n成長ホルモンや女性ホルモンの多くは、深い睡眠中に分泌されます。睡眠が不足すると、コルチゾール（ストレスホルモン）が増加し、エストロゲンのバランスを乱します。\n\n## 睡眠の質を上げる5つのステップ\n\n### 1. 毎日同じ時間に起きる\n体内時計をリセットする最も効果的な方法です。休日も1時間以内のずれにとどめましょう。\n\n### 2. 就寝90分前に入浴\nぬるめ（38〜40℃）のお湯に15分つかると、深部体温が一時的に上昇し、就寝時に急降下することで自然な眠気が訪れます。\n\n### 3. ブルーライトを避ける\nスマホやPCのブルーライトはメラトニン分泌を抑制します。就寝1時間前はナイトモードに切り替えるか、使用を控えましょう。\n\n### 4. カフェインのカットオフ時間を決める\n午後2時以降はカフェインを避けると、夜の眠りの深さが改善します。\n\n### 5. 室温は18〜20℃が目安\n体温が下がりやすい環境を作ることで、睡眠の質が高まります。\n\n## 月経前に眠れないときは\n\nPMS期のプロゲステロン低下が不眠を引き起こすことがあります。就寝前の軽いストレッチや、カモミールティーが助けになることも。症状が続く場合は婦人科への相談を。`,
  },
  {
    id: 'content-008',
    title: 'PMS食事療法 — 食べ物でイライラ・むくみを改善する',
    category: 'pms',
    contentType: 'article',
    thumbnailUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    readTime: 6,
    publishedAt: '2026-06-03',
    excerpt: 'PMS症状は食事で変わります。マグネシウム・ビタミンB6・オメガ3を意識した「PMSケア食」の実践ガイドです。',
    body: `## PMSに効く栄養素とは\n\n科学的研究から、特定の栄養素がPMS症状を軽減することがわかっています。\n\n## マグネシウム — イライラ・頭痛の鎮静\n\n月経前にマグネシウムが不足するとイライラや頭痛が増悪します。\n\n**多く含む食品：** アーモンド・カシューナッツ・ほうれん草・黒豆・バナナ\n\n目安摂取量：1日280mg（成人女性）\n\n## ビタミンB6 — 気分の安定・むくみ解消\n\n神経伝達物質のセロトニン合成に必要で、気分の安定に貢献します。\n\n**多く含む食品：** まぐろ・鶏むね肉・にんにく・ピスタチオ・バナナ\n\n## オメガ3脂肪酸 — 炎症を抑える\n\nプロスタグランジンの過剰産生を抑え、月経痛やPMS症状を和らげます。\n\n**多く含む食品：** サバ・サーモン・イワシ・亜麻仁油・チアシード\n\n## 避けるべき食品\n\n- カフェイン（コーヒー・エナジードリンク）：不安感・胸の張りを増悪\n- 精製糖（お菓子・ジュース）：血糖値の急激な変動がイライラを生む\n- アルコール：ホルモンバランスを乱し、睡眠の質も低下\n- 塩分の多い食品：むくみを悪化させる\n\n## 1日の食事例（PMS週）\n\n朝：バナナ・ヨーグルト・ナッツのボウル\n昼：鮭のソテー・ほうれん草のサラダ・玄米\n夜：豆腐と豆のスープ・野菜炒め・雑穀ごはん\nおやつ：アーモンド20粒・カモミールティー`,
  },
  {
    id: 'content-009',
    title: '更年期と骨粗鬆症 — 40代から始める骨ケア',
    category: 'menopause',
    contentType: 'article',
    thumbnailUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&sat=-50',
    readTime: 7,
    publishedAt: '2026-05-28',
    excerpt: 'エストロゲンの低下は骨密度に直結します。閉経後10年で骨量が20〜30%失われることも。今日からできる骨ケアを解説します。',
    body: `## 更年期と骨の関係\n\nエストロゲンは骨を壊す細胞（破骨細胞）の働きを抑制しています。閉経後にエストロゲンが低下すると、骨密度が急激に低下し、骨粗鬆症のリスクが高まります。\n\n## 骨密度チェックのタイミング\n\n40代になったら一度骨密度検査を受けることをお勧めします。DXA法（二重エネルギーX線吸収測定法）が最も精度の高い測定方法です。\n\n## 骨を守る3つの柱\n\n### 1. カルシウムとビタミンDの摂取\n\nカルシウムは骨の主成分、ビタミンDはカルシウムの吸収を助けます。\n\n**カルシウムが豊富な食品：** 牛乳・チーズ・豆腐・ひじき・小松菜\n\n**ビタミンDが豊富な食品：** サーモン・きのこ類・卵黄\n\n1日15〜30分の日光浴でも皮膚からビタミンDを生成できます。\n\n### 2. 荷重運動\n\n骨に適度な刺激を与えることで骨形成が促進されます。\n\n- ウォーキング（週3〜5回、30分以上）\n- 軽いジョギング\n- 階段の昇降\n\n### 3. 転倒予防\n\n骨が弱くなると骨折リスクが上がります。\n\n- 筋トレで下肢筋力を維持\n- バランス訓練（片足立ち）\n- 自宅の段差をなくす\n\n## 医療的選択肢\n\n骨密度が著しく低下している場合、ビスフォスフォネート系薬剤やホルモン補充療法（HRT）が選択肢になります。婦人科・整形外科での相談をお勧めします。`,
  },
  {
    id: 'content-010',
    title: '職場での「マインドフルネス」実践ガイド',
    category: 'mental',
    contentType: 'article',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=500&fit=crop&crop=entropy',
    readTime: 4,
    publishedAt: '2026-06-10',
    excerpt: '5分でできるマインドフルネスで、仕事中のイライラ・集中力低下をリセット。PMS期やストレスが高い時に特に効果的です。',
    body: `## マインドフルネスとは\n\n「今この瞬間」に意識を向け、過去の後悔や未来の不安から離れる練習です。科学的研究で、コルチゾール（ストレスホルモン）の低下やPMS症状の緩和効果が確認されています。\n\n## デスクでできる5分間の実践\n\n### ① 腹式呼吸（2分）\n\n1. 背筋を伸ばして椅子に座る\n2. 鼻からゆっくり4秒かけて吸う\n3. お腹が膨らんでいることを感じる\n4. 口から8秒かけてゆっくり吐く\n5. これを5〜6回繰り返す\n\n### ② ボディスキャン（2分）\n\n足先から頭頂部まで、体の各部位に意識を向けていく。「今、肩が緊張している」と気づくだけでOK。\n\n### ③ 5感チェック（1分）\n\n今、見えるもの5つ・聞こえるもの4つ・触れているもの3つ・匂い2つ・味1つを数える。パニックや強い不安にも有効です。\n\n## PMS期のマインドフルネス活用法\n\n月経前の感情の波は「自分が弱いから」ではなく、ホルモン変化による自然な反応です。\n\n「今、私はイライラしている。それはホルモンのせいだ」と客観的に観察することが、感情に飲み込まれないコツです。\n\n## 継続のコツ\n\n- 毎日同じ時間（出勤後・昼休み等）に行う\n- アプリ（Calm・Headspace等）を活用\n- 「完璧にやろう」と思わない`,
  },
  {
    id: 'content-011',
    title: '妊活と栄養 — 今日から始める「妊活メシ」',
    category: 'pregnancy',
    contentType: 'article',
    thumbnailUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=500&fit=crop&crop=top',
    readTime: 6,
    publishedAt: '2026-05-25',
    excerpt: '妊活中の食事は赤ちゃんの土台を作る大切な準備。葉酸・鉄・亜鉛・ビタミンDを意識した食事の具体的なポイントをお伝えします。',
    body: `## 妊活中に必要な栄養素\n\n妊娠を考えている場合、妊娠前から適切な栄養を摂ることが、赤ちゃんの健康な発育の基盤となります。\n\n## 葉酸 — 神経管閉鎖障害の予防\n\n妊娠初期（特に4〜8週）の神経管形成に葉酸が必須です。\n\n妊娠を考え始めたら、サプリメントで1日400μgの葉酸摂取が推奨されています（厚生労働省）。\n\n**食品からも：** ほうれん草・ブロッコリー・枝豆・アスパラガス・いちご\n\n## 鉄 — 血液をつくる\n\n妊娠中は血液量が大幅に増加します。妊活期から鉄を蓄えておきましょう。\n\n**ヘム鉄（吸収率が高い）：** レバー・赤身肉・カツオ\n\n**非ヘム鉄：** ほうれん草・豆類・切り干し大根（ビタミンCと一緒に摂ると吸収率UP）\n\n## 亜鉛 — 卵子の質を高める\n\n亜鉛は卵子の成熟と分裂に重要な役割を果たします。\n\n**多く含む食品：** 牡蠣・牛肉・かぼちゃの種・ナッツ類\n\n## 避けるべきもの\n\n- 生魚・生肉（リステリア菌・トキソプラズマのリスク）\n- 水銀含有量の多い魚（マグロ・メカジキの過剰摂取）\n- アルコール・タバコ\n- 過度なカフェイン（1日200mg以下に）\n\n## 1週間の妊活食サンプル\n\n月：鮭のムニエル＋ほうれん草のソテー\n火：レバーのしぐれ煮定食\n水：カツオのたたき＋枝豆\n木：牛赤身のステーキ＋ブロッコリー\n金：牡蠣のアヒージョ\n土：野菜たっぷりのポトフ\n日：豆腐と豆類のスープ`,
  },
  {
    id: 'content-012',
    title: 'セルフコンパッション — 自分に優しくするスキル',
    category: 'mental',
    contentType: 'article',
    thumbnailUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=500&fit=crop',
    readTime: 5,
    publishedAt: '2026-06-15',
    excerpt: '「なぜこんなに辛いのか」「もっと頑張れるはず」と自分を責めていませんか？セルフコンパッションで、体と心の回復力が高まります。',
    body: `## セルフコンパッションとは\n\nセルフコンパッション（自己への思いやり）とは、苦しんでいる自分に対して、親友に接するように優しく接することです。\n\nハーバード大学の研究では、セルフコンパッションが高い人ほどストレス耐性・回復力が高く、うつ・不安が低いことが示されています。\n\n## 3つの要素\n\n### 1. Self-kindness（自分への優しさ）\n失敗や苦しみの中にある自分を批判せず、温かく受け入れること。\n\n「もっとできたはず」ではなく「今の私にできることをやった」と言い換えてみましょう。\n\n### 2. Common humanity（共通の人間性）\n苦しみや失敗は、人間として共通の経験です。「なぜ私だけ」ではなく「誰でも辛い時はある」と気づくこと。\n\nPMSや更年期の症状も、多くの女性が経験していることです。\n\n### 3. Mindfulness（マインドフルネス）\n辛い感情を大げさにも否定もせず、「今、私は悲しい」とありのままに観察すること。\n\n## 今すぐできる練習\n\n### 自分への手紙\n辛い日に、親友に書くように自分への手紙を書いてみてください。\n\n「今日は本当に辛かったね。月経前でホルモンが乱れているから、こんなに苦しく感じるのは当然だよ。あなたはよく頑張った。今日は休んでいいよ。」\n\n### セルフタッチ\n胸に手を当てるだけで、オキシトシン（愛情・絆のホルモン）が分泌されます。辛い時、そっと自分の胸に手を置いてみましょう。\n\n## 「頑張り過ぎ」が多い方へ\n\n日本の社会では「我慢」「根性」が美徳とされがちです。しかし、慢性的なストレスはホルモンバランスを乱し、月経不順・免疫低下・燃え尽き症候群に繋がります。\n\n自分を大切にすることは、わがままではなく、長く健康に働くための必須スキルです。`,
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
