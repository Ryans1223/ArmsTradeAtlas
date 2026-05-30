import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';
import type { TradeFlow, CountryYearTotal, CountryDecadeProfile, TopPartner, DataMetadata, WeaponCategory } from '@arms-atlas/types';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../../../');
const DATA_PROCESSED = path.join(ROOT, 'data/processed');
const ALIASES_PATH = path.join(__dirname, 'countryAliases.json');

interface CountryAlias {
  iso3: string;
  displayName: string;
  successorStates?: string[];
}

interface RawSipriRow {
  [key: string]: string;
}

function loadAliases(): Record<string, CountryAlias> {
  return JSON.parse(fs.readFileSync(ALIASES_PATH, 'utf-8')) as Record<string, CountryAlias>;
}

function normalizeCategory(cat: string): WeaponCategory {
  const lower = cat.toLowerCase();
  if (lower.includes('aircraft') || lower.includes('helicopter') || lower.includes('bomber') || lower.includes('fighter') || lower.includes('uav') || lower.includes('drone')) return 'aircraft';
  if (lower.includes('missile') || lower.includes('manpad') || lower.includes('atgm') || lower.includes('jdam') || lower.includes('guided bomb') || lower.includes('rocket launcher') || lower.includes('anti-ship') || lower.includes('anti-tank')) return 'missiles';
  if (lower.includes('air defence') || lower.includes('air defense') || lower.includes('sam ') || lower.includes('patriot') || lower.includes('nasams')) return 'missiles';
  if (lower.includes('ship') || lower.includes('submarine') || lower.includes('naval') || lower.includes('frigate') || lower.includes('destroyer') || lower.includes('corvette') || lower.includes('cruiser')) return 'naval';
  if (lower.includes('armoured') || lower.includes('armored') || lower.includes('tank') || lower.includes('ifv') || lower.includes('apc') || lower.includes('infantry fighting') || lower.includes('armament')) return 'armored_vehicles';
  if (lower.includes('artillery') || lower.includes('howitzer') || lower.includes(' gun') || lower.includes('shell') || lower.includes('multiple rocket') || lower.includes('himars')) return 'artillery';
  if (lower.includes('radar') || lower.includes('sensor') || lower.includes('satellite') || lower.includes('surveillance') || lower.includes('reconnaissance')) return 'sensors';
  return 'other';
}

