/**
 * 日柱每日能量 · 關係判定（純函數，無副作用、無 I/O）
 *
 * 輸入：用戶日柱、當日流日干柱
 * 輸出：天干十神、地支關係、日柱標記
 *
 * 定位鐵律（製作說明書 §6.1）：本模組只判「日級引動」，不判命。
 * 十神只作內部鍵，永不出現於介面文字（§3.3）。
 */

import { STEMS, BRANCHES, dayPillarOf, tenGodOf } from '@/lib/bazi-calc'

// ── 型別 ─────────────────────────────────────────────────

/** 天干十神，十種。內部鍵，不出街。 */
export type TenGod =
  | '比肩' | '劫財' | '食神' | '傷官' | '偏財'
  | '正財' | '七殺' | '正官' | '偏印' | '正印'

/** 地支關係，八種（§3.2）。 */
export type BranchRelation =
  | '六合' | '半合' | '沖' | '刑' | '穿害' | '破' | '伏吟' | '無關'

/** 日柱標記，五種（§3.2.3）。修飾層，不參與主鍵（§3.2）。 */
export type DayMark = '日貴' | '日德' | '日刃' | '魁罡' | '八專'

export interface Pillar {
  /** 天干，例如「戊」 */
  stem: string
  /** 地支，例如「寅」 */
  branch: string
}

export interface RelationResult {
  tenGod: TenGod
  branchRelation: BranchRelation
  /** 主鍵 `${十神}_${地支關係}`，共 80 格 */
  key: string
  /** 命中的日柱標記，按 MARK_PRIORITY 排序；可能多於一個 */
  marks: DayMark[]
}

export const TEN_GODS: readonly TenGod[] = [
  '比肩', '劫財', '食神', '傷官', '偏財',
  '正財', '七殺', '正官', '偏印', '正印',
] as const

export const BRANCH_RELATIONS: readonly BranchRelation[] = [
  '六合', '半合', '沖', '刑', '穿害', '破', '伏吟', '無關',
] as const

// ── 地支關係表 ───────────────────────────────────────────
// 與 bazi-daily.ts 同源，此處按本功能需要重列為「對稱配對集」，
// 判定只涉及兩個地支，不需要 bazi-daily 的三柱掃描邏輯。

/** 六合：子丑、寅亥、卯戌、辰酉、巳申、午未 */
const LIU_HE: Record<string, string> = {
  子: '丑', 丑: '子', 寅: '亥', 亥: '寅', 卯: '戌', 戌: '卯',
  辰: '酉', 酉: '辰', 巳: '申', 申: '巳', 午: '未', 未: '午',
}

/** 相沖：子午、丑未、寅申、卯酉、辰戌、巳亥 */
const CHONG: Record<string, string> = {
  子: '午', 午: '子', 丑: '未', 未: '丑', 寅: '申', 申: '寅',
  卯: '酉', 酉: '卯', 辰: '戌', 戌: '辰', 巳: '亥', 亥: '巳',
}

/** 三合局四組。半合＝同一局中任兩支（旺支與否於日級解像度下不再細分）。 */
const SAN_HE_JU: string[][] = [
  ['申', '子', '辰'], // 水
  ['亥', '卯', '未'], // 木
  ['寅', '午', '戌'], // 火
  ['巳', '酉', '丑'], // 金
]

/**
 * 相刑。三刑（寅巳申、丑戌未）、子卯相刑、四自刑（辰午酉亥）全部列出，
 * 由 PRIORITY 仲裁與沖、六合、伏吟的重疊。
 */
const XING: [string, string][] = [
  ['寅', '巳'], ['巳', '申'], ['申', '寅'],
  ['丑', '戌'], ['戌', '未'], ['未', '丑'],
  ['子', '卯'],
  ['辰', '辰'], ['午', '午'], ['酉', '酉'], ['亥', '亥'],
]

/** 相穿（害）：子未、丑午、寅巳、卯辰、申亥、酉戌 */
const CHUAN_HAI: Record<string, string> = {
  子: '未', 未: '子', 丑: '午', 午: '丑', 寅: '巳', 巳: '寅',
  卯: '辰', 辰: '卯', 申: '亥', 亥: '申', 酉: '戌', 戌: '酉',
}

/** 相破：子酉、卯午、辰丑、未戌、寅亥、巳申 */
const PO: Record<string, string> = {
  子: '酉', 酉: '子', 卯: '午', 午: '卯', 辰: '丑', 丑: '辰',
  未: '戌', 戌: '未', 寅: '亥', 亥: '寅', 巳: '申', 申: '巳',
}

/**
 * 關係仲裁優先序。
 *
 * 一對地支可以同時成立多種關係（例如巳申既六合、又相刑、又相破；寅巳既刑又穿；
 * 戌未既刑又破；辰辰既伏吟又自刑）。介面只出一個關係，故必須定死次序。
 *
 * 次序理據：
 *   沖   最先，力度最烈、最具決定性，蓋過其餘。
 *   伏吟 次之，同支重疊為極特殊狀態，其「反覆」之象比自刑更貼合日級體感。
 *   六合 再次，合為定調關係，巳申、寅亥兩組傳統以合為主讀。
 *   半合 同屬合，力度次於六合。
 *   刑   > 穿害 > 破，按力度遞減（開庫四鑰匙「沖最烈、刑次之、破害較輕而綿」）。
 *
 * 此優先序為本功能的實作決定，非典籍原文，改動須經查庫與 Mic 拍板（§六）。
 */
