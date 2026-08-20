'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { calcWestern, ZODIAC_CN, type WesternInput, type WesternResult, type PlanetKey, type HouseSystem } from '@/lib/western-calc'

const WesternAiPanel = dynamic(() => import('./WesternAiPanel'), { ssr: false })

// ── 常用城市資料 ──────────────────────────────────────────

const CITIES = [
  { name: '香港', lat: 22.32, lon: 114.17, tz: 8 },
  { name: '台北', lat: 25.04, lon: 121.56, tz: 8 },
  { name: '台中', lat: 24.15, lon: 120.67, tz: 8 },
  { name: '高雄', lat: 22.63, lon: 120.30, tz: 8 },
  { name: '上海', lat: 31.23, lon: 121.47, tz: 8 },
  { name: '北京', lat: 39.91, lon: 116.39, tz: 8 },
  { name: '廣州', lat: 23.13, lon: 113.26, tz: 8 },
  { name: '東京', lat: 35.69, lon: 139.69, tz: 9 },
  { name: '首爾', lat: 37.57, lon: 126.98, tz: 9 },
  { name: '新加坡', lat: 1.35, lon: 103.82, tz: 8 },
  { name: '倫敦', lat: 51.51, lon: -0.13, tz: 0 },
  { name: '紐約', lat: 40.71, lon: -74.01, tz: -5 },
  { name: '洛杉磯', lat: 34.05, lon: -118.24, tz: -8 },
  { name: '溫哥華', lat: 49.25, lon: -123.12, tz: -8 },
  { name: '多倫多', lat: 43.65, lon: -79.38, tz: -5 },
  { name: '悉尼', lat: -33.87, lon: 151.21, tz: 10 },
  { name: '手動輸入', lat: 0, lon: 0, tz: 0 },
]

// ── 顏色 ──────────────────────────────────────────────────

const SIGN_ELEMENT: Record<number, string> = {
  0: 'fire', 1: 'earth', 2: 'air', 3: 'water',
  4: 'fire', 5: 'earth', 6: 'air', 7: 'water',
  8: 'fire', 9: 'earth', 10: 'air', 11: 'water',
}

const ELEMENT_COLOR: Record<string, string> = {
  fire:  'text-[#C0392B]',
  earth: 'text-[#7D6608]',
  air:   'text-[#1A6B9A]',
  water: 'text-[#1E5F74]',
}

const ELEMENT_BG: Record<string, string> = {
  fire:  'bg-[#FDECEA]',
  earth: 'bg-[#FEF9E7]',
  air:   'bg-[#EBF5FB]',
  water: 'bg-[#E8F4F8]',
}

// ── 行星排列順序（顯示用） ───────────────────────────────

const DISPLAY_ORDER: PlanetKey[] = ['sun','moon','mercury','venus','mars','jupiter','saturn','uranus','neptune','pluto','node']

function PlanetRow({ planet }: { planet: WesternResult['planets'][0] }) {
  const elem = SIGN_ELEMENT[planet.signIndex]
  return (
    <div className={`flex items-center gap-3 px-3 py-2 rounded-lg ${ELEMENT_BG[elem]}`}>
      <span className="text-lg w-6 text-center">{planet.symbol}</span>
      <div className="flex-1 min-w-0">
        <span className="text-[#2B241C] text-sm font-medium">{planet.name}</span>
        {planet.retrograde && (
          <span className="ml-1.5 text-[10px] text-[#B23E26] font-semibold">℞</span>
        )}
      </div>
      <div className="text-right">
        <span className={`text-sm font-semibold ${ELEMENT_COLOR[elem]}`}>{planet.sign}</span>
        <span className="text-[#9B9089] text-xs ml-1.5">{planet.degree}°{planet.minute}'</span>
      </div>
    </div>
  )
}

// ── 主組件 ──────────────────────────────────────────────

