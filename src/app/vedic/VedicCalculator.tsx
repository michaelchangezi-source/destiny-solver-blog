'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { DSAST, DSVED } from '@/lib/vedic-engine'

interface City { id: string; name: string; lat: number; lon: number; zone: string }

const CITIES: City[] = [
  {id:'hk',name:'香港',lat:22.32,lon:114.17,zone:'Asia/Hong_Kong'},
  {id:'tpe',name:'台北',lat:25.03,lon:121.57,zone:'Asia/Taipei'},
  {id:'txg',name:'台中',lat:24.15,lon:120.67,zone:'Asia/Taipei'},
  {id:'khh',name:'高雄',lat:22.63,lon:120.30,zone:'Asia/Taipei'},
  {id:'sha',name:'上海',lat:31.23,lon:121.47,zone:'Asia/Shanghai'},
  {id:'bjs',name:'北京',lat:39.90,lon:116.41,zone:'Asia/Shanghai'},
  {id:'can',name:'廣州',lat:23.13,lon:113.26,zone:'Asia/Shanghai'},
  {id:'tyo',name:'東京',lat:35.68,lon:139.69,zone:'Asia/Tokyo'},
  {id:'sel',name:'首爾',lat:37.57,lon:126.98,zone:'Asia/Seoul'},
  {id:'sin',name:'新加坡',lat:1.35,lon:103.82,zone:'Asia/Singapore'},
  {id:'lon',name:'倫敦',lat:51.51,lon:-0.13,zone:'Europe/London'},
  {id:'nyc',name:'紐約',lat:40.71,lon:-74.01,zone:'America/New_York'},
  {id:'lax',name:'洛杉磯',lat:34.05,lon:-118.24,zone:'America/Los_Angeles'},
  {id:'yvr',name:'溫哥華',lat:49.28,lon:-123.12,zone:'America/Vancouver'},
  {id:'yyz',name:'多倫多',lat:43.65,lon:-79.38,zone:'America/Toronto'},
  {id:'syd',name:'悉尼',lat:-33.87,lon:151.21,zone:'Australia/Sydney'},
]

const GLYPH: Record<string, string> = {asc:'升',su:'日',mo:'月',ma:'火',me:'水',ju:'木',ve:'金',sa:'土',ra:'羅',ke:'計'}
const SIGN_SHORT = ['牡羊','金牛','雙子','巨蟹','獅子','處女','天秤','天蠍','射手','摩羯','水瓶','雙魚']

