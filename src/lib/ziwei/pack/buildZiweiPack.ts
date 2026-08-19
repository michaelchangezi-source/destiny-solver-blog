// 紫微斗數 AI Pack 生成器
import {
  ZiweiResult, ZiweiPalace, ZiweiDaYun,
  TG, DZ, PN, STR_TXT, SIHUA, SihuaType,
  getStrength,
} from '@/lib/ziwei-calc'

function sihuaLabel(t: SihuaType): string {
  return { lu: '化祿', quan: '化權', ke: '化科', ji: '化忌' }[t]
}

function renderPalace(p: ZiweiPalace, nianTG: string): string {
  const lines: string[] = []
  lines.push(`### ${p.palaceName}（${p.stem}${DZ[p.dzIndex]}）${p.isMing ? '【命宮】' : ''}${p.isShen ? '【身宮】' : ''}`)

  if (p.mainStars.length) {
    const stars = p.mainStars.map(n => {
      const s = getStrength(n, p.dzIndex)
      const sh = Object.entries(p.starSihua[n] ?? {}).map(([,t]) => sihuaLabel(t as SihuaType)).join('')
      const self = Object.entries(p.selfStarSihua[n] ?? {}).map(([,t]) => `自${sihuaLabel(t as SihuaType)}`).join('')
      return `${n}（${s.label}）${sh}${self}`
    }).join('、')
    lines.push(`主星：${stars}`)
  } else {
    lines.push('主星：空宮')
  }

  if (p.minorStars.length) {
    const mstars = p.minorStars.map(s => {
      const sh = Object.entries(p.starSihua[s.name] ?? {}).map(([,t]) => sihuaLabel(t as SihuaType)).join('')
      return s.name + sh
    }).join(' ')
    lines.push(`輔星：${mstars}`)
  }

  const sh = p.sihua
  lines.push(`宮干四化：${p.stem}干 → 祿${sh.lu ?? '-'} 權${sh.quan ?? '-'} 科${sh.ke ?? '-'} 忌${sh.ji ?? '-'}`)

  return lines.join('\n')
}

function renderDaYun(dy: ZiweiDaYun): string {
  const cur = dy.isCurrent ? '【現行大限】' : ''
  const stars = dy.mainStars.join('、') || '空宮'
  const sh = dy.sihua
  return `- ${cur}${dy.ageStart}-${dy.ageEnd}歲（${dy.yearStart}-${dy.yearEnd}）：${dy.stem}${DZ[dy.dzIndex]} ${dy.palaceName} | 主星：${stars} | 祿${sh.lu ?? '-'} 忌${sh.ji ?? '-'}`
}

export function buildZiweiPack(result: ZiweiResult): string {
  const {
    name, lunarYear, lunarMonth, lunarDay, hourIdx,
    gender, yearTG, yearDZ, mingDz, shenDz,
    shenPalaceName, mingTG, ju, juName,
    zDz, forward, palaces, daYuns, currentYear,
  } = result

  const hourNames = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']
  const genderLabel = gender === 'M' ? '男命' : '女命'
  const nianSihua = SIHUA[yearTG]

  const curDaYun = daYuns.find(d => d.isCurrent)
  const curDyStr = curDaYun
    ? `${curDaYun.stem}${DZ[curDaYun.dzIndex]}（${curDaYun.palaceName}，${curDaYun.ageStart}-${curDaYun.ageEnd}歲）`
    : '不在任何大限範圍內'

  const parts: string[] = []

  parts.push(`# 紫微斗數命盤資料包
命主：${name}　　性別：${genderLabel}
農曆生日：${lunarYear}年${lunarMonth}月${lunarDay}日 ${hourNames[hourIdx]}時
生年干支：${yearTG}${yearDZ}
命宮：${mingTG}${DZ[mingDz]}
身宮：${shenPalaceName}（${DZ[shenDz]}）
五行局：${juName}
紫微落：${DZ[zDz]}宮
大限順序：${forward ? '順布' : '逆布'}
現行大限：${curDyStr}
當前年份：${currentYear}年`)

  // 生年四化
  parts.push(`## 生年四化（${yearTG}年干）
化祿：${nianSihua?.lu ?? '-'}　化權：${nianSihua?.quan ?? '-'}　化科：${nianSihua?.ke ?? '-'}　化忌：${nianSihua?.ji ?? '-'}`)

  // 十二宮（命宮起順序輸出）
  parts.push('## 十二宮詳情')
  const orderedPalaces = [...palaces].sort((a, b) => {
    const ao = (a.dzIndex - mingDz + 12) % 12
    const bo = (b.dzIndex - mingDz + 12) % 12
    return ao - bo
  })
  for (const p of orderedPalaces) {
    parts.push(renderPalace(p, yearTG))
  }

  // 大限
  parts.push('## 大限排列')
  for (const dy of daYuns) {
    parts.push(renderDaYun(dy))
  }

  return parts.join('\n\n')
}
