import { Lunar } from 'lunar-typescript'

export type Element = '木' | '火' | '土' | '金' | '水'

export interface Pillar {
  stem: string
  branch: string
  element: Element
  label: string
}

export interface Interaction {
  type: '合' | '沖' | '刑' | '害'
  description: string
  impact: string
}

export interface DayAnalysis {
  date: Date
  dateLabel: string
  weekday: string
  yearPillar: Pillar
  monthPillar: Pillar
  dayPillar: Pillar
  elementScores: Record<Element, number>
  dominantElements: Element[]
  energyTitle: string
  energyDesc: string
  interactions: Interaction[]
  yi: { item: string; reason: string }[]
  buYi: { item: string; reason: string }[]
  summary: string
}

// ── 五行對應 ─────────────────────────────────────────────

const STEM_ELEMENT: Record<string, Element> = {
  甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土',
  己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水',
}

const BRANCH_ELEMENT: Record<string, Element> = {
  子: '水', 丑: '土', 寅: '木', 卯: '木', 辰: '土', 巳: '火',
  午: '火', 未: '土', 申: '金', 酉: '金', 戌: '土', 亥: '水',
}

// 相生關係
const GENERATES: Record<Element, Element> = {
  木: '火', 火: '土', 土: '金', 金: '水', 水: '木',
}
// 相剋關係
const CONTROLS: Record<Element, Element> = {
  木: '土', 土: '水', 水: '火', 火: '金', 金: '木',
}

// ── 干支互動 ─────────────────────────────────────────────

const STEM_HE: Record<string, string> = {
  甲: '己', 己: '甲', 乙: '庚', 庚: '乙',
  丙: '辛', 辛: '丙', 丁: '壬', 壬: '丁', 戊: '癸', 癸: '戊',
}

const BRANCH_LIU_HE: Record<string, string> = {
  子: '丑', 丑: '子', 寅: '亥', 亥: '寅', 卯: '戌', 戌: '卯',
  辰: '酉', 酉: '辰', 巳: '申', 申: '巳', 午: '未', 未: '午',
}

const BRANCH_CHONG: Record<string, string> = {
  子: '午', 午: '子', 丑: '未', 未: '丑', 寅: '申', 申: '寅',
  卯: '酉', 酉: '卯', 辰: '戌', 戌: '辰', 巳: '亥', 亥: '巳',
}

const BRANCH_XING: Record<string, string[]> = {
  寅: ['巳'], 巳: ['申'], 申: ['寅'],
  丑: ['戌'], 戌: ['未'], 未: ['丑'],
  子: ['卯'], 卯: ['子'],
}

const BRANCH_HAI: Record<string, string> = {
  子: '未', 未: '子', 丑: '午', 午: '丑',
  寅: '巳', 巳: '寅', 卯: '辰', 辰: '卯',
  申: '亥', 亥: '申', 酉: '戌', 戌: '酉',
}

// ── 地支藏干（主氣/中氣/餘氣） ───────────────────────────
// 格式：[天干, 權重]，主氣1.0 / 中氣0.6 / 餘氣0.3

const BRANCH_HIDDEN: Record<string, [string, number][]> = {
  子: [['癸', 1.0]],
  丑: [['己', 1.0], ['癸', 0.6], ['辛', 0.3]],
  寅: [['甲', 1.0], ['丙', 0.6], ['戊', 0.3]],
  卯: [['乙', 1.0]],
  辰: [['戊', 1.0], ['乙', 0.6], ['癸', 0.3]],
  巳: [['丙', 1.0], ['戊', 0.6], ['庚', 0.3]],
  午: [['丁', 1.0], ['己', 0.6]],
  未: [['己', 1.0], ['丁', 0.6], ['乙', 0.3]],
  申: [['庚', 1.0], ['壬', 0.6], ['戊', 0.3]],
  酉: [['辛', 1.0]],
  戌: [['戊', 1.0], ['辛', 0.6], ['丁', 0.3]],
  亥: [['壬', 1.0], ['甲', 0.6]],
}

// ── 三柱權重 ─────────────────────────────────────────────
// 日柱是主角，月柱為季節背景，年柱為遠景大環境
const PILLAR_WEIGHT = { year: 0.25, month: 0.5, day: 1.0 }

// ── 五行計分（三柱六字，含藏干與有根判斷） ───────────────

function scoreElements(
  yearPillar: Pillar,
  monthPillar: Pillar,
  dayPillar: Pillar
): Record<Element, number> {
  const score: Record<Element, number> = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 }

  const weightedPillars = [
    { pillar: yearPillar,  weight: PILLAR_WEIGHT.year  },
    { pillar: monthPillar, weight: PILLAR_WEIGHT.month },
    { pillar: dayPillar,   weight: PILLAR_WEIGHT.day   },
  ]

  // 根的判斷仍用全部三支的藏干（根是客觀存在，不受權重影響）
  const allBranchStems = new Set<string>()
  for (const { pillar } of weightedPillars) {
    for (const [hs] of BRANCH_HIDDEN[pillar.branch] ?? []) {
      allBranchStems.add(hs)
    }
  }

  for (const { pillar, weight } of weightedPillars) {
    // 天干：有根 × 1.0，無根 × 0.3，再乘柱權重
    const stemEl = STEM_ELEMENT[pillar.stem]
    const hasRoot = [...allBranchStems].some(s => STEM_ELEMENT[s] === stemEl)
    score[stemEl] += (hasRoot ? 1.0 : 0.3) * weight

    // 地支藏干：藏干本身權重 × 柱權重
    for (const [hs, hsWeight] of BRANCH_HIDDEN[pillar.branch] ?? []) {
      score[STEM_ELEMENT[hs]] += hsWeight * weight
    }
  }

  return score
}

