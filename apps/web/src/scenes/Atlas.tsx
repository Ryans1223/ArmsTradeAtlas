import { useEffect, useState, useCallback, useRef } from 'react';
import WorldMap from '../components/map/WorldMap.tsx';
import CountryTooltip from '../components/map/CountryTooltip.tsx';
import TimeSlider from '../components/timeline/TimeSlider.tsx';
import FilterRail from '../components/filters/FilterRail.tsx';
import { useAtlasStore } from '../store.ts';
import { api, type CountryTotalsMap } from '../api.ts';
import type { Country } from '@arms-atlas/types';

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
  [508, 'MOZ'], [516, 'NAM'], [524, 'NPL'], [528, 'NLD'], [540, 'NCL'], [554, 'NZL'],
  [558, 'NIC'], [566, 'NGA'], [578, 'NOR'], [586, 'PAK'], [591, 'PAN'], [598, 'PNG'],
  [604, 'PER'], [608, 'PHL'], [616, 'POL'], [620, 'PRT'], [630, 'PRI'], [634, 'QAT'],
  [642, 'ROU'], [643, 'RUS'], [646, 'RWA'], [682, 'SAU'], [686, 'SEN'], [694, 'SLE'],
  [706, 'SOM'], [710, 'ZAF'], [724, 'ESP'], [729, 'SDN'], [736, 'SDN'], [752, 'SWE'],
  [756, 'CHE'], [760, 'SYR'], [764, 'THA'], [792, 'TUR'], [800, 'UGA'], [804, 'UKR'],
  [784, 'ARE'], [826, 'GBR'], [840, 'USA'], [858, 'URY'], [862, 'VEN'], [704, 'VNM'],
  [887, 'YEM'], [894, 'ZMB'], [716, 'ZWE'], [32, 'ARG'], [112, 'BLR'], [398, 'KAZ'],
  [417, 'KGZ'], [762, 'TJK'], [795, 'TKM'], [860, 'UZB'], [51, 'ARM'], [31, 'AZE'],
  [268, 'GEO'], [498, 'MDA'], [440, 'LTU'], [428, 'LVA'], [233, 'EST'],
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
  const containerRef = useRef<HTMLDivElement>(null);
  const profileCacheRef = useRef<Map<string, TooltipState>>(new Map());

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

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setTooltipPos({ x: e.clientX, y: e.clientY });
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-1 overflow-hidden">
        <FilterRail />

        <div
          ref={containerRef}
          className="flex-1 relative overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => {
            setHoveredCountry(null);
            setTooltip(null);
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

          {dataStatus === 'loading' && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-ink/50">
              <div className="text-caption text-muted animate-pulse">Loading data...</div>
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
          />

          <CountryTooltip
            data={tooltip}
            x={tooltipPos.x}
            y={tooltipPos.y}
          />

          {selectedCountry && (
            <div className="absolute top-4 right-4 bg-ink-light border border-ink-light/70 rounded-sm p-3 text-caption">
              <div className="text-muted uppercase tracking-wider mb-1">Selected</div>
              <div className="font-serif text-sm text-parchment">
                {countries.find((c) => c.iso3 === selectedCountry)?.displayName ?? selectedCountry}
              </div>
              <div className="text-gold font-medium mt-1">
                {countryTotals[selectedCountry]?.[year]
                  ? `${(countryTotals[selectedCountry]![year]!.exports / 1000).toFixed(1)}B TIV exported`
                  : 'No export data'}
              </div>
            </div>
          )}
        </div>
      </div>

      <TimeSlider countryTotals={countryTotals} />
    </div>
  );
}
