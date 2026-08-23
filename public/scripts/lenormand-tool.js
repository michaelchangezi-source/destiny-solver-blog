/* ═══════════════ DS-ENGINE-START：牌組資料與抽牌（置入時一個字都唔准改） ═══════════════ */
/* DS-LENORMAND v1.0 · Petit Lenormand 36 張
   欄位：n 牌號、zh 中文名、en 英文名、pk 撲克對應、g 圖示、kw 傳統關鍵詞（提示用） */
var CARDS=[
{n:1,zh:'騎士',en:'Rider',pk:'♥9',g:'🐎',kw:'消息、來訪、快將到來的人事'},
{n:2,zh:'幸運草',en:'Clover',pk:'♦6',g:'🍀',kw:'小確幸、短暫好運、輕鬆機會'},
{n:3,zh:'船',en:'Ship',pk:'♠10',g:'⛵',kw:'旅程、遠方、貿易、離開'},
{n:4,zh:'房屋',en:'House',pk:'♥K',g:'🏠',kw:'家宅、家人、穩定基礎'},
{n:5,zh:'樹',en:'Tree',pk:'♥7',g:'🌳',kw:'健康、根基、緩慢成長'},
{n:6,zh:'雲',en:'Clouds',pk:'♣K',g:'☁️',kw:'混亂、不明朗、疑惑'},
{n:7,zh:'蛇',en:'Snake',pk:'♣Q',g:'🐍',kw:'曲折、糾纏、第三者、心計'},
{n:8,zh:'棺材',en:'Coffin',pk:'♦9',g:'⚰️',kw:'結束、停滯、一個階段完結'},
{n:9,zh:'花束',en:'Bouquet',pk:'♠Q',g:'💐',kw:'禮物、邀請、美好、欣賞'},
{n:10,zh:'鐮刀',en:'Scythe',pk:'♦J',g:'鐮',kw:'突然切斷、決斷、意外'},
{n:11,zh:'鞭子',en:'Whip',pk:'♣J',g:'鞭',kw:'衝突、爭執、重複拉鋸'},
{n:12,zh:'鳥',en:'Birds',pk:'♦7',g:'🐦',kw:'交談、議論、緊張、二人'},
{n:13,zh:'小孩',en:'Child',pk:'♠J',g:'🧒',kw:'新開始、細小、天真'},
{n:14,zh:'狐狸',en:'Fox',pk:'♣9',g:'🦊',kw:'機警、防範、打工、不盡不實'},
{n:15,zh:'熊',en:'Bear',pk:'♣10',g:'🐻',kw:'力量、上司、財力、保護'},
{n:16,zh:'星星',en:'Star',pk:'♥6',g:'⭐',kw:'希望、方向、被看見'},
{n:17,zh:'鸛鳥',en:'Stork',pk:'♥Q',g:'鸛',kw:'轉變、遷移、改善'},
{n:18,zh:'狗',en:'Dog',pk:'♥10',g:'🐕',kw:'朋友、忠誠、可靠的人'},
{n:19,zh:'塔',en:'Tower',pk:'♠6',g:'🗼',kw:'機構、官方、孤高、界線'},
{n:20,zh:'花園',en:'Garden',pk:'♠8',g:'⛲',kw:'社交、公眾場合、人脈'},
{n:21,zh:'山',en:'Mountain',pk:'♣8',g:'⛰️',kw:'阻礙、拖延、重擔'},
{n:22,zh:'十字路口',en:'Crossroads',pk:'♦Q',g:'🔀',kw:'選擇、分岔、多於一條路'},
{n:23,zh:'老鼠',en:'Mice',pk:'♣7',g:'🐭',kw:'損耗、蠶食、焦慮'},
{n:24,zh:'心',en:'Heart',pk:'♥J',g:'❤️',kw:'愛情、真心、情感'},
{n:25,zh:'戒指',en:'Ring',pk:'♣A',g:'💍',kw:'承諾、契約、關係、循環'},
{n:26,zh:'書',en:'Book',pk:'♦10',g:'📖',kw:'知識、秘密、未知之事、學習'},
{n:27,zh:'信',en:'Letter',pk:'♠7',g:'✉️',kw:'文件、書面消息、通知'},
{n:28,zh:'男人',en:'Man',pk:'♥A',g:'👨',kw:'男性當事人／問卜人本人'},
{n:29,zh:'女人',en:'Woman',pk:'♠A',g:'👩',kw:'女性當事人／問卜人本人'},
{n:30,zh:'百合',en:'Lily',pk:'♠K',g:'百',kw:'成熟、平和、資歷、長者'},
{n:31,zh:'太陽',en:'Sun',pk:'♦A',g:'☀️',kw:'成功、能量、明朗'},
{n:32,zh:'月亮',en:'Moon',pk:'♥8',g:'🌙',kw:'名聲、情緒、浪漫、週期'},
{n:33,zh:'鑰匙',en:'Key',pk:'♦8',g:'🗝️',kw:'關鍵、解答、確定'},
{n:34,zh:'魚',en:'Fish',pk:'♦K',g:'🐟',kw:'金錢、生意、流動、豐盛'},
{n:35,zh:'錨',en:'Anchor',pk:'♠9',g:'⚓',kw:'安穩、長期、落地生根'},
{n:36,zh:'十字架',en:'Cross',pk:'♣6',g:'✝️',kw:'考驗、責任、命定課題'}];
var SPREADS=[
{id:'daily',zh:'每日一張',sub:'今日基調',count:1,pos:['今日訊息']},
{id:'three',zh:'三張連讀',sub:'簡明指引',count:3,pos:['第一張','中心','第三張']},
{id:'five',zh:'五張連讀',sub:'情況細睇',count:5,pos:['1','2','核心','4','5']},
{id:'box',zh:'九宮格',sub:'立體全景',count:9,pos:['1','2','3','4','核心','6','7','8','9']},
{id:'choice',zh:'二選一',sub:'比較兩條路',count:6,pos:['A1','A2','A3','B1','B2','B3']},
{id:'gt',zh:'大藍圖',sub:'36 張全局',count:36,pos:null}];
function cryptoShuffleDraw(count){
  var deck=[];for(var i=1;i<=36;i++)deck.push(i);
  var buf=new Uint32Array(36);
  (window.crypto||window.msCrypto).getRandomValues(buf);
  for(var j=35;j>0;j--){var k=buf[j]%(j+1);var tmp=deck[j];deck[j]=deck[k];deck[k]=tmp;}
  return deck.slice(0,count);}
