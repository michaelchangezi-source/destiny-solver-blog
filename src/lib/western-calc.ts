// Western Natal Chart Calculator
// Planetary positions using Meeus "Astronomical Algorithms" (2nd ed.)
// Accuracy: Sun ~0.01°, Moon ~0.5°, Planets ~1–2°

const RAD = Math.PI / 180
const DEG = 180 / Math.PI

function sind(d: number) { return Math.sin(d * RAD) }
function cosd(d: number) { return Math.cos(d * RAD) }
function tand(d: number) { return Math.tan(d * RAD) }
function atan2d(y: number, x: number) { return Math.atan2(y, x) * DEG }
function atand(x: number) { return Math.atan(x) * DEG }
function mod360(x: number): number { return ((x % 360) + 360) % 360 }
function sqr(x: number) { return x * x }

// ── 型別定義 ──────────────────────────────────────────────

export interface WesternInput {
  year: number
  month: number
  day: number
  hour: number    // local time hours (0–23)
  minute: number  // local time minutes
  tzOffset: number // timezone offset in hours (e.g. 8 for HKT, -5 for EST)
  lat: number     // latitude in decimal degrees (+N, -S)
  lon: number     // longitude in decimal degrees (+E, -W)
  houseSystem?: HouseSystem
}

export type PlanetKey = 'sun'|'moon'|'mercury'|'venus'|'mars'|'jupiter'|'saturn'|'uranus'|'neptune'|'pluto'|'node'

export interface PlanetPosition {
  key: PlanetKey
  name: string
  symbol: string
  lon: number       // ecliptic longitude (0–360)
  sign: string      // Chinese sign name
  signIndex: number // 0=牡羊..11=雙魚
  degree: number    // degree within sign (0–30)
  minute: number    // minute within degree
  retrograde: boolean
}

export interface WesternResult {
  input: WesternInput
  jd: number
  planets: PlanetPosition[]
  ascendant: { lon: number; sign: string; signIndex: number; degree: number; minute: number } | null
  mc: { lon: number; sign: string; signIndex: number; degree: number; minute: number } | null
  aspects: Aspect[]
  houses: HouseCusp[] | null
}

export interface Aspect {
  p1: PlanetKey
  p2: PlanetKey
  type: string
  orb: number   // degrees
  applying: boolean
}

export type HouseSystem = 'placidus' | 'whole-sign'

export interface HouseCusp {
  num: number
  lon: number
  sign: string
  signIndex: number
  degree: number
  minute: number
}

// ── 資料表 ──────────────────────────────────────────────

export const ZODIAC_CN = ['牡羊座','金牛座','雙子座','巨蟹座','獅子座','處女座','天秤座','天蠍座','射手座','摩羯座','水瓶座','雙魚座']
export const ZODIAC_EN = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces']

export const PLANET_META: Record<PlanetKey, { name: string; symbol: string }> = {
  sun:     { name: '太陽', symbol: '☉' },
  moon:    { name: '月亮', symbol: '☽' },
  mercury: { name: '水星', symbol: '☿' },
  venus:   { name: '金星', symbol: '♀' },
  mars:    { name: '火星', symbol: '♂' },
  jupiter: { name: '木星', symbol: '♃' },
  saturn:  { name: '土星', symbol: '♄' },
  uranus:  { name: '天王星', symbol: '♅' },
  neptune: { name: '海王星', symbol: '♆' },
  pluto:   { name: '冥王星', symbol: '♇' },
  node:    { name: '北交點', symbol: '☊' },
}

// Orbital elements at J2000.0 and rates per Julian century
// [L0, dL, e0, de, i0, di, node0, dnode, peri0, dperi, a]
// Source: Meeus Astronomical Algorithms Table 31.a / Simon et al. (1994)
const ORBITALS: Record<string, number[]> = {
  mercury: [252.250906,149472.6746358, 0.20563175, 0.000020406, 7.004986,-0.0059516, 48.330893,-0.1254229, 77.456119, 0.1588643, 0.3870993],
  venus:   [181.979801, 58517.8156760, 0.00677188,-0.000047766, 3.394662,-0.0008568, 76.679920,-0.2780134,131.563707, 0.0048646, 0.7233322],
  earth:   [100.466457, 35999.3728565, 0.01671022,-0.000042037, 0.000000, 0.0000000,  0.000000, 0.0000000,102.937348, 0.3225557, 1.0000026],
  mars:    [355.433275, 19140.2993313, 0.09340922, 0.000090484, 1.849726,-0.0081479, 49.558093,-0.2950981,336.060234, 0.4439016, 1.5236883],
  jupiter: [ 34.351519,  3034.9056606, 0.04849485, 0.000163244, 1.303270,-0.0019872,100.464407, 0.1119418, 14.331309, 0.2148845, 5.2029051],
  saturn:  [ 50.077444,  1222.1138488, 0.05550825,-0.000346641, 2.488879, 0.0025514,113.665524,-0.2566649, 93.057136, 0.5665415, 9.5370057],
  uranus:  [314.055005,   428.4669983, 0.04629590,-0.000027337, 0.769953, 0.0008985, 74.005957, 0.0741431,173.005291, 0.0893212,19.1892635],
  neptune: [304.348665,   218.4862002, 0.00898809, 0.000006408, 1.769952,-0.0093283,131.784057,-0.0061651, 48.120276, 0.0291867,30.0689634],
  pluto:   [238.928524,   145.2078819, 0.24880766, 0.000006546,17.141750, 0.0000000,110.303347,-0.0112948,224.066100,-132.33200,39.4820426],
}

