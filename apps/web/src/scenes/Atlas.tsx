import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import WorldMap from '../components/map/WorldMap.tsx';
import CountryTooltip from '../components/map/CountryTooltip.tsx';
import FlowTooltip from '../components/map/FlowTooltip.tsx';
import type { FlowHoverState } from '../components/map/FlowTooltip.tsx';
import TimeSlider from '../components/timeline/TimeSlider.tsx';
import FilterRail from '../components/filters/FilterRail.tsx';
import CountryPanel from '../components/panel/CountryPanel.tsx';
import { useAtlasStore } from '../store.ts';
import { api, type CountryTotalsMap } from '../api.ts';
import type { Country, TradeFlow } from '@arms-atlas/types';
import { HISTORICAL_TERRITORIES } from '../data/historicalTerritories.ts';
import { MARKET_ANNOTATIONS } from '../data/stockMarket.ts';

const ERA_ECONOMIC_NOTES: Partial<Record<string, string>> = {
  'World War I': 'Allied war bonds raised $21B (1917–18). US commercial credit to Allies exceeded $3B before entering the war.',
  'Interwar Period': 'Washington Naval Treaty (1922) capped warship construction. Great Depression cut global defence budgets 30–50%.',
  'World War II': 'US Lend-Lease: $50.1B total ($723B in 2023 dollars) — 63% to UK, 22% to USSR, 6% to France.',
  'Early Cold War / Korean War': 'US defence spending hit 14.2% of GDP in 1952 — Cold War peak. Marshall Plan: $13.3B to rebuild Western Europe.',
  'Cold War / Vietnam Era': 'US spent ~$738B on Vietnam (2023 $). Soviet military aid to North Vietnam peaked at ~$2B/yr by 1972.',
  'Late Cold War': 'Reagan buildup: US defence budget rose from $134B (1980) to $290B (1988). Soviet military burden ~15–17% of GDP.',
  'Post-Cold War': '"Peace dividend": global arms transfers fell 33% between 1987–1994. US defence spending dropped 35% by 1998.',
  'War on Terror': 'Post-9/11 US defence surge: $312B (2001) → $696B (2010). Iraq & Afghanistan wars: est. $6T total (2023 $).',
  'Contemporary Conflicts': 'Global defence spending crossed $2T/yr for first time in 2022. NATO pledges 2% GDP minimum spending.',
  'Ukraine War Era': 'US committed $75B+ in security aid to Ukraine by end-2023. European rearmament added $100B+ to NATO budgets.',
};

function formatTiv(tiv: number): string {
  if (tiv >= 1000) return `${(tiv / 1000).toFixed(1)}B`;
  return `${tiv.toFixed(0)}M`;
}

function getEraLabel(y: number): { label: string; sub: string } {
  if (y <= 1918) return { label: 'World War I', sub: '1914–1918' };
  if (y <= 1938) return { label: 'Interwar Period', sub: '1919–1938' };
  if (y <= 1945) return { label: 'World War II', sub: '1939–1945' };
  if (y <= 1953) return { label: 'Early Cold War / Korean War', sub: '1946–1953' };
  if (y <= 1975) return { label: 'Cold War / Vietnam Era', sub: '1954–1975' };
  if (y <= 1991) return { label: 'Late Cold War', sub: '1976–1991' };
  if (y <= 2001) return { label: 'Post-Cold War', sub: '1992–2001' };
  if (y <= 2010) return { label: 'War on Terror', sub: '2002–2010' };
  if (y <= 2021) return { label: 'Contemporary Conflicts', sub: '2011–2021' };
  return { label: 'Ukraine War Era', sub: '2022–present' };
}

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
  // Colonial-era territories added for empire overlays
  [144, 'LKA'], [178, 'COG'], [232, 'ERI'], [324, 'GIN'], [384, 'CIV'],
  [418, 'LAO'], [426, 'LSO'], [450, 'MDG'], [454, 'MWI'], [466, 'MLI'],
  [562, 'NER'], [624, 'GNB'], [706, 'SOM'], [748, 'SWZ'], [768, 'TGO'],
  [788, 'TUN'], [854, 'BFA'], [860, 'UZB'],
]);

interface TooltipState {
  iso3: string;
  name: string;
  exports: number;
  imports: number;
  topSuppliers: { iso3: string; tiv: number }[];
  topRecipients: { iso3: string; tiv: number }[];
}

