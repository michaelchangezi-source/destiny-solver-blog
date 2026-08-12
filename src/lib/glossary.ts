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
    relatedSlugs: ['post-20260807-01', 'topic-14', 'topic-07', 'post-20260612-13'],
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
  {
    slug: 'bi-jian',
    term: '比肩',
    definition:
      '比肩是日主同五行同陰陽的十神，代表對等的同輩、朋友與競爭者，有根者為實質助力，透干無根則多屬表面往來。',
    misconception:
      '常見誤解把比肩一律視為可靠人脈。其實要看根氣，有根比肩才是真助力，無根虛透在天干，遇到利益衝突時反而最先散去。',
    relatedSlugs: ['post-20260724-06', 'post-20260620-07', 'topic-03'],
  },
  {
    slug: 'jie-cai',
    term: '劫財',
    definition:
      '劫財是日主同五行而陰陽相異的十神，代表競爭、破財與明爭暗奪的力量，比肩偏向合作，劫財則帶奪取與消耗的性質。',
    misconception:
      '常見誤解以為命帶劫財就注定破財漏財。其實是否奪財要看命局結構與大運引動是否成立，並非見劫財就一律論凶。',
    relatedSlugs: ['post-20260613-06', 'post-20260724-06', 'topic-03'],
  },
  {
    slug: 'shi-shen',
    term: '食神',
    definition:
      '食神是日主所生、與日主同陰陽的十神，代表才華的溫和輸出與享受，走「以德服人」的路線，性質內斂而不張揚。',
    misconception:
      '常見誤解把食神與傷官混為一談。其實食神重享受與才藝的自然流露，傷官重表現與突破規範，落地方式截然不同。',
    relatedSlugs: ['post-20260612-08', 'post-20260708-03', 'post-20260711-06'],
  },
  {
    slug: 'shang-guan',
    term: '傷官',
    definition:
      '傷官是日主所生、與日主陰陽相異的十神，代表才華的外露與挑戰規範的傾向，能力強但容易與體制或權威產生摩擦。',
    misconception:
      '常見誤解以為傷官必然剋官帶來災禍。其實傷官見官是否為凶要看命局是否有印星或食神調停，並非見即論凶。',
    relatedSlugs: ['post-20260612-10', 'post-20260711-03', 'post-20260711-02'],
  },
  {
    slug: 'pian-cai',
    term: '偏財',
    definition:
      '偏財是日主所剋、與日主同陰陽的十神，代表流動性強的財富、機會財與人情財，重視眼光與周轉而非固定收入。',
    misconception:
      '常見誤解把偏財等同外遇桃花。其實偏財本義是流動的財路與機會，感情層面的取象需另配夫妻宮與桃花星判斷。',
    relatedSlugs: ['post-20260620-06', 'post-20260613-02', 'topic-06'],
  },
  {
    slug: 'zheng-cai',
    term: '正財',
    definition:
      '正財是日主所剋、與日主陰陽相異的十神，代表穩定可控的收入與務實的財務態度，重視積累而非投機式的機會財。',
    misconception:
      '常見誤解以為正財旺就必然富裕。其實正財要能被日主駕馭、不入墓不被劫奪，力量才真正落地成為實質財富。',
    relatedSlugs: ['post-20260620-06', 'post-20260712-07', 'post-20260627-05'],
  },
  {
    slug: 'qi-sha',
    term: '七殺',
    definition:
      '七殺是剋日主、與日主同陰陽的十神，代表壓力、挑戰與外來的威權，力量剛猛，需靠日主根氣或食神加以制化。',
    misconception:
      '常見誤解把七殺一律當成凶星，見殺就論不利。其實七殺若能被適當制化，反而是成就大事業的推動力量。',
    relatedSlugs: ['post-20260721-03', 'post-20260612-12', 'topic-09'],
  },
  {
    slug: 'zheng-guan',
    term: '正官',
    definition:
      '正官是剋日主、與日主陰陽相異的十神，代表規範、地位與社會認可，性質相對溫和，重視秩序與循規蹈矩的路徑。',
    misconception:
      '常見誤解把正官等同官運亨通的保證。其實正官需配合印星護身與日主根氣，力量不足時規範反而變成束縛。',
    relatedSlugs: ['post-20260627-04', 'post-20260612-10', 'topic-09'],
  },
  {
    slug: 'pian-yin',
    term: '偏印',
    definition:
      '偏印是生日主、與日主同陰陽的十神，代表偏門的學識、直覺與孤獨感，思維獨特但不易被主流價值觀理解接納。',
    misconception:
      '常見誤解把偏印一律視為梟神奪食的凶星。其實偏印是否為患要看是否真正剋制食神，並非見偏印就論奪食。',
    relatedSlugs: ['post-20260627-03', 'post-20260711-04', 'topic-06'],
  },
  {
    slug: 'zheng-yin',
    term: '正印',
    definition:
      '正印是生日主、與日主陰陽相異的十神，代表庇蔭、學識與正統的保護力，性質溫和，多主母親、貴人與制度性靠山。',
    misconception:
      '常見誤解以為正印越旺越好，多多益善。其實正印過重會使人依賴而缺乏行動力，需與財星適當平衡才算得宜。',
    relatedSlugs: ['post-20260620-04', 'post-20260627-06', 'post-20260607-17'],
  },
  {
    slug: 'changsheng',
    term: '長生',
    definition:
      '長生是十二長生的起點，代表力量剛剛萌發、如初生嬰兒般充滿潛力，做事帶著開創性但根基尚淺，需要時間扶植。',
    misconception:
      '常見誤解以為長生代表力量已經強盛。其實長生只是萌芽階段，力量尚未成熟，重點在潛力而非現有的實際強度。',
    relatedSlugs: ['topic-32', 'post-20260710-05', 'topic-31'],
  },
  {
    slug: 'muyu',
    term: '沐浴',
    definition:
      '沐浴是十二長生的第二階段，如同剛出生後的清洗，帶有不穩定與桃花性質，象徵情緒起伏大、容易受外界誘惑。',
    misconception:
      '常見誤解把沐浴直接等同爛桃花或必然感情不順。其實沐浴代表的是不穩定的過渡狀態，仍需配合其他星辰綜合判斷。',
    relatedSlugs: ['topic-32', 'post-20260710-05', 'post-20260621-19'],
  },
  {
    slug: 'guandai',
    term: '冠帶',
    definition:
      '冠帶是十二長生的第三階段，象徵成年加冠、開始學習規矩與承擔責任，力量逐漸穩固但仍在累積經驗的過程中。',
    misconception:
      '常見誤解以為冠帶已等同臨官帝旺般的全盛力量。其實冠帶只是逐漸成熟的過渡期，尚未到達力量最旺的階段。',
    relatedSlugs: ['topic-32', 'post-20260710-05', 'topic-31'],
  },
  {
    slug: 'linguan',
    term: '臨官',
    definition:
      '臨官是十二長生中力量接近旺盛的階段，如同即將上任的官員，象徵能力已具備、正準備在社會舞台上大展身手。',
    misconception:
      '常見誤解把臨官與帝旺混為一談，以為兩者力量完全相同。其實臨官是準備就緒尚未登頂，帝旺才是力量的最高峰。',
    relatedSlugs: ['topic-32', 'post-20260710-05', 'topic-23'],
  },
  {
    slug: 'diwang',
    term: '帝旺',
    definition:
      '帝旺是十二長生中力量最旺盛的階段，如同帝王在位、氣勢達到頂峰，行動力與自信心最強，但也容易過於剛強。',
    misconception:
      '常見誤解以為帝旺全是好事，越旺越吉利。其實帝旺過剛容易缺乏彈性，物極必反，仍需五行流通加以調節。',
    relatedSlugs: ['topic-32', 'post-20260710-05', 'topic-23'],
  },
  {
    slug: 'shuai',
    term: '衰',
    definition:
      '衰是十二長生由盛轉弱的第一步，如同人過壯年開始收斂鋒芒，力量仍在但已不如帝旺時剛猛，行事漸趨保守。',
    misconception:
      '常見誤解把衰直接等同倒楣或運勢差。其實衰只是力量由盛轉弱的自然過渡，並非凶象，重點在如何順勢調整步伐。',
    relatedSlugs: ['topic-32', 'post-20260710-05', 'topic-07'],
  },
  {
    slug: 'bing',
    term: '病',
    definition:
      '病是十二長生中力量持續衰退的階段，如同身體漸感不適，象徵行動力下降、容易多思多慮，需要休養與調整節奏。',
    misconception:
      '常見誤解以為八字帶病一定代表健康有問題。其實這裡的病是氣勢衰退的比喻，並非直接對應身體疾病本身。',
    relatedSlugs: ['topic-32', 'post-20260710-05', 'topic-27'],
  },
  {
    slug: 'si',
    term: '死',
    definition:
      '死是十二長生中力量降到最低的階段之一，如同氣息將盡，象徵外在動能幾乎停滯，內心反而容易變得沉靜而深思。',
    misconception:
      '常見誤解一看到死字就聯想到死亡或大凶。其實這只是十二長生循環中力量最弱的一站，是轉化前的必經階段。',
    relatedSlugs: ['topic-32', 'post-20260710-05', 'topic-37'],
  },
  {
    slug: 'mu',
    term: '墓',
    definition:
      '墓是十二長生中力量收藏入庫的階段，如同能量被封存起來，代表儲蓄、內斂與潛藏的實力，需要沖動才能開啟。',
    misconception:
      '常見誤解把十二長生的墓與財官庫的墓完全等同看待。其實兩者概念相關但用法不同，需分清脈絡才不會混淆。',
    relatedSlugs: ['topic-32', 'post-20260710-05', 'post-20260627-07'],
  },
  {
    slug: 'jue',
    term: '絕',
    definition:
      '絕是十二長生中力量最微弱、幾近斷絕的階段，象徵舊有的模式暫告終結，同時也是下一輪力量重新孕育的起點。',
    misconception:
      '常見誤解以為絕代表徹底沒有希望。其實絕只是循環中的轉折點，過了絕便進入胎的階段，力量會重新開始積聚。',
    relatedSlugs: ['topic-32', 'post-20260710-05', 'topic-13'],
  },
  {
    slug: 'tai',
    term: '胎',
    definition:
      '胎是十二長生中力量重新孕育的階段，如同受孕成形，象徵新機會正在醞釀，尚未成熟顯現，需要耐心等待發展。',
    misconception:
      '常見誤解以為胎已經代表新事物即將實現。其實胎只是孕育初期，力量仍在醞釀階段，急於求成反而容易落空。',
    relatedSlugs: ['topic-32', 'post-20260710-05', 'topic-06'],
  },
  {
    slug: 'yang',
    term: '養',
    definition:
      '養是十二長生的最後階段，如同胎兒在母體中被滋養成長，象徵準備充分、蓄勢待發，即將進入下一輪長生循環。',
    misconception:
      '常見誤解把養與長生混淆，以為兩者意義相同。其實養是長生前的最後準備期，重點在蓄養而非長生的萌發本身。',
    relatedSlugs: ['topic-32', 'post-20260710-05', 'topic-06'],
  },
  {
    slug: 'tianyiguiren',
    term: '天乙貴人',
    definition:
      '天乙貴人以日干起，是八字中最重要的貴人星，代表遇到困難時能獲得助力與轉機，象徵人緣佳、逢凶化吉的力量。',
    misconception:
      '常見誤解以為命帶天乙貴人就萬事順遂。其實貴人星只代表遇難有助力的傾向，仍需配合命局整體結構判斷力度。',
    relatedSlugs: ['topic-26', 'topic-09', 'topic-30'],
  },
  {
    slug: 'wenchang',
    term: '文昌',
    definition:
      '文昌以日干起，代表文書、學識與考試方面的助力，象徵思路清晰、表達能力佳，利於讀書進修與文字相關的工作。',
    misconception:
      '常見誤解以為命帶文昌就必然學業出眾。其實文昌只是利於文書學習的傾向星，仍需配合印星與格局清純與否綜合判斷。',
    relatedSlugs: ['topic-26', 'topic-10', 'topic-30'],
  },
  {
    slug: 'lushen',
    term: '祿神',
    definition:
      '祿神以日干起，代表日主本身的旺氣所在，象徵穩定的收入來源與自身根基，是判斷日主強弱時的重要參考指標。',
    misconception:
      '常見誤解把祿神與正財混為一談，以為兩者都直接代表財富。其實祿神代表的是日主根氣的旺弱，並非財星本身。',
    relatedSlugs: ['topic-23', 'topic-09', 'post-20260620-07'],
  },
  {
    slug: 'yangren',
    term: '羊刃',
    definition:
      '羊刃以日干起，代表帝旺之地的剛猛力量，象徵魄力與衝勁，但也帶有剛烈易衝動的風險，陰干取法歷來有門派分歧。',
    misconception:
      '常見誤解以為羊刃必主凶災血光。其實羊刃是否為患要看是否被合被制，命局結構清純時反而是成就大事的動力。',
    relatedSlugs: ['topic-23', 'topic-09', 'topic-21'],
  },
  {
    slug: 'jinyu',
    term: '金輿',
    definition:
      '金輿以日干起，象徵坐擁良好的物質條件與貴人扶持，多主生活安逸、婚姻或伴侶帶來實質助力，性質溫和吉祥。',
    misconception:
      '常見誤解把金輿神煞的力量誇大成大富大貴的保證。其實金輿只是錦上添花的吉星，仍需配合命局整體格局判斷。',
    relatedSlugs: ['topic-26', 'topic-30', 'topic-06'],
  },
  {
    slug: 'yima',
    term: '驛馬',
    definition:
      '驛馬以三合局起，日支為主，象徵變動、遷移與奔波，多主出差、搬遷或跨地域發展的機會，性質偏向動而非靜。',
    misconception:
      '常見誤解把驛馬一律視為不安穩的凶象。其實驛馬代表變動的傾向，配合喜用得宜時反而利於外地發展或拓展機會。',
    relatedSlugs: ['topic-16', 'topic-26', 'topic-30'],
  },
  {
    slug: 'taohua',
    term: '桃花／咸池',
    definition:
      '桃花又稱咸池，以三合局起，象徵異性緣、魅力與人際吸引力，力量本身中性，需配合命局結構判斷是良緣或爛桃花。',
    misconception:
      '常見誤解以為命帶桃花就一定感情複雜或不忠。其實桃花只是吸引力強的象徵，是否轉為困擾要看整體命局是否清純。',
    relatedSlugs: ['post-20260621-19', 'topic-16', 'topic-28'],
  },
  {
    slug: 'huagai',
    term: '華蓋',
    definition:
      '華蓋以三合局起，象徵孤高、藝術與宗教哲思的天賦，多主思想獨立、不隨波逐流，也常帶有孤獨感與內省的傾向。',
    misconception:
      '常見誤解以為華蓋必主孤僻或六親緣薄。其實華蓋更多指向精神層面的獨立與深度，是否孤獨仍要看命局整體配置。',
    relatedSlugs: ['topic-16', 'topic-30', 'topic-10'],
  },
  {
    slug: 'jiangxing',
    term: '將星',
    definition:
      '將星以三合局起，象徵領導力、統御能力與威嚴氣勢，多主具備管理才能，適合擔任團隊核心或負責統籌的角色。',
    misconception:
      '常見誤解把將星等同一定能當上高階主管。其實將星只代表統御的潛質，能否落地仍要看官殺與整體格局是否配合。',
    relatedSlugs: ['topic-16', 'topic-09', 'topic-30'],
  },
  {
    slug: 'jiesha',
    term: '劫煞',
    definition:
      '劫煞以三合局起，象徵意外破財、是非糾纏或被人拖累的風險，力量偏向消耗，提醒行事謹慎、避免涉入無謂糾紛。',
    misconception:
      '常見誤解把劫煞當成必然發生的災難星。其實劫煞只是風險提示，配合喜用與大運流年引動與否才決定實際影響力度。',
    relatedSlugs: ['topic-16', 'topic-30', 'topic-04'],
  },
  {
    slug: 'wangshen',
    term: '亡神',
    definition:
      '亡神以三合局起，象徵心思浮動、易生變化與計劃落空的傾向，多主容易三心兩意，做事需要更多耐性才能貫徹到底。',
    misconception:
      '常見誤解以為亡神代表喪亡或重大凶險。其實亡神更多指向心神不定、計劃易變的性質，並非字面上的死亡之意。',
    relatedSlugs: ['topic-16', 'topic-30', 'topic-04'],
  },
  {
    slug: 'kuigang',
    term: '魁罡',
    definition:
      '魁罡以日柱整柱判定，只有庚辰、庚戌、壬辰、戊戌四柱成立，象徵性格剛強果斷、聰明幹練，但也容易個性極端。',
    misconception:
      '常見誤解以為魁罡日主的人命運必然大起大落。其實魁罡代表性格特質剛烈鮮明，實際吉凶仍要配合命局整體結構判斷。',
    relatedSlugs: ['topic-30', 'topic-09', 'topic-10'],
  },
  {
    slug: 'hongyan',
    term: '紅艷',
    definition:
      '紅艷以日柱整柱判定，象徵天生的魅力與感情豐富的特質，多主異性緣佳、感情細膩，力量本身中性而非必然不忠。',
    misconception:
      '常見誤解把紅艷等同桃花劫或婚外情的標記。其實紅艷只是魅力與感情豐富的象徵，是否衍生困擾仍要看整體命局配置。',
    relatedSlugs: ['topic-30', 'post-20260621-19', 'topic-28'],
  },
  {
    slug: 'kongwang',
    term: '空亡／旬空',
    definition:
      '空亡又稱旬空，依日柱所在的六十甲子旬而定，代表該柱對應的兩個地支力量落空虛浮，需被沖動填實才會真正發揮。',
    misconception:
      '常見誤解以為空亡代表該六親或宮位徹底消失無用。其實空亡是力量暫時虛浮而非完全不存在，逢沖逢填仍可重新顯現。',
    relatedSlugs: ['topic-13', 'topic-31', 'topic-06'],
  },
  {
    slug: 'fuyin',
    term: '伏吟',
    definition:
      '伏吟是指大運、流年與原局，或大運與流年彼此出現相同的干支組合，象徵原地重複、進退兩難，帶有靜中帶動的性質。',
    misconception:
      '常見誤解以為伏吟必然代表凶事重演。其實伏吟只是原地重複的訊號，具體吉凶仍要配合該柱代表的六親與十神綜合判斷。',
    relatedSlugs: ['post-20260621-03', 'post-20260620-01', 'topic-30'],
  },
  {
    slug: 'shenzichen',
    term: '申子辰水局',
    definition:
      '申子辰是三合水局，旺神為子，代表命局中申子辰三字齊聚或半合成局時，五行力量匯聚成水，性質主智慧與流動。',
    misconception:
      '常見誤解以為只要見到申子辰其中兩字就等同完整水局。其實需視是否含旺神子及合化條件是否成立，力量強弱大有分別。',
    relatedSlugs: ['topic-16', 'post-20260621-14', 'post-20260621-15'],
  },
  {
    slug: 'haimaowei',
    term: '亥卯未木局',
    definition:
      '亥卯未是三合木局，旺神為卯，代表命局中亥卯未三字齊聚或半合成局時，五行力量匯聚成木，性質主生發與成長。',
    misconception:
      '常見誤解把亥卯未木局與巳酉丑金局搞混，誤判五行屬性。其實亥卯未旺神在卯，屬木局，判斷五行局前務必先核對旺神。',
    relatedSlugs: ['topic-16', 'post-20260621-06', 'post-20260621-07'],
  },
  {
    slug: 'yinwuxu',
    term: '寅午戌火局',
    definition:
      '寅午戌是三合火局，旺神為午，代表命局中寅午戌三字齊聚或半合成局時，五行力量匯聚成火，性質主熱情與爆發力。',
    misconception:
      '常見誤解以為三合火局一定代表脾氣暴躁。其實火局只是五行力量的聚合方向，具體性情仍要配合日主與整體格局判斷。',
    relatedSlugs: ['topic-16', 'post-20260621-08', 'post-20260621-09'],
  },
  {
    slug: 'siyouchou',
    term: '巳酉丑金局',
    definition:
      '巳酉丑是三合金局，旺神為酉，代表命局中巳酉丑三字齊聚或半合成局時，五行力量匯聚成金，性質主決斷與肅殺之氣。',
    misconception:
      '常見誤解把巳酉丑金局誤記成亥卯未木局的錯誤版本。其實兩者旺神與五行屬性完全不同，是本站曾修正的常見排盤錯誤。',
    relatedSlugs: ['topic-16', 'post-20260621-12', 'post-20260621-13'],
  },
  {
    slug: 'bazi',
    term: '八字',
    definition:
      '八字是出生的年月日時對應的天干地支組合，共四柱八個字，是東方命理學以天文節氣為座標、記錄人出生能量結構的系統。',
    misconception:
      '常見誤解以為八字是算命工具，可以預測未來發生的事。其實八字描述的是能量結構與模式，是幫助人認識自己的語言，而非命中注定的劇本。',
    relatedSlugs: ['post-20260806-01', 'post-20260621-04', 'post-20260620-07', 'topic-05', 'topic-03'],
  },
  {
    slug: 'wuxing',
    term: '五行',
    definition:
      '五行是木火土金水五種能量屬性，是八字命理的基本語言，萬事萬物皆可歸入其中，透過生剋制化關係解析命局的能量流動與結構。',
    misconception:
      '常見誤解以為五行代表具體元素，例如「金就是金屬」。其實五行是抽象的能量符號，代表一類性質與動向，取象要靈活，不可死記固定對應。',
    relatedSlugs: ['post-20260805-03', 'post-20260607-16', 'topic-03', 'topic-27'],
  },
  {
    slug: 'tiangan',
    term: '天干',
    definition:
      '天干是八字上排四個字，從年干至時干，代表能量的顯性層面：外在行為、與人交流的方式，以及事件的外在表現形式。',
    misconception:
      '常見誤解以為天干看見的就是真實。其實天干是顯象，地支藏干才是根，天干的力量強弱取決於有沒有地支通根，浮干不通根則力量大打折扣。',
    relatedSlugs: ['topic-01', 'topic-17', 'post-20260724-07', 'post-20260627-02'],
  },
  {
    slug: 'dizhi',
    term: '地支',
    definition:
      '地支是八字下排四個字，從年支至時支，各藏本氣與雜氣，代表隱性的能量根基，是天干力量的根，也是六親宮位的所在。',
    misconception:
      '常見誤解以為地支只是天干的從屬。其實地支藏干，一個地支可藏兩至三個天干，是能量的庫藏，也是命局中更深層、更根本的力量來源。',
    relatedSlugs: ['topic-02', 'topic-04', 'topic-19', 'topic-20'],
  },
  {
    slug: 'yueling',
    term: '月令',
    definition:
      '月令是八字中的月支，是四柱中力量最強的一個字，決定五行當令格局，影響命主的核心能量底色，是判斷格局、用神的首要參考。',
    misconception:
      '常見誤解以為月令只是出生月份的代表，與其他地支同等重要。其實月令處於當令位置，當令之神力量最強，是命局能量的核心座標，不可與其他地支等量齊觀。',
    relatedSlugs: ['topic-03', 'topic-10', 'topic-07', 'post-20260802-01'],
  },
  {
    slug: 'rizhi',
    term: '日支',
    definition:
      '日支是八字中日柱的地支，傳統稱「配偶宮」，坐下之物代表婚姻狀態與家庭格局，亦反映命主在親密關係中的能量互動模式。',
    misconception:
      '常見誤解以為日支代表的十神就等於配偶的性格。其實日支是「宮位」，反映婚姻的整體格局與能量，配偶特質要從配偶星與宮位合參論斷。',
    relatedSlugs: ['post-20260621-16', 'post-20260627-04', 'topic-05', 'topic-06'],
  },
  {
    slug: 'yinxing',
    term: '印星',
    definition:
      '印星是八字中「生我者」，代表滋養、保護與靠山，是命主內在底氣與安全感的來源，包括正印與偏印兩類，各有取象差異。',
    misconception:
      '常見誤解以為印星旺代表讀書好。其實印星取象遠不止學識，更主心理底氣、貴人庇蔭與靠山，缺印的人不是智力差，是常有孤軍奮戰感。',
    relatedSlugs: ['post-20260809-07', 'post-20260627-03', 'post-20260627-06', 'topic-03'],
  },
  {
    slug: 'caixing',
    term: '財星',
    definition:
      '財星是八字中「我剋者」，代表命主有能力掌控的資源、外在財富與慾望追求，包括正財與偏財兩類，前者主穩定，後者主流動。',
    misconception:
      '常見誤解以為財星多代表有錢。其實財星多而無力駕馭，或財星被劫，反而漏財難留；關鍵是命局能否掌控財星，而非財星數量多寡。',
    relatedSlugs: ['post-20260627-05', 'post-20260613-06', 'topic-08', 'topic-03'],
  },
  {
    slug: 'dizhiliuchong',
    term: '地支六沖',
    definition:
      '地支六沖是子午、丑未、寅申、卯酉、辰戌、巳亥六組對沖關係，代表兩股能量正面衝突，引發動盪、變動或力量釋放，是命局中變化的核心動力之一。',
    misconception:
      '常見誤解以為地支相沖一定是壞事。其實沖代表動，庫逢沖開財才能釋放；關鍵是命局需不需要這個動，動在有用的位置才是好沖。',
    relatedSlugs: ['topic-20', 'topic-04', 'topic-15', 'post-20260620-05'],
  },
  {
    slug: 'tianganhe',
    term: '天干合',
    definition:
      '天干合是甲己、乙庚、丙辛、丁壬、戊癸五組天干之間的合化關係，代表兩股力量相互牽絆或轉化，影響天干的流通與作用方向。',
    misconception:
      '常見誤解以為天干合就是好事，代表有緣有合。其實天干合可能是「貪合忘剋」，令原本應發揮功能的天干被牽絆，反而阻礙了命局正常運作。',
    relatedSlugs: ['topic-17', 'post-20260724-07', 'post-20260627-02', 'topic-03'],
  },
  {
    slug: 'dizhisanxing',
    term: '地支三刑',
    definition:
      '地支三刑包括寅巳申無恩之刑、丑戌未持勢之刑、子卯無禮之刑，代表內在的衝突、是非與壓力，主官非、健康問題或人際摩擦。',
    misconception:
      '常見誤解以為地支三刑都是凶象。其實刑代表切割與壓力，在特定格局下能激發潛能，「刑出」反而讓命局的能量得到釋放，非全凶。',
    relatedSlugs: ['topic-21', 'topic-04', 'topic-11', 'topic-20'],
  },
  {
    slug: 'dizhiliuhe',
    term: '地支六合',
    definition:
      '地支六合是子丑、寅亥、卯戌、辰酉、巳申、午未六組合化關係，代表兩種能量相互牽絆或穩定，合力強時影響地支的五行屬性與流動方向。',
    misconception:
      '常見誤解以為地支六合都代表和諧美滿。其實六合也主「合絆」，令地支被牽住無法正常流通，在命局中可能是停滯或被束縛的象。',
    relatedSlugs: ['topic-19', 'topic-04', 'post-20260621-05', 'topic-16'],
  },
  {
    slug: 'tonggentougan',
    term: '通根與透干',
    definition:
      '通根指天干的五行在地支藏干中找到同類支撐，令天干力量落實有根；透干指地支藏干的力量浮現於天干，使隱性力量顯化為可見的象。',
    misconception:
      '常見誤解以為天干有字就有力量。其實天干必須通根才有根基，浮干無根則力量虛浮，遇制即潰；透干則讓藏干的象顯現出來，影響人生事件的顯露時機。',
    relatedSlugs: ['topic-03', 'topic-24', 'post-20260620-07', 'topic-10'],
  },
  {
    slug: 'kaikurumu',
    term: '開庫與入墓',
    definition:
      '開庫指辰戌丑未四個庫墓地支被沖、刑、破、害等方式打開，令庫藏的五行力量釋放；入墓則指五行力量進入庫地支被收藏，代表能量的收斂或財官的延遲兌現。',
    misconception:
      '常見誤解以為庫逢沖一定大吉，財庫必然打開。其實開庫需命局有根有氣配合，庫若空虛則沖開也無財可出；入墓亦非全凶，是積蓄待時的象。',
    relatedSlugs: ['topic-15', 'post-20260627-05', 'topic-20', 'topic-11'],
  },
]

