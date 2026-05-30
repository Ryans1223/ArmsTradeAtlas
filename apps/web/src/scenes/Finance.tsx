import { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import TimeSlider from '../components/timeline/TimeSlider.tsx';
import { useAtlasStore } from '../store.ts';
import { STOCK_INDICES } from '../data/stockIndices.ts';
import { MARKET_ANNOTATIONS } from '../data/stockMarket.ts';
import { HISTORICAL_TERRITORIES } from '../data/historicalTerritories.ts';

const ALL_INDEX_KEYS = Object.keys(STOCK_INDICES);

// Normalize each index to 100 at its first data point
function normalizedSeries(indexKey: string): { year: number; value: number }[] {
  const idx = STOCK_INDICES[indexKey];
  if (!idx) return [];
  const years = Object.keys(idx.data).map(Number).sort((a, b) => a - b);
  if (!years.length) return [];
  const base = idx.data[years[0]!]!;
  return years.map((y) => ({ year: y, value: (idx.data[y]! / base) * 100 }));
}

export default function Finance() {
  const { year } = useAtlasStore();
  const chartRef = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState<Set<string>>(new Set(['DJIA', 'FTSE', 'NIKKEI', 'DAX', 'SENSEX']));
  const [hoverYear, setHoverYear] = useState<number | null>(null);

  const displayYear = hoverYear ?? year;
  const activeEmpires = useMemo(
    () => HISTORICAL_TERRITORIES.filter((t) => year >= t.yearFrom && year <= t.yearTo),
    [year],
  );
  const yearAnnotations = MARKET_ANNOTATIONS.filter((a) => a.year === displayYear);

  // Toggle index visibility
  const toggle = (key: string) => {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(key)) { if (next.size > 1) next.delete(key); }
      else next.add(key);
      return next;
    });
  };

  // Stats for sidebar
  const currentStats = ALL_INDEX_KEYS.map((key) => {
    const idx = STOCK_INDICES[key]!;
    const curr = idx.data[displayYear];
    const prev = idx.data[displayYear - 1];
    const pct = curr != null && prev != null ? ((curr - prev) / prev) * 100 : null;
    return { key, idx, curr, pct, active: active.has(key) };
  }).filter((s) => s.curr != null);

  // D3 chart
  useEffect(() => {
    const svgEl = chartRef.current;
    if (!svgEl) return;

    const margin = { top: 16, right: 24, bottom: 36, left: 56 };
    const width = svgEl.clientWidth - margin.left - margin.right;
    const height = svgEl.clientHeight - margin.top - margin.bottom;
    if (width <= 0 || height <= 0) return;

    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Build data for active indices
    const seriesData = ALL_INDEX_KEYS.filter((k) => active.has(k)).map((key) => ({
      key,
      color: STOCK_INDICES[key]!.color,
      shortName: STOCK_INDICES[key]!.shortName,
      points: normalizedSeries(key),
    }));

    const allPoints = seriesData.flatMap((s) => s.points);
    if (!allPoints.length) return;

    const xScale = d3.scaleLinear().domain([1914, 2024]).range([0, width]);
    const yMax = Math.max(...allPoints.map((p) => p.value), 200);
    const yScale = d3.scaleLog().domain([80, yMax]).range([height, 0]).clamp(true);

    // Grid lines
    const yTicks = [100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000];
    g.append('g').attr('class', 'grid').selectAll('line')
      .data(yTicks.filter((t) => t <= yMax))
      .enter().append('line')
      .attr('x1', 0).attr('x2', width)
      .attr('y1', (t) => yScale(t)).attr('y2', (t) => yScale(t))
      .attr('stroke', 'rgba(255,255,255,0.06)').attr('stroke-width', 1);

    // X axis
    g.append('g').attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickFormat((d) => String(d)).ticks(12))
      .call((ax) => {
        ax.select('.domain').attr('stroke', 'rgba(255,255,255,0.15)');
        ax.selectAll('.tick line').attr('stroke', 'rgba(255,255,255,0.15)');
        ax.selectAll('.tick text').attr('fill', '#6b7e90').attr('font-size', '10px').attr('font-family', 'monospace');
      });

    // Y axis
    const yTicksFiltered = yTicks.filter((t) => t >= 80 && t <= yMax);
    g.append('g')
      .call(d3.axisLeft(yScale).tickValues(yTicksFiltered).tickFormat((d) => `${d}×`))
      .call((ax) => {
        ax.select('.domain').attr('stroke', 'rgba(255,255,255,0.15)');
        ax.selectAll('.tick line').attr('stroke', 'rgba(255,255,255,0.15)');
        ax.selectAll('.tick text').attr('fill', '#6b7e90').attr('font-size', '10px').attr('font-family', 'monospace');
      });

    // Event annotation lines
    for (const ann of MARKET_ANNOTATIONS) {
      const x = xScale(ann.year);
      const color = ann.type === 'crash' ? '#e05c4e' : ann.type === 'boom' ? '#70a353' : '#5b9bd5';
      g.append('line').attr('x1', x).attr('x2', x).attr('y1', 0).attr('y2', height)
        .attr('stroke', color).attr('stroke-width', 0.7).attr('opacity', 0.35);
    }

    // Series lines
    const line = d3.line<{ year: number; value: number }>()
      .x((d) => xScale(d.year))
      .y((d) => yScale(Math.max(d.value, 80)))
      .curve(d3.curveMonotoneX);

    for (const s of seriesData) {
      g.append('path').datum(s.points)
        .attr('fill', 'none')
        .attr('stroke', s.color)
        .attr('stroke-width', 1.8)
        .attr('opacity', 0.9)
        .attr('d', line);

      // Label at end of line
      const last = s.points[s.points.length - 1];
      if (last) {
        g.append('text')
          .attr('x', xScale(last.year) + 4)
          .attr('y', yScale(Math.max(last.value, 80)))
          .attr('fill', s.color)
          .attr('font-size', '9px')
          .attr('font-family', 'monospace')
          .attr('dominant-baseline', 'middle')
          .text(s.shortName);
      }
    }

    // Current year line
    const cx = xScale(year);
    g.append('line').attr('x1', cx).attr('x2', cx).attr('y1', 0).attr('y2', height)
      .attr('stroke', '#f5e6c8').attr('stroke-width', 1.2).attr('stroke-dasharray', '4,3').attr('opacity', 0.6);

    // Dots at current year for each series
    for (const s of seriesData) {
      const pt = s.points.find((p) => p.year === year) ?? s.points.filter((p) => p.year <= year).pop();
      if (!pt) continue;
      g.append('circle')
        .attr('cx', xScale(pt.year)).attr('cy', yScale(Math.max(pt.value, 80)))
        .attr('r', 3.5).attr('fill', s.color).attr('stroke', '#071320').attr('stroke-width', 1.5);
    }

    // Hover interaction
    const overlay = g.append('rect')
      .attr('width', width).attr('height', height)
      .attr('fill', 'transparent').style('cursor', 'crosshair');

    overlay.on('mousemove', function (event: MouseEvent) {
      const [mx] = d3.pointer(event);
      const hovY = Math.round(xScale.invert(mx));
      setHoverYear(Math.max(1914, Math.min(2024, hovY)));
      // Hover line
      g.select('.hover-line').remove();
      g.append('line').attr('class', 'hover-line')
        .attr('x1', mx).attr('x2', mx).attr('y1', 0).attr('y2', height)
        .attr('stroke', 'rgba(245,230,200,0.4)').attr('stroke-width', 1).attr('pointer-events', 'none');
    }).on('mouseleave', () => {
      setHoverYear(null);
      g.select('.hover-line').remove();
    });

    // Y axis label
    svg.append('text')
      .attr('transform', `translate(12,${margin.top + height / 2}) rotate(-90)`)
      .attr('text-anchor', 'middle').attr('fill', '#6b7e90')
      .attr('font-size', '10px').attr('font-family', 'monospace')
      .text('Return (indexed 100 = start)');

  }, [active, year]);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-ink">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center flex-wrap gap-3 px-5 py-2.5 border-b border-white/10">
        <span className="font-serif text-parchment text-sm font-semibold whitespace-nowrap">Global Financial Markets</span>
        <div className="flex flex-wrap gap-1.5">
          {ALL_INDEX_KEYS.map((key) => {
            const idx = STOCK_INDICES[key]!;
            const isOn = active.has(key);
            return (
              <button
                key={key}
                onClick={() => toggle(key)}
                className="text-caption px-2 py-0.5 rounded border font-mono transition-opacity"
                style={{
                  borderColor: idx.color,
                  color: isOn ? idx.color : 'rgba(255,255,255,0.25)',
                  background: isOn ? `${idx.color}18` : 'transparent',
                }}
              >
                {idx.shortName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Chart */}
        <div className="flex-1 relative overflow-hidden p-3">
          <svg ref={chartRef} className="w-full h-full" />
        </div>

        {/* Right sidebar */}
        <div className="w-60 flex-shrink-0 flex flex-col gap-3 p-3 overflow-y-auto border-l border-white/10">

          {/* Year snapshot */}
          <div className="bg-white/5 rounded p-3">
            <div className="text-caption text-muted uppercase tracking-wider mb-2">
              {hoverYear ? `${hoverYear} (hover)` : `${year} Snapshot`}
            </div>
            {currentStats.map((s) => (
              <div key={s.key} className="flex items-baseline justify-between mb-1.5">
                <span className="text-caption font-mono" style={{ color: s.idx.color }}>{s.idx.shortName}</span>
                <div className="text-right">
                  <span className="text-parchment text-xs font-mono">{s.curr!.toLocaleString()}</span>
                  {s.pct != null && (
                    <span className={`ml-1.5 text-caption font-mono ${s.pct >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {s.pct >= 0 ? '▲' : '▼'}{Math.abs(s.pct).toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Event annotations */}
          {yearAnnotations.length > 0 && (
            <div className="bg-amber-900/20 border border-amber-700/30 rounded p-3">
              <div className="text-caption text-amber-400 font-semibold uppercase tracking-wider mb-1">
                {displayYear} Event
              </div>
              {yearAnnotations.map((a) => (
                <p key={a.label} className="text-caption text-parchment/85 leading-relaxed">{a.label}</p>
              ))}
            </div>
          )}

          {/* Legend */}
          <div className="bg-white/5 rounded p-3">
            <div className="text-caption text-muted uppercase tracking-wider mb-2">Chart Key</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-0.5 bg-red-500/60" />
                <span className="text-caption text-muted">Crash / crisis</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-0.5 bg-emerald-600/60" />
                <span className="text-caption text-muted">Bull market / boom</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-0.5 bg-blue-500/60" />
                <span className="text-caption text-muted">Major event</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-6 h-0.5 border-t border-parchment/50 border-dashed" />
                <span className="text-caption text-muted">Current year</span>
              </div>
            </div>
          </div>

          {/* Empire economy cards */}
          {activeEmpires.length > 0 && (
            <div>
              <div className="text-caption text-muted uppercase tracking-wider mb-2">Empire Economies · {year}</div>
              {activeEmpires.map((t) => (
                <div key={t.iso3} className="bg-white/5 rounded p-2.5 mb-2">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: t.color }} />
                    <span className="text-xs text-parchment font-semibold leading-tight">{t.label}</span>
                  </div>
                  <p className="text-caption text-parchment/60 leading-relaxed">{t.economicNote}</p>
                </div>
              ))}
            </div>
          )}

          {/* All events list */}
          <div>
            <div className="text-caption text-muted uppercase tracking-wider mb-2">Major Events</div>
            {MARKET_ANNOTATIONS.map((a) => (
              <div
                key={`${a.year}-${a.label}`}
                className={`flex gap-2 mb-1.5 ${a.year === displayYear ? 'opacity-100' : 'opacity-40'}`}
              >
                <span className="text-caption font-mono text-muted w-10 flex-shrink-0">{a.year}</span>
                <span className={`text-caption leading-tight ${a.type === 'crash' ? 'text-red-400' : a.type === 'boom' ? 'text-emerald-400' : 'text-blue-300'}`}>
                  {a.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Time slider */}
      <div className="flex-shrink-0">
        <TimeSlider countryTotals={{}} showStockMarket={true} />
      </div>
    </div>
  );
}