export default function WesternCalculator() {
  const today = new Date()

  const [year, setYear] = useState(1990)
  const [month, setMonth] = useState(1)
  const [day, setDay] = useState(1)
  const [hour, setHour] = useState(12)
  const [minute, setMinute] = useState(0)
  const [cityIdx, setCityIdx] = useState(0) // default Hong Kong
  const [manualLat, setManualLat] = useState('')
  const [manualLon, setManualLon] = useState('')
  const [manualTz, setManualTz] = useState(8)
  const [houseSystem, setHouseSystem] = useState<HouseSystem>('placidus')
  const [result, setResult] = useState<WesternResult | null>(null)
  const [error, setError] = useState('')

  const isManual = cityIdx === CITIES.length - 1

  const calculate = useCallback(() => {
    setError('')
    try {
      const city = CITIES[cityIdx]
      const lat = isManual ? parseFloat(manualLat) : city.lat
      const lon = isManual ? parseFloat(manualLon) : city.lon
      const tz  = isManual ? manualTz : city.tz

      if (isManual && (isNaN(lat) || isNaN(lon))) {
        setError('請輸入有效的緯度和經度')
        return
      }

      const input: WesternInput = {
        year, month, day, hour, minute,
        tzOffset: tz, lat, lon, houseSystem,
      }
      setResult(calcWestern(input))
    } catch (e) {
      setError('計算發生錯誤，請檢查輸入')
      console.error(e)
    }
  }, [year, month, day, hour, minute, cityIdx, manualLat, manualLon, manualTz, isManual, houseSystem])

  const yearOpts = Array.from({ length: 101 }, (_, i) => 1924 + i)
  const monthOpts = Array.from({ length: 12 }, (_, i) => i + 1)
  const dayOpts = Array.from({ length: 31 }, (_, i) => i + 1)
  const hourOpts = Array.from({ length: 24 }, (_, i) => i)
  const minuteOpts = Array.from({ length: 12 }, (_, i) => i * 5)

  const selectCls = "bg-[#F4EEE1] border border-[#2B241C]/15 rounded-lg px-2 py-2.5 text-sm text-[#2B241C] focus:outline-none focus:ring-1 focus:ring-[#B23E26]/40"
  const inputCls  = "bg-[#F4EEE1] border border-[#2B241C]/15 rounded-lg px-3 py-2.5 text-sm text-[#2B241C] focus:outline-none focus:ring-1 focus:ring-[#B23E26]/40"

  return (
    <div className="max-w-2xl mx-auto">
      {/* 輸入表單 */}
      <div className="bg-[#FFFDF8] rounded-2xl border border-[#2B241C]/10 shadow-sm p-6 mb-6 space-y-5">
        {/* 日期 */}
        <div>
          <label className="block text-[#6B6155] text-xs font-semibold tracking-widest mb-2 uppercase">出生日期（陽曆）</label>
          <div className="grid grid-cols-3 gap-2">
            <select value={year} onChange={e => setYear(Number(e.target.value))} className={selectCls}>
              {yearOpts.map(y => <option key={y} value={y}>{y}年</option>)}
            </select>
            <select value={month} onChange={e => setMonth(Number(e.target.value))} className={selectCls}>
              {monthOpts.map(m => <option key={m} value={m}>{m}月</option>)}
            </select>
            <select value={day} onChange={e => setDay(Number(e.target.value))} className={selectCls}>
              {dayOpts.map(d => <option key={d} value={d}>{d}日</option>)}
            </select>
          </div>
        </div>

        {/* 時間 */}
        <div>
          <label className="block text-[#6B6155] text-xs font-semibold tracking-widest mb-2 uppercase">出生時間（當地時間）</label>
          <div className="grid grid-cols-2 gap-2">
            <select value={hour} onChange={e => setHour(Number(e.target.value))} className={selectCls}>
              {hourOpts.map(h => <option key={h} value={h}>{String(h).padStart(2,'0')} 時</option>)}
            </select>
            <select value={minute} onChange={e => setMinute(Number(e.target.value))} className={selectCls}>
              {minuteOpts.map(m => <option key={m} value={m}>{String(m).padStart(2,'0')} 分</option>)}
            </select>
          </div>
          <p className="text-[10px] text-[#9B9089] mt-1.5">出生時間影響上升點（ASC）的精確度，建議準確輸入</p>
        </div>

        {/* 出生地 */}
        <div>
          <label className="block text-[#6B6155] text-xs font-semibold tracking-widest mb-2 uppercase">出生地</label>
          <select
            value={cityIdx}
            onChange={e => setCityIdx(Number(e.target.value))}
            className={`${selectCls} w-full`}
          >
            {CITIES.map((c, i) => (
              <option key={c.name} value={i}>{c.name}</option>
            ))}
          </select>

          {isManual && (
            <div className="grid grid-cols-3 gap-2 mt-2">
              <input
                type="number"
                placeholder="緯度（如 22.32）"
                value={manualLat}
                onChange={e => setManualLat(e.target.value)}
                className={`${inputCls} col-span-1`}
                step="0.01"
              />
              <input
                type="number"
                placeholder="經度（如 114.17）"
                value={manualLon}
                onChange={e => setManualLon(e.target.value)}
                className={`${inputCls} col-span-1`}
                step="0.01"
              />
              <select
                value={manualTz}
                onChange={e => setManualTz(Number(e.target.value))}
                className={selectCls}
              >
                {Array.from({ length: 27 }, (_, i) => i - 12).map(tz => (
                  <option key={tz} value={tz}>UTC{tz >= 0 ? '+' : ''}{tz}</option>
                ))}
              </select>
            </div>
          )}

          {!isManual && (
            <p className="text-[10px] text-[#9B9089] mt-1.5">
              {CITIES[cityIdx].name}：北緯 {CITIES[cityIdx].lat}° 東經 {CITIES[cityIdx].lon}° UTC+{CITIES[cityIdx].tz}
            </p>
          )}
        </div>

        {/* 宮位系統 */}
        <div>
          <label className="block text-[#6B6155] text-xs font-semibold tracking-widest mb-2 uppercase">宮位系統</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="house" value="placidus" checked={houseSystem === 'placidus'} onChange={() => setHouseSystem('placidus')} className="accent-[#B23E26]" />
              <span className="text-sm text-[#2B241C]">Placidus</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="house" value="whole-sign" checked={houseSystem === 'whole-sign'} onChange={() => setHouseSystem('whole-sign')} className="accent-[#B23E26]" />
              <span className="text-sm text-[#2B241C]">Whole Sign（整宮制）</span>
            </label>
          </div>
        </div>

        {error && <p className="text-[#B23E26] text-sm">{error}</p>}

        <button
          onClick={calculate}
          className="w-full bg-[#B23E26] hover:bg-[#9B3320] active:scale-[0.98] text-[#FBF7EE] font-semibold py-3 rounded-xl transition-[background-color,transform] duration-200"
        >
          排盤
        </button>
      </div>

      {/* 結果 */}
      {result && (
        <div className="space-y-5">
          {/* 上升點和天頂 */}
          {result.ascendant && (
            <div className="bg-[#FFFDF8] rounded-2xl border border-[#2B241C]/10 shadow-sm p-5">
              <h2 className="text-[#2B241C] font-bold text-sm mb-3">上升點與天頂</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className={`p-3 rounded-xl ${ELEMENT_BG[SIGN_ELEMENT[result.ascendant.signIndex]]}`}>
                  <p className="text-[10px] text-[#9B9089] font-semibold tracking-widest uppercase mb-1">上升點 ASC</p>
                  <p className={`text-base font-bold ${ELEMENT_COLOR[SIGN_ELEMENT[result.ascendant.signIndex]]}`}>
                    {result.ascendant.sign}
                  </p>
                  <p className="text-[#9B9089] text-xs">{result.ascendant.degree}°{result.ascendant.minute}'</p>
                </div>
                {result.mc && (
                  <div className={`p-3 rounded-xl ${ELEMENT_BG[SIGN_ELEMENT[result.mc.signIndex]]}`}>
                    <p className="text-[10px] text-[#9B9089] font-semibold tracking-widest uppercase mb-1">天頂 MC</p>
                    <p className={`text-base font-bold ${ELEMENT_COLOR[SIGN_ELEMENT[result.mc.signIndex]]}`}>
                      {result.mc.sign}
                    </p>
                    <p className="text-[#9B9089] text-xs">{result.mc.degree}°{result.mc.minute}'</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 十二宮位 */}
          {result.houses && (
            <div className="bg-[#FFFDF8] rounded-2xl border border-[#2B241C]/10 shadow-sm p-5">
              <h2 className="text-[#2B241C] font-bold text-sm mb-3">
                十二宮位
                <span className="text-[#9B9089] text-xs font-normal ml-2">
                  {result.input.houseSystem === 'whole-sign' ? 'Whole Sign' : 'Placidus'}
                </span>
              </h2>
              <div className="grid grid-cols-2 gap-1.5">
                {result.houses.map(h => {
                  const elem = SIGN_ELEMENT[h.signIndex]
                  const label = h.num === 1 ? 'ASC' : h.num === 4 ? 'IC' : h.num === 7 ? 'DSC' : h.num === 10 ? 'MC' : ''
                  return (
                    <div key={h.num} className={`flex items-center gap-2 px-3 py-2 rounded-lg ${ELEMENT_BG[elem]}`}>
                      <span className="text-[#9B9089] text-xs font-semibold w-10">
                        {label ? `${h.num}宮 ${label}` : `第${h.num}宮`}
                      </span>
                      <span className={`text-sm font-semibold ${ELEMENT_COLOR[elem]}`}>{h.sign}</span>
                      <span className="text-[#9B9089] text-xs ml-auto">{h.degree}°{h.minute}&apos;</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* 行星位置 */}
          <div className="bg-[#FFFDF8] rounded-2xl border border-[#2B241C]/10 shadow-sm p-5">
            <h2 className="text-[#2B241C] font-bold text-sm mb-3">行星星座位置</h2>
            <div className="space-y-1.5">
              {result.planets.map(p => <PlanetRow key={p.key} planet={p} />)}
            </div>
          </div>

          {/* 元素分佈 */}
          <div className="bg-[#FFFDF8] rounded-2xl border border-[#2B241C]/10 shadow-sm p-5">
            <h2 className="text-[#2B241C] font-bold text-sm mb-3">元素分佈（內行星）</h2>
            <div className="grid grid-cols-4 gap-2">
              {([
                { name: '火象', elem: 'fire',  planets: ['太陽','月亮','水星','金星','火星'].filter((_,i) => {
                  const inner = result.planets.filter(p => ['sun','moon','mercury','venus','mars'].includes(p.key))
                  return inner[i] && SIGN_ELEMENT[inner[i].signIndex] === 'fire'
                }).length },
                { name: '土象', elem: 'earth', planets: (() => {
                  return result.planets.filter(p => ['sun','moon','mercury','venus','mars'].includes(p.key) && SIGN_ELEMENT[p.signIndex] === 'earth').length
                })() },
                { name: '風象', elem: 'air',   planets: (() => result.planets.filter(p => ['sun','moon','mercury','venus','mars'].includes(p.key) && SIGN_ELEMENT[p.signIndex] === 'air').length)() },
                { name: '水象', elem: 'water', planets: (() => result.planets.filter(p => ['sun','moon','mercury','venus','mars'].includes(p.key) && SIGN_ELEMENT[p.signIndex] === 'water').length)() },
              ]).map(e => (
                <div key={e.name} className={`p-3 rounded-xl text-center ${ELEMENT_BG[e.elem]}`}>
                  <p className={`text-lg font-bold ${ELEMENT_COLOR[e.elem]}`}>{e.planets}</p>
                  <p className="text-[#9B9089] text-[11px]">{e.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 主要相位 */}
          {result.aspects.length > 0 && (
            <div className="bg-[#FFFDF8] rounded-2xl border border-[#2B241C]/10 shadow-sm p-5">
              <h2 className="text-[#2B241C] font-bold text-sm mb-3">主要相位</h2>
              <div className="space-y-1.5">
                {result.aspects.slice(0, 12).map((asp, i) => {
                  const nameMap: Record<string, string> = {
                    sun:'太陽', moon:'月亮', mercury:'水星', venus:'金星', mars:'火星',
                    jupiter:'木星', saturn:'土星', uranus:'天王星', neptune:'海王星', pluto:'冥王星',
                  }
                  const symMap: Record<string, string> = {
                    '合相':'☌', '六分相':'⚹', '四分相':'□', '三分相':'△', '對分相':'☍',
                  }
                  return (
                    <div key={i} className="flex items-center gap-2 text-sm px-3 py-1.5 bg-[#F4EEE1] rounded-lg">
                      <span className="text-[#B23E26] font-bold w-5 text-center">{symMap[asp.type] || asp.type[0]}</span>
                      <span className="text-[#2B241C]">{nameMap[asp.p1]}</span>
                      <span className="text-[#9B9089] text-xs">{asp.type}</span>
                      <span className="text-[#2B241C]">{nameMap[asp.p2]}</span>
                      <span className="ml-auto text-[#9B9089] text-xs">容許度 {asp.orb}°</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* AI Pack */}
          <WesternAiPanel result={result} />
        </div>
      )}
    </div>
  )
}