function getDominantElements(score: Record<Element, number>): Element[] {
  const sorted = (Object.entries(score) as [Element, number][])
    .sort((a, b) => b[1] - a[1])
  const top = sorted[0][1]
  const second = sorted[1][1]
  // 第二名達到第一名 65% 才構成雙主導
  if (second >= top * 0.65) return [sorted[0][0], sorted[1][0]]
  return [sorted[0][0]]
}

// ── 雙元素關係判斷 ───────────────────────────────────────

function elementRelation(a: Element, b: Element): 'generates' | 'controls' | 'reverse-controls' | 'neutral' {
  if (GENERATES[a] === b) return 'generates'
  if (CONTROLS[a] === b) return 'controls'
  if (CONTROLS[b] === a) return 'reverse-controls'
  return 'neutral'
}

// ── 合并能量主題（單/雙主導） ────────────────────────────

type EnergyProfile = {
  title: string
  desc: string
  yi: { item: string; reason: string }[]
  buYi: { item: string; reason: string }[]
}

function buildEnergyProfile(
  dominants: Element[],
  score: Record<Element, number>,
  interactions: Interaction[]
): EnergyProfile {
  const hasChong = interactions.some(i => i.type === '沖')
  const hasHe = interactions.some(i => i.type === '合')

  // ── 單主導五行 ────────────────────────────────────────
  if (dominants.length === 1) {
    return singleElementProfile(dominants[0], hasChong, hasHe)
  }

  // ── 雙主導五行 ────────────────────────────────────────
  const [a, b] = dominants
  const rel = elementRelation(a, b)
  return dualElementProfile(a, b, rel, hasChong, hasHe)
}

// ── 單元素模板 ───────────────────────────────────────────

