# 個人網站原型（destiny-solver-blog）— Claude 開工守則

GitHub repo：michaelchangezi-source/destiny-solver-blog（部署：https://destiny-solver-blog.vercel.app）

## 排盤算法鐵律（改 src\lib\bazi-calc.ts 前必讀）

八字排盤有兩個獨立實作，改算法必須同步改兩邊，只改一邊係最常見錯誤：

1. 本 repo：`src\lib\bazi-calc.ts`
2. 另一 repo：`C:\Users\micha\Documents\destiny.solver\bazi-chart.html`

改完必須跑回歸測試（覆蓋兩個實作），全過先算完成：

```
node C:\Users\micha\Documents\destiny.solver\tools\solarterm-test.mjs
```

背景：兩實作已升級天文精算節氣（Meeus 太陽視黃經），立春／月柱／起運按真實交節時刻連時辰判邊界，詳見 memory project_bazi_paipan_system。

## 其他

- 出文自動 ping IndexNow；SEO/AEO 結構（canonical＋Article schema＋llms.txt）已極致化，改版面唔好順手動呢啲位
- 網站文章第一段第一句必須直接陳述結論（答案優先規則，詳見 destiny-solver skill「網站文章版本規則」）
