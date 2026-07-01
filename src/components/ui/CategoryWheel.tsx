'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { CATEGORY_SLUGS, getCategoryAccent } from '@/types'

interface Props {
  categories: string[]
}

/**
 * 分類軸輪：拖曳圓環旋轉選取分類，頂部為選中位置，中央圓形顯示當前分類。
 * 每個分類本身都係獨立連結，直接撳都可以即跳，唔使旋到啱先撳到。
 */
export default function CategoryWheel({ categories }: Props) {
  const dialRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState(420)
  const [rotation, setRotation] = useState(-90)
  const [selected, setSelected] = useState(categories[0] ?? '')
  const draggingRef = useRef(false)
  const movedRef = useRef(false)
  const lastAngleRef = useRef(0)
  const n = categories.length
  const radius = size * 0.36

  function angleFromPoint(clientX: number, clientY: number) {
    const rect = dialRef.current!.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    return Math.atan2(clientY - cy, clientX - cx) * (180 / Math.PI)
  }

  function nearestCategory(rot: number) {
    let bestIdx = 0
    let bestDist = Infinity
    categories.forEach((_, i) => {
      const baseAngle = (360 / n) * i
      let normAngle = (baseAngle + rot) % 360
      if (normAngle < 0) normAngle += 360
      const dist = Math.min(Math.abs(normAngle - 270), 360 - Math.abs(normAngle - 270))
      if (dist < bestDist) {
        bestDist = dist
        bestIdx = i
      }
    })
    return categories[bestIdx]
  }

  useEffect(() => {
    setSelected(nearestCategory(rotation))
    const el = dialRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width
      if (w) setSize(w)
    })
    ro.observe(el)
    return () => ro.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handlePointerDown(e: React.PointerEvent) {
    draggingRef.current = true
    movedRef.current = false
    lastAngleRef.current = angleFromPoint(e.clientX, e.clientY)
    dialRef.current?.setPointerCapture(e.pointerId)
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!draggingRef.current) return
    const a = angleFromPoint(e.clientX, e.clientY)
    let delta = a - lastAngleRef.current
    if (delta > 180) delta -= 360
    if (delta < -180) delta += 360
    if (Math.abs(delta) > 0.3) {
      movedRef.current = true
      setRotation((r) => {
        const next = r + delta
        setSelected(nearestCategory(next))
        return next
      })
      lastAngleRef.current = a
    }
  }

  function handlePointerUp() {
    draggingRef.current = false
  }

  function handleItemClick(e: React.MouseEvent) {
    if (movedRef.current) e.preventDefault()
  }

  return (
    <div className="flex flex-col items-center py-6">
      <div
        ref={dialRef}
        className="relative touch-none select-none"
        style={{ width: '100%', maxWidth: 460, aspectRatio: '1 / 1' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className="absolute inset-0 rounded-full border border-dashed border-[#2B241C]/15" />
        <div className="absolute left-1/2 top-0 h-0 w-0 -translate-x-1/2 -translate-y-1/2 border-x-[7px] border-x-transparent border-t-[12px] border-t-[#B23E26]" />

        <div className="absolute left-1/2 top-1/2 flex h-[38%] w-[38%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-[#2B241C]/15 bg-[#FBF6EC] text-center shadow-[0_10px_26px_-16px_rgba(33,28,21,.35)]">
          <Link
            href={`/categories/${CATEGORY_SLUGS[selected] ?? selected}`}
            className="font-serif text-2xl font-black leading-tight px-3 transition-colors hover:text-[#B23E26] sm:text-[28px]"
          >
            {selected}
          </Link>
        </div>

        {categories.map((cat, i) => {
          const baseAngle = (360 / n) * i
          const angle = ((baseAngle + rotation) * Math.PI) / 180
          const x = Math.cos(angle) * radius
          const y = Math.sin(angle) * radius
          const color = getCategoryAccent(cat)
          let normAngle = (baseAngle + rotation) % 360
          if (normAngle < 0) normAngle += 360
          const dist = Math.min(Math.abs(normAngle - 270), 360 - Math.abs(normAngle - 270))
          const isNear = dist < 360 / n / 2

          return (
            <Link
              key={cat}
              href={`/categories/${CATEGORY_SLUGS[cat] ?? cat}`}
              onClick={handleItemClick}
              className={`absolute left-1/2 top-1/2 flex w-28 flex-col items-center gap-1.5 text-center transition-colors ${
                isNear ? 'text-[17px] font-semibold text-[#2B241C]' : 'text-[15px] font-medium text-[#6B6155]'
              }`}
              style={{ transform: `translate(-50%, -50%) translate(${x}px, ${y}px)` }}
            >
              <span className="h-[7px] w-[7px] rounded-full" style={{ background: color }} />
              {cat}
            </Link>
          )
        })}
      </div>
      <p className="mt-6 text-xs text-[#9C9282]">拖曳圓環轉動，或直接撳選分類</p>
    </div>
  )
}