function singleElementProfile(el: Element, hasChong: boolean, hasHe: boolean): EnergyProfile {
  const chongNote = hasChong ? '惟今日有干支相沖，能量稍帶波動，行事需保持彈性，不要過度固執計劃。' : ''
  const heNote = hasHe ? '今日干支有相合，合力加成，上述能量更為穩定集中。' : ''

  const profiles: Record<Element, EnergyProfile> = {
    木: {
      title: '木氣獨旺，生發之日',
      desc: `今日年、月、日三柱合計，木氣在六字中佔據明顯優勢，生發、進取、向上的能量場主導全日。木主春天的生命力，凡事重在啟動與突破，今日推動停滯已久的計劃往往一觸即發。流年、流月同為木氣加持，代表大環境的推動力與個人行動方向一致，是難得的共振時刻。${chongNote}${heNote}`,
      yi: [
        { item: '啟動新計劃', reason: '三柱木氣共振，今日起步的事情自帶推進動能' },
        { item: '求職面試、晉升申請', reason: '木主上進，積極表現今日最易被看見' },
        { item: '學習進修、報名課程', reason: '吸收新知識的最佳時機，木氣助長思維擴展' },
        { item: '簽訂合作協議', reason: '木主成長，適合開展長遠合作關係，根基穩固' },
        { item: '社交拓展、建立人脈', reason: '木氣外向，初次見面印象正面，關係容易深化' },
        { item: '創意發想、腦力激盪', reason: '思維活躍靈動，適合需要突破的創意工作' },
        { item: '短途出行或考察', reason: '木主移動，外出探索今日特別有收穫' },
      ],
      buYi: [
        { item: '衝動借貸或大額財務決策', reason: '木旺剋土，財庫受壓，今日財務宜保守' },
        { item: '情緒化爭執', reason: '木氣急進，言語容易過激，傷感情後難以修補' },
        { item: '強行改變他人', reason: '木太旺反失柔韌，以退為進比強推更有效' },
        { item: '過度鑽牛角尖', reason: '木旺易只顧前衝，忽略大局，需定期抬頭看方向' },
      ],
    },
    火: {
      title: '火氣獨旺，光明之日',
      desc: `今日三柱六字中火氣積累最強，光明、熱情、表達的能量場主宰全日。火代表夏天的頂點，今日人與人之間的連結最為暢通，一切需要展示自我、推廣想法或凝聚共識的場合都有加分效果。流年流月同以火氣呼應，大環境本已熱絡，今日更是錦上添花，適合把握時機向外展示成果。${chongNote}${heNote}`,
      yi: [
        { item: '公開演講、簡報、提案', reason: '火主表達，口才與感染力均在高位，說服力強' },
        { item: '品牌推廣、社群發帖', reason: '火主曝光，今日推出的內容傳播效果更強' },
        { item: '社交應酬、拓展人際', reason: '人際能量旺盛，適合擴大社交圈或深化關係' },
        { item: '簽約成交、談定合作', reason: '火氣帶來決斷力，雙方容易達成共識' },
        { item: '藝術創作與表演', reason: '創意與表現力充沛，作品今日帶有感染力' },
        { item: '向上司或重要人物展示成果', reason: '火主光明，今日亮相最易留下正面深刻印象' },
      ],
      buYi: [
        { item: '激動爭論、口舌是非', reason: '火旺言語鋒利，衝突今日特別難以平息，後果大' },
        { item: '倉促簽署複雜合約', reason: '熱情易掩蓋細節問題，重要文件需冷靜審閱' },
        { item: '獨自長時間靜坐', reason: '火氣外向，強迫靜止反而積累焦躁' },
        { item: '過度消費、衝動購物', reason: '火旺剋金，財務今日容易失控，需設預算上限' },
      ],
    },
    土: {
      title: '土氣獨旺，厚實之日',
      desc: `今日三柱六字中土氣積累最重，穩定、承載、務實的能量場主導全日。土代表四季更替中的中樞，有包容萬物、居中調和的特質，適合需要穩固基礎的事務，流年流月同具土氣，意味著當前大環境強調守成多於突破，穩中求進是最優策略。土氣也主信用與承諾，今日作出的約定份量較重，對方更容易給予信任。${chongNote}${heNote}`,
      yi: [
        { item: '房地產相關事務', reason: '土主不動產，今日處理置業、租賃、裝修均吉' },
        { item: '長線投資佈局', reason: '土主財庫，適合穩健的長期資金安排' },
        { item: '履行承諾、兌現約定', reason: '土主信用，今日守信行為效果加倍鞏固關係' },
        { item: '處理積壓事務', reason: '土主沉積，今日清理舊事帶來真實的輕鬆感' },
        { item: '與長輩或前輩溝通', reason: '言談有分量，長輩今日更願意傾聽與支持' },
        { item: '健康調理與養生', reason: '土主脾胃，今日飲食規律，調養效果佳' },
        { item: '化解積累已久的誤會', reason: '居中調和的特質，今日是修復關係的好時機' },
      ],
      buYi: [
        { item: '衝動轉向或急速改變', reason: '土氣守成，突然的大轉變今日阻力格外大' },
        { item: '高風險投機', reason: '土主保守，今日不宜博短線快錢' },
        { item: '過度飲食', reason: '土主脾胃，消化系統需要照顧，勿過量進食' },
        { item: '強行說服他人改變立場', reason: '土氣重，雙方都較固執，硬碰硬只會僵持' },
      ],
    },
    金: {
      title: '金氣獨旺，清明之日',
      desc: `今日三柱六字中金氣積累最強，清晰、決斷、執行的能量場主導全日。金代表秋天的收斂，凡事講求結果，不喜拖泥帶水。流年流月同具金氣，大環境正在強調效率與是非分明，今日看問題能直接切入核心，減少雜音干擾。金氣也主規則與邊界，適合處理需要明確結論的事務，拖延未決的問題今日最適合一錘定音。${chongNote}${heNote}`,
      yi: [
        { item: '重要決策與定奪', reason: '三柱金氣共振，判斷力清晰，不易被情緒左右' },
        { item: '整理環境、斷捨離', reason: '金主收斂，今日整頓效率極高，清理帶來清醒' },
        { item: '執行已定的計劃', reason: '金氣行動力強，今日推進執行最為順暢' },
        { item: '談判與磋商', reason: '邏輯清晰，立場堅定，今日談判有天然優勢' },
        { item: '法律、合約、正式文件', reason: '金主規則，今日處理條款等正式事務準確細緻' },
        { item: '健身與肺部相關健康事務', reason: '金主肺，今日運動、深呼吸效果特別好' },
      ],
      buYi: [
        { item: '情感表白或深度情感溝通', reason: '金氣偏硬，言語容易顯得冷漠，情感交流不佳' },
        { item: '強硬正面對抗', reason: '金對金，硬碰硬容易兩敗俱傷，需留有餘地' },
        { item: '大額消費與衝動購物', reason: '金主收斂，今日財氣偏緊，宜節制支出' },
        { item: '拖延回覆重要決定', reason: '金氣時效性強，今日拖延特別容易錯失時機' },
      ],
    },
    水: {
      title: '水氣獨旺，洞察之日',
      desc: `今日三柱六字中水氣積累最強，智慧、流動、洞察的能量場主導全日。水代表冬天的內斂，適合思考、研究與內省，今日的直覺與判斷比平時更為準確。流年流月同具水氣，大環境正在強調深度多於廣度，今日慢下來深入思考的收穫，往往比急於行動更豐厚。水氣主人際的潛移默化，溫和而持久的影響力比直接衝擊更有效。${chongNote}${heNote}`,
      yi: [
        { item: '深度研究與資料搜集', reason: '三柱水氣共振，信息處理與分析能力在高位' },
        { item: '一對一深度溝通', reason: '水氣細膩，今日的傾聽與表達特別真誠有效' },
        { item: '寫作、創作、內容策劃', reason: '水主靈感，文思泉湧，適合需要深度的創作' },
        { item: '冥想、靜心、內省', reason: '水氣向內，今日靜坐冥想效果加倍' },
        { item: '長線策略規劃', reason: '思維深遠，今日制定的計劃通常考慮更為周全' },
        { item: '修復人際關係', reason: '水主柔和，今日修復姿態最容易被接受' },
        { item: '學術或技術鑽研', reason: '今日最適合需要專注深入的腦力工作' },
      ],
      buYi: [
        { item: '倉促行動與快速決策', reason: '水氣思慮深，倉促行事今日容易遺漏重要環節' },
        { item: '高調張揚、大規模曝光', reason: '水主內斂，今日過度表現反而令人感到不自然' },
        { item: '激烈正面衝突', reason: '水氣柔中帶韌，正面強硬衝突今日消耗格外大' },
        { item: '過度依賴他人判斷', reason: '今日直覺準確，反而不宜讓外部聲音主導決策' },
      ],
    },
  }

  return profiles[el]
}