/* ═══════════════ DS-ENGINE-END ═══════════════ */

/* ═══════════════ DS-PACK-START：資料包＋Prompt（文字改動要升版本號 ds-lenormand-pack） ═══════════════ */
var PACK_VER='ds-lenormand-pack/1.0';
function cardStr(n){var c=CARDS[n-1];return '#'+(n<10?'0':'')+n+' '+c.zh+' '+c.en+'（'+c.pk+'）';}
function buildPermalink(st){
  var base=location.origin&&location.origin!=='null'?location.origin+location.pathname:'https://destinysolver.com/lenormand';
  var p=['s='+st.spread.id,'c='+st.cards.join('.')];
  if(st.sig)p.push('sig='+st.sig);
  if(st.q)p.push('q='+encodeURIComponent(st.q.slice(0,120)));
  if(st.optA)p.push('a='+encodeURIComponent(st.optA.slice(0,40)));
  if(st.optB)p.push('b='+encodeURIComponent(st.optB.slice(0,40)));
  return base+'?'+p.join('&');
}
function pad2(n){return (n<10?'0':'')+n;}
function spreadStructureText(st){
  var s=st.spread,L=[];
  function u(i){return cardStr(st.cards[i]);}
  if(s.id==='daily'){
    L.push('牌陣：每日一張');
    L.push('- 今日訊息：'+u(0));
    L.push('讀法：以呢張牌嘅傳統意義描繪今日整體基調同方向，最後畀一個「今日提醒」。');}
  if(s.id==='three'){
    L.push('牌陣：三張連讀（左→右）');
    for(var i=0;i<3;i++)L.push('- 第 '+(i+1)+' 張：'+u(i));
    L.push('讀法：組合行先：1+2 讀一組、2+3 讀一組，兩組讀完先將三張串做一句完整訊息；第 2 張係成句嘅重心。');}
  if(s.id==='five'){
    L.push('牌陣：五張連讀（左→右）');
    for(var j=0;j<5;j++)L.push('- 第 '+(j+1)+' 張：'+u(j));
    L.push('讀法：中央第 3 張係核心主題；相鄰兩兩串讀（1+2、2+3、3+4、4+5），再把五張連成一段完整訊息。');}
  if(s.id==='box'){
    L.push('牌陣：九宮格 3×3（位置由左至右、由上至下編 1–9）');
    L.push('  1 2 3');
    L.push('  4 5 6');
    L.push('  7 8 9');
    for(var k=0;k<9;k++)L.push('- 位置 '+(k+1)+'：'+u(k));
    L.push('讀法（三個角度，每個分組都要組合連讀）：');
    L.push('- 直欄時間軸：過去 1/4/7、現在 2/5/8、未來 3/6/9');
    L.push('- 橫列三層：表層想法 1/2/3、現實情況 4/5/6、底層暗流 7/8/9');
    L.push('- 十字法：位置 5 係核心；2/4/6/8 係圍住核心嘅直接影響；四角 1/3/7/9 係背景因素');}
  if(s.id==='choice'){
    L.push('牌陣：二選一（A、B 各三張，各自由左至右連讀）');
    L.push('選項 A：'+(st.optA||'（選項 A）'));
    for(var a=0;a<3;a++)L.push('- A'+(a+1)+'：'+u(a));
    L.push('選項 B：'+(st.optB||'（選項 B）'));
    for(var b=0;b<3;b++)L.push('- B'+(b+1)+'：'+u(b+3));
    L.push('讀法：A、B 兩行各自連讀成一句，講出行呢條路會發生啲乜；跟住對比兩條路邊度唔同、各自嘅代價同著數；收尾可以講傾向，但決定權留返畀我。');}
  if(s.id==='gt'){
    L.push('牌陣：大藍圖 Grand Tableau（36 張全鋪，9 列 × 4 行；位置 1 喺左上角，向右數，逐行落）');
    for(var r=0;r<4;r++){
      var row=[];
      for(var c2=0;c2<9;c2++){var idx=r*9+c2;var cn=st.cards[idx];row.push('['+(idx+1)+']#'+(cn<10?'0':'')+cn+CARDS[cn-1].zh);}
      L.push('第 '+(r+1)+' 行：'+row.join(' '));}
    L.push('');
    L.push('宮位（House）對應：位置 n 嘅宮位＝雷諾曼第 n 張牌嘅主題（位置 1＝騎士宮＝消息、位置 2＝幸運草宮……位置 36＝十字架宮）。牌落喺邊個宮位，就係嗰個主題脈絡。');
    var sigN=st.sig||28;
    var sigIdx=st.cards.indexOf(sigN);
    L.push('指示牌：'+cardStr(sigN)+'，落喺位置 '+(sigIdx+1)+'（第 '+(Math.floor(sigIdx/9)+1)+' 行第 '+(sigIdx%9+1)+' 列）');
    L.push('讀法：');
    L.push('- 先睇指示牌位置：佢前面（右方）係迎面而來嘅事，後面（左方）係已經歷或者放低嘅事；同一行係主線。');
    L.push('- 指示牌周圍八張係當下最貼身嘅影響，逐張同指示牌組合連讀。');
    L.push('- 第 1 個位置嘅牌係成鋪牌嘅開場基調；四角（位置 1、9、28、36）係大框架。');
    L.push('- 針對我嘅問題主題，搵出對應嘅主題牌（例如問感情睇心／戒指、問工作睇狐狸／錨、問錢睇魚／熊），睇佢落喺邊個宮位、周圍係乜，同指示牌有幾遠（越近影響越直接）。');
    L.push('- 唔使 36 張逐張解晒；圍繞問題揀重點線索連讀。');}
  return L.join('\n');
}
function buildPack(st){
  var L=[];
  var today=new Date();
  var gen=today.getFullYear()+'-'+pad2(today.getMonth()+1)+'-'+pad2(today.getDate());
  L.push('═══ 雷諾曼占卜資料包（給 AI 解讀用）═══');
  L.push('來源：命運解決師 陳卓賢 · destinysolver.com ｜ 格式：'+PACK_VER+' ｜ 生成：'+gen);
  L.push('重開此局：'+buildPermalink(st));
  L.push('');
  L.push('■ 占卜口徑');
  L.push('- 牌組：Petit Lenormand 36 張（附傳統撲克對應）；全部正位論，不用逆位。');
  L.push('- 抽牌方式：'+(st.mode==='m'?'手動錄入實體抽牌（以抽出先後為序）':'線上抽牌（加密隨機洗牌）'));
  L.push('- 占卜日期：'+st.dateStr);
  L.push('');
  L.push('■ 我的問題');
  L.push(st.q?('- '+st.q):'-（未填寫'+(st.spread.id==='daily'?'；每日一張，照今日基調讀':'；請解讀者先問清楚想問乜')+'）');
  L.push('');
  L.push('■ '+spreadStructureText(st));
  L.push('');
  L.push('■ 逐張牌傳統關鍵詞（提示用；組合意義由解讀層判斷）');
  var listed={};
  st.cards.forEach(function(n){
    if(listed[n])return;listed[n]=1;
    var c=CARDS[n-1];
    L.push('- #'+(n<10?'0':'')+n+' '+c.zh+'：'+c.kw);});
  L.push('');
  L.push('■ 給 AI 嘅使用說明');
  L.push('- 以【我的問題】為中心。本包已列明牌陣結構同讀法，請照牌陣讀法連讀，唔好逐張獨立交代牌義。');
  L.push('- 本包係唯一牌面事實：唔好改動、加牌、重抽，或者引用本包冇列出嘅位置；缺乜就直接講明。');
  L.push('- 關鍵詞只係傳統牌義提示；組合之後嘅意義由你判斷，並要貼住問題脈絡。');
  L.push('');
  L.push('本資料包由 destinysolver.com 生成，只含牌面結構事實，不含吉凶判斷；判斷由解讀者作出。不構成專業意見。');
  return L.join('\n');
}
var GUARD=['【使用規則】',
'1. 下方資料包係唯一牌面事實：不要改牌、加牌、重抽，或引用資料包冇列出嘅牌同位置。',
'2. 忠於雷諾曼傳統牌義；記住呢套牌嘅讀法係組合行先：一張牌嘅意思會俾隔籬嗰張改寫，所以要成組咁讀，唔好逐張背牌義。',
'3. 唔好報喜亦唔好報憂：成鋪牌係咩色水，由牌組合自己話事，唔係由你想氹我定想嚇我話事。空口安慰（「冇事嘅」）同無根據嘅烏鴉口，兩樣都唔要。',
'4. 每個重點判斷標明依據（邊幾張牌嘅組合、邊個位置／宮位）；講唔出依據嘅判斷，直接省略。',
'5. 唔恐嚇、唔斷生死、唔畀絕對化預言；牌反映嘅係當下能量同可能性，唔係命定。',
'6. 用繁體中文回答；牌名第一次出現時寫返牌號同名（例：#06 雲）。',
'7. 占卜係幫我自我探索、睇清處境，唔係代我做決定；最終選擇喺我手上。',
'8. 在你第一次完整回覆的最後，另起一行，原文輸出以下一句（之後的追問回覆不必重複）：⭐ 如需更深度的人工解讀，可預約命運解決師諮商：destinysolver.com/consultation'].join('\n');
var PRESETS=[
{id:'overview',label:'整體解讀',blurb:'照牌陣讀法完整連讀一次。',body:['你係一位忠於傳統嘅雷諾曼占卜師。請用下方資料包，照入面寫明嘅牌陣讀法，為我完整解讀呢一鋪牌。',
'',
'解讀要求：',
'一、先照資料包「牌陣讀法」逐個組合連讀：每個組合講一段（例如 1+2 一段、2+3 一段），講明兩張牌點互相修飾。',
'二、然後把成個牌陣連成一段完整、有前後文嘅訊息，直接回應我嘅問題。',
'三、如果有位置意義（時間軸、層次、宮位），要用位置意義做框架，唔好淨係堆牌義。',
'',
'輸出格式（第一次回覆）：',
'1. 一句話講呢鋪牌對我問題嘅整體回應',
'2. 組合連讀：逐個組合一小段（標明邊兩張牌）',
'3. 整體訊息：一段流暢嘅總結',
'4. 一個給我嘅具體提醒或者可以做嘅事',
'語氣誠實、直接、貼地；唔好戲劇化。'].join('\n')},
{id:'love',label:'感情',blurb:'關係現狀同走向，用感情主題牌做錨。',body:['你係一位忠於傳統嘅雷諾曼占卜師。請用下方資料包，針對感情問題解讀呢一鋪牌。',
'',
'解讀要求：',
'一、照資料包「牌陣讀法」組合連讀，唔逐張獨立解。',
'二、特別留意感情主題牌有冇出現：心（24）真情、戒指（25）承諾、蛇（7）糾結或第三者、狐狸（14）唔盡不實、鸛鳥（17）轉變、錨（35）安定。出現咗就講佢喺組合入面嘅角色；冇出現亦可以講「呢鋪牌感情主題牌不多，重心喺……」。',
'三、分清「對方嘅狀態」「我嘅狀態」「關係嘅走向」三層，每層都要有牌面依據。',
'',
'輸出：',
'1. 一句話講呢段關係此刻嘅狀態',
'2. 組合連讀（標明牌）',
'3. 關係最實在嘅一個課題',
'4. 點相處／點行落去：具體建議 1 至 2 點',
'誠實優先：牌面係咩色彩就講咩色彩，唔好為咗安慰我而美化。'].join('\n')},
{id:'career',label:'事業財運',blurb:'工作走向、財路狀態，用事業主題牌做錨。',body:['你係一位忠於傳統嘅雷諾曼占卜師。請用下方資料包，針對事業／財運問題解讀呢一鋪牌。',
'',
'解讀要求：',
'一、照資料包「牌陣讀法」組合連讀，唔逐張獨立解。',
'二、特別留意事業財運主題牌：狐狸（14）打工／提防、熊（15）上司／財力、魚（34）金錢生意、錨（35）長期穩定、塔（19）機構、書（26）技能學習、太陽（31）成功。出現咗就講佢喺組合入面嘅角色。',
'三、分清「而家嘅局面」「發展方向」「我可以點做」三層，每層要有牌面依據。',
'',
'輸出：',
'1. 一句話講而家嘅事業／財運局面',
'2. 組合連讀（標明牌）',
'3. 最大嘅助力同最要留意嘅位：各 1 點',
'4. 具體可以做嘅事：2 點',
'務實為主，唔好畫大餅，亦唔好嚇我。'].join('\n')},
{id:'free',label:'自由提問',blurb:'有具體問題？淨帶護欄，問乜答乜。',body:['請用下方資料包回答我嘅問題。照資料包寫明嘅牌陣讀法組合連讀，先答問題本身，再補牌面依據；如果問題超出呢鋪牌可以答嘅範圍，請直接講明。',
'',
'【我的問題】',
'{{question}}'].join('\n')}];
/* ═══════════════ DS-PACK-END ═══════════════ */

