// 原局干支互動：四柱之間所有對（天干6對＋地支6對），含三合三會跨柱組合
// 拱合（半三合不帶旺神）不納入（規格 OFF by default）
import type { BaziResult } from '@/lib/bazi-calc'
import { STEMS, BRANCHES } from '@/lib/bazi-calc'

// ── 天干合化 ──────────────────────────────────────────────
const GAN_HE: [number, number, string][] = [
  [0, 5, '土'], [1, 6, '金'], [2, 7, '水'], [3, 8, '木'], [4, 9, '火'],
]
// 天干沖：索引差6
function ganChong(a: number, b: number) { return Math.abs(a - b) === 6 }

// ── 地支六合 / 六沖 / 六害 / 六破 / 三刑 / 自刑 ──────────
const ZHI_HE: [number, number, string][] = [
  [0, 1, '土'], [2, 11, '木'], [3, 10, '火'], [4, 9, '金'], [5, 8, '水'], [6, 7, '土'],
]
const ZHI_HAI: [number, number][] = [[0, 7], [1, 6], [2, 5], [3, 4], [8, 11], [9, 10]]
const ZHI_PO: [number, number][] = [[0, 9], [6, 3], [8, 5], [2, 11], [4, 1], [10, 7]]
const SAN_XING: [number[], string][] = [
  [[2, 5, 8], '寅巳申恃勢之刑'], [[1, 10, 7], '丑戌未無恩之刑'], [[0, 3], '子卯無禮之刑'],
]
const ZI_XING = [4, 6, 9, 11]   // 辰午酉亥 自刑

// 三合：[完整三合branches, 五行, 旺神branch]
const SAN_HE: [number[], string, number][] = [
  [[8, 0, 4], '水', 0], [[11, 3, 7], '木', 3], [[2, 6, 10], '火', 6], [[5, 9, 1], '金', 9],
]

// 三會：[branches, 五行]
const SAN_HUI: [number[], string][] = [
  [[2, 3, 4], '木'], [[5, 6, 7], '火'], [[8, 9, 10], '金'], [[11, 0, 1], '水'],
]

export interface ChartInteraction {
  type: '天干' | '地支' | '三合' | '三會'
  relation: string    // 合/沖/害/破/刑/自刑/伏吟/三合/半合/三會
  positions: string[] // e.g. ['年干', '月支']
  detail: string      // 展示用文字
}

function pairMatch(list: [number, number][], a: number, b: number) {
  return list.some(([x, y]) => (x === a && y === b) || (x === b && y === a))
}

const COL_LABEL = ['年', '月', '日', '時']

export function computeInteractions(chart: BaziResult): ChartInteraction[] {
  const pillars = [chart.year, chart.month, chart.day, ...(chart.hour ? [chart.hour] : [])]
  const n = pillars.length
  const out: ChartInteraction[] = []

  // ── 逐對天干互動 ──────────────────────────────────────────
  for (let i = 0; i < n - 1; i++) {
    for (let j = i + 1; j < n; j++) {
      const sa = pillars[i].stem, sb = pillars[j].stem
      const la = COL_LABEL[i] + '干', lb = COL_LABEL[j] + '干'
      const ca = STEMS[sa], cb = STEMS[sb]
      const he = GAN_HE.find(([x, y]) => (x === sa && y === sb) || (x === sb && y === sa))
      if (he) out.push({ type: '天干', relation: '合', positions: [la, lb], detail: `${ca}${cb}合化${he[2]}` })
      if (ganChong(sa, sb)) out.push({ type: '天干', relation: '沖', positions: [la, lb], detail: `${ca}${cb}相沖` })
    }
  }

  // ── 逐對地支互動 ──────────────────────────────────────────
  const branches = pillars.map((p, i) => ({ b: p.branch, label: COL_LABEL[i] + '支' }))
  for (let i = 0; i < branches.length - 1; i++) {
    for (let j = i + 1; j < branches.length; j++) {
      const { b: bi, label: li } = branches[i]
      const { b: bj, label: lj } = branches[j]
      // i < j ⟹ smaller index first (column order 年→月→日→時)
      const ci = BRANCHES[bi], cj = BRANCHES[bj]

      // 伏吟
      if (bi === bj) {
        out.push({ type: '地支', relation: '伏吟', positions: [li, lj], detail: `${ci}${cj}伏吟（同支比和）` })
        if (ZI_XING.includes(bi)) {
          out.push({ type: '地支', relation: '自刑', positions: [li, lj], detail: `${ci}${cj}自刑` })
        }
        continue
      }

      // 六沖
      if ((bi - bj + 12) % 12 === 6 || (bj - bi + 12) % 12 === 6) {
        out.push({ type: '地支', relation: '沖', positions: [li, lj], detail: `${ci}${cj}相沖` })
      }
      // 六合
      const he = ZHI_HE.find(([x, y]) => (x === bi && y === bj) || (x === bj && y === bi))
      if (he) out.push({ type: '地支', relation: '合', positions: [li, lj], detail: `${ci}${cj}六合化${he[2]}` })
      // 六害
      if (pairMatch(ZHI_HAI, bi, bj)) out.push({ type: '地支', relation: '害', positions: [li, lj], detail: `${ci}${cj}相害` })
      // 六破
      if (pairMatch(ZHI_PO, bi, bj)) out.push({ type: '地支', relation: '破', positions: [li, lj], detail: `${ci}${cj}相破` })
      // 三刑（含子卯2-member刑）
      const xing = SAN_XING.find(([g]) => g.includes(bi) && g.includes(bj))
      if (xing) out.push({ type: '地支', relation: '刑', positions: [li, lj], detail: `${ci}${cj}相刑（${xing[1]}）` })
      // 自刑（單柱同地支已在伏吟處理；此處無需再查）
    }
  }

  // ── 三合（完整三合 / 半合帶旺神）──────────────────────────
  const branchSet = branches.map((b) => b.b)
  for (const [group, elem, king] of SAN_HE) {
    const matches = branches.filter((b) => group.includes(b.b))
    if (matches.length === 3) {
      // 完整三合
      const labels = matches.map((b) => b.label).join('、')
      const chars = matches.map((b) => BRANCHES[b.b]).join('')
      out.push({ type: '三合', relation: '三合', positions: matches.map((b) => b.label), detail: `${chars}三合${elem}局` })
    } else if (matches.length === 2) {
      const hasKing = matches.some((b) => b.b === king)
      if (hasKing) {
        // 半合帶旺神（有效）
        const labels = matches.map((b) => b.label).join('、')
        const chars = matches.map((b) => BRANCHES[b.b]).join('')
        out.push({ type: '三合', relation: '半合', positions: matches.map((b) => b.label), detail: `${chars}半三合${elem}局（帶旺神${BRANCHES[king]}）` })
      }
      // 半合不帶旺神 = 拱合，不納入
    }
  }

  // ── 三會（完整才報）───────────────────────────────────────
  for (const [group, elem] of SAN_HUI) {
    const matches = branches.filter((b) => group.includes(b.b))
    if (matches.length === 3) {
      const chars = matches.map((b) => BRANCHES[b.b]).join('')
      out.push({ type: '三會', relation: '三會', positions: matches.map((b) => b.label), detail: `${chars}三會${elem}方` })
    }
  }

  return out
}

// 格式化輸出：「年支午、時支未 六合化土」每條一行
export function formatInteractions(interactions: ChartInteraction[]): string {
  if (interactions.length === 0) return '無'
  return interactions.map((i) => `${i.positions.join('、')} ${i.detail}`).join('\n')
}
