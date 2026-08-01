import { STEMS, BRANCHES } from './bazi-calc'
import type { BaziResult } from './bazi-calc'

// ── 干支互動表 ───────────────────────────────────────────
const TIANHE_PAIRS: [number, number][] = [[0,5],[1,6],[2,7],[3,8],[4,9]]
const TIANHE_HUA: Record<string, string> = {
  '0,5':'土','5,0':'土', '1,6':'金','6,1':'金',
  '2,7':'水','7,2':'水', '3,8':'木','8,3':'木', '4,9':'火','9,4':'火',
}
const BRANCH_LIUHE: Record<number, number> = {0:1,1:0,2:11,11:2,3:10,10:3,4:9,9:4,5:8,8:5,6:7,7:6}
const LIUCHONG_PAIRS: [number,number][] = [[0,6],[1,7],[2,8],[3,9],[4,10],[5,11]]
const LIUHAI_PAIRS:  [number,number][] = [[0,7],[1,6],[2,5],[3,4],[8,11],[9,10]]
const XIANGPO_PAIRS: [number,number][] = [[0,9],[3,6],[2,11],[5,8],[1,4],[7,10]]
// 三合局：trio 三支、elem 五行局、wang 旺神（四正，缺旺神只成拱合不成半三合）
interface SanheGroup { trio: [number, number, number]; elem: string; wang: number; label: string }
const SANHE_GROUPS: SanheGroup[] = [
  { trio: [8, 0, 4],  elem: '水', wang: 0, label: '申子辰' },
  { trio: [11, 3, 7], elem: '木', wang: 3, label: '亥卯未' },
  { trio: [2, 6, 10], elem: '火', wang: 6, label: '寅午戌' },
  { trio: [5, 9, 1],  elem: '金', wang: 9, label: '巳酉丑' },
]
// 自刑：同支相遇兼成刑者
const ZIXING = [4, 6, 9, 11]

// 三刑：寅巳申（恃勢之刑）、丑戌未（無恩之刑）為三支循環相刑，任兩支相遇即成立；
// 子卯（無禮之刑）只有兩支，不成三支組。與伏吟／自刑各自獨立判定，不重複標示同一對地支。
interface SanxingGroup { trio: [number, number, number]; label: string; kind: string }
const SANXING_GROUPS: SanxingGroup[] = [
  { trio: [2, 5, 8],  label: '寅巳申', kind: '恃勢之刑' },
  { trio: [1, 10, 7], label: '丑戌未', kind: '無恩之刑' },
]
const ZIMAO_PAIR: [number, number] = [0, 3]

export type InteractionType = '天干五合' | '地支六合' | '地支三合' | '地支六沖' | '地支六害' | '地支相破' | '地支伏吟' | '地支三刑'
export type Sentiment = 'good' | 'tense' | 'complex'

export interface Interaction {
  type: InteractionType
  aLabel: string
  bLabel: string
  detail: string
  sentiment: Sentiment
  isDay: boolean
  /** 文案分層：按（組合類型 × 柱位）產生的差異化描述，日柱權重高於年柱 */
  narrative: string
  /** 雙向視角：甲方在自己柱位上感受到的意義 */
  aPerspective: string
  /** 雙向視角：乙方在自己柱位上感受到的意義 */
  bPerspective: string
}

export interface CompatResult {
  interactions: Interaction[]
  dayBranchNote: string
  dayBranchSentiment: Sentiment
  positiveCount: number
  tensionCount: number
  /** 建議延伸閱讀的文章分類標籤，只出標籤字串，不接文章模組 */
  readingTags: string[]
}

function pairHit(a: number, b: number, pairs: [number,number][]): boolean {
  return pairs.some(([x,y]) => (a===x&&b===y)||(a===y&&b===x))
}

// ── 文案分層與雙向視角 ───────────────────────────────────
// 柱位代表的人生領域，用來讓同一種干支關係在不同柱位產生不同描述
const PILLAR_DOMAIN: Record<string, string> = {
  '年柱': '祖蔭與早年根基',
  '月柱': '父母手足與成長環境',
  '日柱': '自身命局核心與婚姻宮',
  '時柱': '子女緣分與晚年布局',
}
// 柱位權重：日柱權重明顯高於年柱，月柱與時柱居中
const PILLAR_WEIGHT: Record<string, number> = { '年柱': 1, '月柱': 2, '時柱': 2, '日柱': 4 }

