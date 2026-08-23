'use client'
import { useState, useMemo, useCallback } from 'react'
import { track } from '@vercel/analytics'
import type { BaziResult } from '@/lib/bazi-calc'
import type { ArticleMeta } from '@/types'
import { buildBaziPack } from '@/lib/bazi/pack/buildBaziPack'
import { assemblePrompt, PRESETS } from '@/lib/bazi/pack/prompts'
import type { PresetId } from '@/lib/bazi/pack/prompts'
import type { PackLevel } from '@/lib/bazi/pack/buildBaziPack'

interface AiReadingPanelProps {
  result: BaziResult
  /** form state from BaziCalculator */
  form: {
    year: string; month: string; day: string; hour: string; gender: string
    timeMode: string; h24: string; min: string
    trueSolar: string; place: string; customLon: string; zishi: string
  }
  currentYear: number
  /** articles matching the day-master element, for 延伸閱讀 */
  articles?: ArticleMeta[]
  nearSolarTermWarning?: string
}

const PLACES_LON: Record<string, { label: string; lon: number }> = {
  HK: { label: '香港', lon: 114.17 }, MO: { label: '澳門', lon: 113.55 },
  TP: { label: '台北', lon: 121.52 }, GZ: { label: '廣州', lon: 113.26 },
  SZ: { label: '深圳', lon: 114.06 }, SG: { label: '新加坡', lon: 103.82 },
  KL: { label: '吉隆坡', lon: 101.69 }, TO: { label: '多倫多', lon: -79.38 },
  VA: { label: '溫哥華', lon: -123.12 }, LD: { label: '倫敦', lon: -0.13 },
  SY: { label: '悉尼', lon: 151.21 },
}