const ISO3_LOOKUP: Record<string, string> = {
  'Afghanistan': 'AFG', 'Albania': 'ALB', 'Algeria': 'DZA', 'Angola': 'AGO',
  'Argentina': 'ARG', 'Australia': 'AUS', 'Austria': 'AUT', 'Bangladesh': 'BGD',
  'Belgium': 'BEL', 'Bolivia': 'BOL', 'Brazil': 'BRA', 'Bulgaria': 'BGR',
  'Burkina Faso': 'BFA', 'Cambodia': 'KHM', 'Cameroon': 'CMR', 'Canada': 'CAN',
  'Chad': 'TCD', 'Chile': 'CHL', 'China': 'CHN', 'Colombia': 'COL',
  'Congo': 'COG', 'DR Congo': 'COD', 'Costa Rica': 'CRI', 'Croatia': 'HRV',
  'Cuba': 'CUB', 'Czech Republic': 'CZE', 'Czechia': 'CZE', 'Denmark': 'DNK',
  'Ecuador': 'ECU', 'Egypt': 'EGY', 'Ethiopia': 'ETH', 'Finland': 'FIN',
  'France': 'FRA', 'Germany': 'DEU', 'West Germany': 'DEU', 'Ghana': 'GHA',
  'Greece': 'GRC', 'Guatemala': 'GTM', 'Hungary': 'HUN', 'India': 'IND',
  'Indonesia': 'IDN', 'Iran': 'IRN', 'Iraq': 'IRQ', 'Ireland': 'IRL',
  'Israel': 'ISR', 'Italy': 'ITA', 'Japan': 'JPN', 'Jordan': 'JOR',
  'Kenya': 'KEN', 'South Korea': 'KOR', 'North Korea': 'PRK', 'Kuwait': 'KWT',
  'Lebanon': 'LBN', 'Libya': 'LBY', 'Malaysia': 'MYS', 'Mexico': 'MEX',
  'Morocco': 'MAR', 'Mozambique': 'MOZ', 'Myanmar': 'MMR', 'Nepal': 'NPL',
  'Netherlands': 'NLD', 'New Zealand': 'NZL', 'Nicaragua': 'NIC', 'Nigeria': 'NGA',
  'Norway': 'NOR', 'Pakistan': 'PAK', 'Peru': 'PER', 'Philippines': 'PHL',
  'Poland': 'POL', 'Portugal': 'PRT', 'Qatar': 'QAT', 'Romania': 'ROU',
  'Russia': 'RUS', 'Rwanda': 'RWA', 'Saudi Arabia': 'SAU', 'Senegal': 'SEN',
  'Somalia': 'SOM', 'South Africa': 'ZAF', 'Spain': 'ESP', 'Sudan': 'SDN',
  'Sweden': 'SWE', 'Switzerland': 'CHE', 'Syria': 'SYR', 'Thailand': 'THA',
  'Turkey': 'TUR', 'Turkiye': 'TUR', 'Uganda': 'UGA', 'Ukraine': 'UKR',
  'United Arab Emirates': 'ARE', 'UAE': 'ARE', 'United Kingdom': 'GBR',
  'UK': 'GBR', 'United States': 'USA', 'USA': 'USA', 'Uruguay': 'URY',
  'Venezuela': 'VEN', 'Vietnam': 'VNM', 'Yemen': 'YEM', 'Zambia': 'ZMB',
  'Zimbabwe': 'ZWE', 'Belarus': 'BLR', 'Kazakhstan': 'KAZ', 'Uzbekistan': 'UZB',
  'Armenia': 'ARM', 'Azerbaijan': 'AZE', 'Georgia': 'GEO', 'Moldova': 'MDA',
  'Lithuania': 'LTU', 'Latvia': 'LVA', 'Estonia': 'EST', 'Taiwan': 'TWN',
  'Kosovo': 'XKX', 'Palestine': 'PSE', 'Serbia': 'SRB', 'Montenegro': 'MNE',
  'Macedonia': 'MKD', 'North Macedonia': 'MKD', 'Slovenia': 'SVN',
  'Bosnia-Herzegovina': 'BIH', 'Bosnia and Herzegovina': 'BIH',
  'Namibia': 'NAM', 'El Salvador': 'SLV', 'Honduras': 'HND',
  'Dominican Republic': 'DOM', 'Trinidad and Tobago': 'TTO',
  'Czech and Slovak FS': 'CSK', 'Czechoslovakia': 'CSK',
  'Oman': 'OMN', 'Singapore': 'SGP', 'Bahrain': 'BHR', 'Tanzania': 'TZA',
  'Sri Lanka': 'LKA', 'Finland': 'FIN', 'Denmark': 'DNK', 'Czech Republic': 'CZE',
  'Sweden': 'SWE', 'Switzerland': 'CHE', 'Austria': 'AUT', 'Argentina': 'ARG',
  // Historical empires (pre-1950 proxy data)
  'German Empire': 'GEI', 'Imperial Germany': 'GEI', 'Weimar Republic': 'DEU',
  'Third Reich': 'NAZ', 'Nazi Germany': 'NAZ',
  'Austria-Hungary': 'AHU', 'Austro-Hungarian Empire': 'AHU',
  'Ottoman Empire': 'OTT',
  'Russian Empire': 'REI',
  'Imperial Japan': 'JAI',
  'Fascist Italy': 'IFA', 'Kingdom of Italy': 'IFA',
  'Nationalist China': 'CSR', 'Republic of China': 'CSR',
  'France': 'FRA', 'Belgium': 'BEL', 'Serbia': 'SRB', 'Romania': 'ROU',
};

function resolveIso3(name: string, aliases: Record<string, CountryAlias>): string {
  const trimmed = name.trim();
  if (aliases[trimmed]) return aliases[trimmed].iso3;
  if (ISO3_LOOKUP[trimmed]) return ISO3_LOOKUP[trimmed];
  return trimmed.toUpperCase().slice(0, 3);
}

function generateId(supplier: string, recipient: string, year: number, category: string, index: number): string {
  return `${supplier}-${recipient}-${year}-${category}-${index}`;
}

