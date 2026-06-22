// 為 next/og 的 ImageResponse 動態載入 Google Fonts 子集。
// Satori（ImageResponse 內核）渲染中日韓字需要實際字型位元組，無法用系統字。
// 這裡用 Google Fonts css2 API 配 text= 參數只取需要的字，回傳字型 buffer。
// 用舊版 IE 的 User-Agent 取較相容的格式；Satori 支援 woff / ttf / otf（不支援 woff2）。

const IE_UA = 'Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:11.0) like Gecko'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function fetchFontOnce(family: string, weight: number, text: string): Promise<ArrayBuffer> {
  const url =
    `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}` +
    `:wght@${weight}&text=${encodeURIComponent(text)}`

  const cssRes = await fetch(url, { headers: { 'User-Agent': IE_UA } })
  if (!cssRes.ok) throw new Error(`Google Fonts CSS ${cssRes.status}`)
  const css = await cssRes.text()

  // 接受 woff / truetype / opentype（排除 Satori 不支援的 woff2）
  const match = css.match(/src:\s*url\((.+?)\)\s*format\('(?:woff|opentype|truetype)'\)/)
  if (!match) throw new Error('找不到可用的 woff/TTF/OTF 字型來源')

  const fontRes = await fetch(match[1])
  if (!fontRes.ok) throw new Error(`字型檔下載失敗 ${fontRes.status}`)
  return fontRes.arrayBuffer()
}

// 加重試（含 jitter）以抵抗並行生成時 Google Fonts 的偶發限流。
export async function loadGoogleFont(
  family: string,
  weight: number,
  text: string,
  attempts = 3
): Promise<ArrayBuffer> {
  let lastErr: unknown
  for (let i = 0; i < attempts; i++) {
    try {
      return await fetchFontOnce(family, weight, text)
    } catch (e) {
      lastErr = e
      await sleep(300 + Math.random() * 400)
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error('字型載入失敗')
}
