// 紫微斗數排盤引擎（飛星派）
// 移植自 destiny.solver/ziwei-chart.html，保持算法完全一致

export const TG = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸']
export const DZ = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']
export const PN = ['命宮','父母','福德','田宅','官祿','奴僕','遷移','疾厄','財帛','子女','夫妻','兄弟']
export const STR_TXT = ['陷','平','利','旺','廟']

// 主星廟旺利平陷（12地支：子丑寅卯辰巳午未申酉戌亥）
// 等級：陷0 平1 利2 旺3 廟4
const SSTR: Record<string, number[]> = {
  '紫微':[1,4,4,3,4,3,4,4,3,1,4,3],
  '天機':[4,0,3,3,2,1,4,0,3,3,2,1],
  '太陽':[0,0,3,4,3,3,4,2,2,1,0,0],
  '武曲':[3,4,2,2,4,1,3,4,2,2,4,1],
  '天同':[4,1,2,1,0,4,0,0,3,1,1,4],
  '廉貞':[1,2,4,1,2,0,1,2,4,1,2,0],
  '天府':[4,4,4,2,4,2,3,4,2,3,4,2],
  '太陰':[4,4,2,0,0,0,0,1,2,3,3,4],
  '貪狼':[3,4,1,2,4,0,3,4,1,2,4,0],
  '巨門':[3,3,4,4,1,3,3,1,4,4,1,3],
  '天相':[4,4,4,0,2,2,4,2,4,0,2,2],
  '天梁':[4,3,4,4,4,0,4,3,0,2,4,0],
  '七殺':[3,4,4,3,4,1,3,4,4,3,4,1],
  '破軍':[4,3,2,0,3,1,4,3,2,0,3,1],
}

export type SihuaType = 'lu' | 'quan' | 'ke' | 'ji'
export const SIHUA: Record<string, Record<SihuaType, string>> = {
  '甲':{lu:'廉貞',quan:'破軍',ke:'武曲',ji:'太陽'},
  '乙':{lu:'天機',quan:'天梁',ke:'紫微',ji:'太陰'},
  '丙':{lu:'天同',quan:'天機',ke:'文昌',ji:'廉貞'},
  '丁':{lu:'太陰',quan:'天同',ke:'天機',ji:'巨門'},
  '戊':{lu:'貪狼',quan:'太陰',ke:'右弼',ji:'天機'},
  '己':{lu:'武曲',quan:'貪狼',ke:'天梁',ji:'文曲'},
  '庚':{lu:'太陽',quan:'武曲',ke:'太陰',ji:'天同'},
  '辛':{lu:'巨門',quan:'太陽',ke:'文曲',ji:'文昌'},
  '壬':{lu:'天梁',quan:'紫微',ke:'左輔',ji:'武曲'},
  '癸':{lu:'破軍',quan:'巨門',ke:'太陰',ji:'貪狼'},
}

// 納音五行局（30對，idx60=0..58 → floor(i/2) 索引）
const NAYIN = [4,6,3,5,4,6,2,5,4,3,2,5,6,3,2,4,6,3,5,4,6,2,5,4,3,2,5,6,3,2]

