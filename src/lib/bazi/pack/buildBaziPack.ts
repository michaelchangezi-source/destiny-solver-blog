// 八字命盤資料包生成器（格式版本 ds-bazi-pack/1.0）
// 規格：03_資料包模板_八字與合盤.md
// ⚠ 只產生文字，不含任何吉凶評語或格局結論。
import { STEMS, BRANCHES, tenGodOf } from '@/lib/bazi-calc'
import type { BaziResult } from '@/lib/bazi-calc'
import { twelveStage, nayin, emptyBranches, computeShenSha } from '@/lib/bazi-shensha'
import { yearGanZhi, branchInteractions, JIE_NAMES } from '@/lib/bazi-timeline'
import { pillarKongWang } from './calc/kongWang'
import { monthStateMap, formatMonthState } from './calc/monthState'
import { findRoots } from './calc/roots'
import { computeCounts } from './calc/counts'
import { computeInteractions } from './calc/interactions'

export type PackLevel = 'full' | 'basic'

export interface BaziPackInput {
  result: BaziResult
  gender: 'M' | 'F'
  year: number
  month: number
  day: number
  /** -1 = 不確定時辰 */
  hourBranchIndex: number
  timeMode: 'branch' | 'exact' | 'unknown'
  /** 精確模式：鐘表時 */
  clock?: { h: number; m: number }
  /** 精確模式：真太陽時是否已校正 */
  trueSolar?: { applied: boolean; lon?: number; deltaMin?: number; usedTime?: string }
  /** 早子時換日規則：'23'（早子換日）或 '00'（00:00 換日） */
  zishiRule: '23' | '00'
  /** 出生地名稱，預設 '香港（預設）' */
  placeName?: string
  /** 跨節氣警示 */
  nearSolarTermWarning?: string
  currentYear: number
  level: PackLevel
  permalink: string
  generatedOn: string   // YYYY-MM-DD
  /** 完整包延伸閱讀（3-5 篇） */
  articles?: Array<{ title: string; url: string }>
}

const HOUR_RANGES = [
  '23:00–01:00','01:00–03:00','03:00–05:00','05:00–07:00','07:00–09:00','09:00–11:00',
  '11:00–13:00','13:00–15:00','15:00–17:00','17:00–19:00','19:00–21:00','21:00–23:00',
]
const HOUR_LABELS = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']

const STEM_ELEM = [0,0,1,1,2,2,3,3,4,4]
const ELEM_NAMES = ['木','火','土','金','水']

// 地支branch index → JIE_NAMES index：寅=2→0(立春), ..., 亥=11→9(立冬), 子=0→10(大雪), 丑=1→11(小寒)
function branchToJieIdx(branch: number): number {
  return (branch - 2 + 12) % 12
}

