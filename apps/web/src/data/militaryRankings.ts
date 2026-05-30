export interface MilitaryProfile {
  rank: number;
  score: number;          // 0–100 (higher = stronger)
  nuclear: boolean;
  activePersonnel: number; // thousands
  budgetBnUsd: number;
  highlights: string;
}

// 2023 rankings (sources: GFP 2023, IISS Military Balance, SIPRI)
export const MILITARY_2023: Record<string, MilitaryProfile> = {
  USA: { rank: 1,  score: 87, nuclear: true,  activePersonnel: 1400, budgetBnUsd: 858, highlights: 'World\'s largest defense budget. 11 carrier battle groups. Unmatched global power-projection.' },
  RUS: { rank: 2,  score: 80, nuclear: true,  activePersonnel: 900,  budgetBnUsd: 109, highlights: 'World\'s largest nuclear stockpile. Permanent UNSC seat. Engaged in Ukraine since 2022.' },
  CHN: { rank: 3,  score: 79, nuclear: true,  activePersonnel: 2000, budgetBnUsd: 225, highlights: 'Largest military by personnel. Rapid naval expansion — 3 carriers. Growing global reach.' },
  IND: { rank: 4,  score: 72, nuclear: true,  activePersonnel: 1450, budgetBnUsd: 81,  highlights: 'World\'s 3rd-largest military by personnel. Top arms importer. Ballistic missile program.' },
  GBR: { rank: 5,  score: 65, nuclear: true,  activePersonnel: 150,  budgetBnUsd: 74,  highlights: 'Two Queen Elizabeth-class carriers. Permanent UNSC seat. Key NATO partner.' },
  KOR: { rank: 6,  score: 64, nuclear: false, activePersonnel: 555,  budgetBnUsd: 47,  highlights: 'Highly trained conscript army. Advanced K2 tank & K9 howitzer programs. Faces NK threat.' },
  PAK: { rank: 7,  score: 63, nuclear: true,  activePersonnel: 654,  budgetBnUsd: 10,  highlights: 'Nuclear-armed regional power. World\'s 6th-largest army. Tense India rivalry.' },
  JPN: { rank: 8,  score: 62, nuclear: false, activePersonnel: 247,  budgetBnUsd: 50,  highlights: 'Rapid rearmament since 2022. F-35 fleet. Acquiring Tomahawk land-attack missiles.' },
  FRA: { rank: 9,  score: 61, nuclear: true,  activePersonnel: 203,  budgetBnUsd: 64,  highlights: 'Sole EU nuclear power. Charles de Gaulle carrier. Extensive overseas bases.' },
  ITA: { rank: 10, score: 56, nuclear: false, activePersonnel: 165,  budgetBnUsd: 32,  highlights: 'Two carriers (Cavour, Trieste). Advanced aerospace-naval industry. NATO Mediterranean anchor.' },
  DEU: { rank: 11, score: 55, nuclear: false, activePersonnel: 183,  budgetBnUsd: 55,  highlights: 'Bundeswehr rapid modernization post-2022. Largest European NATO member by potential.' },
  TUR: { rank: 12, score: 54, nuclear: false, activePersonnel: 355,  budgetBnUsd: 33,  highlights: 'NATO\'s 2nd-largest army. Drone superpower (Bayraktar TB2). Regional power broker.' },
  BRA: { rank: 13, score: 53, nuclear: false, activePersonnel: 335,  budgetBnUsd: 25,  highlights: 'South America\'s dominant military. Large reserve force. Regionally dominant navy.' },
  PRK: { rank: 14, score: 52, nuclear: true,  activePersonnel: 1280, budgetBnUsd: 4,   highlights: 'Nuclear-armed rogue state. World\'s 4th-largest army by headcount. Expanding ICBM capability.' },
  EGY: { rank: 15, score: 51, nuclear: false, activePersonnel: 440,  budgetBnUsd: 11,  highlights: 'Africa\'s largest military. US-supplied F-16s. Top Middle East arms importer.' },
  IRN: { rank: 16, score: 50, nuclear: false, activePersonnel: 610,  budgetBnUsd: 10,  highlights: 'Near-nuclear threshold. Drone export superpower. Advanced ballistic missile arsenal.' },
  SAU: { rank: 17, score: 49, nuclear: false, activePersonnel: 227,  budgetBnUsd: 75,  highlights: 'World\'s #1 arms importer. F-15, Typhoon, Patriot SAM mix. Yemen war experience.' },
  ISR: { rank: 18, score: 48, nuclear: true,  activePersonnel: 170,  budgetBnUsd: 24,  highlights: 'Assumed nuclear capability (Samson Option). Iron Dome + David\'s Sling. US QME doctrine.' },
  IDN: { rank: 19, score: 47, nuclear: false, activePersonnel: 395,  budgetBnUsd: 10,  highlights: 'SE Asia\'s largest military. Rafale acquisition underway. Maritime strategic focus.' },
  AUS: { rank: 20, score: 46, nuclear: false, activePersonnel: 60,   budgetBnUsd: 39,  highlights: 'AUKUS nuclear submarine program. F-35A fleet. Five Eyes intelligence partner.' },
  POL: { rank: 21, score: 45, nuclear: false, activePersonnel: 216,  budgetBnUsd: 33,  highlights: 'Fastest-growing NATO European army. K2 tanks from Korea. 4% GDP defense target.' },
  UKR: { rank: 22, score: 44, nuclear: false, activePersonnel: 700,  budgetBnUsd: 44,  highlights: 'Major recipient of Western arms since 2022. Battle-hardened against Russia.' },
  ESP: { rank: 23, score: 43, nuclear: false, activePersonnel: 121,  budgetBnUsd: 20,  highlights: 'STOVL carrier Juan Carlos I. F/A-18 fleet. NATO southern flank pillar.' },
  ARG: { rank: 24, score: 42, nuclear: false, activePersonnel: 73,   budgetBnUsd: 5,   highlights: 'Regional naval tradition. F-16 acquisition (2023). Falklands sovereignty dispute.' },
  CAN: { rank: 25, score: 41, nuclear: false, activePersonnel: 68,   budgetBnUsd: 27,  highlights: 'NORAD co-commander with USA. F-35 incoming. CP-140 Aurora ASW aircraft.' },
  GRC: { rank: 26, score: 40, nuclear: false, activePersonnel: 142,  budgetBnUsd: 12,  highlights: 'Highest NATO European defense spend (% GDP). F-35 incoming. Aegean tension with Turkey.' },
  SWE: { rank: 27, score: 39, nuclear: false, activePersonnel: 25,   budgetBnUsd: 12,  highlights: 'Joined NATO 2024. JAS 39 Gripen. A26 Blekinge-class submarines on order.' },
  NOR: { rank: 28, score: 38, nuclear: false, activePersonnel: 23,   budgetBnUsd: 10,  highlights: 'F-35A fleet operational. Arctic warfare specialists. JSM anti-ship missile developer.' },
  NLD: { rank: 29, score: 37, nuclear: false, activePersonnel: 40,   budgetBnUsd: 20,  highlights: 'NATO nuclear sharing participant. F-35A fleet. De Zeven Provinciën-class frigates.' },
  ZAF: { rank: 30, score: 36, nuclear: false, activePersonnel: 77,   budgetBnUsd: 4,   highlights: 'Historically nuclear-armed (dismantled 1989). Africa\'s most capable conventional force.' },
  VNM: { rank: 31, score: 35, nuclear: false, activePersonnel: 480,  budgetBnUsd: 8,   highlights: 'Battle-hardened from decades of war. Kilo-class submarine fleet. Russian-supplied AD.' },
  THA: { rank: 32, score: 34, nuclear: false, activePersonnel: 360,  budgetBnUsd: 8,   highlights: 'HTMS Chakri Naruebet carrier (limited). F-16 fleet. Regional HADR contributor.' },
  ARE: { rank: 33, score: 33, nuclear: false, activePersonnel: 63,   budgetBnUsd: 22,  highlights: 'F-35 deal pending. Advanced Patriot/THAAD systems. Yemen coalition experience.' },
  SGP: { rank: 34, score: 32, nuclear: false, activePersonnel: 72,   budgetBnUsd: 12,  highlights: 'F-35B incoming. Leopard 2A4 tanks. SE Asia\'s largest air force per capita.' },
  CHE: { rank: 35, score: 30, nuclear: false, activePersonnel: 22,   budgetBnUsd: 6,   highlights: 'F-35A purchased 2021. Militia-based conscript army. Historically neutral but capable.' },
  MYS: { rank: 36, score: 29, nuclear: false, activePersonnel: 113,  budgetBnUsd: 4,   highlights: 'Two Scorpène submarines. Su-30MKM Flankers. South China Sea maritime focus.' },
  TWN: { rank: 37, score: 28, nuclear: false, activePersonnel: 165,  budgetBnUsd: 17,  highlights: 'F-16V upgrades. Tien Kung SAMs. Key US arms recipient contested by PRC.' },
  PHL: { rank: 38, score: 27, nuclear: false, activePersonnel: 136,  budgetBnUsd: 5,   highlights: 'Modernizing with US support. South China Sea disputes. EDCA base access agreements.' },
  MMR: { rank: 39, score: 26, nuclear: false, activePersonnel: 350,  budgetBnUsd: 3,   highlights: 'Junta-controlled since 2021. Large but low-tech force. Under international arms embargo.' },
  COL: { rank: 40, score: 25, nuclear: false, activePersonnel: 293,  budgetBnUsd: 14,  highlights: 'Counterinsurgency-experienced. F-16 incoming. US-aligned since Plan Colombia.' },
  NGA: { rank: 41, score: 24, nuclear: false, activePersonnel: 135,  budgetBnUsd: 4,   highlights: 'West Africa\'s dominant force. Fighting Boko Haram. A-29 Super Tucano jets.' },
  ETH: { rank: 42, score: 23, nuclear: false, activePersonnel: 140,  budgetBnUsd: 3,   highlights: 'Sub-Saharan Africa\'s largest army. Tigray war (2020–22) transformed force structure.' },
  DZA: { rank: 43, score: 22, nuclear: false, activePersonnel: 130,  budgetBnUsd: 18,  highlights: 'Africa\'s top defense spender. S-400 acquired from Russia. Su-57 talks ongoing.' },
  MAR: { rank: 44, score: 21, nuclear: false, activePersonnel: 196,  budgetBnUsd: 6,   highlights: 'F-16 fleet. Abrams tanks. Western Sahara dispute drives procurement.' },
  IRQ: { rank: 45, score: 20, nuclear: false, activePersonnel: 195,  budgetBnUsd: 7,   highlights: 'Rebuilt post-2003. ISOF elite counter-terror units. F-16IQ fighters.' },
  CHL: { rank: 46, score: 19, nuclear: false, activePersonnel: 78,   budgetBnUsd: 6,   highlights: 'Advanced Leopard 2A4 tanks. F-16 fleet. South American stability anchor.' },
  PER: { rank: 47, score: 18, nuclear: false, activePersonnel: 120,  budgetBnUsd: 4,   highlights: 'MiG-29 and Su-25 mix. Amazon jungle warfare specialists.' },
  KWT: { rank: 48, score: 17, nuclear: false, activePersonnel: 17,   budgetBnUsd: 7,   highlights: 'US-armed Gulf state. F/A-18 and Typhoon mix. Hosts US CENTCOM forward base.' },
  QAT: { rank: 49, score: 16, nuclear: false, activePersonnel: 16,   budgetBnUsd: 5,   highlights: 'Al Udeid — largest US base in Middle East. Rafale fleet. Gas wealth funded.' },
  CZE: { rank: 50, score: 15, nuclear: false, activePersonnel: 28,   budgetBnUsd: 5,   highlights: 'F-35 incoming. Leopard 2 tanks. NATO eastern flank logistics hub.' },
  FIN: { rank: 51, score: 14, nuclear: false, activePersonnel: 23,   budgetBnUsd: 7,   highlights: 'Joined NATO 2023. F-35 incoming. 280,000-strong wartime reserve. Russia-border hardened.' },
};