export function getGlossaryTerm(slug: string): GlossaryTerm | null {
  return GLOSSARY_TERMS.find((t) => t.slug === slug) ?? null
}

/**
 * Post-process article HTML: wrap the first occurrence of each glossary term
 * (outside existing <a> tags) with a /glossary/{slug} link.
 * Terms are sorted longest-first to avoid partial sub-term matches.
 */
export function linkGlossaryTerms(html: string): string {
  const terms = [...GLOSSARY_TERMS].sort((a, b) => b.term.length - a.term.length)
  const linked = new Set<string>()
  let inAnchor = 0

  return html.replace(/(<\/a[^>]*>|<a[^>]*>|<[^>]*>|[^<]+)/g, (match) => {
    if (/^<a[\s>]/i.test(match)) { inAnchor++; return match }
    if (/^<\/a/i.test(match)) { if (inAnchor > 0) inAnchor--; return match }
    if (match.startsWith('<')) return match
    if (inAnchor > 0) return match

    let text = match
    for (const { term, slug } of terms) {
      if (linked.has(slug)) continue
      const idx = text.indexOf(term)
      if (idx === -1) continue
      linked.add(slug)
      text =
        text.slice(0, idx) +
        `<a href="/glossary/${slug}" class="glossary-link">${term}</a>` +
        text.slice(idx + term.length)
      break // one replacement per text node keeps complexity low
    }
    return text
  })
}
