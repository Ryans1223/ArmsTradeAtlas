import { useEffect, useState, useCallback, useMemo } from 'react';
import WorldMap from '../components/map/WorldMap.tsx';
import TimeSlider from '../components/timeline/TimeSlider.tsx';
import MarketsPanel from '../components/panel/MarketsPanel.tsx';
import { useAtlasStore } from '../store.ts';
import { api } from '../api.ts';
import type { CountryTotalsMap } from '../api.ts';
import type { Country } from '@arms-atlas/types';
import type { ShadingMode } from '../store.ts';
import { HISTORICAL_TERRITORIES } from '../data/historicalTerritories.ts';
import { STOCK_INDICES, COUNTRY_TO_INDEX } from '../data/stockIndices.ts';
import { buildMilitaryTotalsMap } from '../data/militaryRankings.ts';

type ShadingView = 'military' | 'stock';

// Same numeric→ISO3 map as Atlas (needed by WorldMap)
const ISO3_BY_NUMERIC: Map<number, string> = new Map([
  [4, 'AFG'], [8, 'ALB'], [12, 'DZA'], [24, 'AGO'], [32, 'ARG'], [36, 'AUS'],
  [40, 'AUT'], [50, 'BGD'], [56, 'BEL'], [68, 'BOL'], [76, 'BRA'], [100, 'BGR'],
  [104, 'MMR'], [116, 'KHM'], [120, 'CMR'], [124, 'CAN'], [140, 'CAF'], [152, 'CHL'],
  [156, 'CHN'], [170, 'COL'], [180, 'COD'], [188, 'CRI'], [191, 'HRV'], [192, 'CUB'],
  [203, 'CZE'], [204, 'BEN'], [208, 'DNK'], [214, 'DOM'], [218, 'ECU'], [818, 'EGY'],
  [222, 'SLV'], [231, 'ETH'], [246, 'FIN'], [250, 'FRA'], [266, 'GAB'], [276, 'DEU'],
  [288, 'GHA'], [300, 'GRC'], [320, 'GTM'], [332, 'HTI'], [340, 'HND'], [348, 'HUN'],
  [356, 'IND'], [360, 'IDN'], [364, 'IRN'], [368, 'IRQ'], [372, 'IRL'], [376, 'ISR'],
  [380, 'ITA'], [388, 'JAM'], [392, 'JPN'], [400, 'JOR'], [404, 'KEN'], [410, 'KOR'],
  [408, 'PRK'], [414, 'KWT'], [422, 'LBN'], [434, 'LBY'], [484, 'MEX'], [504, 'MAR'],
  [508, 'MOZ'], [516, 'NAM'], [524, 'NPL'], [528, 'NLD'], [554, 'NZL'],
  [558, 'NIC'], [566, 'NGA'], [578, 'NOR'], [586, 'PAK'], [591, 'PAN'], [598, 'PNG'],
  [604, 'PER'], [608, 'PHL'], [616, 'POL'], [620, 'PRT'], [634, 'QAT'],
  [642, 'ROU'], [643, 'RUS'], [646, 'RWA'], [682, 'SAU'], [686, 'SEN'], [694, 'SLE'],
  [706, 'SOM'], [710, 'ZAF'], [724, 'ESP'], [729, 'SDN'], [752, 'SWE'],
  [756, 'CHE'], [760, 'SYR'], [764, 'THA'], [792, 'TUR'], [800, 'UGA'], [804, 'UKR'],
  [784, 'ARE'], [826, 'GBR'], [840, 'USA'], [858, 'URY'], [862, 'VEN'], [704, 'VNM'],
  [887, 'YEM'], [894, 'ZMB'], [716, 'ZWE'], [112, 'BLR'], [398, 'KAZ'],
  [417, 'KGZ'], [762, 'TJK'], [795, 'TKM'], [860, 'UZB'], [51, 'ARM'], [31, 'AZE'],
  [268, 'GEO'], [498, 'MDA'], [440, 'LTU'], [428, 'LVA'], [233, 'EST'],
  [458, 'MYS'], [702, 'SGP'], [512, 'OMN'], [48, 'BHR'], [834, 'TZA'],
  [703, 'SVK'], [705, 'SVN'], [688, 'SRB'], [499, 'MNE'], [807, 'MKD'],
  [144, 'LKA'], [178, 'COG'], [232, 'ERI'], [324, 'GIN'], [384, 'CIV'],
  [418, 'LAO'], [426, 'LSO'], [450, 'MDG'], [454, 'MWI'], [466, 'MLI'],
  [562, 'NER'], [624, 'GNB'], [748, 'SWZ'], [768, 'TGO'],
  [788, 'TUN'], [854, 'BFA'],
]);

