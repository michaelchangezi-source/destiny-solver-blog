// 五層時間軸：大運、流年、流月、流日、流時，以及流年引動原局（升級計劃書 P1-4）
// 本檔只依賴 bazi-calc，bazi-calc 不反向依賴本檔。
import { STEMS, BRANCHES, jieJD, jdToLocal, dayPillarOf, tenGodOf, daysSince1900 } from './bazi-calc'
import type { BaziResult } from './bazi-calc'

export const JIE_NAMES = [
  '立春', '驚蟄', '清明', '立夏', '芒種', '小暑', '立秋', '白露', '寒露', '立冬', '大雪', '小寒',
]

export interface GanZhi {
  stem: number
  branch: number
  gz: string
  tenGod: string
}

function gz(stem: number, branch: number, dayStem: number): GanZhi {
  return { stem, branch, gz: STEMS[stem] + BRANCHES[branch], tenGod: tenGodOf(dayStem, stem) }
}

// ── 流年 ────────────────────────────────────────────────
export function yearGanZhi(year: number, dayStem: number): GanZhi {
  return gz(((year - 4) % 10 + 10) % 10, ((year - 4) % 12 + 12) % 12, dayStem)
}

// ── 流月（以節氣分界，非曆月）──────────────────────────
export interface MonthCell extends GanZhi {
  jieName: string
  jieDate: string   // 交節日期 M/D
  jieTime: string   // 交節時刻 HH:MM（香港時間）
  startDate: { year: number; month: number; day: number }
}

// 命理年 year 由立春起算，第 12 個月（丑月）的小寒屬於次年一月
function jieStart(year: number, jieIdx: number): number {
  return jieJD(jieIdx === 11 ? year + 1 : year, jieIdx)
}

export function monthCells(year: number, dayStem: number): MonthCell[] {
  const yStem = ((year - 4) % 10 + 10) % 10
  return Array.from({ length: 12 }, (_, i) => {
    const local = jdToLocal(jieStart(year, i))
    const base = gz((yStem % 5 * 2 + 2 + i) % 10, (i + 2) % 12, dayStem)
    return {
      ...base,
      jieName: JIE_NAMES[i],
      jieDate: `${local.month}/${local.day}`,
      jieTime: `${String(local.hour).padStart(2, '0')}:${String(local.minute).padStart(2, '0')}`,
      startDate: { year: local.year, month: local.month, day: local.day },
    }
  })
}

// ── 流日（某個節氣月由交節日至下一個交節日）────────────
export interface DayCell extends GanZhi {
  date: string   // M/D
  year: number
  month: number
  day: number
}

export function dayCells(year: number, jieIdx: number, dayStem: number): DayCell[] {
  const a = jdToLocal(jieStart(year, jieIdx))
  const b = jdToLocal(jieIdx === 11 ? jieJD(year + 1, 0) : jieStart(year, jieIdx + 1))
  const start = daysSince1900(a.year, a.month, a.day)
  const end = daysSince1900(b.year, b.month, b.day)
  const cells: DayCell[] = []
  for (let n = start; n < end; n++) {
    const d = new Date(new Date(1900, 0, 1).getTime() + n * 86400000)
    const [s, br] = dayPillarOf(d.getFullYear(), d.getMonth() + 1, d.getDate())
    cells.push({
      ...gz(s, br, dayStem),
      date: `${d.getMonth() + 1}/${d.getDate()}`,
      year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate(),
    })
  }
  return cells
}

// ── 流時（十二時辰，五鼠遁）────────────────────────────
export interface HourCell extends GanZhi {
  label: string
  range: string
}

const HOUR_RANGES = [
  '23:00–01:00', '01:00–03:00', '03:00–05:00', '05:00–07:00', '07:00–09:00', '09:00–11:00',
  '11:00–13:00', '13:00–15:00', '15:00–17:00', '17:00–19:00', '19:00–21:00', '21:00–23:00',
]

export function hourCells(theDayStem: number, dayStem: number): HourCell[] {
  return Array.from({ length: 12 }, (_, i) => ({
    ...gz(((theDayStem % 5) * 2 + i) % 10, i, dayStem),
    label: `${BRANCHES[i]}時`,
    range: HOUR_RANGES[i],
  }))
}

// ── 流年引動原局：沖、合、刑、害、破、伏吟 ────────────
const LIU_HE: [number, number][] = [[0, 1], [2, 11], [3, 10], [4, 9], [5, 8], [6, 7]]
const LIU_HE_ELEM = ['土', '木', '火', '金', '水', '土']
const LIU_HAI: [number, number][] = [[0, 7], [1, 6], [2, 5], [3, 4], [8, 11], [9, 10]]
const LIU_PO: [number, number][] = [[0, 9], [6, 3], [8, 5], [2, 11], [4, 1], [10, 7]]
const SAN_XING: number[][] = [[2, 5, 8], [1, 10, 7], [0, 3]]
const SAN_XING_NAME = ['寅巳申恃勢之刑', '丑戌未無恩之刑', '子卯無禮之刑']
const ZI_XING = [4, 6, 9, 11]
const TRIOS: [number[], string, number][] = [
  [[8, 0, 4], '水', 0], [[11, 3, 7], '木', 3], [[2, 6, 10], '火', 6], [[5, 9, 1], '金', 9],
]

