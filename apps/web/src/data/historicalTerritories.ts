export interface HistoricalTerritory {
  iso3: string;
  label: string;
  color: string;
  yearFrom: number;
  yearTo: number;
  constituent: string[];
  economicNote: string;
  controller?: string; // ISO3 of the home/controlling country (e.g. 'GBR' for British Empire)
}

export const HISTORICAL_TERRITORIES: HistoricalTerritory[] = [
  // ── Pre-WWI / WWI powers ──────────────────────────────────────────────
  {
    iso3: 'REI', label: 'Russian Empire', color: '#A05050',
    yearFrom: 1721, yearTo: 1917, controller: 'RUS',
    constituent: ['RUS', 'UKR', 'BLR', 'FIN', 'EST', 'LVA', 'LTU', 'POL', 'KAZ', 'UZB', 'TKM', 'KGZ', 'TJK', 'ARM', 'AZE', 'GEO', 'MDA'],
    economicNote: 'GDP ~$340B (1913 PPP). World\'s largest wheat exporter. Industrial output grew 5%/yr 1890–1913.',
  },
  {
    iso3: 'GEI', label: 'German Empire', color: '#B8974A',
    yearFrom: 1871, yearTo: 1918, controller: 'DEU',
    constituent: ['DEU', 'POL', 'TZA', 'RWA', 'BDI', 'CMR', 'TGO', 'NAM', 'PNG'],
    economicNote: 'Europe\'s largest industrial economy by 1914. Steel output exceeded Britain. GDP ~$240B (1913 PPP).',
  },
  {
    iso3: 'AHU', label: 'Austria-Hungary', color: '#8B6BAE',
    yearFrom: 1867, yearTo: 1918, controller: 'AUT',
    constituent: ['AUT', 'HUN', 'CZE', 'SVK', 'SVN', 'HRV', 'BIH', 'SRB'],
    economicNote: '2nd largest state in Europe by area. Bohemia was its industrial core. GDP ~$100B (1913 PPP).',
  },
  {
    // Ottoman core 1914–1918 (Libya lost 1912 to Italy; Egypt British-controlled since 1882)
    iso3: 'OTT', label: 'Ottoman Empire', color: '#B88B4A',
    yearFrom: 1299, yearTo: 1918, controller: 'TUR',
    constituent: ['TUR', 'IRQ', 'SYR', 'LBN', 'ISR', 'JOR', 'SAU', 'YEM'],
    economicNote: '"Sick Man of Europe" — $150M debt to European banks by 1914. Baghdad railway to Germany was a pre-war flashpoint.',
  },
  {
    // Ottoman rump state after armistice — Anatolia only until 1922
    iso3: 'OTT_RUMP', label: 'Ottoman Rump State', color: '#B88B4A',
    yearFrom: 1919, yearTo: 1922, controller: 'TUR',
    constituent: ['TUR'],
    economicNote: 'Post-WWI: Sevres Treaty (1920) partitioned the empire. Greek-Turkish War 1919–22 ended with Treaty of Lausanne — modern Turkey established.',
  },

  // ── British & French Empires (split for territory changes) ──────────
  {
    // British Empire with Indian Raj 1914–1947
    iso3: 'GBR_EMP', label: 'British Empire', color: '#C4834A',
    yearFrom: 1914, yearTo: 1947, controller: 'GBR',
    constituent: ['GBR', 'IND', 'PAK', 'BGD', 'MMR', 'LKA', 'AUS', 'NZL', 'CAN', 'ZAF', 'NGA', 'GHA', 'KEN', 'TZA', 'UGA', 'ZMB', 'ZWE', 'MWI', 'SDN', 'EGY', 'IRQ', 'JOR', 'MYS', 'SGP', 'PNG'],
    economicNote: 'Peak 1920: 24% world land, 23% world population. Sterling = world reserve currency. Empire GDP ~$1.6T (1938 PPP). Controlled ~40% of global investment flows.',
  },
  {
    // British Commonwealth after Indian independence 1947–1960
    iso3: 'GBR_COM', label: 'British Commonwealth', color: '#C4834A',
    yearFrom: 1948, yearTo: 1960, controller: 'GBR',
    constituent: ['GBR', 'AUS', 'NZL', 'CAN', 'ZAF', 'NGA', 'GHA', 'KEN', 'TZA', 'UGA', 'ZMB', 'ZWE', 'MWI', 'SDN', 'MYS', 'SGP', 'PNG'],
    economicNote: 'Post-Indian independence. Ghana independent 1957. Federation of Malaya 1957. Mass decolonisation accelerating — 17 African states independent by 1960.',
  },
  {
    // French Indochina ends 1954; French Algeria ends 1962
    iso3: 'FRA_EMP', label: 'French Empire', color: '#4A6B9B',
    yearFrom: 1914, yearTo: 1954, controller: 'FRA',
    constituent: ['FRA', 'DZA', 'TUN', 'MAR', 'SEN', 'MLI', 'GIN', 'CIV', 'BFA', 'NER', 'TCD', 'CMR', 'CAF', 'COG', 'GAB', 'MDG', 'VNM', 'KHM', 'LAO'],
    economicNote: '2nd largest empire by area. Algeria treated as integral French territory. Indochina most profitable colony — rubber, rice, coal.',
  },
  {
    // France retains African empire after Indochina loss
    iso3: 'FRA_AFR', label: 'French Union (Africa)', color: '#4A6B9B',
    yearFrom: 1955, yearTo: 1962, controller: 'FRA',
    constituent: ['FRA', 'DZA', 'TUN', 'MAR', 'SEN', 'MLI', 'GIN', 'CIV', 'BFA', 'NER', 'TCD', 'CMR', 'CAF', 'COG', 'GAB', 'MDG'],
    economicNote: 'Post-Indochina: 17 African territories remain. Algerian War 1954–62 cost 500,000+ lives. Sub-Saharan Africa decolonised mainly in 1960 (\'Year of Africa\').',
  },
  {
    iso3: 'PRT_EMP', label: 'Portuguese Empire', color: '#7B5C3A',
    yearFrom: 1914, yearTo: 1975, controller: 'PRT',
    constituent: ['PRT', 'AGO', 'MOZ', 'GNB'],
    economicNote: 'Oldest surviving colonial empire (est. 1415). Angola/Mozambique held major mineral wealth. Colonial wars 1961–74 bankrupted the Estado Novo regime.',
  },
  {
    iso3: 'BEL_EMP', label: 'Belgian Congo', color: '#6B4A8B',
    yearFrom: 1914, yearTo: 1960, controller: 'BEL',
    constituent: ['BEL', 'COD', 'RWA', 'BDI'],
    economicNote: 'Richest colony per capita — copper, rubber, uranium. Congo\'s Shinkolobwe mine supplied the Manhattan Project (1942–44).',
  },
  {
    iso3: 'NLD_EMP', label: 'Dutch East Indies', color: '#4A7A5C',
    yearFrom: 1914, yearTo: 1945, controller: 'NLD',
    constituent: ['NLD', 'IDN'],
    economicNote: '8% of world oil output by 1940 (Royal Dutch Shell). Rubber and tin exports = 15–20% of Dutch national income.',
  },
  {
    iso3: 'USA_TER', label: 'U.S. Territories', color: '#3A5C8B',
    yearFrom: 1898, yearTo: 1946, controller: 'USA',
    constituent: ['PHL', 'CUB', 'PAN'],
    economicNote: 'Acquired post-1898 Spanish-American War. Philippines (7M pop.), Cuba sugar economy, Panama Canal opened 1914 — transformed global trade.',
  },
  {
    iso3: 'ITA_LBY', label: 'Italian Libya', color: '#4A8B5A',
    yearFrom: 1912, yearTo: 1943, controller: 'ITA',
    constituent: ['LBY'],
    economicNote: 'Seized from Ottoman Empire in 1912. Limited economic value but strategic Mediterranean position. Allied conquest complete 1943.',
  },

  // ── WWII powers ───────────────────────────────────────────────────────
  {
    iso3: 'NAZ', label: 'Third Reich', color: '#5C5C5C',
    yearFrom: 1933, yearTo: 1945, controller: 'DEU',
    constituent: ['DEU', 'AUT', 'CZE', 'POL'],
    economicNote: 'War economy: 40% of GDP on military by 1944. Looted $600B+ from occupied Europe. 12M+ forced laborers. Hjalmar Schacht\'s deficit financing enabled rearmament.',
  },
  {
    iso3: 'NAZ_OCC', label: 'Nazi Occupied Europe', color: '#5C5C5C',
    yearFrom: 1940, yearTo: 1944, controller: 'DEU',
    constituent: ['FRA', 'BEL', 'NLD', 'NOR', 'DNK', 'GRC', 'YUG'],
    economicNote: 'Western occupation: Vichy France (July 1940). Economic integration into Reich war machine — French factories produced 40% of German needs 1940–44.',
  },
  {
    iso3: 'JAI', label: 'Japanese Empire', color: '#B84A5A',
    yearFrom: 1868, yearTo: 1945, controller: 'JPN',
    constituent: ['JPN', 'KOR', 'PRK', 'TWN'],
    economicNote: 'Meiji GDP grew 2.4× (1885–1913). Military spending 70% of budget by 1944. Korea and Taiwan integrated as agricultural suppliers to Japanese industry.',
  },
  {
    iso3: 'JAI_MAN', label: 'Japanese Manchuria', color: '#C45060',
    yearFrom: 1931, yearTo: 1945, controller: 'JPN',
    constituent: ['CHN'],
    economicNote: 'Manchukuo (1932) puppet state. Heavy industry output doubled 1932–41 — steel, coal, chemicals. Controlled 35% of China\'s modern industrial capacity.',
  },
  {
    iso3: 'JAO', label: 'Japanese Occupation', color: '#D46070',
    yearFrom: 1942, yearTo: 1945, controller: 'JPN',
    constituent: ['PHL', 'IDN', 'VNM', 'KHM', 'LAO', 'MMR', 'MYS', 'SGP'],
    economicNote: '"Co-Prosperity Sphere" — forced extraction of SE Asian oil, rubber and rice. Singapore fell Feb 1942: largest British surrender in history.',
  },
  {
    iso3: 'IFA', label: 'Fascist Italy', color: '#4A8B5A',
    yearFrom: 1922, yearTo: 1943, controller: 'ITA',
    constituent: ['ITA', 'ETH', 'SOM', 'ALB'],
    economicNote: 'Ethiopia conquest (1935) triggered League sanctions — Italy pivoted to Germany. Empire expansion pushed debt/GDP to 100% by 1940.',
  },

  // ── Cold War blocs ────────────────────────────────────────────────────
  {
    iso3: 'SUN', label: 'Soviet Union', color: '#CC3333',
    yearFrom: 1922, yearTo: 1991, controller: 'RUS',
    constituent: ['RUS', 'UKR', 'BLR', 'KAZ', 'UZB', 'ARM', 'AZE', 'GEO', 'KGZ', 'MDA', 'TJK', 'TKM', 'LTU', 'LVA', 'EST'],
    economicNote: 'Peak GDP ~$2.5T (1989 PPP). Arms exports ~$20B/yr at Cold War peak. Military spending 15–17% of GDP. 1986 oil price collapse cut hard-currency earnings by 50%.',
  },
  {
    iso3: 'WTO', label: 'Warsaw Pact Bloc', color: '#AA2222',
    yearFrom: 1955, yearTo: 1991, controller: 'RUS',
    constituent: ['POL', 'CZE', 'SVK', 'HUN', 'ROU', 'BGR', 'MNG', 'ALB'],
    economicNote: 'COMECON: coordinated planned economies. Soviet oil subsidies worth ~$15B/yr. Romania broke with Moscow 1965; Poland\'s Solidarity (1980) signalled bloc fragility.',
  },
  {
    iso3: 'YUG', label: 'Yugoslavia', color: '#4A70B8',
    yearFrom: 1918, yearTo: 1992, controller: 'SRB',
    constituent: ['SVN', 'HRV', 'BIH', 'SRB', 'MNE', 'MKD'],
    economicNote: 'Non-aligned; mixed economy grew 6%/yr (1950s–70s). Foreign debt crisis 1980s ($20B) and 1000%/yr inflation preceded dissolution.',
  },
  {
    iso3: 'CSK', label: 'Czechoslovakia', color: '#6B8BA0',
    yearFrom: 1918, yearTo: 1993, controller: 'CZE',
    constituent: ['CZE', 'SVK'],
    economicNote: 'Most industrialized state of interwar Eastern Europe. Škoda arms exports were decisive — Czech weapons helped Israel win the 1948 war.',
  },
];