// ── 雙元素模板 ───────────────────────────────────────────

function dualElementProfile(
  a: Element,
  b: Element,
  rel: 'generates' | 'controls' | 'reverse-controls' | 'neutral',
  hasChong: boolean,
  hasHe: boolean
): EnergyProfile {
  const chongNote = hasChong ? '今日同時出現干支相沖，能量波動加劇，需特別留意計劃變動與溝通誤差。' : ''
  const heNote = hasHe ? '今日有干支相合加持，兩股能量相互協調，局面比表面更為穩定。' : ''

  const key = `${a}${b}` as keyof typeof DUAL_PROFILES
  const profile = DUAL_PROFILES[key] || DUAL_PROFILES[`${b}${a}` as keyof typeof DUAL_PROFILES]

  if (profile) {
    return {
      ...profile,
      desc: profile.desc + (chongNote ? ' ' + chongNote : '') + (heNote ? ' ' + heNote : ''),
    }
  }

  // fallback：用主導元素
  return singleElementProfile(a, hasChong, hasHe)
}

const DUAL_PROFILES: Partial<Record<string, EnergyProfile>> = {
  // ── 相生組合 ──────────────────────────────────────────
  木火: {
    title: '木火相生，擴張之日',
    desc: '今日三柱六字中木氣與火氣同為主導，且木生火、能量流動暢順，整體能量場充滿擴張感與感染力。木提供方向與動力，火將其轉化為光與熱，兩者相輔相成，是主動出擊的好時機。大環境的氣場鼓勵行動與表達，凡需要啟動、展示、推廣的事情今日均有加分。',
    yi: [
      { item: '推廣新項目或品牌曝光', reason: '木啟動、火傳播，今日推出的內容最易引起關注' },
      { item: '主動出擊、爭取機會', reason: '木火相生帶來強勁推進力，主動比被動有效' },
      { item: '社交與人際拓展', reason: '熱情外向，今日給人的第一印象充滿活力' },
      { item: '創意提案與說服', reason: '邏輯清晰加上熱情表達，說服力今日在高峰' },
      { item: '公開演講或教學分享', reason: '木主知識、火主感染，今日傳授與分享效果出色' },
      { item: '開展新合作關係', reason: '擴張型能量場，雙方都傾向積極回應' },
    ],
    buYi: [
      { item: '衝動財務決策', reason: '木火皆動，容易忽略風險，大額財務今日需冷靜' },
      { item: '激烈爭執', reason: '木火旺，言語火爆，衝突今日難以控制' },
      { item: '過度消耗精力', reason: '木火過旺容易燃燒殆盡，需留意休息' },
      { item: '獨自靜坐強制放鬆', reason: '能量外向，強制靜止反而積累煩躁' },
    ],
  },

  火土: {
    title: '火土相生，成果之日',
    desc: '今日三柱六字中火氣與土氣同為主導，火生土，能量從熱情行動轉化為穩固成果，是「做了就能有收穫」的能量格局。火帶來推動力與展示欲，土承接結果並固化成真實的積累。大環境強調今日的行動要有結果導向，適合把已推進的事情帶入收成階段，也利於正式確認與落地。',
    yi: [
      { item: '簽約定案、正式確認合作', reason: '火推動、土落地，今日談定的事情最容易成真' },
      { item: '成果展示與總結匯報', reason: '火主表達、土主實績，展示有說服力' },
      { item: '房地產或實體資產交易', reason: '土主不動產，火推動決策，今日適合定奪' },
      { item: '與重要人物正式會面', reason: '火帶感染力，土帶可信度，給人穩重又有活力的印象' },
      { item: '長線計劃的推進節點', reason: '火土相生，行動有根，今日的推進不易反彈' },
      { item: '財務規劃與投資落實', reason: '土主財庫，火推動，適合把計劃中的投資付諸實行' },
    ],
    buYi: [
      { item: '輕率開始全新冒險', reason: '土主守成，今日更宜鞏固現有成果而非全新突破' },
      { item: '激進爭論', reason: '火旺易燥，需留意情緒管理，土重又難化解' },
      { item: '拖延已定的決策', reason: '火土能量強調結果，今日拖延反而錯失窗口期' },
      { item: '過度飲食', reason: '土主脾胃，今日消化系統負擔較重，飲食宜節制' },
    ],
  },

  土金: {
    title: '土金相生，沉穩之日',
    desc: '今日三柱六字中土氣與金氣同為主導，土生金，能量從穩固根基轉化為清晰決斷，是「想清楚才行動」的能量格局。土帶來可靠與信用，金帶來效率與執行力，兩者疊加，適合處理需要嚴謹規劃又要有效落實的事務。大環境的氣場今日偏向保守而精準，不鼓勵冒進，但凡按計劃行事則事半功倍。',
    yi: [
      { item: '重大決策的最終定奪', reason: '土積累資訊、金做決斷，今日判斷最為理性可靠' },
      { item: '法律、合約、財務文件處理', reason: '土主信用、金主規則，今日處理正式事務細緻準確' },
      { item: '整理積累的事務與清單', reason: '土清積欠、金提效率，今日清理帶來真實的輕鬆感' },
      { item: '長線投資佈局', reason: '土金皆主財，穩健型配置今日是最佳時機' },
      { item: '與長輩或機構的正式溝通', reason: '兩者皆主穩重可信，今日正式場合表現佳' },
      { item: '健康檢查或調理規劃', reason: '土主脾胃、金主肺，今日處理健康事務有效' },
    ],
    buYi: [
      { item: '衝動冒險或全新嘗試', reason: '土金皆守，今日創新的能量不足，冒進阻力大' },
      { item: '情感表達與關係修復', reason: '土金偏理性，今日情感溝通容易顯得疏離' },
      { item: '大量社交應酬', reason: '土金能量內斂，今日密集社交消耗大、效果一般' },
      { item: '在意他人眼光', reason: '土金容易固執己見，今日更需主動聆聽，避免自我封閉' },
    ],
  },

  金水: {
    title: '金水相生，智謀之日',
    desc: '今日三柱六字中金氣與水氣同為主導，金生水，能量從清晰決斷流向深度智慧，是「既能決定又能想深一層」的能量格局。金帶來判斷力與執行力，水帶來洞察力與靈活性，兩者相輔，適合需要快速判斷又要考慮長遠的場合。大環境的氣場今日偏向冷靜分析，感性衝動在今日較難發揮，理性路線才是正確打開方式。',
    yi: [
      { item: '策略分析與規劃', reason: '金提供清晰框架、水提供深度洞察，策略今日最為周全' },
      { item: '重要談判與磋商', reason: '金主立場堅定、水主靈活應對，今日談判有先手優勢' },
      { item: '研究、調查與資料整理', reason: '金水皆主精準，今日深度工作效率高且質量好' },
      { item: '一對一深度溝通', reason: '水主傾聽、金主清晰表達，今日深度交流最有成效' },
      { item: '解決積累已久的複雜問題', reason: '金切入核心、水看透本質，今日最易找到突破口' },
      { item: '財務盤點與資產優化', reason: '金水皆主財智，今日盤點帶來清晰的行動方向' },
    ],
    buYi: [
      { item: '大規模社交與高調曝光', reason: '金水皆主內斂，今日強行外向消耗大、效果差' },
      { item: '憑直覺的衝動行動', reason: '能量偏向分析，今日衝動行事往往後悔' },
      { item: '情感表白或修復關係', reason: '金水理性色彩重，今日情感交流容易顯得冷靜過頭' },
      { item: '強硬對抗', reason: '金水皆能以柔克剛，今日硬碰反而削弱本身優勢' },
    ],
  },

  水木: {
    title: '水木相生，萌動之日',
    desc: '今日三柱六字中水氣與木氣同為主導，水生木，能量從深度洞察流向積極行動，是「想清楚了、可以動了」的能量格局。水帶來直覺與深思，木帶來方向感與推進力，兩者連結恰到好處，既不衝動又不遲疑，是醞釀成熟後順勢而發的時機。大環境的氣場今日鼓勵把長期積累的想法轉化為具體行動。',
    yi: [
      { item: '把研究成果轉化為行動', reason: '水給靈感根基、木推向前，今日知行合一能量強' },
      { item: '創作與寫作', reason: '水主靈感、木主生長，今日創作有深度又有生命力' },
      { item: '開展長線計劃的第一步', reason: '水木相生，起步穩而有力，不易衝動也不易退縮' },
      { item: '學習新技能或進修', reason: '水吸收、木成長，今日學習效率高且記憶深刻' },
      { item: '人際關係的深化', reason: '水主細膩、木主連結，今日深化既有關係最有效' },
      { item: '健康養生規劃', reason: '水主腎、木主肝，今日規劃整體健康最為系統' },
    ],
    buYi: [
      { item: '大規模高調曝光', reason: '水木能量含蓄，今日過度張揚反而引發不必要的關注' },
      { item: '強行推進他人決策', reason: '木雖主動，有水相伴反而更宜以柔引導而非強推' },
      { item: '高風險投機', reason: '水木皆非財氣旺的格局，今日財務宜穩健保守' },
      { item: '硬拼消耗戰', reason: '水木組合以生長取勝，正面消耗今日並非優選' },
    ],
  },

  // ── 相剋組合 ──────────────────────────────────────────
  木土: {
    title: '木土相制，動靜拉鋸之日',
    desc: '今日三柱六字中木氣與土氣同為主導，木剋土，兩股能量形成相互拉扯的格局：木的前衝與土的守成在大環境中同時發力，行事往往有「想動卻動不快」的感受。這種張力並非壞事，正是因為有土的穩固，木的前進才不會衝過頭；正是因為有木的推動，土的守成才不會原地打轉。今日最佳策略是在穩固基礎上找突破點，而非全面衝刺或完全觀望。',
    yi: [
      { item: '在現有基礎上微調優化', reason: '土的穩固加木的調整，改良比革新今日更有效' },
      { item: '評估後再行動的決策', reason: '木土拉鋸反而有助於更全面的考量，決策質量高' },
      { item: '處理土地、農業、實體業務', reason: '木土皆與實體有關，今日處理具體落地事務順暢' },
      { item: '與保守派的溝通協商', reason: '理解土的穩重立場，以木的靈活找到突破共識的方式' },
      { item: '健康養生', reason: '木主肝、土主脾胃，今日兩者同時照顧效果佳' },
    ],
    buYi: [
      { item: '全力衝刺高風險項目', reason: '土氣牽制木氣，今日全力衝刺往往遭遇意外阻力' },
      { item: '完全靜止、不作為', reason: '木氣推動，靜止令積累的能量形成內耗' },
      { item: '急於求成', reason: '木土相制格局需要耐心，急於求成易兩頭落空' },
      { item: '忽略細節', reason: '土氣要求穩固，今日粗心大意的代價比平時更大' },
    ],
  },

  火金: {
    title: '火金相制，激盪之日',
    desc: '今日三柱六字中火氣與金氣同為主導，火剋金，兩股能量形成激盪的對抗格局：火的熱情衝動與金的冷靜決斷在大環境中同時存在，最直觀的感受是「想表達但要有節制」。這種張力在溝通場合特別明顯，容易出現熱烈但有爭議的討論。利用好這股激盪能量，能在看似對立的觀點中找到突破性的結論，但需要主動管理情緒與節奏。',
    yi: [
      { item: '需要辯論與碰撞的會議', reason: '火金激盪反而能產生有深度的結論，適合開放討論' },
      { item: '創意與執行並重的工作', reason: '火帶創意、金帶執行，今日能同時兼顧兩者' },
      { item: '談判與磋商', reason: '能在熱情與冷靜之間切換，談判靈活性高' },
      { item: '藝術創作或設計', reason: '火金對抗往往產生張力美感，適合需要衝突感的創作' },
      { item: '個人形象整理', reason: '金主精緻、火主光彩，今日整理外在形象效果佳' },
    ],
    buYi: [
      { item: '情緒化溝通', reason: '火金皆強，情緒對撞今日特別激烈，需要刻意冷靜' },
      { item: '衝動財務決策', reason: '火剋金，財務今日最容易受情緒牽動而出錯' },
      { item: '過度堅持己見', reason: '火金相制，死守立場容易兩敗俱傷，適時妥協更明智' },
      { item: '外科手術或創傷性醫療', reason: '火金相制，今日傷口相關的事務宜謹慎' },
    ],
  },

  土水: {
    title: '土水相制，思動兩難之日',
    desc: '今日三柱六字中土氣與水氣同為主導，土剋水，兩股能量形成「想深思卻被現實拉扯」的格局：水的智慧與洞察被土的務實守成所制約，在大環境中形成理想與現實的張力。這並非壞事，正是因為有土的接地氣，水的想法才不會流於空談；正是因為有水的深度，土的守成才不流於頑固。今日最有效的行事方式是把想法落實到具體可執行的小步驟。',
    yi: [
      { item: '把長遠規劃拆解為具體步驟', reason: '水提供洞見、土要求落地，今日最適合做執行計劃' },
      { item: '財務與資產的實務規劃', reason: '土主財庫、水主智慧，今日理財決策兼具遠見與務實' },
      { item: '評估長期項目的可行性', reason: '土水組合最能看清理想與現實的差距，評估準確' },
      { item: '健康調理', reason: '土主脾胃、水主腎，今日全身性的調養計劃最為有效' },
      { item: '梳理積累的情緒或問題', reason: '水主洞察、土主承接，今日整理心理狀態有療癒效果' },
    ],
    buYi: [
      { item: '脫離現實的大膽冒險', reason: '土剋水，今日過度理想化的計劃特別容易碰壁' },
      { item: '陷入過度分析而不行動', reason: '水思土壓，容易想太多卻一直等待完美時機' },
      { item: '衝動社交或大規模應酬', reason: '土水皆主內斂，今日密集社交消耗大' },
      { item: '強行說服保守派改變', reason: '土氣厚重，今日說服效果差，不如以實績說話' },
    ],
  },

  水火: {
    title: '水火相制，矛盾激化之日',
    desc: '今日三柱六字中水氣與火氣同為主導，水剋火，是五行中最為對立的能量組合，形成理性與感性、衝動與克制同時存在的張力格局。在大環境中，今日的各種情況都可能出現兩種截然不同的聲音或立場，決策者最容易搖擺。需要特別留意：不要讓這種矛盾感癱瘓行動，反而要善用水的洞察去引導火的熱情，找到兩者都能接受的方向。',
    yi: [
      { item: '冷靜分析後的針對性行動', reason: '水提供分析、火提供執行力，今日最佳策略是想清楚再動' },
      { item: '化解長期積累的衝突', reason: '水火同場反而最能看清矛盾本質，今日是破局的窗口' },
      { item: '創意寫作或藝術表達', reason: '矛盾張力往往是最好的創作燃料' },
      { item: '情感溝通（需謹慎選時）', reason: '水火能量下，真實情感最容易表達出來，但需控制節奏' },
    ],
    buYi: [
      { item: '倉促做重大決定', reason: '水火相制代表今日判斷容易搖擺，重大決策宜緩' },
      { item: '激烈衝突與正面對抗', reason: '水火激盪，衝突今日最難平息，後果最難預估' },
      { item: '同時處理大量事務', reason: '矛盾能量令專注力分散，今日宜專注一件事' },
      { item: '強行統一不同立場', reason: '水火皆強，強行統一往往適得其反，今日宜求同存異' },
    ],
  },

  金木: {
    title: '金木相制，取捨之日',
    desc: '今日三柱六字中金氣與木氣同為主導，金剋木，形成「決斷與靈活」的對立格局：金的收斂執行力與木的生長擴張力在大環境中拉鋸，令行事時容易感受到「要執行還是要靈活」的取捨困境。這種格局適合處理需要在多個選項中作出抉擇的場合，金給予割捨的勇氣，木保留必要的彈性。',
    yi: [
      { item: '在多個選項中做取捨', reason: '金提供決斷力、木提供靈活性，今日最善於選擇' },
      { item: '優化現有計劃', reason: '金剪枝、木成長，今日最適合去蕪存菁式的改善' },
      { item: '評估合作關係', reason: '今日看人看事最為清晰，能分辨值得保留的與應放下的' },
      { item: '技術與創意並重的工作', reason: '金主技術精準、木主創意生長，今日兩者都能發揮' },
    ],
    buYi: [
      { item: '同時推進多個全新項目', reason: '金剋木，今日擴張受阻，聚焦比擴散更有效' },
      { item: '情緒化爭執', reason: '金木皆強，雙方都不願退讓，今日爭執容易失控' },
      { item: '輕易放棄既有成果', reason: '金雖善割捨，但木的生長需要時間，不宜衝動放棄' },
      { item: '無謂的完美主義', reason: '金求完美、木要靈活，兩者拉扯容易陷入原地打轉' },
    ],
  },
}