// Aspect definitions
const ASPECT_DEFS = [
  { name: '合相', angle: 0,   orb: 8 },
  { name: '六分相', angle: 60,  orb: 5 },
  { name: '四分相', angle: 90,  orb: 7 },
  { name: '三分相', angle: 120, orb: 7 },
  { name: '對分相', angle: 180, orb: 8 },
]

// ── 日期與時間函數 ──────────────────────────────────────────

export function julianDay(y: number, m: number, d: number, ut: number): number {
  if (m <= 2) { y -= 1; m += 12 }
  const A = Math.floor(y / 100)
  const B = 2 - A + Math.floor(A / 4)
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5 + ut / 24
}

// ── 太陽 ──────────────────────────────────────────────────

function sunPosition(T: number): { lon: number; R: number } {
  const L0 = mod360(280.46646 + 36000.76983 * T + 0.0003032 * T * T)
  const M  = mod360(357.52911 + 35999.05029 * T - 0.0001537 * T * T)
  const e  = 0.016708634 - 0.000042037 * T - 0.0000001267 * T * T
  const C  = (1.914602 - 0.004817 * T - 0.000014 * T * T) * sind(M)
           + (0.019993 - 0.000101 * T) * sind(2 * M)
           + 0.000289 * sind(3 * M)
  const lon = mod360(L0 + C)
  const v   = mod360(M + C)
  const R   = 1.000001018 * (1 - e * e) / (1 + e * cosd(v))
  return { lon, R }
}

// ── 月亮 ──────────────────────────────────────────────────

function moonPosition(T: number): number {
  const D  = mod360(297.85036 + 445267.11480 * T - 0.001914 * sqr(T) + sqr(T) * T / 189474)
  const M  = mod360(357.52772 + 35999.05034 * T - 0.000160 * sqr(T) - sqr(T) * T / 300000)
  const Mp = mod360(134.96298 + 477198.86736 * T + 0.008997 * sqr(T) + sqr(T) * T / 69699)
  const F  = mod360(93.27191  + 483202.01753 * T - 0.003403 * sqr(T) - sqr(T) * T / 3526000)
  const L0 = mod360(218.3165 + 481267.8813 * T)

  // Main longitude terms (Meeus Table 47.a, top terms)
  let Sl = 6288774 * sind(Mp)
         + 1274027 * sind(2*D - Mp)
         +  658314 * sind(2*D)
         +  213618 * sind(2*Mp)
         -  185116 * sind(M)
         -  114332 * sind(2*F)
         +   58793 * sind(2*D - 2*Mp)
         +   57066 * sind(2*D - M - Mp)
         +   53322 * sind(2*D + Mp)
         +   45758 * sind(2*D - M)
         -   40923 * sind(M - Mp)
         -   34720 * sind(D)
         -   30383 * sind(M + Mp)
         +   15327 * sind(2*D - 2*F)
         -   12528 * sind(Mp + 2*F)
         +   10980 * sind(Mp - 2*F)
         +   10675 * sind(4*D - Mp)
         +   10034 * sind(3*Mp)
         +    8548 * sind(4*D - 2*Mp)
         -    7888 * sind(2*D + M - Mp)
         -    6766 * sind(2*D + M)
         -    5163 * sind(D - Mp)
         +    4987 * sind(D + M)
         +    4036 * sind(2*D - M + Mp)
         +    3994 * sind(2*D + 2*Mp)
         +    3861 * sind(4*D)
         +    3665 * sind(2*D - 3*Mp)
         -    2689 * sind(M - 2*Mp)
         -    2602 * sind(2*D - Mp + 2*F)
         +    2390 * sind(2*D - M - 2*Mp)
         -    2348 * sind(D + Mp)
         +    2236 * sind(2*D - 2*M)
         -    2120 * sind(M + 2*Mp)
         -    2069 * sind(2*M)
         +    2048 * sind(2*D - 2*M - Mp)
         -    1773 * sind(2*D + Mp - 2*F)
         -    1595 * sind(2*F + 2*D)
         +    1215 * sind(4*D - M - Mp)
         -    1110 * sind(2*Mp + 2*F)
         -     892 * sind(3*D - Mp)
         -     810 * sind(2*D + M + Mp)
         +     759 * sind(4*D - M - 2*Mp)
         -     713 * sind(2*M - Mp)
         -     700 * sind(2*D + 2*M - Mp)
         +     691 * sind(2*D + M - 2*Mp)
         +     596 * sind(2*D - M + 2*F)
         +     549 * sind(4*D + Mp)
         +     537 * sind(4*Mp)
         +     520 * sind(4*D - M)
         -     487 * sind(D - 2*Mp)
         -     399 * sind(2*F + M)
         -     381 * sind(2*Mp - 2*F)
         +     351 * sind(D + M + Mp)
         -     340 * sind(3*D - 2*Mp)
         +     330 * sind(4*D - 3*Mp)
         +     327 * sind(2*D - M + 2*Mp)
         -     323 * sind(2*M + Mp)
         +     299 * sind(D + M - Mp)
         +     294 * sind(2*D + 3*Mp)

  return mod360(L0 + Sl / 1000000)
}

