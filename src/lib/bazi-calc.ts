export const STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸']
export const BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']
export const ELEM_COLORS = ['#5da832','#e05c2a','#b8943a','#a8c0d0','#4a9fd4']

const STEM_ELEM  = [0,0,1,1,2,2,3,3,4,4]
const STEM_YY    = [0,1,0,1,0,1,0,1,0,1]
const BRANCH_ELEM = [4,2,0,0,2,1,1,2,3,3,2,4]

const HIDDEN: Record<number, [number, number][]> = {
  0:  [[8,0]],
  1:  [[5,0],[9,1],[7,2]],
  2:  [[0,0],[2,1],[4,2]],
  3:  [[1,0]],
  4:  [[4,0],[1,1],[9,2]],
  5:  [[2,0],[6,1],[4,2]],
  6:  [[3,0],[5,1]],
  7:  [[5,0],[3,1],[1,2]],
  8:  [[6,0],[8,1],[4,2]],
  9:  [[7,0]],
  10: [[4,0],[7,1],[3,2]],
  11: [[8,0],[0,1]],
}

const TIER_NAMES = ['本氣','中氣','餘氣']
const TEN_GODS   = ['比肩','劫財','食神','傷官','偏財','正財','七殺','正官','偏印','正印']

// ── 節氣精算引擎（太陽視黃經，Meeus 低階公式；交節誤差通常 5–10 分鐘內）──
// 立春／月柱／起運一律按真實交節時刻，無需人工核對。
// ⚠ 同算法亦存在於 destiny.solver/bazi-chart.html，改一處要同步另一處。
// 索引 0=立春..11=小寒，直接對應 monthIdx（0=寅..11=丑）
const JIE_SEED: [number, number][] = [
  [2,4],[3,6],[4,5],[5,6],[6,6],[7,7],[8,7],[9,8],[10,8],[11,7],[12,7],[1,6],
]
const JIE_LONG = [315,345,15,45,75,105,135,165,195,225,255,285]

function sunLong(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0
  const L0 = 280.46646 + 36000.76983*T + 0.0003032*T*T
  const M  = 357.52911 + 35999.05029*T - 0.0001537*T*T
  const Mr = M * Math.PI / 180
  const C = (1.914602 - 0.004817*T - 0.000014*T*T) * Math.sin(Mr)
          + (0.019993 - 0.000101*T) * Math.sin(2*Mr)
          + 0.000289 * Math.sin(3*Mr)
  const Omega = (125.04 - 1934.136*T) * Math.PI / 180
  const lambda = L0 + C - 0.00569 - 0.00478*Math.sin(Omega)
  return ((lambda % 360) + 360) % 360
}
function gregToJD(y: number, m: number, d: number, hourUT: number): number {
  if (m <= 2) { y -= 1; m += 12 }
  const A = Math.floor(y/100), B = 2 - A + Math.floor(A/4)
  return Math.floor(365.25*(y+4716)) + Math.floor(30.6001*(m+1)) + d + hourUT/24 + B - 1524.5
}
// 節氣交節時刻（回傳 JD，UT 基準）；jieIndex 0=立春..11=小寒，year 為該節所屬西曆年
function jieJD(year: number, jieIndex: number): number {
  const [sm, sd] = JIE_SEED[jieIndex]
  let jd = gregToJD(year, sm, sd, 0)
  const target = JIE_LONG[jieIndex]
  for (let i = 0; i < 12; i++) {
    let diff = target - sunLong(jd)
    while (diff > 180) diff -= 360
    while (diff <= -180) diff += 360
    jd += diff / 0.9856474
    if (Math.abs(diff) < 1e-9) break
  }
  return jd
}
// 出生瞬間 JD（時辰 → CST 民用時 → UT）；hourBranch<0（不確定）視為正午
function birthJD(year: number, month: number, day: number, hourBranch: number): number {
  const civ = hourBranch >= 0 ? hourBranch * 2 : 12 // 子=0,丑=2,寅=4..亥=22
  return gregToJD(year, month, day, civ - 8)
}
// 取出生前（含）最近一個節，回傳 monthIdx（0=寅..11=丑）
function monthIdxPrecise(year: number, month: number, day: number, hourBranch: number): number {
  const bjd = birthJD(year, month, day, hourBranch)
  let bestJD = -Infinity, bestIdx = 11
  for (const yy of [year - 1, year, year + 1]) {
    for (let ji = 0; ji < 12; ji++) {
      const tjd = jieJD(yy, ji)
      if (tjd <= bjd && tjd > bestJD) { bestJD = tjd; bestIdx = ji }
    }
  }
  return bestIdx
}
// 出生時辰窗內若有節氣交節（精確分鐘會左右月柱），回傳提示，否則空字串
function computeBoundaryNote(year: number, month: number, day: number, hourBranch: number): string {
  const lo = hourBranch >= 0 ? gregToJD(year, month, day, (hourBranch*2 - 1) - 8) : gregToJD(year, month, day, -8)
  const hi = hourBranch >= 0 ? gregToJD(year, month, day, (hourBranch*2 + 1) - 8) : gregToJD(year, month, day, 24 - 8)
  for (const yy of [year - 1, year, year + 1]) {
    for (let ji = 0; ji < 12; ji++) {
      const tjd = jieJD(yy, ji)
      if (tjd > lo && tjd < hi) return '出生時段剛好跨節氣交界，月柱對精確分鐘敏感，如知確切出生時間請再核對'
    }
  }
  return ''
}