const PRIORITY: BranchRelation[] = ['沖', '伏吟', '六合', '半合', '刑', '穿害', '破']

// ── 日柱標記表 ───────────────────────────────────────────

/** 日貴（日德貴人）：丁酉、丁亥、癸巳、癸卯 */
const RI_GUI = ['丁酉', '丁亥', '癸巳', '癸卯']
/** 日德：甲寅、丙辰、戊辰、庚辰、壬戌 */
const RI_DE = ['甲寅', '丙辰', '戊辰', '庚辰', '壬戌']
/** 日刃：丙午、戊午、壬子 */
const RI_REN = ['丙午', '戊午', '壬子']
/** 魁罡：與 bazi-shensha.ts 的 KUI_GANG 同表，該處供全盤排盤用，此處只判日柱 */
const KUI_GANG = ['庚辰', '庚戌', '壬辰', '戊戌']
/** 八專（干支同氣）：甲寅、乙卯、丁未、戊戌、己未、庚申、辛酉、癸丑 */
const BA_ZHUAN = ['甲寅', '乙卯', '丁未', '戊戌', '己未', '庚申', '辛酉', '癸丑']

/** 一個日柱可命中多個標記（例如甲寅兼日德與八專），介面只出首個。 */
const MARK_PRIORITY: [DayMark, string[]][] = [
  ['日貴', RI_GUI],
  ['日德', RI_DE],
  ['魁罡', KUI_GANG],
  ['日刃', RI_REN],
  ['八專', BA_ZHUAN],
]

// ── 判定 ─────────────────────────────────────────────────

function isSanHePair(a: string, b: string): boolean {
  if (a === b) return false
  return SAN_HE_JU.some(ju => ju.includes(a) && ju.includes(b))
}

function isXingPair(a: string, b: string): boolean {
  return XING.some(([x, y]) => (x === a && y === b) || (x === b && y === a))
}

/** 判定兩個地支的關係，按 PRIORITY 取第一個成立者。 */
export function branchRelationOf(userBranch: string, todayBranch: string): BranchRelation {
  const holds: Record<Exclude<BranchRelation, '無關'>, boolean> = {
    沖: CHONG[userBranch] === todayBranch,
    伏吟: userBranch === todayBranch,
    六合: LIU_HE[userBranch] === todayBranch,
    半合: isSanHePair(userBranch, todayBranch),
    刑: isXingPair(userBranch, todayBranch),
    穿害: CHUAN_HAI[userBranch] === todayBranch,
    破: PO[userBranch] === todayBranch,
  }
  for (const rel of PRIORITY) {
    if (holds[rel as Exclude<BranchRelation, '無關'>]) return rel
  }
  return '無關'
}

/** 判定日柱標記。 */
export function marksOf(pillar: Pillar): DayMark[] {
  const gz = pillar.stem + pillar.branch
  return MARK_PRIORITY.filter(([, table]) => table.includes(gz)).map(([name]) => name)
}

/**
 * 主函數：用戶日柱 × 當日流日柱 → 關係。
 *
 * 十神方向：以用戶日干為日主，流日天干為對象。
 */
export function relate(userDayPillar: Pillar, todayPillar: Pillar): RelationResult {
  const userStemIdx = STEMS.indexOf(userDayPillar.stem)
  const todayStemIdx = STEMS.indexOf(todayPillar.stem)
  if (userStemIdx < 0 || todayStemIdx < 0) {
    throw new Error(`daily-relate：天干不合法 ${userDayPillar.stem}／${todayPillar.stem}`)
  }

  const tenGod = tenGodOf(userStemIdx, todayStemIdx) as TenGod
  const branchRelation = branchRelationOf(userDayPillar.branch, todayPillar.branch)

  return {
    tenGod,
    branchRelation,
    key: `${tenGod}_${branchRelation}`,
    marks: marksOf(userDayPillar),
  }
}

// ── 由生日取日柱 ─────────────────────────────────────────

/**
 * 由出生年月日取日柱。
 *
 * 一律用現有 bazi-calc.dayPillarOf，不自行實作簡化版（§四.5）。
 * 只取曆日，不涉時辰，故無需真太陽時校正；出生於子時者日柱歸屬的
 * 早子／晚子分歧，本功能一律以曆日為準，並於介面說明。
 */
export function dayPillarFromBirth(year: number, month: number, day: number): Pillar {
  const [s, b] = dayPillarOf(year, month, day)
  return { stem: STEMS[s], branch: BRANCHES[b] }
}

/** 日柱是否合法的六十甲子之一（陰陽同性）。用於還原 localStorage 值時把關。 */
export function isValidPillar(stem: string, branch: string): boolean {
  const s = STEMS.indexOf(stem)
  const b = BRANCHES.indexOf(branch)
  if (s < 0 || b < 0) return false
  return s % 2 === b % 2
}