// 農曆資料（1940-2030）
// 格式：[正月初一陽曆月, 正月初一陽曆日, 閏月(0=無), 各月天數陣列(1=30天,0=29天)]
const LUNAR_DATA: Record<number, [number, number, number, number[]]> = {
  1940:[1,27,7, [1,0,1,0,1,0,0,1,0,1,0,1,0]],
  1941:[2,15,0, [0,1,0,1,0,1,0,1,0,1,0,1]],
  1942:[2,5,0,  [1,0,1,0,1,0,1,0,1,0,1,0]],
  1943:[1,25,0, [0,1,0,1,0,1,0,1,0,1,0,1]],
  1944:[2,13,4, [1,0,1,0,0,1,0,1,0,1,0,1,0]],
  1945:[2,2,0,  [1,0,1,0,1,0,1,0,1,0,1,0]],
  1946:[1,22,0, [0,1,0,1,0,1,0,1,0,1,0,1]],
  1947:[2,10,0, [1,0,1,0,1,0,0,1,0,1,0,1]],
  1948:[1,30,5, [0,1,0,1,0,1,0,0,1,0,1,0,1]],
  1949:[2,17,0, [1,0,1,0,1,0,1,0,0,1,0,1]],
  1950:[2,6,0,  [0,1,0,1,0,1,0,1,0,1,0,1]],
  1951:[1,27,0, [1,0,0,1,0,1,0,1,0,1,0,1]],
  1952:[2,14,9, [0,1,0,0,1,0,1,0,1,0,1,0,1]],
  1953:[2,3,0,  [1,0,1,0,0,1,0,1,0,1,0,1]],
  1954:[1,24,0, [0,1,0,1,0,1,0,1,0,1,0,1]],
  1955:[2,12,3, [1,0,1,0,1,0,1,0,1,0,1,0,1]],
  1956:[2,2,0,  [0,1,0,1,0,1,0,1,0,1,0,1]],
  1957:[1,31,8, [1,0,1,0,1,0,1,0,0,1,0,1,0]],
  1958:[2,18,0, [1,0,1,0,1,0,1,0,1,0,1,0]],
  1959:[2,8,0,  [0,1,0,1,0,1,0,1,0,1,0,1]],
  1960:[1,28,6, [1,0,1,0,1,0,0,1,0,1,0,1,0]],
  1961:[2,15,0, [1,0,1,0,1,0,1,0,1,0,1,0]],
  1962:[2,5,0,  [0,1,0,1,0,1,0,1,0,1,0,1]],
  1963:[1,25,4, [1,0,1,0,0,1,0,1,0,1,0,1,0]],
  1964:[2,13,0, [1,0,1,0,1,0,1,0,1,0,1,0]],
  1965:[2,2,0,  [0,1,0,1,0,1,0,1,0,1,0,1]],
  1966:[1,21,3, [0,1,0,1,0,0,1,0,1,0,1,0,1]],
  1967:[2,9,0,  [1,0,1,0,1,0,1,0,1,0,1,0]],
  1968:[1,30,7, [0,1,0,1,0,1,0,0,1,0,1,0,1]],
  1969:[2,17,0, [1,0,1,0,1,0,1,0,0,1,0,1]],
  1970:[2,6,0,  [0,1,0,1,0,1,0,1,0,1,0,1]],
  1971:[1,27,5, [1,0,1,0,1,0,0,1,0,1,0,1,0]],
  1972:[2,15,0, [0,1,0,1,0,1,0,1,0,1,0,1]],
  1973:[2,3,0,  [1,0,1,0,1,0,1,0,1,0,1,0]],
  1974:[1,23,4, [0,1,0,1,0,0,1,0,1,0,1,0,1]],
  1975:[2,11,0, [1,0,1,0,1,0,1,0,1,0,1,0]],
  1976:[1,31,8, [0,1,0,1,0,1,0,1,0,0,1,0,1]],
  1977:[2,18,0, [1,0,1,0,1,0,1,0,1,0,1,0]],
  1978:[2,7,0,  [0,1,0,1,0,1,0,1,0,1,0,1]],
  1979:[1,28,6, [1,0,1,0,1,0,0,1,0,1,0,1,0]],
  1980:[2,16,0, [0,1,0,1,0,1,0,1,0,1,0,1]],
  1981:[2,5,0,  [1,0,1,0,1,0,1,0,1,0,1,0]],
  1982:[1,25,4, [0,1,0,1,0,1,0,1,0,1,0,1,0]],
  1983:[2,13,0, [1,0,1,0,1,0,1,0,1,0,1,0]],
  1984:[2,2,10, [0,1,0,1,0,1,0,1,0,1,0,0,1]],
  1985:[2,20,0, [1,0,1,0,1,0,1,0,1,0,1,0]],
  1986:[2,9,0,  [0,1,0,1,0,1,0,1,0,1,0,1]],
  1987:[1,29,6, [1,0,1,0,1,1,0,1,0,1,0,1,0]],
  1988:[2,17,0, [1,0,1,0,1,0,1,0,1,0,1,0]],
  1989:[2,6,0,  [1,0,1,0,1,0,1,0,1,0,1,0]],
  1990:[1,27,5, [0,1,0,1,0,1,0,1,0,1,0,1,0]],
  1991:[2,15,0, [1,0,1,0,1,0,1,0,1,0,1,0]],
  1992:[2,4,0,  [0,1,0,1,0,1,0,1,0,1,0,1]],
  1993:[1,23,3, [0,1,0,1,0,1,0,1,0,1,0,1,0]],
  1994:[2,10,0, [1,0,1,0,1,0,1,0,1,0,1,0]],
  1995:[1,31,8, [0,1,0,1,0,1,0,1,0,0,1,0,1]],
  1996:[2,19,0, [1,0,1,0,1,0,1,0,1,0,1,0]],
  1997:[2,7,0,  [0,1,0,1,0,1,0,1,0,1,0,1]],
  1998:[1,28,5, [1,0,1,0,1,0,1,0,1,0,1,0,0]],
  1999:[2,16,0, [1,0,1,0,1,0,1,0,1,0,1,0]],
  2000:[2,5,4,  [0,1,0,1,0,1,0,1,0,1,0,1,0]],
  2001:[1,24,0, [1,0,1,0,1,0,1,0,1,0,1,0]],
  2002:[2,12,0, [0,1,0,1,0,1,0,1,0,1,0,1]],
  2003:[2,1,0,  [1,0,1,0,1,0,1,0,1,0,1,0]],
  2004:[1,22,2, [0,1,0,0,1,0,1,0,1,0,1,0,1]],
  2005:[2,9,0,  [1,0,1,0,1,0,1,0,1,0,1,0]],
  2006:[1,29,7, [0,1,0,1,0,1,0,1,0,1,0,1,0]],
  2007:[2,18,0, [1,0,1,0,1,0,1,0,1,0,1,0]],
  2008:[2,7,0,  [0,1,0,1,0,1,0,1,0,1,0,1]],
  2009:[1,26,5, [1,0,1,0,1,0,1,0,1,0,1,0,0]],
  2010:[2,14,0, [1,0,1,0,1,0,1,0,1,0,1,0]],
  2011:[2,3,0,  [0,1,0,1,0,1,0,1,0,1,0,1]],
  2012:[1,23,4, [1,0,1,0,0,1,0,1,0,1,0,1,0]],
  2013:[2,10,0, [1,0,1,0,1,0,1,0,1,0,1,0]],
  2014:[1,31,9, [0,1,0,1,0,1,0,1,0,1,0,1,0]],
  2015:[2,19,0, [1,0,1,0,1,0,1,0,1,0,1,0]],
  2016:[2,8,0,  [0,1,0,1,0,1,0,1,0,1,0,1]],
  2017:[1,28,6, [1,0,1,0,1,0,0,1,0,1,0,1,0]],
  2018:[2,16,0, [1,0,1,0,1,0,1,0,1,0,1,0]],
  2019:[2,5,0,  [0,1,0,1,0,1,0,1,0,1,0,1]],
  2020:[1,25,4, [1,0,1,0,1,0,1,0,1,0,1,0,0]],
  2021:[2,12,0, [1,0,1,0,1,0,1,0,1,0,1,0]],
  2022:[2,1,0,  [0,1,0,1,0,1,0,1,0,1,0,1]],
  2023:[1,22,2, [1,0,0,1,0,1,0,1,0,1,0,1,0]],
  2024:[2,10,0, [1,0,1,0,1,0,1,0,1,0,1,0]],
  2025:[1,29,6, [0,1,0,1,0,1,0,1,0,1,0,1,0]],
  2026:[2,17,0, [1,0,1,0,1,0,1,0,1,0,1,0]],
  2027:[2,6,0,  [0,1,0,1,0,1,0,1,0,1,0,1]],
  2028:[1,26,5, [1,0,1,0,1,0,1,0,0,1,0,1,0]],
  2029:[2,13,0, [1,0,1,0,1,0,1,0,1,0,1,0]],
  2030:[2,3,0,  [0,1,0,1,0,1,0,1,0,1,0,1]],
}