// ── 互動分析 ─────────────────────────────────────────────

function getInteractions(
  yearPillar: Pillar,
  monthPillar: Pillar,
  dayPillar: Pillar
): Interaction[] {
  const results: Interaction[] = []

  const check = (a: Pillar, b: Pillar, aLabel: string, bLabel: string) => {
    // 天干合
    if (STEM_HE[a.stem] === b.stem) {
      results.push({
        type: '合',
        description: `${aLabel}天干「${a.stem}」與${bLabel}天干「${b.stem}」相合`,
        impact: `天干相合代表兩個時間維度的能量協調，今日行事方向與大環境趨勢一致，阻力小，適合順水推舟而非逆勢強行。`,
      })
    }
    // 地支六合
    if (BRANCH_LIU_HE[a.branch] === b.branch) {
      results.push({
        type: '合',
        description: `${aLabel}地支「${a.branch}」與${bLabel}地支「${b.branch}」六合`,
        impact: `地支六合帶來底層能量的和諧，人際互動今日格外順暢，合作項目容易達成共識，合約與協議類事務宜積極推進。`,
      })
    }
    // 地支六沖
    if (BRANCH_CHONG[a.branch] === b.branch) {
      results.push({
        type: '沖',
        description: `${aLabel}地支「${a.branch}」與${bLabel}地支「${b.branch}」相沖`,
        impact: `地支相沖帶來能量震盪，今日可能出現計劃臨時變動或溝通摩擦。不宜固守原計劃，保持彈性反而能把握沖出的轉機；重大決策今日宜謹慎確認再行動。`,
      })
    }
    // 地支相刑
    if (BRANCH_XING[a.branch]?.includes(b.branch)) {
      results.push({
        type: '刑',
        description: `${aLabel}地支「${a.branch}」與${bLabel}地支「${b.branch}」相刑`,
        impact: `地支相刑帶來隱性張力，問題往往不在表面，而是積累已久的矛盾今日浮現。需要直接溝通而非迴避，同時注意身體健康，避免過勞。`,
      })
    }
    // 地支相害
    if (BRANCH_HAI[a.branch] === b.branch) {
      results.push({
        type: '害',
        description: `${aLabel}地支「${a.branch}」與${bLabel}地支「${b.branch}」相害`,
        impact: `地支相害象徵暗中阻礙，今日部分事情未必如表面順利，需留意合作中的潛在變數，重要事務多做確認，人際相處保持適度距離。`,
      })
    }
  }

  check(yearPillar, dayPillar, '流年', '日柱')
  check(monthPillar, dayPillar, '流月', '日柱')
  check(yearPillar, monthPillar, '流年', '流月')

  return results
}

