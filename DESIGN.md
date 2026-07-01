# DESIGN.md — 命運解決師 設計系統

> 這份文件是網站視覺的唯一準則。改任何 UI 前先讀它，改完要符合它。
> 目標：像資深設計師手作的**中式文人刊物**，不是流行的 AI／SaaS 模板。

---

## 0. 反面清單（AI 味來源，一律禁止）

- 深色漸層 Hero + 毛玻璃卡（`backdrop-blur` 當視覺主體）
- 彩色發光陰影（`shadow-[0_..._rgba(brand,...)]`）、文字 glow（`text-shadow` 光暈）
- 每個 section 都掛一個英文全大寫 eyebrow（`LATEST` / `LEARNING PATH`…）當標題
- 大圓角（`rounded-xl` / `rounded-2xl` / `rounded-[28px]`）到處都是
- 卡片一律 `hover:-translate-y` + 光暈的「浮起」互動
- Tailwind 預設 spacing / 預設藍紫、Inter 觀感

## 1. 骨架原則

- 結構與資訊架構**不改**，只換視覺語言。
- 版面像印刷品：靠**留白、細線（hairline）、字級對比**分層，不靠陰影和圓角。
- 中文優先：標題用宋體（Noto Serif TC），字間距為中文調校，英文只作次要註腳。

## 2. 色板（宣紙 × 朱砂 × 赭金 × 石青）

取自傳統設色：朱砂為主、赭石／泥金為輔、石青／黛作冷調點綴，全部落在暖紙底上。

| Token | Hex | 用途 |
|---|---|---|
| `--paper` | `#F3ECDD` | 頁面底（暖宣紙） |
| `--paper-deep` | `#EAE0CB` | 分區底、次級面 |
| `--surface` | `#FBF6EC` | 卡片／浮面 |
| `--ink` | `#211C15` | 深墨（Hero 底、標題重字） |
| `--ink-soft` | `#2B241C` | 正文主色 |
| `--ink-mute` | `#6B6155` | 次要文字 |
| `--ink-faint` | `#938876` | 註腳、時間 |
| `--cinnabar` | `#AF3A22` | 主強調（朱砂）：連結、主按鈕、印記 |
| `--cinnabar-deep` | `#8C2E1A` | 按鈕 hover／按下 |
| `--cinnabar-glow` | `#CC5C3F` | 深底上的朱砂亮版 |
| `--ochre` | `#9C6B33` | 次強調（赭金）：kicker、細線、序號 |
| `--indigo` | `#33474B` | 冷調點綴（石青黛）：極少量 |
| `--jade` | `#2E7D52` | 「宜」正向 |

規則：一個版面**最多兩個強調色**（朱砂＋赭金）；石青只作極少量呼吸點綴。不要整頁都紅。

## 3. 字體

- 標題／大字：`--font-serif`（Noto Serif TC），字重 700／900，`letter-spacing` 略收（`-0.01em`）。
- 正文／UI：`--font-sans`（Noto Sans TC）。
- Kicker／小標的英文：字級 11–12px，`letter-spacing: 0.18em`，用 `--ochre` 或 `--ink-faint`，**不要**再配朱砂紅全大寫。

## 4. 圓角（收斂，印刷感）

- `--r`: `3px`（卡片、按鈕、輸入框，統一）
- `--r-sm`: `2px`
- 頭像、印記可用圓形。其餘一律 ≤ 4px。禁 `rounded-xl` 以上。

## 5. 陰影（中性、可信，不發光）

- `--shadow-1`: `0 1px 2px rgba(33,28,21,.05)` — 靜態卡片
- `--shadow-2`: `0 12px 30px -20px rgba(33,28,21,.30)` — 浮面（Hero 卡）
- 顏色一律用墨（暖灰），**不用品牌紅發光**。hover 不再靠陰影浮起。

## 6. 元件語彙

- **按鈕主**（`.btn-cin`）：實色朱砂底、紙色字、`--r`、無光暈；hover 轉 `--cinnabar-deep`，按下 `scale .98`。
- **按鈕次**（`.btn-line`）：透明底、細墨線框、墨字；hover 邊框轉朱砂。
- **卡片**（`.card`）：`--surface` 底 + 1px 墨細線 + `--shadow-1` + `--r`；hover 只換**邊框色**（轉赭金／朱砂）＋極輕背景加深，**不位移、不發光**。
- **Kicker**（`.kicker`）：一道短朱砂細線（12px 寬 2px 高）＋中文小標（宋體），英文碼作次要小字。取代所有英文全大寫 eyebrow。
- **細線分區**：用 `border-color: rgba(33,28,21,.10)` 的 hairline，取代大色塊。

## 7. 互動

- 過場 200–300ms，`ease-out`。
- 連結 hover：轉朱砂色即可，不加底線滑入等花招。
- 尊重 `prefers-reduced-motion`：關掉所有位移／浮動。

## 8. 版面留白

- 分區上下間距比 SaaS 大一級：section 桌面 `py-20`～`py-24`。
- 內容欄寬維持 `max-w-6xl`；正文閱讀寬 `max-w-2xl`。