export function buildBaziPack(input: BaziPackInput): string {
  const { result, gender, year, month, day, hourBranchIndex, timeMode,
          clock, zishiRule, level, permalink, generatedOn } = input
  const placeName = input.placeName ?? '香港（預設）'
  const lines: string[] = []

  // ── 標頭 ──────────────────────────────────────────────────
  lines.push('═══ 八字命盤資料包（給 AI 解讀用）═══')
  lines.push(`來源：命運解決師 陳卓賢 · destinysolver.com ｜ 格式：ds-bazi-pack/1.1 ｜ 生成：${generatedOn}`)
  lines.push(`重開此盤：${permalink}`)

  // ── 排盤口徑 ──────────────────────────────────────────────
  lines.push('')
  lines.push('■ 排盤口徑')
  lines.push('- 曆法：公曆輸入；年柱以立春換年、月柱以節氣換月（非農曆初一）')

  if (timeMode === 'branch') {
    if (hourBranchIndex >= 0) {
      const hLabel = HOUR_LABELS[hourBranchIndex]
      const hRange = HOUR_RANGES[hourBranchIndex]
      lines.push(`- 時辰：${hLabel}時（${hRange}），按時辰排時柱；未輸入分鐘級時間，未做真太陽時校正`)
    } else {
      lines.push('- 時辰：不詳；本包只排年月日三柱，時柱欄從缺；大運起運以正午估算，精度有限')
    }
  } else if (timeMode === 'exact' && clock) {
    const hh = String(clock.h).padStart(2, '0'), mm = String(clock.m).padStart(2, '0')
    const tsText = input.trueSolar?.applied
      ? `已校正（經度 ${input.trueSolar?.lon}，差 ${input.trueSolar?.deltaMin && input.trueSolar.deltaMin > 0 ? '+' : ''}${input.trueSolar?.deltaMin} 分）；排盤用時：${input.trueSolar?.usedTime}`
      : '未校正'
    lines.push(`- 出生時間：${hh}:${mm}（鐘表時）；真太陽時：${tsText}`)
  } else if (timeMode === 'unknown') {
    lines.push('- 時辰：不詳；本包只排年月日三柱，時柱欄從缺；大運起運以正午估算，精度有限')
  }

  lines.push(`- 子時：${zishiRule === '23' ? '23:00 起算翌日（早子時換日）' : '00:00 換日'}`)
  lines.push('- 起運：按出生時刻與最近節氣交節的距離折算，精度 0.1 歲')
  lines.push('- 神煞：三合局類以日支為主基準、年支為輔；羊刃採「陰干取冠帶位」一派（乙丁己辛癸日主亦立刃）')
  lines.push('- 本包只列結構事實，不含吉凶判斷；流派口徑不同者請以自身所學為準，但請先以本包干支為事實基礎')
  if (input.nearSolarTermWarning) {
    lines.push(`- ⚠ ${input.nearSolarTermWarning}`)
  }

  // ── 命主 ──────────────────────────────────────────────────
  lines.push('')
  lines.push('■ 命主')
  const genderLabel = gender === 'F' ? '女命' : '男命'
  const timeLabel = timeMode === 'unknown' ? '時辰不詳'
    : hourBranchIndex >= 0 ? `${HOUR_LABELS[hourBranchIndex]}時`
    : clock ? `${String(clock.h).padStart(2,'0')}:${String(clock.m).padStart(2,'0')}`
    : '時辰不詳'
  lines.push(`${genderLabel} ｜ ${year} 年 ${month} 月 ${day} 日 ${timeLabel} ｜ 出生地：${placeName}`)

  // ── 四柱 ──────────────────────────────────────────────────
  lines.push('')
  lines.push('■ 四柱')

  const pillarDefs = [
    { p: result.year,  label: '年柱', isDay: false },
    { p: result.month, label: '月柱', isDay: false },
    { p: result.day,   label: '日柱', isDay: true  },
    ...(result.hour ? [{ p: result.hour, label: '時柱', isDay: false }] : []),
  ]

  for (const { p, label, isDay } of pillarDefs) {
    const tgLabel = isDay ? '日主' : `${p.tenGod}`
    const hiddenStr = p.hiddenStems.map((h) =>
      `${h.char}(${h.tenGod}·${h.tier})`
    ).join('、')
    const stage = twelveStage(result.day.stem, p.branch)
    const ny = nayin(p.stem, p.branch)
    const kw = pillarKongWang(p.stem, p.branch)
    const tg = isDay ? '天干：日主' : `天干十神：${tgLabel}`
    lines.push(`- ${label} ${p.stemChar}${p.branchChar} ｜${tg} ｜地支藏干：${hiddenStr} ｜星運：${stage} ｜納音：${ny} ｜空亡：${kw}`)
  }

  // 日主、月令、月令狀態、通根
  const dayStemChar = result.day.stemChar
  const dayStemElem = ELEM_NAMES[STEM_ELEM[result.day.stem]]
  const dayStemYin = result.day.stem % 2 === 1 ? '陰干' : '陽干'
  const monthBranch = result.month.branch
  const jieIdx = branchToJieIdx(monthBranch)
  const jieFrom = JIE_NAMES[jieIdx]
  const jieTo = JIE_NAMES[(jieIdx + 1) % 12]
  const stateMap = monthStateMap(monthBranch)
  const stateStr = formatMonthState(stateMap)
  const roots = findRoots(result)
  const rootsStr = roots.length > 0
    ? roots.map((r) => `${r.pillar}${r.branch}（${r.stem}·${r.tier}）`).join('、')
    : '無'

  lines.push(`- 日主：${dayStemChar}${dayStemElem}（${dayStemYin}）｜月令：${BRANCHES[monthBranch]}（${jieFrom}後、${jieTo}前）｜月令五行狀態：${stateStr}`)
  lines.push(`- 日主通根：${rootsStr}`)
  lines.push('- 星運＝日主在該支的十二長生位；空亡以該柱所在旬計')

  // ── 五行與十神計數 ─────────────────────────────────────────
  lines.push('')
  lines.push('■ 五行與十神計數（結構計數，不等於旺衰）')
  const counts = computeCounts(result)

  const elemNoStr = ELEM_NAMES.map((e) => `${e} ${counts.elemNoHidden[e]}`).join(' ｜ ')
  const elemWithStr = ELEM_NAMES.map((e) => `${e} ${counts.elemWithHidden[e]}`).join(' ｜ ')
  lines.push(`- 五行（天干＋地支本氣各計 1）：${elemNoStr}`)

  if (level === 'full') {
    lines.push(`- 五行（加計藏干：本氣 1／中氣 0.6／餘氣 0.3）：${elemWithStr}`)
  }

  // 十神（不含藏干）：只列非零項由大到小
  const TEN_GOD_ORDER = ['比肩','劫財','食神','傷官','偏財','正財','七殺','正官','偏印','正印']
  const tgNoEntries = TEN_GOD_ORDER
    .map((g) => ({ g, v: counts.tenGodNoHidden[g] ?? 0 }))
    .filter(({ v }) => v > 0)
    .sort((a, b) => b.v - a.v)
  const tgNoStr = tgNoEntries.map(({ g, v }) => `${g} ${v}`).join('、')
  lines.push(`- 十神（不計日主；天干＋地支本氣）：${tgNoStr || '（日主外無其他干支出現）'}；其餘 0`)

  if (level === 'full') {
    const tgWithStr = TEN_GOD_ORDER
      .map((g) => `${g} ${counts.tenGodWithHidden[g] ?? 0}`)
      .join('、')
    lines.push(`- 十神（加計藏干）：${tgWithStr}`)
  }

  // ── 原局干支互動 ──────────────────────────────────────────
  lines.push('')
  lines.push('■ 原局干支互動（只列結構；貼鄰者力度較實、隔位者較虛，輕重由解讀者判；六合／半合所標化五行只係化氣名，是否合化由解讀層判斷）')
  const interactions = computeInteractions(result)

  const stemInts = interactions.filter((i) => i.type === '天干')
  // 同字天干
  const stemCount: Record<string, string[]> = {}
  for (let i = 0; i < pillarDefs.length; i++) {
    const c = pillarDefs[i].p.stemChar
    if (!stemCount[c]) stemCount[c] = []
    stemCount[c].push(`${pillarDefs[i].label.slice(0, 1)}干`)
  }
  const repeatedStems = Object.entries(stemCount).filter(([, pos]) => pos.length >= 2)

  if (stemInts.length === 0 && repeatedStems.length === 0) {
    lines.push('- 天干：無五合')
  } else {
    const heStr = stemInts.map((i) => i.detail).join('；') || '無五合'
    const repStr = repeatedStems.map(([c, pos]) => `${c}見 ${pos.length} 次（${pos.join('、')}）`).join('；')
    lines.push(`- 天干：${heStr}${repStr ? '；' + repStr : ''}`)
  }

  const branchInts = interactions.filter((i) => i.type === '地支' || i.type === '三合' || i.type === '三會')

  if (branchInts.length === 0) {
    lines.push('- 地支：無合沖刑害破')
  } else {
    // 計算 gap（0=貼鄰, 1=隔一位, 2=隔兩位）based on position indices
    const posToIdx: Record<string, number> = { '年支': 0, '月支': 1, '日支': 2, '時支': 3,
                                                '年干': 0, '月干': 1, '日干': 2, '時干': 3 }
    const branchParts = branchInts.map((i) => {
      if (i.positions.length === 2) {
        const idxA = posToIdx[i.positions[0]] ?? 0
        const idxB = posToIdx[i.positions[1]] ?? 0
        const gap = Math.abs(idxB - idxA) - 1
        const gapLabel = gap === 0 ? '貼鄰' : gap === 1 ? '隔一位' : '隔兩位'
        return `${i.detail}（${i.positions.join('–')}，${gapLabel}）`
      }
      return i.detail
    })
    lines.push(`- 地支：${branchParts.join(' ｜ ')}`)
  }

  // ── 神煞（完整包才出）─────────────────────────────────────
  if (level === 'full') {
    const shensha = computeShenSha(result)
    lines.push('')
    lines.push('■ 神煞（按柱；每項附計算基準；以下為本站規則集所列，流派有異）')
    const ssMap: Record<string, string[]> = { '年柱': [], '月柱': [], '日柱': [], '時柱': [] }
    for (const hit of shensha) {
      for (const col of hit.pillars) {
        const key = col + '柱'
        if (ssMap[key]) ssMap[key].push(`${hit.name}（${hit.basis}）`)
      }
    }
    const hasShenSha = Object.values(ssMap).some((arr) => arr.length > 0)
    if (!hasShenSha) {
      lines.push('- 此命盤未見所列核心神煞')
    } else {
      for (const [col, items] of Object.entries(ssMap)) {
        if (items.length > 0) lines.push(`- ${col}：${items.join('、')}`)
      }
    }
  }

  // ── 大運 ──────────────────────────────────────────────────
  lines.push('')
  const yearStemIsYang = result.year.stem % 2 === 0
  const isShunPai = yearStemIsYang === (gender === 'M')
  const directionLabel = isShunPai ? '順排' : '逆排'
  const genderType = yearStemIsYang
    ? (gender === 'M' ? '陽男' : '陽女')
    : (gender === 'M' ? '陰男' : '陰女')
  const startAge = result.startAge ?? 0
  const startYear = year + Math.round(startAge)
  lines.push(`■ 大運（${genderType}${directionLabel}；${startAge.toFixed(1)} 歲起運，${startYear} 年起）`)

  for (const dy of result.daYuns) {
    const dyYear = year + dy.startAge
    const dyTenGod = tenGodOf(result.day.stem, dy.stem)
    const dyStage = twelveStage(result.day.stem, dy.branch)
    const isCurrent = input.currentYear >= dyYear && input.currentYear < dyYear + 10
    const endYear = dyYear + 9
    const marker = isCurrent ? '★現行 ' : ''
    lines.push(`- ${marker}${dyYear} 起 ${dy.startAge} 歲 ${dy.stemChar}${dy.branchChar} ${dyTenGod} ${dyStage}${isCurrent ? `（${dyYear}–${endYear}）` : ''}`)
  }
  lines.push('- 註：大運十神為運干對日主；十二長生為日主在運支的狀態')
  if (timeMode === 'unknown') {
    lines.push('- 時辰不詳：大運以正午估算，起運歲數僅供參考')
  }

  // ── 流年 ──────────────────────────────────────────────────
  lines.push('')
  lines.push('■ 流年')
  const curGZ = yearGanZhi(input.currentYear, result.day.stem)
  const curBranchMainTG = result.year.hiddenStems[0]?.tenGod ?? ''  // 流年支藏干本氣十神（臨時用年支本氣近似）
  // 流年支藏干本氣十神
  const curBranchTG = tenGodOf(result.day.stem, curGZ.stem) // 實際上這是干的十神，地支本氣另算
  // 流年支的藏干本氣十神：需要用 branchHiddenStems 或直接從 hiddenStems 表查
  // 簡化：只用天干十神（地支本氣十神需要另外查 HIDDEN 表）
  const HIDDEN_MAIN: number[] = [9,5,0,1,4,2,3,5,6,7,4,8] // 各支本氣干索引（子=壬9，丑=己5，...）
  const curBranchStemIdx = HIDDEN_MAIN[curGZ.branch]
  const curBranchMainTenGod = tenGodOf(result.day.stem, curBranchStemIdx)
  lines.push(`- 現行流年：${input.currentYear} ${curGZ.gz}（干 ${curGZ.tenGod} · 支 ${curBranchMainTenGod}）`)

  // 流年引動原局
  const triggers = branchInteractions(curGZ.branch, result)
  if (triggers.length === 0) {
    lines.push(`- ${input.currentYear} 流年引動原局：此流年地支與原局四支無直接沖合刑害破`)
  } else {
    const triggerStr = triggers.map((t) => {
      // 簡化 detail：去掉括號補充
      const base = t.detail
      const col = t.pillarLabel.replace('柱', '支')
      return `${base}（${col}）`
    }).join(' ｜ ')
    lines.push(`- ${input.currentYear} 流年引動原局：${triggerStr}`)
  }

  // 近十年
  const decadeStart = input.currentYear - 4
  const decadeYears = Array.from({ length: 10 }, (_, i) => decadeStart + i)
  const decadeStr = decadeYears.map((y) => {
    const gz = yearGanZhi(y, result.day.stem)
    const mark = y === input.currentYear ? '★' : ''
    return `${mark}${y} ${gz.gz} ${gz.tenGod}`
  }).join('｜')
  lines.push(`- 近十年：${decadeStr}`)

  // 現行大運與流年（完整包）
  if (level === 'full') {
    const curDaYun = result.daYuns.find((dy) => {
      const dyYear = year + dy.startAge
      return input.currentYear >= dyYear && input.currentYear < dyYear + 10
    })
    if (curDaYun) {
      const dayunGZ = curDaYun.stemChar + curDaYun.branchChar
      // 計算大運支 vs 流年支的關係：把大運支塞入一個臨時四柱的日支，用 branchInteractions 反查
      const dynInteracts = branchInteractions(curGZ.branch, { ...result, day: { ...result.day, branch: curDaYun.branch } })
      const dynHit = dynInteracts.find((t) => t.pillarLabel === '日柱')
      let dynRelLabel = dynHit?.relation ?? ''
      if (dynRelLabel === '合' && dynHit) {
        if (dynHit.detail.includes('六合')) dynRelLabel = '六合'
        else if (dynHit.detail.includes('三合')) dynRelLabel = '三合'
        else dynRelLabel = '半合'
      }
      const dynStr = dynHit ? `（運支${curDaYun.branchChar}–流年支${curGZ.gz[1]} ${dynRelLabel}）` : '（運年無直接引動）'
      lines.push(`- 現行大運與流年：${dayunGZ} 運上見 ${curGZ.gz} 年${dynStr}`)
    }
  }

  lines.push('- 流月／流日／流時不在本包；需要時請到 destinysolver.com/bazi 選「完整」檢視')

  // ── 給 AI 的使用說明 ───────────────────────────────────────
  lines.push('')
  lines.push('■ 給 AI 的使用說明')
  lines.push('1. 以上全部由排盤引擎計算，請直接採用：不要重排四柱，不要改動、補算或「修正」任何干支、十神、大運、流年。')
  lines.push('2. 本包未列的層級（流月、流日、流時、其他年份的引動）請勿自行推算；用戶要問時，請提示回到 destinysolver.com/bazi 取得。')
  lines.push('3. 本包只提供結構事實；格局、旺衰、喜忌、吉凶屬解讀層，由你按所用方法判斷，每個結論請標明盤面依據（邊一柱、邊個十神、邊組互動）。')
  lines.push('4. 不要用任何人都適用的泛泛描述；講唔出盤面依據的判斷請直接省略。')

  if (level === 'full' && input.articles && input.articles.length > 0) {
    lines.push('5. 延伸閱讀（用戶想深入時可引用，全部為本站原創文章）：')
    for (const a of input.articles.slice(0, 5)) {
      lines.push(`- ${a.title} ${a.url}`)
    }
  }

  lines.push('本資料包由命運解決師（陳卓賢）destinysolver.com 八字排盤工具生成，供自我認識與研究參考，不構成任何專業建議。')

  return lines.join('\n')
}
