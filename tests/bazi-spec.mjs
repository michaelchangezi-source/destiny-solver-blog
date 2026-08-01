// destinysolver 排盤／合盤回歸測試（升級計劃書 §7 驗收向量）
// 跑法：npm test        或        node tests/bazi-spec.mjs
// 任何動到 src/lib/bazi-calc.ts、bazi-compat.ts 的改動，必須全綠才算完成。
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import ts from 'typescript'
import { loadLib } from './_loader.mjs'

// _loader.mjs 只轉 bazi-calc／bazi-compat；本檔另外要驗 P1-3、P1-4 兩個新模組，
// 同樣轉去 tests/.build（須在 loadLib 之後跑，因為 loadLib 會先清空該資料夾）
const _here = dirname(fileURLToPath(import.meta.url))
async function loadExtra(names) {
  const buildDir = resolve(_here, '.build')
  mkdirSync(buildDir, { recursive: true })
  const mods = {}
  for (const name of names) {
    const src = readFileSync(resolve(_here, '..', 'src/lib', `${name}.ts`), 'utf8')
    const js = ts.transpileModule(src, {
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
    }).outputText
    writeFileSync(resolve(buildDir, `${name}.mjs`), js.replace(/from ['"]\.\/([\w-]+)['"]/g, "from './$1.mjs'"))
  }
  for (const name of names) mods[name] = await import(pathToFileURL(resolve(buildDir, `${name}.mjs`)).href)
  return mods
}

const { 'bazi-calc': calc, 'bazi-compat': compat } = await loadLib()
const { 'bazi-shensha': shensha, 'bazi-timeline': timeline } = await loadExtra(['bazi-shensha', 'bazi-timeline'])
const { calculate, branchHiddenStems, BRANCHES, STEMS, solarTimeOffset, hourBranchOf } = calc
const { analyzeCompat } = compat
const { twelveStage, emptyBranches, computeShenSha, nayin } = shensha
const { monthCells, branchInteractions } = timeline

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

// ══ §7.4 十二長生（P1-3）══════════════════════════════
section('§7.4 十二長生')
const BING_STAGE = { 寅: '長生', 巳: '臨官', 午: '帝旺', 未: '衰', 酉: '死', 子: '胎' }
for (const [br, want] of Object.entries(BING_STAGE)) {
  check(`丙日主 ${br}`, twelveStage(STEMS.indexOf('丙'), bi(br)), want)
}
const REN_STAGE = { 申: '長生', 辰: '墓', 巳: '絕', 寅: '病', 午: '胎', 未: '養' }
for (const [br, want] of Object.entries(REN_STAGE)) {
  check(`壬日主 ${br}`, twelveStage(STEMS.indexOf('壬'), bi(br)), want)
}
// 全序回歸：丙日主十二支順序完整
check('丙日主十二支全序',
  BRANCHES.map(b => twelveStage(STEMS.indexOf('丙'), bi(b))).join('／'),
  '胎／養／長生／沐浴／冠帶／臨官／帝旺／衰／病／死／墓／絕')

// ══ §7.5 真太陽時（P1-1）══════════════════════════════
section('§7.5 真太陽時')
const HK_LON = 114.17
const off = solarTimeOffset(1990, 1, 1, HK_LON)
checkNear('香港經度時差（分）', off.lonOffsetMin, -23.32, 0.05)
checkNear('1990-01-01 均時差（分）', off.eotMin, -3.7, 0.3)
checkNear('校正總量（分）', off.totalOffsetMin, -27.0, 0.4)

const stOpts = { trueSolarTime: true, longitude: HK_LON }
// 10:00 → 約 09:33，仍在巳時，時柱維持癸巳
const st10 = calculate(1990, 1, 1, bi('巳'), 'M', { ...stOpts, hour24: 10, minute: 0 })
check('10:00 校正後時柱', gz(st10.hour), '癸巳')
check('10:00 校正後時間', st10.effectiveTime, '09:33')
check('10:00 時柱未變', st10.solarTime.hourPillarChanged, 'false')
// 邊界：09:10 → 約 08:43，落入辰時，時柱由癸巳變壬辰
const st0910 = calculate(1990, 1, 1, bi('巳'), 'M', { ...stOpts, hour24: 9, minute: 10 })
check('09:10 校正後時柱', gz(st0910.hour), '壬辰')
check('09:10 校正前時柱', st0910.solarTime.originalHourPillar, '癸巳')
check('09:10 時柱改變須警示', st0910.solarTime.hourPillarChanged, 'true')
check('09:10 校正後時辰', BRANCHES[st0910.solarTime.correctedHourBranch], '辰')
check('09:10 校正前時辰', BRANCHES[st0910.solarTime.originalHourBranch], '巳')
// 不啟用真太陽時則維持巳時
const noSt = calculate(1990, 1, 1, bi('巳'), 'M', { hour24: 9, minute: 10 })
check('09:10 未校正時柱', gz(noSt.hour), '癸巳')
check('未校正無 solarTime 資訊', noSt.solarTime, 'null')
// 時辰邊界換算
check('23:30 屬子時', BRANCHES[hourBranchOf(23, 30)], '子')
check('00:30 屬子時', BRANCHES[hourBranchOf(0, 30)], '子')
check('01:00 屬丑時', BRANCHES[hourBranchOf(1, 0)], '丑')
check('09:00 屬巳時', BRANCHES[hourBranchOf(9, 0)], '巳')

// ══ §7.6 子時換日兩派（P1-2）══════════════════════════
section('§7.6 子時換日')
const z23 = calculate(1990, 1, 1, 0, 'M', { hour24: 23, minute: 30, zishiMode: '23' })
const z00 = calculate(1990, 1, 1, 0, 'M', { hour24: 23, minute: 30, zishiMode: '00' })
check('23:00 換日 日柱', gz(z23.day), '丁卯')
check('23:00 換日 時柱', gz(z23.hour), '庚子')
check('00:00 換日 日柱', gz(z00.day), '丙寅')
check('00:00 換日 時柱', gz(z00.hour), '戊子')
check('兩派日柱必須不同', gz(z23.day) !== gz(z00.day), 'true')
check('早子時要並列兩派（23 派）', `${z23.zishi.dayPillar23}／${z23.zishi.dayPillar00}`, '丁卯／丙寅')
check('早子時要並列兩派（00 派）', `${z00.zishi.dayPillar23}／${z00.zishi.dayPillar00}`, '丁卯／丙寅')
check('非子時不出兩派提示', calculate(1990, 1, 1, bi('巳'), 'M', { hour24: 10 }).zishi, 'null')
// 原有五參數呼叫方式不得受影響
check('五參數呼叫仍可用', fourPillars(calculate(1990, 1, 1, bi('巳'), 'M')), '己巳／丙子／丙寅／癸巳')

// ══ §7.7 神煞（P1-3）══════════════════════════════════
section('§7.7 神煞')
const ssB = computeShenSha(charts.B)   // 己巳／己巳／壬辰／乙巳
const findSS = (list, name) => list.find(s => s.name === name)
check('B 魁罡成立', !!findSS(ssB, '魁罡'), 'true')
check('B 魁罡在日柱', findSS(ssB, '魁罡')?.pillars.join(''), '日')
check('B 華蓋在日柱', findSS(ssB, '華蓋')?.pillars.join(''), '日')
check('B 華蓋基準', /日支辰起，申子辰局，華蓋在辰/.test(findSS(ssB, '華蓋')?.basis ?? ''), 'true')
check('B 天乙貴人 年月時皆見', findSS(ssB, '天乙貴人')?.pillars.join(''), '年月時')
check('B 劫煞 年月時皆見', findSS(ssB, '劫煞')?.pillars.join(''), '年月時')
check('B 劫煞基準', /日支辰起，申子辰局，劫煞在巳/.test(findSS(ssB, '劫煞')?.basis ?? ''), 'true')

const ssA = computeShenSha(charts.A)   // 己巳／丙子／丙寅／癸巳
check('A 祿神 年時見', findSS(ssA, '祿神')?.pillars.join(''), '年時')
check('A 紅艷成立', !!findSS(ssA, '紅艷'), 'true')
check('A 亡神 年時見', findSS(ssA, '亡神')?.pillars.join(''), '年時')
check('A 亡神基準', /日支寅起，寅午戌局，亡神在巳/.test(findSS(ssA, '亡神')?.basis ?? ''), 'true')
check('每項神煞必帶計算基準', ssA.every(s => s.basis && s.basis.length > 4), 'true')

// ══ §7.8 空亡（P1-3）══════════════════════════════════
section('§7.8 空亡')
const kong = (p) => emptyBranches(p.stem, p.branch).map(b => BRANCHES[b]).join('')
check('A 日柱丙寅 空亡', kong(charts.A.day), '戌亥')
check('B 日柱壬辰 空亡', kong(charts.B.day), '午未')
check('C 日柱壬戌 空亡', kong(charts.C.day), '子丑')
check('D 日柱甲子 空亡', kong(charts.D.day), '戌亥')

// ══ 納音與時間軸（P1-3、P1-4）════════════════════════
section('納音與五層時間軸')
check('甲子納音', nayin(STEMS.indexOf('甲'), bi('子')), '海中金')
check('丙寅納音', nayin(STEMS.indexOf('丙'), bi('寅')), '爐中火')
check('壬辰納音', nayin(STEMS.indexOf('壬'), bi('辰')), '長流水')
const mc2026 = monthCells(2026, charts.A.day.stem)
check('流月共 12 個', mc2026.length, 12)
check('流月首月為寅月', mc2026[0].gz.slice(1), '寅')
check('流月首月節氣為立春', mc2026[0].jieName, '立春')
check('流月節氣日期為 2/3 或 2/4', ['2/3', '2/4'].includes(mc2026[0].jieDate), 'true')
check('流月末月為丑月小寒', `${mc2026[11].gz.slice(1)}${mc2026[11].jieName}`, '丑小寒')
// 流年引動原局（A 盤：年巳、月子、日寅、時巳）
const acts = branchInteractions(bi('申'), charts.A)
const actStr = acts.map(a => `${a.pillarLabel}${a.relation}`).join('／')
check('申年沖日支寅', /日柱沖/.test(actStr), 'true')
check('申年合年支巳', /年柱合/.test(actStr), 'true')
check('申年刑日支寅', /日柱刑/.test(actStr), 'true')
check('子年伏吟月支子', branchInteractions(bi('子'), charts.A).some(a => a.pillarLabel === '月柱' && a.relation === '伏吟'), 'true')

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
