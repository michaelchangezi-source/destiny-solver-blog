/* ═══════════════ DS-ENGINE-START：牌組資料與抽牌（置入時一個字都唔准改） ═══════════════ */
/* DS-TAROT v1.0 · 韋特 78 張
   id 0–21 大阿爾克那；22–35 權杖 A–K；36–49 聖杯；50–63 寶劍；64–77 錢幣
   kw＝正位傳統關鍵詞；kr＝逆位提示（大牌先有；小牌逆位按「受阻/內化/延遲/過度」口徑讀） */
var MAJORS=[
{zh:'愚者',en:'The Fool',g:'🃏',kw:'新開始、冒險、自由',kr:'魯莽、迷失方向'},
{zh:'魔術師',en:'The Magician',g:'🎩',kw:'資源到位、行動力、創造',kr:'空談、操控'},
{zh:'女祭司',en:'The High Priestess',g:'🌙',kw:'直覺、內省、未顯之事',kr:'忽略直覺、秘而不宣'},
{zh:'皇后',en:'The Empress',g:'👑',kw:'豐盛、滋養、成果',kr:'過度呵護、停滯'},
{zh:'皇帝',en:'The Emperor',g:'🏛️',kw:'秩序、掌控、承擔',kr:'僵化、獨斷'},
{zh:'教皇',en:'The Hierophant',g:'📿',kw:'傳統、指導、制度',kr:'教條、陽奉陰違'},
{zh:'戀人',en:'The Lovers',g:'💞',kw:'結合、選擇、價值一致',kr:'失衡、搖擺'},
{zh:'戰車',en:'The Chariot',g:'🏇',kw:'意志、推進、勝利',kr:'失控、方向不明'},
{zh:'力量',en:'Strength',g:'🦁',kw:'柔韌、耐性、內在力量',kr:'自我懷疑、硬碰'},
{zh:'隱士',en:'The Hermit',g:'🏮',kw:'沉澱、求索、獨處',kr:'孤立、逃避'},
{zh:'命運之輪',en:'Wheel of Fortune',g:'☸️',kw:'轉機、週期、時勢',kr:'抗拒改變、時運未至'},
{zh:'正義',en:'Justice',g:'⚖️',kw:'公平、因果、權衡',kr:'失衡、迴避責任'},
{zh:'倒吊人',en:'The Hanged Man',g:'🙃',kw:'換位、等待、暫停',kr:'白等、犧牲無果'},
{zh:'死神',en:'Death',g:'🦋',kw:'結束與蛻變、斷捨',kr:'拖住唔放、過渡期'},
{zh:'節制',en:'Temperance',g:'🏺',kw:'調和、節奏、整合',kr:'極端、失調'},
{zh:'惡魔',en:'The Devil',g:'⛓️',kw:'慾望、綑綁、執迷',kr:'掙脫、直視陰影'},
{zh:'高塔',en:'The Tower',g:'🗼',kw:'突變、瓦解、真相爆破',kr:'餘震、僥倖拖延'},
{zh:'星星',en:'The Star',g:'🌟',kw:'希望、療癒、遠景',kr:'灰心、信心動搖'},
{zh:'月亮',en:'The Moon',g:'🌕',kw:'不安、朦朧、潛意識',kr:'迷霧漸散、虛驚'},
{zh:'太陽',en:'The Sun',g:'☀️',kw:'成功、明朗、活力',kr:'遲來的成功、過度樂觀'},
{zh:'審判',en:'Judgement',g:'📯',kw:'覺醒、召喚、總結',kr:'自我批判、錯過召喚'},
{zh:'世界',en:'The World',g:'🌍',kw:'完成、圓滿、里程碑',kr:'未竟、收尾拖延'}];
var SUITS=[
{zh:'權杖',en:'Wands',g:'🪄',elem:'火（行動、熱情）'},
{zh:'聖杯',en:'Cups',g:'🏆',elem:'水（情感、關係）'},
{zh:'寶劍',en:'Swords',g:'🗡️',elem:'風（思維、溝通）'},
{zh:'錢幣',en:'Pentacles',g:'🪙',elem:'土（物質、實務）'}];
var RANK_ZH=['一','二','三','四','五','六','七','八','九','十','侍從','騎士','王后','國王'];
var RANK_EN=['Ace','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Page','Knight','Queen','King'];
var MINOR_KW={
'權杖':['新火苗、機會','規劃、抉擇視野','初見成果、遠望','穩定據點、慶祝','競爭、磨擦','勝利、被肯定','守位、以一敵眾','快速進展、消息','帶傷堅持、戒備','重擔、一腳踢','熱情學徒、探索訊息','衝勁、說走就走','自信、感染力','領導、開創'],
'聖杯':['情感萌芽、直覺','相互吸引、結盟','慶祝、友誼','意興闌珊、錯過眼前','失落、聚焦已失','舊情、懷念','幻想多、未落實','放低、離開追尋','願望滿足、自得','情感圓滿、歸宿','天真示好、情感訊息','浪漫提案、追求','同理、情感智慧','情緒成熟、包容'],
'寶劍':['清晰、真相、決斷','僵局、拒絕面對','傷心、刺痛真相','休整、暫停','慘勝、內耗','過渡、離開風浪','策略、暗中行事','自困、受限信念','焦慮、失眠','谷底、一段結束','打探、警覺','直衝、辯才','明斷、界線','理性權威、原則'],
'錢幣':['實在機會、種子','平衡多工、周轉','協作、手藝被認可','守財、控制','匱乏感、困頓','給予接受、資源流動','耕耘待收、評估','磨練技能、專注','自足、優雅成果','家業、長期財富','學習實務、新技能','穩打穩紮、可靠','務實照顧、資源管理','財務穩固、事業有成']};
var CARDS=[];
(function(){
  MAJORS.forEach(function(m,i){
    CARDS.push({id:i,zh:m.zh,en:m.en,g:m.g,label:'大阿爾克那 '+i,kw:m.kw,kr:m.kr,major:true});});
  SUITS.forEach(function(s,si){
    for(var r=0;r<14;r++){
      CARDS.push({id:22+si*14+r,zh:s.zh+RANK_ZH[r],en:RANK_EN[r]+' of '+s.en,g:s.g,label:s.zh+'（'+s.elem+'）',kw:MINOR_KW[s.zh][r],kr:null,major:false});}});
})();
var SPREADS=[
{id:'one',zh:'單張指引',sub:'快而直接',count:1,pos:[['指引','對問題嘅直接回應／今日訊息']]},
{id:'three',zh:'三張時間線',sub:'過去而家未來',count:3,pos:[['過去','件事點嚟：鋪墊今日局面嘅舊因'],['現在','企喺邊：而家最當眼嘅能量同課題'],['未來','向邊行：路線唔變嘅話最可能嘅去向']]},
{id:'love',zh:'愛情牌陣',sub:'關係四面睇',count:4,pos:[['你','我帶入呢段關係嘅心態同付出'],['對方','對方而家嘅心態同佢俾出嚟嘅嘢'],['關係現狀','兩人之間而家實際嘅互動'],['發展','照咁行落去呢段關係嘅去向']]},
{id:'choice',zh:'二擇一',sub:'比較兩條路',count:5,pos:[['現狀','件事嘅核心：我而家企喺邊'],['選項 A','揀 A 呢條路會點展開'],['選項 B','揀 B 呢條路會點展開'],['關鍵考量','落決定前最要放上天秤嘅嘢'],['建議','綜合牌面嘅建議方向']]},
{id:'celtic',zh:'凱爾特十字',sub:'十張全面睇',count:10,pos:[['現況','事情嘅核心、我身處嘅位置'],['挑戰','橫喺面前嘅助力或阻力'],['根源','事情嘅底層原因（意識之下）'],['過去','啱啱過去、正在淡出嘅影響'],['目標','顯意識嘅期望或者最好可能'],['未來','即將行入嚟嘅能量'],['自身態度','我點睇自己喺呢件事嘅位置'],['外在環境','身邊嘅人同環境點影響件事'],['希望與恐懼','我最想要同最驚嘅（往往係同一樣嘢）'],['結果','照而家軌跡行落去嘅可能結果']]}];
function drawCards(count,useRev){
  var deck=[];for(var i=0;i<78;i++)deck.push(i);
  var buf=new Uint32Array(78+count);
  (window.crypto||window.msCrypto).getRandomValues(buf);
  for(var j=77;j>0;j--){var k=buf[j]%(j+1);var t=deck[j];deck[j]=deck[k];deck[k]=t;}
  var out=[];
  for(var d=0;d<count;d++){
    out.push({id:deck[d],rev:useRev?(buf[78+d]%2===1):false});}
  return out;}