// ── 能量總結 ─────────────────────────────────────────────

function buildSummary(
  yearPillar: Pillar,
  monthPillar: Pillar,
  dayPillar: Pillar,
  dominants: Element[],
  score: Record<Element, number>,
  interactions: Interaction[]
): string {
  const sortedScore = (Object.entries(score) as [Element, number][])
    .sort((a, b) => b[1] - a[1])
  const strongest = sortedScore[0]
  const weakest = sortedScore[4]

  const scoreDesc = `今日三柱六字（${yearPillar.stem}${yearPillar.branch}、${monthPillar.stem}${monthPillar.branch}、${dayPillar.stem}${dayPillar.branch}）五行計分，${strongest[0]}氣最旺（${strongest[1].toFixed(1)}分），${weakest[0]}氣最弱（${weakest[1].toFixed(1)}分）。`

  let interactionSummary = ''
  if (interactions.length > 0) {
    const types = [...new Set(interactions.map(i => i.type))]
    if (types.includes('沖')) {
      interactionSummary = '三柱之間存在相沖，整體能量有一定的不穩定性，彈性應對比固守計劃更重要，突發情況中往往隱藏轉機。'
    } else if (types.includes('合') && !types.includes('沖')) {
      interactionSummary = '三柱之間有相合，能量協調，今日行事阻力較小，合力推進比單打獨鬥更有效。'
    } else if (types.includes('刑')) {
      interactionSummary = '三柱存在相刑，注意隱性的人際或健康消耗，積極處理比被動等待更能化解問題。'
    } else {
      interactionSummary = '三柱存在相害，留意表裡不一的情況，重要事務多做確認。'
    }
  }

  const weakAdvice: Record<Element, string> = {
    木: '今日木氣偏弱，凡需要靈活應變、創新突破的事情需要額外主動推動，不宜完全依賴環境的自然帶動。',
    火: '今日火氣偏弱，展示與表達的能量稍顯不足，需要主動提振熱情，重要的亮相場合可提前做好心理準備。',
    土: '今日土氣偏弱，穩固基礎的能量稍顯不足，財務決策宜加倍謹慎，承諾給出前需要確保自己有能力兌現。',
    金: '今日金氣偏弱，決斷力稍顯不足，重要決定可借助他人的意見作輔助，避免因猶豫而錯失時機。',
    水: '今日水氣偏弱，深度洞察的能量稍顯不足，需要主動放慢節奏思考，不宜完全依賴直覺行事。',
  }

  return `${scoreDesc}${interactionSummary ? ' ' + interactionSummary : ''} ${weakAdvice[weakest[0]]}`
}

