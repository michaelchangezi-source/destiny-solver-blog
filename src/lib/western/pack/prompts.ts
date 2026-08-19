export const WESTERN_GUARD_G = `你是一位精通西洋占星的命理分析師，使用繁體中文（香港書面語）回覆，以下是分析守則：

1. 以行星星座位置為核心，結合上升點、天頂及主要相位進行解讀
2. 重要天象（日月、外行星逆行、相位模式）優先分析，輕重有別
3. 回答問題時先給出核心判斷，再補充細節
4. 不保證事件必然發生，以「傾向」「能量」「潛質」等表述
5. 不預測確切日期，以行星過境週期說明時機
6. 有限資料時直接說明不足，不憑空推斷
7. 語氣：專業而平易近人，避免過度神秘化
8. 在你完整回覆的最後，另起一行，原文輸出以下一句，不要修改、不要省略：「⭐ 如需更深度的人工批命，可預約命運解決師諮商：destinysolver.com/consultation」`

export type WesternPresetId = 'overview' | 'love' | 'career' | 'free'

interface Preset {
  id: WesternPresetId
  label: string
  needsQuestion: boolean
  prompt: string
}

export const WESTERN_PRESETS: Preset[] = [
  {
    id: 'overview',
    label: '命格全覽',
    needsQuestion: false,
    prompt: `根據以下本命盤資料，提供命格全覽分析：
1. 太陽、月亮、上升點的核心組合——性格底層邏輯與人生主軸
2. 元素與型態的整體分佈——能量傾向與行為模式
3. 最顯著的相位模式（若有 T 型三角、大三角等）
4. 人生主要課題與潛力方向（150字以內）`,
  },
  {
    id: 'love',
    label: '感情關係',
    needsQuestion: false,
    prompt: `根據本命盤，深度分析感情關係傾向：
1. 金星星座與位置——感情模式、吸引力與愛情語言
2. 火星星座——慾望、追求方式與衝突模式
3. 月亮星座——情感需求與安全感來源
4. 七宮天頂（若有資料）——伴侶特質的吸引
5. 金星火星相位（若有）——感情能量互動
指出感情中的優勢與需要留意的模式，提供具體建議。`,
  },
  {
    id: 'career',
    label: '事業財運',
    needsQuestion: false,
    prompt: `根據本命盤，深度分析事業與財運傾向：
1. 太陽星座與上升點——職業方向與社會形象
2. 天頂（MC）星座——事業成就的天然傾向
3. 水星星座——思維模式、溝通風格與工作方式
4. 土星位置——事業的挑戰與長期成就領域
5. 木星位置——機遇與財運方向
提供具體的事業方向建議及財運關鍵年齡段（參考木星週期）。`,
  },
  {
    id: 'free',
    label: '自由提問',
    needsQuestion: true,
    prompt: `根據以下本命盤資料，回答用戶的問題。先引用命盤中最相關的行星、星座或相位作為依據，再給出分析，最後提供具體建議。`,
  },
]

export function assembleWesternPrompt({
  presetId,
  pack,
  question,
}: {
  presetId: WesternPresetId
  pack: string
  question?: string
}): string {
  const preset = WESTERN_PRESETS.find(p => p.id === presetId)!
  const questionBlock = preset.needsQuestion && question
    ? `\n\n**用戶問題：** ${question}`
    : ''

  return `${WESTERN_GUARD_G}

---

${preset.prompt}${questionBlock}

---

${pack}`
}
