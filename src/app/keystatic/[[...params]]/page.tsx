'use client'
import dynamic from 'next/dynamic'

const KeystaticApp = dynamic(() => import('@keystatic/next/ui/app'), { ssr: false })

export default function KeystaticPage() {
  return <KeystaticApp />
}