function offsetAt(utcMs: number, zone: string): number {
  const f = new Intl.DateTimeFormat('en-US', {timeZone: zone, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'})
  const p: Record<string, string> = {}
  f.formatToParts(new Date(utcMs)).forEach(x => { p[x.type] = x.value })
  const asUTC = Date.UTC(+p.year, (+p.month) - 1, +p.day, +p.hour, +p.minute, +p.second)
  return Math.round((asUTC - utcMs) / 60000)
}

function localToUtc(y: number, mo: number, d: number, h: number, mi: number, zone: string) {
  const target = Date.UTC(y, mo - 1, d, h, mi)
  let guess = target - 8 * 3600000
  for (let i = 0; i < 4; i++) { guess = target - offsetAt(guess, zone) * 60000 }
  return { utcMs: guess, offsetMin: offsetAt(guess, zone) }
}

function tzSupportOk(): boolean {
  try { return offsetAt(Date.UTC(1975, 6, 1), 'Asia/Hong_Kong') === 540 } catch { return false }
}

function pad2(n: number): string { return (n < 10 ? '0' : '') + n }

function fmtLocal(ms: number, offMin: number): string {
  const d = new Date(ms + offMin * 60000)
  return d.getUTCFullYear() + '-' + pad2(d.getUTCMonth() + 1) + '-' + pad2(d.getUTCDate()) + ' ' + pad2(d.getUTCHours()) + ':' + pad2(d.getUTCMinutes())
}

function fmtDate(ms: number, offMin: number): string {
  const d = new Date(ms + offMin * 60000)
  return d.getUTCFullYear() + '-' + pad2(d.getUTCMonth() + 1) + '-' + pad2(d.getUTCDate())
}

function buildVargaMap(chart: any, varga: number) {
  const vg = chart.vargas['D' + varga]
  const m: Record<number, string[]> = {}
  for (let s = 0; s < 12; s++) m[s] = []
  DSVED.GRAHA_ORDER.forEach((k: string) => {
    let lab = GLYPH[k]
    let b: any = null
    chart.bodies.forEach((x: any) => { if (x.key === k) b = x })
    if (b && b.retro === true) lab += '℞'
    m[vg[k]].push(lab)
  })
  return { map: m, ascSign: vg.asc }
}

function southSVG(map: Record<number, string[]>, ascSign: number, varga: number): string {
  const cellOf = [[0,1],[0,2],[0,3],[1,3],[2,3],[3,3],[3,2],[3,1],[3,0],[2,0],[1,0],[0,0]]
  const S = 84, W = S * 4, H = S * 4
  let out = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="南印度式命盤">'
  out += '<rect x="1" y="1" width="' + (W - 2) + '" height="' + (H - 2) + '" fill="#fff" stroke="#B23E26" stroke-width="1.5"/>'
  for (let s = 0; s < 12; s++) {
    const rc = cellOf[s], x = rc[1] * S, y = rc[0] * S
    const isAsc = s === ascSign
    out += '<rect x="' + x + '" y="' + y + '" width="' + S + '" height="' + S + '" fill="' + (isAsc ? 'rgba(178,62,38,.08)' : 'none') + '" stroke="#B23E26" stroke-width="1"/>'
    out += '<text x="' + (x + 4) + '" y="' + (y + 13) + '" font-size="9.5" fill="#6B6155">' + SIGN_SHORT[s] + '</text>'
    if (isAsc) out += '<line x1="' + x + '" y1="' + (y + 14) + '" x2="' + (x + 14) + '" y2="' + y + '" stroke="#B23E26" stroke-width="1.2"/>'
    const items = (s === ascSign ? ['升'] : []).concat(map[s])
    for (let i = 0; i < items.length; i++) {
      const col = i % 3, row = Math.floor(i / 3)
      out += '<text x="' + (x + 14 + col * 23) + '" y="' + (y + 34 + row * 20) + '" font-size="13" font-weight="' + (items[i] === '升' ? '700' : '400') + '" fill="' + (items[i] === '升' ? '#B23E26' : (items[i].indexOf('℞') > 0 ? '#96321E' : '#2B241C')) + '">' + items[i] + '</text>'
    }
  }
  out += '<text x="' + (W / 2) + '" y="' + (H / 2 - 6) + '" font-size="12" fill="#6B6155" text-anchor="middle">' + (varga === 1 ? 'D1 命盤' : 'D' + varga) + '</text>'
  out += '<text x="' + (W / 2) + '" y="' + (H / 2 + 12) + '" font-size="10" fill="#6B6155" text-anchor="middle">恆星黃道 · Lahiri</text>'
  return out + '</svg>'
}

function northSVG(map: Record<number, string[]>, ascSign: number): string {
  const W = 340, H = 340, cx = W / 2, cy = H / 2
  let out = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="北印度式命盤">'
  out += '<rect x="1" y="1" width="' + (W - 2) + '" height="' + (H - 2) + '" fill="#fff" stroke="#B23E26" stroke-width="1.5"/>'
  out += '<line x1="1" y1="1" x2="' + (W - 1) + '" y2="' + (H - 1) + '" stroke="#B23E26"/>'
  out += '<line x1="' + (W - 1) + '" y1="1" x2="1" y2="' + (H - 1) + '" stroke="#B23E26"/>'
  out += '<line x1="' + cx + '" y1="1" x2="1" y2="' + cy + '" stroke="#B23E26"/>'
  out += '<line x1="' + cx + '" y1="1" x2="' + (W - 1) + '" y2="' + cy + '" stroke="#B23E26"/>'
  out += '<line x1="1" y1="' + cy + '" x2="' + cx + '" y2="' + (H - 1) + '" stroke="#B23E26"/>'
  out += '<line x1="' + (W - 1) + '" y1="' + cy + '" x2="' + cx + '" y2="' + (H - 1) + '" stroke="#B23E26"/>'
  const HP = [[cx, cy * 0.5], [cx * 0.5, cy * 0.25], [cx * 0.25, cy * 0.5], [cx * 0.5, cy], [cx * 0.25, cy * 1.5], [cx * 0.5, cy * 1.75], [cx, cy * 1.5], [cx * 1.5, cy * 1.75], [cx * 1.75, cy * 1.5], [cx * 1.5, cy], [cx * 1.75, cy * 0.5], [cx * 1.5, cy * 0.25]]
  for (let hn = 0; hn < 12; hn++) {
    const s = (ascSign + hn) % 12, p = HP[hn]
    out += '<text x="' + p[0] + '" y="' + (p[1] - 8) + '" font-size="9" fill="#6B6155" text-anchor="middle">' + SIGN_SHORT[s] + '</text>'
    const items = (hn === 0 ? ['升'] : []).concat(map[s])
    for (let i = 0; i < items.length; i++) {
      const col = i % 3, row = Math.floor(i / 3)
      out += '<text x="' + (p[0] - 23 + col * 23) + '" y="' + (p[1] + 8 + row * 16) + '" font-size="12.5" font-weight="' + (items[i] === '升' ? '700' : '400') + '" fill="' + (items[i] === '升' ? '#B23E26' : (items[i].indexOf('℞') > 0 ? '#96321E' : '#2B241C')) + '" text-anchor="middle">' + items[i] + '</text>'
    }
  }
  return out + '</svg>'
}

export default function VedicCalculator() {
  const [year, setYear] = useState(1990)
  const [month, setMonth] = useState(6)
  const [day, setDay] = useState(15)
  const [hour, setHour] = useState(12)
  const [minute, setMinute] = useState(0)
  const [cityId, setCityId] = useState('hk')
  const [manualLat, setManualLat] = useState(22.32)
  const [manualLon, setManualLon] = useState(114.17)
  const [manualTz, setManualTz] = useState(8)
  const [nodeMode, setNodeMode] = useState<'t' | 'm'>('t')
  const [chartStyle, setChartStyle] = useState<'s' | 'n'>('s')
  const [varga, setVarga] = useState(1)
  const [chart, setChart] = useState<any>(null)
  const [tzWarn, setTzWarn] = useState('')
  const [showToast, setShowToast] = useState(false)
  const chartRef = useRef<any>(null)
  const initDone = useRef(false)

  const doCast = useCallback((y: number, mo: number, d: number, h: number, mi: number, cid: string, nm: 't' | 'm', mLat: number, mLon: number, mTz: number) => {
    const dim = new Date(Date.UTC(y, mo, 0)).getUTCDate()
    if (d > dim) { alert(y + '年' + mo + '月只有 ' + dim + ' 日，請修正日期。'); return }
    let geo: { lat: number; lon: number; place: string }
    let res: { utcMs: number; offsetMin: number }
    let tzLabel: string
    setTzWarn('')

    if (cid === 'custom') {
      if (!isFinite(mLat) || !isFinite(mLon) || !isFinite(mTz) || Math.abs(mLat) > 66 || Math.abs(mLon) > 180 || mTz < -12 || mTz > 14) {
        alert('請檢查手動輸入的經緯度與時差（緯度限 ±66° 內）。'); return
      }
      geo = { lat: mLat, lon: mLon, place: '自訂地點' }
      res = { utcMs: Date.UTC(y, mo - 1, d, h, mi) - mTz * 3600000, offsetMin: Math.round(mTz * 60) }
      tzLabel = 'UTC' + (mTz >= 0 ? '+' : '') + mTz + '（手動）'
    } else {
      const c = CITIES.find(c => c.id === cid)
      if (!c) return
      geo = { lat: c.lat, lon: c.lon, place: c.name }
      if (!tzSupportOk()) {
        setTzWarn('你的瀏覽器缺少完整歷史時區資料，自動時區可能不準，建議用「手動輸入」指定時差。')
      }
      res = localToUtc(y, mo, d, h, mi, c.zone)
      const oh = res.offsetMin / 60
      const std = offsetAt(Date.UTC(y, 0, 15), c.zone)
      tzLabel = 'UTC' + (oh >= 0 ? '+' : '') + (oh % 1 === 0 ? oh : oh.toFixed(1))
      if (res.offsetMin !== std) tzLabel += '（夏令時間）'
    }

    const result = DSVED.cast({
      utcMs: res.utcMs, geolon: geo.lon, geolat: geo.lat, tzOffsetMin: res.offsetMin, nodeMode: nm,
      place: geo.place, tzLabel: tzLabel, localY: y, localMo: mo, localD: d, localH: h, localMi: mi, cityV: cid
    })
    chartRef.current = result
    setChart(result)
    setVarga(1)

    const inp = result.input
    let q = '?d=' + y + pad2(mo) + pad2(d) + '&t=' + pad2(h) + pad2(mi) + '&c=' + cid
    if (cid === 'custom') q += '&lat=' + geo.lat + '&lon=' + geo.lon + '&tz=' + (res.offsetMin / 60)
    q += '&n=' + nm
    history.replaceState(null, '', '/vedic' + q)
  }, [])

  useEffect(() => {
    if (initDone.current) return
    initDone.current = true
    const params = new URLSearchParams(window.location.search)
    const d = params.get('d')
    if (!d || !/^\d{8}$/.test(d)) return
    const y = +d.slice(0, 4), mo = +d.slice(4, 6), dy = +d.slice(6, 8)
    const t = params.get('t')
    const h = t && /^\d{4}$/.test(t) ? +t.slice(0, 2) : 12
    const mi = t && /^\d{4}$/.test(t) ? +t.slice(2, 4) : 0
    const c = params.get('c') || 'hk'
    const n = params.get('n') === 'm' ? 'm' as const : 't' as const
    setYear(y); setMonth(mo); setDay(dy); setHour(h); setMinute(mi); setCityId(c)
    if (n === 'm') setNodeMode('m')
    if (c === 'custom') {
      const lat = +(params.get('lat') || '22.32')
      const lon = +(params.get('lon') || '114.17')
      const tz = +(params.get('tz') || '8')
      setManualLat(lat); setManualLon(lon); setManualTz(tz)
      doCast(y, mo, dy, h, mi, c, n, lat, lon, tz)
    } else {
      doCast(y, mo, dy, h, mi, c, n, 0, 0, 0)
    }
  }, [doCast])

  const prevNodeMode = useRef(nodeMode)
  useEffect(() => {
    if (prevNodeMode.current !== nodeMode && chartRef.current) {
      const i = chartRef.current.input
      doCast(i.localY, i.localMo, i.localD, i.localH, i.localMi, i.cityV, nodeMode,
        i.cityV === 'custom' ? i.geolat : 0, i.cityV === 'custom' ? i.geolon : 0,
        i.cityV === 'custom' ? i.tzOffsetMin / 60 : 0)
    }
    prevNodeMode.current = nodeMode
  }, [nodeMode, doCast])

  useEffect(() => {
    const w = window as any
    w.DSAST = DSAST
    w.DSVED = DSVED
    w.__DS_TEST = {run: function(){
      var errs: string[] = [];
      var C = [{"tag":"C1_HK_1990","jd":2448203.770833333,"geolon":114.1694,"geolat":22.3193,"su":201.8570065,"mo":95.7455168,"me":212.0903975,"ve":203.5319013,"ma":48.3466391,"ju":109.0894156,"sa":266.6708662,"ram":278.2458952,"rat":277.5835742,"asc":321.5742841},{"tag":"C2_HKDST_1975","jd":2442594.458333333,"geolon":114.1694,"geolat":22.3193,"su":75.0050034,"mo":336.9603986,"me":54.2186598,"ve":119.7559551,"ma":6.3360696,"ju":358.0750383,"sa":87.0903739,"ram":215.4947433,"rat":216.6822922,"asc":91.2567506},{"tag":"C3_HK_2000","jd":2451545.145833333,"geolon":114.1694,"geolat":22.3193,"su":256.6643587,"mo":201.2220896,"me":248.2630588,"ve":217.8888907,"ma":304.2231935,"ju":1.405839,"sa":16.5395459,"ram":101.1796956,"rat":100.0926799,"asc":153.6211721},{"tag":"C4_HK_2026","jd":2461273.547222222,"geolon":114.1694,"geolat":22.3193,"su":123.7946092,"mo":224.0584757,"me":116.9046132,"ve":169.5254165,"ma":72.1299065,"ju":107.1310859,"sa":349.9855687,"ram":305.6522638,"rat":305.5991716,"asc":165.5200705},{"tag":"C5_LDN_1962","jd":2437739.0,"geolon":-0.1276,"geolat":51.5072,"su":331.1018831,"mo":87.6388146,"me":306.6910266,"ve":342.560631,"ma":309.1600612,"ju":304.3579773,"sa":284.6341151,"ram":112.7953983,"rat":114.2431995,"asc":87.6576966},{"tag":"C6_SYD_1988","jd":2447170.458333333,"geolon":151.2093,"geolat":-33.8688,"su":265.213176,"mo":149.1880658,"me":275.864514,"ve":299.3249202,"ma":217.185537,"ju":357.1773932,"sa":242.7986343,"ram":333.0032141,"rat":331.6220101,"asc":315.1959652}];
      function dd(a: number, b: number){var d=(a-b)%360;if(d>180)d-=360;if(d<-180)d+=360;return Math.abs(d);}
      function ms(jd: number){return (jd-2440587.5)*86400000;}
      var TOL: Record<string, number> = {su:0.005,mo:0.012,me:0.005,ve:0.005,ma:0.005,ju:0.005,sa:0.005,ram:0.005,rat:0.06,asc:0.012};
      for(var i=0;i<C.length;i++){
        var c=C[i];
        var r=DSVED.cast({utcMs:ms(c.jd),geolon:c.geolon,geolat:c.geolat,tzOffsetMin:480,nodeMode:'t'});
        var got: Record<string, number> = {su:r.lons.su,mo:r.lons.mo,me:r.lons.me,ve:r.lons.ve,ma:r.lons.ma,ju:r.lons.ju,sa:r.lons.sa,rat:r.lons.ra,asc:r.asc.lon};
        var rm=DSVED.cast({utcMs:ms(c.jd),geolon:c.geolon,geolat:c.geolat,tzOffsetMin:480,nodeMode:'m'});
        got.ram=rm.lons.ra;
        for(var k in TOL){
          if(dd(got[k],(c as any)[k])>TOL[k])errs.push(c.tag+':'+k+' off '+(dd(got[k],(c as any)[k])*3600).toFixed(1)+'"');
        }
        if(dd(r.lons.ke,((c as any).rat+180)%360)>0.06)errs.push(c.tag+':ketu');
      }
      var V=DSVED.varga;
      if(V(10,9)!==3)errs.push('D9 Ashvini4=Cancer');
      if(V(226.5,9)!==7)errs.push('D9 fixed');
      if(V(75.0,9)!==10)errs.push('D9 dual');
      if(V(123.8294,10)!==5)errs.push('D10 odd');
      if(V(50,10)!==3)errs.push('D10 even');
      if(V(123.8294,24)!==7)errs.push('D24 odd from Leo');
      if(V(50,24)!==((3+16)%12))errs.push('D24 even from Cancer');
      if(V(10,2)!==4||V(20,2)!==3||V(50,2)!==4||V(40,2)!==3)errs.push('D2 hora');
      if(V(200.5,30)!==2||V(75.2,30)!==8||V(37,30)!==5||V(52,30)!==9)errs.push('D30');
      if(V(359.9,60)!==10||V(0.4,60)!==0)errs.push('D60');
      if(V(100,12)!==7)errs.push('D12');
      if(V(100,7)!==11)errs.push('D7');
      var nk=DSVED.nakOf(10);
      if(nk.idx!==0||nk.pada!==4)errs.push('nak pada');
      if(DSVED.nakOf(133.34).idx!==10)errs.push('nak border');
      var c1=C[0];
      var d1=DSVED.cast({utcMs:ms(c1.jd),geolon:c1.geolon,geolat:c1.geolat,tzOffsetMin:480,nodeMode:'t'}).dasha;
      var nkIdx=Math.floor((c1.mo%360)/(360/27));
      var SEQ=['ke','ve','su','mo','ma','ra','ju','sa','me'];
      if(d1.firstLord!==SEQ[nkIdx%9])errs.push('dasha lord');
      var YRS: Record<string, number> = {ke:7,ve:20,su:6,mo:10,ma:7,ra:18,ju:16,sa:19,me:17};
      var frac=((c1.mo%360)/(360/27))-nkIdx;
      if(Math.abs(d1.balanceYears-(1-frac)*YRS[d1.firstLord])>0.02)errs.push('dasha balance');
      var tot=0;
      for(var m2=0;m2<d1.mahas.length;m2++)tot+=(d1.mahas[m2].end-d1.mahas[m2].start);
      if(Math.abs(tot/31557600000-120)>0.01)errs.push('dasha 120y');
      try{
        function off(y: number,mo: number,d: number,h: number,zone: string){
          var f=new Intl.DateTimeFormat('en-US',{timeZone:zone,hourCycle:'h23',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit'});
          var t=Date.UTC(y,mo-1,d,h);var p: Record<string,string>={};f.formatToParts(new Date(t)).forEach(function(x){p[x.type]=x.value;});
          return Math.round((Date.UTC(+p.year,(+p.month)-1,+p.day,+p.hour,+p.minute,+p.second)-t)/60000);
        }
        if(off(1975,7,1,0,'Asia/Hong_Kong')!==540)errs.push('tz HK 1975 DST(+9)');
        if(off(1990,11,8,0,'Asia/Hong_Kong')!==480)errs.push('tz HK 1990(+8)');
        if(off(1988,1,9,23,'Australia/Sydney')!==660)errs.push('tz SYD 1988 DST(+11)');
        if(off(1962,3,15,12,'Europe/London')!==0)errs.push('tz LDN 1962(GMT)');
      }catch(e: any){errs.push('tz Intl unavailable: '+e.message);}
      return errs.length?('FAIL: '+errs.join(', ')):'ALL PASS ✓ (vedic golden, '+C.length+' charts vs Swiss Ephemeris)';
    }}
  }, [])

  const geoDisplay = useMemo(() => {
    if (cityId === 'custom') return ''
    const c = CITIES.find(c => c.id === cityId)
    if (!c) return ''
    return `${c.name}：${c.lat >= 0 ? '北緯 ' + c.lat : '南緯 ' + (-c.lat)}° ${c.lon >= 0 ? '東經 ' + c.lon : '西經 ' + (-c.lon)}° · 時區按 IANA 資料庫自動判定（含歷史夏令時間）`
  }, [cityId])

  const chartSvg = useMemo(() => {
    if (!chart) return ''
    const vm = buildVargaMap(chart, varga)
    return chartStyle === 's' ? southSVG(vm.map, vm.ascSign, varga) : northSVG(vm.map, vm.ascSign)
  }, [chart, varga, chartStyle])

  const handleCast = () => {
    doCast(year, month, day, hour, minute, cityId, nodeMode, manualLat, manualLon, manualTz)
  }

  const copyLink = async () => {
    if (!chart) return
    const i = chart.input
    let q = '?d=' + i.localY + pad2(i.localMo) + pad2(i.localD) + '&t=' + pad2(i.localH) + pad2(i.localMi) + '&c=' + i.cityV
    if (i.cityV === 'custom') q += '&lat=' + i.geolat + '&lon=' + i.geolon + '&tz=' + (i.tzOffsetMin / 60)
    q += '&n=' + chart.nodeMode
    const url = window.location.origin + '/vedic' + q
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = url
      document.body.appendChild(ta)
      ta.select()
      try { document.execCommand('copy') } catch {}
      document.body.removeChild(ta)
    }
    setShowToast(true)
    setTimeout(() => setShowToast(false), 1600)
  }

  const now = Date.now()
  const cardCls = 'bg-white border border-[rgba(43,36,28,0.14)] rounded-[14px] p-[18px_16px] shadow-[0_1px_2px_rgba(43,36,28,0.04),0_4px_12px_rgba(43,36,28,0.06)] mb-4'
  const labelCls = 'block text-[13px] text-[#6B6155] mt-[10px] mb-1'
  const selectCls = 'border border-[rgba(43,36,28,0.14)] rounded-[10px] px-[10px] py-[10px] text-[15px] bg-white text-[#2B241C] w-full'
  const hintCls = 'text-[12.5px] text-[#6B6155]'
  const modeBtnCls = (on: boolean) => `flex-1 min-h-[42px] border rounded-[10px] text-[14.5px] cursor-pointer transition-colors ${on ? 'bg-[#B23E26] border-[#B23E26] text-white' : 'bg-[rgba(43,36,28,0.05)] border-[rgba(43,36,28,0.14)] text-[#2B241C]'}`
  const chipCls = (on: boolean) => `flex-none border rounded-full px-[14px] py-[6px] text-[14px] cursor-pointer whitespace-nowrap transition-colors ${on ? 'bg-[#B23E26] border-[#B23E26] text-white' : 'bg-[rgba(43,36,28,0.05)] border-[rgba(43,36,28,0.14)] text-[#2B241C]'}`

  return (
    <div className="space-y-4">
      {/* Form Card */}
      <section className={cardCls}>
        <h2 className="font-serif text-[19px] text-[#161310] m-0 mb-[10px]">排盤</h2>
        <label className={labelCls}>出生日期（陽曆）</label>
        <div className="grid grid-cols-3 gap-[10px]">
          <select className={selectCls} value={year} onChange={e => setYear(+e.target.value)}>
            {Array.from({length: 127}, (_, i) => 1900 + i).map(y => <option key={y} value={y}>{y}年</option>)}
          </select>
          <select className={selectCls} value={month} onChange={e => setMonth(+e.target.value)}>
            {Array.from({length: 12}, (_, i) => i + 1).map(m => <option key={m} value={m}>{m}月</option>)}
          </select>
          <select className={selectCls} value={day} onChange={e => setDay(+e.target.value)}>
            {Array.from({length: 31}, (_, i) => i + 1).map(d => <option key={d} value={d}>{d}日</option>)}
          </select>
        </div>
        <label className={labelCls}>出生時間（當地時間，精確到分鐘）</label>
        <div className="grid grid-cols-2 gap-[10px] max-[480px]:grid-cols-1">
          <select className={selectCls} value={hour} onChange={e => setHour(+e.target.value)}>
            {Array.from({length: 24}, (_, i) => i).map(h => <option key={h} value={h}>{pad2(h)} 時</option>)}
          </select>
          <select className={selectCls} value={minute} onChange={e => setMinute(+e.target.value)}>
            {Array.from({length: 60}, (_, i) => i).map(m => <option key={m} value={m}>{pad2(m)} 分</option>)}
          </select>
        </div>
        <p className={`${hintCls} mt-1`}>出生時間直接影響上升星座（約兩小時換一個）及高階分盤，請盡量準確；不確定可先用 12:00，並以月亮與太陽為主要參考。</p>
        <label className={labelCls}>出生地</label>
        <select className={selectCls} value={cityId} onChange={e => setCityId(e.target.value)}>
          {CITIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          <option value="custom">手動輸入</option>
        </select>
        {cityId === 'custom' && (
          <div className="grid grid-cols-3 gap-[10px] mt-2">
            <div>
              <label className="block text-[13px] text-[#6B6155] mb-1">北緯（南緯用負數）</label>
              <input type="number" className={selectCls} step="0.01" min="-66" max="66" value={manualLat} onChange={e => setManualLat(+e.target.value)} />
            </div>
            <div>
              <label className="block text-[13px] text-[#6B6155] mb-1">東經（西經用負數）</label>
              <input type="number" className={selectCls} step="0.01" min="-180" max="180" value={manualLon} onChange={e => setManualLon(+e.target.value)} />
            </div>
            <div>
              <label className="block text-[13px] text-[#6B6155] mb-1">時差（小時，例 8 或 5.5）</label>
              <input type="number" className={selectCls} step="0.25" min="-12" max="14" value={manualTz} onChange={e => setManualTz(+e.target.value)} />
            </div>
          </div>
        )}
        {cityId === 'custom' && <p className={`${hintCls} mt-1.5`}>手動模式用固定時差；請自行確認出生當日有無夏令時間。</p>}
        {cityId !== 'custom' && geoDisplay && <p className={`${hintCls} mt-1.5`}>{geoDisplay}</p>}
        <details className="mt-[10px]">
          <summary className="cursor-pointer text-[14px] text-[#6B6155]">進階選項（交點與盤式）</summary>
          <label className={labelCls}>羅睺計都（月交點）</label>
          <div className="flex gap-2 max-w-[340px] mb-2">
            <button type="button" className={modeBtnCls(nodeMode === 't')} onClick={() => setNodeMode('t')}>真交點（預設）</button>
            <button type="button" className={modeBtnCls(nodeMode === 'm')} onClick={() => setNodeMode('m')}>平均交點</button>
          </div>
        </details>
        <button type="button" onClick={handleCast} className="block w-full min-h-[48px] border-0 rounded-full bg-[#E0552C] hover:bg-[#C9461F] text-[#F7F1E5] text-[16px] font-bold cursor-pointer mt-[14px] transition-colors">排盤</button>
        {tzWarn && <div className="text-[13px] text-[#96321E] bg-[rgba(178,62,38,0.07)] border border-[rgba(178,62,38,0.2)] rounded-[10px] p-[8px_12px] mt-[10px]">{tzWarn}</div>}
        <p className={`${hintCls} mt-[10px]`}>口徑：恆星黃道 Lahiri ayanamsa · 整宮制 · 分盤按 BPHS 主流口徑 · Vimshottari 年長 365.25 日 · 城市時區按 IANA 資料庫自動判定（含歷史夏令時間）。詳見下方「排盤口徑與邊界」。</p>
      </section>

      {/* Chart Card */}
      {chart && (
        <section className={cardCls}>
          <h2 className="font-serif text-[19px] text-[#161310] m-0 mb-[10px]">命盤</h2>
          <dl className="grid grid-cols-[auto_1fr] gap-x-[14px] gap-y-[2px] text-[14px] mb-[10px]">
            <dt className="text-[#6B6155]">出生時刻</dt>
            <dd className="m-0">{chart.input.localY}-{pad2(chart.input.localMo)}-{pad2(chart.input.localD)} {pad2(chart.input.localH)}:{pad2(chart.input.localMi)}（{chart.input.place}，{chart.input.tzLabel}）</dd>
            <dt className="text-[#6B6155]">上升 Lagna</dt>
            <dd className="m-0">{chart.asc.signName} {chart.asc.degStr} · {chart.asc.nak.sk}（{chart.asc.nak.zh}）第{chart.asc.nak.pada}步</dd>
            <dt className="text-[#6B6155]">月亮宿</dt>
            <dd className="m-0">{chart.pan.moonNak.sk}（{chart.pan.moonNak.zh}）第{chart.pan.moonNak.pada}步</dd>
            <dt className="text-[#6B6155]">Ayanamsa</dt>
            <dd className="m-0">Lahiri {Math.floor(chart.ayan)}°{pad2(Math.floor((chart.ayan - Math.floor(chart.ayan)) * 60))}′{pad2(Math.round(((chart.ayan - Math.floor(chart.ayan)) * 60 - Math.floor((chart.ayan - Math.floor(chart.ayan)) * 60)) * 60))}″</dd>
          </dl>

          {/* Varga chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 my-1">
            {DSVED.VARGA_LIST.map((v: any) => (
              <button key={v.d} type="button" className={chipCls(v.d === varga)} onClick={() => setVarga(v.d)}>{v.tag}</button>
            ))}
          </div>
          <p className="text-[13px] text-[#6B6155] min-h-[1.4em] m-0 mb-[10px]">
            {(() => { const vinfo = DSVED.VARGA_LIST.find((v: any) => v.d === varga); return vinfo ? vinfo.tag + ' ' + vinfo.sk + (varga === 1 ? '：本命盤，十二宮以上升起。' : '：主「' + vinfo.zh + '」；宮位以此盤 Lagna 起。') : '' })()}
          </p>

          {/* Style toggle */}
          <div className="flex gap-2 max-w-[300px] mx-auto mb-1">
            <button type="button" className={modeBtnCls(chartStyle === 's')} onClick={() => setChartStyle('s')}>南印度式</button>
            <button type="button" className={modeBtnCls(chartStyle === 'n')} onClick={() => setChartStyle('n')}>北印度式</button>
          </div>

          {/* Chart SVG */}
          <div className="flex justify-center my-[10px] [&_svg]:max-w-full [&_svg]:h-auto" dangerouslySetInnerHTML={{ __html: chartSvg }} />
          <p className={`${hintCls} text-center m-0 mb-1.5`}>
            {chartStyle === 's' ? '南印度式：星座位置固定，左上第二格為牡羊，順時針排列；' : '北印度式：宮位位置固定，最頂菱形為第一宮，逆時針排列；'}「升」＝Lagna。
          </p>

          {/* Graha table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[13.5px] mt-2">
              <thead>
                <tr>
                  <th className="font-semibold text-[#6B6155] text-left p-[5px_6px] border-b border-[rgba(43,36,28,0.14)] whitespace-nowrap">星</th>
                  <th className="font-semibold text-[#6B6155] text-left p-[5px_6px] border-b border-[rgba(43,36,28,0.14)] whitespace-nowrap">D1 位置</th>
                  <th className="font-semibold text-[#6B6155] text-left p-[5px_6px] border-b border-[rgba(43,36,28,0.14)] whitespace-nowrap">宿（Nakshatra）</th>
                  <th className="font-semibold text-[#6B6155] text-left p-[5px_6px] border-b border-[rgba(43,36,28,0.14)] whitespace-nowrap">宮</th>
                  {varga !== 1 && <th className="font-semibold text-[#6B6155] text-left p-[5px_6px] border-b border-[rgba(43,36,28,0.14)] whitespace-nowrap">D{varga} 星座</th>}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-[5px_6px] border-b border-[rgba(43,36,28,0.07)] whitespace-nowrap"><b>上升</b></td>
                  <td className="p-[5px_6px] border-b border-[rgba(43,36,28,0.07)] whitespace-nowrap">{chart.asc.signName} {chart.asc.degStr}</td>
                  <td className="p-[5px_6px] border-b border-[rgba(43,36,28,0.07)] whitespace-nowrap">{chart.asc.nak.sk} {chart.asc.nak.zh}（{chart.asc.nak.pada}）</td>
                  <td className="p-[5px_6px] border-b border-[rgba(43,36,28,0.07)] whitespace-nowrap">1</td>
                  {varga !== 1 && <td className="p-[5px_6px] border-b border-[rgba(43,36,28,0.07)] whitespace-nowrap">{DSVED.SIGNS[chart.vargas['D' + varga].asc]}</td>}
                </tr>
                {chart.bodies.map((b: any) => (
                  <tr key={b.key}>
                    <td className="p-[5px_6px] border-b border-[rgba(43,36,28,0.07)] whitespace-nowrap">
                      {b.name}
                      {b.retro === true && <span className="text-[#B23E26]"> ℞</span>}
                      {b.dignity && <span className={`inline-block text-[11px] rounded-[6px] px-[5px] ml-[5px] ${b.dignity === '旺' ? 'bg-[#B23E26] text-white' : 'bg-[#e8a86e] text-[#2B241C]'}`}>{b.dignity}</span>}
                    </td>
                    <td className="p-[5px_6px] border-b border-[rgba(43,36,28,0.07)] whitespace-nowrap">{b.signName} {b.degStr}</td>
                    <td className="p-[5px_6px] border-b border-[rgba(43,36,28,0.07)] whitespace-nowrap">{b.nak.sk} {b.nak.zh}（{b.nak.pada}）</td>
                    <td className="p-[5px_6px] border-b border-[rgba(43,36,28,0.07)] whitespace-nowrap">{b.house}</td>
                    {varga !== 1 && <td className="p-[5px_6px] border-b border-[rgba(43,36,28,0.07)] whitespace-nowrap">{DSVED.SIGNS[chart.vargas['D' + varga][b.key]]}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className={`${hintCls} mt-1.5`}>℞＝逆行；旺／落／自宮＝行星在該星座的基本尊貴（羅睺計都不標）。宮位以整宮制、由 D1 上升起計。</p>
          </div>

          {/* Panchanga */}
          <details className="mt-[10px]">
            <summary className="cursor-pointer text-[14px] text-[#6B6155]">出生 Panchanga（五要素）</summary>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2 mt-2">
              <div className="bg-[rgba(43,36,28,0.04)] border border-[rgba(43,36,28,0.08)] rounded-[10px] p-[8px_10px] text-[13px]">
                <b className="block text-[12px] text-[#6B6155] font-semibold">曜日 Vara</b>{chart.pan.vara}
              </div>
              <div className="bg-[rgba(43,36,28,0.04)] border border-[rgba(43,36,28,0.08)] rounded-[10px] p-[8px_10px] text-[13px]">
                <b className="block text-[12px] text-[#6B6155] font-semibold">月相日 Tithi</b>{chart.pan.tithi.paksha} 第{((chart.pan.tithi.num - 1) % 15 + 1)}（{chart.pan.tithi.name}）
              </div>
              <div className="bg-[rgba(43,36,28,0.04)] border border-[rgba(43,36,28,0.08)] rounded-[10px] p-[8px_10px] text-[13px]">
                <b className="block text-[12px] text-[#6B6155] font-semibold">月宿 Nakshatra</b>{chart.pan.moonNak.sk} {chart.pan.moonNak.zh} 第{chart.pan.moonNak.pada}步
              </div>
              <div className="bg-[rgba(43,36,28,0.04)] border border-[rgba(43,36,28,0.08)] rounded-[10px] p-[8px_10px] text-[13px]">
                <b className="block text-[12px] text-[#6B6155] font-semibold">日月結合 Yoga</b>{chart.pan.yoga.name}
              </div>
              <div className="bg-[rgba(43,36,28,0.04)] border border-[rgba(43,36,28,0.08)] rounded-[10px] p-[8px_10px] text-[13px]">
                <b className="block text-[12px] text-[#6B6155] font-semibold">半日 Karana</b>{chart.pan.karana}
              </div>
              <div className="bg-[rgba(43,36,28,0.04)] border border-[rgba(43,36,28,0.08)] rounded-[10px] p-[8px_10px] text-[13px]">
                <b className="block text-[12px] text-[#6B6155] font-semibold">當地日出</b>
                {chart.pan.sunriseJd !== null ? fmtLocal(DSVED.jdUT2ms(chart.pan.sunriseJd), chart.input.tzOffsetMin).slice(11) : '—'}（曜日以日出為界）
              </div>
            </div>
          </details>

          {/* Permalink button */}
          <div className="text-center mt-3">
            <button type="button" onClick={copyLink} className="min-h-[40px] border border-[rgba(43,36,28,0.14)] rounded-[10px] bg-[rgba(43,36,28,0.05)] text-[#2B241C] text-[14px] cursor-pointer px-[14px] py-[6px] hover:bg-[rgba(43,36,28,0.1)] transition-colors">複製此盤連結</button>
          </div>
        </section>
      )}

      {/* Dasha Card */}
      {chart && (
        <section className={cardCls}>
          <h2 className="font-serif text-[19px] text-[#161310] m-0 mb-[10px]">Vimshottari 大運</h2>
          <p className={`${hintCls} m-0 mb-2`}>
            出生時月亮在 {DSVED.NAK[chart.dasha.nakIdx][0]}（{DSVED.NAK[chart.dasha.nakIdx][1]}），起運 {DSVED.GRAHA[chart.dasha.firstLord].name}大運，出生時剩餘 {chart.dasha.balanceYears.toFixed(2)} 年。
          </p>
          <div className="overflow-x-auto">
            {chart.dasha.mahas.map((m: any, mi: number) => {
              const isNow = now >= m.start && now < m.end
              return (
                <details key={mi} open={isNow}>
                  <summary className="list-none cursor-pointer">
                    <table className="w-full border-collapse text-[13.5px]">
                      <tbody>
                        <tr className={isNow ? 'bg-[rgba(178,62,38,0.07)]' : ''}>
                          <td className={`p-[5px_6px] border-b border-[rgba(43,36,28,0.07)] text-left whitespace-nowrap w-[92px] ${isNow ? 'text-[#B23E26] font-bold' : ''}`}>
                            {DSVED.GRAHA[m.lord].name}大運
                          </td>
                          <td className="p-[5px_6px] border-b border-[rgba(43,36,28,0.07)] text-left whitespace-nowrap">
                            {fmtDate(m.start, chart.input.tzOffsetMin)} 至 {fmtDate(m.end, chart.input.tzOffsetMin)}
                          </td>
                          <td className="p-[5px_6px] border-b border-[rgba(43,36,28,0.07)] text-right whitespace-nowrap w-[64px]">
                            {((m.end - m.start) / 31557600000).toFixed(0)} 年
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </summary>
                  <div className="text-[12.5px] text-[#6B6155] p-[4px_0_8px_14px] leading-[2]">
                    {m.antar.map((a: any, ai: number) => {
                      const an = now >= a.start && now < a.end
                      return (
                        <span key={ai}>
                          <b className={an ? 'text-[#B23E26]' : ''}>{DSVED.GRAHA[a.lord].name}</b>{' '}{fmtDate(a.start, chart.input.tzOffsetMin)}{'　'}
                        </span>
                      )
                    })}
                  </div>
                </details>
              )
            })}
          </div>
          <p className={`${hintCls} mt-2`}>日期以出生地時區顯示；正在行的大運與副運以硃紅標示。點開每行可見九層副運（Antardasha）。</p>
        </section>
      )}

      {/* Toast */}
      <div className={`fixed left-1/2 bottom-6 -translate-x-1/2 bg-[#161310] text-white px-[18px] py-[10px] rounded-full text-[14px] pointer-events-none z-50 transition-opacity duration-200 ${showToast ? 'opacity-100' : 'opacity-0'}`}>已複製 ✓</div>
    </div>
  )
}
