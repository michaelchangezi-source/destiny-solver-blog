import { ImageResponse } from 'next/og'
import { loadGoogleFont } from '@/lib/og-font'

// 首頁與所有未自訂 OG 圖的頁面共用這張品牌分享圖（文章頁有自己的封面，會覆蓋）。
export const alt = '命運解決師 陳卓賢｜八字命理深度解析'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// 品牌 token
const BG = '#F4EEE1'
const SURFACE = '#FBF7EE'
const INK = '#2B241C'
const CINNABAR = '#B23E26'
const DEEP = '#96321E'
const PAPER = '#F7F1E5'
const MUTED = '#6B6155'
const FAINT = '#9C9282'

// 圖內出現的所有文字（用來向 Google Fonts 取最小子集）
const TITLE = '命運解決師'
const SUB = '八字命理深度解析'
const LATIN = 'DESTINY · SOLVER'
const DOMAIN = 'destiny-solver-blog.vercel.app'
const SUBSET = Array.from(new Set((TITLE + SUB + LATIN + DOMAIN + '命').split(''))).join('')

export default async function OpengraphImage() {
  // 字型載入失敗（例如離線 build）時，退回拉丁字版面，確保 build 不中斷。
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

  // 字型載入失敗（極少數情況，如離線 build）：退回純品牌色塊，無文字，確保 build 不中斷。
  if (!hasFont) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: BG,
          }}
        >
          <div
            style={{
              width: 240,
              height: 240,
              borderRadius: 24,
              backgroundColor: CINNABAR,
              boxShadow: `0 24px 60px -24px ${DEEP}`,
            }}
          />
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
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          backgroundColor: BG,
          fontFamily: 'serif',
        }}
      >
        {/* 宣紙質感邊框 */}
        <div
          style={{
            position: 'absolute',
            top: 36,
            left: 36,
            right: 36,
            bottom: 36,
            border: `2px solid rgba(178,62,38,0.30)`,
            borderRadius: 12,
          }}
        />
        {/* 巨大「命」浮水印 */}
        <div
          style={{
            position: 'absolute',
            right: 60,
            bottom: -60,
            fontSize: 520,
            fontWeight: 900,
            color: 'rgba(43,36,28,0.04)',
            lineHeight: 1,
          }}
        >
          {hasFont ? '命' : ''}
        </div>

        {/* 主體：朱砂印 + 文字 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 48 }}>
          {/* 朱砂印章 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 210,
              height: 210,
              borderRadius: 18,
              backgroundColor: CINNABAR,
              boxShadow: `0 20px 50px -20px ${DEEP}`,
            }}
          >
            <span style={{ fontSize: 150, fontWeight: 900, color: PAPER, lineHeight: 1 }}>
              {hasFont ? '命' : 'DS'}
            </span>
          </div>

          {/* 文字塊 */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 92, fontWeight: 900, color: INK, lineHeight: 1.1 }}>
              {hasFont ? TITLE : 'Destiny Solver'}
            </span>
            <span style={{ fontSize: 38, fontWeight: 400, color: MUTED, marginTop: 14 }}>
              {hasFont ? SUB : 'BaZi astrology, in depth'}
            </span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                marginTop: 26,
              }}
            >
              <div style={{ width: 56, height: 3, backgroundColor: CINNABAR, borderRadius: 2 }} />
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 400,
                  color: CINNABAR,
                  letterSpacing: 6,
                }}
              >
                {LATIN}
              </span>
            </div>
          </div>
        </div>

        {/* 網址 */}
        <div
          style={{
            position: 'absolute',
            bottom: 70,
            display: 'flex',
            backgroundColor: SURFACE,
            border: '1px solid rgba(43,36,28,0.10)',
            borderRadius: 999,
            padding: '8px 22px',
          }}
        >
          <span style={{ fontSize: 22, fontWeight: 400, color: FAINT, letterSpacing: 1 }}>
            {DOMAIN}
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: hasFont
        ? [
            { name: 'serif', data: serif900!, weight: 900 as const, style: 'normal' as const },
            { name: 'serif', data: serif400!, weight: 400 as const, style: 'normal' as const },
          ]
        : [],
    }
  )
}
