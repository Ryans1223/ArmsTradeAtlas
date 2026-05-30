import { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import type { CountryTotalsMap } from '../../api.ts';
import type { ShadingMode } from '../../store.ts';
import type { TradeFlow, Country } from '@arms-atlas/types';
import { CATEGORY_COLORS } from './FlowTooltip.tsx';
import type { FlowHoverState } from './FlowTooltip.tsx';
import { HISTORICAL_TERRITORIES } from '../../data/historicalTerritories.ts';

interface WorldMapProps {
  year: number;
  selectedCountry: string | null;
  hoveredCountry: string | null;
  countryTotals: CountryTotalsMap;
  shadingMode: ShadingMode;
  onCountryClick: (iso3: string | null) => void;
  onCountryHover: (iso3: string | null) => void;
  iso3ByNumeric: Map<number, string>;
  flows: TradeFlow[];
  countryData: Country[];
  showFlows: boolean;
  onFlowHover: (data: FlowHoverState | null) => void;
}

interface TopoCountry {
  type: 'Feature';
  id: string;
  properties: { name?: string };
  geometry: d3.GeoPermissibleObjects;
}

function makeBezierArc(src: [number, number], tgt: [number, number]): string | null {
  const [sx, sy] = src;
  const [tx, ty] = tgt;
  const dx = tx - sx;
  const dy = ty - sy;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 6) return null;
  const midX = (sx + tx) / 2;
  const midY = (sy + ty) / 2;
  const curve = Math.min(len * 0.28, 90);
  const cpX = midX + (dy / len) * curve;
  const cpY = midY - (dx / len) * curve;
  const shorten = Math.min(14, len * 0.08);
  const sx2 = sx + (dx / len) * shorten;
  const sy2 = sy + (dy / len) * shorten;
  const tx2 = tx - (dx / len) * shorten;
  const ty2 = ty - (dy / len) * shorten;
  return `M${sx2.toFixed(1)},${sy2.toFixed(1)} Q${cpX.toFixed(1)},${cpY.toFixed(1)} ${tx2.toFixed(1)},${ty2.toFixed(1)}`;
}

