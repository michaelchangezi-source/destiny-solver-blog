// destinysolver 合盤工具深化回歸測試（升級計劃書 P1-8 驗收）
// 跑法：node tests/compat-spec.mjs
// 覆蓋：三刑三組、自刑四組（不與伏吟重複輸出）、子卯刑、文案分層、雙向視角
import { loadLib } from './_loader.mjs'

const { 'bazi-calc': calc, 'bazi-compat': compat } = await loadLib(['bazi-calc', 'bazi-compat'])
const { BRANCHES } = calc
const { analyzeCompat } = compat

let pass = 0
const fails = []
function check(name, actual, expected) {
  const a = String(actual), e = String(expected)
  if (a === e) { pass++ } else { fails.push(`${name}\n    期望：${e}\n    實際：${a}`) }
}
function section(t) { console.log(`\n── ${t} ─────────────────────`) }

const bi = (ch) => BRANCHES.indexOf(ch)

// 造一張四柱同支的命盤（跟 bazi-spec.mjs 同款寫法）
function chartOfBranch(ch) {
  const b = bi(ch)
  const p = () => ({ stem: 0, branch: b, stemChar: '甲', branchChar: ch, tenGod: null, hiddenStems: [] })
  return { year: p(), month: p(), day: p(), hour: p(), daYuns: [], startAge: null, boundaryNote: '' }
}
// 造一張四柱各自指定地支的命盤，用於測試三刑俱全、文案分層、雙向視角
function chartOfBranches(yCh, mCh, dCh, hCh) {
  const p = (ch) => ({ stem: 0, branch: bi(ch), stemChar: '甲', branchChar: ch, tenGod: null, hiddenStems: [] })
  return { year: p(yCh), month: p(mCh), day: p(dCh), hour: p(hCh), daYuns: [], startAge: null, boundaryNote: '' }
}

const sanxingDetail = (x, y) => {
  const r = analyzeCompat(chartOfBranch(x), chartOfBranch(y))
  const hit = r.interactions.find(i => i.type === '地支三刑')
  return hit ? hit.detail : '（無三刑互動）'
}

// ══ 三刑三組（P1-8）════════════════════════════════════
section('三刑三組：寅巳申、丑戌未、子卯')
const SANXING_EXPECT = [
  ['寅', '巳', '相刑（寅巳申，恃勢之刑）'],
  ['巳', '申', '相刑（寅巳申，恃勢之刑）'],
  ['寅', '申', '相刑（寅巳申，恃勢之刑）'],
  ['丑', '戌', '相刑（丑戌未，無恩之刑）'],
  ['戌', '未', '相刑（丑戌未，無恩之刑）'],
  ['丑', '未', '相刑（丑戌未，無恩之刑）'],
]
for (const [x, y, want] of SANXING_EXPECT) check(`${x} × ${y} 三刑判定`, sanxingDetail(x, y), want)

// ══ 子卯刑（無禮之刑，兩支不成三支組，獨立一節驗收）══════
section('子卯刑（無禮之刑）')
check('子 × 卯 三刑判定', sanxingDetail('子', '卯'), '相刑（子卯，無禮之刑）')
check('卯 × 子 三刑判定（反向亦成立）', sanxingDetail('卯', '子'), '相刑（子卯，無禮之刑）')

// ══ 三刑俱全（trio 三支齊集，力量最強）══════════════════
section('三刑俱全（寅巳申三支齊集）')
{
  const full = analyzeCompat(chartOfBranches('寅', '巳', '子', '子'), chartOfBranch('申'))
  const hit = full.interactions.find(i => i.type === '地支三刑')
  check('寅巳＋申＝三刑俱全', hit ? hit.detail : '（無）', '三刑俱全（寅巳申，恃勢之刑）')
}