// ── 型別定義 ──────────────────────────────────────────────

export interface ZiweiInput {
  lunarYear: number
  lunarMonth: number
  lunarDay: number
  hourIdx: number   // 0=子 1=丑 … 11=亥
  gender: 'M' | 'F'
  name?: string
}

export interface SolarToLunarResult {
  year: number
  month: number
  day: number
  ok: boolean
  isLeap?: boolean
  note: string
}

export interface MinorStar {
  name: string
  type: 'liang' | 'xiong'
}

export interface ZiweiPalace {
  dzIndex: number
  palaceOffset: number    // 0=命宮 1=父母 … 11=兄弟
  palaceName: string
  stem: string
  mainStars: string[]
  minorStars: MinorStar[]
  isMing: boolean
  isShen: boolean
  sihua: Record<SihuaType, string>   // 宮干四化
  starSihua: Record<string, SihuaType[]>  // 哪些星在本宮有年干四化（生年）
  selfStarSihua: Record<string, SihuaType[]>  // 宮干自化
}

export interface ZiweiDaYun {
  index: number
  dzIndex: number
  stem: string
  palaceOffset: number
  palaceName: string
  ageStart: number
  ageEnd: number
  yearStart: number
  yearEnd: number
  isCurrent: boolean
  mainStars: string[]
  sihua: Record<SihuaType, string>
}

