'use client'

import { useState } from 'react'
import type { WesternResult } from '@/lib/western-calc'
import { buildWesternPack } from '@/lib/western/pack/buildWesternPack'
import { WESTERN_PRESETS, assembleWesternPrompt, type WesternPresetId } from '@/lib/western/pack/prompts'

export default function WesternAiPanel({ result }: { result: WesternResult }) {
  const [preset, setPreset] = useState<WesternPresetId>('overview')
  const [question, setQuestion] = useState('')
  const [copied, setCopied] = useState<'pack' | 'prompt' | null>(null)
  const [showPack, setShowPack] = useState(false)

  const pack = buildWesternPack(result)
  const fullPrompt = assembleWesternPrompt({ presetId: preset, pack, question })
  const needsQuestion = WESTERN_PRESETS.find(p => p.id === preset)?.needsQuestion ?? false

  const copy = async (text: string, key: 'pack' | 'prompt') => {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const encodePrompt = (text: string) => encodeURIComponent(text.slice(0, 1800))

  return (
    <div className="mt-8 border border-[#B23E26]/20 rounded-2xl overflow-hidden bg-[#FFFDF8]">
      <div className="px-5 py-4 bg-[#B23E26]/5 border-b border-[#B23E26]/10">
        <p className="text-[#B23E26] font-semibold text-sm tracking-wide">交給 AI 解讀</p>
        <p className="text-[#6B6155] text-xs mt-0.5">選擇分析方向，複製資料包貼入 ChatGPT / Claude / Gemini</p>
      </div>

      <div className="p-5 space-y-4">
        {/* 預設方向選擇 */}
        <div className="flex flex-wrap gap-2">
          {WESTERN_PRESETS.map(p => (
            <button
              key={p.id}
              onClick={() => setPreset(p.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                preset === p.id
                  ? 'bg-[#B23E26] text-white'
                  : 'bg-[#F4EEE1] text-[#5A5247] hover:bg-[#B23E26]/10'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* 自由提問輸入框 */}
        {needsQuestion && (
          <textarea
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="輸入你的問題，例如：今年的感情運如何？"
            rows={3}
            className="w-full text-sm text-[#2B241C] bg-[#F4EEE1] border border-[#2B241C]/10 rounded-lg px-3 py-2.5 resize-none focus:outline-none focus:ring-1 focus:ring-[#B23E26]/40 placeholder:text-[#9B9089]"
          />
        )}

        {/* 按鈕列 */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => copy(fullPrompt, 'prompt')}
            className="flex-1 min-w-[140px] bg-[#B23E26] hover:bg-[#9B3320] text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            {copied === 'prompt' ? '已複製 ✓' : '複製 Prompt＋資料包'}
          </button>
          <button
            onClick={() => copy(pack, 'pack')}
            className="bg-[#F4EEE1] hover:bg-[#E8DFD0] text-[#5A5247] text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            {copied === 'pack' ? '已複製 ✓' : '只複製資料包'}
          </button>
          <button
            onClick={() => setShowPack(v => !v)}
            className="bg-[#F4EEE1] hover:bg-[#E8DFD0] text-[#5A5247] text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            {showPack ? '收起預覽' : '預覽資料包'}
          </button>
        </div>

        {/* AI 連結 */}
        <div className="flex flex-wrap gap-2 text-[11px]">
          <span className="text-[#9B9089]">直接開啟：</span>
          <a
            href={`https://chatgpt.com/?q=${encodePrompt(fullPrompt)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#B23E26] hover:underline"
          >
            ChatGPT ↗
          </a>
          <a
            href={`https://claude.ai/new?q=${encodePrompt(fullPrompt)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#B23E26] hover:underline"
          >
            Claude ↗
          </a>
          <a
            href={`https://gemini.google.com/app?q=${encodePrompt(fullPrompt)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#B23E26] hover:underline"
          >
            Gemini ↗
          </a>
        </div>

        {/* 資料包預覽 */}
        {showPack && (
          <pre className="text-[11px] text-[#5A5247] bg-[#F4EEE1] rounded-lg p-4 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
            {pack}
          </pre>
        )}
      </div>
    </div>
  )
}
