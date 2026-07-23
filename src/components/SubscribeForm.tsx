'use client'

import { useState } from 'react'
import { Mail, Check, Loader2 } from 'lucide-react'

type Status = 'idle' | 'loading' | 'ok' | 'error'

interface Props {
  /** compact 用於 footer，default 用於文章尾的較大區塊 */
  variant?: 'default' | 'compact'
}

export default function SubscribeForm({ variant = 'default' }: Props) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'loading') return
    setStatus('loading')
    setMessage('')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.ok) {
        setStatus('ok')
        setMessage(data.already ? '你已在名單中，感謝支持。' : '訂閱成功，請查收確認電郵。')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || '訂閱暫時無法完成，請稍後再試。')
      }
    } catch {
      setStatus('error')
      setMessage('網絡錯誤，請稍後再試。')
    }
  }

  if (status === 'ok') {
    return (
      <div
        aria-live="polite"
        className={`flex items-center gap-2 text-[#2B241C] ${
          variant === 'compact' ? 'text-sm' : 'text-base justify-center'
        }`}
      >
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#B23E26] text-[#F7F1E5] shrink-0">
          <Check size={14} />
        </span>
        <span>{message}</span>
      </div>
    )
  }

  const compact = variant === 'compact'

  return (
    <form onSubmit={submit} className="w-full">
      <div className={`flex gap-2 ${compact ? 'flex-col sm:flex-row' : 'flex-col sm:flex-row'}`}>
        <div className="relative flex-1">
          <Mail
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6155] pointer-events-none"
          />
          <input
            type="email"
            required
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="你的電郵地址"
            aria-label="電郵地址"
            className="w-full rounded-md border border-[#2B241C]/15 bg-[#FBF7EE] py-2.5 pl-9 pr-3 text-sm text-[#2B241C] placeholder:text-[#6B6155] focus:border-[#B23E26]/50 focus:outline-none focus:ring-2 focus:ring-[#B23E26]/15 transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="flex items-center justify-center gap-2 bg-[#E0552C] hover:bg-[#C9461F] disabled:opacity-60 text-[#F7F1E5] text-sm font-bold px-5 py-2.5 rounded-md transition-all active:scale-[0.97] whitespace-nowrap"
        >
          {status === 'loading' ? <Loader2 size={15} className="animate-spin" /> : null}
          訂閱
        </button>
      </div>
      {status === 'error' && message && (
        <p aria-live="polite" className="mt-2 text-xs text-[#B23E26]">{message}</p>
      )}
    </form>
  )
}
