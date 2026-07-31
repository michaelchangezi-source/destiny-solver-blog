// 命盤資訊層：十二長生、空亡、神煞、納音（升級計劃書 P1-3、§6.2／6.3／6.5）
// 本檔只依賴 bazi-calc 的常數與型別，bazi-calc 不反向依賴本檔。
import { STEMS, BRANCHES } from './bazi-calc'
import type { BaziResult, Pillar } from './bazi-calc'

// ── 十二長生（§6.2）陽干順行、陰干逆行 ──────────────────
export const TWELVE_STAGES = [
  '長生', '沐浴', '冠帶', '臨官', '帝旺', '衰', '病', '死', '墓', '絕', '胎', '養',
]
// 甲亥、乙午、丙寅、丁酉、戊寅、己酉、庚巳、辛子、壬申、癸卯
const CHANG_SHENG_START = [11, 6, 2, 9, 2, 9, 5, 0, 8, 3]

export function twelveStage(dayStem: number, branch: number): string {
  const start = CHANG_SHENG_START[dayStem]
  const dir = dayStem % 2 === 0 ? 1 : -1
  const step = ((branch - start) * dir % 12 + 12) % 12
  return TWELVE_STAGES[step]
}

// ── 空亡／旬空（§6.5）依日柱所屬的旬 ────────────────────
export function emptyBranches(dayStem: number, dayBranch: number): [number, number] {
  const first = ((dayBranch - dayStem + 10) % 12 + 12) % 12
  return [first, (first + 1) % 12]
}

export function xunName(dayStem: number, dayBranch: number): string {
  const offset = ((dayBranch - dayStem) % 12 + 12) % 12
  return `甲${BRANCHES[offset]}旬`
}

// ── 納音（六十甲子）──────────────────────────────────
const NAYIN = [
  '海中金', '爐中火', '大林木', '路旁土', '劍鋒金', '山頭火',
  '澗下水', '城頭土', '白蠟金', '楊柳木', '泉中水', '屋上土',
  '霹靂火', '松柏木', '長流水', '砂中金', '山下火', '平地木',
  '壁上土', '金箔金', '覆燈火', '天河水', '大驛土', '釵釧金',
  '桑柘木', '大溪水', '沙中土', '天上火', '石榴木', '大海水',
]

// 六十甲子序號：解同餘 n ≡ stem (mod 10)、n ≡ branch (mod 12)，每兩組共用一個納音
export function nayin(stem: number, branch: number): string {
  let n = 0
  for (let i = 0; i < 60; i++) {
    if (i % 10 === stem && i % 12 === branch) { n = i; break }
  }
  return NAYIN[Math.floor(n / 2)]
}

// ── 神煞（§6.3）────────────────────────────────────────
export interface ShenShaHit {
  name: string
  category: '吉神' | '凶煞'
  pillars: string[]   // 命中的柱位標籤，例如 ['年', '時']
  basis: string       // 計算基準：從哪一柱起、用哪個規則
}

// 以日干起（表列同 §6.3；羊刃採「陰干取冠帶位」一派）
const BY_DAY_STEM: { name: string; category: '吉神' | '凶煞'; table: string[][] }[] = [
  { name: '天乙貴人', category: '吉神', table: [['丑', '未'], ['子', '申'], ['亥', '酉'], ['亥', '酉'], ['丑', '未'], ['子', '申'], ['丑', '未'], ['寅', '午'], ['卯', '巳'], ['卯', '巳']] },
  { name: '文昌', category: '吉神', table: [['巳'], ['午'], ['申'], ['酉'], ['申'], ['酉'], ['亥'], ['子'], ['寅'], ['卯']] },
  { name: '祿神', category: '吉神', table: [['寅'], ['卯'], ['巳'], ['午'], ['巳'], ['午'], ['申'], ['酉'], ['亥'], ['子']] },
  { name: '羊刃', category: '凶煞', table: [['卯'], ['辰'], ['午'], ['未'], ['午'], ['未'], ['酉'], ['戌'], ['子'], ['丑']] },
  { name: '金輿', category: '吉神', table: [['辰'], ['巳'], ['未'], ['申'], ['未'], ['申'], ['戌'], ['亥'], ['丑'], ['寅']] },
]

