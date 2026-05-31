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
const SANHE_TRIOS:   [number,number,number][] = [[0,4,8],[1,5,9],[2,6,10],[3,7,11]]
const SANHE_ELEM = ['水','木','火','金']

export type InteractionType = '天干五合' | '地支六合' | '地支三合' | '地支六沖' | '地支六害' | '地支相破'
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

  // 地支三合（跨雙方，需至少兩個不同地支）
  SANHE_TRIOS.forEach((trio, ti) => {
    const aHits = ap.filter(({p}) => trio.includes(p.branch))
    const bHits = bp.filter(({p}) => trio.includes(p.branch))
    if (!aHits.length || !bHits.length) return
    // 合併去重，確認不同地支數量 ≥ 2
    const uniqueBranches = new Set([...aHits.map(x=>x.p.branch), ...bHits.map(x=>x.p.branch)])
    if (uniqueBranches.size < 2) return
    const aLabel = aHits.map(x=>`甲${x.lbl} ${BRANCHES[x.p.branch]}`).join('＋')
    const bLabel = bHits.map(x=>`乙${x.lbl} ${BRANCHES[x.p.branch]}`).join('＋')
    const totalHits = aHits.length + bHits.length
    interactions.push({
      type: '地支三合',
      aLabel, bLabel,
      detail: `${totalHits >= 3 && uniqueBranches.size === 3 ? '三合' : '半三合'}${SANHE_ELEM[ti]}局`,
      sentiment: 'good',
      isDay: [...aHits,...bHits].some(x=>x.lbl==='日柱'),
    })
  })

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

  if (BRANCH_LIUHE[aDay] === bDay) {
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
  } else if (SANHE_TRIOS.some(trio => trio.includes(aDay) && trio.includes(bDay))) {
    dayBranchNote = '日支半三合，能量互補，雙方有天然的合作默契'
    dayBranchSentiment = 'good'
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