// ── 排柱與主函數 ─────────────────────────────────────────

function parsePillar(ganZhi: string): Pillar {
  const stem = ganZhi[0]
  const branch = ganZhi[1]
  return {
    stem,
    branch,
    element: STEM_ELEMENT[stem],
    label: ganZhi,
  }
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

export function analyzeDays(count = 8): DayAnalysis[] {
  const results: DayAnalysis[] = []

  const nowHKT = new Date(Date.now() + 8 * 60 * 60 * 1000)
  const todayUTC = new Date(Date.UTC(
    nowHKT.getUTCFullYear(),
    nowHKT.getUTCMonth(),
    nowHKT.getUTCDate()
  ))

  for (let i = 0; i < count; i++) {
    const d = new Date(todayUTC.getTime() + i * 86400000)
    const y = d.getUTCFullYear()
    const m = d.getUTCMonth() + 1
    const day = d.getUTCDate()

    const lunar = Lunar.fromDate(new Date(y, m - 1, day))

    const yearPillar = parsePillar(lunar.getYearInGanZhi())
    const monthPillar = parsePillar(lunar.getMonthInGanZhi())
    const dayPillar = parsePillar(lunar.getDayInGanZhi())

    const elementScores = scoreElements(yearPillar, monthPillar, dayPillar)
    const dominantElements = getDominantElements(elementScores)
    const interactions = getInteractions(yearPillar, monthPillar, dayPillar)
    const energyProfile = buildEnergyProfile(dominantElements, elementScores, interactions)
    const summary = buildSummary(yearPillar, monthPillar, dayPillar, dominantElements, elementScores, interactions)

    results.push({
      date: d,
      dateLabel: `${y}年${m}月${day}日`,
      weekday: `週${WEEKDAYS[d.getUTCDay()]}`,
      yearPillar,
      monthPillar,
      dayPillar,
      elementScores,
      dominantElements,
      energyTitle: energyProfile.title,
      energyDesc: energyProfile.desc,
      interactions,
      yi: energyProfile.yi,
      buYi: energyProfile.buYi,
      summary,
    })
  }

  return results
}

export const ELEMENT_COLOR: Record<Element, string> = {
  木: '#5CAD7A',
  火: '#E06B50',
  土: '#C9A84C',
  金: '#8BBCD4',
  水: '#6B8FD4',
}
