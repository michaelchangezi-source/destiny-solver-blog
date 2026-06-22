import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '命運解決師 陳卓賢｜八字命理深度解析',
    short_name: '命運解決師',
    description: '用命理讀懂你這個人：不是預測命運，是認識自己。香港八字命理師陳卓賢的命理知識平台。',
    start_url: '/',
    display: 'standalone',
    background_color: '#F4EEE1',
    theme_color: '#B23E26',
    lang: 'zh-Hant',
    categories: ['lifestyle', 'education'],
    icons: [
      { src: '/icon', sizes: '512x512', type: 'image/png' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  }
}