export default function Atlas() {
  const { year, selectedCountry, hoveredCountry, shadingMode, setSelectedCountry, setHoveredCountry } = useAtlasStore();
  const [countryTotals, setCountryTotals] = useState<CountryTotalsMap>({});
  const [countries, setCountries] = useState<Country[]>([]);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [dataStatus, setDataStatus] = useState<'loading' | 'empty' | 'ok'>('loading');
  const [flows, setFlows] = useState<TradeFlow[]>([]);
  const [showFlows, setShowFlows] = useState(true);
  const [showStockMarket, setShowStockMarket] = useState(false);
  const [showEmpirePanel, setShowEmpirePanel] = useState(true);
  const [flowHover, setFlowHover] = useState<FlowHoverState | null>(null);
  const profileCacheRef = useRef<Map<string, TooltipState>>(new Map());
  const flowCacheRef = useRef<Map<number, TradeFlow[]>>(new Map());

  interface SelectedProfile {
    iso3: string;
    name: string;
    exports: number;
    imports: number;
    topSuppliers: { iso3: string; tiv: number }[];
    topRecipients: { iso3: string; tiv: number }[];
    weaponMix: Record<string, number>;
  }
  const [selectedProfile, setSelectedProfile] = useState<SelectedProfile | null>(null);

  const countryNameMap = useMemo(() => {
    const m = new Map<string, string>();
    for (const c of countries) m.set(c.iso3, c.displayName);
    return m;
  }, [countries]);

  const yearStats = useMemo(() => {
    let total = 0;
    const exporters: { iso3: string; value: number }[] = [];
    for (const [iso3, yearMap] of Object.entries(countryTotals)) {
      const d = yearMap[year];
      if (!d) continue;
      total += d.exports;
      if (d.exports > 0) exporters.push({ iso3, value: d.exports });
    }
    exporters.sort((a, b) => b.value - a.value);
    return { total, topExporters: exporters.slice(0, 4) };
  }, [countryTotals, year]);

  const activeEmpires = useMemo(
    () => HISTORICAL_TERRITORIES.filter((t) => year >= t.yearFrom && year <= t.yearTo),
    [year],
  );

  const marketAnnotation = useMemo(
    () => MARKET_ANNOTATIONS.filter((a) => a.year === year)[0] ?? null,
    [year],
  );

  useEffect(() => {
    Promise.all([api.countries(), api.countryTotals()])
      .then(([ctries, totals]) => {
        setCountries(ctries);
        setCountryTotals(totals);
        const hasData = Object.keys(totals).length > 0;
        setDataStatus(hasData ? 'ok' : 'empty');
      })
      .catch(() => setDataStatus('empty'));
  }, []);

  // Fetch flows for the current year, with cache
  useEffect(() => {
    if (dataStatus !== 'ok') return;
    if (flowCacheRef.current.has(year)) {
      setFlows(flowCacheRef.current.get(year)!);
      return;
    }
    api.flows({ from: year, to: year }).then((data) => {
      flowCacheRef.current.set(year, data);
      setFlows(data);
    }).catch(() => setFlows([]));
  }, [year, dataStatus]);

  // Fetch full profile when a country is selected or the year changes
  useEffect(() => {
    if (!selectedCountry) { setSelectedProfile(null); return; }
    const yearData = countryTotals[selectedCountry]?.[year] ?? { exports: 0, imports: 0 };
    const country = countries.find((c) => c.iso3 === selectedCountry);
    const name = country?.displayName ?? selectedCountry;
    setSelectedProfile({ iso3: selectedCountry, name, exports: yearData.exports, imports: yearData.imports, topSuppliers: [], topRecipients: [], weaponMix: {} });
    api.countryProfile(selectedCountry, year)
      .then((p) => {
        setSelectedProfile((prev) =>
          prev?.iso3 === selectedCountry
            ? { iso3: selectedCountry, name, exports: p.totalExports, imports: p.totalImports, topSuppliers: p.topSuppliers, topRecipients: p.topRecipients, weaponMix: p.weaponMix }
            : prev,
        );
      })
      .catch(() => {});
  }, [selectedCountry, year, countryTotals, countries]);

  const handleCountryHover = useCallback(
    async (iso3: string | null) => {
      setHoveredCountry(iso3);

      if (!iso3) {
        setTooltip(null);
        return;
      }

      const cacheKey = `${iso3}-${year}`;
      if (profileCacheRef.current.has(cacheKey)) {
        setTooltip(profileCacheRef.current.get(cacheKey)!);
        return;
      }

      const yearData = countryTotals[iso3]?.[year] ?? { exports: 0, imports: 0 };
      const country = countries.find((c) => c.iso3 === iso3);
      const name = country?.displayName ?? iso3;

      const partial: TooltipState = {
        iso3,
        name,
        exports: yearData.exports,
        imports: yearData.imports,
        topSuppliers: [],
        topRecipients: [],
      };
      setTooltip(partial);

      try {
        const profile = await api.countryProfile(iso3, year);
        const full: TooltipState = {
          iso3,
          name,
          exports: profile.totalExports,
          imports: profile.totalImports,
          topSuppliers: profile.topSuppliers,
          topRecipients: profile.topRecipients,
        };
        profileCacheRef.current.set(cacheKey, full);
        setTooltip(full);
      } catch {
        // partial tooltip remains shown
      }
    },
    [year, countryTotals, countries, setHoveredCountry],
  );

  const handleFlowHover = useCallback((data: FlowHoverState | null) => {
    setFlowHover(data);
    if (!data) setTooltip(null);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setTooltipPos({ x: e.clientX, y: e.clientY });
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-1 overflow-hidden">
        <FilterRail />

        <div
          className="flex-1 relative overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => {
            setHoveredCountry(null);
            setTooltip(null);
            setFlowHover(null);
          }}
        >
          {dataStatus === 'empty' && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-ink-light border border-gold/30 rounded-sm px-4 py-2 text-caption text-parchment/70 text-center max-w-sm">
              No arms trade data loaded. Run <code className="text-gold">pnpm ingest</code> with your SIPRI CSV download to populate the map.
            </div>
          )}

          {dataStatus === 'ok' && (
            <div className="absolute bottom-2 right-4 z-10 text-caption text-muted/60 text-right pointer-events-none">
              Source: SIPRI Arms Transfers Database. TIV values in millions (constant 1990 USD).
            </div>
          )}

          {/* Era overlay badge */}
          {dataStatus === 'ok' && (() => {
            const era = getEraLabel(year);
            return (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none flex flex-col items-center">
                <div className="bg-ink/80 border border-gold/30 rounded-sm px-3 py-1 text-center">
                  <div className="font-serif text-xs text-gold tracking-wide">{era.label}</div>
                  <div className="text-[10px] text-muted/70 tabular-nums">{era.sub}</div>
                </div>
              </div>
            );
          })()}

          {dataStatus === 'loading' && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-ink/50">
              <div className="text-caption text-muted animate-pulse">Loading data...</div>
            </div>
          )}

          {/* Left controls: flow arcs + stock market toggle */}
          {dataStatus === 'ok' && (
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
              <button
                onClick={() => setShowFlows((v) => !v)}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-sm text-caption border transition-colors ${
                  showFlows ? 'bg-ink-light border-gold/50 text-gold' : 'bg-ink border-ink-light/60 text-muted hover:border-gold/30 hover:text-parchment'
                }`}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M1 6 Q4 1 7 4 Q10 7 11 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                  <polygon points="9,2 11,4 9,6" fill="currentColor"/>
                </svg>
                Flow arcs
              </button>

              <button
                onClick={() => setShowStockMarket((v) => !v)}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-sm text-caption border transition-colors ${
                  showStockMarket ? 'bg-ink-light border-[#5b9bd5]/60 text-[#5b9bd5]' : 'bg-ink border-ink-light/60 text-muted hover:border-[#5b9bd5]/30 hover:text-parchment'
                }`}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <polyline points="1,9 3,6 5,8 7,3 11,5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
                Stock market
              </button>

              {showFlows && flows.length > 0 && (
                <div className="bg-ink/80 border border-ink-light/50 rounded-sm px-2.5 py-2 text-[10px] space-y-1">
                  {[['aircraft','Aircraft'],['missiles','Missiles / Air Defense'],['naval','Naval'],['armored_vehicles','Armored Vehicles'],['artillery','Artillery'],['sensors','Sensors']].map(([cat, label]) => (
                    <div key={cat} className="flex items-center gap-1.5 text-muted">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: { aircraft:'#5b9bd5',missiles:'#e05c4e',naval:'#2e6da4',armored_vehicles:'#70a353',artillery:'#c9a24b',sensors:'#9b70c2' }[cat as string] ?? '#888' }} />
                      {label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Market crash / boom annotation banner */}
          {dataStatus === 'ok' && marketAnnotation && (
            <div className={`absolute top-14 left-1/2 -translate-x-1/2 z-10 pointer-events-none px-3 py-1 rounded-sm border text-[10px] text-center whitespace-nowrap ${
              marketAnnotation.type === 'crash' ? 'bg-red-900/60 border-red-500/40 text-red-200' : marketAnnotation.type === 'boom' ? 'bg-green-900/60 border-green-500/40 text-green-200' : 'bg-ink/80 border-gold/30 text-parchment/80'
            }`}>
              {marketAnnotation.label}
            </div>
          )}

          {/* Active empire info panel */}
          {dataStatus === 'ok' && activeEmpires.length > 0 && (
            <div className="absolute bottom-8 left-3 z-10 max-w-[220px]">
              <button
                onClick={() => setShowEmpirePanel((v) => !v)}
                className="w-full flex items-center justify-between bg-ink/90 border border-ink-light/60 rounded-sm px-2.5 py-1.5 text-[10px] text-muted hover:text-parchment transition-colors"
              >
                <span className="uppercase tracking-wider text-[9px]">Empires active · {activeEmpires.length}</span>
                <span>{showEmpirePanel ? '▾' : '▸'}</span>
              </button>
              {showEmpirePanel && (
                <div className="bg-ink/95 border border-ink-light/50 border-t-0 rounded-b-sm divide-y divide-ink-light/30 max-h-52 overflow-y-auto">
                  {activeEmpires.map((emp) => (
                    <div key={emp.iso3} className="px-2.5 py-2">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: emp.color }} />
                        <span className="text-parchment/90 text-[10px] font-medium">{emp.label}</span>
                        <span className="text-muted/60 text-[9px] ml-auto">{emp.yearFrom}–{emp.yearTo}</span>
                      </div>
                      <p className="text-muted/70 text-[9px] leading-tight">{emp.economicNote}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <WorldMap
            year={year}
            selectedCountry={selectedCountry}
            hoveredCountry={hoveredCountry}
            countryTotals={countryTotals}
            shadingMode={shadingMode}
            onCountryClick={setSelectedCountry}
            onCountryHover={handleCountryHover}
            iso3ByNumeric={ISO3_BY_NUMERIC}
            flows={flows}
            countryData={countries}
            showFlows={showFlows}
            onFlowHover={handleFlowHover}
          />

          {/* Country tooltip (shown when not hovering a flow arc) */}
          {!flowHover && (
            <CountryTooltip
              data={tooltip}
              x={tooltipPos.x}
              y={tooltipPos.y}
            />
          )}

          {/* Flow arc tooltip */}
          <FlowTooltip
            data={flowHover}
            x={tooltipPos.x}
            y={tooltipPos.y}
          />

          {selectedProfile && (
            <CountryPanel
              iso3={selectedProfile.iso3}
              countryName={selectedProfile.name}
              year={year}
              countryTotals={countryTotals}
              topSuppliers={selectedProfile.topSuppliers}
              topRecipients={selectedProfile.topRecipients}
              weaponMix={selectedProfile.weaponMix}
              countryNameMap={countryNameMap}
              onClose={() => setSelectedCountry(null)}
            />
          )}
        </div>
      </div>

      {/* Economic context bar */}
      {dataStatus === 'ok' && yearStats.total > 0 && (() => {
        const era = getEraLabel(year);
        const note = ERA_ECONOMIC_NOTES[era.label];
        return (
          <div className="border-t border-ink-light/50 bg-ink px-4 py-1.5 flex items-center gap-6 text-[10px] overflow-hidden flex-shrink-0">
            <div className="flex-shrink-0 flex items-center gap-2">
              <span className="text-muted uppercase tracking-wider text-[9px]">Global TIV {year}</span>
              <span className="font-serif text-sm text-gold font-semibold tabular-nums">{formatTiv(yearStats.total)}</span>
            </div>
            <div className="flex items-center gap-4 overflow-hidden">
              {yearStats.topExporters.map((e) => (
                <div key={e.iso3} className="flex items-center gap-1 flex-shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold/60 flex-shrink-0" />
                  <span className="text-parchment/80">{countryNameMap.get(e.iso3) ?? e.iso3}</span>
                  <span className="text-muted">{formatTiv(e.value)}</span>
                </div>
              ))}
            </div>
            {note && (
              <div className="ml-auto text-muted/60 italic text-right flex-shrink-0 max-w-md hidden xl:block" title={note}>
                {note}
              </div>
            )}
          </div>
        );
      })()}

      <TimeSlider countryTotals={countryTotals} showStockMarket={showStockMarket} />
    </div>
  );
}
