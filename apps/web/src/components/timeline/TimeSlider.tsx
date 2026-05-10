import { useEffect, useRef } from 'react';
import { useAtlasStore } from '../../store.ts';
import type { CountryTotalsMap } from '../../api.ts';

const MIN_YEAR = 1950;
const MAX_YEAR = 2024;

interface TimeSliderProps {
  countryTotals: CountryTotalsMap;
}

export default function TimeSlider({ countryTotals }: TimeSliderProps) {
  const { year, setYear, isPlaying, setIsPlaying } = useAtlasStore();
  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sparkRef = useRef<SVGSVGElement>(null);

  const globalTotals: { year: number; total: number }[] = [];
  for (let y = MIN_YEAR; y <= MAX_YEAR; y++) {
    let total = 0;
    for (const iso3 in countryTotals) {
      total += countryTotals[iso3]?.[y]?.exports ?? 0;
    }
    globalTotals.push({ year: y, total });
  }

  useEffect(() => {
    if (!sparkRef.current || globalTotals.length === 0) return;
    const svg = sparkRef.current;
    const width = svg.clientWidth || 400;
    const height = 40;
    const max = Math.max(...globalTotals.map((d) => d.total), 1);

    const xScale = (y: number) => ((y - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * width;
    const yScale = (v: number) => height - (v / max) * (height - 4) - 2;

    const points = globalTotals.map((d) => `${xScale(d.year)},${yScale(d.total)}`).join(' ');

    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    polyline.setAttribute('points', points);
    polyline.setAttribute('fill', 'none');
    polyline.setAttribute('stroke', '#C9A24B');
    polyline.setAttribute('stroke-width', '1.5');
    polyline.setAttribute('opacity', '0.6');
    svg.appendChild(polyline);

    const indicator = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    const x = xScale(year);
    indicator.setAttribute('x1', String(x));
    indicator.setAttribute('x2', String(x));
    indicator.setAttribute('y1', '0');
    indicator.setAttribute('y2', String(height));
    indicator.setAttribute('stroke', '#C9A24B');
    indicator.setAttribute('stroke-width', '1');
    svg.appendChild(indicator);
  }, [globalTotals, year]);

  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setYear(
          useAtlasStore.getState().year >= MAX_YEAR
            ? MIN_YEAR
            : useAtlasStore.getState().year + 1,
        );
      }, 1500);
    } else {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    }
    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };
  }, [isPlaying, setYear]);

  return (
    <div className="flex flex-col gap-1 px-4 py-3 border-t border-ink-light bg-ink">
      <svg
        ref={sparkRef}
        className="w-full"
        height={40}
        aria-hidden="true"
        role="presentation"
      />

      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-sm border border-ink-light text-parchment hover:border-gold hover:text-gold transition-colors focus-visible:outline-2 focus-visible:outline-gold"
          aria-label={isPlaying ? 'Pause animation' : 'Play through years'}
        >
          {isPlaying ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
              <rect x="1" y="1" width="4" height="10" rx="1" />
              <rect x="7" y="1" width="4" height="10" rx="1" />
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
            type="range"
            min={MIN_YEAR}
            max={MAX_YEAR}
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value, 10))}
            className="flex-1 h-1 bg-ink-light rounded-full appearance-none cursor-pointer accent-gold"
            aria-label="Select year"
            aria-valuemin={MIN_YEAR}
            aria-valuemax={MAX_YEAR}
            aria-valuenow={year}
          />
          <span className="font-sans text-caption text-muted w-10 flex-shrink-0">{MAX_YEAR}</span>
        </div>

        <div
          className="flex-shrink-0 w-14 text-center font-serif text-lg font-semibold text-gold tabular-nums"
          aria-live="polite"
          aria-atomic="true"
        >
          {year}
        </div>
      </div>
    </div>
  );
}