export interface ZiweiResult {
  name: string
  lunarYear: number
  lunarMonth: number
  lunarDay: number
  hourIdx: number
  gender: 'M' | 'F'
  yearTG: string
  yearDZ: string
  yTGI: number
  yDZI: number
  mingDz: number         // 命宮地支索引
  shenDz: number         // 身宮地支索引
  shenPalaceOffset: number
  shenPalaceName: string
  mingTG: string         // 命宮天干
  ju: number             // 五行局 2-6
  juName: string         // 水二局/木三局/金四局/土五局/火六局
  zDz: number            // 紫微落地支索引
  forward: boolean       // 順逆大限
  palaces: ZiweiPalace[]
  daYuns: ZiweiDaYun[]
  currentYear: number
}

// ── 算法函數 ──────────────────────────────────────────────

export function solarToLunar(sy: number, sm: number, sd: number): SolarToLunarResult {
  let lunarYear = sy
  let rec = LUNAR_DATA[sy]
  if (!rec) {
    rec = LUNAR_DATA[sy - 1]
    if (!rec) return { year: sy, month: 1, day: 1, ok: false, note: '年份超出資料範圍，請改用農曆輸入' }
    lunarYear = sy - 1
  }

  let cnyDate = new Date(lunarYear, rec[0] - 1, rec[1])
  const target = new Date(sy, sm - 1, sd)

  if (target < cnyDate) {
    lunarYear = sy - 1
    rec = LUNAR_DATA[lunarYear]
    if (!rec) return { year: sy, month: 1, day: 1, ok: false, note: '年份超出資料範圍' }
    cnyDate = new Date(lunarYear, rec[0] - 1, rec[1])
  }

  const daysDiff = Math.round((target.getTime() - cnyDate.getTime()) / 86400000)
  const leapMonth = rec[2]
  const months = rec[3]
  let lm = 0, ld = 0, cum = 0

  for (let i = 0; i < months.length; i++) {
    const mdays = months[i] ? 30 : 29
    if (daysDiff < cum + mdays) { ld = daysDiff - cum + 1; lm = i + 1; break }
    cum += mdays
  }
  if (!lm) { lm = months.length; ld = 1 }

  let actualMonth = lm
  let isLeap = false
  if (leapMonth > 0) {
    if (lm === leapMonth + 1) { isLeap = true; actualMonth = leapMonth }
    else if (lm > leapMonth + 1) { actualMonth = lm - 1 }
  }

  return { year: lunarYear, month: actualMonth, day: ld, ok: true, isLeap, note: '' }
}

