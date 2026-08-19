// 空亡（旬空）計算：每柱用自身天干地支推算所在旬的空亡兩支
// 公式與 bazi-shensha.ts emptyBranches 一致，此處為各柱獨立計算
import { BRANCHES } from '@/lib/bazi-calc'

export function pillarKongWang(stemIdx: number, branchIdx: number): string {
  const first = ((branchIdx - stemIdx + 10) % 12 + 12) % 12
  return BRANCHES[first] + BRANCHES[(first + 1) % 12]
}
