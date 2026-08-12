// 日柱每日能量回歸測試（製作說明書 §五 驗收）
// 跑法：node tests/daily-spec.mjs
// 動到 src/lib/daily-relate.ts 或 src/data/daily-copy.ts，必須全綠才算完成。
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import ts from 'typescript'

const here = dirname(fileURLToPath(import.meta.url))
const repo = resolve(here, '..')
const out = resolve(here, '.build')

// 本檔的模組用 @/ 路徑別名，loadLib 處理唔到，另寫一個轉換
async function load(specs) {
  mkdirSync(out, { recursive: true })
  for (const [dir, name] of specs) {
    const src = readFileSync(resolve(repo, 'src', dir, `${name}.ts`), 'utf8')
    const js = ts.transpileModule(src, {
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
    }).outputText
    const fixed = js
      .replace(/from ['"]@\/(?:lib|data)\/([\w-]+)['"]/g, "from './$1.mjs'")
      .replace(/from ['"]\.\/([\w-]+)['"]/g, "from './$1.mjs'")
    writeFileSync(resolve(out, `${name}.mjs`), fixed)
  }
  const mods = {}
  for (const [, name] of specs) {
    mods[name] = await import(pathToFileURL(resolve(out, `${name}.mjs`)).href)
  }
  return mods
}

const mods = await load([
  ['lib', 'bazi-calc'],
  ['lib', 'daily-relate'],
  ['data', 'daily-copy'],
])
const relate = mods['daily-relate']
const copy = mods['daily-copy']
const { STEMS, BRANCHES } = mods['bazi-calc']

let pass = 0
let fail = 0
function ok(cond, label, detail = '') {
  if (cond) { pass++ } else { fail++; console.log(`  ✗ ${label}${detail ? '  ' + detail : ''}`) }
}
function section(t) { console.log(`\n── ${t} ──`) }

// ─────────────────────────────────────────────────────────
section('一、日柱 fixture（§五.4）')
// 由 .claude/skills/bazi-reader/scripts/verify_paipan.py 生成（2026-08-11），
// 並經 src/lib/bazi-calc.ts 與 lunar-typescript 三方交叉核對，1960-2040 全日掃描零分歧。
const DAY_PILLAR_FIXTURES = [
  ['1988-11-19', '戊寅'],   // 說明書 §五.4 已知組
  ['2000-02-29', '丁巳'],   // 閏日
  ['1975-01-01', '丁未'],   // 年初
  ['1900-01-01', '甲戌'],   // daysSince1900 原點
  ['1949-10-01', '甲子'],   // 六十甲子首柱
]
for (const [date, expect] of DAY_PILLAR_FIXTURES) {
  const [y, m, d] = date.split('-').map(Number)
  const p = relate.dayPillarFromBirth(y, m, d)
  ok(p.stem + p.branch === expect, `${date} 應得 ${expect}`, `實得 ${p.stem + p.branch}`)
}

// ─────────────────────────────────────────────────────────
section('二、天干十神方向（以用戶日干為日主）')
const TEN_GOD_CASES = [
  // [用戶日干, 流日天干, 應得十神]
  ['甲', '甲', '比肩'], ['甲', '乙', '劫財'], ['甲', '丙', '食神'], ['甲', '丁', '傷官'],
  ['甲', '戊', '偏財'], ['甲', '己', '正財'], ['甲', '庚', '七殺'], ['甲', '辛', '正官'],
  ['甲', '壬', '偏印'], ['甲', '癸', '正印'],
  ['癸', '戊', '正官'], ['庚', '丙', '七殺'], ['丙', '辛', '正財'],
]
for (const [u, t, expect] of TEN_GOD_CASES) {
  const r = relate.relate({ stem: u, branch: '子' }, { stem: t, branch: '子' })
  ok(r.tenGod === expect, `${u} 日主見 ${t} 應為 ${expect}`, `實得 ${r.tenGod}`)
}

// ─────────────────────────────────────────────────────────
section('三、地支關係與優先序仲裁')
const REL_CASES = [
  // 單純各關係
  ['子', '丑', '六合'], ['午', '未', '六合'], ['卯', '戌', '六合'], ['辰', '酉', '六合'],
  ['申', '子', '半合'], ['亥', '卯', '半合'], ['寅', '午', '半合'], ['酉', '丑', '半合'],
  ['申', '辰', '半合'], // 無旺支之拱合，本功能一併歸半合
  ['子', '午', '沖'],  ['寅', '申', '沖'],  ['丑', '未', '沖'],  ['巳', '亥', '沖'],
  ['寅', '巳', '刑'],  ['丑', '戌', '刑'],  ['戌', '未', '刑'],  ['子', '卯', '刑'],
  ['子', '未', '穿害'], ['丑', '午', '穿害'], ['卯', '辰', '穿害'], ['申', '亥', '穿害'], ['酉', '戌', '穿害'],
  ['子', '酉', '破'],  ['卯', '午', '破'],  ['辰', '丑', '破'],
  ['子', '子', '伏吟'], ['辰', '辰', '伏吟'], ['午', '午', '伏吟'], ['酉', '酉', '伏吟'], ['亥', '亥', '伏吟'],
  ['子', '寅', '無關'], ['丑', '卯', '無關'],
  // 重疊仲裁
  ['巳', '申', '六合'], // 六合＋刑＋破 → 六合
  ['寅', '亥', '六合'], // 六合＋破     → 六合
  ['寅', '申', '沖'],   // 沖＋刑       → 沖
  ['丑', '未', '沖'],   // 沖＋刑       → 沖
  ['未', '戌', '刑'],   // 刑＋破       → 刑
]
for (const [a, b, expect] of REL_CASES) {
  const got = relate.branchRelationOf(a, b)
  ok(got === expect, `${a}${b} 應為 ${expect}`, `實得 ${got}`)
}

// 對稱性：關係與地支先後次序無關
let asym = 0
for (const a of BRANCHES) for (const b of BRANCHES) {
  if (relate.branchRelationOf(a, b) !== relate.branchRelationOf(b, a)) asym++
}
ok(asym === 0, '地支關係判定必須對稱', `不對稱 ${asym} 組`)

// 八種關係必須全部可達
const reachable = new Set()
for (const a of BRANCHES) for (const b of BRANCHES) reachable.add(relate.branchRelationOf(a, b))
ok(reachable.size === 8, '八種地支關係全部可達', `實際 ${reachable.size} 種：${[...reachable].join('、')}`)

// ─────────────────────────────────────────────────────────
section('四、日柱標記')
const MARK_CASES = [
  ['丁酉', '日貴'], ['癸卯', '日貴'],
  ['甲寅', '日德'], ['壬戌', '日德'],
  ['丙午', '日刃'], ['壬子', '日刃'],
  ['庚戌', '魁罡'], ['壬辰', '魁罡'],
  ['乙卯', '八專'], ['辛酉', '八專'],
]
for (const [gz, expect] of MARK_CASES) {
  const marks = relate.marksOf({ stem: gz[0], branch: gz[1] })
  ok(marks.includes(expect), `${gz} 應命中 ${expect}`, `實得 ${marks.join('、') || '無'}`)
}
// 魁罡表須與 bazi-shensha.ts 的 KUI_GANG 一致（防兩處漂移）
const shenshaSrc = readFileSync(resolve(repo, 'src/lib/bazi-shensha.ts'), 'utf8')
const kuiGangInShensha = (shenshaSrc.match(/const KUI_GANG = \[([^\]]+)\]/) || [])[1]
const kuiGangInRelate = (readFileSync(resolve(repo, 'src/lib/daily-relate.ts'), 'utf8')
  .match(/const KUI_GANG = \[([^\]]+)\]/) || [])[1]
const norm = s => (s || '').replace(/[\s'"]/g, '').split(',').sort().join(',')
ok(norm(kuiGangInShensha) === norm(kuiGangInRelate) && norm(kuiGangInShensha) !== '',
  '魁罡表須與 bazi-shensha.ts 一致', `${kuiGangInShensha} vs ${kuiGangInRelate}`)

// 六十甲子合法性把關
ok(relate.isValidPillar('甲', '子') && !relate.isValidPillar('甲', '丑'), '日柱陰陽同性把關')

// ─────────────────────────────────────────────────────────
section('五、文案庫完整性（80 格）')
const keys = Object.keys(copy.CELLS)
ok(keys.length === 80, '主鍵必須剛好 80 格', `實得 ${keys.length}`)

const missing = []
for (const g of relate.TEN_GODS) for (const r of relate.BRANCH_RELATIONS) {
  if (!copy.CELLS[`${g}_${r}`]) missing.push(`${g}_${r}`)
}
ok(missing.length === 0, '十神 × 地支關係必須全覆蓋', missing.join('、'))

const stray = keys.filter(k => {
  const [g, r] = k.split('_')
  return !relate.TEN_GODS.includes(g) || !relate.BRANCH_RELATIONS.includes(r)
})
ok(stray.length === 0, '不得有多餘主鍵', stray.join('、'))

// 每格結構
let badShape = []
for (const [k, c] of Object.entries(copy.CELLS)) {
  if (typeof c.tone !== 'string' || !c.tone) badShape.push(`${k}.tone`)
  if (!Array.isArray(c.yi) || c.yi.length !== 2 || c.yi.some(x => !x)) badShape.push(`${k}.yi`)
  if (typeof c.buYi !== 'string' || !c.buYi) badShape.push(`${k}.buYi`)
}
ok(badShape.length === 0, '每格須有定性一句、宜兩件、不宜一件', badShape.slice(0, 5).join('、'))

// 定性句不得重複（防模板化）
const tones = Object.values(copy.CELLS).map(c => c.tone)
ok(new Set(tones).size === tones.length, '80 句定性不得重複',
  `重複 ${tones.length - new Set(tones).size} 句`)

// 近似重複：任何兩句定性唔准共用 8 字以上連續片段。
// 純粹「唔完全一樣」把關唔夠，套模板寫出嚟嘅句仍然會過。呢條先真正防到模板化。
function longestCommon(a, b) {
  let best = ''
  for (let i = 0; i < a.length; i++) {
    for (let j = i + best.length + 1; j <= a.length; j++) {
      const s = a.slice(i, j)
      if (b.includes(s)) best = s; else break
    }
  }
  return best
}
const cellKeys = Object.keys(copy.CELLS)
const nearDup = []
for (let i = 0; i < cellKeys.length; i++) {
  for (let k = i + 1; k < cellKeys.length; k++) {
    const lc = longestCommon(copy.CELLS[cellKeys[i]].tone, copy.CELLS[cellKeys[k]].tone)
    if (lc.length >= 8) nearDup.push(`${cellKeys[i]}×${cellKeys[k]}「${lc}」`)
  }
}
ok(nearDup.length === 0, '定性句唔准共用 8 字以上片段', nearDup.slice(0, 3).join('  '))

// 宜／不宜同樣要防重複。呢條係 2026-08-12 覆核時補上：原本淨係查 tone，
// 結果宜忌嗰邊漏咗兩對明顯重複（「因為關係好就…」「放棄一個現有的…」）。
// 宜忌本身短，門檻收窄到 6 字。只掃活格，唔可達嗰 35 格唔出街唔理。
const SAME_POL = ['比肩', '食神', '偏財', '七殺', '偏印']
const liveItems = []
for (const g of relate.TEN_GODS) {
  const rs = SAME_POL.includes(g) ? ['沖', '半合', '伏吟', '無關'] : ['六合', '刑', '穿害', '破', '無關']
  for (const r of rs) {
    const c = copy.CELLS[`${g}_${r}`]
    c.yi.forEach((y, i) => liveItems.push([`${g}_${r}.宜${i + 1}`, y]))
    liveItems.push([`${g}_${r}.不宜`, c.buYi])
  }
}
const itemDup = []
for (let i = 0; i < liveItems.length; i++) {
  for (let k = i + 1; k < liveItems.length; k++) {
    const s = longestCommon(liveItems[i][1], liveItems[k][1])
    if (s.length >= 6) itemDup.push(`${liveItems[i][0]}×${liveItems[k][0]}「${s}」`)
  }
}
ok(itemDup.length === 0, '活格宜忌唔准共用 6 字以上片段', itemDup.slice(0, 3).join('  '))

// 全部六十甲子 × 六十甲子組合都取得到文案，不得拋錯
let comboErr = 0
const SEXAGENARY = []
for (let i = 0; i < 60; i++) SEXAGENARY.push({ stem: STEMS[i % 10], branch: BRANCHES[i % 12] })
const reached = new Set()
for (const u of SEXAGENARY) for (const t of SEXAGENARY) {
  try {
    const r = relate.relate(u, t)
    copy.cellOf(r.tenGod, r.branchRelation)
    reached.add(r.key)
  } catch { comboErr++ }
}
ok(comboErr === 0, '3600 組日柱組合全部取得到文案', `失敗 ${comboErr} 組`)

// 可達集合：八十格入面只有四十五格出得街，見 daily-copy.ts 檔頭推導。
// 六十甲子干支必定陰陽同性，所以天干嘅陰陽關係鎖死咗地支嘅陰陽關係：
//   同性十神（比肩食神偏財七殺偏印）只配得到 沖、半合、伏吟、無關
//   異性十神（劫財傷官正財正官正印）只配得到 六合、刑、穿害、破、無關
// 呢條測試釘死呢四十五格。日後改地支關係優先序若令可達集合變動，即刻爆。
const SAME_POLARITY = ['比肩', '食神', '偏財', '七殺', '偏印']
const expectedReach = new Set()
for (const g of relate.TEN_GODS) {
  const live = SAME_POLARITY.includes(g)
    ? ['沖', '半合', '伏吟', '無關']
    : ['六合', '刑', '穿害', '破', '無關']
  for (const r of live) expectedReach.add(`${g}_${r}`)
}
ok(reached.size === 45, '可達主鍵應為 45 格', `實得 ${reached.size} 格`)
const reachDiff = [...reached].filter(k => !expectedReach.has(k))
  .concat([...expectedReach].filter(k => !reached.has(k)))
ok(reachDiff.length === 0, '可達集合須與陰陽同性推導一致', reachDiff.slice(0, 5).join('、'))

// ─────────────────────────────────────────────────────────
section('六、出街文字紀律（§3.3、§6.2、§6.3）')
const outward = [
  ...Object.values(copy.CELLS).flatMap(c => [c.tone, ...c.yi, c.buYi]),
  ...Object.values(copy.MARK_COPY),
  ...Object.values(copy.RELATION_LABEL),
]

const BANNED = [
  // 流派名（CLAUDE.md 鐵律）
  ['盲派', '流派名'], ['素水', '流派名'], ['楊清娟', '流派名'], ['段氏', '流派名'],
  // 十神術語（§3.3）
  ['比肩', '十神術語'], ['劫財', '十神術語'], ['食神', '十神術語'], ['傷官', '十神術語'],
  ['偏財', '十神術語'], ['正財', '十神術語'], ['七殺', '十神術語'], ['正官', '十神術語'],
  ['偏印', '十神術語'], ['正印', '十神術語'], ['十神', '十神術語'],
  // 「日主」要排除「今日主動」這類正常詞組，故用 regex
  [/(?<![今本當昨明])日主/, '十神術語'],
  // 翻大層級（§6.3）
  ['今日必定', '決定論語氣'], ['一定會', '決定論語氣'], ['今年運勢', '翻大層級'],
  ['大運', '翻大層級'], ['流年', '翻大層級'],
  // §6.2 禁區
  ['富貴', '富貴層次'], ['發財', '富貴層次'], ['姻緣', '禁斷姻緣'], ['桃花', '禁斷姻緣'],
  // 排版鐵律
  ['——', '破折號'], ['**', '粗體'],
]
for (const [word, why] of BANNED) {
  const test = word instanceof RegExp ? s => word.test(s) : s => s.includes(word)
  const hits = outward.filter(test)
  ok(hits.length === 0, `禁詞「${word}」（${why}）`, hits.slice(0, 2).join(' ／ '))
}

// 全形標點：出街文字不得出現半形逗號、句號、問號、驚嘆號、分號、冒號
const halfWidth = outward.filter(s => /[,.;:!?]/.test(s))
ok(halfWidth.length === 0, '出街文字須用全形標點', halfWidth.slice(0, 2).join(' ／ '))

// 定性句應為單句，句號只出現在結尾
const multiSentence = tones.filter(t => t.slice(0, -1).includes('。'))
ok(multiSentence.length === 0, '定性句須為一句', multiSentence.slice(0, 2).join(' ／ '))

// ─────────────────────────────────────────────────────────
console.log(`\n${fail === 0 ? '✅' : '❌'} 通過 ${pass} 項，失敗 ${fail} 項`)
process.exit(fail === 0 ? 0 : 1)
