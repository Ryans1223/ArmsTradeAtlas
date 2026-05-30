import { useRef, useEffect, useCallback } from 'react';
import type { CountryTotalsMap } from '../../api.ts';
import { COUNTRY_PROFILES, HISTORICAL_SUCCESSOR } from '../../data/countryProfiles.ts';
import { STOCK_INDICES, COUNTRY_TO_INDEX } from '../../data/stockIndices.ts';

const MIN_YEAR = 1914;
const MAX_YEAR = 2024;

const CATEGORY_COLORS: Record<string, string> = {
  aircraft: '#5b9bd5',
  missiles: '#e05c4e',
  naval: '#2e6da4',
  armored_vehicles: '#70a353',
  artillery: '#c9a24b',
  sensors: '#9b70c2',
  other: '#888888',
};

function formatTiv(tiv: number): string {
  if (tiv === 0) return '—';
  if (tiv >= 1000) return `${(tiv / 1000).toFixed(1)}B`;
  return `${tiv.toFixed(0)}M`;
}

function flagEmoji(iso2: string): string {
  return [...iso2.toUpperCase()]
    .map((c) => String.fromCodePoint(c.charCodeAt(0) + 127397))
    .join('');
}

interface CountryPanelProps {
  iso3: string;
  countryName: string;
  year: number;
  countryTotals: CountryTotalsMap;
  topSuppliers: { iso3: string; tiv: number }[];
  topRecipients: { iso3: string; tiv: number }[];
  weaponMix: Record<string, number>;
  countryNameMap: Map<string, string>;
  onClose: () => void;
}

