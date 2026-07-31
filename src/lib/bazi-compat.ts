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

export type InteractionType = '天干五合' | '地支六合' | '地支三合' | '地支六沖' | '地支六害' | '地支相破' | '地支伏吟'
export type Sentiment = 'good' | 'tense' | 'complex'

export interface Interaction {
  type: InteractionType
  aLabel: string
  bLabel: string
  detail: string
  sentiment: Sentiment
  isDay: boolean
}

export interface CompatResult {
  interactions: Interaction[]
  dayBranchNote: string
  dayBranchSentiment: Sentiment
  positiveCount: number
  tensionCount: number
}

function pairHit(a: number, b: number, pairs: [number,number][]): boolean {
  return pairs.some(([x,y]) => (a===x&&b===y)||(a===y&&b===x))
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
      })
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
  }
}