// Year bounds for historical entities
const HISTORICAL_ENTITY_YEARS: Record<string, { from: number; to: number }> = {
  REI:     { from: 1721, to: 1917 },
  GEI:     { from: 1871, to: 1918 },
  AHU:     { from: 1867, to: 1918 },
  OTT:     { from: 1299, to: 1922 },
  GBR_EMP: { from: 1600, to: 1960 },
  FRA_EMP: { from: 1830, to: 1962 },
  NAZ:     { from: 1933, to: 1945 },
  JAI:     { from: 1868, to: 1945 },
  IFA:     { from: 1922, to: 1943 },
  SUN:     { from: 1922, to: 1991 },
};

// Historical strength scores at key checkpoints (major powers with notable trajectories)
const HISTORICAL_CHECKPOINTS: Record<string, Record<number, number>> = {
  // --- Historical entities ---
  REI:     { 1914: 75, 1917: 62 },
  GEI:     { 1914: 88, 1917: 82, 1918: 50 },
  AHU:     { 1914: 52, 1917: 40 },
  OTT:     { 1914: 30, 1917: 20 },
  GBR_EMP: { 1914: 85, 1918: 82, 1939: 72, 1945: 70, 1950: 62 },
  FRA_EMP: { 1914: 72, 1918: 68, 1939: 62, 1940: 28, 1945: 42, 1950: 55 },
  NAZ:     { 1933: 62, 1937: 80, 1939: 92, 1943: 88, 1944: 62 },
  JAI:     { 1914: 55, 1930: 65, 1937: 75, 1943: 78, 1944: 58 },
  IFA:     { 1922: 30, 1935: 42, 1940: 45, 1943: 22 },
  SUN:     { 1922: 40, 1939: 65, 1945: 88, 1950: 85, 1960: 82, 1968: 78, 1980: 76, 1985: 78, 1991: 65 },

  // --- Modern countries with significant historical trajectory ---
  USA: { 1914: 22, 1917: 38, 1918: 55, 1939: 28, 1942: 78, 1945: 100, 1950: 90, 1960: 88, 1970: 82, 1980: 80, 1985: 84, 1991: 92, 2000: 88, 2010: 85, 2023: 87 },
  GBR: { 1914: 85, 1918: 82, 1939: 72, 1945: 70, 1960: 60, 1970: 55, 1980: 52, 1991: 50, 2000: 55, 2010: 60, 2023: 65 },
  FRA: { 1914: 72, 1918: 68, 1939: 62, 1940: 28, 1945: 40, 1960: 52, 1970: 56, 1980: 55, 1991: 53, 2000: 56, 2010: 58, 2023: 61 },
  DEU: { 1919: 8, 1933: 15, 1945: 0, 1955: 8, 1970: 32, 1980: 42, 1991: 42, 2000: 45, 2010: 48, 2023: 55 },
  JPN: { 1952: 5, 1960: 15, 1970: 25, 1980: 35, 1991: 38, 2000: 44, 2010: 50, 2023: 62 },
  CHN: { 1914: 8, 1939: 12, 1945: 18, 1950: 35, 1960: 42, 1970: 48, 1980: 52, 1991: 56, 2000: 62, 2010: 72, 2023: 79 },
  RUS: { 1992: 55, 2000: 60, 2005: 65, 2010: 68, 2015: 75, 2023: 80 },
  IND: { 1947: 20, 1960: 25, 1970: 30, 1985: 38, 1991: 42, 2000: 50, 2010: 62, 2023: 72 },
  TUR: { 1923: 20, 1940: 32, 1960: 40, 1970: 42, 1980: 44, 1991: 46, 2000: 48, 2010: 50, 2023: 54 },
  ITA: { 1945: 5, 1960: 22, 1970: 28, 1980: 35, 1991: 40, 2000: 44, 2010: 50, 2023: 56 },
  KOR: { 1953: 10, 1960: 15, 1970: 22, 1980: 32, 1991: 38, 2000: 48, 2010: 56, 2023: 64 },
  PRK: { 1953: 15, 1960: 20, 1970: 28, 1980: 34, 1991: 36, 2000: 40, 2010: 46, 2023: 52 },
  PAK: { 1947: 12, 1960: 18, 1970: 22, 1980: 30, 1985: 38, 1998: 50, 2000: 52, 2010: 56, 2023: 63 },
  ISR: { 1948: 12, 1960: 28, 1967: 38, 1980: 42, 1991: 44, 2000: 46, 2010: 48, 2023: 48 },
  SAU: { 1970: 12, 1980: 22, 1991: 28, 2000: 35, 2010: 42, 2023: 49 },
  IRN: { 1960: 20, 1970: 28, 1979: 18, 1988: 22, 2000: 35, 2010: 42, 2023: 50 },
  EGY: { 1948: 12, 1967: 20, 1973: 28, 1980: 32, 1991: 34, 2000: 38, 2010: 44, 2023: 51 },
  POL: { 1920: 25, 1939: 30, 1950: 20, 1980: 30, 2000: 32, 2010: 38, 2023: 45 },
  BRA: { 1945: 12, 1970: 25, 1980: 32, 2000: 44, 2010: 50, 2023: 53 },
  AUS: { 1939: 18, 1945: 32, 1950: 22, 1970: 28, 2000: 35, 2010: 40, 2023: 46 },
};

