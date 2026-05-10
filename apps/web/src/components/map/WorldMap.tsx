import { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import type { CountryTotalsMap } from '../../api.ts';
import type { ShadingMode } from '../../store.ts';

interface WorldMapProps {
  year: number;
  selectedCountry: string | null;
  hoveredCountry: string | null;
  countryTotals: CountryTotalsMap;
  shadingMode: ShadingMode;
  onCountryClick: (iso3: string | null) => void;
  onCountryHover: (iso3: string | null) => void;
  iso3ByNumeric: Map<number, string>;
}

interface TopoCountry {
  type: 'Feature';
  id: string;
  properties: { name?: string };
  geometry: d3.GeoPermissibleObjects;
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
}: WorldMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
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
      if (entry) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    if (svgRef.current?.parentElement) {
      observer.observe(svgRef.current.parentElement);
    }
    return () => observer.disconnect();
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

    const projection = d3
      .geoEqualEarth()
      .scale(width / 6.5)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath(projection);

    svg.append('path')
      .datum({ type: 'Sphere' } as d3.GeoPermissibleObjects)
      .attr('class', 'sphere')
      .attr('d', path as unknown as string);

    svg.append('path')
      .datum(d3.geoGraticule()())
      .attr('class', 'graticule')
      .attr('d', path as unknown as string);

    const countries = topojson.feature(
      world,
      world.objects['countries'] as GeometryCollection,
    );

    const allValues = (countries as unknown as { features: TopoCountry[] }).features.map((f) => {
      const numericId = parseInt(f.id, 10);
      const iso3 = iso3ByNumeric.get(numericId) ?? '';
      return getShadeValue(iso3);
    });

    const maxVal = Math.max(...allValues.filter((v) => v > 0), 1);
    const minVal = Math.min(...allValues.filter((v) => v < 0), -1);

    let colorScale: (v: number) => string;
    if (shadingMode === 'net') {
      const absMax = Math.max(Math.abs(maxVal), Math.abs(minVal));
      colorScale = d3.scaleSequential(d3.interpolateRdBu).domain([absMax, -absMax]) as unknown as (v: number) => string;
    } else {
      colorScale = d3.scaleSequential(d3.interpolateViridis).domain([0, maxVal]) as unknown as (v: number) => string;
    }

    svg.selectAll('.country-path')
      .data((countries as unknown as { features: TopoCountry[] }).features)
      .enter()
      .append('path')
      .attr('class', (f) => {
        const numericId = parseInt(f.id, 10);
        const iso3 = iso3ByNumeric.get(numericId) ?? '';
        const classes = ['country-path'];
        if (iso3 === selectedCountry) classes.push('selected');
        if (iso3 === hoveredCountry) classes.push('hovered');
        return classes.join(' ');
      })
      .attr('d', (f) => path(f.geometry as d3.GeoPermissibleObjects) ?? '')
      .attr('fill', (f) => {
        const numericId = parseInt(f.id, 10);
        const iso3 = iso3ByNumeric.get(numericId) ?? '';
        const val = getShadeValue(iso3);
        if (val === 0) return '#1a2f44';
        return colorScale(val);
      })
      .on('mouseenter', function (_event, f) {
        const numericId = parseInt(f.id, 10);
        const iso3 = iso3ByNumeric.get(numericId) ?? '';
        if (iso3) onCountryHover(iso3);
      })
      .on('mouseleave', function () {
        onCountryHover(null);
      })
      .on('click', function (_event, f) {
        const numericId = parseInt(f.id, 10);
        const iso3 = iso3ByNumeric.get(numericId) ?? '';
        if (iso3) {
          onCountryClick(iso3 === selectedCountry ? null : iso3);
        }
      });

    const borders = topojson.mesh(
      world,
      world.objects['countries'] as GeometryCollection,
      (a, b) => a !== b,
    );
    svg.append('path')
      .datum(borders)
      .attr('fill', 'none')
      .attr('stroke', '#1a2f44')
      .attr('stroke-width', 0.5)
      .attr('d', path as unknown as string);
  }, [world, dimensions, year, selectedCountry, hoveredCountry, countryTotals, shadingMode, getShadeValue, iso3ByNumeric, onCountryClick, onCountryHover]);

  return (
    <svg
      ref={svgRef}
      width={dimensions.width}
      height={dimensions.height}
      role="img"
      aria-label={`World map showing arms trade data for ${year}`}
      className="w-full h-full"
    />
  );
}
