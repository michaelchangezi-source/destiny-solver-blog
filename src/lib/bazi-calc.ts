export const STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸']
export const BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']
export const ELEM_COLORS = ['#5da832','#e05c2a','#b8943a','#a8c0d0','#4a9fd4']

const STEM_ELEM  = [0,0,1,1,2,2,3,3,4,4]
const STEM_YY    = [0,1,0,1,0,1,0,1,0,1]
const BRANCH_ELEM = [4,2,0,0,2,1,1,2,3,3,2,4]

const HIDDEN: Record<number, [number, number][]> = {
  0:  [[9,0]],
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
export function jieJD(year: number, jieIndex: number): number {
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
// 24節氣完整列表（太陽視黃經 → 節氣名）
const JIEQI_24: Array<{ long: number; name: string }> = [
  { long: 315, name: '立春' }, { long: 330, name: '雨水' },
  { long: 345, name: '驚蟄' }, { long: 0,   name: '春分' },
  { long: 15,  name: '清明' }, { long: 30,  name: '穀雨' },
  { long: 45,  name: '立夏' }, { long: 60,  name: '小滿' },
  { long: 75,  name: '芒種' }, { long: 90,  name: '夏至' },
  { long: 105, name: '小暑' }, { long: 120, name: '大暑' },
  { long: 135, name: '立秋' }, { long: 150, name: '處暑' },
  { long: 165, name: '白露' }, { long: 180, name: '秋分' },
  { long: 195, name: '寒露' }, { long: 210, name: '霜降' },
  { long: 225, name: '立冬' }, { long: 240, name: '小雪' },
  { long: 255, name: '大雪' }, { long: 270, name: '冬至' },
  { long: 285, name: '小寒' }, { long: 300, name: '大寒' },
]
// 求任意太陽視黃經目標對應的 JD（Newton 迭代，適用全部 24 節氣）
function solarTermJD(year: number, targetLong: number): number {
  const offset = ((targetLong - 280) + 360) % 360
  let jd = 2451545.0 + offset / 0.9856474 + (year - 2000) * 365.25
  for (let i = 0; i < 30; i++) {
    let diff = targetLong - sunLong(jd)
    if (diff > 180) diff -= 360
    if (diff < -180) diff += 360
    if (Math.abs(diff) < 1e-9) break
    jd += diff / 0.9856474
  }
  return jd
}
// 若指定日期（香港時間 UTC+8）為某節氣，回傳節氣名；否則回傳 null
export function getSolarTermOnDate(date: Date): string | null {
  const y = date.getFullYear(), m = date.getMonth() + 1, d = date.getDate()
  const jdStart = gregToJD(y, m, d, -8) // 香港午夜 = 前一天 16:00 UT
  const jdEnd = jdStart + 1
  for (const yr of [y - 1, y, y + 1]) {
    for (const { long, name } of JIEQI_24) {
      const jd = solarTermJD(yr, long)
      if (jd >= jdStart && jd < jdEnd) return name
    }
  }
  return null
}

// 出生瞬間 JD（時辰 → CST 民用時 → UT）；hourBranch<0（不確定）視為正午
function birthJD(year: number, month: number, day: number, hourBranch: number): number {
  const civ = hourBranch >= 0 ? hourBranch * 2 : 12 // 子=0,丑=2,寅=4..亥=22
  return gregToJD(year, month, day, civ - 8)
}
// 取出生前（含）最近一個節，回傳 monthIdx（0=寅..11=丑）
function monthIdxFromJD(bjd: number, refYear: number): number {
  let bestJD = -Infinity, bestIdx = 11
  for (const yy of [refYear - 1, refYear, refYear + 1]) {
    for (let ji = 0; ji < 12; ji++) {
      const tjd = jieJD(yy, ji)
      if (tjd <= bjd && tjd > bestJD) { bestJD = tjd; bestIdx = ji }
    }
  }
  return bestIdx
}
// 出生時段窗內若有節氣交節（精確分鐘會左右月柱），回傳提示，否則空字串
function boundaryNoteFromJD(lo: number, hi: number, refYear: number): string {
  for (const yy of [refYear - 1, refYear, refYear + 1]) {
    for (let ji = 0; ji < 12; ji++) {
      const tjd = jieJD(yy, ji)
      if (tjd > lo && tjd < hi) return '出生時段剛好跨節氣交界，月柱對精確分鐘敏感，如知確切出生時間請再核對'
    }
  }
  return ''
}

// JD（UT）換算為指定時區的曆日與時分，供流月節氣日期顯示用
export function jdToLocal(jd: number, tzHours = 8): { year: number; month: number; day: number; hour: number; minute: number } {
  const local = jd + tzHours / 24
  const z = Math.floor(local + 0.5)
  const f = local + 0.5 - z
  let a = z
  if (z >= 2299161) {
    const alpha = Math.floor((z - 1867216.25) / 36524.25)
    a = z + 1 + alpha - Math.floor(alpha / 4)
  }
  const b = a + 1524
  const c = Math.floor((b - 122.1) / 365.25)
  const dd = Math.floor(365.25 * c)
  const e = Math.floor((b - dd) / 30.6001)
  const dayInt = b - dd - Math.floor(30.6001 * e)
  const month = e < 14 ? e - 1 : e - 13
  const year = month > 2 ? c - 4716 : c - 4715
  const totalMin = Math.round(f * 1440)
  return { year, month, day: dayInt, hour: Math.floor(totalMin / 60) % 24, minute: totalMin % 60 }
}

// ── 真太陽時（P1-1）────────────────────────────────────
// 真太陽時 = 標準時 + 經度時差 + 均時差。兩者量級相當，均時差不可省略。
export const STANDARD_MERIDIAN_DEFAULT = 120

function dayOfYear(year: number, month: number, day: number): number {
  return Math.round((Date.UTC(year, month - 1, day) - Date.UTC(year, 0, 1)) / 86400000) + 1
}

// 均時差（分鐘），全年介乎約 −14 至 +16 分鐘
export function equationOfTime(year: number, month: number, day: number): number {
  const B = (360 / 365) * (dayOfYear(year, month, day) - 81) * Math.PI / 180
  return 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B)
}

export interface SolarTimeOffset {
  lonOffsetMin: number
  eotMin: number
  totalOffsetMin: number
}

// 經度時差＋均時差；longitude 東經為正，standardMeridian 預設 120（UTC+8）
export function solarTimeOffset(
  year: number, month: number, day: number,
  longitude: number, standardMeridian: number = STANDARD_MERIDIAN_DEFAULT,
): SolarTimeOffset {
  const lonOffsetMin = (longitude - standardMeridian) * 4
  const eotMin = equationOfTime(year, month, day)
  return { lonOffsetMin, eotMin, totalOffsetMin: lonOffsetMin + eotMin }
}

// 由 24 小時制時刻取時辰索引（23:00–00:59 為子時）
export function hourBranchOf(hour24: number, minute = 0): number {
  const mins = ((hour24 * 60 + minute) % 1440 + 1440) % 1440
  return Math.floor((((Math.floor(mins / 60) + 1) % 24)) / 2)
}

function shiftDate(year: number, month: number, day: number, delta: number): [number, number, number] {
  const dt = new Date(Date.UTC(year, month - 1, day + delta))
  return [dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate()]
}

function hhmm(mins: number): string {
  const m = ((Math.round(mins) % 1440) + 1440) % 1440
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
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

// 真太陽時校正結果（P1-1）；校正前後兩個時柱同時保留，方便介面並列顯示
export interface SolarTimeInfo {
  longitude: number
  standardMeridian: number
  lonOffsetMin: number
  eotMin: number
  totalOffsetMin: number
  originalTime: string
  correctedTime: string
  dayShift: number
  originalHourBranch: number
  correctedHourBranch: number
  originalHourPillar: string
  correctedHourPillar: string
  hourPillarChanged: boolean
}

// 早子時兩派日柱（P1-2）
export interface ZishiInfo {
  mode: '23' | '00'
  dayPillar23: string
  hourPillar23: string
  dayPillar00: string
  hourPillar00: string
}

export interface CalcOptions {
  hour24?: number            // 0–23，提供時以精確時間取代 hourBranch
  minute?: number            // 0–59
  trueSolarTime?: boolean    // 是否套用真太陽時校正
  longitude?: number         // 出生地經度，東經為正
  standardMeridian?: number  // 時區標準經線，預設 120
  zishiMode?: '23' | '00'    // 子時換日派別，預設 23:00 換日
}

export interface BaziResult {
  year: Pillar
  month: Pillar
  day: Pillar
  hour: Pillar | null
  daYuns: DaYun[]
  startAge: number | null
  boundaryNote: string
  solarTime?: SolarTimeInfo | null
  zishi?: ZishiInfo | null
  hourBranch?: number        // 實際採用的時辰索引，−1 代表不確定時辰
  effectiveTime?: string     // 實際採用的時刻（HH:MM），無精確時間則為空
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

export function daysSince1900(y: number, m: number, d: number): number {
  return Math.round((new Date(y, m - 1, d).getTime() - new Date(1900, 0, 1).getTime()) / 86400000)
}

// 任一天干對日主的十神（供大運流年等時間軸模組共用）
export function tenGodOf(dayStem: number, target: number): string {
  return TEN_GODS[tenGodIdx(dayStem, target)]
}

// 指定曆日的日柱干支索引
export function dayPillarOf(y: number, m: number, d: number): [number, number] {
  const n = daysSince1900(y, m, d)
  return [((n % 10) + 10) % 10, ((n + 10) % 12 + 12) % 12]
}

// 單一地支的藏干＋十神（本／中／餘氣）。抽出來供排盤與回歸測試共用
export function branchHiddenStems(branch: number, dayStem: number | null): HiddenStem[] {
  return (HIDDEN[branch] ?? []).map(([hs, tier]) => ({
    char: STEMS[hs], stemIdx: hs,
    tenGod: dayStem !== null ? TEN_GODS[tenGodIdx(dayStem, hs)] : '',
    tier: TIER_NAMES[tier],
  }))
}

function buildPillar(s: number, b: number, dayStem: number | null): Pillar {
  return {
    stem: s, branch: b,
    stemChar: STEMS[s], branchChar: BRANCHES[b],
    tenGod: dayStem !== null ? TEN_GODS[tenGodIdx(dayStem, s)] : null,
    hiddenStems: branchHiddenStems(b, dayStem),
  }
}

function core(
  year: number, month: number, day: number,
  hourBranch: number, gender: 'M' | 'F',
  opts?: CalcOptions,
): BaziResult {
  const precise = opts?.hour24 !== undefined && opts.hour24 >= 0
  const rawMins = precise ? opts!.hour24! * 60 + (opts!.minute ?? 0) : 0
  const offsetMin = precise && opts!.trueSolarTime
    ? solarTimeOffset(year, month, day, opts!.longitude ?? 114.17, opts!.standardMeridian ?? STANDARD_MERIDIAN_DEFAULT).totalOffsetMin
    : 0
  const effMins  = rawMins + offsetMin
  const dayShift = precise ? Math.floor(effMins / 1440) : 0
  const minsInDay = precise ? ((effMins % 1440) + 1440) % 1440 : 0
  const [cy, cm, cd] = precise ? shiftDate(year, month, day, dayShift) : [year, month, day]
  const effBranch = precise ? hourBranchOf(Math.floor(minsInDay / 60), minsInDay % 60) : hourBranch

  // 出生瞬間（精確時間用實際時分，否則沿用時辰中點）
  const bjd = precise ? gregToJD(cy, cm, cd, minsInDay / 60 - 8) : birthJD(year, month, day, hourBranch)

  // 年柱（以真實立春交節時刻為界：立春前出生，年柱沿用前一年干支）
  const solarYear = bjd >= jieJD(cy, 0) ? cy : cy - 1
  const yStem   = ((solarYear - 4) % 10 + 10) % 10
  const yBranch = ((solarYear - 4) % 12 + 12) % 12

  // 月柱（取出生前最近一個節，0=寅..11=丑）
  const mIdx    = monthIdxFromJD(bjd, cy)
  const mStem   = (yStem % 5 * 2 + 2 + mIdx) % 10
  const mBranch = (mIdx + 2) % 12

  // 日柱（精確時間時，23:00 換日派把 23:00 之後的時段歸入次日）
  const rollover = precise && (opts?.zishiMode ?? '23') === '23' && minsInDay >= 23 * 60 ? 1 : 0
  const d       = daysSince1900(cy, cm, cd + rollover)
  const dStem   = ((d % 10) + 10) % 10
  const dBranch = ((d + 10) % 12 + 12) % 12

  // 時柱
  const hStem   = effBranch >= 0 ? ((dStem % 5) * 2 + effBranch) % 10 : -1
  const hBranch = effBranch

  // 大運方向
  const direction = ((yStem % 2 === 0) === (gender === 'M')) ? 1 : -1

  // 起運歲數（順排取出生後最近一個節，逆排取出生前最近一個節；3 日 = 1 歲）
  let bestDiff = Infinity
  for (const yy of [cy - 1, cy, cy + 1]) {
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

  const lo = precise
    ? gregToJD(cy, cm, cd, (minsInDay - 5) / 60 - 8)
    : (hourBranch >= 0 ? gregToJD(year, month, day, (hourBranch * 2 - 1) - 8) : gregToJD(year, month, day, -8))
  const hi = precise
    ? gregToJD(cy, cm, cd, (minsInDay + 5) / 60 - 8)
    : (hourBranch >= 0 ? gregToJD(year, month, day, (hourBranch * 2 + 1) - 8) : gregToJD(year, month, day, 24 - 8))

  return {
    year:  buildPillar(yStem,  yBranch,  dStem),
    month: buildPillar(mStem,  mBranch,  dStem),
    day:   buildPillar(dStem,  dBranch,  dStem),
    hour:  hBranch >= 0 ? buildPillar(hStem, hBranch, dStem) : null,
    daYuns, startAge,
    boundaryNote: boundaryNoteFromJD(lo, hi, cy),
    hourBranch: hBranch,
    effectiveTime: precise ? hhmm(minsInDay) : '',
    solarTime: null,
    zishi: null,
  }
}

const gzOf = (p: Pillar | null) => (p ? p.stemChar + p.branchChar : '')

/**
 * 排盤主入口。
 * 原有五參數呼叫方式（year, month, day, hourBranch, gender）維持不變；
 * 第六個 opts 為選填，提供精確時分、真太陽時、子時換日派別。
 */
export function calculate(
  year: number, month: number, day: number,
  hourBranch: number, gender: 'M' | 'F',
  opts?: CalcOptions,
): BaziResult {
  const res = core(year, month, day, hourBranch, gender, opts)
  const precise = opts?.hour24 !== undefined && opts.hour24 >= 0
  if (!precise) return res

  const rawMins = opts!.hour24! * 60 + (opts!.minute ?? 0)

  // 真太陽時：同時保留校正前後兩個時柱，讓使用者看得見差異
  if (opts!.trueSolarTime) {
    const plain = core(year, month, day, hourBranch, gender, { ...opts, trueSolarTime: false })
    const off = solarTimeOffset(year, month, day, opts!.longitude ?? 114.17, opts!.standardMeridian ?? STANDARD_MERIDIAN_DEFAULT)
    res.solarTime = {
      longitude: opts!.longitude ?? 114.17,
      standardMeridian: opts!.standardMeridian ?? STANDARD_MERIDIAN_DEFAULT,
      lonOffsetMin: off.lonOffsetMin,
      eotMin: off.eotMin,
      totalOffsetMin: off.totalOffsetMin,
      originalTime: hhmm(rawMins),
      correctedTime: res.effectiveTime ?? '',
      dayShift: Math.floor((rawMins + off.totalOffsetMin) / 1440),
      originalHourBranch: plain.hourBranch ?? -1,
      correctedHourBranch: res.hourBranch ?? -1,
      originalHourPillar: gzOf(plain.hour),
      correctedHourPillar: gzOf(res.hour),
      hourPillarChanged: gzOf(plain.hour) !== gzOf(res.hour),
    }
  }

  // 早子時：兩派日柱不同，兩個結果都要拿得到
  const effMinsInDay = ((Math.round(rawMins + (res.solarTime?.totalOffsetMin ?? 0)) % 1440) + 1440) % 1440
  if (effMinsInDay >= 23 * 60) {
    const mode = (opts!.zishiMode ?? '23') as '23' | '00'
    const other = core(year, month, day, hourBranch, gender, { ...opts, zishiMode: mode === '23' ? '00' : '23' })
    const a = { day: gzOf(res.day), hour: gzOf(res.hour) }
    const b = { day: gzOf(other.day), hour: gzOf(other.hour) }
    const p23 = mode === '23' ? a : b
    const p00 = mode === '23' ? b : a
    res.zishi = {
      mode,
      dayPillar23: p23.day, hourPillar23: p23.hour,
      dayPillar00: p00.day, hourPillar00: p00.hour,
    }
  }

  return res
}
