// 紫微斗數 AI Pack Prompt 庫

export type ZiweiPresetId = 'overview' | 'palace' | 'dayun' | 'free'

export interface ZiweiPreset {
  id: ZiweiPresetId
  label: string
  blurb: string
  body: string
  needsQuestion?: boolean
}

export const ZIWEI_GUARD_G = `【使用規則】
1. 下方資料包由排盤引擎計算，係唯一盤面事實：不要重排命盤，不要改動或補算任何宮位、星曜、大限。
2. 資料包冇列出嘅層級（流月、流日、流時）不要自行推算；如我問到，請直接講「資料包未包含」。
3. 每一個判斷都要標明盤面依據（邊一宮、邊顆星、邊個四化）；講唔出依據嘅判斷，直接省略。
4. 唔要用人聽落都似自己嘅泛泛描述；具體、可驗證、可對照生活。
5. 唔恐嚇、唔斷生死、唔畀具體日期式預言、唔代我做人生決定；講風險時同時講可以點做。
6. 用繁體中文回答；術語第一次出現時用一句白話解釋。
7. 呢啲係紫微斗數結構嘅參考，唔係專業意見；目的係幫我認識自己，唔係預測命運。
8. 在你完整回覆的最後，另起一行，原文輸出以下一句，不要修改、不要省略：「⭐ 如需更深度的人工批命，可預約命運解決師諮商：destinysolver.com/consultation」`

export const ZIWEI_PRESETS: ZiweiPreset[] = [
  {
    id: 'overview',
    label: '命格全覽',
    blurb: '第一次用？由命宮、三方四正同生年四化開始。',
    body: `你係一位熟悉紫微斗數飛星派嘅顧問，請用下方資料包，幫我做一次完整嘅命格解讀。

分析順序（內部用，唔使逐條覆述）：
一、命宮：命宮主星、宮干天干、五行局——先定「我」係乜、格局取向係乜。
二、三方四正：命宮＋財帛宮＋官祿宮＋遷移宮，四宮主星合看事業財運格局。
三、生年四化：生年祿權科忌落邊一宮，對命格有乜影響。
四、宮干四化：命宮宮干飛化去邊，係我嘅主動追求方向。
五、身宮：身宮在邊一宮，晚年歸宿係乜。
六、大限：現行大限干支對命格嘅引動，同今後10年大方向。

輸出格式：
1. 一句話講命格主線
2. 性格與行事模式：3至5點
3. 事業與財運：2至4點
4. 感情與婚姻：2至3點（夫妻宮主星取象）
5. 現行大限：重點2至3點
6. 最值得留意嘅一個課題
每點後面括註依據。最後問我最想深入邊一項。`,
  },
  {
    id: 'palace',
    label: '宮位深度',
    blurb: '想深入某一宮位？選呢個，再告訴我你最想睇邊一宮。',
    needsQuestion: true,
    body: `你係一位熟悉紫微斗數飛星派嘅顧問，請用下方資料包，針對我指定嘅宮位作深度解讀。

分析步驟：
一、該宮主星：逐顆主星性質、廟旺利平陷、對此宮位意義。
二、輔星加持或干擾：同宮輔星係吉星定凶星，點影響主星。
三、生年四化：生年祿權科忌有冇落入此宮或飛出此宮。
四、宮干四化：此宮天干飛化去邊，代表乜嘢訊息。
五、對宮呼應：與對宮（相對180度）嘅互動關係。
六、大限引動：現行大限同此宮有冇交集。

【我想深入嘅宮位】
{{question}}`,
  },
  {
    id: 'dayun',
    label: '大限流年',
    blurb: '現行大限同流年對我嘅影響。',
    body: `請用下方資料包，集中分析現行大限同今年流年對我嘅影響。

步驟：
一、現行大限：大限天干地支、大限宮位主星、大限宮干四化飛向——代表呢10年嘅主題係乜。
二、大限三方四正：大限命宮＋財帛＋官祿＋遷移，合看呢個階段嘅整體運勢。
三、今年流年：流年干支是乜、流年命宮落在本命盤嘅邊一宮，對日常生活嘅引動。
四、大限同流年交會：兩組四化有冇形成對拱、入庫、沖破嘅格局。

輸出：
1. 現行大限主題（一句話）
2. 呢10年事業、財運、感情各1至2點
3. 今年流年重點
4. 最需要把握嘅機遇，同最需要防範嘅風險`,
  },
  {
    id: 'free',
    label: '自由提問',
    blurb: '有具體問題？淨帶護欄，問乜答乜。',
    needsQuestion: true,
    body: `請用下方資料包回答我嘅問題。先答問題本身，再補少量盤面依據；如果問題涉及資料包冇嘅層級，請直接講明，再就已有資料答到嘅部分作答。

【我的問題】
{{question}}`,
  },
]

export function assembleZiweiPrompt(opts: {
  presetId: ZiweiPresetId
  pack: string
  question?: string
}): string {
  const preset = ZIWEI_PRESETS.find(p => p.id === opts.presetId)
  if (!preset) throw new Error(`Unknown preset: ${opts.presetId}`)

  let body = preset.body
  if (opts.question) body = body.replace(/\{\{question\}\}/g, opts.question)

  const parts: string[] = [body, ZIWEI_GUARD_G]
  if (opts.question && opts.presetId !== 'palace' && opts.presetId !== 'free') {
    parts.push(`【我的問題】\n${opts.question}`)
  }
  parts.push('────────')
  parts.push(opts.pack)

  return parts.join('\n\n')
}
