'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const HomeMotion = dynamic(() => import('./HomeMotion'), { ssr: false })
const InkFlowHeroAnim = dynamic(() => import('./InkFlowHeroAnim'), { ssr: false })

export default function HomeAnimations() {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const ok =
      window.matchMedia('(min-width: 768px)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (ok) setAnimate(true)
  }, [])

  if (!animate) return null

  return (
    <>
      <HomeMotion />
      <InkFlowHeroAnim />
    </>
  )
}