// ══ 自刑四組：不得與三刑重複輸出，且仍保留伏吟＋自刑標示 ══
section('自刑四組（辰辰／午午／酉酉／亥亥）不與三刑重複輸出')
const ZIXING_BRANCHES = ['辰', '午', '酉', '亥']
for (const br of ZIXING_BRANCHES) {
  const r = analyzeCompat(chartOfBranch(br), chartOfBranch(br))
  const fuyin = r.interactions.filter(i => i.type === '地支伏吟')
  const sanxing = r.interactions.filter(i => i.type === '地支三刑')
  check(`${br} vs ${br} 伏吟標自刑`, fuyin.every(i => i.detail === '伏吟（比和）＋自刑'), 'true')
  check(`${br} vs ${br} 不得同時標三刑（避免重複結論）`, sanxing.length, 0)
}
// 非自刑地支（子）同支相遇，伏吟不應誤標自刑
{
  const r = analyzeCompat(chartOfBranch('子'), chartOfBranch('子'))
  const fuyin = r.interactions.filter(i => i.type === '地支伏吟')
  check('子 vs 子 伏吟不誤標自刑', fuyin.every(i => i.detail === '伏吟（比和）'), 'true')
}

// ══ 文案分層：同一互動類型，柱位不同要有唔同描述 ══════════
section('文案分層（同類型不同柱位文案要唔同）')
{
  // A：年支子、月支寅、日支丑、時支酉／B：年支丑、月支寅、日支子、時支酉
  // 年柱 子×丑＝六合、日柱 丑×子＝六合，同一種互動落在唔同柱位
  const a = chartOfBranches('子', '寅', '丑', '酉')
  const b = chartOfBranches('丑', '寅', '子', '酉')
  const r = analyzeCompat(a, b)
  const liuhe = r.interactions.filter(i => i.type === '地支六合')
  const yearYear = liuhe.find(i => i.aLabel.includes('年柱') && i.bLabel.includes('年柱'))
  const dayDay = liuhe.find(i => i.aLabel.includes('日柱') && i.bLabel.includes('日柱'))
  check('年柱六合與日柱六合皆有命中', Boolean(yearYear) && Boolean(dayDay), 'true')
  check('年柱六合 narrative ≠ 日柱六合 narrative', yearYear && dayDay ? yearYear.narrative !== dayDay.narrative : false, 'true')
  check('日柱 narrative 提及日柱權重', dayDay ? /日柱/.test(dayDay.narrative) : false, 'true')
  check('年柱 narrative 提及年柱權重', yearYear ? /年柱/.test(yearYear.narrative) : false, 'true')

  // ══ 雙向視角：同一組干支關係，甲乙兩方感受要唔同 ══════
  section('雙向視角（甲方／乙方感受文字要唔同）')
  const sanhe = r.interactions.find(i => i.type === '地支三合')
  check('三合互動有命中（用作雙向視角樣本）', Boolean(sanhe), 'true')
  if (sanhe) {
    check('三合 aPerspective ≠ bPerspective', sanhe.aPerspective !== sanhe.bPerspective, 'true')
    check('aPerspective 非空', sanhe.aPerspective.length > 0, 'true')
    check('bPerspective 非空', sanhe.bPerspective.length > 0, 'true')
  }
  check('日柱六合 aPerspective ≠ bPerspective（甲乙標籤不同）', dayDay ? dayDay.aPerspective !== dayDay.bPerspective : false, 'true')
}

// ══ 建議延伸閱讀分類（P1-7 接口，只出標籤字串）══════════
section('建議延伸閱讀分類 readingTags')
{
  const r = analyzeCompat(chartOfBranch('子'), chartOfBranch('午')) // 日支相沖
  check('相沖產生 readingTags', Array.isArray(r.readingTags) && r.readingTags.length > 0, 'true')
  check('相沖 readingTags 含「感情格局」', r.readingTags.includes('感情格局'), 'true')
}
{
  const r = analyzeCompat(chartOfBranch('子'), chartOfBranch('卯')) // 日支子卯刑
  check('三刑 readingTags 含「刑剋化解」', r.readingTags.includes('刑剋化解'), 'true')
}

// ══ 結果 ═══════════════════════════════════════════════
console.log(`\n${'═'.repeat(46)}`)
if (fails.length === 0) {
  console.log(`✅ 全部通過：${pass} 項`)
} else {
  console.log(`❌ 通過 ${pass} 項，失敗 ${fails.length} 項：\n`)
  fails.forEach((f, i) => console.log(`  ${i + 1}. ${f}\n`))
  process.exitCode = 1
}
