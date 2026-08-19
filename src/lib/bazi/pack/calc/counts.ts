// 五行與十神計數（兩套：不含藏干 / 含藏干加權）
import type { BaziResult } from '@/lib/bazi-calc'

const STEM_ELEM = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4]
const BRANCH_ELEM = [4, 2, 0, 0, 2, 1, 1, 2, 3, 3, 2, 4]
const ELEM_NAMES = ['木', '火', '土', '金', '水']
const TEN_GODS = ['比肩', '劫財', '食神', '傷官', '偏財', '正財', '七殺', '正官', '偏印', '正印']
const TIER_WEIGHT: Record<string, number> = { 本氣: 1.0, 中氣: 0.6, 餘氣: 0.3 }

export interface Counts {
  elemNoHidden: Record<string, number>
  elemWithHidden: Record<string, number>
  tenGodNoHidden: Record<string, number>
  tenGodWithHidden: Record<string, number>
}

export function computeCounts(chart: BaziResult): Counts {
  const pillars = [chart.year, chart.month, chart.day, ...(chart.hour ? [chart.hour] : [])]

  const elemNo: Record<string, number> = Object.fromEntries(ELEM_NAMES.map((e) => [e, 0]))
  const elemWith: Record<string, number> = Object.fromEntries(ELEM_NAMES.map((e) => [e, 0]))
  const tgNo: Record<string, number> = Object.fromEntries(TEN_GODS.map((g) => [g, 0]))
  const tgWith: Record<string, number> = Object.fromEntries(TEN_GODS.map((g) => [g, 0]))

  for (const p of pillars) {
    // 天干計數（日干仍計五行，但不計十神）
    elemNo[ELEM_NAMES[STEM_ELEM[p.stem]]] += 1
    elemWith[ELEM_NAMES[STEM_ELEM[p.stem]]] += 1.0
    if (p !== chart.day && p.tenGod) {
      tgNo[p.tenGod] += 1
      tgWith[p.tenGod] += 1.0
    }

    // 地支
    const branchElem = ELEM_NAMES[BRANCH_ELEM[p.branch]]
    elemNo[branchElem] += 1  // 不含藏干：地支本氣計1

    // 含藏干：藏干加權
    for (const hs of p.hiddenStems) {
      const w = TIER_WEIGHT[hs.tier] ?? 0
      elemWith[ELEM_NAMES[STEM_ELEM[hs.stemIdx]]] += w
      if (hs.tenGod) tgWith[hs.tenGod] += w
    }
    // 不含藏干：地支本氣十神（首位藏干）
    if (p.hiddenStems.length > 0 && p.hiddenStems[0].tenGod) {
      tgNo[p.hiddenStems[0].tenGod] += 1
    }
  }

  // 四捨五入至一位小數
  const round1 = (n: number) => Math.round(n * 10) / 10

  return {
    elemNoHidden: Object.fromEntries(Object.entries(elemNo).map(([k, v]) => [k, round1(v)])),
    elemWithHidden: Object.fromEntries(Object.entries(elemWith).map(([k, v]) => [k, round1(v)])),
    tenGodNoHidden: Object.fromEntries(Object.entries(tgNo).map(([k, v]) => [k, round1(v)])),
    tenGodWithHidden: Object.fromEntries(Object.entries(tgWith).map(([k, v]) => [k, round1(v)])),
  }
}

// 格式化五行計數：「木 0 ｜火 4 ｜土 2 ｜金 1 ｜水 1」
export function formatElem(rec: Record<string, number>): string {
  return ELEM_NAMES.map((e) => `${e} ${rec[e]}`).join(' ｜ ')
}

// 格式化十神計數：不含藏干版（只列非零，由大到小），含藏干版（全列）
export function formatTenGodNoHidden(rec: Record<string, number>): string {
  const nonZero = Object.entries(rec)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `${k} ${v}`)
    .join('、')
  return (nonZero || '無') + '；其餘 0'
}

export function formatTenGodWithHidden(rec: Record<string, number>): string {
  return TEN_GODS
    .map((g) => `${g} ${rec[g]}`)
    .join('、')
}