// Maps historical entity ISO3 → modern territory ISO3 (for map coloring)
const HISTORICAL_TO_MODERN: Record<string, string> = {
  REI: 'RUS', SUN: 'RUS', GEI: 'DEU', NAZ: 'DEU',
  AHU: 'AUT', OTT: 'TUR', GBR_EMP: 'GBR', FRA_EMP: 'FRA',
  JAI: 'JPN', IFA: 'ITA',
};

function interpolateCheckpoints(checkpoints: Record<number, number>, year: number): number {
  const years = Object.keys(checkpoints).map(Number).sort((a, b) => a - b);
  if (year <= years[0]!) return checkpoints[years[0]!]!;
  if (year >= years[years.length - 1]!) return checkpoints[years[years.length - 1]!]!;
  for (let i = 0; i < years.length - 1; i++) {
    const y0 = years[i]!, y1 = years[i + 1]!;
    if (year >= y0 && year <= y1) {
      const t = (year - y0) / (y1 - y0);
      return (checkpoints[y0]! * (1 - t)) + (checkpoints[y1]! * t);
    }
  }
  return 0;
}

export function getMilitaryScore(iso3: string, year: number): number {
  const bounds = HISTORICAL_ENTITY_YEARS[iso3];
  if (bounds && (year < bounds.from || year > bounds.to)) return 0;

  const checkpoints = HISTORICAL_CHECKPOINTS[iso3];
  if (checkpoints) {
    const years = Object.keys(checkpoints).map(Number).sort((a, b) => a - b);
    if (year < years[0]!) return 0;
    return interpolateCheckpoints(checkpoints, year);
  }

  const modern = MILITARY_2023[iso3];
  if (!modern) return 0;
  if (year >= 2010) return modern.score;
  if (year >= 2000) return modern.score * 0.85;
  if (year >= 1991) return modern.score * 0.7;
  if (year >= 1980) return modern.score * 0.6;
  if (year >= 1960) return modern.score * 0.5;
  if (year >= 1945) return modern.score * 0.4;
  return 0;
}

