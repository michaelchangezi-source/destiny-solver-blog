// 命理詞彙定義頁的單一資料來源。
// 每個詞彙的定義與常見誤解皆源自本站現有文章的講法，不另行創作命理理論，
// 定義段落刻意控制在四十至六十字，供 AI 搜尋引擎（ChatGPT、Perplexity、
// Google AI Overview）直接抽取引用。相關文章用真實存在的 slug，頁面渲染時
// 會呼叫 getArticleBySlug 取得標題，故此處若填錯 slug 會在 build 時卡住。

export interface GlossaryTerm {
  /** 路由 slug，例如 shishen */
  slug: string
  /** 中文詞名，例如 十神 */
  term: string
  /** 40～60 字的直接定義，獨立成段，供 AI 抽取 */
  definition: string
  /** 常見誤解 */
  misconception: string
  /** 延伸閱讀：真實存在的文章 slug，3～5 條 */
  relatedSlugs: string[]
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    slug: 'shishen',
    term: '十神',
    definition:
      '十神是日主與其他天干五行生剋轉化而成的十種符號，代表社會角色、心性特質與人生追求，需結合宮位與強弱活論取象。',
    misconception:
      '常見誤解是把十神當成固定標籤，一種十神只有一種意涵。實際上要「活論十神」，同一符號在不同宮位、強弱與作用路線下，取象會完全不同。',
    relatedSlugs: ['topic-03', 'topic-24', 'topic-10', 'post-20260612-08'],
  },
  {
    slug: 'dayun',
    term: '大運',
    definition:
      '大運是八字命局每十年更換一次的運勢週期，為人生某階段劃定整體氣候框架，流年事件都在此框架之內展開，是時序系統的宏觀主宰。',
    misconception:
      '常見誤解是把大運當成獨立的吉凶判斷，直接論斷「這運好或不好」。其實大運只定義十年氣候，具體事件仍要配合流年與命局結構一併解讀。',
    relatedSlugs: ['topic-07', 'topic-14', 'post-20260802-01'],
  },
  {
    slug: 'liunian',
    term: '流年',
    definition:
      '流年是某一年份的天干地支組合，主一年吉凶，是引動命局或大運潛藏格局的年度催化劑，地支力量是根基，天干是事件顯現的外象。',
    misconception:
      '常見誤解只看流年天干代表的表面意義。其實流年地支才是力量根基，地支決定事件能否真正落地，天干只是「做了什麼、說了什麼」的外象。',
    relatedSlugs: ['topic-14', 'topic-07', 'post-20260612-13'],
  },
  {
    slug: 'yongshen',
    term: '用神',
    definition:
      '用神是命局裡最需要的五行力量，用來疏通五行卡住或不流通的位置，讓命局的能量流動更順暢，而非坊間所說的幸運顏色或吉祥物。',
    misconception:
      '常見誤解以為用神是命理師給的固定幸運五行或顏色。其實它是疏通命局卡住位置的具體力量，不同判斷框架（先定格局或先看日主）得出的用神本可不同。',
    relatedSlugs: ['post-20260711-07', 'topic-10', 'post-20260620-07', 'post-20260802-01'],
  },
  {
    slug: 'canggan',
    term: '藏干',
    definition:
      '藏干是地支內部所含藏的天干，又稱人元，力量原本隱藏內斂，未透出天干時不易顯現，一旦被沖動或被大運流年引動，便會顯露出來。',
    misconception:
      '常見誤解以為藏干沒有透出天干就等於沒有力量、可以忽略不計。其實藏干的力量是隱藏而非消失，被沖或被引動時同樣能對命局產生實質作用。',
    relatedSlugs: ['topic-31', 'topic-20', 'topic-24', 'post-20260708-03'],
  },
  {
    slug: 'geju',
    term: '格局',
    definition:
      '格局是命局中所有干支結構所呈現出的能量流向與內在邏輯，決定生命層次與人生目標聚焦程度，以清純或雜亂衡量高低與複雜度。',
    misconception:
      '常見誤解把格局簡化為單一十神所立的格，例如只看「正財格」或「食神格」。其實格局是整個命局能量流向的內在邏輯，重點在於清純或雜亂。',
    relatedSlugs: ['topic-10', 'post-20260711-07', 'topic-03'],
  },
  {
    slug: 'rizhu',
    term: '日主',
    definition:
      '日主又稱日元，是日柱天干，代表命主自己，是整張八字命局觀察一切的基準點，其餘七字圍繞日主形成幫扶、消耗與追求的關係。',
    misconception:
      '常見誤解把日主當成獨立看待、與其他字無關的單一符號。其實日主是命局觀察一切的「太極點」，其餘七字的意義都要以日主為中心去判斷。',
    relatedSlugs: ['post-20260620-07', 'topic-09', 'post-20260627-06'],
  },
  {
    slug: 'zuogong',
    term: '做功',
    definition:
      '做功指日主根氣主動把命局其他結構的能量接住並轉化落地的能力，根氣越足，格局裡的財官食傷才越能在現實中真正發揮出來。',
    misconception:
      '常見誤解以為只要命局配齊好的十神組合，人生自然順利。其實重點是日主能否把那份能量接住、轉化出去，根氣不足，格局再完整也難以落地。',
    relatedSlugs: ['post-20260802-01', 'post-20260711-07', 'topic-07'],
  },
  {
    slug: 'quxiang',
    term: '去向',
    definition:
      '去向指命局裡某一股五行力量最終流向何處，例如財星是被駕馭、被阻塞還是外流，判斷去向清晰與否，是命運能否真正落地的關鍵。',
    misconception:
      '常見誤解只看命局某種五行力量有多旺，就直接判斷吉凶。其實重點是這股力量最終流向何處，去向清晰才算駕馭得住，旺而無去向反而容易阻塞。',
    relatedSlugs: ['post-20260620-06', 'post-20260620-04', 'post-20260612-13'],
  },
  {
    slug: 'bijie',
    term: '比劫',
    definition:
      '比劫是與日主同五行的十神，分比肩與劫財，代表同輩、朋友與合夥人的力量，有根者是實質助力，虛透天干而無根者則多表面熱絡。',
    misconception:
      '常見誤解把比劫一律當成穩定的助力或人脈。其實比肩有根才是真朋友、有實際幫助，無根虛透在天干，往往是表面熱絡，遇到利益就容易散去。',
    relatedSlugs: ['post-20260724-06', 'post-20260620-07', 'post-20260627-01'],
  },
  {
    slug: 'shishang',
    term: '食傷',
    definition:
      '食傷是食神與傷官的合稱，皆為日主所生之星，代表才華與能量的輸出方式，食神性質溫和內斂，傷官外露而帶挑戰規範的特質。',
    misconception:
      '常見誤解把食神與傷官混為一談，以為兩者性質相近可以互相取代。其實食神走「以德服人」的路，傷官走「以才服人」的路，落到現實的路徑截然不同。',
    relatedSlugs: ['post-20260612-08', 'post-20260612-10', 'post-20260802-01'],
  },
  {
    slug: 'guansha',
    term: '官殺',
    definition:
      '官殺是正官與七殺的合稱，象徵外在的規範、挑戰與權力，是日主必須面對的社會舞台，需與祿刃相配合才能判斷力量能否承擔。',
    misconception:
      '常見誤解把官殺一律視為壓力或凶星，見官殺就論不利。其實官殺是外在權力與挑戰的舞台，能否承擔要看日主的根氣與祿刃是否足以相配。',
    relatedSlugs: ['topic-09', 'post-20260627-04', 'post-20260620-07'],
  },
]

export function getGlossaryTerm(slug: string): GlossaryTerm | null {
  return GLOSSARY_TERMS.find((t) => t.slug === slug) ?? null
}
