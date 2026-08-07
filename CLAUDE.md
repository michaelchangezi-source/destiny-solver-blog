# 個人網站原型（destiny-solver-blog）— Claude 開工守則

GitHub repo：michaelchangezi-source/destiny-solver-blog（部署：https://www.destinysolver.com，Vercel 子域名 destiny-solver-blog.vercel.app 仍可用作備援）

## 排盤算法鐵律（改 src\lib\bazi-calc.ts 前必讀）

八字排盤有兩個獨立實作，改算法必須同步改兩邊，只改一邊係最常見錯誤：

1. 本 repo：`src\lib\bazi-calc.ts`
2. 另一 repo：`C:\Users\micha\Documents\destiny.solver\bazi-chart.html`

改完必須跑回歸測試（覆蓋兩個實作），全過先算完成：

```
node C:\Users\micha\Documents\destiny.solver\tools\solarterm-test.mjs
```

背景：兩實作已升級天文精算節氣（Meeus 太陽視黃經），立春／月柱／起運按真實交節時刻連時辰判邊界，詳見 memory project_bazi_paipan_system。

## 字型鐵律（改 font-serif 標題文案前必讀）

全站唔用 next/font（佢對 Noto CJK 無效，會塞 536 條 `@font-face`／2.17 MB）。
內文行系統 CJK 字；標題行自行 subset 嘅自託管 woff2，字表由 build 出嚟嘅 HTML 掃返嚟。

**改咗任何 `font-serif` 標題文案、或加新嘅 serif UI 文字，要重跑一次 subset：**

```
npm run build && py -3 scripts\build_font_subset.py && npm run build
```

之後 commit `public\fonts\`、`src\app\fonts.css`、`src\lib\font-preload.ts`（三者由 script 一齊生成，唔好人手改）。
唔重跑唔會爆版（有 ext 層同系統宋體兜底），但嗰隻新字字型會同隔籬字唔一樣。
出新文章唔需要重跑（文章標題同正文都唔行 serif）。詳見 `docs\交接_效能與SEO_2026-08-07.md`。

## 其他

- 出文自動 ping IndexNow；SEO/AEO 結構（canonical＋Article schema＋llms.txt）已極致化，改版面唔好順手動呢啲位
- 非文章頁嘅 metadata 一律用 `src\lib\metadata.ts` 的 `buildMetadata()`，唔好逐頁抄 openGraph（會再次出現 89 頁 OG 指向首頁嘅問題）
- 改 `public\sw.js` 嘅快取策略，一定要順手 bump cache 名（現時 `ds-v2`），否則舊訪客一直食舊策略。SW 永遠唔准 cache-first HTML 或 RSC payload：曾經因此每次部署後「撳連結冇反應」，詳見 `docs\交接_效能與SEO_2026-08-07.md` 第五節
- 網站文章第一段第一句必須直接陳述結論（答案優先規則，詳見 destiny-solver skill「網站文章版本規則」）