function getEraLabel(y: number): { label: string; sub: string } {
  if (y <= 1918) return { label: 'World War I', sub: '1914–1918' };
  if (y <= 1938) return { label: 'Interwar Period', sub: '1919–1938' };
  if (y <= 1945) return { label: 'World War II', sub: '1939–1945' };
  if (y <= 1953) return { label: 'Early Cold War', sub: '1946–1953' };
  if (y <= 1975) return { label: 'Cold War / Vietnam Era', sub: '1954–1975' };
  if (y <= 1991) return { label: 'Late Cold War', sub: '1976–1991' };
  if (y <= 2001) return { label: 'Post-Cold War', sub: '1992–2001' };
  if (y <= 2010) return { label: 'War on Terror', sub: '2002–2010' };
  if (y <= 2021) return { label: 'Contemporary Conflicts', sub: '2011–2021' };
  return { label: 'Ukraine War Era', sub: '2022–present' };
}

function buildStockTotalsMap(year: number): CountryTotalsMap {
  const map: CountryTotalsMap = {};
  for (const [iso3, indexKey] of Object.entries(COUNTRY_TO_INDEX)) {
    const index = STOCK_INDICES[indexKey];
    if (!index) continue;
    const curr = index.data[year];
    const prev = index.data[year - 1];
    if (curr == null || prev == null) continue;
    const pct = ((curr - prev) / prev) * 100;
    if (!map[iso3]) map[iso3] = {};
    // Positive pct (market up) → net negative (BLUE on RdBu scale = good)
    // Negative pct (market down) → net positive (RED on RdBu scale = bad)
    map[iso3]![year] = pct >= 0
      ? { exports: 0, imports: pct }
      : { exports: Math.abs(pct), imports: 0 };
  }
  return map;
}