// ── 行星（太陽系）──────────────────────────────────────────

interface HelioPos { lon: number; lat: number; R: number }

function equationOfCenter(M: number, e: number): number {
  // M in degrees, e is eccentricity
  return (2*e - sqr(e)*e/4) * sind(M)
       + (5*sqr(e)/4) * sind(2*M)
       + (13*sqr(e)*e/12) * sind(3*M)
}

function heliocentricPos(key: string, T: number): HelioPos {
  const el = ORBITALS[key]
  const [L0,dL,e0,de,i0,di,N0,dN,w0,dw,a] = el
  const L = mod360(L0 + dL * T)
  const e = e0 + de * T
  const i = i0 + di * T
  const N = mod360(N0 + dN * T)  // longitude of ascending node
  const w = mod360(w0 + dw * T)  // longitude of perihelion
  const M = mod360(L - w)        // mean anomaly
  const C = equationOfCenter(M, e)
  const v = mod360(M + C)        // true anomaly
  const r = a * (1 - e*e) / (1 + e * cosd(v))
  // Heliocentric ecliptic longitude
  const trueLon = mod360(v + w)
  // Heliocentric ecliptic latitude (simplified: sin(β) = sin(i)*sin(l-N))
  const lat = Math.asin(sind(i) * sind(trueLon - N)) * DEG
  return { lon: trueLon, lat, R: r }
}

// Convert heliocentric to geocentric ecliptic coordinates
function helioToGeo(planet: HelioPos, earth: HelioPos): { lon: number; lat: number } {
  // Convert to rectangular heliocentric ecliptic
  const xp = planet.R * cosd(planet.lat) * cosd(planet.lon)
  const yp = planet.R * cosd(planet.lat) * sind(planet.lon)
  const zp = planet.R * sind(planet.lat)

  const xe = earth.R * cosd(earth.lat) * cosd(earth.lon)
  const ye = earth.R * cosd(earth.lat) * sind(earth.lon)
  const ze = earth.R * sind(earth.lat)

  // Geocentric rectangular
  const dx = xp - xe
  const dy = yp - ye
  const dz = zp - ze

  const lon = mod360(atan2d(dy, dx))
  const dist = Math.sqrt(dx*dx + dy*dy + dz*dz)
  const lat = Math.asin(dz / dist) * DEG
  return { lon, lat }
}

// Get geocentric ecliptic longitude for each planet
function planetPositions(T: number, sun: { lon: number; R: number }): Record<string, number> {
  // Earth's heliocentric position = opposite of Sun's geocentric direction
  const earthHel: HelioPos = {
    lon: mod360(sun.lon + 180),
    lat: 0,
    R: sun.R,
  }

  const result: Record<string, number> = {
    sun: sun.lon,
  }

  for (const key of ['mercury','venus','mars','jupiter','saturn','uranus','neptune','pluto']) {
    const hel = heliocentricPos(key, T)
    const geo = helioToGeo(hel, earthHel)
    result[key] = geo.lon
  }

  return result
}

// ── 北交點 ──────────────────────────────────────────────

