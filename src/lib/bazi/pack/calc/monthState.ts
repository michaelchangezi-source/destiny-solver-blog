// 月令五行旺相休囚死
// 五行索引：0=木 1=火 2=土 3=金 4=水
// 地支主氣對應五行（與 bazi-calc.ts BRANCH_ELEM 一致）
const BRANCH_ELEM = [4, 2, 0, 0, 2, 1, 1, 2, 3, 3, 2, 4]
const ELEM_NAMES = ['木', '火', '土', '金', '水']
const GEN = [1, 2, 3, 4, 0]       // 木生火，火生土，土生金，金生水，水生木
const GEN_REV = [4, 0, 1, 2, 3]   // 什麼生我（木←水，火←木，...）
const CTR = [2, 3, 4, 0, 1]       // 我克（木克土，火克金，...）
const CTR_BY = [3, 4, 0, 1, 2]    // 什麼克我（木←金，火←水，...）

// 返回五元素各自在當月的狀態（旺相休囚死），以及完整字串
export function monthStateMap(monthBranch: number): Record<string, string> {
  const s = BRANCH_ELEM[monthBranch]
  const map: Record<string, string> = {}
  for (let e = 0; e < 5; e++) {
    if (e === s) map[ELEM_NAMES[e]] = '旺'
    else if (e === GEN[s]) map[ELEM_NAMES[e]] = '相'
    else if (e === GEN_REV[s]) map[ELEM_NAMES[e]] = '休'
    else if (e === CTR_BY[s]) map[ELEM_NAMES[e]] = '囚'
    else map[ELEM_NAMES[e]] = '死'
  }
  return map
}

// 格式化為「水旺 木相 金休 土囚 火死」順序（以旺相休囚死排序）
export function formatMonthState(map: Record<string, string>): string {
  const order = ['旺', '相', '休', '囚', '死']
  return order
    .flatMap((state) => Object.entries(map).filter(([, v]) => v === state).map(([k]) => k + state))
    .join(' ')
}