export function stemColor(idx: number): string  { return ELEM_COLORS[STEM_ELEM[idx]] }
export function branchColor(idx: number): string { return ELEM_COLORS[BRANCH_ELEM[idx]] }

export interface HiddenStem {
  char: string
  stemIdx: number
  tenGod: string
  tier: string
}

export interface Pillar {
  stem: number
  branch: number
  stemChar: string
  branchChar: string
  tenGod: string | null
  hiddenStems: HiddenStem[]
}

export interface DaYun {
  stem: number
  branch: number
  stemChar: string
  branchChar: string
  startAge: number
  startYear: number
}

export interface BaziResult {
  year: Pillar
  month: Pillar
  day: Pillar
  hour: Pillar | null
  daYuns: DaYun[]
  startAge: number | null
  boundaryNote: string
}

function tenGodIdx(dayStem: number, target: number): number {
  const de = STEM_ELEM[dayStem], te = STEM_ELEM[target]
  const dy = STEM_YY[dayStem],   ty = STEM_YY[target]
  const same = dy === ty
  const GEN = [1,2,3,4,0], CTR = [2,3,4,0,1]
  if (de === te)       return same ? 0 : 1
  if (GEN[de] === te)  return same ? 2 : 3
  if (GEN[te] === de)  return same ? 8 : 9
  if (CTR[de] === te)  return same ? 4 : 5
  if (CTR[te] === de)  return same ? 6 : 7
  return 0
}

function daysSince1900(y: number, m: number, d: number): number {
  return Math.round((new Date(y, m - 1, d).getTime() - new Date(1900, 0, 1).getTime()) / 86400000)
}

function buildPillar(s: number, b: number, dayStem: number | null): Pillar {
  return {
    stem: s, branch: b,
    stemChar: STEMS[s], branchChar: BRANCHES[b],
    tenGod: dayStem !== null ? TEN_GODS[tenGodIdx(dayStem, s)] : null,
    hiddenStems: (HIDDEN[b] ?? []).map(([hs, tier]) => ({
      char: STEMS[hs], stemIdx: hs,
      tenGod: dayStem !== null ? TEN_GODS[tenGodIdx(dayStem, hs)] : '',
      tier: TIER_NAMES[tier],
    })),
  }
}

export function calculate(
  year: number, month: number, day: number,
  hourBranch: number, gender: 'M' | 'F',
): BaziResult {
  // 年柱（以真實立春交節時刻為界：立春前出生，年柱沿用前一年干支）
  const solarYear = birthJD(year, month, day, hourBranch) >= jieJD(year, 0) ? year : year - 1
  const yStem   = ((solarYear - 4) % 10 + 10) % 10
  const yBranch = ((solarYear - 4) % 12 + 12) % 12

  // 月柱（取出生前最近一個節，0=寅..11=丑）
  const mIdx    = monthIdxPrecise(year, month, day, hourBranch)
  const mStem   = (yStem % 5 * 2 + 2 + mIdx) % 10
  const mBranch = (mIdx + 2) % 12

  // 日柱
  const d       = daysSince1900(year, month, day)
  const dStem   = ((d % 10) + 10) % 10
  const dBranch = ((d + 10) % 12 + 12) % 12

  // 時柱
  const hStem   = hourBranch >= 0 ? ((dStem % 5) * 2 + hourBranch) % 10 : -1
  const hBranch = hourBranch

  // 大運方向
  const direction = ((yStem % 2 === 0) === (gender === 'M')) ? 1 : -1

  // 起運歲數（順排取出生後最近一個節，逆排取出生前最近一個節；3 日 = 1 歲）
  const bjd = birthJD(year, month, day, hourBranch)
  let bestDiff = Infinity
  for (const yy of [year - 1, year, year + 1]) {
    for (let ji = 0; ji < 12; ji++) {
      const diff = jieJD(yy, ji) - bjd
      if (direction === 1  && diff > 0 && diff          < bestDiff) bestDiff = diff
      if (direction === -1 && diff < 0 && Math.abs(diff) < bestDiff) bestDiff = Math.abs(diff)
    }
  }
  const startAge = bestDiff < Infinity ? Math.round(bestDiff / 3 * 10) / 10 : null

  const daYuns: DaYun[] = Array.from({ length: 10 }, (_, i) => {
    const s = ((mStem   + direction * (i + 1)) % 10 + 10) % 10
    const b = ((mBranch + direction * (i + 1)) % 12 + 12) % 12
    const age = Math.round((startAge ?? 0) + i * 10)
    return { stem: s, branch: b, stemChar: STEMS[s], branchChar: BRANCHES[b], startAge: age, startYear: year + age }
  })

  return {
    year:  buildPillar(yStem,  yBranch,  dStem),
    month: buildPillar(mStem,  mBranch,  dStem),
    day:   buildPillar(dStem,  dBranch,  null),
    hour:  hBranch >= 0 ? buildPillar(hStem, hBranch, dStem) : null,
    daYuns, startAge,
    boundaryNote: computeBoundaryNote(year, month, day, hourBranch),
  }
}
