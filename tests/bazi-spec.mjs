// destinysolver 排盤／合盤回歸測試（升級計劃書 §7 驗收向量）
// 跑法：npm test        或        node tests/bazi-spec.mjs
// 任何動到 src/lib/bazi-calc.ts、bazi-compat.ts 的改動，必須全綠才算完成。
import { loadLib } from './_loader.mjs'

const { 'bazi-calc': calc, 'bazi-compat': compat } = await loadLib()
const { calculate, branchHiddenStems, BRANCHES, STEMS } = calc
const { analyzeCompat } = compat

let pass = 0
const fails = []
function check(name, actual, expected) {
  const a = String(actual), e = String(expected)
  if (a === e) { pass++ } else { fails.push(`${name}\n    期望：${e}\n    實際：${a}`) }
}
function checkNear(name, actual, expected, tol) {
  if (typeof actual === 'number' && Math.abs(actual - expected) <= tol) { pass++ }
  else { fails.push(`${name}\n    期望：${expected} ±${tol}\n    實際：${actual}`) }
}
function section(t) { console.log(`\n── ${t} ─────────────────────`) }

const gz = (p) => p ? p.stemChar + p.branchChar : '（無）'
const fourPillars = (r) => [gz(r.year), gz(r.month), gz(r.day), gz(r.hour)].join('／')
const bi = (ch) => BRANCHES.indexOf(ch)

// ══ §7.0 基準四柱 ══════════════════════════════════════
section('§7.0 基準四柱')
const CASES = {
  A: { args: [1990, 1, 1, bi('巳'), 'M'], want: '己巳／丙子／丙寅／癸巳' },
  B: { args: [1989, 6, 1, bi('巳'), 'M'], want: '己巳／己巳／壬辰／乙巳' },
  C: { args: [1985, 9, 20, bi('巳'), 'M'], want: '乙丑／乙酉／壬戌／乙巳' },
  D: { args: [1988, 3, 10, bi('子'), 'M'], want: '戊辰／乙卯／甲子／甲子' },
  E: { args: [1990, 3, 1, bi('巳'), 'M'], want: '庚午／戊寅／乙丑／辛巳' },
}
const charts = {}
for (const [k, c] of Object.entries(CASES)) {
  charts[k] = calculate(...c.args)
  check(`測試 ${k} 四柱`, fourPillars(charts[k]), c.want)
}

// ══ §7.1 藏干（P0-1）══════════════════════════════════
section('§7.1 地支藏干＋十神（丙日主）')
const BING = STEMS.indexOf('丙')
const HIDDEN_EXPECT = {
  子: ['癸 正官'],
  丑: ['己 傷官', '癸 正官', '辛 正財'],
  寅: ['甲 偏印', '丙 比肩', '戊 食神'],
  卯: ['乙 正印'],
  辰: ['戊 食神', '乙 正印', '癸 正官'],
  巳: ['丙 比肩', '庚 偏財', '戊 食神'],
  午: ['丁 劫財', '己 傷官'],
  未: ['己 傷官', '丁 劫財', '乙 正印'],
  申: ['庚 偏財', '壬 七殺', '戊 食神'],
  酉: ['辛 正財'],
  戌: ['戊 食神', '辛 正財', '丁 劫財'],
  亥: ['壬 七殺', '甲 偏印'],
}
for (const [br, want] of Object.entries(HIDDEN_EXPECT)) {
  const got = branchHiddenStems(bi(br), BING).map(h => `${h.char} ${h.tenGod}`)
  check(`藏干 ${br}`, got.join('／'), want.join('／'))
}

// ══ 合盤測試用：造一張四柱同支的命盤 ═════════════════
function chartOfBranch(ch) {
  const b = bi(ch)
  const p = () => ({ stem: 0, branch: b, stemChar: '甲', branchChar: ch, tenGod: null, hiddenStems: [] })
  return { year: p(), month: p(), day: p(), hour: p(), daYuns: [], startAge: null, boundaryNote: '' }
}
const sanheDetail = (x, y) => {
  const r = analyzeCompat(chartOfBranch(x), chartOfBranch(y))
  const hit = r.interactions.find(i => i.type === '地支三合')
  return hit ? hit.detail : '（無三合互動）'
}

// ══ §7.2 三合局五行＋旺神校驗（P0-2、P0-4）════════════
section('§7.2 三合局五行與旺神校驗')
const SANHE_EXPECT = [
  ['申', '子', '半三合水局（申子辰，帶旺神子）'],
  ['子', '辰', '半三合水局（申子辰，帶旺神子）'],
  ['亥', '卯', '半三合木局（亥卯未，帶旺神卯）'],
  ['卯', '未', '半三合木局（亥卯未，帶旺神卯）'],
  ['寅', '午', '半三合火局（寅午戌，帶旺神午）'],
  ['午', '戌', '半三合火局（寅午戌，帶旺神午）'],
  ['巳', '酉', '半三合金局（巳酉丑，帶旺神酉）'],
  ['酉', '丑', '半三合金局（巳酉丑，帶旺神酉）'],
  ['申', '辰', '拱合水局（申子辰，缺旺神子，力弱）'],
  ['亥', '未', '拱合木局（亥卯未，缺旺神卯，力弱）'],
  ['寅', '戌', '拱合火局（寅午戌，缺旺神午，力弱）'],
  ['巳', '丑', '拱合金局（巳酉丑，缺旺神酉，力弱）'],
]
for (const [x, y, want] of SANHE_EXPECT) check(`${x} × ${y}`, sanheDetail(x, y), want)

