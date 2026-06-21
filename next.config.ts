import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
    formats: ['image/webp', 'image/avif'],
    // 允許本機封面帶任意 query string（publish pipeline 的 ?v=N cache-buster，
    // 省略 search 即不限 query，避免日後版本號變動再次中斷 build）
    localPatterns: [
      { pathname: '/**', search: '' },
      { pathname: '/images/**' },
    ],
  },
  // Enable static export for Vercel (optional, remove if using ISR)
  // output: 'export',
}

export default nextConfig
