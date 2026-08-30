import { ImageResponse } from 'next/og'
import { loadGoogleFont } from '@/lib/og-font'

// 首頁與所有未自訂 OG 圖的頁面共用這張品牌分享圖（文章頁有自己的封面，會覆蓋）。
export const alt = '命運解決師 陳卓賢｜八字命理深度解析'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// 品牌 token
const BG = '#1C1612'
const INK = '#F7F1E5'
const CINNABAR = '#B23E26'
const DEEP = '#96321E'
const MUTED = 'rgba(247,241,229,0.55)'
const ACCENT = '#F5A623'

// 圖內出現的所有文字（用來向 Google Fonts 取最小子集）
const TITLE = '命運解決師'
const NAME = '陳卓賢'
const SUB = '八字命理深度解析'
const LATIN = 'DESTINY · SOLVER'
const DOMAIN = 'destinysolver.com'
const DECO = '命運'
const SUBSET = Array.from(new Set((TITLE + NAME + SUB + LATIN + DOMAIN + DECO).split(''))).join('')

export default async function OpengraphImage() {
  let serif900: ArrayBuffer | null = null
  let serif400: ArrayBuffer | null = null
  try {
    ;[serif900, serif400] = await Promise.all([
      loadGoogleFont('Noto Serif TC', 900, SUBSET),
      loadGoogleFont('Noto Serif TC', 400, SUBSET),
    ])
  } catch {
    serif900 = null
    serif400 = null
  }

  const hasFont = !!serif900 && !!serif400

  if (!hasFont) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            backgroundColor: BG,
          }}
        >
          <div style={{ width: 8, height: '100%', backgroundColor: CINNABAR }} />
        </div>
      ),
      { ...size }
    )
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          backgroundColor: BG,
          fontFamily: 'serif',
          overflow: 'hidden',
        }}
      >
        {/* 左側朱砂紅條 */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 10,
            height: '100%',
            backgroundColor: CINNABAR,
          }}
        />

        {/* 右側大字浮水印「命運」直排 */}
        <div
          style={{
            position: 'absolute',
            right: 48,
            top: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 0,
          }}
        >
          {'命運'.split('').map((ch, i) => (
            <span
              key={i}
              style={{
                fontSize: 280,
                fontWeight: 900,
                color: 'rgba(247,241,229,0.04)',
                lineHeight: 0.92,
                letterSpacing: '-0.02em',
              }}
            >
              {ch}
            </span>
          ))}
        </div>

        {/* 主內容區 */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 64,
            right: 340,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingLeft: 32,
          }}
        >
          {/* 頂部標籤 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 36,
            }}
          >
            <div
              style={{
                width: 36,
                height: 2,
                backgroundColor: CINNABAR,
                borderRadius: 1,
              }}
            />
            <span
              style={{
                fontSize: 20,
                fontWeight: 400,
                color: CINNABAR,
                letterSpacing: 6,
              }}
            >
              {LATIN}
            </span>
          </div>

          {/* 主標題 */}
          <span
            style={{
              fontSize: 110,
              fontWeight: 900,
              color: INK,
              lineHeight: 1.0,
              letterSpacing: '0.02em',
            }}
          >
            {TITLE}
          </span>

          {/* 分隔線 + 作者名 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              marginTop: 24,
            }}
          >
            <span
              style={{
                fontSize: 36,
                fontWeight: 400,
                color: ACCENT,
                letterSpacing: '0.1em',
              }}
            >
              {NAME}
            </span>
            <div
              style={{
                width: 1,
                height: 30,
                backgroundColor: 'rgba(247,241,229,0.25)',
              }}
            />
            <span
              style={{
                fontSize: 28,
                fontWeight: 400,
                color: MUTED,
                letterSpacing: '0.05em',
              }}
            >
              {SUB}
            </span>
          </div>

          {/* 網址 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: 52,
              gap: 10,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: CINNABAR,
              }}
            />
            <span
              style={{
                fontSize: 22,
                fontWeight: 400,
                color: 'rgba(247,241,229,0.40)',
                letterSpacing: 1,
              }}
            >
              {DOMAIN}
            </span>
          </div>
        </div>

        {/* 右下角裝飾方塊 */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: 180,
            height: 180,
            backgroundColor: CINNABAR,
            opacity: 0.08,
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 24,
            bottom: 24,
            width: 80,
            height: 80,
            border: `2px solid rgba(178,62,38,0.30)`,
          }}
        />
      </div>
    ),
    {
      ...size,
      fonts: hasFont
        ? [
            { name: 'serif', data: serif900!, weight: 900 as const, style: 'normal' as const },
            { name: 'serif', data: serif400!, weight: 400 as const, style: 'normal' as const },
          ]
        : undefined,
    }
  )
}
