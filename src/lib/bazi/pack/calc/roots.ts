// 日主通根：找原局地支藏干中與日主同五行的干（包括比肩、劫財）
import type { BaziResult } from '@/lib/bazi-calc'
import { BRANCHES } from '@/lib/bazi-calc'

// 五行索引：0=木 1=火 2=土 3=金 4=水
const STEM_ELEM = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4]

export interface RootHit {
  branch: string     // 地支字
  pillar: string     // 年支/月支/日支/時支
  stem: string       // 藏干字
  tier: string       // 本氣/中氣/餘氣
}

export function findRoots(chart: BaziResult): RootHit[] {
  const dayStemElem = STEM_ELEM[chart.day.stem]
  const pillars = [
    { pillar: '年支', branch: chart.year },
    { pillar: '月支', branch: chart.month },
    { pillar: '日支', branch: chart.day },
  ]
  if (chart.hour) pillars.push({ pillar: '時支', branch: chart.hour })

  const hits: RootHit[] = []
  for (const { pillar, branch } of pillars) {
    for (const hs of branch.hiddenStems) {
      if (STEM_ELEM[hs.stemIdx] === dayStemElem) {
        hits.push({
          branch: BRANCHES[branch.branch],
          pillar,
          stem: hs.char,
          tier: hs.tier,
        })
      }
    }
  }
  return hits
}

// 格式化為「年支午（丁·本氣）、時支未（丁·中氣）」
export function formatRoots(roots: RootHit[]): string {
  if (roots.length === 0) return '無'
  return roots.map((r) => `${r.pillar}${r.branch}（${r.stem}·${r.tier}）`).join('、')
}