function pillarIntensity(al: string, bl: string): string {
  const w = Math.max(PILLAR_WEIGHT[al] ?? 1, PILLAR_WEIGHT[bl] ?? 1)
  if (w >= 4) return '這組互動落在日柱，直接牽動雙方相處的核心與默契'
  if (w >= 2) return '這組互動落在月柱或時柱，影響雙方在家庭背景或後續發展上的互動'
  return '這組互動落在年柱，偏向根基與早年背景，力道相對含蓄'
}

// 各類型的基礎描述（第一層）
const TYPE_FLAVOR: Record<InteractionType, string> = {
  '天干五合': '雙方性情裡有一股互相吸引、樂意配合的傾向',
  '地支六合': '雙方本性相投，相處容易自然靠近',
  '地支三合': '雙方能量匯聚成同一個方向，合作時容易事半功倍',
  '地支六沖': '雙方個性差異明顯，張力與吸引並存，相處需要更多磨合',
  '地支六害': '雙方之間存在較隱性的耗損，容易在細節上產生誤解',
  '地支相破': '雙方相處會有零星摩擦，但通常不致動搖根本',
  '地支伏吟': '雙方同質性高，容易共鳴，但也可能同時陷入同一個盲點',
  '地支三刑': '雙方在這個位置容易出現角力、拉扯或言語衝突，需要刻意克制',
}

// 各類型對「感受者本人」的作用（第二層，用於雙向視角）
const TYPE_ACTION: Record<InteractionType, string> = {
  '天干五合': '感到被對方吸引，願意主動靠近',
  '地支六合': '感到被對方接住，相處自在',
  '地支三合': '感到與對方目標一致，合作起來特別順手',
  '地支六沖': '感到被對方牽動，內心存在張力',
  '地支六害': '感到被隱性消耗，有種說不清的疲憊',
  '地支相破': '感到偶有摩擦，但不至於動搖根本',
  '地支伏吟': '感到與對方同頻共振，但也容易一起卡在同一個盲點',
  '地支三刑': '感到被牽扯，容易與對方角力或產生言語衝突',
}

function narrativeFor(type: InteractionType, al: string, bl: string): string {
  return `${TYPE_FLAVOR[type]}；${pillarIntensity(al, bl)}`
}
function perspectiveFor(type: InteractionType, side: '甲' | '乙', ownLbl: string): string {
  const domain = PILLAR_DOMAIN[ownLbl] ?? '整體命局'
  return `${side}方在${ownLbl}（${domain}）${TYPE_ACTION[type]}`
}
// 多支命中（如三合、三刑）時，取權重最高的柱位代表整組互動的分量
function topWeightLabel(items: { lbl: string }[]): string {
  let best = items[0].lbl
  let bestW = PILLAR_WEIGHT[best] ?? 1
  for (const it of items) {
    const w = PILLAR_WEIGHT[it.lbl] ?? 1
    if (w > bestW) { bestW = w; best = it.lbl }
  }
  return best
}

