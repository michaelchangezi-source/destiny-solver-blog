import { ImageResponse } from 'next/og'
import { loadGoogleFont } from '@/lib/og-font'

// 共用的品牌圖標渲染：朱砂底 + 宣紙色「命」。供 app/icon 與 app/apple-icon 使用。
export async function renderBrandIcon(px: number) {
  let serif: ArrayBuffer | null = null
  try {
    serif = await loadGoogleFont('Noto Serif TC', 900, '命')
  } catch {
    serif = null
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#B23E26',
          color: '#F7F1E5',
          fontFamily: 'serif',
          fontWeight: 900,
          fontSize: Math.round(px * 0.6),
          lineHeight: 1,
        }}
      >
        {/* 字型載入失敗時不渲染文字（Satori 無字型無法排版），純朱砂塊仍是有效圖標 */}
        {serif ? '命' : ''}
      </div>
    ),
    {
      width: px,
      height: px,
      fonts: serif
        ? [{ name: 'serif', data: serif, weight: 900 as const, style: 'normal' as const }]
        : [],
    }
  )
}
