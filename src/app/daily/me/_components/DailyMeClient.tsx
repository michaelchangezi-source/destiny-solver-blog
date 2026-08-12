'use client'

import { useCallback, useMemo, useSyncExternalStore } from 'react'
import { dayPillarFromBirth, isValidPillar, relate } from '@/lib/daily-relate'
import type { Pillar } from '@/lib/daily-relate'
import BirthInput from './BirthInput'
import ResultCard from './ResultCard'

/** 由 server 傳落嚟的流日干支。source of truth 一律係 bazi-daily.ts（§3.4）。 */
export interface DayFeedItem {
  /** 香港曆日，YYYY-MM-DD */
  date: string
  stem: string
  branch: string
  label: string
}

const STORAGE_KEY = 'ds-daily-pillar'

// ── localStorage 當 external store 用 ─────────────────────
// 用 useSyncExternalStore 而唔用 useEffect + setState：localStorage 本身就係
// 外部狀態，呢個 hook 就係為呢種情況而設，同時避免 hydration 落差。
// snapshot 必須回傳穩定值，故回傳原始字串，parse 交俾 useMemo。

const listeners = new Set<() => void>()

function subscribe(cb: () => void) {
  listeners.add(cb)
  window.addEventListener('storage', cb)
  return () => {
    listeners.delete(cb)
    window.removeEventListener('storage', cb)
  }
}

function emit() {
  listeners.forEach(cb => cb())
}

function getSnapshot(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function getServerSnapshot(): string | null {
  return null
}

/**
 * localStorage 只存日柱兩個字，不存生日原值（§3.1 私隱決定）。
 * 日柱是六十分之一的粗粒度，不構成識別；生日則是個人資料。
 */
function parseStored(raw: string | null): Pillar | null {
  if (!raw) return null
  try {
    const v = JSON.parse(raw)
    if (typeof v?.stem !== 'string' || typeof v?.branch !== 'string') return null
    if (!isValidPillar(v.stem, v.branch)) return null
    return { stem: v.stem, branch: v.branch }
  } catch {
    return null
  }
}

/**
 * 香港當日的 YYYY-MM-DD。
 * 一律用 Asia/Hong_Kong，不用 client 時區，否則同一日會出兩個答案（§四.6）。
 */
function hkTodayISO(): string {
  const hk = new Date(Date.now() + 8 * 60 * 60 * 1000)
  const y = hk.getUTCFullYear()
  const m = String(hk.getUTCMonth() + 1).padStart(2, '0')
  const d = String(hk.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export default function DailyMeClient({ feed }: { feed: DayFeedItem[] }) {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const pillar = useMemo(() => parseStored(raw), [raw])

  const handleSubmit = useCallback((y: number, m: number, d: number) => {
    const p = dayPillarFromBirth(y, m, d)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ stem: p.stem, branch: p.branch, v: 1 }))
    } catch {
      // 私密瀏覽模式寫唔到，唔阻塞今次閱讀
    }
    emit()
  }, [])

  const handleReset = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // 同上
    }
    emit()
  }, [])

  if (!pillar) {
    return <BirthInput onSubmit={handleSubmit} />
  }

  // server 頁面有 revalidate，快取有可能跨過香港午夜，故傳三日並在此挑正確一日
  const iso = hkTodayISO()
  const today = feed.find(f => f.date === iso) ?? feed[0]
  const todayPillar: Pillar = { stem: today.stem, branch: today.branch }
  const result = relate(pillar, todayPillar)

  return (
    <ResultCard
      userPillar={pillar}
      todayPillar={todayPillar}
      todayLabel={today.label}
      result={result}
      onReset={handleReset}
    />
  )
}
