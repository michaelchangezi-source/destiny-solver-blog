/* ═══════════════ DS-ENGINE-START：排盤引擎（置入時一個字都唔准改） ═══════════════ */
/* DS-SUN 太陽視黃經 v1.0 · VSOP87D 截斷級數＋章動＋光行差
   驗證：香港天文台 2026–2028 全部 72 個節氣時刻，誤差全部 < 1 分鐘。 */
var DSSUN=(function(){
  var L0=[[175347046,0,0],[3341656,4.6692568,6283.07585],[34894,4.6261,12566.1517],[3497,2.7441,5753.3849],[3418,2.8289,3.5231],[3136,3.6277,77713.7715],[2676,4.4181,7860.4194],[2343,6.1352,3930.2097],[1324,0.7425,11506.7698],[1273,2.0371,529.691],[1199,1.1096,1577.3435],[990,5.233,5884.927],[902,2.045,26.298],[857,3.508,398.149],[780,1.179,5223.694],[753,2.533,5507.553],[505,4.583,18849.228],[492,4.205,775.523],[357,2.92,0.067],[317,5.849,11790.629],[284,1.899,796.298],[271,0.315,10977.079],[243,0.345,5486.778],[206,4.806,2544.314],[205,1.869,5573.143],[202,2.458,6069.777],[156,0.833,213.299],[132,3.411,2942.463],[126,1.083,20.775],[115,0.645,0.98],[103,0.636,4694.003],[102,0.976,15720.839],[102,4.267,7.114],[99,6.21,2146.17],[98,0.68,155.42],[86,5.98,161000.69]];
  var L1=[[628331966747,0,0],[206059,2.678235,6283.07585],[4303,2.6351,12566.1517],[425,1.59,3.523],[119,5.796,26.298],[109,2.966,1577.344],[93,2.59,18849.23],[72,1.14,529.69],[68,1.87,398.15],[67,4.41,5507.55],[59,2.89,5223.69],[56,2.17,155.42],[45,0.4,796.3],[36,0.47,775.52],[29,2.65,7.11],[21,5.34,0.98],[19,1.85,5486.78],[19,4.97,213.3],[17,2.99,6275.96],[16,0.03,2544.31]];
  var L2=[[52919,0,0],[8720,1.0721,6283.0758],[309,0.867,12566.152],[27,0.05,3.52],[16,5.19,26.3],[16,3.68,155.42],[10,0.76,18849.23],[9,2.06,77713.77],[7,0.83,775.52],[5,4.66,1577.34]];
  var L3=[[289,5.844,6283.076],[35,0,0],[17,5.49,12566.15]];
  var L4=[[114,3.142,0],[8,4.13,6283.08]];var L5=[[1,3.14,0]];
  var R0=[[100013989,0,0],[1670700,3.0984635,6283.07585],[13956,3.05525,12566.1517],[3084,5.1985,77713.7715],[1628,1.1739,5753.3849],[1576,2.8469,7860.4194],[925,5.453,11506.77],[542,4.564,3930.21]];
  var R1=[[103019,1.10749,6283.07585],[1721,1.0644,12566.1517]];
  function ss(S,tau){var s=0;for(var i=0;i<S.length;i++)s+=S[i][0]*Math.cos(S[i][1]+S[i][2]*tau);return s;}
  var D2R=Math.PI/180;
  function n360(x){x=x%360;return x<0?x+360:x;}
  function dT(y){var t;
    if(y>=2015){t=y-2015;return 67.62+0.3645*t+0.0039755*t*t;}
    if(y>=2005){t=y-2000;return 62.92+0.32217*t+0.005589*t*t;}
    if(y>=1986){t=y-2000;return 63.86+0.3345*t-0.060374*t*t+0.0017275*t*t*t+0.000651814*t*t*t*t+0.00002373599*t*t*t*t*t;}
    if(y>=1961){t=y-1975;return 45.45+1.067*t-t*t/260-t*t*t/718;}
    if(y>=1941){t=y-1950;return 29.07+0.407*t-t*t/233+t*t*t/2547;}
    if(y>=1920){t=y-1920;return 21.20+0.84493*t-0.0761*t*t+0.0020936*t*t*t;}
    t=y-1900;return -2.79+1.494119*t-0.0598939*t*t+0.0061966*t*t*t-0.000197*t*t*t*t;}
  function apparentLon(jdUT){
    var y=(jdUT-2451545)/365.25+2000;
    var jde=jdUT+dT(y)/86400;
    var tau=(jde-2451545)/365250;var T=tau*10;
    var Lh=(ss(L0,tau)+ss(L1,tau)*tau+ss(L2,tau)*tau*tau+ss(L3,tau)*Math.pow(tau,3)+ss(L4,tau)*Math.pow(tau,4)+ss(L5,tau)*Math.pow(tau,5))/1e8;
    var R=(ss(R0,tau)+ss(R1,tau)*tau)/1e8;
    var th=n360(Lh/D2R+180)-0.09033/3600;
    var om=(125.04452-1934.136261*T)*D2R,Ls=(280.4665+36000.7698*T)*D2R,Lm=(218.3165+481267.8813*T)*D2R;
    var dpsi=-17.2*Math.sin(om)-1.32*Math.sin(2*Ls)-0.23*Math.sin(2*Lm)+0.21*Math.sin(2*om);
    return n360(th+(dpsi-20.4898/R)/3600);}
  function solveTerm(deg,guess){var t=guess;
    for(var i=0;i<80;i++){var lon=apparentLon(t/86400000+2440587.5);var df=lon-deg;
      if(df>180)df-=360;if(df<-180)df+=360;
      if(Math.abs(df)<1e-8)break;t-=df/0.9856473*86400000;}
    return Math.round(t/1000)*1000;}
  return {apparentLon:apparentLon,solveTerm:solveTerm};
})();
/* DS-CAL 曆法核心 v1.0（同 qimen.html 完全相同；口徑同驗證錨點見該檔） */
var DSCAL=(function(){
  var GAN=['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
  var ZHI=['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
  var TERMS=['立春','雨水','驚蟄','春分','清明','穀雨','立夏','小滿','芒種','夏至','小暑','大暑','立秋','處暑','白露','秋分','寒露','霜降','立冬','小雪','大雪','冬至','小寒','大寒'];
  var TERM_LON=[315,330,345,0,15,30,45,60,75,90,105,120,135,150,165,180,195,210,225,240,255,270,285,300];
  var ORDER=['小寒','大寒','立春','雨水','驚蟄','春分','清明','穀雨','立夏','小滿','芒種','夏至','小暑','大暑','立秋','處暑','白露','秋分','寒露','霜降','立冬','小雪','大雪','冬至'];
  var _tc={};
  function termsOfGregorianYear(y){
    if(_tc[y])return _tc[y];
    var out=[];
    for(var i=0;i<24;i++){
      var name=ORDER[i],lon=TERM_LON[TERMS.indexOf(name)];
      var guess=Date.UTC(y,0,6)+i*15.218*86400000;
      out.push({name:name,lon:lon,utcMs:DSSUN.solveTerm(lon,guess)});}
    _tc[y]=out;return out;}
  var TZ=8*3600000;
  function hkParts(u){var d=new Date(u+TZ);return {y:d.getUTCFullYear(),mo:d.getUTCMonth()+1,d:d.getUTCDate(),h:d.getUTCHours(),mi:d.getUTCMinutes()};}
  function hkToUtc(y,mo,d,h,mi){return Date.UTC(y,mo-1,d,h||0,mi||0)-TZ;}
  function pad(n){return (n<10?'0':'')+n;}
  function fmtHK(u){var p=hkParts(u);return p.y+'-'+pad(p.mo)+'-'+pad(p.d)+' '+pad(p.h)+':'+pad(p.mi);}
  function toJD(ms){return ms/86400000+2440587.5;}
  var AJDN=2451550.5;
  function dayIndexFromHK(y,mo,d){var j=Math.floor(toJD(Date.UTC(y,mo-1,d))-AJDN+0.5);return ((j%60)+60)%60;}
  function ganzhiName(i){return GAN[i%10]+ZHI[i%12];}
  function fourPillars(y,mo,d,h,mi){
    var utc=hkToUtc(y,mo,d,h,mi);
    var dy=y,dmo=mo,dd=d;
    if(h>=23){var nx=new Date(Date.UTC(y,mo-1,d)+86400000);dy=nx.getUTCFullYear();dmo=nx.getUTCMonth()+1;dd=nx.getUTCDate();}
    var dayIdx=dayIndexFromHK(dy,dmo,dd);
    var hz=h>=23?0:Math.floor((h+1)/2)%12;
    var hg=(((dayIdx%10)%5)*2+hz)%10;
    var terms=termsOfGregorianYear(y).concat(termsOfGregorianYear(y-1),termsOfGregorianYear(y+1));
    var JIE=['立春','驚蟄','清明','立夏','芒種','小暑','立秋','白露','寒露','立冬','大雪','小寒'];
    var lastJie=null,nextJie=null;
    for(var i=0;i<terms.length;i++){var t=terms[i];
      if(JIE.indexOf(t.name)<0)continue;
      if(t.utcMs<=utc){if(!lastJie||t.utcMs>lastJie.utcMs)lastJie=t;}
      else{if(!nextJie||t.utcMs<nextJie.utcMs)nextJie=t;}}
    var mz=(JIE.indexOf(lastJie.name)+2)%12;
    var lichun=null;var ty=termsOfGregorianYear(y);
    for(var j2=0;j2<ty.length;j2++)if(ty[j2].name==='立春')lichun=ty[j2].utcMs;
    var yn=(utc>=lichun)?y:y-1;
    var yg=((yn-4)%10+10)%10,yz=((yn-4)%12+12)%12;
    var mg=((((yg%5)*2+2)%10)+((mz-2+12)%12))%10;
    return {year:{gan:GAN[yg],zhi:ZHI[yz],ganIdx:yg,zhiIdx:yz},month:{gan:GAN[mg],zhi:ZHI[mz],ganIdx:mg,zhiIdx:mz},day:{gan:GAN[dayIdx%10],zhi:ZHI[dayIdx%12],ganIdx:dayIdx%10,zhiIdx:dayIdx%12,sixtyIdx:dayIdx},hour:{gan:GAN[hg],zhi:ZHI[hz],ganIdx:hg,zhiIdx:hz},monthJie:lastJie,nextJie:nextJie,yearNum:yn};}
  function xunKong(si){var s=si-(si%10);var z=s%12;return [ZHI[(z+10)%12],ZHI[(z+11)%12]];}
  function sixtyIndexOf(g,z){for(var i=0;i<60;i++)if(i%10===g&&i%12===z)return i;return -1;}
  function currentTerm(u){
    var p=hkParts(u);
    var all=termsOfGregorianYear(p.y-1).concat(termsOfGregorianYear(p.y),termsOfGregorianYear(p.y+1));
    all.sort(function(a,b){return a.utcMs-b.utcMs;});
    var cur=null,nx=null;
    for(var i=0;i<all.length;i++){if(all[i].utcMs<=u)cur=all[i];else{nx=all[i];break;}}
    return {current:cur,next:nx};}
  return {GAN:GAN,ZHI:ZHI,fourPillars:fourPillars,xunKong:xunKong,sixtyIndexOf:sixtyIndexOf,ganzhiName:ganzhiName,dayIndexFromHK:dayIndexFromHK,termsOfGregorianYear:termsOfGregorianYear,fmtHK:fmtHK,hkToUtc:hkToUtc,currentTerm:currentTerm,hkParts:hkParts,pad:pad};
})();
/* DS-LIUYAO 裝卦引擎 v1.0 · 京房納甲
   驗證：乾為天初爻動（甲子子孫化辛丑父母）、天地否乾宮三世＋伏神甲子、
   雷天大壯坤宮四世、火地晉乾宮遊魂、火天大有乾宮歸魂、64 卦八宮歸屬完備性。 */
var DSLY=(function(){
  var TRI_NAME={7:'乾',3:'兌',5:'離',1:'震',6:'巽',2:'坎',4:'艮',0:'坤'};
  var TRI_ELEM={7:'金',3:'金',5:'火',1:'木',6:'木',2:'水',4:'土',0:'土'};
  var NAJIA={
    7:{gi:'甲',go:'壬',zi:['子','寅','辰'],zo:['午','申','戌']},
    2:{gi:'戊',go:'戊',zi:['寅','辰','午'],zo:['申','戌','子']},
    4:{gi:'丙',go:'丙',zi:['辰','午','申'],zo:['戌','子','寅']},
    1:{gi:'庚',go:'庚',zi:['子','寅','辰'],zo:['午','申','戌']},
    6:{gi:'辛',go:'辛',zi:['丑','亥','酉'],zo:['未','巳','卯']},
    5:{gi:'己',go:'己',zi:['卯','丑','亥'],zo:['酉','未','巳']},
    0:{gi:'乙',go:'癸',zi:['未','巳','卯'],zo:['丑','亥','酉']},
    3:{gi:'丁',go:'丁',zi:['巳','卯','丑'],zo:['亥','酉','未']}};
  var N={};
  N[7]={7:'乾為天',3:'天澤履',5:'天火同人',1:'天雷无妄',6:'天風姤',2:'天水訟',4:'天山遯',0:'天地否'};
  N[3]={7:'澤天夬',3:'兌為澤',5:'澤火革',1:'澤雷隨',6:'澤風大過',2:'澤水困',4:'澤山咸',0:'澤地萃'};
  N[5]={7:'火天大有',3:'火澤睽',5:'離為火',1:'火雷噬嗑',6:'火風鼎',2:'火水未濟',4:'火山旅',0:'火地晉'};
  N[1]={7:'雷天大壯',3:'雷澤歸妹',5:'雷火豐',1:'震為雷',6:'雷風恆',2:'雷水解',4:'雷山小過',0:'雷地豫'};
  N[6]={7:'風天小畜',3:'風澤中孚',5:'風火家人',1:'風雷益',6:'巽為風',2:'風水渙',4:'風山漸',0:'風地觀'};
  N[2]={7:'水天需',3:'水澤節',5:'水火既濟',1:'水雷屯',2:'坎為水',6:'水風井',4:'水山蹇',0:'水地比'};
  N[4]={7:'山天大畜',3:'山澤損',5:'山火賁',1:'山雷頤',6:'山風蠱',4:'艮為山',2:'山水蒙',0:'山地剝'};
  N[0]={7:'地天泰',3:'地澤臨',5:'地火明夷',1:'地雷復',6:'地風升',2:'地水師',4:'地山謙',0:'坤為地'};
  var ZHI_ELEM={子:'水',丑:'土',寅:'木',卯:'木',辰:'土',巳:'火',午:'火',未:'土',申:'金',酉:'金',戌:'土',亥:'水'};
  var SHENG={木:'火',火:'土',土:'金',金:'水',水:'木'};
  var KE={木:'土',土:'水',水:'火',火:'金',金:'木'};
  function liuqin(palElem,zhi){
    var e=ZHI_ELEM[zhi];
    if(e===palElem)return '兄弟';
    if(SHENG[e]===palElem)return '父母';
    if(SHENG[palElem]===e)return '子孫';
    if(KE[e]===palElem)return '官鬼';
    return '妻財';}
  var PALACE_MAP={};
  var FLIPS=[[],[1],[1,2],[1,2,3],[1,2,3,4],[1,2,3,4,5],[1,2,3,5],[5]];
  var SHI_POS=[6,1,2,3,4,5,4,3];
  var SEQ_NAME=['本宮首卦','一世卦','二世卦','三世卦','四世卦','五世卦','遊魂卦','歸魂卦'];
  for(var t=0;t<8;t++){
    for(var s=0;s<8;s++){
      var lower=t,upper=t;
      FLIPS[s].forEach(function(ln){
        if(ln<=3)lower^=(1<<(ln-1));
        else upper^=(1<<(ln-4));});
      PALACE_MAP[lower*8+upper]={pal:t,shi:SHI_POS[s],seq:s};}}
  var BEASTS_START={甲:0,乙:0,丙:1,丁:1,戊:2,己:3,庚:4,辛:4,壬:5,癸:5};
  var BEASTS=['青龍','朱雀','勾陳','螣蛇','白虎','玄武'];
  var CHONG={子:'午',午:'子',丑:'未',未:'丑',寅:'申',申:'寅',卯:'酉',酉:'卯',辰:'戌',戌:'辰',巳:'亥',亥:'巳'};
  function jinTui(fromZhi,toZhi){
    if(ZHI_ELEM[fromZhi]!==ZHI_ELEM[toZhi])return null;
    var pj={寅:'卯',巳:'午',申:'酉',亥:'子',丑:'辰',辰:'未',未:'戌',戌:'丑'};
    if(pj[fromZhi]===toZhi)return '化進神';
    var pt={卯:'寅',午:'巳',酉:'申',子:'亥',辰:'丑',未:'辰',戌:'未',丑:'戌'};
    if(pt[fromZhi]===toZhi)return '化退神';
    return null;}
  function cast(values,y,mo,d,h,mi){
    var fp=DSCAL.fourPillars(y,mo,d,h,mi);
    var benLines=values.map(function(v){return v===7||v===9?1:0;});
    var moving=values.map(function(v){return v===6||v===9;});
    var bianLines=values.map(function(v,i){return v===9?0:v===6?1:benLines[i];});
    function hexOf(lines){
      var lower=lines[0]+lines[1]*2+lines[2]*4;
      var upper=lines[3]+lines[4]*2+lines[5]*4;
      return {lower:lower,upper:upper,key:lower*8+upper,name:N[upper][lower]};}
    var ben=hexOf(benLines),hasMoving=moving.some(Boolean);
    var bian=hasMoving?hexOf(bianLines):null;
    var pm=PALACE_MAP[ben.key];
    var palElem=TRI_ELEM[pm.pal];
    var shi=pm.shi,ying=(shi+3)>6?(shi+3-6):(shi+3);
    function deco(hex,lines){
      var out=[];
      for(var i=0;i<6;i++){
        var inner=i<3;
        var tri=inner?hex.lower:hex.upper;
        var nj=NAJIA[tri];
        var gan=inner?nj.gi:nj.go;
        var zhi=inner?nj.zi[i]:nj.zo[i-3];
        out.push({pos:i+1,yang:lines[i]===1,gan:gan,zhi:zhi,elem:ZHI_ELEM[zhi],qin:liuqin(palElem,zhi)});}
      return out;}
    var benDeco=deco(ben,benLines);
    var bianDeco=bian?deco(bian,bianLines):null;
    var bs=BEASTS_START[fp.day.gan];
    benDeco.forEach(function(l,i){l.beast=BEASTS[(bs+i)%6];});
    var dayKong=DSCAL.xunKong(fp.day.sixtyIdx);
    var monthZhi=fp.month.zhi,dayZhi=fp.day.zhi;
    benDeco.forEach(function(l,i){
      l.moving=moving[i];
      l.kong=dayKong.indexOf(l.zhi)>=0;
      l.yuePo=CHONG[monthZhi]===l.zhi;
      l.riChong=CHONG[dayZhi]===l.zhi;
      l.shi=(l.pos===shi);l.ying=(l.pos===ying);
      if(l.moving&&bianDeco){
        var b=bianDeco[i];
        l.hua={gan:b.gan,zhi:b.zhi,elem:b.elem,qin:b.qin};
        var jt=jinTui(l.zhi,b.zhi);
        var rel=null;
        if(SHENG[b.elem]===l.elem)rel='回頭生';
        else if(KE[b.elem]===l.elem)rel='回頭克';
        l.huaNote=[jt,rel].filter(Boolean);}});
    var present={};benDeco.forEach(function(l){present[l.qin]=1;});
    var missing=['父母','兄弟','子孫','妻財','官鬼'].filter(function(q2){return !present[q2];});
    var fushen=[];
    if(missing.length){
      var pure={lower:pm.pal,upper:pm.pal,key:pm.pal*8+pm.pal};
      var pureDeco=deco(pure,[1,1,1,1,1,1]);
      missing.forEach(function(q2){
        pureDeco.forEach(function(pl){
          if(pl.qin===q2){
            fushen.push({qin:q2,gan:pl.gan,zhi:pl.zhi,elem:pl.elem,pos:pl.pos,
              kong:dayKong.indexOf(pl.zhi)>=0,fei:benDeco[pl.pos-1]});}});});}
    return {pillars:fp,ben:ben,bian:bian,palaceTri:TRI_NAME[pm.pal],palaceElem:palElem,
      seqName:SEQ_NAME[pm.seq],shi:shi,ying:ying,lines:benDeco,bianLinesDeco:bianDeco,
      dayKong:dayKong,monthZhi:monthZhi,dayZhi:dayZhi,monthPo:CHONG[monthZhi],dayChongZhi:CHONG[dayZhi],
      moving:moving,hasMoving:hasMoving,fushen:fushen,values:values.slice()};}
  return {cast:cast,PALACE_MAP:PALACE_MAP};
})();
/* ═══════════════ DS-ENGINE-END ═══════════════ */

/* ═══════════════ DS-PACK-START：資料包＋Prompt（文字改動要升版本號 ds-liuyao-pack） ═══════════════ */
var PACK_VER='ds-liuyao-pack/1.0';
var POS_NAME=['初爻','二爻','三爻','四爻','五爻','上爻'];
function buildPermalink(st){
  var base=location.origin&&location.origin!=='null'?location.origin+location.pathname:'https://www.destinysolver.com/liuyao';
  var p=['l='+st.values.join(''),'t='+st.tstr,'m='+st.mode];
  if(st.q)p.push('q='+encodeURIComponent(st.q.slice(0,120)));
  return base+'?'+p.join('&');
}
function buildPack(c,st){
  var L=[];var fp=c.pillars;
  var today=new Date();
  var gen=today.getFullYear()+'-'+DSCAL.pad(today.getMonth()+1)+'-'+DSCAL.pad(today.getDate());
  L.push('═══ 六爻起卦資料包（給 AI 解讀用）═══');
  L.push('來源：命運解決師 陳卓賢 · destinysolver.com ｜ 格式：'+PACK_VER+' ｜ 生成：'+gen);
  L.push('重開此卦：'+buildPermalink(st));
  L.push('');
  L.push('■ 排盤口徑');
  L.push('- 京房納甲六爻；六親以本卦宮五行為「我」；六獸以日干起（甲乙青龍、丙丁朱雀、戊勾陳、己螣蛇、庚辛白虎、壬癸玄武）；變爻六親以本卦宮論。');
  L.push('- 曆法：香港時間（UTC+8）；月建取節氣月支；日辰 23:00 換日（早子時）；旬空按日柱；月破＝月建所沖、日沖＝日辰所沖（係暗動定沖散由解讀層判斷）。');
  L.push('- 伏神：六親不全時於本宮首卦尋伏；同六親多爻全列。');
  L.push('- 起卦方式：'+(st.mode==='o'?'線上模擬搖卦（加密隨機三錢）':'手動錄入實體搖卦（古法三錢：一背＝少陽7、兩背＝少陰8、三背＝老陽9動、三字＝老陰6動）'));
  L.push('');
  L.push('■ 我的問題');
  L.push(st.q?('- '+st.q):'-（未填寫；請解讀者先問清楚想問乜，再定用神）');
  L.push('');
  L.push('■ 起卦時間與曆法');
  L.push('- 起卦時刻：'+st.disp+'（'+fp.hour.zhi+'時）');
  L.push('- 四柱：'+fp.year.gan+fp.year.zhi+'年 '+fp.month.gan+fp.month.zhi+'月 '+fp.day.gan+fp.day.zhi+'日 '+fp.hour.gan+fp.hour.zhi+'時');
  L.push('- 月建：'+c.monthZhi+' ｜ 日辰：'+fp.day.gan+fp.day.zhi+' ｜ 日旬空：'+c.dayKong.join('')+' ｜ 月破之支：'+c.monthPo+' ｜ 日沖之支：'+c.dayChongZhi);
  L.push('');
  L.push('■ 卦象');
  L.push('- 本卦：'+c.ben.name+'（'+c.palaceTri+'宮 · '+c.seqName+' · 宮五行屬'+c.palaceElem+'）');
  L.push('- 世爻：'+POS_NAME[c.shi-1]+' ｜ 應爻：'+POS_NAME[c.ying-1]);
  if(c.hasMoving){
    L.push('- 變卦：'+c.bian.name);
    L.push('- 動爻：'+c.lines.filter(function(l){return l.moving;}).map(function(l){return POS_NAME[l.pos-1]+'（'+(l.yang?'陽動':'陰動')+'）';}).join('、'));
  } else {
    L.push('- 六爻安靜，無動爻，無變卦');
  }
  L.push('');
  L.push('■ 本卦六爻（初→上；每爻：六獸／六親／干支五行／爻性／世應／標記／動化）');
  c.lines.forEach(function(l){
    var flags=[];
    if(l.shi)flags.push('世');
    if(l.ying)flags.push('應');
    if(l.kong)flags.push('旬空');
    if(l.yuePo)flags.push('月破');
    if(l.riChong)flags.push('日沖');
    var row='- '+POS_NAME[l.pos-1]+' '+l.beast+' '+l.qin+' '+l.gan+l.zhi+'('+l.elem+') '+(l.yang?'陽爻':'陰爻')+(l.moving?(l.yang?'・動':'・動'):'');
    if(flags.length)row+='｜'+flags.join('、');
    if(l.moving&&l.hua){
      row+='｜化 '+l.hua.qin+' '+l.hua.gan+l.hua.zhi+'('+l.hua.elem+')';
      if(l.huaNote&&l.huaNote.length)row+='（'+l.huaNote.join('、')+'）';}
    L.push(row);});
  if(c.hasMoving&&c.bianLinesDeco){
    L.push('');
    L.push('■ 變卦六爻（初→上，供對照；干支六親以本卦宮論）');
    c.bianLinesDeco.forEach(function(b){
      L.push('- '+POS_NAME[b.pos-1]+' '+b.qin+' '+b.gan+b.zhi+'('+b.elem+') '+(b.yang?'陽爻':'陰爻'));});}
  if(c.fushen.length){
    L.push('');
    L.push('■ 伏神（本卦六親不全，於本宮首卦'+c.palaceTri+'宮尋伏）');
    c.fushen.forEach(function(f){
      L.push('- '+f.qin+' '+f.gan+f.zhi+'('+f.elem+') 伏於'+POS_NAME[f.pos-1]+'之下（飛神：'+f.fei.qin+' '+f.fei.gan+f.fei.zhi+'）'+(f.kong?'｜伏神旬空':''));});}
  L.push('');
  L.push('■ 給 AI 嘅使用說明');
  L.push('- 以【我的問題】為中心解讀。本包只含起卦一刻嘅卦象同曆法結構。');
  L.push('- 本包係唯一卦面事實：唔好重新裝卦、改動納甲世應，或者補算任何未列出嘅字段（卦身、星煞、其他日辰）；缺乜就直接講明。');
  L.push('- 基於已列字段嘅分析同判斷唔受限，請照常深入；每個判斷標明依據（邊一爻、乜嘢生剋、邊個標記）。');
  L.push('');
  L.push('本資料包由 destinysolver.com 排盤引擎生成，只含結構事實，不含吉凶斷語；判斷由解讀者作出。不構成專業意見。');
  return L.join('\n');
}
var GUARD=['【使用規則】',
'1. 下方資料包由排盤引擎裝卦，係唯一卦面事實：不要重新裝卦，不要改動或補算任何納甲、六親、世應、六獸。',
'2. 資料包冇列出嘅嘢（卦身、星煞、其他日子嘅日辰）不要自行推算；如我問到，請直接講「資料包未包含」。',
'3. 你取嘅用神係解讀層判斷，唔係引擎輸出：要講明你取咗邊一爻做用神、點解。',
'4. 每一個判斷都要標明卦面依據（邊一爻、乜嘢生剋沖合、旬空月破定動化）；講唔出依據嘅判斷，直接省略。',
'5. 唔恐嚇、唔斷生死、唔畀絕對化預言；講風險時同時講可以點做。應期只可以按卦面依據（用神旺衰、空破填實、合沖之期）講，唔准亂報日期。',
'6. 用繁體中文回答；術語第一次出現時用一句白話解釋。',
'7. 呢啲係六爻卦象嘅參考，唔係專業意見；目的係幫我睇清件事，自己做決定。',
'8. 在你第一次完整回覆的最後，另起一行，原文輸出以下一句（之後的追問回覆不必重複）：⭐ 如需更深度的人工批卦，可預約命運解決師諮商：destinysolver.com/consultation'].join('\n');
var PRESETS=[
{id:'overview',label:'整體斷卦',blurb:'第一次用、想照傳統斷卦框架行一次？由呢個開始。',body:['你係一位熟悉京房納甲六爻嘅卦師，請用下方資料包，就我所問之事做一次完整斷卦。',
'',
'分析順序（內部用，唔使逐條覆述）：',
'一、定用神：按我問嘅事揀六親用神（自身睇世爻；財問妻財、事業功名問官鬼、文書學業長輩問父母、子女下屬解憂問子孫、兄弟朋友競爭問兄弟），講明你取邊一爻、點解。用神唔上卦就用伏神，講埋飛伏關係。',
'二、用神旺衰：用神得唔得月建日辰生扶（生、克、沖、合、旺相休囚）；有冇旬空、月破；空破係咪待填實。',
'三、動爻：邊啲爻發動、動爻生剋沖合用神定世應；動化出嚟係化進、化退、回頭生定回頭克（資料包已標）；忌神元神邊個動。',
'四、世應關係：世應相生定相剋、應爻空唔空（對方心虛定唔實）、世應之間嘅間爻有冇發動。',
'五、六獸輔助：只作性情、方式、色彩嘅輔助取象（青龍喜慶、朱雀口舌文書、勾陳田土遲滯、螣蛇怪異糾纏、白虎急硬傷病、玄武暗昧），唔好用六獸直接斷吉凶。',
'六、結論：綜合用神旺衰同動爻，講事情成唔成、順唔順、卡喺邊；應期只按卦面依據講（例如空待出旬、破待填合）。',
'',
'輸出格式（第一次回覆）：',
'1. 一句話講呢支卦對所問之事嘅總答案（成／唔成／有變數，邊個講法貼卦面就用邊個）',
'2. 用神同佢嘅狀態：2 至 3 點',
'3. 關鍵動爻同佢做咗乜：1 至 3 點（無動爻就講靜卦點睇）',
'4. 過程會點行：2 至 3 點（邊度順、邊度卡）',
'5. 應期或者觀察位：1 至 2 點（標明依據）',
'6. 畀我嘅一句建議',
'約七成講結論同過程，三成講卦理依據。最後問我最想跟進邊樣。'].join('\n')},
{id:'love',label:'感情婚姻',blurb:'關係現狀、對方心態、行唔行得埋。',body:['你係一位熟悉京房納甲六爻嘅卦師，請用下方資料包，只針對感情／婚姻作答。',
'',
'判斷框架：',
'一、用神：女問男以官鬼為用，男問女以妻財為用；世爻係我、應爻係對方。講明你取咗邊一爻。用神唔上卦就用伏神，飛伏關係要講。',
'二、用神狀態：得唔得月日生扶、旬空月破（對方心實唔實、關係穩唔穩）、同世爻有冇生合沖剋。',
'三、世應：世應相合（有情）定相沖（有張力）、應爻空亡（對方未定）、間爻發動（有第三方或阻隔）。',
'四、動爻：邊個動、動出乜（化進退、回頭生剋），對關係係推進定拆散。',
'五、六獸只作輔助取象（例如玄武曖昧、朱雀口舌），唔好單憑六獸斷。',
'',
'輸出：',
'1. 一句話講呢段關係此刻嘅狀態',
'2. 我嘅位置、對方嘅狀態：各 2 點（標爻位依據）',
'3. 關係最實在嘅一個課題（由卦面嚟）',
'4. 點相處／點行落去：具體建議 2 點',
'5. 應期或觀察位：1 點（有依據先講）',
'唔判「一定成／一定散」；傾向要帶卦面依據，最終點揀係我自己嘅事。'].join('\n')},
{id:'career',label:'事業求財',blurb:'搵工、生意、投資：財路通唔通、幾時著力。',body:['你係一位熟悉京房納甲六爻嘅卦師，請用下方資料包，只針對事業／求財作答。',
'',
'判斷框架：',
'一、用神：求財以妻財為用、事業職位功名以官鬼為用（配父母爻睇文書合約）；子孫係財之元神（生財），兄弟係財之忌神（劫財）。講明你按我嘅問題取咗乜。',
'二、用神狀態：財爻／官爻旺衰、空破、伏藏；元神有冇力、忌神有冇發動。',
'三、動爻：兄弟動主破耗競爭、子孫動生財但傷官（打工問升遷要小心睇）、父母動文書辛勞；逐個動爻講佢對財路嘅作用。',
'四、世應：世爻係我，財爻同世爻嘅關係（財嚟就我定我去追財）；應爻代表對家／平台／客戶。',
'五、結論要分「成唔成」同「幾時」：應期只按卦面依據（空待出旬、破待填、合待沖）。',
'',
'輸出：',
'1. 一句話：呢件事財路／事業路而家通唔通',
'2. 用神狀態同點解：2 至 3 點',
'3. 過程入面最大嘅助力同阻力：各 1 至 2 點',
'4. 具體點做：2 至 3 點（貼住我問嘅事）',
'5. 應期或觀察位：1 點（有依據先講）',
'唔報「發達日期」；講時機只可以帶卦面依據。'].join('\n')},
{id:'free',label:'自由提問',blurb:'有具體問題？淨帶護欄，問乜答乜。',body:['請用下方資料包回答我嘅問題。先答問題本身，再補少量卦面依據；如果問題涉及資料包冇嘅嘢，請直接講明，再就已有資料答到嘅部分作答。',
'',
'【我的問題】',
'{{question}}'].join('\n')}];
/* ═══════════════ DS-PACK-END ═══════════════ */

/* ═══ UI 層（置入時可按 codebase 組件重造，邏輯照搬） ═══ */
window.__liuyaoInit = function(){
  var $=function(id){return document.getElementById(id);};
  var state=null,chart=null,curPreset='overview',mode='m';
  var VAL_LABEL={7:'少陽（一背）',8:'少陰（兩背）',9:'老陽（三背・動）',6:'老陰（三字・動）'};
  var lineVals=[null,null,null,null,null,null];
  var tossCount=0;
  function two(n){return (n<10?'0':'')+n;}
  function setNow(){
    var n=new Date();
    $('dt').value=n.getFullYear()+'-'+two(n.getMonth()+1)+'-'+two(n.getDate())+'T'+two(n.getHours())+':'+two(n.getMinutes());}
  // 手動錄入六爻列
  (function buildRows(){
    var wrap=$('lineRows');
    var names=['初爻（第1次）','二爻（第2次）','三爻（第3次）','四爻（第4次）','五爻（第5次）','上爻（第6次）'];
    for(var i=5;i>=0;i--){
      (function(i){
        var row=document.createElement('div');row.className='linerow';
        var nm=document.createElement('div');nm.className='nm';nm.textContent=names[i];
        var seg=document.createElement('div');seg.className='seg';
        [[7,'一背<br>少陽 ▬▬▬'],[8,'兩背<br>少陰 ▬ ▬'],[9,'三背<br>老陽 ○ 動'],[6,'三字<br>老陰 ✕ 動']].forEach(function(opt){
          var b=document.createElement('button');b.type='button';b.innerHTML=opt[1];
          b.addEventListener('click',function(){
            lineVals[i]=opt[0];
            seg.querySelectorAll('button').forEach(function(x){x.classList.remove('on');});
            b.classList.add('on');});
          seg.appendChild(b);});
        row.appendChild(nm);row.appendChild(seg);
        wrap.insertBefore(row,wrap.firstChild);})(i);}
    // 由下而上顯示：初爻喺最底
    var rows=[].slice.call(wrap.children);
    wrap.innerHTML='';
    rows.reverse().forEach(function(r){wrap.appendChild(r);});
    // reverse 之後而家係 上爻→初爻 由上到下，正確
  })();
  function switchMode(m2){
    mode=m2;
    $('modeManual').classList.toggle('on',m2==='m');
    $('modeOnline').classList.toggle('on',m2==='o');
    $('manualArea').style.display=m2==='m'?'':'none';
    $('onlineArea').style.display=m2==='o'?'':'none';}
  $('modeManual').addEventListener('click',function(){switchMode('m');});
  $('modeOnline').addEventListener('click',function(){switchMode('o');});
  // 線上搖卦
  function cryptoCoin(){
    var a=new Uint8Array(1);
    (window.crypto||window.msCrypto).getRandomValues(a);
    return a[0]%2;} // 1=背 0=字
  function tossOnce(){
    if(tossCount>=6)return;
    var backs=cryptoCoin()+cryptoCoin()+cryptoCoin();
    var v=backs===1?7:backs===2?8:backs===3?9:6;
    lineVals[tossCount]=v;
    tossCount++;
    $('coinShow').textContent=(backs>=1?'●'.repeat(backs):'')+('○'.repeat(3-backs))+'　（'+backs+' 背）';
    var log=[];
    for(var i=0;i<tossCount;i++)log.push(['初','二','三','四','五','上'][i]+'爻 '+VAL_LABEL[lineVals[i]]);
    $('tossLog').innerHTML=log.join('　·　');
    $('tossBtn').textContent=tossCount>=6?'六爻已足，可以裝卦':'搖卦（第 '+(tossCount+1)+' 次／共 6 次）';
    if(tossCount===6)setNow();}
  $('tossBtn').addEventListener('click',tossOnce);
  $('tossReset').addEventListener('click',function(){
    tossCount=0;lineVals=[null,null,null,null,null,null];
    $('coinShow').textContent='';$('tossLog').textContent='';
    $('tossBtn').textContent='搖卦（第 1 次／共 6 次）';});
  function doCast(){
    var vals;
    if(mode==='m'){
      vals=lineVals.slice();
      if(vals.some(function(v){return v===null;})){alert('請六爻全部錄入晒（初爻至上爻六次結果）先裝卦。');return;}
    } else {
      if(tossCount<6){alert('請先搖滿六次。');return;}
      vals=lineVals.slice();}
    var v=$('dt').value;
    if(!v){setNow();v=$('dt').value;}
    var m2=v.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
    if(!m2)return;
    chart=DSLY.cast(vals,+m2[1],+m2[2],+m2[3],+m2[4],+m2[5]);
    state={q:$('q').value.trim(),values:vals,mode:mode==='o'?'o':'m',
      tstr:''+m2[1]+m2[2]+m2[3]+m2[4]+m2[5],disp:m2[1]+'-'+m2[2]+'-'+m2[3]+' '+m2[4]+':'+m2[5]};
    render();updatePanel();
    $('chartCard').style.display='';$('aiCard').style.display='';
    $('chartCard').scrollIntoView({behavior:'smooth'});}
  function barHTML(yang,moving){
    var bar=yang?'▬▬▬▬▬':'▬▬&nbsp;&nbsp;▬▬';
    var mk=moving?(yang?' ○':' ✕'):'';
    return '<span class="bar'+(moving?' moving':'')+'">'+bar+mk+'</span>';}
  function render(){
    var c=chart,fp=c.pillars;
    $('calInfo').innerHTML=
      '<dt>四柱</dt><dd>'+fp.year.gan+fp.year.zhi+'年 '+fp.month.gan+fp.month.zhi+'月 '+fp.day.gan+fp.day.zhi+'日 '+fp.hour.gan+fp.hour.zhi+'時</dd>'+
      '<dt>月建</dt><dd>'+c.monthZhi+'（月破'+c.monthPo+'）</dd>'+
      '<dt>日辰</dt><dd>'+fp.day.gan+fp.day.zhi+'（日沖'+c.dayChongZhi+'）</dd>'+
      '<dt>旬空</dt><dd>'+c.dayKong.join('、')+'</dd>';
    $('benTitle').textContent='本卦　'+c.ben.name+'（'+c.palaceTri+'宮'+c.seqName.replace('卦','')+'）';
    var bh='';
    for(var i=5;i>=0;i--){
      var l=c.lines[i];
      var flags=[];
      if(l.kong)flags.push('旬空');
      if(l.yuePo)flags.push('月破');
      if(l.riChong)flags.push('日沖');
      bh+='<div class="yao">'+
        '<span class="hint">'+l.beast+'</span>'+
        '<span class="gz">'+l.qin+' '+l.gan+l.zhi+'</span>'+
        barHTML(l.yang,l.moving)+
        '<span>'+(l.shi?'<span class="sy">世</span>':'')+(l.ying?'<span class="sy ying">應</span>':'')+
        (flags.length?'<span class="tag">'+flags.join('·')+'</span>':'')+
        (l.moving&&l.hua?('<span class="tag">化'+l.hua.qin+l.hua.gan+l.hua.zhi+(l.huaNote&&l.huaNote.length?('（'+l.huaNote.join('、')+'）'):'')+'</span>'):'')+
        '</span></div>';}
    $('benLines').innerHTML=bh;
    if(c.hasMoving){
      $('bianCol').style.display='';$('hexArrow').style.display='';
      $('bianTitle').textContent='變卦　'+c.bian.name;
      var vh='';
      for(var j=5;j>=0;j--){
        var b=c.bianLinesDeco[j];
        vh+='<div class="yao2">'+barHTML(b.yang,false)+'<span class="gz">'+b.qin+' '+b.gan+b.zhi+'</span></div>';}
      $('bianLines').innerHTML=vh;
    } else {
      $('bianCol').style.display='none';$('hexArrow').style.display='none';}
    if(c.fushen.length){
      $('fushenBox').innerHTML='<b>伏神</b>：'+c.fushen.map(function(f){
        return f.qin+' '+f.gan+f.zhi+'('+f.elem+') 伏於'+POS_NAME[f.pos-1]+'之下（飛神 '+f.fei.qin+' '+f.fei.gan+f.fei.zhi+'）'+(f.kong?'・旬空':'');}).join('；');
    } else $('fushenBox').innerHTML='';}
  function currentPack(){return buildPack(chart,state);}
  function currentPrompt(){
    var p=PRESETS.find(function(x){return x.id===curPreset;});
    var body=p.body;
    var q=$('q').value.trim();
    if(p.id==='free')body=body.replace('{{question}}',q||'（未填寫）');
    var mid=(p.id!=='free'&&q)?('\n\n【我的問題】\n'+q):'';
    return body+mid+'\n\n'+GUARD;}
  function fullText(){return currentPrompt()+'\n\n────────\n\n'+currentPack();}
  function updatePanel(){
    if(!chart)return;
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
  $('castBtn').addEventListener('click',doCast);
  $('nowBtn').addEventListener('click',setNow);
  $('q').addEventListener('input',function(){if(chart)updatePanel();});
  $('copyAll').addEventListener('click',function(e){if(chart)copy(fullText(),e.target);});
  $('copyPack').addEventListener('click',function(e){if(chart)copy(currentPack(),e.target);});
  setNow();
  // permalink：?l=979777&t=YYYYMMDDHHMM&m=m|o&q=
  var sp=new URLSearchParams(location.search);
  if(sp.get('l')&&/^[6789]{6}$/.test(sp.get('l'))&&sp.get('t')&&/^\d{12}$/.test(sp.get('t'))){
    var lv=sp.get('l').split('').map(Number);
    lineVals=lv.slice();tossCount=6;
    if(sp.get('m')==='o')switchMode('o');
    // 同步手動 UI 揀樣
    var segs=$('lineRows').querySelectorAll('.linerow');
    for(var si=0;si<6;si++){
      var rowIdx=5-si; // 顯示由上爻到初爻
      var btns=segs[rowIdx].querySelectorAll('button');
      var map={7:0,8:1,9:2,6:3};
      btns[map[lv[si]]].classList.add('on');}
    var t=sp.get('t');
    $('dt').value=t.slice(0,4)+'-'+t.slice(4,6)+'-'+t.slice(6,8)+'T'+t.slice(8,10)+':'+t.slice(10,12);
    if(sp.get('q'))$('q').value=sp.get('q').slice(0,300);
    doCast();}
};

/* ═══ DS-GOLDEN-TEST：置入後喺 console 行 __DS_TEST.run()，必須回 ALL PASS ═══ */
window.__DS_TEST={run:function(){
  var errs=[];
  var c=DSLY.cast([9,7,7,7,7,7],2026,8,21,10,0);
  if(c.ben.name!=='乾為天'||c.bian.name!=='天風姤')errs.push('卦名');
  if(c.palaceTri!=='乾'||c.palaceElem!=='金'||c.shi!==6||c.ying!==3)errs.push('宮世應');
  var l1=c.lines[0];
  if(l1.gan+l1.zhi!=='甲子'||l1.qin!=='子孫'||l1.hua.gan+l1.hua.zhi!=='辛丑'||l1.hua.qin!=='父母')errs.push('納甲動化');
  if(c.lines.map(function(l){return l.gan+l.zhi;}).join('')!=='甲子甲寅甲辰壬午壬申壬戌')errs.push('乾納甲全序');
  if(c.lines.map(function(l){return l.beast;}).join('')!=='朱雀勾陳螣蛇白虎玄武青龍')errs.push('六獸');
  var c2=DSLY.cast([8,8,8,7,7,7],2026,8,21,10,0);
  if(c2.ben.name!=='天地否'||c2.palaceTri!=='乾'||c2.seqName!=='三世卦'||c2.shi!==3||c2.ying!==6)errs.push('否卦');
  if(c2.lines.map(function(l){return l.zhi+l.qin;}).join('')!=='未父母巳官鬼卯妻財午官鬼申兄弟戌父母')errs.push('否六親');
  if(!(c2.fushen.length===1&&c2.fushen[0].qin==='子孫'&&c2.fushen[0].gan+c2.fushen[0].zhi==='甲子'&&c2.fushen[0].pos===1))errs.push('伏神');
  if(c2.monthPo!=='寅'||c2.dayChongZhi!=='酉'||c2.dayKong.join('')!=='戌亥')errs.push('月破日沖旬空');
  var c3=DSLY.cast([7,7,7,7,8,8],2026,8,21,10,0);
  if(c3.ben.name!=='雷天大壯'||c3.palaceTri!=='坤'||c3.seqName!=='四世卦')errs.push('大壯');
  var c4=DSLY.cast([8,8,8,7,8,7],2026,8,21,10,0);
  if(c4.ben.name!=='火地晉'||c4.palaceTri!=='乾'||c4.seqName!=='遊魂卦'||c4.shi!==4)errs.push('晉遊魂');
  var c5=DSLY.cast([7,7,7,7,8,7],2026,8,21,10,0);
  if(c5.ben.name!=='火天大有'||c5.palaceTri!=='乾'||c5.seqName!=='歸魂卦'||c5.shi!==3)errs.push('大有歸魂');
  var cnt={};
  for(var k in DSLY.PALACE_MAP){var pm=DSLY.PALACE_MAP[k];cnt[pm.pal]=(cnt[pm.pal]||0)+1;}
  for(var t2=0;t2<8;t2++)if(cnt[t2]!==8)errs.push('宮歸屬');
  var fp=DSCAL.fourPillars(2000,1,1,23,30);
  if(fp.year.gan+fp.year.zhi+fp.month.gan+fp.month.zhi+fp.day.gan+fp.day.zhi+fp.hour.gan+fp.hour.zhi!=='己卯丙子己未甲子')errs.push('早子時換日');
  return errs.length?('FAIL: '+errs.join(', ')):'ALL PASS ✓ (liuyao golden)';
}};