export default function CountryPanel({
  iso3,
  countryName,
  year,
  countryTotals,
  topSuppliers,
  topRecipients,
  weaponMix,
  countryNameMap,
  onClose,
}: CountryPanelProps) {
  const tradeSparkRef = useRef<SVGSVGElement>(null);
  const marketSparkRef = useRef<SVGSVGElement>(null);

  const profile = COUNTRY_PROFILES[iso3];
  const indexKey = COUNTRY_TO_INDEX[iso3];
  const stockIndex = indexKey ? STOCK_INDICES[indexKey] : null;

  // Use successor state's totals if historical entity was merged away
  const effectiveIso3 = countryTotals[iso3] ? iso3 : (HISTORICAL_SUCCESSOR[iso3] ?? iso3);
  const countryYearData = countryTotals[effectiveIso3] ?? {};
  const yearData = countryYearData[year];
  const exports = yearData?.exports ?? 0;
  const imports = yearData?.imports ?? 0;
  const maxTradeVal = Math.max(exports, imports);

  // Weapon mix totals
  const weaponTotal = Object.values(weaponMix).reduce((s, v) => s + v, 0);
  const topWeapons = Object.entries(weaponMix)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .filter(([, v]) => v > 0);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Draw arms trade sparkline
  const drawTradeSparkline = useCallback(() => {
    if (!tradeSparkRef.current) return;
    const svg = tradeSparkRef.current;
    const width = svg.clientWidth || 240;
    const height = 52;
    svg.setAttribute('height', String(height));
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const exportData: number[] = [];
    const importData: number[] = [];
    for (let y = MIN_YEAR; y <= MAX_YEAR; y++) {
      const d = countryYearData[y];
      exportData.push(d?.exports ?? 0);
      importData.push(d?.imports ?? 0);
    }

    const maxVal = Math.max(...exportData, ...importData, 1);
    const totalYears = MAX_YEAR - MIN_YEAR;
    const xScale = (idx: number) => (idx / totalYears) * width;
    const yScale = (v: number) => height - 2 - (v / maxVal) * (height - 6);

    // Zero baseline
    const baseline = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    baseline.setAttribute('x1', '0'); baseline.setAttribute('x2', String(width));
    baseline.setAttribute('y1', String(height - 2)); baseline.setAttribute('y2', String(height - 2));
    baseline.setAttribute('stroke', '#1a3550'); baseline.setAttribute('stroke-width', '0.5');
    svg.appendChild(baseline);

    // Import line (blue, behind)
    const importPts = importData.map((v, i) => `${xScale(i).toFixed(1)},${yScale(v).toFixed(1)}`).join(' ');
    const importLine = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    importLine.setAttribute('points', importPts);
    importLine.setAttribute('fill', 'none');
    importLine.setAttribute('stroke', '#5b9bd5');
    importLine.setAttribute('stroke-width', '1');
    importLine.setAttribute('opacity', '0.55');
    svg.appendChild(importLine);

    // Export line (gold, front)
    const exportPts = exportData.map((v, i) => `${xScale(i).toFixed(1)},${yScale(v).toFixed(1)}`).join(' ');
    const exportLine = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    exportLine.setAttribute('points', exportPts);
    exportLine.setAttribute('fill', 'none');
    exportLine.setAttribute('stroke', '#C9A24B');
    exportLine.setAttribute('stroke-width', '1.5');
    exportLine.setAttribute('opacity', '0.85');
    svg.appendChild(exportLine);

    // Current year indicator
    const x = xScale(year - MIN_YEAR);
    const indicator = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    indicator.setAttribute('x1', String(x)); indicator.setAttribute('x2', String(x));
    indicator.setAttribute('y1', '0'); indicator.setAttribute('y2', String(height));
    indicator.setAttribute('stroke', '#C9A24B'); indicator.setAttribute('stroke-width', '1');
    indicator.setAttribute('opacity', '0.5');
    svg.appendChild(indicator);

    // Dot at current year for exports
    const expDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    expDot.setAttribute('cx', String(x));
    expDot.setAttribute('cy', String(yScale(exports)));
    expDot.setAttribute('r', '2.5');
    expDot.setAttribute('fill', '#C9A24B');
    svg.appendChild(expDot);
  }, [countryYearData, year, exports]);

  useEffect(() => { drawTradeSparkline(); }, [drawTradeSparkline]);

  // Draw stock market sparkline
  useEffect(() => {
    if (!marketSparkRef.current || !stockIndex) return;
    const svg = marketSparkRef.current;
    const width = svg.clientWidth || 240;
    const height = 44;
    svg.setAttribute('height', String(height));
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const years = Object.keys(stockIndex.data).map(Number).sort((a, b) => a - b);
    if (years.length < 2) return;
    const minY = years[0]!;
    const maxY = years[years.length - 1]!;
    const maxVal = Math.max(...years.map((y) => stockIndex.data[y] ?? 0), 1);
    const xScale = (y: number) => ((y - minY) / (maxY - minY)) * width;
    const yScale = (v: number) => height - 2 - (v / maxVal) * (height - 6);

    const pts = years.map((y) => `${xScale(y).toFixed(1)},${yScale(stockIndex.data[y] ?? 0).toFixed(1)}`).join(' ');
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    line.setAttribute('points', pts);
    line.setAttribute('fill', 'none');
    line.setAttribute('stroke', stockIndex.color);
    line.setAttribute('stroke-width', '1.5');
    line.setAttribute('opacity', '0.85');
    svg.appendChild(line);

    // Year indicator (only if in data range)
    if (year >= minY && year <= maxY) {
      const x = xScale(year);
      const ind = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      ind.setAttribute('x1', String(x)); ind.setAttribute('x2', String(x));
      ind.setAttribute('y1', '0'); ind.setAttribute('y2', String(height));
      ind.setAttribute('stroke', '#C9A24B'); ind.setAttribute('stroke-width', '1');
      ind.setAttribute('opacity', '0.5');
      svg.appendChild(ind);

      const val = stockIndex.data[year];
      if (val !== undefined) {
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('cx', String(x));
        dot.setAttribute('cy', String(yScale(val)));
        dot.setAttribute('r', '2.5');
        dot.setAttribute('fill', stockIndex.color);
        svg.appendChild(dot);
      }
    }
  }, [stockIndex, year]);

  const stockValue = stockIndex?.data[year];
  const stockPrev = stockIndex?.data[year - 1];
  const stockPct = stockValue != null && stockPrev != null
    ? ((stockValue - stockPrev) / stockPrev * 100).toFixed(1)
    : null;
  const stockUp = stockPct != null ? parseFloat(stockPct) >= 0 : true;

  const netBadge = exports > imports
    ? { label: 'NET EXPORTER', cls: 'text-gold/80 bg-gold/10 border-gold/20' }
    : imports > exports
      ? { label: 'NET IMPORTER', cls: 'text-[#5b9bd5]/80 bg-[#5b9bd5]/10 border-[#5b9bd5]/20' }
      : null;

  return (
    <div className="absolute right-0 top-0 bottom-0 w-72 bg-[#071320]/96 backdrop-blur-sm border-l border-white/10 z-20 flex flex-col overflow-hidden shadow-2xl">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between px-4 pt-4 pb-3 border-b border-white/8 flex-shrink-0">
        <div className="flex items-start gap-2.5 min-w-0">
          {profile?.iso2 && (
            <span className="text-2xl leading-none mt-0.5 flex-shrink-0">{flagEmoji(profile.iso2)}</span>
          )}
          <div className="min-w-0">
            <h2 className="font-serif text-[15px] font-semibold text-parchment leading-snug">{countryName}</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[9px] text-muted/60 tabular-nums font-mono">{iso3}</span>
              {netBadge && (
                <span className={`text-[8px] px-1 py-0.5 rounded border ${netBadge.cls} uppercase tracking-wide`}>
                  {netBadge.label}
                </span>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 mt-0.5 w-6 h-6 flex items-center justify-center rounded-sm text-muted/60 hover:text-parchment hover:bg-white/5 transition-colors"
          aria-label="Close panel"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
            <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          </svg>
        </button>
      </div>

      {/* ── Scrollable body ─────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">

        {/* ── Arms Trade ─────────────────────────────────────────────── */}
        <div className="px-4 py-3 border-b border-white/8">
          <div className="text-[9px] uppercase tracking-widest text-gold/60 mb-3">Arms Trade · {year}</div>

          {maxTradeVal > 0 ? (
            <>
              {/* Export bar */}
              <div className="mb-2">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-[10px] text-muted/70">Exported (TIV)</span>
                  <span className="text-[11px] text-gold font-semibold tabular-nums">{formatTiv(exports)}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${exports > 0 ? Math.max(2, (exports / maxTradeVal) * 100) : 0}%`,
                      backgroundColor: '#C9A24B',
                      opacity: 0.75,
                    }}
                  />
                </div>
              </div>

              {/* Import bar */}
              <div className="mb-3">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-[10px] text-muted/70">Imported (TIV)</span>
                  <span className="text-[11px] text-[#5b9bd5] font-semibold tabular-nums">{formatTiv(imports)}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${imports > 0 ? Math.max(2, (imports / maxTradeVal) * 100) : 0}%`,
                      backgroundColor: '#5b9bd5',
                      opacity: 0.7,
                    }}
                  />
                </div>
              </div>
            </>
          ) : (
            <p className="text-[10px] text-muted/40 italic mb-3">No recorded transfers in {year}</p>
          )}

          {/* Weapon mix */}
          {topWeapons.length > 0 && (
            <div className="mb-3">
              <div className="text-[9px] text-muted/50 uppercase tracking-wider mb-1.5">Weapon categories</div>
              <div className="space-y-1">
                {topWeapons.map(([cat, val]) => (
                  <div key={cat} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: CATEGORY_COLORS[cat] ?? '#888' }} />
                    <span className="text-[10px] text-muted/70 capitalize flex-1">{cat.replace('_', ' ')}</span>
                    <span className="text-[10px] tabular-nums" style={{ color: CATEGORY_COLORS[cat] ?? '#888' }}>
                      {weaponTotal > 0 ? `${((val / weaponTotal) * 100).toFixed(0)}%` : formatTiv(val)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sparkline */}
          <div className="mb-3">
            <div className="flex justify-between text-[8px] text-muted/30 mb-1">
              <span>{MIN_YEAR}</span>
              <span className="text-gold/40">─ exports</span>
              <span className="text-[#5b9bd5]/40">─ imports</span>
              <span>{MAX_YEAR}</span>
            </div>
            <svg ref={tradeSparkRef} className="w-full" height="52" aria-hidden="true" />
          </div>

          {/* Top recipients */}
          {topRecipients.length > 0 && (
            <div className="mb-2.5">
              <div className="text-[9px] text-muted/50 uppercase tracking-wider mb-1">Top recipients</div>
              {topRecipients.slice(0, 4).map((r) => (
                <div key={r.iso3} className="flex items-center justify-between py-0.5">
                  <span className="text-[10px] text-parchment/75">{countryNameMap.get(r.iso3) ?? r.iso3}</span>
                  <span className="text-[10px] text-gold/70 tabular-nums">{formatTiv(r.tiv)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Top suppliers */}
          {topSuppliers.length > 0 && (
            <div>
              <div className="text-[9px] text-muted/50 uppercase tracking-wider mb-1">Top suppliers</div>
              {topSuppliers.slice(0, 4).map((s) => (
                <div key={s.iso3} className="flex items-center justify-between py-0.5">
                  <span className="text-[10px] text-parchment/75">{countryNameMap.get(s.iso3) ?? s.iso3}</span>
                  <span className="text-[10px] text-[#5b9bd5]/70 tabular-nums">{formatTiv(s.tiv)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Economy ──────────────────────────────────────────────── */}
        {profile && (
          <div className="px-4 py-3 border-b border-white/8">
            <div className="text-[9px] uppercase tracking-widest text-gold/60 mb-2">Economy</div>
            <p className="text-[11px] text-parchment/85 leading-relaxed mb-2">{profile.gdpNote}</p>
            <p className="text-[10px] text-muted/65 leading-relaxed">{profile.keyFact}</p>
          </div>
        )}

        {/* ── Military ─────────────────────────────────────────────── */}
        {profile && (
          <div className="px-4 py-3 border-b border-white/8">
            <div className="text-[9px] uppercase tracking-widest text-gold/60 mb-2">Military</div>
            <p className="text-[11px] text-parchment/85 leading-relaxed">{profile.militaryNote}</p>
          </div>
        )}

        {/* ── Markets ──────────────────────────────────────────────── */}
        {stockIndex && (
          <div className="px-4 py-3">
            <div className="text-[9px] uppercase tracking-widest text-gold/60 mb-2">
              Markets · {stockIndex.shortName}
            </div>

            {stockValue != null ? (
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-serif text-xl tabular-nums" style={{ color: stockIndex.color }}>
                  {stockValue.toLocaleString()}
                </span>
                {stockPct != null && (
                  <span className={`text-[10px] font-medium ${stockUp ? 'text-green-400' : 'text-red-400'}`}>
                    {stockUp ? '▲' : '▼'} {Math.abs(parseFloat(stockPct))}%
                  </span>
                )}
              </div>
            ) : (
              <p className="text-[10px] text-muted/40 italic mb-2">No data for {year}</p>
            )}

            <svg ref={marketSparkRef} className="w-full" height="44" aria-hidden="true" />
            <p className="text-[9px] text-muted/40 mt-1.5 leading-tight">{stockIndex.description}</p>
          </div>
        )}

        {!profile && !stockIndex && maxTradeVal === 0 && (
          <div className="px-4 py-6 text-center">
            <p className="text-[10px] text-muted/40 italic">No data available for {countryName} in {year}.</p>
          </div>
        )}

        <div className="h-4" />
      </div>
    </div>
  );
}