// Maps modern ISO3 → historical entities that occupied that territory
const MODERN_TO_HISTORICAL: Record<string, Array<{ iso3: string; from: number; to: number }>> = {
  RUS: [{ iso3: 'REI', from: 1721, to: 1917 }, { iso3: 'SUN', from: 1922, to: 1991 }],
  DEU: [{ iso3: 'GEI', from: 1871, to: 1918 }, { iso3: 'NAZ', from: 1933, to: 1945 }],
  AUT: [{ iso3: 'AHU', from: 1867, to: 1918 }],
  TUR: [{ iso3: 'OTT', from: 1299, to: 1922 }],
  GBR: [{ iso3: 'GBR_EMP', from: 1600, to: 1960 }],
  FRA: [{ iso3: 'FRA_EMP', from: 1830, to: 1962 }],
  JPN: [{ iso3: 'JAI', from: 1868, to: 1945 }],
  ITA: [{ iso3: 'IFA', from: 1922, to: 1943 }],
};

// Returns the historical entity (e.g. 'GEI', 'SUN') that controlled the territory in that year,
// or the original iso3 if no historical entity applies
export function getEffectiveEntity(iso3: string, year: number): string {
  const entries = MODERN_TO_HISTORICAL[iso3];
  if (!entries) return iso3;
  for (const e of entries) {
    if (year >= e.from && year <= e.to) return e.iso3;
  }
  return iso3;
}