// ══ §7.3 伏吟（P0-3）══════════════════════════════════
section('§7.3 同支伏吟')
const FUYIN_EXPECT = [
  ['午', '伏吟（比和）＋自刑'],
  ['酉', '伏吟（比和）＋自刑'],
  ['辰', '伏吟（比和）＋自刑'],
  ['亥', '伏吟（比和）＋自刑'],
  ['巳', '伏吟（比和）'],
  ['子', '伏吟（比和）'],
]
for (const [br, want] of FUYIN_EXPECT) {
  const r = analyzeCompat(chartOfBranch(br), chartOfBranch(br))
  const hit = r.interactions.find(i => i.type === '地支伏吟')
  check(`${br} vs ${br} 判定`, hit ? hit.detail : '（無伏吟）', want)
  check(`${br} vs ${br} 不得標三合`, r.interactions.some(i => i.type === '地支三合'), 'false')
  check(`${br} vs ${br} 日支文案`, /伏吟/.test(r.dayBranchNote), 'true')
}

// 伏吟文案不得與半三合共用
const fuyinNote = analyzeCompat(chartOfBranch('午'), chartOfBranch('午')).dayBranchNote
const banheNote = analyzeCompat(chartOfBranch('寅'), chartOfBranch('午')).dayBranchNote
check('伏吟文案 ≠ 半三合文案', fuyinNote !== banheNote, 'true')

// ══ §7.9 大運方向與起運（回歸，現有已正確）══════════
section('§7.9 大運方向與起運（回歸）')
const DAYUN_EXPECT = [
  ['A', [1990, 1, 1, bi('巳')], 'M', '乙亥／甲戌／癸酉', 8.3, 1998],
  ['A', [1990, 1, 1, bi('巳')], 'F', '丁丑／戊寅／己卯', 1.5, 1992],
  ['B', [1989, 6, 1, bi('巳')], 'M', '戊辰／丁卯／丙寅', 8.9, 1998],
  ['B', [1989, 6, 1, bi('巳')], 'F', '庚午／辛未／壬申', 1.5, 1991],
  ['E', [1990, 3, 1, bi('巳')], 'M', '己卯／庚辰／辛巳', 1.6, 1992],
  ['E', [1990, 3, 1, bi('巳')], 'F', '丁丑／丙子／乙亥', 8.3, 1998],
]
for (const [tag, args, g, wantSteps, wantAge, wantYear] of DAYUN_EXPECT) {
  const r = calculate(...args, g)
  check(`${tag}${g} 前三步大運`, r.daYuns.slice(0, 3).map(gz).join('／'), wantSteps)
  checkNear(`${tag}${g} 起運歲數`, r.startAge, wantAge, 0.6)
  check(`${tag}${g} 起運西元年`, r.daYuns[0].startYear, wantYear)
}

// ══ §7.10 合盤互動（回歸，現有已正確）════════════════
section('§7.10 合盤互動（回歸）')
const cc = analyzeCompat(charts.C, charts.D)
const has = (type, aBr, bBr) => cc.interactions.some(i =>
  i.type === type && i.aLabel.includes(aBr) && i.bLabel.includes(bBr))
check('丑 × 子 六合', has('地支六合', '丑', '子'), 'true')
check('酉 × 辰 六合', has('地支六合', '酉', '辰'), 'true')
check('戌 × 卯 六合', has('地支六合', '戌', '卯'), 'true')
check('酉 × 卯 六沖', has('地支六沖', '酉', '卯'), 'true')
check('戌 × 辰 六沖', has('地支六沖', '戌', '辰'), 'true')
check('丑 × 辰 相破', has('地支相破', '丑', '辰'), 'true')
check('酉 × 子 相破', has('地支相破', '酉', '子'), 'true')
check('日支 戌 vs 子 無直接沖合', /無直接沖合/.test(cc.dayBranchNote), 'true')

// ══ 結果 ═══════════════════════════════════════════════
console.log(`\n${'═'.repeat(46)}`)
if (fails.length === 0) {
  console.log(`✅ 全部通過：${pass} 項`)
} else {
  console.log(`❌ 通過 ${pass} 項，失敗 ${fails.length} 項：\n`)
  fails.forEach((f, i) => console.log(`  ${i + 1}. ${f}\n`))
  process.exitCode = 1
}
