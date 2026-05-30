export type WeaponCategory =
  | 'aircraft'
  | 'missiles'
  | 'naval'
  | 'armored_vehicles'
  | 'artillery'
  | 'sensors'
  | 'other';

export interface Country {
  iso3: string;
  iso2: string;
  name: string;
  displayName: string;
  centroidLon: number;
  centroidLat: number;
  isHistorical?: boolean;
  yearFrom?: number;
  yearTo?: number;
  successorStates?: string[];
}

export interface TradeFlow {
  id: string;
  supplierIso3: string;
  recipientIso3: string;
  year: number;
  tiv: number;
  weaponCategory: WeaponCategory;
  description?: string;
}

export interface CountryYearTotal {
  iso3: string;
  year: number;
  totalExports: number;
  totalImports: number;
}

export interface TopPartner {
  iso3: string;
  tiv: number;
}

export interface CountryDecadeProfile {
  iso3: string;
  decade: number;
  topSuppliers: TopPartner[];
  topRecipients: TopPartner[];
}

export interface YearRange {
  from: number;
  to: number;
}

export interface CaseStudy {
  slug: string;
  title: string;
  subtitle: string;
  yearRange: YearRange;
  highlightedCountries: string[];
  keyNumbers: KeyNumber[];
  narrativeBlocks: NarrativeBlock[];
  sources: Source[];
}

export interface KeyNumber {
  value: string;
  label: string;
  context?: string;
}

export interface NarrativeBlock {
  id: string;
  text: string;
  mapState: MapState;
}

export interface MapState {
  yearRange: YearRange;
  highlightedSupplier?: string;
  highlightedRecipients?: string[];
  annotation?: string;
  zoomIso3?: string;
}

export interface Source {
  label: string;
  url: string;
  author?: string;
  year?: number;
}

export interface DataMetadata {
  lastUpdated: string;
  sipriAccessDate: string;
  yearCoverage: YearRange;
  knownGaps: string[];
  totalFlowRecords: number;
  citation: string;
}

export interface AtlasUrlState {
  year: number;
  supplier?: string;
  recipient?: string;
  mode: 'choropleth' | 'flows';
  shading: 'exports' | 'imports' | 'net';
  categories: WeaponCategory[];
}