function northNode(T: number): number {
  // Mean ascending node of Moon (Meeus p. 144)
  return mod360(125.04452 - 1934.136261 * T + 0.0020708 * T * T + T * T * T / 450000)
}

// ── 恆星時與上升點 ──────────────────────────────────────────

// Obliquity of ecliptic (Meeus Eq. 22.2)
function obliquity(T: number): number {
  const U = T / 100
  return 23.439291111 - 4680.93 / 3600 * U
    - 1.55 / 3600 * U * U + 1999.25 / 3600 * U * U * U
    - 51.38 / 3600 * Math.pow(U, 4) - 249.67 / 3600 * Math.pow(U, 5)
    - 39.05 / 3600 * Math.pow(U, 6) + 7.12 / 3600 * Math.pow(U, 7)
    + 27.87 / 3600 * Math.pow(U, 8) + 5.79 / 3600 * Math.pow(U, 9)
    + 2.45 / 3600 * Math.pow(U, 10)
}

// Greenwich Mean Sidereal Time in degrees (Meeus Eq. 12.4)
function gmst(jd: number): number {
  const T = (jd - 2451545.0) / 36525
  const theta = 280.46061837 + 360.98564736629 * (jd - 2451545.0)
              + 0.000387933 * T * T - T * T * T / 38710000
  return mod360(theta)
}

// Local Mean Sidereal Time in degrees
function lmst(jd: number, lonE: number): number {
  return mod360(gmst(jd) + lonE)
}

// Ascendant ecliptic longitude (Meeus p. 99)
function calcAscendant(lstDeg: number, lat: number, eps: number): number {
  const ramc = lstDeg // RAMC = local sidereal time in degrees
  const y = -cosd(ramc)
  const x = sind(eps) * tand(lat) + cosd(eps) * sind(ramc)
  return mod360(atan2d(y, x) + 180)
}

// Midheaven (MC) ecliptic longitude
function calcMC(lstDeg: number, eps: number): number {
  const ramc = lstDeg
  return mod360(atan2d(sind(ramc), cosd(ramc) * cosd(eps)))
}

// ── 逆行判斷 ──────────────────────────────────────────────

// Approximate retrograde by checking position 1 day before/after
function isRetrograde(key: string, T: number): boolean {
  if (key === 'sun' || key === 'moon' || key === 'node') return false
  const dt = 1 / 36525  // 1 day in Julian centuries
  const sun1 = sunPosition(T - dt)
  const sun2 = sunPosition(T + dt)
  const earthHel1: HelioPos = { lon: mod360(sun1.lon + 180), lat: 0, R: sun1.R }
  const earthHel2: HelioPos = { lon: mod360(sun2.lon + 180), lat: 0, R: sun2.R }

  if (!(key in ORBITALS)) return false
  const h1 = heliocentricPos(key, T - dt)
  const h2 = heliocentricPos(key, T + dt)
  const g1 = helioToGeo(h1, earthHel1)
  const g2 = helioToGeo(h2, earthHel2)

  let diff = g2.lon - g1.lon
  if (diff > 180) diff -= 360
  if (diff < -180) diff += 360
  return diff < 0
}

// ── 相位計算 ──────────────────────────────────────────────

function calcAspects(positions: Record<PlanetKey, number>): Aspect[] {
  const keys = ['sun','moon','mercury','venus','mars','jupiter','saturn','uranus','neptune','pluto'] as PlanetKey[]
  const aspects: Aspect[] = []

  for (let i = 0; i < keys.length; i++) {
    for (let j = i + 1; j < keys.length; j++) {
      const k1 = keys[i], k2 = keys[j]
      let diff = Math.abs(positions[k1] - positions[k2])
      if (diff > 180) diff = 360 - diff
      for (const asp of ASPECT_DEFS) {
        const orb = Math.abs(diff - asp.angle)
        if (orb <= asp.orb) {
          aspects.push({ p1: k1, p2: k2, type: asp.name, orb: Math.round(orb * 10) / 10, applying: false })
        }
      }
    }
  }
  return aspects
}

// ── 黃道帶換算 ──────────────────────────────────────────────

function lonToSign(lon: number): { sign: string; signIndex: number; degree: number; minute: number } {
  const n = lon % 360
  const idx = Math.floor(n / 30)
  const deg = n - idx * 30
  return {
    sign: ZODIAC_CN[idx],
    signIndex: idx,
    degree: Math.floor(deg),
    minute: Math.floor((deg - Math.floor(deg)) * 60),
  }
}

// ── 宮位計算 ──────────────────────────────────────────────

