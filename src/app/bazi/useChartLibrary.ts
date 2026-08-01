'use client'

import { useState, useCallback, useEffect } from 'react'

export type SavedChart = {
  id: string
  name: string
  savedAt: number
  // form params (same shape as URL params)
  year: string
  month: string
  day: string
  hour: string
  gender: string
  timeMode: string
  h24: string
  min: string
  trueSolar: string
  place: string
  customLon: string
  zishi: string
}

const LS_KEY = 'bazi_library_v1'

function loadAll(): SavedChart[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) ?? '[]')
  } catch {
    return []
  }
}

function saveAll(charts: SavedChart[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(charts))
}

export function useChartLibrary() {
  const [charts, setCharts] = useState<SavedChart[]>([])

  useEffect(() => {
    setCharts(loadAll())
  }, [])

  const save = useCallback((name: string, params: Omit<SavedChart, 'id' | 'name' | 'savedAt'>) => {
    const entry: SavedChart = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name: name.trim() || '未命名',
      savedAt: Date.now(),
      ...params,
    }
    setCharts(prev => {
      const next = [entry, ...prev]
      saveAll(next)
      return next
    })
    return entry.id
  }, [])

  const remove = useCallback((id: string) => {
    setCharts(prev => {
      const next = prev.filter(c => c.id !== id)
      saveAll(next)
      return next
    })
  }, [])

  const rename = useCallback((id: string, name: string) => {
    setCharts(prev => {
      const next = prev.map(c => c.id === id ? { ...c, name: name.trim() || c.name } : c)
      saveAll(next)
      return next
    })
  }, [])

  return { charts, save, remove, rename }
}