export function analyzeCompat(ca: BaziResult, cb: BaziResult): CompatResult {
  const interactions: Interaction[] = []

  const ap = [
    { p: ca.year,  lbl: '年柱' },
    { p: ca.month, lbl: '月柱' },
    { p: ca.day,   lbl: '日柱' },
    ...(ca.hour ? [{ p: ca.hour, lbl: '時柱' }] : []),
  ]
  const bp = [
    { p: cb.year,  lbl: '年柱' },
    { p: cb.month, lbl: '月柱' },
    { p: cb.day,   lbl: '日柱' },
    ...(cb.hour ? [{ p: cb.hour, lbl: '時柱' }] : []),
  ]

  // 天干五合
  for (const {p: a, lbl: al} of ap) {
    for (const {p: b, lbl: bl} of bp) {
      const key = `${a.stem},${b.stem}`
      if (TIANHE_PAIRS.some(([x,y]) => (a.stem===x&&b.stem===y)||(a.stem===y&&b.stem===x))) {
        const hua = TIANHE_HUA[key] ?? TIANHE_HUA[`${b.stem},${a.stem}`]
        interactions.push({
          type: '天干五合',
          aLabel: `甲${al} ${STEMS[a.stem]}`,
          bLabel: `乙${bl} ${STEMS[b.stem]}`,
          detail: `合化${hua}`,
          sentiment: 'good',
          isDay: al==='日柱'||bl==='日柱',
          narrative: narrativeFor('天干五合', al, bl),
          aPerspective: perspectiveFor('天干五合', '甲', al),
          bPerspective: perspectiveFor('天干五合', '乙', bl),
        })
      }
    }
  }

  // 地支六合
  for (const {p: a, lbl: al} of ap) {
    for (const {p: b, lbl: bl} of bp) {
      if (BRANCH_LIUHE[a.branch] === b.branch) {
        interactions.push({
          type: '地支六合',
          aLabel: `甲${al} ${BRANCHES[a.branch]}`,
          bLabel: `乙${bl} ${BRANCHES[b.branch]}`,
          detail: '六合',
          sentiment: 'good',
          isDay: al==='日柱'||bl==='日柱',
          narrative: narrativeFor('地支六合', al, bl),
          aPerspective: perspectiveFor('地支六合', '甲', al),
          bPerspective: perspectiveFor('地支六合', '乙', bl),
        })
      }
    }
  }

  // 地支三合（跨雙方，需至少兩個不同地支；兩支缺旺神只作拱合）
  SANHE_GROUPS.forEach(({ trio, elem, wang, label }) => {
    const aHits = ap.filter(({p}) => trio.includes(p.branch))
    const bHits = bp.filter(({p}) => trio.includes(p.branch))
    if (!aHits.length || !bHits.length) return
    // 合併去重，確認不同地支數量 ≥ 2（同一地支相遇屬伏吟，另行判定）
    const uniqueBranches = new Set([...aHits.map(x=>x.p.branch), ...bHits.map(x=>x.p.branch)])
    if (uniqueBranches.size < 2) return
    const hasWang = uniqueBranches.has(wang)
    const isFull = uniqueBranches.size === 3
    const aLabel = aHits.map(x=>`甲${x.lbl} ${BRANCHES[x.p.branch]}`).join('＋')
    const bLabel = bHits.map(x=>`乙${x.lbl} ${BRANCHES[x.p.branch]}`).join('＋')
    const aTopLbl = topWeightLabel(aHits)
    const bTopLbl = topWeightLabel(bHits)
    interactions.push({
      type: '地支三合',
      aLabel, bLabel,
      detail: isFull
        ? `三合${elem}局（${label}）`
        : hasWang
          ? `半三合${elem}局（${label}，帶旺神${BRANCHES[wang]}）`
          : `拱合${elem}局（${label}，缺旺神${BRANCHES[wang]}，力弱）`,
      sentiment: hasWang ? 'good' : 'complex',
      isDay: [...aHits,...bHits].some(x=>x.lbl==='日柱'),
      narrative: narrativeFor('地支三合', aTopLbl, bTopLbl),
      aPerspective: perspectiveFor('地支三合', '甲', aTopLbl),
      bPerspective: perspectiveFor('地支三合', '乙', bTopLbl),
    })
  })

  // 地支伏吟（同一地支相遇，比和；辰午酉亥兼自刑）
  for (const {p: a, lbl: al} of ap) {
    for (const {p: b, lbl: bl} of bp) {
      if (a.branch !== b.branch) continue
      const selfPunish = ZIXING.includes(a.branch)
      interactions.push({
        type: '地支伏吟',
        aLabel: `甲${al} ${BRANCHES[a.branch]}`,
        bLabel: `乙${bl} ${BRANCHES[b.branch]}`,
        detail: selfPunish ? '伏吟（比和）＋自刑' : '伏吟（比和）',
        sentiment: 'complex',
        isDay: al==='日柱'||bl==='日柱',
        narrative: narrativeFor('地支伏吟', al, bl),
        aPerspective: perspectiveFor('地支伏吟', '甲', al),
        bPerspective: perspectiveFor('地支伏吟', '乙', bl),
      })
    }
  }

  // 地支三刑（寅巳申、丑戌未任兩支相遇即成立；子卯只兩支，另行判定）
  // 同一地支相遇屬伏吟／自刑，已在上面判定，此處只處理不同地支的組合，不重複標示
  SANXING_GROUPS.forEach(({ trio, label, kind }) => {
    const aHits = ap.filter(({p}) => trio.includes(p.branch))
    const bHits = bp.filter(({p}) => trio.includes(p.branch))
    if (!aHits.length || !bHits.length) return
    const uniqueBranches = new Set([...aHits.map(x=>x.p.branch), ...bHits.map(x=>x.p.branch)])
    if (uniqueBranches.size < 2) return // 同支相遇＝伏吟／自刑，不在此重複標示
    const isFull = uniqueBranches.size === 3
    const aLabel = aHits.map(x=>`甲${x.lbl} ${BRANCHES[x.p.branch]}`).join('＋')
    const bLabel = bHits.map(x=>`乙${x.lbl} ${BRANCHES[x.p.branch]}`).join('＋')
    const aTopLbl = topWeightLabel(aHits)
    const bTopLbl = topWeightLabel(bHits)
    interactions.push({
      type: '地支三刑',
      aLabel, bLabel,
      detail: isFull ? `三刑俱全（${label}，${kind}）` : `相刑（${label}，${kind}）`,
      sentiment: 'tense',
      isDay: [...aHits,...bHits].some(x=>x.lbl==='日柱'),
      narrative: narrativeFor('地支三刑', aTopLbl, bTopLbl),
      aPerspective: perspectiveFor('地支三刑', '甲', aTopLbl),
      bPerspective: perspectiveFor('地支三刑', '乙', bTopLbl),
    })
  })

  // 地支三刑：子卯（無禮之刑），只有兩支不成三支組，逐對判定
  for (const {p: a, lbl: al} of ap) {
    for (const {p: b, lbl: bl} of bp) {
      if (a.branch === b.branch) continue // 同支相遇屬伏吟，不重複標示
      if (pairHit(a.branch, b.branch, [ZIMAO_PAIR])) {
        interactions.push({
          type: '地支三刑',
          aLabel: `甲${al} ${BRANCHES[a.branch]}`,
          bLabel: `乙${bl} ${BRANCHES[b.branch]}`,
          detail: '相刑（子卯，無禮之刑）',
          sentiment: 'tense',
          isDay: al==='日柱'||bl==='日柱',
          narrative: narrativeFor('地支三刑', al, bl),
          aPerspective: perspectiveFor('地支三刑', '甲', al),
          bPerspective: perspectiveFor('地支三刑', '乙', bl),
        })
      }
    }
  }

  // 地支六沖
  for (const {p: a, lbl: al} of ap) {
    for (const {p: b, lbl: bl} of bp) {
      if (pairHit(a.branch, b.branch, LIUCHONG_PAIRS)) {
        interactions.push({
          type: '地支六沖',
          aLabel: `甲${al} ${BRANCHES[a.branch]}`,
          bLabel: `乙${bl} ${BRANCHES[b.branch]}`,
          detail: '相沖',
          sentiment: 'tense',
          isDay: al==='日柱'||bl==='日柱',
          narrative: narrativeFor('地支六沖', al, bl),
          aPerspective: perspectiveFor('地支六沖', '甲', al),
          bPerspective: perspectiveFor('地支六沖', '乙', bl),
        })
      }
    }
  }

  // 地支六害
  for (const {p: a, lbl: al} of ap) {
    for (const {p: b, lbl: bl} of bp) {
      if (pairHit(a.branch, b.branch, LIUHAI_PAIRS)) {
        interactions.push({
          type: '地支六害',
          aLabel: `甲${al} ${BRANCHES[a.branch]}`,
          bLabel: `乙${bl} ${BRANCHES[b.branch]}`,
          detail: '相害',
          sentiment: 'tense',
          isDay: al==='日柱'||bl==='日柱',
          narrative: narrativeFor('地支六害', al, bl),
          aPerspective: perspectiveFor('地支六害', '甲', al),
          bPerspective: perspectiveFor('地支六害', '乙', bl),
        })
      }
    }
  }

  // 地支相破
  for (const {p: a, lbl: al} of ap) {
    for (const {p: b, lbl: bl} of bp) {
      if (pairHit(a.branch, b.branch, XIANGPO_PAIRS)) {
        interactions.push({
          type: '地支相破',
          aLabel: `甲${al} ${BRANCHES[a.branch]}`,
          bLabel: `乙${bl} ${BRANCHES[b.branch]}`,
          detail: '相破',
          sentiment: 'complex',
          isDay: al==='日柱'||bl==='日柱',
          narrative: narrativeFor('地支相破', al, bl),
          aPerspective: perspectiveFor('地支相破', '甲', al),
          bPerspective: perspectiveFor('地支相破', '乙', bl),
        })
      }
    }
  }

  // 日支關係（重點）
  const aDay = ca.day.branch, bDay = cb.day.branch
  let dayBranchNote: string
  let dayBranchSentiment: Sentiment = 'complex'

  if (aDay === bDay) {
    dayBranchNote = ZIXING.includes(aDay)
      ? '日支伏吟兼自刑，兩人同質性高、容易共鳴，但相處模式相似，對彼此的問題缺乏互補視角，同一個坎容易一齊踩'
      : '日支伏吟（比和），兩人同質性高、容易共鳴，但也容易同時陷入同一盲點，缺乏互補視角'
    dayBranchSentiment = 'complex'
  } else if (BRANCH_LIUHE[aDay] === bDay) {
    dayBranchNote = '日支六合，彼此本性相投，相處自然舒適'
    dayBranchSentiment = 'good'
  } else if (pairHit(aDay, bDay, LIUCHONG_PAIRS)) {
    dayBranchNote = '日支相沖，個性差異大，張力強，吸引與摩擦並存'
    dayBranchSentiment = 'tense'
  } else if (
    pairHit(aDay, bDay, [ZIMAO_PAIR]) ||
    SANXING_GROUPS.some(g => g.trio.includes(aDay) && g.trio.includes(bDay))
  ) {
    const zimaoHit = pairHit(aDay, bDay, [ZIMAO_PAIR])
    const g = zimaoHit ? null : SANXING_GROUPS.find(g => g.trio.includes(aDay) && g.trio.includes(bDay))!
    const label = zimaoHit ? '子卯' : g!.label
    const kind = zimaoHit ? '無禮之刑' : g!.kind
    dayBranchNote = `日支相刑（${label}，${kind}），相處中容易出現角力或言語衝突，需要刻意克制與體諒`
    dayBranchSentiment = 'tense'
  } else if (pairHit(aDay, bDay, LIUHAI_PAIRS)) {
    dayBranchNote = '日支相害，相處中容易有暗耗與誤解，需要刻意溝通'
    dayBranchSentiment = 'tense'
  } else if (pairHit(aDay, bDay, XIANGPO_PAIRS)) {
    dayBranchNote = '日支相破，相處會有小磨擦，但不致影響根本感情'
    dayBranchSentiment = 'complex'
  } else if (SANHE_GROUPS.some(g => g.trio.includes(aDay) && g.trio.includes(bDay))) {
    const g = SANHE_GROUPS.find(g => g.trio.includes(aDay) && g.trio.includes(bDay))!
    if (aDay === g.wang || bDay === g.wang) {
      dayBranchNote = `日支半三合${g.elem}局（${g.label}，帶旺神${BRANCHES[g.wang]}），能量同向，雙方有天然的合作默契`
      dayBranchSentiment = 'good'
    } else {
      dayBranchNote = `日支拱合${g.elem}局（${g.label}，缺旺神${BRANCHES[g.wang]}），氣機同向但力弱，默契要靠後天經營`
      dayBranchSentiment = 'complex'
    }
  } else {
    dayBranchNote = '日支無直接沖合，相處平穩，感情走向看整體命局互動'
    dayBranchSentiment = 'complex'
  }

  return {
    interactions,
    dayBranchNote,
    dayBranchSentiment,
    positiveCount: interactions.filter(i => i.sentiment === 'good').length,
    tensionCount:  interactions.filter(i => i.sentiment !== 'good').length,
    readingTags: deriveReadingTags(interactions, dayBranchNote),
  }
}

// 建議延伸閱讀分類：只出標籤字串，實際對應文章／詞彙表由另一模組接手
function deriveReadingTags(interactions: Interaction[], dayBranchNote: string): string[] {
  const tags = new Set<string>()
  if (dayBranchNote.includes('六合')) tags.add('感情相處')
  if (dayBranchNote.includes('相沖')) tags.add('感情格局')
  if (dayBranchNote.includes('伏吟')) tags.add('婚姻穩定度')
  if (dayBranchNote.includes('相刑')) tags.add('刑剋化解')
  if (/三合|拱合/.test(dayBranchNote)) tags.add('合作默契')
  if (interactions.some(i => i.type === '地支三刑')) tags.add('刑剋化解')
  if (interactions.some(i => i.type === '地支六害')) tags.add('溝通與磨合')
  if (interactions.some(i => i.type === '地支相破')) tags.add('相處磨合')
  if (tags.size === 0) tags.add('八字合盤基礎')
  return Array.from(tags)
}