// Computes the global military rank of iso3 for the given year dynamically
export function getDynamicRank(iso3: string, year: number): { rank: number; total: number } | null {
  const targetScore = getMilitaryScore(iso3, year);
  if (targetScore <= 0) return null;

  const allIso3s = new Set([...Object.keys(HISTORICAL_CHECKPOINTS), ...Object.keys(MILITARY_2023)]);
  let rank = 1;
  let total = 0;
  for (const other of allIso3s) {
    const s = getMilitaryScore(other, year);
    if (s > 0) {
      total++;
      if (s > targetScore) rank++;
    }
  }
  return { rank, total };
}

import type { CountryTotalsMap } from '../api.ts';

export function buildMilitaryTotalsMap(year: number): CountryTotalsMap {
  const map: CountryTotalsMap = {};

  const addScore = (iso3: string) => {
    const score = getMilitaryScore(iso3, year);
    if (score <= 0) return;
    const target = HISTORICAL_TO_MODERN[iso3] ?? iso3;
    if (!map[target]) map[target] = {};
    const existing = map[target]![year]?.exports ?? 0;
    map[target]![year] = { exports: Math.max(existing, Math.round(score * 10)), imports: 0 };
  };

  for (const iso3 of Object.keys(HISTORICAL_CHECKPOINTS)) addScore(iso3);
  for (const iso3 of Object.keys(MILITARY_2023)) addScore(iso3);

  return map;
}
