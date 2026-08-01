'use client'

import { useState } from 'react'
import { BookOpen, Trash2, Pencil, Check, X } from 'lucide-react'
import type { SavedChart } from './useChartLibrary'

function fmt(ts: number) {
  return new Date(ts).toLocaleDateString('zh-HK', { year: 'numeric', month: 'short', day: 'numeric' })
}

function RenameRow({ chart, onRename, onCancel }: {
  chart: SavedChart
  onRename: (name: string) => void
  onCancel: () => void
}) {
  const [val, setVal] = useState(chart.name)
  return (
    <div className="flex items-center gap-2 min-w-0 flex-1">
      <input
        autoFocus
        value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') onRename(val); if (e.key === 'Escape') onCancel() }}
        className="flex-1 min-w-0 bg-[#2B241C]/[0.05] border border-[#B23E26]/40 text-[#2B241C] rounded px-2 py-0.5 text-sm outline-none"
      />
      <button type="button" onClick={() => onRename(val)} aria-label="確認" className="text-[#B23E26] hover:opacity-70"><Check size={14} /></button>
      <button type="button" onClick={onCancel} aria-label="取消" className="text-[#8A8071] hover:opacity-70"><X size={14} /></button>
    </div>
  )
}

export default function ChartLibrary({ charts, onLoad, onRemove, onRename }: {
  charts: SavedChart[]
  onLoad: (chart: SavedChart) => void
  onRemove: (id: string) => void
  onRename: (id: string, name: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [renamingId, setRenamingId] = useState<string | null>(null)

  if (charts.length === 0) return null

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 text-xs text-[#6B6155] hover:text-[#B23E26] transition-colors"
      >
        <BookOpen size={13} />
        <span>已儲存命盤（{charts.length}）</span>
        <span className="text-[10px] opacity-60">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <ul className="mt-3 space-y-2 max-h-64 overflow-y-auto pr-1">
          {charts.map(c => (
            <li
              key={c.id}
              className="flex items-center gap-2 rounded-lg border border-[color:var(--border-card)] bg-[#FBF7EE]/[0.02] px-3 py-2"
            >
              {renamingId === c.id ? (
                <RenameRow
                  chart={c}
                  onRename={name => { onRename(c.id, name); setRenamingId(null) }}
                  onCancel={() => setRenamingId(null)}
                />
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => onLoad(c)}
                    className="flex-1 text-left min-w-0"
                  >
                    <span className="block text-sm text-[#2B241C] truncate">{c.name}</span>
                    <span className="block text-[10px] text-[#8A8071]">
                      {c.year}/{c.month}/{c.day} · {c.gender === 'F' ? '女' : '男'} · {fmt(c.savedAt)}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRenamingId(c.id)}
                    aria-label="改名"
                    className="text-[#8A8071] hover:text-[#B23E26] flex-shrink-0 transition-colors"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemove(c.id)}
                    aria-label="刪除"
                    className="text-[#8A8071] hover:text-[#B23E26] flex-shrink-0 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