export default function AiReadingPanel({ result, form, currentYear, articles = [], nearSolarTermWarning }: AiReadingPanelProps) {
  const [preset, setPreset] = useState<PresetId>('overview')
  const [level, setLevel] = useState<PackLevel>('full')
  const [question, setQuestion] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [copiedAll, setCopiedAll] = useState(false)
  const [copiedPack, setCopiedPack] = useState(false)

  const selectedPreset = PRESETS.find((p) => p.id === preset)!

  const packInput = useMemo(() => {
    const placeInfo = PLACES_LON[form.place] ?? { label: '香港（預設）', lon: 114.17 }
    const placeLabel = form.place === 'CUSTOM' ? `自訂（${form.customLon}°）` : `${placeInfo.label}`
    const hourBranchIndex = parseInt(form.hour) || -1
    const clock = form.timeMode === 'exact'
      ? { h: parseInt(form.h24) || 0, m: parseInt(form.min) || 0 }
      : undefined
    const articleItems = articles.slice(0, 5).map((a) => ({
      title: a.title,
      url: `https://destinysolver.com/articles/${a.slug}`,
    }))
    const permalink = typeof window !== 'undefined' ? window.location.href : 'https://destinysolver.com/bazi'
    const today = new Date()
    const generatedOn = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`

    return {
      result,
      gender: form.gender as 'M' | 'F',
      year: parseInt(form.year) || 0,
      month: parseInt(form.month) || 1,
      day: parseInt(form.day) || 1,
      hourBranchIndex,
      timeMode: form.timeMode as 'branch' | 'exact' | 'unknown',
      clock,
      trueSolar: form.trueSolar === '1' ? {
        applied: true,
        lon: parseFloat(form.place === 'CUSTOM' ? form.customLon : String(placeInfo.lon)),
      } : undefined,
      zishiRule: (form.zishi === '00' ? '00' : '23') as '23' | '00',
      placeName: placeLabel,
      nearSolarTermWarning,
      currentYear,
      level,
      permalink,
      generatedOn,
      articles: level === 'full' ? articleItems : [],
    }
  }, [result, form, currentYear, articles, level, nearSolarTermWarning])

  const pack = useMemo(() => {
    try { return buildBaziPack(packInput) } catch { return '' }
  }, [packInput])

  const promptText = useMemo(() => {
    if (!pack) return ''
    return assemblePrompt({
      presetId: preset,
      pack,
      question: question.trim() || undefined,
      currentYear,
    })
  }, [pack, preset, question, currentYear])

  const doCopy = useCallback((text: string, setter: (v: boolean) => void) => {
    if (!text) return
    const flash = () => { setter(true); setTimeout(() => setter(false), 2000) }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(flash).catch(() => fallback(text, flash))
    } else {
      fallback(text, flash)
    }
  }, [])

  function fallback(text: string, cb: () => void) {
    const el = document.createElement('textarea')
    el.value = text
    el.style.cssText = 'position:fixed;opacity:0;pointer-events:none'
    document.body.appendChild(el)
    el.focus(); el.select()
    try { document.execCommand('copy'); cb() } catch {}
    document.body.removeChild(el)
  }

  return (
    <section className="rounded-2xl border border-[#E3DBC9] bg-[#FFFDF8] p-5 space-y-4"
      aria-labelledby="ai-panel-title">
      <div>
        <h2 id="ai-panel-title" className="text-lg font-bold text-[#2B2A28]">交給 AI 解讀</h2>
        <p className="text-sm text-[#6B665C] mt-1">
          排好盤，下一步是問對問題。選擇一個方向，複製至您慣用的 ChatGPT、Claude、Gemini，它將依照這張盤為您解讀。免費、免登入。
        </p>
        {form.timeMode === 'unknown' && (
          <p className="text-xs text-[#6B665C] mt-2">
            時辰不詳：資料包只有三柱，AI 解讀會較粗。
          </p>
        )}
      </div>

      {/* Preset chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" role="radiogroup" aria-label="解讀方向">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            role="radio"
            aria-checked={preset === p.id}
            onClick={() => setPreset(p.id)}
            className={[
              'flex-none rounded-full px-3 py-1.5 text-sm whitespace-nowrap border transition-colors',
              preset === p.id
                ? 'bg-[#2B2A28] text-white border-[#2B2A28]'
                : 'bg-[#EFE7D6] text-[#2B2A28] border-[#E3DBC9] hover:border-[#2B2A28]/30',
            ].join(' ')}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Blurb */}
      <p className="text-sm text-[#6B665C] min-h-[1.4em]">{selectedPreset.blurb}</p>

      {/* Optional question textarea */}
      <div>
        <label htmlFor="ai-question" className="block text-xs text-[#6B665C] mb-1">
          我的問題（選填，300 字內）{selectedPreset.needsQuestion && <span className="text-[#B23E26]"> ＊必填</span>}
        </label>
        <textarea
          id="ai-question"
          maxLength={300}
          rows={2}
          placeholder="例：我想知道今年換工作是否好時機"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full border border-[#E3DBC9] rounded-xl px-3 py-2 text-sm bg-white resize-y focus:outline-none focus:border-[#B23E26]/50"
        />
      </div>

      {/* Copy buttons */}
      {(() => {
        const freeAndEmpty = preset === 'free' && !question.trim()
        return (
          <div className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => { doCopy(promptText, setCopiedAll); track('pack_copy', { tool: 'bazi', type: 'full', preset }) }}
                disabled={selectedPreset.needsQuestion && !question.trim()}
                className="min-h-[44px] rounded-xl bg-[#8B3A2F] hover:bg-[#7A3128] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors"
              >
                {copiedAll ? '已複製 ✓' : '複製 Prompt＋資料包'}
              </button>
              <button
                onClick={() => { if (!freeAndEmpty) { doCopy(pack, setCopiedPack); track('pack_copy', { tool: 'bazi', type: 'pack', preset }) } }}
                disabled={freeAndEmpty}
                className="min-h-[44px] rounded-xl border border-[#8B3A2F] text-[#8B3A2F] hover:bg-[#8B3A2F]/5 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-sm transition-colors"
              >
                {copiedPack ? '已複製 ✓' : '只複製資料包'}
              </button>
            </div>
            {freeAndEmpty && (
              <p className="text-xs text-[#8B3A2F] text-center">請先寫下您想詢問的事項</p>
            )}
          </div>
        )
      })()}

      {/* Level radio */}
      <div className="flex gap-4 text-sm text-[#6B665C]">
        <span>資料包：</span>
        {(['full', 'basic'] as PackLevel[]).map((l) => (
          <label key={l} className="flex items-center gap-1.5 cursor-pointer">
            <input type="radio" name="ai-level" value={l} checked={level === l} onChange={() => setLevel(l)}
              className="accent-[#8B3A2F]" />
            {l === 'full' ? '完整包' : '基礎包（較短）'}
          </label>
        ))}
      </div>

      {/* Preview */}
      <details onToggle={(e) => setShowPreview((e.currentTarget as HTMLDetailsElement).open)}>
        <summary className="text-sm cursor-pointer text-[#6B665C] hover:text-[#2B2A28]">
          預覽將會複製嘅全文
        </summary>
        {showPreview && (
          <pre className="mt-2 p-3 bg-white border border-[#E3DBC9] rounded-xl text-xs leading-relaxed whitespace-pre-wrap break-words max-h-[40vh] overflow-auto">
            {promptText || '（尚未產生）'}
          </pre>
        )}
      </details>

      {/* AI links */}
      <div className="flex gap-4 text-sm flex-wrap">
        <span className="text-[#6B665C]">貼上去：</span>
        {[
          { label: '開 ChatGPT ↗', href: 'https://chatgpt.com/' },
          { label: '開 Claude ↗',  href: 'https://claude.ai/new' },
          { label: '開 Gemini ↗',  href: 'https://gemini.google.com/app' },
        ].map(({ label, href }) => (
          <a key={href} href={href} target="_blank" rel="noopener noreferrer"
            className="text-[#8B3A2F] hover:underline">
            {label}
          </a>
        ))}
      </div>

      {/* Privacy note */}
      <p className="text-xs text-[#6B665C]">
        連結與資料包含出生資料，請僅分享給您信任的人或 AI 服務。
      </p>
    </section>
  )
}
