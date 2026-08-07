// destiny-solver service worker
//
// 2026-08-07 重寫。舊版（ds-v1）對「所有同源 GET」一律 cache-first，包括 HTML 頁面
// 同 Next.js 客戶端路由用嘅 RSC payload。後果係每次部署之後：
//   1. 瀏覽器繼續攞住部署前嘅 HTML 同舊 build ID 嘅 JS chunk（由快取出）
//   2. 但撳文章連結嗰陣，Next 要即時攞新 build 嘅 RSC payload，同舊 client 對唔上
//   3. 表現出嚟就係「撳咗冇反應，入唔到文章」
// cache 名由 ds-v1 改做 ds-v2，activate 事件會清走舊快取，症狀即自動解除。
//
// 新策略：
//   - 檔名帶內容雜湊、內容永不變嘅資產（/_next/static、/fonts、/images）→ cache-first
//   - 導覽（HTML）→ network-first，只喺離線先用快取兜底（保留 PWA 離線可用）
//   - RSC payload、/api、其餘一律唔攔截，直接行網絡
const CACHE = 'ds-v2'
const OFFLINE_FALLBACK = '/'

// 呢三個路徑下嘅檔案檔名都帶內容雜湊，改咗內容就換檔名，所以快取永遠唔會過期
function isImmutableAsset(url) {
  return (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/fonts/') ||
    url.pathname.startsWith('/images/')
  )
}

// Next 客戶端路由嘅 payload：帶 RSC header 或者 _rsc query。
// 呢啲嘢綁死喺某一個 build，快取咗只會令新舊版本溝埋一齊，一律唔掂。
function isRscRequest(request, url) {
  return request.headers.get('RSC') === '1' || url.searchParams.has('_rsc')
}

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.add(OFFLINE_FALLBACK))
      .catch(() => {})
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return

  const url = new URL(e.request.url)
  if (url.origin !== self.location.origin) return
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/_next/webpack-hmr')) return
  if (isRscRequest(e.request, url)) return

  // 靜態資產：cache-first（檔名帶雜湊，唔會攞到過期內容）
  if (isImmutableAsset(url)) {
    e.respondWith(
      caches.match(e.request).then(
        (cached) =>
          cached ||
          fetch(e.request).then((res) => {
            if (res.ok && res.type === 'basic') {
              const copy = res.clone()
              caches.open(CACHE).then((c) => c.put(e.request, copy))
            }
            return res
          })
      )
    )
    return
  }

  // 導覽：network-first，網絡唔通先用快取（離線兜底）
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          if (res.ok && res.type === 'basic') {
            const copy = res.clone()
            caches.open(CACHE).then((c) => c.put(e.request, copy))
          }
          return res
        })
        .catch(() => caches.match(e.request).then((cached) => cached || caches.match(OFFLINE_FALLBACK)))
    )
    return
  }

  // 其餘唔攔截
})
