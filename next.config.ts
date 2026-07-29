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

  // 舊 Vercel 子域名一律 301 轉去正式域名，避免同一份內容在兩個網址各自被索引。
  // canonical 本已指向正式域名，此處再加轉址，讓搜尋引擎與外部舊連結都收斂到單一來源。
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'destiny-solver-blog.vercel.app' }],
        destination: 'https://www.destinysolver.com/:path*',
        permanent: true,
      },
    ]
  },

  // 基本 HTTP 安全標頭。strict-transport-security 由 Vercel 平台層自動附加，此處不重複設定。
  // 不加 Content-Security-Policy：站內有 inline JSON-LD（Article/WebSite/Person/FAQ schema），
  // 加錯 CSP 會直接令 schema 或頁面爆版。
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
}

export default nextConfig
