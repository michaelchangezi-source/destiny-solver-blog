import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
    formats: ['image/webp', 'image/avif'],
  },
  // Enable static export for Vercel (optional, remove if using ISR)
  // output: 'export',
}

export default nextConfig
