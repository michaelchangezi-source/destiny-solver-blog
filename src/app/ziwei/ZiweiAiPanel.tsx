'use client'
import { useState, useMemo, useCallback } from 'react'
import type { ZiweiResult } from '@/lib/ziwei-calc'
import { buildZiweiPack } from '@/lib/ziwei/pack/buildZiweiPack'
import { assembleZiweiPrompt, ZIWEI_PRESETS } from '@/lib/ziwei/pack/prompts'
import type { ZiweiPresetId } from '@/lib/ziwei/pack/prompts'

interface Props {
  result: ZiweiResult
}

export default function ZiweiAiPanel({ result }: Props) {
  const [preset, setPreset] = useState<ZiweiPresetId>('overview')
  const [question, setQuestion] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [copiedAll, setCopiedAll] = useState(false)
  const [copiedPack, setCopiedPack] = useState(false)

  const selectedPreset = ZIWEI_PRESETS.find(p => p.id === preset)!

  const pack = useMemo(() => {
    try { return buildZiweiPack(result) } catch { return '' }
  }, [result])

  const promptText = useMemo(() => {
    if (!pack) return ''
    return assembleZiweiPrompt({ presetId: preset, pack, question: question.trim() || undefined })
  }, [pack, preset, question])

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
    el.value = text; el.style.cssText = 'position:fixed;opacity:0;pointer-events:none'
    document.body.appendChild(el); el.focus(); el.select()
    try { document.execCommand('copy'); cb() } catch {}
    document.body.removeChild(el)
  }

  return (
    <section className="rounded-2xl border border-[#E3DBC9] bg-[#FFFDF8] p-5 space-y-4" aria-labelledby="ziwei-ai-title">
      <div>
        <h2 id="ziwei-ai-title" className="text-lg font-bold text-[#2B2A28]">交給 AI 解讀</h2>
        <p className="text-sm text-[#6B665C] mt-1">
          排好盤，選一個方向，複製去 ChatGPT、Claude 或 Gemini，AI 會照呢張紫微命盤答你。
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" role="radiogroup" aria-label="解讀方向">
        {ZIWEI_PRESETS.map(p => (
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

      <p className="text-sm text-[#6B665C] min-h-[1.4em]">{selectedPreset.blurb}</p>

      <div>
        <label htmlFor="ziwei-question" className="block text-xs text-[#6B665C] mb-1">
          我的問題（選填，300 字內）{selectedPreset.needsQuestion && <span className="text-[#B23E26]"> ＊必填</span>}
        </label>
        <textarea
          id="ziwei-question"
          maxLength={300}
          rows={2}
          placeholder="例：我想知命宮七殺對我嘅事業有咩影響"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          className="w-full border border-[#E3DBC9] rounded-xl px-3 py-2 text-sm bg-white resize-y focus:outline-none focus:border-[#B23E26]/50"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => doCopy(promptText, setCopiedAll)}
          disabled={selectedPreset.needsQuestion && !question.trim()}
          className="min-h-[44px] rounded-xl bg-[#8B3A2F] hover:bg-[#7A3128] disabled:opacity-40 text-white font-semibold text-sm transition-colors"
        >
          {copiedAll ? '已複製 ✓' : '複製 Prompt＋資料包'}
        </button>
        <button
          onClick={() => doCopy(pack, setCopiedPack)}
          className="min-h-[44px] rounded-xl border border-[#8B3A2F] text-[#8B3A2F] hover:bg-[#8B3A2F]/5 font-semibold text-sm transition-colors"
        >
          {copiedPack ? '已複製 ✓' : '只複製資料包'}
        </button>
      </div>

      <details onToggle={e => setShowPreview((e.currentTarget as HTMLDetailsElement).open)}>
        <summary className="text-sm cursor-pointer text-[#6B665C] hover:text-[#2B2A28]">預覽將會複製嘅全文</summary>
        {showPreview && (
          <pre className="mt-2 p-3 bg-white border border-[#E3DBC9] rounded-xl text-xs leading-relaxed whitespace-pre-wrap break-words max-h-[40vh] overflow-auto">
            {promptText || '（尚未產生）'}
          </pre>
        )}
      </details>

      <div className="flex gap-4 text-sm flex-wrap">
        <span className="text-[#6B665C]">貼上去：</span>
        {[
          { label: '開 ChatGPT ↗', href: 'https://chatgpt.com/' },
          { label: '開 Claude ↗',  href: 'https://claude.ai/new' },
          { label: '開 Gemini ↗',  href: 'https://gemini.google.com/app' },
        ].map(({ label, href }) => (
          <a key={href} href={href} target="_blank" rel="noopener noreferrer" className="text-[#8B3A2F] hover:underline">{label}</a>
        ))}
      </div>

      <p className="text-xs text-[#6B665C]">資料包含生日資料，請僅分享給您信任的 AI 服務。</p>
    </section>
  )
}