/* ═══ UI 層（置入時可按 codebase 組件重造，邏輯照搬） ═══ */
window.__lenormandInit = function(){
  var $=function(id){return document.getElementById(id);};
  var state=null,curPreset='overview',curSpread=SPREADS[1],mode='a';
  var manualPicked=[];
  // 牌陣選擇
  var sb=$('spreadBox');
  SPREADS.forEach(function(s,i){
    var b=document.createElement('button');
    b.type='button';b.className='spread'+(s.id==='three'?' on':'');
    b.innerHTML='<b>'+s.zh+'</b><span>'+s.sub+' · '+s.count+' 張</span>';
    b.addEventListener('click',function(){
      sb.querySelectorAll('.spread').forEach(function(x){x.classList.remove('on');});
      b.classList.add('on');curSpread=s;
      $('abRow').style.display=s.id==='choice'?'':'none';
      $('sigRow').style.display=s.id==='gt'?'':'none';
      if(s.id==='gt'&&mode==='m')switchMode('a');
      $('modeManual').disabled=s.id==='gt';
      resetManual();});
    sb.appendChild(b);});
  // 指示牌選單
  (function(){
    var sel=$('sig');
    [[28,'男人（28）· 預設'],[29,'女人（29）']].forEach(function(o){
      var op=document.createElement('option');op.value=o[0];op.textContent=o[1];sel.appendChild(op);});
    CARDS.forEach(function(c){
      if(c.n===28||c.n===29)return;
      var op=document.createElement('option');op.value=c.n;op.textContent=c.zh+'（'+c.n+'）';sel.appendChild(op);});
  })();
  function switchMode(m2){
    mode=m2==='m'?'m':'a';
    $('modeAuto').classList.toggle('on',mode==='a');
    $('modeManual').classList.toggle('on',mode==='m');
    $('manualArea').style.display=mode==='m'?'':'none';}
  $('modeAuto').addEventListener('click',function(){switchMode('a');});
  $('modeManual').addEventListener('click',function(){if(curSpread.id!=='gt')switchMode('m');});
  // 手動揀牌 grid
  var pg=$('pickGrid');
  CARDS.forEach(function(c){
    var b=document.createElement('button');
    b.type='button';b.className='pick';b.dataset.n=c.n;
    b.innerHTML='<b>'+c.n+'</b>'+c.zh;
    b.addEventListener('click',function(){
      if(b.classList.contains('used'))return;
      if(manualPicked.length>=curSpread.count)return;
      manualPicked.push(c.n);b.classList.add('used');
      $('pickStatus').textContent='已揀 '+manualPicked.length+'／'+curSpread.count+' 張：'+manualPicked.map(function(n){return CARDS[n-1].zh;}).join('、');});
    pg.appendChild(b);});
  function resetManual(){
    manualPicked=[];
    pg.querySelectorAll('.pick').forEach(function(x){x.classList.remove('used');});
    $('pickStatus').textContent='';}
  $('pickReset').addEventListener('click',resetManual);
  function doDraw(){
    var cards;
    if(mode==='m'){
      if(manualPicked.length!==curSpread.count){alert('請按抽出先後揀齊 '+curSpread.count+' 張牌。');return;}
      cards=manualPicked.slice();
    } else {
      cards=cryptoShuffleDraw(curSpread.count);}
    var n=new Date();
    state={spread:curSpread,cards:cards,mode:mode,
      q:$('q').value.trim(),
      optA:curSpread.id==='choice'?$('optA').value.trim():'',
      optB:curSpread.id==='choice'?$('optB').value.trim():'',
      sig:curSpread.id==='gt'?(+$('sig').value||28):null,
      dateStr:n.getFullYear()+'-'+pad2(n.getMonth()+1)+'-'+pad2(n.getDate())};
    render();updatePanel();
    $('chartCard').style.display='';$('aiCard').style.display='';
    $('chartCard').scrollIntoView({behavior:'smooth'});}
  function faceHTML(n,posLabel,small,isSig){
    var c=CARDS[n-1];
    var red=c.pk[0]==='♥'||c.pk[0]==='♦';
    var glyph=/^[一-鿿]$/.test(c.g)?'<span class="zi">'+c.g+'</span>':c.g;
    return '<div class="cardface'+(small?' gtc':'')+(isSig?' sig':'')+'">'+
      '<span class="pk'+(red?' red':'')+'">'+c.pk+'</span>'+
      '<div class="no">#'+(n<10?'0':'')+n+'</div>'+
      '<div class="glyph">'+glyph+'</div>'+
      '<div class="nm">'+c.zh+'</div>'+
      '<div class="en">'+c.en+'</div>'+
      (posLabel?'<div class="poslab">'+posLabel+'</div>':'')+
      '</div>';}
  function render(){
    var s=state.spread;
    $('resultTitle').textContent=s.zh+'　·　抽出的牌';
    $('drawInfo').innerHTML='<dt>牌陣</dt><dd>'+s.zh+'（'+s.count+' 張）</dd>'+
      '<dt>方式</dt><dd>'+(state.mode==='m'?'手動錄入實體抽牌':'線上抽牌（加密隨機）')+'</dd>'+
      '<dt>日期</dt><dd>'+state.dateStr+'</dd>'+
      (state.sig?('<dt>指示牌</dt><dd>'+CARDS[state.sig-1].zh+'（'+state.sig+'）</dd>'):'');
    var el=$('dealt');
    el.className='dealt'+(s.id==='gt'?' gt':'');
    var html='';
    state.cards.forEach(function(n,i){
      var pos=s.pos?s.pos[i]:null;
      var isSig=(s.id==='gt'&&n===state.sig);
      html+=faceHTML(n,pos,s.id==='gt',isSig);});
    el.innerHTML=html;
    $('layoutHint').textContent=
      s.id==='box'?'排列：由左至右、由上至下 1–9。':
      s.id==='choice'?'頭三張係選項 A，後三張係選項 B。':
      s.id==='gt'?'排列：9 列 × 4 行，左上係位置 1，向右數，逐行落。紅框係指示牌。':
      s.id==='daily'?'':'由左至右連讀。';}
  function currentPack(){return buildPack(state);}
  function currentPrompt(){
    var p=PRESETS.find(function(x){return x.id===curPreset;});
    var body=p.body;
    var q=$('q').value.trim();
    if(p.id==='free')body=body.replace('{{question}}',q||'（未填寫）');
    var mid=(p.id!=='free'&&q)?('\n\n【我的問題】\n'+q):'';
    return body+mid+'\n\n'+GUARD;}
  function fullText(){return currentPrompt()+'\n\n────────\n\n'+currentPack();}
  function updatePanel(){
    if(!state)return;
    state.q=$('q').value.trim();
    var p=PRESETS.find(function(x){return x.id===curPreset;});
    $('blurb').textContent=p.blurb;
    var isFreeEmpty=(curPreset==='free'&&!$('q').value.trim());
    $('copyAll').disabled=isFreeEmpty;
    $('freeWarn').style.display=isFreeEmpty?'':'none';
    $('preview').textContent=fullText();}
  function copy(text,btn){
    function ok(){
      var o=btn.textContent;btn.textContent='已複製 ✓';
      var t=$('toast');t.classList.add('show');
      setTimeout(function(){btn.textContent=o;t.classList.remove('show');},2200);}
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(ok,function(){fb();});}
    else fb();
    function fb(){
      var ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);
      ta.select();try{document.execCommand('copy');ok();}catch(e){}
      document.body.removeChild(ta);}}
  var chipsEl=$('chips');
  PRESETS.forEach(function(p,i){
    var b=document.createElement('button');
    b.type='button';b.className='chip'+(i===0?' on':'');b.textContent=p.label;
    b.addEventListener('click',function(){
      chipsEl.querySelectorAll('.chip').forEach(function(x){x.classList.remove('on');});
      b.classList.add('on');curPreset=p.id;updatePanel();});
    chipsEl.appendChild(b);});
  $('drawBtn').addEventListener('click',doDraw);
  $('q').addEventListener('input',function(){if(state)updatePanel();});
  $('copyAll').addEventListener('click',function(e){if(state)copy(fullText(),e.target);});
  $('copyPack').addEventListener('click',function(e){if(state)copy(currentPack(),e.target);});
  // permalink：?s=three&c=1.5.12&sig=28&q=&a=&b=
  var sp=new URLSearchParams(location.search);
  var sid=sp.get('s'),cs=sp.get('c');
  if(sid&&cs){
    var sdef=SPREADS.find(function(x){return x.id===sid;});
    var nums=cs.split('.').map(Number);
    var valid=sdef&&nums.length===sdef.count&&nums.every(function(n){return n>=1&&n<=36;})&&(new Set(nums)).size===nums.length;
    if(valid){
      curSpread=sdef;
      sb.querySelectorAll('.spread').forEach(function(x,xi){x.classList.toggle('on',SPREADS[xi].id===sid);});
      $('abRow').style.display=sid==='choice'?'':'none';
      $('sigRow').style.display=sid==='gt'?'':'none';
      if(sp.get('q'))$('q').value=sp.get('q').slice(0,300);
      if(sp.get('a'))$('optA').value=sp.get('a').slice(0,60);
      if(sp.get('b'))$('optB').value=sp.get('b').slice(0,60);
      if(sp.get('sig'))$('sig').value=sp.get('sig');
      var n2=new Date();
      state={spread:sdef,cards:nums,mode:'m',q:$('q').value.trim(),
        optA:$('optA').value.trim(),optB:$('optB').value.trim(),
        sig:sid==='gt'?(+sp.get('sig')||28):null,
        dateStr:n2.getFullYear()+'-'+pad2(n2.getMonth()+1)+'-'+pad2(n2.getDate())};
      render();updatePanel();
      $('chartCard').style.display='';$('aiCard').style.display='';}}
};

