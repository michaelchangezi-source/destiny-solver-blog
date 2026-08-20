import { WesternResult, ZODIAC_CN, formatDegree } from '@/lib/western-calc'

export function buildWesternPack(result: WesternResult): string {
  const { input, planets, ascendant, mc, aspects } = result

  const lines: string[] = []

  // 基本資料
  lines.push(`## 西洋占星本命盤資料包`)
  lines.push(``)
  lines.push(`### 出生資料`)
  lines.push(`- 陽曆：${input.year}年${input.month}月${input.day}日 ${String(input.hour).padStart(2,'0')}:${String(input.minute).padStart(2,'0')}`)
  lines.push(`- 時區：UTC${input.tzOffset >= 0 ? '+' : ''}${input.tzOffset}`)
  if (input.lat !== 0 || input.lon !== 0) {
    lines.push(`- 出生地：北緯 ${input.lat.toFixed(2)}° 東經 ${input.lon.toFixed(2)}°`)
  }
  lines.push(``)

  // 上升點與天頂
  if (ascendant) {
    lines.push(`### 上升點與天頂`)
    lines.push(`- 上升點（ASC）：${ascendant.sign} ${ascendant.degree}°${ascendant.minute}'`)
    if (mc) lines.push(`- 天頂（MC）：${mc.sign} ${mc.degree}°${mc.minute}'`)
    lines.push(``)
  }

  // 行星位置
  lines.push(`### 行星位置`)
  lines.push(`| 行星 | 星座 | 度數 | 狀態 |`)
  lines.push(`|------|------|------|------|`)
  for (const p of planets) {
    const status = p.retrograde ? '逆行 ℞' : '順行'
    const deg = `${p.degree}°${p.minute}'`
    lines.push(`| ${p.symbol} ${p.name} | ${p.sign} | ${deg} | ${status} |`)
  }
  lines.push(``)

  // 宮位
  if (result.houses) {
    const sysLabel = result.input.houseSystem === 'whole-sign' ? 'Whole Sign（整宮制）' : 'Placidus'
    lines.push(`### 十二宮位（${sysLabel}）`)
    const houseLabels: Record<number, string> = { 1: 'ASC', 4: 'IC', 7: 'DSC', 10: 'MC' }
    for (const h of result.houses) {
      const tag = houseLabels[h.num] ? ` (${houseLabels[h.num]})` : ''
      lines.push(`- 第${h.num}宮${tag}：${h.sign} ${h.degree}°${h.minute}'`)
    }
    lines.push(``)
  }

  // 元素分佈
  const elements = { '火象': 0, '土象': 0, '風象': 0, '水象': 0 }
  const elemMap = [0,1,2,3,0,1,2,3,0,1,2,3] // 牡羊=火, 金牛=土, 雙子=風, 巨蟹=水...
  const elemNames = ['火象','土象','風象','水象']
  const modals = { '開創': 0, '固定': 0, '變動': 0 }
  const modalMap = [0,1,2,0,1,2,0,1,2,0,1,2] // 牡羊=開創, 金牛=固定, 雙子=變動...
  const modalNames = ['開創','固定','變動']

  const INNER = ['sun','moon','mercury','venus','mars']
  for (const p of planets.filter(p => INNER.includes(p.key))) {
    elements[elemNames[elemMap[p.signIndex]] as keyof typeof elements]++
    modals[modalNames[modalMap[p.signIndex]] as keyof typeof modals]++
  }

  lines.push(`### 元素與型態分佈（內行星）`)
  lines.push(`元素：火象 ${elements['火象']}　土象 ${elements['土象']}　風象 ${elements['風象']}　水象 ${elements['水象']}`)
  lines.push(`型態：開創 ${modals['開創']}　固定 ${modals['固定']}　變動 ${modals['變動']}`)
  lines.push(``)

  // 主要相位
  if (aspects.length > 0) {
    lines.push(`### 主要相位`)
    const nameMap: Record<string, string> = {
      sun:'太陽', moon:'月亮', mercury:'水星', venus:'金星', mars:'火星',
      jupiter:'木星', saturn:'土星', uranus:'天王星', neptune:'海王星', pluto:'冥王星',
    }
    for (const asp of aspects.slice(0, 15)) {
      lines.push(`- ${nameMap[asp.p1]} ${asp.type} ${nameMap[asp.p2]}（容許度 ${asp.orb}°）`)
    }
    lines.push(``)
  }

  lines.push(`---`)
  lines.push(`*資料由 destinysolver.com 西洋占星排盤工具生成，算法基於 Meeus Astronomical Algorithms 天文精算。*`)

  return lines.join('\n')
}
