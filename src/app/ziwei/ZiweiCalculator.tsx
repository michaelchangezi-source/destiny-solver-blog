'use client'
import { useState } from 'react'
import {
  calcZiwei, solarToLunar,
  DZ, PN, STR_TXT, SIHUA,
  type ZiweiResult, type ZiweiPalace, type SihuaType,
  getStrength,
} from '@/lib/ziwei-calc'
import dynamic from 'next/dynamic'

const ZiweiAiPanel = dynamic(() => import('./ZiweiAiPanel'), { ssr: false })

const HOUR_LABELS = [
  '子時（23–1時）','丑時（1–3時）','寅時（3–5時）','卯時（5–7時）',
  '辰時（7–9時）','巳時（9–11時）','午時（11–13時）','未時（13–15時）',
  '申時（15–17時）','酉時（17–19時）','戌時（19–21時）','亥時（21–23時）',
]

// 強度色
const STR_COLOR = ['text-red-500','text-[#8A8071]','text-green-600','text-amber-500','text-yellow-500']
// 四化顏色
const SIHUA_COLOR: Record<SihuaType, string> = {
  lu: 'bg-green-100 text-green-700 border-green-300',
  quan: 'bg-blue-100 text-blue-700 border-blue-300',
  ke: 'bg-amber-100 text-amber-700 border-amber-300',
  ji: 'bg-red-100 text-red-600 border-red-300',
}
const SIHUA_LABEL: Record<SihuaType, string> = { lu: '祿', quan: '權', ke: '科', ji: '忌' }

// 宮格固定地支排列（4×4，99=中宮佔位）
const GRID_DZ = [5,6,7,8, 4,99,99,9, 3,99,99,10, 2,1,0,11]

function StarTag({ type, label, self }: { type: SihuaType; label: string; self?: boolean }) {
  return (
    <span className={`inline-block text-[9px] px-1 py-0 rounded border leading-tight ${SIHUA_COLOR[type]} ${self ? 'opacity-70 border-dashed' : ''}`}>
      {self ? `自${label}` : label}
    </span>
  )
}

function PalaceCell({ palace, nianTG, isCenter, mingDz }: {
  palace: ZiweiPalace
  nianTG: string
  isCenter?: boolean
  mingDz: number
}) {
  const nianSihua = SIHUA[nianTG] ?? {} as Record<SihuaType, string>

  return (
    <div className={[
      'rounded-lg border p-2 min-h-[120px] text-xs',
      palace.isMing
        ? 'border-[#B23E26] bg-[#FFF5F0]'
        : 'border-[#E3DBC9] bg-[#FFFDF8]',
    ].join(' ')}>
      {/* 宮名 + 干支 */}
      <div className="flex justify-between items-start mb-1">
        <div>
          <div className="text-[10px] text-[#8A8071]">{palace.palaceName}</div>
          <div className="text-[11px] font-bold text-[#B23E26]">{palace.stem}{DZ[palace.dzIndex]}</div>
        </div>
        <div className="flex gap-1">
          {palace.isMing && <span className="text-[9px] px-1 border border-[#B23E26] text-[#B23E26] rounded">命</span>}
          {palace.isShen && <span className="text-[9px] px-1 border border-purple-400 text-purple-600 rounded">身</span>}
        </div>
      </div>

      {/* 主星 */}
      <div className="flex flex-wrap gap-1 mb-1">
        {palace.mainStars.length ? palace.mainStars.map(n => {
          const s = getStrength(n, palace.dzIndex)
          const sh = palace.starSihua[n] ?? []
          const selfSh = palace.selfStarSihua[n] ?? []
          return (
            <span key={n} className="flex items-center gap-0.5 flex-wrap">
              <span className={`font-bold ${STR_COLOR[s.level]}`}>{n}</span>
              <span className="text-[8px] text-[#8A8071]">{s.label}</span>
              {sh.map(t => <StarTag key={t} type={t} label={SIHUA_LABEL[t]} />)}
              {selfSh.map(t => <StarTag key={'s'+t} type={t} label={SIHUA_LABEL[t]} self />)}
            </span>
          )
        }) : <span className="text-[#8A8071] italic">空宮</span>}
      </div>

      {/* 輔星（只顯示前8顆避免擁擠） */}
      <div className="flex flex-wrap gap-x-1 text-[9px] text-[#8A8071] mb-1">
        {palace.minorStars.slice(0, 8).map(s => {
          const sh = palace.starSihua[s.name] ?? []
          return (
            <span key={s.name} className={s.type === 'liang' ? 'text-[#5A7A5A]' : 'text-red-400'}>
              {s.name}{sh.map(t => SIHUA_LABEL[t]).join('')}
            </span>
          )
        })}
      </div>

      {/* 宮干 */}
      <div className="text-[9px] text-[#8A8071] border-t border-[#E3DBC9] pt-1 mt-1">
        宮干 <span className="text-[#5B8CA8] font-bold">{palace.stem}</span>
      </div>
    </div>
  )
}