function processSipriCsv(csvPath: string): void {
  console.log(`Processing ${csvPath}...`);
  const raw = fs.readFileSync(csvPath, 'utf-8');
  const aliases = loadAliases();

  const result = Papa.parse<RawSipriRow>(raw, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });

  if (result.errors.length > 0) {
    console.warn('CSV parse warnings:', result.errors.slice(0, 5));
  }

  const flows: TradeFlow[] = [];
  const totalsMap = new Map<string, CountryYearTotal>();
  let index = 0;

  for (const row of result.data) {
    const supplierRaw = row['Supplier'] ?? row['Exporter'] ?? row['From'] ?? '';
    const recipientRaw = row['Recipient'] ?? row['Importer'] ?? row['To'] ?? '';
    const yearRaw = row['Year'] ?? row['year'] ?? '';
    const tivRaw = row['Total TIV'] ?? row['TIV'] ?? row['Value'] ?? row['tiv'] ?? row['SIPRI TIV'] ?? '';
    const categoryRaw = row['Armament category'] ?? row['Armament Category'] ?? row['Category'] ?? row['Type'] ?? '';
    const description = row['Description'] ?? row['Weapon description'] ?? '';

    if (!supplierRaw || !recipientRaw || !yearRaw || !tivRaw) continue;

    const year = parseInt(yearRaw, 10);
    const tiv = parseFloat(tivRaw);
    if (isNaN(year) || isNaN(tiv) || tiv <= 0) continue;

    const supplierIso3 = resolveIso3(supplierRaw, aliases);
    const recipientIso3 = resolveIso3(recipientRaw, aliases);
    const weaponCategory = normalizeCategory(categoryRaw);

    const flow: TradeFlow = {
      id: generateId(supplierIso3, recipientIso3, year, weaponCategory, index++),
      supplierIso3,
      recipientIso3,
      year,
      tiv,
      weaponCategory,
      description: description || undefined,
    };
    flows.push(flow);

    const supKey = `${supplierIso3}-${year}`;
    const recKey = `${recipientIso3}-${year}`;

    const supTotal = totalsMap.get(supKey) ?? { iso3: supplierIso3, year, totalExports: 0, totalImports: 0 };
    supTotal.totalExports += tiv;
    totalsMap.set(supKey, supTotal);

    const recTotal = totalsMap.get(recKey) ?? { iso3: recipientIso3, year, totalExports: 0, totalImports: 0 };
    recTotal.totalImports += tiv;
    totalsMap.set(recKey, recTotal);
  }

  const countryTotals = Array.from(totalsMap.values());

  const decadeProfileMap = new Map<string, Map<string, number>>();
  const decadeRecipientMap = new Map<string, Map<string, number>>();

  for (const flow of flows) {
    const decade = Math.floor(flow.year / 10) * 10;
    const supKey = `${flow.supplierIso3}-${decade}`;
    const recKey = `${flow.recipientIso3}-${decade}`;

    if (!decadeProfileMap.has(supKey)) decadeProfileMap.set(supKey, new Map());
    const supRecipients = decadeProfileMap.get(supKey)!;
    supRecipients.set(flow.recipientIso3, (supRecipients.get(flow.recipientIso3) ?? 0) + flow.tiv);

    if (!decadeRecipientMap.has(recKey)) decadeRecipientMap.set(recKey, new Map());
    const recSuppliers = decadeRecipientMap.get(recKey)!;
    recSuppliers.set(flow.supplierIso3, (recSuppliers.get(flow.supplierIso3) ?? 0) + flow.tiv);
  }

  const topPartnersMap = new Map<string, CountryDecadeProfile>();

  for (const [key, recipientMap] of decadeProfileMap.entries()) {
    const [iso3, decadeStr] = key.split('-');
    const decade = parseInt(decadeStr ?? '1950', 10);
    const profileKey = `${iso3}-${decade}`;
    const existing = topPartnersMap.get(profileKey) ?? { iso3: iso3 ?? '', decade, topSuppliers: [], topRecipients: [] };
    existing.topRecipients = Array.from(recipientMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([partnerIso3, tiv]) => ({ iso3: partnerIso3, tiv } as TopPartner));
    topPartnersMap.set(profileKey, existing);
  }

  for (const [key, supplierMap] of decadeRecipientMap.entries()) {
    const [iso3, decadeStr] = key.split('-');
    const decade = parseInt(decadeStr ?? '1950', 10);
    const profileKey = `${iso3}-${decade}`;
    const existing = topPartnersMap.get(profileKey) ?? { iso3: iso3 ?? '', decade, topSuppliers: [], topRecipients: [] };
    existing.topSuppliers = Array.from(supplierMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([partnerIso3, tiv]) => ({ iso3: partnerIso3, tiv } as TopPartner));
    topPartnersMap.set(profileKey, existing);
  }

  const topPartners = Array.from(topPartnersMap.values());

  const years = flows.map((f) => f.year);
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);

  const metadata: DataMetadata = {
    lastUpdated: new Date().toISOString(),
    sipriAccessDate: 'see README',
    yearCoverage: { from: minYear, to: maxYear },
    knownGaps: [
      'Classified North Korean and Iranian transfers are largely absent from SIPRI records',
      'Covert CIA/KGB arms transfers during Cold War proxy conflicts are not captured',
      'Dual-use technology exports (electronics, propulsion systems) are not included',
      'Financial military aid (FMF grants) without hardware transfers is not reflected in TIV',
    ],
    totalFlowRecords: flows.length,
    citation: `Source: SIPRI Arms Transfers Database, accessed [date]. TIV values are a SIPRI-defined proxy for transfer volume; they are not equivalent to financial sales prices.`,
  };

  fs.mkdirSync(DATA_PROCESSED, { recursive: true });
  fs.writeFileSync(path.join(DATA_PROCESSED, 'flows.json'), JSON.stringify(flows, null, 2));
  fs.writeFileSync(path.join(DATA_PROCESSED, 'country_totals.json'), JSON.stringify(countryTotals, null, 2));
  fs.writeFileSync(path.join(DATA_PROCESSED, 'top_partners.json'), JSON.stringify(topPartners, null, 2));
  fs.writeFileSync(path.join(DATA_PROCESSED, 'metadata.json'), JSON.stringify(metadata, null, 2));

  console.log(`Done. Processed ${flows.length} flow records spanning ${minYear} to ${maxYear}.`);
  console.log(`Output written to ${DATA_PROCESSED}`);
}

const csvArg = process.argv[2];
if (!csvArg) {
  console.error('Usage: node ingest.ts <path-to-sipri-export.csv>');
  console.error('Download the SIPRI Arms Transfers Database from sipri.org/databases/armstransfers');
  process.exit(1);
}

processSipriCsv(path.resolve(csvArg));
