import type { Country, TradeFlow, CaseStudy, DataMetadata } from '@arms-atlas/types';

const BASE = '/api';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

export interface FlowQuery {
  from?: number;
  to?: number;
  supplier?: string;
  recipient?: string;
  category?: string;
}

export interface CountryTotalsMap {
  [iso3: string]: { [year: number]: { exports: number; imports: number } };
}

interface FlowsResponse { data: TradeFlow[]; count: number }
interface CountriesResponse { data: Country[] }
interface CountryTotalsResponse { data: Array<{ iso3: string; year: number; totalExports: number; totalImports: number }> }
interface CaseStudySummary { slug: string; title: string; subtitle: string; yearRange: { from: number; to: number }; highlightedCountries: string[] }
interface CaseStudiesListResponse { data: CaseStudySummary[] }

export const api = {
  health: () => get<{ status: string; dataLoaded: boolean; coverage: { from: number; to: number } | null }>('/health'),

  countries: () => get<CountriesResponse>('/countries').then((r) => r.data),

  flows: (query: FlowQuery = {}) => {
    const params = new URLSearchParams();
    if (query.from !== undefined) params.set('from', String(query.from));
    if (query.to !== undefined) params.set('to', String(query.to));
    if (query.supplier) params.set('supplier', query.supplier);
    if (query.recipient) params.set('recipient', query.recipient);
    if (query.category) params.set('category', query.category);
    const qs = params.toString();
    return get<FlowsResponse>(`/flows${qs ? '?' + qs : ''}`).then((r) => r.data);
  },

  countryTotals: () =>
    get<CountryTotalsResponse>('/flows/country-totals').then((r) => {
      const map: CountryTotalsMap = {};
      for (const row of r.data) {
        if (!map[row.iso3]) map[row.iso3] = {};
        map[row.iso3]![row.year] = { exports: row.totalExports, imports: row.totalImports };
      }
      // Merge historical entities into their primary successor state so the
      // choropleth renders them on modern territory.
      const merges: [string, string][] = [
        ['SUN', 'RUS'],  // Soviet Union → Russia
        ['DDR', 'DEU'],  // East Germany → Germany
        ['GEI', 'DEU'],  // German Empire → Germany
        ['NAZ', 'DEU'],  // Third Reich → Germany
        ['AHU', 'AUT'],  // Austria-Hungary → Austria
        ['OTT', 'TUR'],  // Ottoman Empire → Turkey
        ['REI', 'RUS'],  // Russian Empire → Russia
        ['JAI', 'JPN'],  // Japanese Empire → Japan
        ['IFA', 'ITA'],  // Fascist Italy → Italy
        ['CSR', 'CHN'],  // Nationalist China → China (mainland territory)
        ['YUG', 'SRB'],  // Yugoslavia → Serbia
      ];
      for (const [historical, modern] of merges) {
        if (!map[historical]) continue;
        if (!map[modern]) map[modern] = {};
        for (const [yr, data] of Object.entries(map[historical])) {
          const year = Number(yr);
          const existing = map[modern]![year];
          map[modern]![year] = {
            exports: (existing?.exports ?? 0) + data.exports,
            imports: (existing?.imports ?? 0) + data.imports,
          };
        }
        delete map[historical];
      }
      return map;
    }),

  countryProfile: (iso3: string, year?: number) => {
    const qs = year !== undefined ? `?year=${year}` : '';
    return get<{
      iso3: string; year?: number; totalExports: number; totalImports: number;
      topSuppliers: { iso3: string; tiv: number }[]; topRecipients: { iso3: string; tiv: number }[];
      weaponMix: Record<string, number>;
    }>(`/flows/country/${iso3}/profile${qs}`);
  },

  caseStudies: () => get<CaseStudiesListResponse>('/case-studies').then((r) => r.data),

  caseStudy: (slug: string) => get<CaseStudy>(`/case-studies/${slug}`),

  metadata: () => get<DataMetadata>('/metadata'),
};