function idx60(si: number, bi: number): number {
  if ((si % 2) !== (bi % 2)) return -1
  const k = (((5 * (bi - si) / 2) % 6) + 6) % 6
  return si + 10 * k
}

function getJu(si: number, bi: number): number {
  const i = idx60(si, bi)
  return i >= 0 ? NAYIN[Math.floor(i / 2)] : 5
}

function getMingDz(lm: number, hi: number): number {
  const mb = (1 + lm) % 12
  return (mb - hi + 12) % 12
}

function getShenDz(lm: number, hi: number): number {
  const mb = (1 + lm) % 12
  return (mb + hi) % 12
}

function getZiweiDz(d: number, ju: number): number {
  return (6 + Math.floor((d - 1) / ju)) % 12
}

function calcMainStars(zDz: number): Record<number, string[]> {
  const m: Record<number, string[]> = {}
  for (let i = 0; i < 12; i++) m[i] = []

  const purpleGroup: [string, number][] = [
    ['紫微', 0], ['天機', -1], ['太陽', -3], ['武曲', -4], ['天同', -5], ['廉貞', 4],
  ]
  purpleGroup.forEach(([n, o]) => m[((zDz + o) % 12 + 12) % 12].push(n))

  const t = (4 - zDz + 12) % 12
  const tianfuGroup: [string, number][] = [
    ['天府', 0], ['太陰', 1], ['貪狼', 2], ['巨門', 3],
    ['天相', 4], ['天梁', 5], ['七殺', 6], ['破軍', 10],
  ]
  tianfuGroup.forEach(([n, o]) => m[(t + o) % 12].push(n))

  return m
}

