import { useEffect, useRef } from 'react';
import { useAtlasStore } from '../../store.ts';
import type { CountryTotalsMap } from '../../api.ts';
import { DOW_JONES, MARKET_ANNOTATIONS } from '../../data/stockMarket.ts';

const MIN_YEAR = 1914;
const MAX_YEAR = 2024;

interface TimeSliderProps {
  countryTotals: CountryTotalsMap;
  showStockMarket: boolean;
}

export default function TimeSlider({ countryTotals, showStockMarket }: TimeSliderProps) {
  const { year, setYear, isPlaying, setIsPlaying } = useAtlasStore();
  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sparkRef = useRef<SVGSVGElement>(null);

  const globalTotals: { year: number; total: number }[] = [];
  for (let y = MIN_YEAR; y <= MAX_YEAR; y++) {
    let total = 0;
    for (const iso3 in countryTotals) total += countryTotals[iso3]?.[y]?.exports ?? 0;
    globalTotals.push({ year: y, total });
  }

  useEffect(() => {
    if (!sparkRef.current || globalTotals.length === 0) return;
    const svg = sparkRef.current;
    const width = svg.clientWidth || 400;
    const height = showStockMarket ? 60 : 40;
    svg.setAttribute('height', String(height));

    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const xScale = (y: number) => ((y - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * width;

    // ── Arms trade sparkline (top half) ───────────────────────────────
    const armsMax = Math.max(...globalTotals.map((d) => d.total), 1);
    const armsHeight = showStockMarket ? height / 2 - 2 : height;
    const armsY = (v: number) => armsHeight - (v / armsMax) * (armsHeight - 4) - 2;
    const armsPoints = globalTotals.map((d) => `${xScale(d.year)},${armsY(d.total)}`).join(' ');

    const armsPoly = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    armsPoly.setAttribute('points', armsPoints);
    armsPoly.setAttribute('fill', 'none');
    armsPoly.setAttribute('stroke', '#C9A24B');
    armsPoly.setAttribute('stroke-width', '1.5');
    armsPoly.setAttribute('opacity', '0.7');
    svg.appendChild(armsPoly);

    if (showStockMarket) {
      // ── Divider ──────────────────────────────────────────────────────
      const divider = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      divider.setAttribute('x1', '0'); divider.setAttribute('x2', String(width));
      divider.setAttribute('y1', String(height / 2)); divider.setAttribute('y2', String(height / 2));
      divider.setAttribute('stroke', '#1a2f44'); divider.setAttribute('stroke-width', '1');
      svg.appendChild(divider);

      // ── Dow Jones sparkline (bottom half) ────────────────────────────
      const djOffset = height / 2 + 2;
      const djHeight = height / 2 - 4;
      const djYears = Object.keys(DOW_JONES).map(Number).filter((y) => y >= MIN_YEAR && y <= MAX_YEAR);
      const djMax = Math.max(...djYears.map((y) => DOW_JONES[y] ?? 0), 1);
      const djY = (v: number) => djOffset + djHeight - (v / djMax) * (djHeight - 2) - 1;
      const djPoints = djYears.map((y) => `${xScale(y)},${djY(DOW_JONES[y] ?? 0)}`).join(' ');

      // Crash shading (fill under crash periods)
      const crashYears = [
        [1929, 1933], [1973, 1975], [2000, 2002], [2008, 2009], [2020, 2020],
      ];
      for (const [from, to] of crashYears) {
        if (from === undefined || to === undefined) continue;
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', String(xScale(from)));
        rect.setAttribute('width', String(Math.max(xScale(to + 1) - xScale(from), 2)));
        rect.setAttribute('y', String(djOffset));
        rect.setAttribute('height', String(djHeight));
        rect.setAttribute('fill', '#e05c4e');
        rect.setAttribute('opacity', '0.12');
        svg.appendChild(rect);
      }

      const djPoly = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      djPoly.setAttribute('points', djPoints);
      djPoly.setAttribute('fill', 'none');
      djPoly.setAttribute('stroke', '#5b9bd5');
      djPoly.setAttribute('stroke-width', '1.5');
      djPoly.setAttribute('opacity', '0.8');
      svg.appendChild(djPoly);

      // Crash/boom annotation dots
      for (const ann of MARKET_ANNOTATIONS) {
        if (ann.year < MIN_YEAR || ann.year > MAX_YEAR) continue;
        const cx = xScale(ann.year);
        const cy = djY(DOW_JONES[ann.year] ?? 0);
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('cx', String(cx));
        dot.setAttribute('cy', String(cy));
        dot.setAttribute('r', '2.5');
        dot.setAttribute('fill', ann.type === 'crash' ? '#e05c4e' : ann.type === 'boom' ? '#70a353' : '#C9A24B');
        dot.setAttribute('opacity', '0.9');
        svg.appendChild(dot);
      }

      // "DJIA" label
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', '3'); label.setAttribute('y', String(height - 2));
      label.setAttribute('fill', '#5b9bd5'); label.setAttribute('font-size', '7');
      label.setAttribute('opacity', '0.7'); label.textContent = 'DJIA';
      svg.appendChild(label);
    }

    // ── Year indicator line (both sparklines) ─────────────────────────
    const indicator = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    const x = xScale(year);
    indicator.setAttribute('x1', String(x)); indicator.setAttribute('x2', String(x));
    indicator.setAttribute('y1', '0'); indicator.setAttribute('y2', String(height));
    indicator.setAttribute('stroke', '#C9A24B'); indicator.setAttribute('stroke-width', '1');
    svg.appendChild(indicator);

    // Show Dow Jones value for current year if stock market visible
    if (showStockMarket && DOW_JONES[year]) {
      const djVal = DOW_JONES[year]!;
      const prev = DOW_JONES[year - 1];
      const pct = prev ? ((djVal - prev) / prev * 100).toFixed(1) : null;
      const valLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      valLabel.setAttribute('x', String(Math.min(x + 4, width - 50)));
      valLabel.setAttribute('y', String(height - 2));
      valLabel.setAttribute('fill', pct !== null && parseFloat(pct) < 0 ? '#e05c4e' : '#5b9bd5');
      valLabel.setAttribute('font-size', '7');
      valLabel.setAttribute('opacity', '0.9');
      valLabel.textContent = `${djVal.toLocaleString()}${pct !== null ? ` (${parseFloat(pct) > 0 ? '+' : ''}${pct}%)` : ''}`;
      svg.appendChild(valLabel);
    }
  }, [globalTotals, year, showStockMarket]);

  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setYear(useAtlasStore.getState().year >= MAX_YEAR ? MIN_YEAR : useAtlasStore.getState().year + 1);
      }, 1200);
    } else {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    }
    return () => { if (playIntervalRef.current) clearInterval(playIntervalRef.current); };
  }, [isPlaying, setYear]);

  return (
    <div className="flex flex-col gap-1 px-4 py-3 border-t border-ink-light bg-ink">
      <svg ref={sparkRef} className="w-full" height={showStockMarket ? 60 : 40} aria-hidden="true" role="presentation" />

      {showStockMarket && (
        <div className="flex justify-between text-[8px] text-muted/50 -mt-1 px-0.5">
          <span className="text-gold/60">Arms TIV</span>
          <span className="text-[#5b9bd5]/60">Dow Jones Industrial Average — hover for context</span>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-sm border border-ink-light text-parchment hover:border-gold hover:text-gold transition-colors focus-visible:outline-2 focus-visible:outline-gold"
          aria-label={isPlaying ? 'Pause animation' : 'Play through years'}
        >
          {isPlaying ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
              <rect x="1" y="1" width="4" height="10" rx="1" /><rect x="7" y="1" width="4" height="10" rx="1" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
              <path d="M2 1l9 5-9 5V1z" />
            </svg>
          )}
        </button>

        <div className="flex items-center gap-2 flex-1">
          <span className="font-sans text-caption text-muted w-10 text-right flex-shrink-0">{MIN_YEAR}</span>
          <input
            type="range" min={MIN_YEAR} max={MAX_YEAR} value={year}
            onChange={(e) => setYear(parseInt(e.target.value, 10))}
            className="flex-1 h-1 bg-ink-light rounded-full appearance-none cursor-pointer accent-gold"
            aria-label="Select year" aria-valuemin={MIN_YEAR} aria-valuemax={MAX_YEAR} aria-valuenow={year}
          />
          <span className="font-sans text-caption text-muted w-10 flex-shrink-0">{MAX_YEAR}</span>
        </div>

        <div className="flex-shrink-0 w-14 text-center font-serif text-lg font-semibold text-gold tabular-nums" aria-live="polite" aria-atomic="true">
          {year}
        </div>
      </div>
    </div>
  );
}
