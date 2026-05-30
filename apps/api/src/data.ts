import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { TradeFlow, CountryYearTotal, CountryDecadeProfile, DataMetadata, Country } from '@arms-atlas/types';

// In Vercel serverless, process.cwd() = /var/task (project root).
// In local dev (run from monorepo root), process.cwd() is also the repo root.
// Fallback: resolve relative to this file for non-standard environments.
const cwdPath = path.join(process.cwd(), 'data', 'processed');
const relPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../data/processed');
const PROCESSED = fs.existsSync(cwdPath) ? cwdPath : relPath;

function loadJson<T>(filename: string, fallback: T): T {
  const fullPath = path.join(PROCESSED, filename);
  if (!fs.existsSync(fullPath)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(fullPath, 'utf-8')) as T;
  } catch {
    return fallback;
  }
}

let _flows: TradeFlow[] | null = null;
let _totals: CountryYearTotal[] | null = null;
let _partners: CountryDecadeProfile[] | null = null;
let _metadata: DataMetadata | null = null;
let _countries: Country[] | null = null;

export function getFlows(): TradeFlow[] {
  if (!_flows) _flows = loadJson<TradeFlow[]>('flows.json', []);
  return _flows;
}

export function getCountryTotals(): CountryYearTotal[] {
  if (!_totals) _totals = loadJson<CountryYearTotal[]>('country_totals.json', []);
  return _totals;
}

export function getTopPartners(): CountryDecadeProfile[] {
  if (!_partners) _partners = loadJson<CountryDecadeProfile[]>('top_partners.json', []);
  return _partners;
}

export function getMetadata(): DataMetadata | null {
  if (!_metadata) {
    _metadata = loadJson<DataMetadata | null>('metadata.json', null);
  }
  return _metadata;
}

export function getCountries(): Country[] {
  if (!_countries) {
    _countries = loadJson<Country[]>('countries.json', FALLBACK_COUNTRIES);
  }
  return _countries;
}

export function invalidateCache(): void {
  _flows = null;
  _totals = null;
  _partners = null;
  _metadata = null;
  _countries = null;
}

const FALLBACK_COUNTRIES: Country[] = [
  { iso3: 'USA', iso2: 'US', name: 'United States', displayName: 'United States', centroidLon: -98.5, centroidLat: 39.5 },
  { iso3: 'RUS', iso2: 'RU', name: 'Russia', displayName: 'Russia', centroidLon: 105.0, centroidLat: 61.0 },
  { iso3: 'CHN', iso2: 'CN', name: 'China', displayName: 'China', centroidLon: 104.0, centroidLat: 35.8 },
  { iso3: 'GBR', iso2: 'GB', name: 'United Kingdom', displayName: 'United Kingdom', centroidLon: -3.4, centroidLat: 55.4 },
  { iso3: 'FRA', iso2: 'FR', name: 'France', displayName: 'France', centroidLon: 2.2, centroidLat: 46.2 },
  { iso3: 'DEU', iso2: 'DE', name: 'Germany', displayName: 'Germany', centroidLon: 10.5, centroidLat: 51.2 },
  { iso3: 'ISR', iso2: 'IL', name: 'Israel', displayName: 'Israel', centroidLon: 34.9, centroidLat: 31.5 },
  { iso3: 'SAU', iso2: 'SA', name: 'Saudi Arabia', displayName: 'Saudi Arabia', centroidLon: 45.0, centroidLat: 24.0 },
  { iso3: 'IRN', iso2: 'IR', name: 'Iran', displayName: 'Iran', centroidLon: 53.7, centroidLat: 32.4 },
  { iso3: 'UKR', iso2: 'UA', name: 'Ukraine', displayName: 'Ukraine', centroidLon: 31.2, centroidLat: 48.4 },
];