/* ═══════════════ DS-ENGINE-END ═══════════════ */

/* ═══════════════ DS-PACK-START：資料包＋Prompt（文字改動要升版本號 ds-tarot-pack） ═══════════════ */
var PACK_VER='ds-tarot-pack/1.0';
function pad2(n){return (n<10?'0':'')+n;}
function cardStr(c){var d=CARDS[c.id];return d.zh+' '+d.en+'（'+(c.rev?'逆位':'正位')+'）';}
function buildPermalink(st){
  var base=location.origin&&location.origin!=='null'?location.origin+location.pathname:'https://destinysolver.com/tarot';
  var p=['s='+st.spread.id,'c='+st.cards.map(function(c){return c.id+(c.rev?'r':'u');}).join('.')];
  if(st.q)p.push('q='+encodeURIComponent(st.q.slice(0,120)));
  if(st.optA)p.push('a='+encodeURIComponent(st.optA.slice(0,40)));
  if(st.optB)p.push('b='+encodeURIComponent(st.optB.slice(0,40)));
  return base+'?'+p.join('&');
}
function buildPack(st){
  var L=[];
  var today=new Date();
  var gen=today.getFullYear()+'-'+pad2(today.getMonth()+1)+'-'+pad2(today.getDate());
  L.push('═══ 塔羅占卜資料包（給 AI 解讀用）═══');
  L.push('來源：命運解決師 陳卓賢 · destinysolver.com ｜ 格式：'+PACK_VER+' ｜ 生成：'+gen);
  L.push('重開此局：'+buildPermalink(st));
  L.push('');
  L.push('■ 占卜口徑');
  L.push('- 牌組：韋特（Rider–Waite–Smith）78 張；大阿爾克那 22＋小阿爾克那 56（權杖火／聖杯水／寶劍風／錢幣土）。');
  L.push('- 逆位口徑：'+(st.useRev?'本次使用逆位。逆位＝該牌能量受阻、內化、延遲或過度，唔係簡單相反；具體點讀由解讀層按問題脈絡判斷。':'本次不使用逆位，全部以正位論。'));
  L.push('- 抽牌方式：'+(st.mode==='m'?'手動錄入實體抽牌（以抽出先後同方向為準）':'線上抽牌（加密隨機洗牌）'));
  L.push('- 占卜日期：'+st.dateStr);
  L.push('');
  L.push('■ 我的問題');
  L.push(st.q?('- '+st.q):'-（未填寫'+(st.spread.id==='one'?'；單張指引，照當下訊息讀':'；請解讀者先問清楚想問乜')+'）');
  if(st.spread.id==='choice'){
    L.push('- 選項 A：'+(st.optA||'（未填寫）'));
    L.push('- 選項 B：'+(st.optB||'（未填寫）'));}
  L.push('');
  L.push('■ 牌陣：'+st.spread.zh+'（'+st.spread.count+' 張）');
  st.cards.forEach(function(c,i){
    var p=st.spread.pos[i];
    L.push('- 位置 '+(i+1)+'【'+p[0]+'】'+p[1]);
    L.push('  抽出：'+cardStr(c));});
  L.push('');
  L.push('■ 逐張牌傳統關鍵詞（提示用；點落地由解讀層按位置同問題判斷）');
  st.cards.forEach(function(c){
    var d=CARDS[c.id];
    var line='- '+d.zh+'（'+(c.rev?'逆位':'正位')+'）：正位關鍵詞：'+d.kw;
    if(c.rev)line+=d.kr?('；逆位提示：'+d.kr):'；逆位按「受阻／內化／延遲／過度」口徑讀';
    L.push(line);});
  L.push('');
  L.push('■ 給 AI 嘅使用說明');
  L.push('- 以【我的問題】為中心。請按牌陣位置意義解讀：每張牌要放喺佢嘅位置講，再把成鋪牌連成一個有前後文嘅故事，唔好逐張獨立背牌義。');
  L.push('- 本包係唯一牌面事實：唔好改牌、加牌、改正逆位，或者引用本包冇列出嘅牌；缺乜就直接講明。');
  L.push('- 關鍵詞只係傳統提示；意義由你按位置同問題脈絡判斷。');
  L.push('');
  L.push('本資料包由 destinysolver.com 生成，只含牌面結構事實，不含吉凶判斷；判斷由解讀者作出。不構成專業意見。');
  return L.join('\n');
}
var GUARD=['【使用規則】',
'1. 下方資料包係唯一牌面事實：不要改牌、加牌、改正逆位，或引用資料包冇列出嘅牌同位置。',
'2. 按位置意義讀：每張牌先放喺佢嘅牌陣位置講，再連成一個完整故事；唔好逐張獨立背牌義。',
'3. 大阿爾克那講原型同重大課題，小阿爾克那講日常處境；牌陣入面大牌多，代表件事對我份量重，可以講出嚟。',
'4. 唔好刻意正向化，亦唔好刻意負向化：死神、高塔、惡魔呢類牌照傳統意義讀（結束蛻變、瓦解重建、執迷），唔准當恐嚇工具。',
'5. 每個重點判斷標明依據（邊張牌、邊個位置、正定逆）；講唔出依據嘅判斷，直接省略。',
'6. 唔恐嚇、唔斷生死、唔畀絕對化預言；牌反映嘅係當下能量同可能性，唔係命定。',
'7. 用繁體中文回答；牌名第一次出現時寫埋正逆位。',
'8. 占卜係幫我自我探索、睇清處境，唔係代我做決定；最終選擇喺我手上。',
'9. 在你第一次完整回覆的最後，另起一行，原文輸出以下一句（之後的追問回覆不必重複）：⭐ 如需更深度的人工解讀，可預約命運解決師諮商：destinysolver.com/consultation'].join('\n');
var PRESETS=[
{id:'overview',label:'整體解讀',blurb:'照牌陣位置完整讀一次。',body:['你係一位溫和而誠實嘅塔羅解讀者。請用下方資料包，照牌陣位置意義，為我完整解讀呢一鋪牌。',
'',
'解讀要求：',
'一、逐個位置讀：每張牌放喺佢嘅位置意義入面講（例如「未來位嘅星星」同「阻礙位嘅星星」讀法唔同），正逆位要反映喺解讀入面。',
'二、然後把成鋪牌連成一個有前後文嘅故事，直接回應我嘅問題：件事由邊度嚟、而家喺邊、向邊度行。',
'三、留意牌同牌之間嘅呼應（同花色重複、大牌集中、數字規律），有先講，冇就唔好夾硬。',
'',
'輸出格式（第一次回覆）：',
'1. 一句話講呢鋪牌對我問題嘅整體回應',
'2. 逐位置解讀：每個位置一小段（標明牌名同正逆）',
'3. 整體故事：一段流暢嘅總結',
'4. 一個給我嘅具體提醒或者可以做嘅事',
'語氣誠實、貼地、有溫度但唔煽情。'].join('\n')},
{id:'love',label:'感情',blurb:'關係嘅狀態、對方嘅位置、行向邊度。',body:['你係一位溫和而誠實嘅塔羅解讀者。請用下方資料包，針對感情問題解讀呢一鋪牌。',
'',
'解讀要求：',
'一、照牌陣位置意義讀，正逆位要反映；有「你／對方」位置就分清兩邊嘅狀態，唔好混埋一齊講。',
'二、聖杯講情感流動、寶劍講關係入面嘅溝通同張力、權杖講熱情同行動、錢幣講承諾同現實基礎；大牌出現代表呢段關係觸及人生課題。',
'三、誠實優先：牌面係咩狀態就講咩狀態，唔好為咗安慰我而美化，亦唔好放大負面嚇我。',
'',
'輸出：',
'1. 一句話講呢段關係此刻嘅狀態',
'2. 逐位置解讀（標明牌名正逆）',
'3. 呢段關係最實在嘅一個課題',
'4. 點相處／點行落去：具體建議 1 至 2 點',
'唔判「一定成／一定散」；最終點揀係我自己嘅事。'].join('\n')},
{id:'career',label:'事業財運',blurb:'工作局面、發展方向、點入手。',body:['你係一位溫和而誠實嘅塔羅解讀者。請用下方資料包，針對事業／財運問題解讀呢一鋪牌。',
'',
'解讀要求：',
'一、照牌陣位置意義讀，正逆位要反映。',
'二、權杖講衝勁同開創、錢幣講實務同回報、寶劍講決策同角力、聖杯講工作入面嘅人際同滿足感；宮廷牌可以讀成身邊嘅人或者我需要嘅姿態，講明你點讀。',
'三、落地優先：讀完要答到「而家個局面係點」「向邊度行」「我可以點做」三件事。',
'',
'輸出：',
'1. 一句話講而家嘅事業／財運局面',
'2. 逐位置解讀（標明牌名正逆）',
'3. 最大嘅助力同最要留意嘅位：各 1 點',
'4. 具體可以做嘅事：2 點',
'務實為主，唔畫大餅，唔嚇人。'].join('\n')},
{id:'free',label:'自由提問',blurb:'有具體問題？淨帶護欄，問乜答乜。',body:['請用下方資料包回答我嘅問題。照牌陣位置意義讀，先答問題本身，再補牌面依據；如果問題超出呢鋪牌可以答嘅範圍，請直接講明。',
'',
'【我的問題】',
'{{question}}'].join('\n')}];
/* ═══════════════ DS-PACK-END ═══════════════ */

