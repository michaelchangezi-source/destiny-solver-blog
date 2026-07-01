'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { CATEGORY_SLUGS, getCategoryAccent } from '@/types'

interface Props {
  categories: string[]
}

/**
 * 分類軸輪：橫向長軸，拖曳／滑動／箭咀轉動，中間嗰格自動放大做焦點。
 * 每個分類本身都係獨立連結，直接撳都可以即跳，唔使先郁到中間先撳到。
 */
export default function CategoryWheel({ categories }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const cellRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const draggingRef = useRef(false)
  const movedRef = useRef(false)
  const startXRef = useRef(0)
  const startScrollRef = useRef(0)

  function updateFocus() {
    const track = trackRef.current
    if (!track) return
    const trackRect = track.getBoundingClientRect()
    const center = trackRect.left + trackRect.width / 2
    let closest: HTMLAnchorElement | null = null
    let closestDist = Infinity
    cellRefs.current.forEach((cell) => {
      if (!cell) return
      const r = cell.getBoundingClientRect()
      const dist = Math.abs(r.left + r.width / 2 - center)
      if (dist < closestDist) {
        closestDist = dist
        closest = cell
      }
    })
    cellRefs.current.forEach((cell) => {
      if (!cell) return
      const isFocus = cell === closest
      cell.style.transform = isFocus ? 'scale(1.12)' : 'scale(0.86)'
      cell.style.opacity = isFocus ? '1' : '0.5'
      cell.style.borderColor = isFocus ? '#B23E26' : 'rgba(43,36,28,.15)'
    })
  }

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let raf: number | null = null
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        updateFocus()
        raf = null
      })
    }
    track.addEventListener('scroll', onScroll, { passive: true })
    const t = setTimeout(updateFocus, 50)
    return () => {
      track.removeEventListener('scroll', onScroll)
      clearTimeout(t)
      if (raf) cancelAnimationFrame(raf)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handlePointerDown(e: React.PointerEvent) {
    const track = trackRef.current
    if (!track) return
    draggingRef.current = true
    movedRef.current = false
    startXRef.current = e.clientX
    startScrollRef.current = track.scrollLeft
  }

  function handlePointerMove(e: React.PointerEvent) {
    const track = trackRef.current
    if (!track || !draggingRef.current) return

    const dx = e.clientX - startXRef.current
    if (!movedRef.current) {
      if (Math.abs(dx) < 6) return
      movedRef.current = true
      track.setPointerCapture(e.pointerId)
      track.style.scrollSnapType = 'none'
    }
    track.scrollLeft = startScrollRef.current - dx
  }

  function handlePointerUp() {
    const track = trackRef.current
    draggingRef.current = false
    if (track && movedRef.current) {
      track.style.scrollSnapType = 'x mandatory'
    }
  }

  function handleItemClick(e: React.MouseEvent) {
    if (movedRef.current) e.preventDefault()
  }

  function scrollByCell(dir: 1 | -1) {
    trackRef.current?.scrollBy({ left: dir * 200, behavior: 'smooth' })
  }

  return (
    <div className="relative py-6">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[#2B241C]/10" />

      <button
        type="button"
        onClick={() => scrollByCell(-1)}
        aria-label="上一個分類"
        className="absolute left-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#2B241C]/20 bg-[#F3ECDD] text-[#6B6155] transition-colors hover:border-[#B23E26] hover:text-[#B23E26] sm:flex"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => scrollByCell(1)}
        aria-label="下一個分類"
        className="absolute right-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#2B241C]/20 bg-[#F3ECDD] text-[#6B6155] transition-colors hover:border-[#B23E26] hover:text-[#B23E26] sm:flex"
      >
        ›
      </button>

      <div
        ref={trackRef}
        className="flex cursor-grab gap-5 overflow-x-auto py-5 active:cursor-grabbing"
        style={{
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          paddingInline: '50%',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {categories.map((cat, i) => {
          const color = getCategoryAccent(cat)
          return (
            <Link
              key={cat}
              ref={(el) => {
                cellRefs.current[i] = el
              }}
              href={`/categories/${CATEGORY_SLUGS[cat] ?? cat}`}
              onClick={handleItemClick}
              className="flex h-[110px] w-[170px] flex-shrink-0 select-none flex-col items-center justify-center gap-2.5 rounded border border-[#2B241C]/15 bg-[#FBF6EC] text-center transition-[transform,opacity,border-color] duration-200"
              style={{ scrollSnapAlign: 'center' }}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: color }} />
              <span className="px-2 text-lg font-semibold leading-snug text-[#2B241C]">{cat}</span>
            </Link>
          )
        })}
      </div>

      <p className="mt-2 text-center text-xs text-[#9C9282]">拖曳／滑動轉動，或直接撳選分類</p>
    </div>
  )
}
