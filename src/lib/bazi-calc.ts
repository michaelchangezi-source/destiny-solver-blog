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

const JIE_APPROX: [number, number][] = [
  [2,4],[3,6],[4,5],[5,6],[6,6],[7,7],
  [8,7],[9,8],[10,8],[11,7],[12,7],[1,6],
]

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
  // 年柱（以立春為界：立春前出生，年柱沿用前一年干支）
  // 立春交節近似 JIE_APPROX[0] = [2,4]，與月柱、起運使用同一套節氣基準
  const [LICHUN_M, LICHUN_D] = JIE_APPROX[0]
  const solarYear = (month < LICHUN_M || (month === LICHUN_M && day < LICHUN_D)) ? year - 1 : year
  const yStem   = ((solarYear - 4) % 10 + 10) % 10
  const yBranch = ((solarYear - 4) % 12 + 12) % 12

  // 月柱
  const jieOrder = [2,3,4,5,6,7,8,9,10,11,12,1]
  let mIdx = jieOrder.indexOf(month)
  if (mIdx === -1) mIdx = 0
  if (day < JIE_APPROX[mIdx][1]) mIdx = (mIdx - 1 + 12) % 12
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

  // 起運歲數
  const birthDate = new Date(year, month - 1, day)
  let bestDiff = Infinity
  for (let yi = -1; yi <= 1; yi++) {
    for (let ji = 0; ji < 12; ji++) {
      const [jm, jd] = JIE_APPROX[ji]
      const diff = (new Date(year + yi, jm - 1, jd).getTime() - birthDate.getTime()) / 86400000
      if (direction === 1  && diff > 0           && diff          < bestDiff) bestDiff = diff
      if (direction === -1 && diff < 0           && Math.abs(diff) < bestDiff) bestDiff = Math.abs(diff)
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
  }
}