/* ═══ UI 層（置入時可按 codebase 組件重造，邏輯照搬） ═══ */
window.__tarotInit = function(){
  var $=function(id){return document.getElementById(id);};
  var state=null,curPreset='overview',curSpread=SPREADS[1],mode='a';
  var manualPicked=[]; // {id,rev}
  var sb=$('spreadBox');
  SPREADS.forEach(function(s){
    var b=document.createElement('button');
    b.type='button';b.className='spread'+(s.id==='three'?' on':'');
    b.innerHTML='<b>'+s.zh+'</b><span>'+s.sub+' · '+s.count+' 張</span>';
    b.addEventListener('click',function(){
      sb.querySelectorAll('.spread').forEach(function(x){x.classList.remove('on');});
      b.classList.add('on');curSpread=s;
      $('abRow').style.display=s.id==='choice'?'':'none';
      resetManual();});
    sb.appendChild(b);});
  function switchMode(m2){
    mode=m2==='m'?'m':'a';
    $('modeAuto').classList.toggle('on',mode==='a');
    $('modeManual').classList.toggle('on',mode==='m');
    $('manualArea').style.display=mode==='m'?'':'none';
    $('revRow').style.display=mode==='m'?'none':'';}
  $('modeAuto').addEventListener('click',function(){switchMode('a');});
  $('modeManual').addEventListener('click',function(){switchMode('m');});
  var pg=$('pickGrid');
  CARDS.forEach(function(c){
    var b=document.createElement('button');
    b.type='button';b.className='pick';b.dataset.id=c.id;
    b.textContent=c.zh;
    b.addEventListener('click',function(){
      if(b.classList.contains('used'))return;
      if(manualPicked.length>=curSpread.count)return;
      manualPicked.push({id:c.id,rev:false});
      b.classList.add('used');
      renderPicked();});
    pg.appendChild(b);});
  function renderPicked(){
    var el=$('pickedList');
    el.innerHTML='';
    manualPicked.forEach(function(p,i){
      var chip=document.createElement('span');chip.className='pchip';
      chip.appendChild(document.createTextNode((i+1)+'. '+CARDS[p.id].zh));
      var tb=document.createElement('button');tb.type='button';
      tb.textContent=p.rev?'逆':'正';
      tb.className=p.rev?'rev':'';
      tb.addEventListener('click',function(){p.rev=!p.rev;renderPicked();});
      chip.appendChild(tb);
      el.appendChild(chip);});
    $('pickStatus').textContent=manualPicked.length?('已揀 '+manualPicked.length+'／'+curSpread.count+' 張'):'';}
  function resetManual(){
    manualPicked=[];
    pg.querySelectorAll('.pick').forEach(function(x){x.classList.remove('used');});
    renderPicked();}
  $('pickReset').addEventListener('click',resetManual);
  function doDraw(){
    var cards,useRev;
    if(mode==='m'){
      if(manualPicked.length!==curSpread.count){alert('請按抽出先後揀齊 '+curSpread.count+' 張牌。');return;}
      cards=manualPicked.map(function(p){return {id:p.id,rev:p.rev};});
      useRev=cards.some(function(c){return c.rev;});
    } else {
      useRev=$('useRev').checked;
      cards=drawCards(curSpread.count,useRev);}
    var n=new Date();
    state={spread:curSpread,cards:cards,mode:mode,useRev:useRev,
      q:$('q').value.trim(),
      optA:curSpread.id==='choice'?$('optA').value.trim():'',
      optB:curSpread.id==='choice'?$('optB').value.trim():'',
      dateStr:n.getFullYear()+'-'+pad2(n.getMonth()+1)+'-'+pad2(n.getDate())};
    render();updatePanel();
    $('chartCard').style.display='';$('aiCard').style.display='';
    $('chartCard').scrollIntoView({behavior:'smooth'});}
  function render(){
    var s=state.spread;
    $('resultTitle').textContent=s.zh+'　·　抽出的牌';
    $('drawInfo').innerHTML='<dt>牌陣</dt><dd>'+s.zh+'（'+s.count+' 張）</dd>'+
      '<dt>方式</dt><dd>'+(state.mode==='m'?'手動錄入實體抽牌':'線上抽牌（加密隨機）')+'</dd>'+
      '<dt>逆位</dt><dd>'+(state.useRev?'使用':'不使用')+'</dd>'+
      '<dt>日期</dt><dd>'+state.dateStr+'</dd>';
    var html='';
    state.cards.forEach(function(c,i){
      var d=CARDS[c.id];
      html+='<div class="cardface'+(c.rev?' rev':'')+'">'+
        '<span class="ori">'+(c.rev?'逆':'正')+'</span>'+
        '<div class="no">'+(d.major?('大牌 '+c.id):d.label.slice(0,2))+'</div>'+
        '<div class="glyph">'+d.g+'</div>'+
        '<div class="nm">'+d.zh+'</div>'+
        '<div class="en">'+d.en+'</div>'+
        '<div class="poslab">'+s.pos[i][0]+'</div>'+
        '</div>';});
    $('dealt').innerHTML=html;
    $('layoutHint').textContent='每張牌下面標咗佢喺牌陣嘅位置；位置意義詳見資料包。';}
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
  // permalink：?s=three&c=5u.33r.61u&q=&a=&b=
  var sp=new URLSearchParams(location.search);
  var sid=sp.get('s'),cs=sp.get('c');
  if(sid&&cs){
    var sdef=SPREADS.find(function(x){return x.id===sid;});
    var parts=cs.split('.');
    var ok2=sdef&&parts.length===sdef.count&&parts.every(function(x){return /^\d{1,2}[ur]$/.test(x)&&+x.slice(0,-1)<78;});
    if(ok2){
      var ids=parts.map(function(x){return +x.slice(0,-1);});
      if((new Set(ids)).size===ids.length){
        curSpread=sdef;
        sb.querySelectorAll('.spread').forEach(function(x,xi){x.classList.toggle('on',SPREADS[xi].id===sid);});
        $('abRow').style.display=sid==='choice'?'':'none';
        if(sp.get('q'))$('q').value=sp.get('q').slice(0,300);
        if(sp.get('a'))$('optA').value=sp.get('a').slice(0,60);
        if(sp.get('b'))$('optB').value=sp.get('b').slice(0,60);
        var cards2=parts.map(function(x){return {id:+x.slice(0,-1),rev:x.slice(-1)==='r'};});
        var n2=new Date();
        state={spread:sdef,cards:cards2,mode:'m',useRev:cards2.some(function(c){return c.rev;}),
          q:$('q').value.trim(),optA:$('optA').value.trim(),optB:$('optB').value.trim(),
          dateStr:n2.getFullYear()+'-'+pad2(n2.getMonth()+1)+'-'+pad2(n2.getDate())};
        render();updatePanel();
        $('chartCard').style.display='';$('aiCard').style.display='';}}}
};