export default function ZiweiCalculator() {
  const [mode, setMode] = useState<'lunar' | 'solar'>('lunar')
  const [lunarYear, setLunarYear] = useState('')
  const [lunarMonth, setLunarMonth] = useState('1')
  const [lunarDay, setLunarDay] = useState('')
  const [solarYear, setSolarYear] = useState('')
  const [solarMonth, setSolarMonth] = useState('')
  const [solarDay, setSolarDay] = useState('')
  const [hourIdx, setHourIdx] = useState('0')
  const [gender, setGender] = useState<'M' | 'F'>('M')
  const [error, setError] = useState('')
  const [result, setResult] = useState<ZiweiResult | null>(null)
  const [selectedDz, setSelectedDz] = useState<number | null>(null)

  function handleCalc() {
    setError('')
    let ly: number, lm: number, ld: number

    if (mode === 'solar') {
      const sy = parseInt(solarYear), sm = parseInt(solarMonth), sd = parseInt(solarDay)
      if (!sy || !sm || !sd) { setError('請填入陽曆年月日'); return }
      const r = solarToLunar(sy, sm, sd)
      if (!r.ok) { setError(r.note || '換算失敗，請改用農曆輸入'); return }
      ly = r.year; lm = r.month; ld = r.day
    } else {
      ly = parseInt(lunarYear); lm = parseInt(lunarMonth); ld = parseInt(lunarDay)
      if (!ly || !lm || !ld) { setError('請填入農曆年月日'); return }
    }

    if (ly < 1940 || ly > 2030) { setError('年份範圍：1940–2030'); return }
    if (lm < 1 || lm > 12) { setError('月份範圍：1–12'); return }
    if (ld < 1 || ld > 30) { setError('日期範圍：1–30'); return }

    const res = calcZiwei({ lunarYear: ly, lunarMonth: lm, lunarDay: ld, hourIdx: parseInt(hourIdx), gender })
    setResult(res)
    setSelectedDz(null)
  }

  const selectedPalace = result && selectedDz !== null
    ? result.palaces.find(p => p.dzIndex === selectedDz) ?? null
    : null

  return (
    <div className="space-y-8">
      {/* ── 輸入區 ── */}
      <div className="rounded-2xl border border-[#E3DBC9] bg-[#FFFDF8] p-5 space-y-4">
        {/* 模式切換 */}
        <div className="flex gap-2">
          {(['lunar', 'solar'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={[
                'px-4 py-1.5 rounded-full text-sm border transition-colors',
                mode === m
                  ? 'bg-[#2B2A28] text-white border-[#2B2A28]'
                  : 'bg-[#EFE7D6] text-[#2B2A28] border-[#E3DBC9]',
              ].join(' ')}
            >
              {m === 'lunar' ? '農曆輸入（準確）' : '陽曆輸入（自動換算）'}
            </button>
          ))}
        </div>

        {/* 農曆輸入 */}
        {mode === 'lunar' && (
          <div className="flex flex-wrap gap-3 items-end">
            <label className="flex flex-col gap-1">
              <span className="text-xs text-[#8A8071]">農曆年</span>
              <input type="number" value={lunarYear} onChange={e => setLunarYear(e.target.value)}
                placeholder="如 1988" className="w-24 border border-[#E3DBC9] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#B23E26]/50" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-[#8A8071]">農曆月</span>
              <select value={lunarMonth} onChange={e => setLunarMonth(e.target.value)}
                className="border border-[#E3DBC9] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none">
                {Array.from({length:12},(_,i) => (
                  <option key={i+1} value={i+1}>{['正','二','三','四','五','六','七','八','九','十','十一','十二'][i]}月</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-[#8A8071]">農曆日</span>
              <input type="number" min={1} max={30} value={lunarDay} onChange={e => setLunarDay(e.target.value)}
                placeholder="1–30" className="w-20 border border-[#E3DBC9] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#B23E26]/50" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-[#8A8071]">時辰</span>
              <select value={hourIdx} onChange={e => setHourIdx(e.target.value)}
                className="border border-[#E3DBC9] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none">
                {HOUR_LABELS.map((l, i) => <option key={i} value={i}>{l}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-[#8A8071]">性別</span>
              <select value={gender} onChange={e => setGender(e.target.value as 'M'|'F')}
                className="border border-[#E3DBC9] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none">
                <option value="M">男</option>
                <option value="F">女</option>
              </select>
            </label>
            <button onClick={handleCalc}
              className="min-h-[42px] px-6 rounded-xl bg-[#B23E26] hover:bg-[#9A3420] text-white font-semibold text-sm transition-colors">
              排盤
            </button>
          </div>
        )}

        {/* 陽曆輸入 */}
        {mode === 'solar' && (
          <div className="flex flex-wrap gap-3 items-end">
            <label className="flex flex-col gap-1">
              <span className="text-xs text-[#8A8071]">陽曆年</span>
              <input type="number" value={solarYear} onChange={e => setSolarYear(e.target.value)}
                placeholder="如 1988" className="w-24 border border-[#E3DBC9] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#B23E26]/50" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-[#8A8071]">月</span>
              <input type="number" min={1} max={12} value={solarMonth} onChange={e => setSolarMonth(e.target.value)}
                placeholder="1–12" className="w-20 border border-[#E3DBC9] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#B23E26]/50" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-[#8A8071]">日</span>
              <input type="number" min={1} max={31} value={solarDay} onChange={e => setSolarDay(e.target.value)}
                placeholder="1–31" className="w-20 border border-[#E3DBC9] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#B23E26]/50" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-[#8A8071]">時辰</span>
              <select value={hourIdx} onChange={e => setHourIdx(e.target.value)}
                className="border border-[#E3DBC9] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none">
                {HOUR_LABELS.map((l, i) => <option key={i} value={i}>{l}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-[#8A8071]">性別</span>
              <select value={gender} onChange={e => setGender(e.target.value as 'M'|'F')}
                className="border border-[#E3DBC9] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none">
                <option value="M">男</option>
                <option value="F">女</option>
              </select>
            </label>
            <button onClick={handleCalc}
              className="min-h-[42px] px-6 rounded-xl bg-[#B23E26] hover:bg-[#9A3420] text-white font-semibold text-sm transition-colors">
              排盤
            </button>
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}
        {mode === 'solar' && (
          <p className="text-xs text-[#8A8071]">⚠ 自動換算農曆，閏月年份請核實並改用農曆輸入</p>
        )}
      </div>

      {/* ── 命盤結果 ── */}
      {result && (
        <div className="space-y-6">
          {/* 基本資料 */}
          <div className="rounded-2xl border border-[#E3DBC9] bg-[#FFFDF8] p-4">
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <div><span className="text-[#8A8071] text-xs">生年干支</span><div className="font-bold text-[#B23E26]">{result.yearTG}{result.yearDZ}年</div></div>
              <div><span className="text-[#8A8071] text-xs">命宮</span><div className="font-bold text-[#B23E26]">{result.mingTG}{DZ[result.mingDz]}</div></div>
              <div><span className="text-[#8A8071] text-xs">身宮</span><div className="font-semibold">{result.shenPalaceName}（{DZ[result.shenDz]}）</div></div>
              <div><span className="text-[#8A8071] text-xs">五行局</span><div className="font-bold text-[#B23E26]">{result.juName}</div></div>
              <div><span className="text-[#8A8071] text-xs">紫微落宮</span><div className="font-semibold">{DZ[result.zDz]}宮</div></div>
              <div><span className="text-[#8A8071] text-xs">性別</span><div className="font-semibold">{result.gender === 'M' ? '男命' : '女命'}</div></div>
            </div>
          </div>

          {/* 生年四化 */}
          <div className="rounded-2xl border border-[#E3DBC9] bg-[#FFFDF8] p-4">
            <div className="text-xs text-[#8A8071] mb-2 font-semibold tracking-wider">生年四化（{result.yearTG}年干）</div>
            <div className="flex flex-wrap gap-2">
              {(['lu','quan','ke','ji'] as SihuaType[]).map(t => {
                const star = SIHUA[result.yearTG]?.[t]
                const palace = result.palaces.find(p => p.mainStars.includes(star ?? '') || p.minorStars.some(s => s.name === star))
                return (
                  <div key={t} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm ${SIHUA_COLOR[t]}`}>
                    <span className="font-bold">化{SIHUA_LABEL[t]}</span>
                    <span className="font-semibold">{star ?? '—'}</span>
                    {palace && <span className="text-xs opacity-70">→{palace.palaceName}</span>}
                  </div>
                )
              })}
            </div>
          </div>

          {/* 十二宮格 */}
          <div>
            <div className="text-xs text-[#8A8071] mb-2 font-semibold tracking-wider px-1">十二宮命盤（點擊宮格可查看宮干四化）</div>
            <div className="grid grid-cols-4 gap-1.5">
              {GRID_DZ.map((dz, gi) => {
                if (dz === 99) {
                  // gi=5：第一個中宮空位，inline 渲染中宮（2列×2行）
                  if (gi === 5) {
                    return (
                      <div key="center" className="col-span-2 row-span-2 rounded-lg border border-[#E3DBC9] bg-[#F9F5EE] flex flex-col items-center justify-center text-center p-4 gap-2">
                        <div className="text-lg font-serif font-black text-[#B23E26]">紫微斗數</div>
                        <div className="text-xs text-[#8A8071]">
                          {result.yearTG}{result.yearDZ}年<br />
                          {result.gender === 'M' ? '男命' : '女命'}<br />
                          農曆{result.lunarMonth}月{result.lunarDay}日
                        </div>
                        <div className="text-sm text-[#2B2A28] font-semibold">{result.juName}</div>
                        <div className="text-xs text-[#8A8071]">紫微在{DZ[result.zDz]}</div>
                      </div>
                    )
                  }
                  // gi=6,9,10：中宮已佔位，不渲染
                  return null
                }
                const palace = result.palaces.find(p => p.dzIndex === dz)!
                return (
                  <div key={gi} className={`cursor-pointer transition-all ${selectedDz === dz ? 'ring-2 ring-[#B23E26] ring-offset-1 rounded-lg' : ''}`}
                    onClick={() => setSelectedDz(prev => prev === dz ? null : dz)}>
                    <PalaceCell palace={palace} nianTG={result.yearTG} mingDz={result.mingDz} />
                  </div>
                )
              })}
            </div>
          </div>

          {/* 選中宮格：宮干四化詳情 */}
          {selectedPalace && (
            <div className="rounded-2xl border border-[#B23E26]/30 bg-[#FFF5F0] p-4 space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[#B23E26]">{selectedPalace.palaceName} — {selectedPalace.stem}{DZ[selectedPalace.dzIndex]}</h3>
                <span className="text-xs text-[#8A8071]">宮干四化</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(['lu','quan','ke','ji'] as SihuaType[]).map(t => {
                  const star = selectedPalace.sihua[t]
                  const destPalace = star ? result.palaces.find(p =>
                    p.mainStars.includes(star) || p.minorStars.some(s => s.name === star)
                  ) : null
                  return (
                    <div key={t} className={`p-3 rounded-xl border text-center ${SIHUA_COLOR[t]}`}>
                      <div className="text-xs font-bold mb-1">化{SIHUA_LABEL[t]}</div>
                      <div className="font-bold text-base">{star ?? '—'}</div>
                      {destPalace && <div className="text-xs opacity-70 mt-1">飛入{destPalace.palaceName}</div>}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* 大限 */}
          <div className="rounded-2xl border border-[#E3DBC9] bg-[#FFFDF8] p-4">
            <div className="text-xs text-[#8A8071] mb-3 font-semibold tracking-wider">大限</div>
            <div className="space-y-1.5">
              {result.daYuns.map(dy => (
                <div key={dy.index} className={[
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm',
                  dy.isCurrent ? 'bg-[#B23E26]/10 border border-[#B23E26]/30' : 'border border-transparent hover:bg-[#F4EEE1]',
                ].join(' ')}>
                  <div className="w-16 font-bold text-[#B23E26]">{dy.stem}{DZ[dy.dzIndex]}</div>
                  <div className="w-20 text-xs text-[#8A8071]">{dy.ageStart}–{dy.ageEnd}歲</div>
                  <div className="w-24 text-xs text-[#8A8071]">{dy.yearStart}–{dy.yearEnd}</div>
                  <div className="flex-1 text-xs text-[#5A5247]">{dy.palaceName} · {dy.mainStars.join(' ') || '空宮'}</div>
                  {dy.isCurrent && <span className="text-xs font-bold text-[#B23E26] flex-none">現行大限</span>}
                </div>
              ))}
            </div>
          </div>

          {/* AI Pack */}
          <ZiweiAiPanel result={result} />
        </div>
      )}
    </div>
  )
}