function calcMinorStars(yTGI: number, yDZI: number, lm: number, hi: number, ld: number): Record<number, MinorStar[]> {
  const m: Record<number, MinorStar[]> = {}
  for (let i = 0; i < 12; i++) m[i] = []

  const a = (dz: number, name: string, type: 'liang' | 'xiong') => {
    m[((dz % 12) + 12) % 12].push({ name, type })
  }

  // 時系星
  a(10 - hi, '文昌', 'liang')
  a(4 + hi, '文曲', 'liang')
  a(11 + hi, '地劫', 'xiong')
  a(11 - hi, '地空', 'xiong')
  a(6 + hi, '台輔', 'liang')
  a(2 + hi, '封誥', 'liang')

  // 月系星
  a(4 + lm - 1, '左輔', 'liang')
  a(10 - (lm - 1), '右弼', 'liang')
  a(9 + lm - 1, '天刑', 'xiong')
  a(1 + lm - 1, '天姚', 'xiong')

  // 年干系星
  const lu = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0]
  a(lu[yTGI], '祿存', 'liang')
  a(lu[yTGI] + 1, '擎羊', 'xiong')
  a(lu[yTGI] - 1, '陀羅', 'xiong')

  const kui = [1, 0, 11, 11, 1, 0, 1, 6, 3, 3]
  const yue = [7, 8, 9, 9, 7, 8, 7, 2, 5, 5]
  a(kui[yTGI], '天魁', 'liang')
  a(yue[yTGI], '天鉞', 'liang')

  // 年支系星
  const ma = [2, 11, 8, 5, 2, 11, 8, 5, 2, 11, 8, 5]
  a(ma[yDZI], '天馬', 'liang')

  const huoBase = [2, 3, 1, 9, 2, 3, 1, 9, 2, 3, 1, 9]
  a(huoBase[yDZI] + hi, '火星', 'xiong')

  const lingBase = [10, 10, 3, 10, 10, 10, 3, 10, 10, 10, 3, 10]
  a(lingBase[yDZI] + hi, '鈴星', 'xiong')

  const hong = (3 - yDZI + 12) % 12
  a(hong, '紅鸞', 'liang')
  a(hong + 6, '天喜', 'liang')

  a(4 + yDZI, '龍池', 'liang')
  a(10 - yDZI, '鳳閣', 'liang')
  a(6 - yDZI, '天哭', 'xiong')
  a(6 + yDZI, '天虛', 'xiong')

  const guMap = [2, 2, 5, 5, 5, 8, 8, 8, 11, 11, 11, 2]
  const guaMap = [10, 10, 1, 1, 1, 4, 4, 4, 7, 7, 7, 10]
  a(guMap[yDZI], '孤辰', 'xiong')
  a(guaMap[yDZI], '寡宿', 'xiong')

  const huaMap = [4, 1, 10, 7, 4, 1, 10, 7, 4, 1, 10, 7]
  a(huaMap[yDZI], '華蓋', 'liang')

  // 月+時系雜曜
  const zuofuPos = 4 + lm - 1
  a(zuofuPos + (ld - 1), '三台', 'liang')

  const youbiPos = 10 - (lm - 1)
  a(youbiPos - (ld - 1), '八座', 'liang')

  const wenchangPos = 10 - hi
  a(wenchangPos + (ld - 1) - 1, '恩光', 'liang')

  const wenquPos = 4 + hi
  a(wenquPos + (ld - 1) - 1, '天貴', 'liang')

  const tianguan = [7, 4, 5, 2, 3, 9, 11, 9, 10, 6]
  a(tianguan[yTGI], '天官', 'liang')

  const tianfu2 = [9, 8, 0, 11, 3, 2, 6, 5, 6, 5]
  a(tianfu2[yTGI], '天福', 'liang')

  const tianwu = [5, 8, 2, 11]
  a(tianwu[(lm - 1) % 4], '天巫', 'liang')

  const tianyue = [10, 5, 4, 2, 7, 3, 11, 7, 2, 6, 10, 2]
  a(tianyue[lm - 1], '天月', 'xiong')

  const yinsha = [2, 0, 10, 8, 6, 4, 2, 0, 10, 8, 6, 4]
  a(yinsha[lm - 1], '陰煞', 'xiong')

  return m
}

function calcPalaceStems(yTGI: number): Record<number, string> {
  const start = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0][yTGI]
  const s: Record<number, string> = {}
  for (let i = 0; i < 12; i++) s[(2 + i) % 12] = TG[(start + i) % 10]
  return s
}

// ── 主排盤函數 ──────────────────────────────────────────

const JU_NAME: Record<number, string> = { 2: '水二局', 3: '木三局', 4: '金四局', 5: '土五局', 6: '火六局' }