export interface Interaction {
  pillarLabel: string   // 被引動的柱位
  relation: string      // 沖／合／刑／害／破／伏吟
  detail: string
}

function pairHit(list: [number, number][], a: number, b: number): number {
  return list.findIndex(([x, y]) => (x === a && y === b) || (x === b && y === a))
}

/** 某個地支（流年、流月等）與原局四柱地支的引動關係 */
export function branchInteractions(target: number, chart: BaziResult): Interaction[] {
  const slots: { label: string; branch: number }[] = [
    { label: '年柱', branch: chart.year.branch },
    { label: '月柱', branch: chart.month.branch },
    { label: '日柱', branch: chart.day.branch },
  ]
  if (chart.hour) slots.push({ label: '時柱', branch: chart.hour.branch })

  const out: Interaction[] = []
  for (const s of slots) {
    const t = BRANCHES[target], o = BRANCHES[s.branch]
    if (s.branch === target) {
      out.push({ pillarLabel: s.label, relation: '伏吟', detail: `${t}見${o}，同支伏吟（比和）` })
      if (ZI_XING.includes(target)) {
        out.push({ pillarLabel: s.label, relation: '刑', detail: `${t}${o}自刑` })
      }
      continue
    }
    if ((s.branch - target + 12) % 12 === 6) {
      out.push({ pillarLabel: s.label, relation: '沖', detail: `${t}${o}相沖` })
    }
    const he = pairHit(LIU_HE, target, s.branch)
    if (he >= 0) out.push({ pillarLabel: s.label, relation: '合', detail: `${t}${o}六合化${LIU_HE_ELEM[he]}` })
    const hai = pairHit(LIU_HAI, target, s.branch)
    if (hai >= 0) out.push({ pillarLabel: s.label, relation: '害', detail: `${t}${o}相害` })
    const po = pairHit(LIU_PO, target, s.branch)
    if (po >= 0) out.push({ pillarLabel: s.label, relation: '破', detail: `${t}${o}相破` })
    const xi = SAN_XING.findIndex(g => g.includes(target) && g.includes(s.branch))
    if (xi >= 0) out.push({ pillarLabel: s.label, relation: '刑', detail: `${t}${o}相刑（${SAN_XING_NAME[xi]}）` })
    const tri = TRIOS.find(([g]) => g.includes(target) && g.includes(s.branch))
    if (tri) {
      const [group, elem, king] = tri
      const withKing = target === king || s.branch === king
      out.push({
        pillarLabel: s.label,
        relation: '合',
        detail: withKing
          ? `${t}${o}半三合${elem}局（${group.map(b => BRANCHES[b]).join('')}，帶旺神${BRANCHES[king]}）`
          : `${t}${o}拱合${elem}局（${group.map(b => BRANCHES[b]).join('')}，缺旺神${BRANCHES[king]}，力弱）`,
      })
    }
  }
  return out
}

// ── 一生運程總表：出生年至 +108 年，按大運分組 ──────────
export interface LifeGroup {
  label: string          // 大運干支，或起運前
  startYear: number
  endYear: number
  startAge: number
  years: (GanZhi & { year: number; age: number })[]
}

export function lifeTable(chart: BaziResult, birthYear: number, span = 108): LifeGroup[] {
  const dayStem = chart.day.stem
  const groups: LifeGroup[] = []
  const bounds: { label: string; startAge: number; endAge: number }[] = []
  const first = chart.daYuns[0]?.startAge ?? 0
  if (first > 0) bounds.push({ label: '起運前', startAge: 0, endAge: first - 1 })
  chart.daYuns.forEach((dy, i) => {
    const next = chart.daYuns[i + 1]
    bounds.push({
      label: dy.stemChar + dy.branchChar,
      startAge: dy.startAge,
      endAge: next ? next.startAge - 1 : Math.min(dy.startAge + 9, span),
    })
  })
  const last = bounds[bounds.length - 1]
  if (last && last.endAge < span) bounds.push({ label: '大運之後', startAge: last.endAge + 1, endAge: span })

  for (const b of bounds) {
    if (b.startAge > span) continue
    const years: (GanZhi & { year: number; age: number })[] = []
    for (let age = b.startAge; age <= Math.min(b.endAge, span); age++) {
      const y = birthYear + age
      years.push({ ...yearGanZhi(y, dayStem), year: y, age })
    }
    if (!years.length) continue
    groups.push({
      label: b.label,
      startAge: b.startAge,
      startYear: years[0].year,
      endYear: years[years.length - 1].year,
      years,
    })
  }
  return groups
}