// 三合局：0=申子辰、1=亥卯未、2=寅午戌、3=巳酉丑
const TRIO_OF_BRANCH: Record<string, number> = {
  申: 0, 子: 0, 辰: 0,
  亥: 1, 卯: 1, 未: 1,
  寅: 2, 午: 2, 戌: 2,
  巳: 3, 酉: 3, 丑: 3,
}
const TRIO_NAMES = ['申子辰', '亥卯未', '寅午戌', '巳酉丑']

const BY_TRIO: { name: string; category: '吉神' | '凶煞'; table: string[] }[] = [
  { name: '驛馬', category: '吉神', table: ['寅', '巳', '申', '亥'] },
  { name: '桃花', category: '吉神', table: ['酉', '子', '卯', '午'] },
  { name: '華蓋', category: '吉神', table: ['辰', '未', '戌', '丑'] },
  { name: '將星', category: '吉神', table: ['子', '卯', '午', '酉'] },
  { name: '劫煞', category: '凶煞', table: ['巳', '申', '亥', '寅'] },
  { name: '亡神', category: '凶煞', table: ['亥', '寅', '巳', '申'] },
]

const KUI_GANG = ['庚辰', '庚戌', '壬辰', '戊戌']
const HONG_YAN = ['甲午', '乙申', '丙寅', '丁未', '戊辰', '己辰', '庚戌', '辛酉', '壬子', '癸申']

interface Slot { label: string; pillar: Pillar }

function slotsOf(chart: BaziResult): Slot[] {
  const s: Slot[] = [
    { label: '年', pillar: chart.year },
    { label: '月', pillar: chart.month },
    { label: '日', pillar: chart.day },
  ]
  if (chart.hour) s.push({ label: '時', pillar: chart.hour })
  return s
}

/**
 * 計算命盤神煞。三合局類神煞以日支為主基準、年支為輔基準，
 * 每一項都附上計算基準，避免同一神煞在不同命盤用不同起法。
 */
export function computeShenSha(chart: BaziResult): ShenShaHit[] {
  const slots = slotsOf(chart)
  const hits: ShenShaHit[] = []
  const dayStem = chart.day.stem
  const dayStemChar = STEMS[dayStem]

  // 一、以日干起
  for (const rule of BY_DAY_STEM) {
    const targets = rule.table[dayStem]
    const pillars = slots.filter(s => targets.includes(s.pillar.branchChar)).map(s => s.label)
    if (pillars.length) {
      hits.push({
        name: rule.name,
        category: rule.category,
        pillars,
        basis: `以日干${dayStemChar}起，${dayStemChar}見${targets.join('、')}`,
      })
    }
  }

  // 二、以三合局起（日支為主，年支為輔）
  for (const rule of BY_TRIO) {
    for (const base of [
      { label: '日支', branchChar: chart.day.branchChar },
      { label: '年支', branchChar: chart.year.branchChar },
    ]) {
      const trio = TRIO_OF_BRANCH[base.branchChar]
      if (trio === undefined) continue
      const target = rule.table[trio]
      const pillars = slots.filter(s => s.pillar.branchChar === target).map(s => s.label)
      if (!pillars.length) continue
      const basis = `以${base.label}${base.branchChar}起，${TRIO_NAMES[trio]}局，${rule.name}在${target}`
      const existing = hits.find(h => h.name === rule.name)
      if (existing) {
        if (existing.basis !== basis) existing.basis += `；輔以${base.label}${base.branchChar}起亦見`
        continue
      }
      hits.push({ name: rule.name, category: rule.category, pillars, basis })
    }
  }

  // 三、以日柱整柱判定
  const dayGz = chart.day.stemChar + chart.day.branchChar
  if (KUI_GANG.includes(dayGz)) {
    hits.push({ name: '魁罡', category: '凶煞', pillars: ['日'], basis: `以日柱整柱判，日柱${dayGz}屬魁罡四組之一` })
  }
  if (HONG_YAN.includes(dayGz)) {
    hits.push({ name: '紅艷', category: '吉神', pillars: ['日'], basis: `以日柱整柱判，日柱${dayGz}屬紅艷` })
  }

  return hits
}

// 便於介面一次取齊：每柱的十二長生
export function pillarStages(chart: BaziResult): { label: string; stage: string }[] {
  return slotsOf(chart).map(s => ({ label: s.label, stage: twelveStage(chart.day.stem, s.pillar.branch) }))
}