export function calcZiwei(input: ZiweiInput): ZiweiResult {
  const { lunarYear, lunarMonth, lunarDay, hourIdx, gender, name = '命主' } = input

  const yTGI = ((lunarYear - 4) % 10 + 600) % 10
  const yDZI = ((lunarYear - 4) % 12 + 600) % 12
  const yearTG = TG[yTGI]
  const yearDZ = DZ[yDZI]

  const mingDz = getMingDz(lunarMonth, hourIdx)
  const shenDz = getShenDz(lunarMonth, hourIdx)
  const ps = calcPalaceStems(yTGI)
  const mingTG = ps[mingDz]
  const mingTGI = TG.indexOf(mingTG)
  const ju = getJu(mingTGI, mingDz)
  const juName = JU_NAME[ju] || `${ju}局`
  const zDz = getZiweiDz(lunarDay, ju)

  const mm = calcMainStars(zDz)
  const mi = calcMinorStars(yTGI, yDZI, lunarMonth, hourIdx, lunarDay)

  const shenPalaceOffset = (shenDz - mingDz + 12) % 12
  const shenPalaceName = PN[shenPalaceOffset]

  const nianSihua = SIHUA[yearTG] ?? {} as Record<SihuaType, string>

  // 建立宮格
  const palaces: ZiweiPalace[] = []
  for (let i = 0; i < 12; i++) {
    const dz = i
    const pOffset = (dz - mingDz + 12) % 12
    const stem = ps[dz] ?? '甲'
    const selfSihua = SIHUA[stem] ?? {} as Record<SihuaType, string>

    const starSihua: Record<string, SihuaType[]> = {}
    const selfStarSihua: Record<string, SihuaType[]> = {}

    const allStarNames = [...(mm[dz] ?? []), ...(mi[dz] ?? []).map(s => s.name)]
    for (const stype of ['lu', 'quan', 'ke', 'ji'] as SihuaType[]) {
      const ns = nianSihua[stype]
      if (ns && allStarNames.includes(ns)) {
        if (!starSihua[ns]) starSihua[ns] = []
        starSihua[ns].push(stype)
      }
      const ss = selfSihua[stype]
      if (ss && allStarNames.includes(ss)) {
        if (!selfStarSihua[ss]) selfStarSihua[ss] = []
        selfStarSihua[ss].push(stype)
      }
    }

    palaces.push({
      dzIndex: dz,
      palaceOffset: pOffset,
      palaceName: PN[pOffset],
      stem,
      mainStars: mm[dz] ?? [],
      minorStars: mi[dz] ?? [],
      isMing: dz === mingDz,
      isShen: dz === shenDz,
      sihua: selfSihua as Record<SihuaType, string>,
      starSihua,
      selfStarSihua,
    })
  }

  const currentYear = new Date().getFullYear()
  const age = currentYear - lunarYear
  const isYang = yTGI % 2 === 0
  const forward = (gender === 'M' && isYang) || (gender === 'F' && !isYang)

  // 大限
  const daYuns: ZiweiDaYun[] = []
  for (let i = 0; i < 12; i++) {
    const dz = forward ? (mingDz + i) % 12 : ((mingDz - i) % 12 + 12) % 12
    const ageStart = ju + i * 10
    const ageEnd = ageStart + 9
    const yearStart = lunarYear + ageStart
    const stem = ps[dz] ?? '甲'
    const pOff = (dz - mingDz + 12) % 12

    daYuns.push({
      index: i,
      dzIndex: dz,
      stem,
      palaceOffset: pOff,
      palaceName: PN[pOff],
      ageStart,
      ageEnd,
      yearStart,
      yearEnd: yearStart + 9,
      isCurrent: age >= ageStart && age <= ageEnd,
      mainStars: mm[dz] ?? [],
      sihua: (SIHUA[stem] ?? {}) as Record<SihuaType, string>,
    })
  }

  return {
    name,
    lunarYear, lunarMonth, lunarDay, hourIdx, gender,
    yearTG, yearDZ, yTGI, yDZI,
    mingDz, shenDz,
    shenPalaceOffset,
    shenPalaceName,
    mingTG,
    ju, juName,
    zDz,
    forward,
    palaces,
    daYuns,
    currentYear,
  }
}

// 星曜強度（用於 pack 輸出）
export function getStrength(starName: string, dzIndex: number): { level: number; label: string } {
  const levels = SSTR[starName]
  if (!levels) return { level: 2, label: '利' }
  const lv = levels[dzIndex] ?? 2
  return { level: lv, label: STR_TXT[lv] ?? '平' }
}