export default function WorldMap({
  year,
  selectedCountry,
  hoveredCountry,
  countryTotals,
  shadingMode,
  onCountryClick,
  onCountryHover,
  iso3ByNumeric,
  flows,
  countryData,
  showFlows,
  onFlowHover,
}: WorldMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const transformRef = useRef<d3.ZoomTransform>(d3.zoomIdentity);
  const [world, setWorld] = useState<Topology | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then((r) => r.json())
      .then((data) => setWorld(data as Topology))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setDimensions({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    if (svgRef.current?.parentElement) observer.observe(svgRef.current.parentElement);
    return () => observer.disconnect();
  }, []);

  // ── One-time zoom setup ────────────────────────────────────────────
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.9, 14])
      .on('zoom', (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
        transformRef.current = event.transform;
        svg.select<SVGGElement>('.map-root').attr('transform', event.transform.toString());
      });
    zoomRef.current = zoom;
    svg.call(zoom);
    // Double-click resets zoom
    svg.on('dblclick.zoom', () => {
      transformRef.current = d3.zoomIdentity;
      svg.transition().duration(400).call(zoom.transform, d3.zoomIdentity);
    });
    return () => { svg.on('.zoom', null); };
  }, []);

  const handleZoomIn = useCallback(() => {
    if (!svgRef.current || !zoomRef.current) return;
    d3.select(svgRef.current).transition().duration(280).call(zoomRef.current.scaleBy, 1.6);
  }, []);

  const handleZoomOut = useCallback(() => {
    if (!svgRef.current || !zoomRef.current) return;
    d3.select(svgRef.current).transition().duration(280).call(zoomRef.current.scaleBy, 1 / 1.6);
  }, []);

  const handleZoomReset = useCallback(() => {
    if (!svgRef.current || !zoomRef.current) return;
    transformRef.current = d3.zoomIdentity;
    d3.select(svgRef.current).transition().duration(400).call(zoomRef.current.transform, d3.zoomIdentity);
  }, []);

  const getShadeValue = useCallback(
    (iso3: string): number => {
      const yearData = countryTotals[iso3]?.[year];
      if (!yearData) return 0;
      if (shadingMode === 'exports') return yearData.exports;
      if (shadingMode === 'imports') return yearData.imports;
      return yearData.exports - yearData.imports;
    },
    [countryTotals, year, shadingMode],
  );

  useEffect(() => {
    if (!world || !svgRef.current) return;
    const { width, height } = dimensions;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // ── Arrow markers (stay on SVG so url(#id) references work) ───────
    const defs = svg.append('defs');
    Object.entries(CATEGORY_COLORS).forEach(([cat, color]) => {
      defs.append('marker')
        .attr('id', `arc-arrow-${cat}`)
        .attr('markerWidth', 7).attr('markerHeight', 7)
        .attr('refX', 6).attr('refY', 3).attr('orient', 'auto')
        .append('polygon').attr('points', '0,0 0,6 6,3').attr('fill', color);
    });

    // ── Zoomable map root ──────────────────────────────────────────────
    const mapRoot = svg.append('g').attr('class', 'map-root');
    mapRoot.attr('transform', transformRef.current.toString());

    // ── Projection & path ──────────────────────────────────────────────
    const projection = d3.geoEqualEarth()
      .scale(width / 6.5)
      .translate([width / 2, height / 2]);
    const path = d3.geoPath(projection);

    // ── Background ─────────────────────────────────────────────────────
    mapRoot.append('path')
      .datum({ type: 'Sphere' } as d3.GeoPermissibleObjects)
      .attr('class', 'sphere').attr('d', path as unknown as string);

    mapRoot.append('path')
      .datum(d3.geoGraticule()())
      .attr('class', 'graticule').attr('d', path as unknown as string);

    // ── Choropleth ─────────────────────────────────────────────────────
    const countries = topojson.feature(world, world.objects['countries'] as GeometryCollection);
    const features = (countries as unknown as { features: TopoCountry[] }).features;

    const allValues = features.map((f) => getShadeValue(iso3ByNumeric.get(parseInt(f.id, 10)) ?? ''));
    const maxVal = Math.max(...allValues.filter((v) => v > 0), 1);
    const minVal = Math.min(...allValues.filter((v) => v < 0), -1);

    let colorScale: (v: number) => string;
    if (shadingMode === 'net') {
      const absMax = Math.max(Math.abs(maxVal), Math.abs(minVal));
      colorScale = d3.scaleSequential(d3.interpolateRdBu).domain([absMax, -absMax]) as unknown as (v: number) => string;
    } else {
      colorScale = d3.scaleSequential(d3.interpolateViridis).domain([0, maxVal]) as unknown as (v: number) => string;
    }

    mapRoot.selectAll('.country-path')
      .data(features)
      .enter()
      .append('path')
      .attr('class', (f) => {
        const iso3 = iso3ByNumeric.get(parseInt(f.id, 10)) ?? '';
        const cls = ['country-path'];
        if (iso3 === selectedCountry) cls.push('selected');
        if (iso3 === hoveredCountry) cls.push('hovered');
        return cls.join(' ');
      })
      .attr('d', (f) => path(f.geometry as d3.GeoPermissibleObjects) ?? '')
      .attr('fill', (f) => {
        const iso3 = iso3ByNumeric.get(parseInt(f.id, 10)) ?? '';
        const val = getShadeValue(iso3);
        return val === 0 ? '#1a2f44' : colorScale(val);
      })
      .on('mouseenter', (_event, f) => {
        const iso3 = iso3ByNumeric.get(parseInt(f.id, 10)) ?? '';
        if (iso3) onCountryHover(iso3);
      })
      .on('mouseleave', () => onCountryHover(null))
      .on('click', (_event, f) => {
        const iso3 = iso3ByNumeric.get(parseInt(f.id, 10)) ?? '';
        if (iso3) onCountryClick(iso3 === selectedCountry ? null : iso3);
      });

    // ── Country borders ────────────────────────────────────────────────
    mapRoot.append('path')
      .datum(topojson.mesh(world, world.objects['countries'] as GeometryCollection, (a, b) => a !== b))
      .attr('fill', 'none').attr('stroke', '#1a2f44').attr('stroke-width', 0.5)
      .attr('d', path as unknown as string);

    // ── Historical territory overlays ─────────────────────────────────
    const activeEmpires = HISTORICAL_TERRITORIES.filter((t) => year >= t.yearFrom && year <= t.yearTo);
    for (const territory of activeEmpires) {
      const constituentSet = new Set(territory.constituent);

      // Tinted fill
      mapRoot.append('g').attr('class', `territory-tint-${territory.iso3}`).style('pointer-events', 'none')
        .selectAll('path')
        .data(features.filter((f) => constituentSet.has(iso3ByNumeric.get(parseInt(f.id, 10)) ?? '')))
        .enter().append('path')
        .attr('d', (f) => path(f.geometry as d3.GeoPermissibleObjects) ?? '')
        .attr('fill', territory.color).attr('fill-opacity', 0.18).attr('stroke', 'none');

      // Dashed outer border
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const empireBorder = topojson.mesh(world, world.objects['countries'] as GeometryCollection, (a: any, b: any) => {
        const aId = typeof a.id === 'number' ? a.id : parseInt(String(a.id), 10);
        const bId = typeof b.id === 'number' ? b.id : parseInt(String(b.id), 10);
        return constituentSet.has(iso3ByNumeric.get(aId) ?? '') !== constituentSet.has(iso3ByNumeric.get(bId) ?? '');
      });
      mapRoot.append('path').datum(empireBorder)
        .attr('fill', 'none').attr('stroke', territory.color)
        .attr('stroke-width', 1.5).attr('stroke-dasharray', '5,3').attr('opacity', 0.75)
        .attr('d', path as unknown as string).style('pointer-events', 'none');
    }

    // ── Historical entity labels ───────────────────────────────────────
    const historicalEntities = countryData.filter(
      (c) => c.isHistorical && c.yearFrom !== undefined && c.yearTo !== undefined
        && year >= (c.yearFrom as number) && year <= (c.yearTo as number),
    );
    if (historicalEntities.length > 0) {
      const labelLayer = mapRoot.append('g').attr('class', 'label-layer').style('pointer-events', 'none');
      for (const entity of historicalEntities) {
        const proj = projection([entity.centroidLon, entity.centroidLat]);
        if (!proj) continue;
        const [lx, ly] = proj;
        // Outline pass
        labelLayer.append('text')
          .attr('x', lx).attr('y', ly).attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
          .attr('fill', 'none').attr('stroke', '#0a1929').attr('stroke-width', 3)
          .attr('stroke-linejoin', 'round').attr('font-size', '8.5px')
          .attr('font-family', 'Georgia, serif').attr('font-style', 'italic')
          .text(entity.displayName);
        // Visible pass
        labelLayer.append('text')
          .attr('x', lx).attr('y', ly).attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
          .attr('fill', '#f5e6c8').attr('opacity', 0.88).attr('font-size', '8.5px')
          .attr('font-family', 'Georgia, serif').attr('font-style', 'italic')
          .text(entity.displayName);
      }
    }

    // ── Flow arcs ──────────────────────────────────────────────────────
    if (!showFlows || flows.length === 0) return;

    const centroidMap = new Map<string, [number, number]>();
    for (const c of countryData) {
      if (typeof c.centroidLon === 'number' && typeof c.centroidLat === 'number') {
        centroidMap.set(c.iso3, [c.centroidLon, c.centroidLat]);
      }
    }

    const pairMap = new Map<string, { tiv: number; items: TradeFlow[]; dominantCategory: string; supplierIso3: string; recipientIso3: string }>();
    for (const flow of flows) {
      const key = `${flow.supplierIso3}|${flow.recipientIso3}`;
      const existing = pairMap.get(key);
      if (!existing) {
        pairMap.set(key, { tiv: flow.tiv, items: [flow], dominantCategory: flow.weaponCategory, supplierIso3: flow.supplierIso3, recipientIso3: flow.recipientIso3 });
      } else {
        existing.tiv += flow.tiv;
        existing.items.push(flow);
        const catTotals: Record<string, number> = {};
        for (const f of existing.items) catTotals[f.weaponCategory] = (catTotals[f.weaponCategory] ?? 0) + f.tiv;
        existing.dominantCategory = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'other';
      }
    }

    const maxPairTiv = Math.max(...Array.from(pairMap.values()).map((v) => v.tiv), 1);
    const widthScale = d3.scaleSqrt().domain([0, maxPairTiv]).range([0.3, 2.5]);
    const arcLayer = mapRoot.append('g').attr('class', 'arc-layer');
    const nameMap = new Map<string, string>();
    for (const c of countryData) nameMap.set(c.iso3, c.displayName);

    for (const [, pair] of pairMap) {
      const { supplierIso3, recipientIso3, tiv, items, dominantCategory } = pair;
      const srcCoords = centroidMap.get(supplierIso3);
      const tgtCoords = centroidMap.get(recipientIso3);
      if (!srcCoords || !tgtCoords) continue;
      const srcProj = projection(srcCoords);
      const tgtProj = projection(tgtCoords);
      if (!srcProj || !tgtProj) continue;
      const arcD = makeBezierArc(srcProj as [number, number], tgtProj as [number, number]);
      if (!arcD) continue;

      const color = CATEGORY_COLORS[dominantCategory] ?? '#888';
      const strokeW = widthScale(tiv);

      arcLayer.append('path')
        .attr('class', `arc-halo arc-halo-${supplierIso3}-${recipientIso3}`)
        .attr('d', arcD).attr('fill', 'none').attr('stroke', 'transparent')
        .attr('stroke-width', Math.max(strokeW + 10, 14)).style('cursor', 'pointer')
        .on('mouseenter', function () {
          arcLayer.select(`.arc-visible-${supplierIso3}-${recipientIso3}`)
            .attr('stroke-opacity', 1).attr('stroke-width', strokeW + 2);
          onFlowHover({ flows: [...items].sort((a, b) => b.tiv - a.tiv), totalTiv: tiv, supplierName: nameMap.get(supplierIso3) ?? supplierIso3, recipientName: nameMap.get(recipientIso3) ?? recipientIso3 });
        })
        .on('mouseleave', function () {
          arcLayer.select(`.arc-visible-${supplierIso3}-${recipientIso3}`)
            .attr('stroke-opacity', 0.65).attr('stroke-width', strokeW);
          onFlowHover(null);
        });

      arcLayer.append('path')
        .attr('class', `arc-visible arc-visible-${supplierIso3}-${recipientIso3}`)
        .attr('d', arcD).attr('fill', 'none').attr('stroke', color)
        .attr('stroke-width', strokeW).attr('stroke-opacity', 0.65)
        .attr('stroke-linecap', 'round')
        .attr('marker-end', `url(#arc-arrow-${dominantCategory})`)
        .style('pointer-events', 'none');
    }
  }, [world, dimensions, year, selectedCountry, hoveredCountry, countryTotals, shadingMode,
      getShadeValue, iso3ByNumeric, onCountryClick, onCountryHover,
      flows, countryData, showFlows, onFlowHover]);

  return (
    <div className="relative w-full h-full">
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        role="img"
        aria-label={`World map showing arms trade data for ${year}`}
        className="w-full h-full block"
      />

      {/* Zoom controls */}
      <div className="absolute bottom-14 right-3 flex flex-col gap-0.5 z-10">
        <button
          onClick={handleZoomIn}
          className="w-7 h-7 bg-ink/80 border border-ink-light/60 text-parchment/80 hover:text-gold hover:border-gold/50 rounded-sm text-sm font-bold leading-none transition-colors flex items-center justify-center"
          title="Zoom in"
          aria-label="Zoom in"
        >+</button>
        <button
          onClick={handleZoomOut}
          className="w-7 h-7 bg-ink/80 border border-ink-light/60 text-parchment/80 hover:text-gold hover:border-gold/50 rounded-sm text-sm font-bold leading-none transition-colors flex items-center justify-center"
          title="Zoom out"
          aria-label="Zoom out"
        >−</button>
        <button
          onClick={handleZoomReset}
          className="w-7 h-7 bg-ink/80 border border-ink-light/60 text-muted/70 hover:text-gold hover:border-gold/50 rounded-sm text-[9px] leading-none transition-colors flex items-center justify-center"
          title="Reset zoom (or double-click map)"
          aria-label="Reset zoom"
        >⊙</button>
      </div>
      <div className="absolute bottom-10 right-3 text-[8px] text-muted/40 pointer-events-none text-right leading-tight">
        scroll · drag · dbl-click reset
      </div>
    </div>
  );
}