/* ═══ DS-GOLDEN-TEST：置入後喺 console 行 __DS_TEST.run()，必須回 ALL PASS ═══ */
window.__DS_TEST={run:function(){
  var errs=[];
  if(CARDS.length!==78)errs.push('牌數='+CARDS.length);
  if(CARDS[0].zh!=='愚者'||CARDS[21].zh!=='世界')errs.push('大牌錨點');
  if(CARDS[22].zh!=='權杖一'||CARDS[35].zh!=='權杖國王')errs.push('權杖段');
  if(CARDS[36].zh!=='聖杯一'||CARDS[63].zh!=='寶劍國王'||CARDS[77].zh!=='錢幣國王')errs.push('花色分段');
  var names={};CARDS.forEach(function(c){names[c.zh]=1;});
  if(Object.keys(names).length!==78)errs.push('牌名重複');
  var kwMiss=CARDS.filter(function(c){return !c.kw;}).length;
  if(kwMiss)errs.push('關鍵詞缺'+kwMiss);
  for(var t=0;t<50;t++){
    var d=drawCards(10,true);
    var ids=d.map(function(x){return x.id;});
    if((new Set(ids)).size!==10){errs.push('抽牌重複');break;}
    if(ids.some(function(x){return x<0||x>77;})){errs.push('抽牌範圍');break;}}
  var dNoRev=drawCards(10,false);
  if(dNoRev.some(function(c){return c.rev;}))errs.push('關逆位仍出逆位');
  if(SPREADS.reduce(function(a,s){return a+s.count;},0)!==(1+3+4+5+10))errs.push('牌陣定義');
  if(SPREADS.every(function(s){return s.pos.length===s.count;})!==true)errs.push('位置意義數');
  return errs.length?('FAIL: '+errs.join(', ')):'ALL PASS ✓ (tarot golden)';
}};