/* ═══ DS-GOLDEN-TEST：置入後喺 console 行 __DS_TEST.run()，必須回 ALL PASS ═══ */
window.__DS_TEST={run:function(){
  var errs=[];
  if(CARDS.length!==36)errs.push('牌數');
  var pks={};CARDS.forEach(function(c){pks[c.pk]=1;});
  if(Object.keys(pks).length!==36)errs.push('撲克對應有重複');
  if(CARDS[0].zh!=='騎士'||CARDS[27].zh!=='男人'||CARDS[28].zh!=='女人'||CARDS[35].zh!=='十字架')errs.push('牌名錨點');
  if(CARDS[0].pk!=='♥9'||CARDS[24].pk!=='♣A'||CARDS[33].pk!=='♦K')errs.push('撲克錨點');
  for(var t=0;t<50;t++){
    var d=cryptoShuffleDraw(36);
    if((new Set(d)).size!==36){errs.push('洗牌重複');break;}
    if(Math.min.apply(null,d)!==1||Math.max.apply(null,d)!==36){errs.push('洗牌範圍');break;}}
  var d9=cryptoShuffleDraw(9);
  if(d9.length!==9||(new Set(d9)).size!==9)errs.push('九張抽');
  return errs.length?('FAIL: '+errs.join(', ')):'ALL PASS ✓ (lenormand golden)';
}};