export default function Markets() {
  const { year, selectedCountry, hoveredCountry, setSelectedCountry, setHoveredCountry } = useAtlasStore();
  const [shadingView, setShadingView] = useState<ShadingView>('military');
  const [countries, setCountries] = useState<Country[]>([]);
  const [countryNameMap, setCountryNameMap] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    api.countries().then((data) => {
      setCountries(data);
      const m = new Map<string, string>();
      for (const c of data) m.set(c.iso3, c.displayName);
      setCountryNameMap(m);
    }).catch(console.error);
  }, []);

  const militaryTotals = useMemo(() => buildMilitaryTotalsMap(year), [year]);
  const stockTotals = useMemo(() => buildStockTotalsMap(year), [year]);

  const countryTotals = shadingView === 'military' ? militaryTotals : stockTotals;
  const shadingMode: ShadingMode = shadingView === 'stock' ? 'net' : 'exports';

  const handleCountryClick = useCallback(
    (iso3: string | null) => setSelectedCountry(iso3 === selectedCountry ? null : iso3),
    [selectedCountry, setSelectedCountry],
  );

  const era = getEraLabel(year);
  const activeEmpires = HISTORICAL_TERRITORIES.filter((t) => year >= t.yearFrom && year <= t.yearTo);

  const selectedName = selectedCountry
    ? (countryNameMap.get(selectedCountry)
        ?? HISTORICAL_TERRITORIES.find((t) => t.iso3 === selectedCountry)?.label
        ?? selectedCountry)
    : null;

  // For stock view: find the index key and its data for the year
  const stockInfo = (() => {
    if (shadingView !== 'stock' || !selectedCountry) return null;
    const k = COUNTRY_TO_INDEX[selectedCountry];
    if (!k) return null;
    const idx = STOCK_INDICES[k];
    if (!idx) return null;
    const curr = idx.data[year];
    const prev = idx.data[year - 1];
    if (curr == null) return null;
    const pct = prev != null ? ((curr - prev) / prev) * 100 : null;
    return { name: idx.shortName, value: curr, pct };
  })();

  return (
    <div className="relative flex flex-col h-full overflow-hidden bg-ink">
      {/* Era + empire banner */}
      <div className="flex-shrink-0 flex items-center gap-4 px-5 py-2 border-b border-white/10 bg-ink/80 backdrop-blur-sm z-10">
        <div className="flex items-baseline gap-2">
          <span className="font-serif text-parchment text-sm font-semibold">{era.label}</span>
          <span className="text-muted text-caption font-mono">{era.sub}</span>
        </div>
        {activeEmpires.length > 0 && (
          <div className="flex items-center gap-3 ml-2">
            {activeEmpires.map((t) => (
              <div key={t.iso3} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: t.color }} />
                <span className="text-caption text-parchment/70">{t.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Shading toggle — right-aligned */}
        <div className="ml-auto flex items-center gap-1 bg-white/5 rounded p-0.5">
          <button
            onClick={() => setShadingView('military')}
            className={`text-caption px-3 py-1 rounded transition-colors font-sans ${shadingView === 'military' ? 'bg-white/15 text-parchment' : 'text-muted hover:text-parchment/70'}`}
          >
            ⚔ Military Strength
          </button>
          <button
            onClick={() => setShadingView('stock')}
            className={`text-caption px-3 py-1 rounded transition-colors font-sans ${shadingView === 'stock' ? 'bg-white/15 text-parchment' : 'text-muted hover:text-parchment/70'}`}
          >
            📈 Stock Returns
          </button>
        </div>
      </div>

      {/* Map area */}
      <div className="flex-1 relative overflow-hidden">
        <WorldMap
          year={year}
          selectedCountry={selectedCountry}
          hoveredCountry={hoveredCountry}
          countryTotals={countryTotals}
          shadingMode={shadingMode}
          onCountryClick={handleCountryClick}
          onCountryHover={setHoveredCountry}
          iso3ByNumeric={ISO3_BY_NUMERIC}
          flows={[]}
          countryData={countries}
          showFlows={false}
          onFlowHover={() => {}}
        />

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-ink/80 backdrop-blur-sm border border-white/10 rounded px-3 py-2 text-caption text-muted pointer-events-none">
          {shadingView === 'military' ? (
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 rounded" style={{ background: 'linear-gradient(to right, #440154, #31688e, #35b779, #fde725)' }} />
              <span>Weak → Dominant</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-red-400">▼ Down</span>
              <div className="w-20 h-2 rounded" style={{ background: 'linear-gradient(to right, #d73027, #f7f7f7, #4575b4)' }} />
              <span className="text-blue-400">▲ Up</span>
            </div>
          )}
        </div>

        {/* Hover tooltip */}
        {hoveredCountry && !selectedCountry && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-ink/90 backdrop-blur-sm border border-white/15 rounded px-3 py-1.5 pointer-events-none z-10">
            <span className="text-parchment text-xs font-mono">
              {countryNameMap.get(hoveredCountry)
                ?? HISTORICAL_TERRITORIES.find((t) => t.iso3 === hoveredCountry)?.label
                ?? hoveredCountry}
            </span>
            {shadingView === 'stock' && stockInfo && hoveredCountry === selectedCountry && (
              <span className={`ml-2 text-caption ${(stockInfo.pct ?? 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {stockInfo.name} {stockInfo.pct != null ? `${(stockInfo.pct ?? 0) >= 0 ? '+' : ''}${stockInfo.pct.toFixed(1)}%` : ''}
              </span>
            )}
          </div>
        )}

        {/* MarketsPanel */}
        {selectedCountry && selectedName && (
          <MarketsPanel
            iso3={selectedCountry}
            countryName={selectedName}
            year={year}
            onClose={() => setSelectedCountry(null)}
          />
        )}
      </div>

      {/* Time slider */}
      <div className="flex-shrink-0">
        <TimeSlider countryTotals={countryTotals} showStockMarket={shadingView === 'stock'} />
      </div>
    </div>
  );
}