function placidusCuspIter(
  ramc: number, lat: number, eps: number,
  fraction: number, aboveHorizon: boolean
): number {
  let dec = 0
  let lon = 0
  for (let i = 0; i < 50; i++) {
    const tp = tand(lat) * tand(dec)
    const ad = Math.asin(Math.max(-1, Math.min(1, tp))) * DEG
    const dsa = 90 + ad
    const nsa = 90 - ad
    const ra = aboveHorizon
      ? mod360(ramc + fraction * dsa)
      : mod360(ramc + dsa + fraction * nsa)
    lon = mod360(atan2d(sind(ra), cosd(ra) * cosd(eps)))
    const newDec = Math.asin(sind(eps) * sind(lon)) * DEG
    if (Math.abs(newDec - dec) < 0.0001) break
    dec = newDec
  }
  return lon
}

function calcHouseCusps(
  system: HouseSystem,
  ascLon: number, mcLon: number,
  ramc: number, lat: number, eps: number
): HouseCusp[] {
  const lons: number[] = new Array(12)
  if (system === 'whole-sign') {
    const ascSign = Math.floor(ascLon / 30)
    for (let i = 0; i < 12; i++) {
      lons[i] = ((ascSign + i) % 12) * 30
    }
  } else {
    lons[0] = ascLon
    lons[3] = mod360(mcLon + 180)
    lons[6] = mod360(ascLon + 180)
    lons[9] = mcLon
    lons[10] = placidusCuspIter(ramc, lat, eps, 1 / 3, true)
    lons[11] = placidusCuspIter(ramc, lat, eps, 2 / 3, true)
    lons[1] = placidusCuspIter(ramc, lat, eps, 1 / 3, false)
    lons[2] = placidusCuspIter(ramc, lat, eps, 2 / 3, false)
    lons[4] = mod360(lons[10] + 180)
    lons[5] = mod360(lons[11] + 180)
    lons[7] = mod360(lons[1] + 180)
    lons[8] = mod360(lons[2] + 180)
  }
  return lons.map((l, i) => ({ num: i + 1, lon: l, ...lonToSign(l) }))
}

// ── 主計算函數 ──────────────────────────────────────────────

export function calcWestern(input: WesternInput): WesternResult {
  const { year, month, day, hour, minute, tzOffset, lat, lon } = input

  // Convert local time to UT
  const ut = hour + minute / 60 - tzOffset
  const jd = julianDay(year, month, day, ut)
  const T = (jd - 2451545.0) / 36525

  const sun = sunPosition(T)
  const moonLon = moonPosition(T)
  const earthHel: HelioPos = { lon: mod360(sun.lon + 180), lat: 0, R: sun.R }

  const rawPositions: Record<string, number> = {
    sun: sun.lon,
    moon: moonLon,
    node: northNode(T),
  }

  for (const key of ['mercury','venus','mars','jupiter','saturn','uranus','neptune','pluto']) {
    const hel = heliocentricPos(key, T)
    const geo = helioToGeo(hel, earthHel)
    rawPositions[key] = geo.lon
  }

  const ORDER: PlanetKey[] = ['sun','moon','mercury','venus','mars','jupiter','saturn','uranus','neptune','pluto','node']

  const planets: PlanetPosition[] = ORDER.map(key => {
    const l = rawPositions[key]
    const { sign, signIndex, degree, minute: m } = lonToSign(l)
    const meta = PLANET_META[key]
    return {
      key,
      name: meta.name,
      symbol: meta.symbol,
      lon: l,
      sign,
      signIndex,
      degree,
      minute: m,
      retrograde: isRetrograde(key, T),
    }
  })

  // Ascendant and MC (require birth location)
  let ascendant: WesternResult['ascendant'] = null
  let mc: WesternResult['mc'] = null

  let houses: HouseCusp[] | null = null

  if (lat !== 0 || lon !== 0) {
    const eps = obliquity(T)
    const lst = lmst(jd, lon)
    const ascLon = calcAscendant(lst, lat, eps)
    const mcLon  = calcMC(lst, eps)
    ascendant = { lon: ascLon, ...lonToSign(ascLon) }
    mc = { lon: mcLon, ...lonToSign(mcLon) }
    houses = calcHouseCusps(input.houseSystem || 'placidus', ascLon, mcLon, lst, lat, eps)
  }

  const posMap = {} as Record<PlanetKey, number>
  for (const p of planets) posMap[p.key] = p.lon
  const aspects = calcAspects(posMap)

  return { input, jd, planets, ascendant, mc, aspects, houses }
}

// ── AI Pack 用：格式化輸出 ──────────────────────────────────

export function formatDegree(lon: number): string {
  const { sign, degree, minute } = lonToSign(lon)
  return `${sign} ${degree}°${minute}'`
}
