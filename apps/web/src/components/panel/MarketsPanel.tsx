import { useEffect, useRef } from 'react';
import { MILITARY_2023, getMilitaryScore, getDynamicRank, getEffectiveEntity } from '../../data/militaryRankings.ts';
import { STOCK_INDICES, COUNTRY_TO_INDEX } from '../../data/stockIndices.ts';
import { COUNTRY_PROFILES } from '../../data/countryProfiles.ts';
import { HISTORICAL_TERRITORIES } from '../../data/historicalTerritories.ts';
import { getGdpEstimate, getGdpValue } from '../../data/gdpData.ts';

interface MarketsPanelProps {
  iso3: string;
  countryName: string;
  year: number;
  onClose: () => void;
}

// Country name lookup (common ones for territory lists)
const NAME: Record<string, string> = {
  IND: 'India', PAK: 'Pakistan', BGD: 'Bangladesh', MMR: 'Myanmar', LKA: 'Sri Lanka',
  AUS: 'Australia', NZL: 'New Zealand', CAN: 'Canada', ZAF: 'South Africa',
  NGA: 'Nigeria', GHA: 'Ghana', KEN: 'Kenya', TZA: 'Tanzania', UGA: 'Uganda',
  ZMB: 'Zambia', ZWE: 'Zimbabwe', MWI: 'Malawi', SDN: 'Sudan', EGY: 'Egypt',
  IRQ: 'Iraq', JOR: 'Jordan', MYS: 'Malaysia', SGP: 'Singapore', PNG: 'PNG',
  DZA: 'Algeria', TUN: 'Tunisia', MAR: 'Morocco', SEN: 'Senegal', MLI: 'Mali',
  GIN: 'Guinea', CIV: "Côte d'Ivoire", BFA: 'Burkina Faso', NER: 'Niger',
  TCD: 'Chad', CMR: 'Cameroon', CAF: 'CAR', COG: 'Congo', GAB: 'Gabon',
  MDG: 'Madagascar', VNM: 'Vietnam', KHM: 'Cambodia', LAO: 'Laos',
  POL: 'Poland', CZE: 'Czechia', SVK: 'Slovakia', HUN: 'Hungary',
  ROU: 'Romania', BGR: 'Bulgaria', MNG: 'Mongolia', ALB: 'Albania',
  KOR: 'South Korea', PRK: 'North Korea', TWN: 'Taiwan', CHN: 'China',
  UKR: 'Ukraine', BLR: 'Belarus', KAZ: 'Kazakhstan', UZB: 'Uzbekistan',
  ARM: 'Armenia', AZE: 'Azerbaijan', GEO: 'Georgia', KGZ: 'Kyrgyzstan',
  MDA: 'Moldova', TJK: 'Tajikistan', TKM: 'Turkmenistan', LTU: 'Lithuania',
  LVA: 'Latvia', EST: 'Estonia', FIN: 'Finland', AUT: 'Austria',
  HUN_: 'Hungary', SVN: 'Slovenia', HRV: 'Croatia', BIH: 'Bosnia',
  SRB: 'Serbia', MNE: 'Montenegro', MKD: 'N. Macedonia',
  DEU: 'Germany', FRA: 'France', GBR: 'Britain', TUR: 'Turkey',
  JPN: 'Japan', ITA: 'Italy', RUS: 'Russia', USA: 'USA',
  PHL: 'Philippines', IDN: 'Indonesia', SAU: 'Saudi Arabia', YEM: 'Yemen',
  SYR: 'Syria', LBN: 'Lebanon', ISR: 'Israel', LBY: 'Libya',
  ETH: 'Ethiopia', SOM: 'Somalia', AGO: 'Angola', MOZ: 'Mozambique',
  GNB: 'Guinea-Bissau', COD: 'DR Congo', RWA: 'Rwanda', BDI: 'Burundi',
  NAM: 'Namibia', TZA_: 'Tanzania', CUB: 'Cuba', PAN: 'Panama',
};

function getName(iso3: string): string {
  return NAME[iso3] ?? iso3;
}

function flag(iso2: string | undefined): string {
  if (!iso2 || iso2.length !== 2) return '🌍';
  return Array.from(iso2.toUpperCase())
    .map((c) => String.fromCodePoint(c.charCodeAt(0) + 127397))
    .join('');
}

export default function MarketsPanel({ iso3, countryName, year, onClose }: MarketsPanelProps) {
  const sparkRef = useRef<SVGSVGElement>(null);

  // Resolve to historical entity if applicable (e.g. DEU in 1914 → GEI)
  const effectiveIso3 = getEffectiveEntity(iso3, year);
  const isHistorical = effectiveIso3 !== iso3;

  const profile = COUNTRY_PROFILES[iso3] ?? COUNTRY_PROFILES[effectiveIso3];
  const militaryScore = getMilitaryScore(effectiveIso3, year) || getMilitaryScore(iso3, year);
  const dynamicRank = getDynamicRank(effectiveIso3, year) ?? getDynamicRank(iso3, year);
  const military2023 = MILITARY_2023[iso3];

  // GDP estimate — try historical entity first, then modern ISO3
  const gdpEst = getGdpEstimate(effectiveIso3, year) ?? getGdpEstimate(iso3, year);
  const gdpVal = getGdpValue(effectiveIso3, year) ?? getGdpValue(iso3, year);

  // Stock market — use modern ISO3
  const indexKey = COUNTRY_TO_INDEX[iso3];
  const stockIndex = indexKey ? STOCK_INDICES[indexKey] : undefined;
  const currentVal = stockIndex?.data[year];
  const prevVal = stockIndex?.data[year - 1];
  const yoyPct = currentVal != null && prevVal != null ? ((currentVal - prevVal) / prevVal) * 100 : null;

  // Empire context: empires this country BELONGS TO as a territory
  const memberOf = HISTORICAL_TERRITORIES.filter(
    (t) => year >= t.yearFrom && year <= t.yearTo && t.constituent.includes(iso3) && t.controller !== iso3,
  );

  // Empires this country CONTROLS (is the imperial power)
  const controls = HISTORICAL_TERRITORIES.filter(
    (t) => year >= t.yearFrom && year <= t.yearTo && t.controller === iso3,
  );

  // Historical empire entity for clicked country (e.g. GBR_EMP when clicking GBR in 1920)
  const historicalEntity = HISTORICAL_TERRITORIES.find((t) => t.iso3 === effectiveIso3);

  // Spark line effect
  useEffect(() => {
    const el = sparkRef.current;
    if (!el || !stockIndex) return;
    while (el.firstChild) el.removeChild(el.firstChild);
    const data = stockIndex.data;
    const years = Object.keys(data).map(Number).sort((a, b) => a - b);
    if (years.length < 2) return;
    const w = el.clientWidth || 228;
    const h = 44;
    el.setAttribute('height', String(h));
    const minY = years[0]!, maxY = years[years.length - 1]!;
    const vals = years.map((y) => data[y]!);
    const minV = Math.min(...vals), maxV = Math.max(...vals);
    const xS = (y: number) => ((y - minY) / (maxY - minY)) * w;
    const yS = (v: number) => h - 4 - ((v - minV) / (maxV - minV)) * (h - 8);
    const pts = years.map((y) => `${xS(y).toFixed(1)},${yS(data[y]!).toFixed(1)}`).join(' ');
    const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    poly.setAttribute('points', pts);
    poly.setAttribute('fill', 'none');
    poly.setAttribute('stroke', '#70a353');
    poly.setAttribute('stroke-width', '1.5');
    poly.setAttribute('stroke-linejoin', 'round');
    el.appendChild(poly);
    if (year >= minY && year <= maxY && data[year] != null) {
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', xS(year).toFixed(1));
      dot.setAttribute('cy', yS(data[year]!).toFixed(1));
      dot.setAttribute('r', '3');
      dot.setAttribute('fill', '#70a353');
      el.appendChild(dot);
    }
  }, [stockIndex, year]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="absolute right-0 top-0 bottom-0 w-80 bg-[#071320]/97 backdrop-blur-sm border-l border-white/10 z-20 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between px-4 pt-4 pb-3 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-2xl" aria-hidden="true">{flag(profile?.iso2)}</span>
          <div className="min-w-0">
            <div className="font-serif text-parchment font-semibold text-sm leading-tight">
              {isHistorical ? (historicalEntity?.label ?? countryName) : countryName}
            </div>
            {isHistorical && (
              <div className="text-caption text-amber-400/80 font-mono">{countryName} territory · {year}</div>
            )}
            {!isHistorical && (
              <div className="text-muted text-caption font-mono">{iso3} · {year}</div>
            )}
          </div>
        </div>
        <button onClick={onClose} className="text-muted hover:text-parchment transition-colors ml-2 flex-shrink-0 text-lg leading-none" aria-label="Close">×</button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">

        {/* ── Controlled Territories ─────────────────────────────────── */}
        {controls.length > 0 && (
          <section>
            <div className="text-caption uppercase tracking-widest text-muted mb-2">🌐 Empire Territories</div>
            {controls.map((t) => {
              const territories = t.constituent.filter((c) => c !== iso3);
              return (
                <div key={t.iso3} className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: t.color }} />
                    <span className="text-xs text-parchment font-semibold">{t.label}</span>
                    <span className="text-caption text-muted font-mono">{t.yearFrom}–{t.yearTo}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {territories.map((c) => (
                      <span key={c} className="text-caption px-1.5 py-0.5 bg-white/8 border border-white/10 rounded text-parchment/75 font-mono">
                        {getName(c)}
                      </span>
                    ))}
                  </div>
                  <p className="text-caption text-parchment/60 leading-relaxed">{t.economicNote}</p>
                </div>
              );
            })}
          </section>
        )}
        {controls.length > 0 && <div className="border-t border-white/10" />}

        {/* ── Military Strength ──────────────────────────────────────── */}
        <section>
          <div className="text-caption uppercase tracking-widest text-muted mb-2">⚔ Military Strength</div>
          {militaryScore > 0 ? (
            <>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-xs text-parchment/80">
                  {dynamicRank
                    ? <><span className="text-gold font-mono font-semibold">#{dynamicRank.rank}</span>
                        <span className="text-muted"> of {dynamicRank.total} powers · {year}</span></>
                    : <span className="text-parchment/60">Historical estimate</span>}
                </span>
                <span className="text-gold font-mono text-sm font-bold">
                  {Math.round(militaryScore)}<span className="text-muted text-caption">/100</span>
                </span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-3">
                <div className="h-full rounded-full" style={{
                  width: `${militaryScore}%`,
                  background: 'linear-gradient(to right, #2a5f2a, #5db35d)',
                }} />
              </div>
              {military2023 && (
                <div className="space-y-1.5">
                  <span className={`inline-block text-caption px-1.5 py-0.5 rounded font-mono font-semibold ${military2023.nuclear ? 'bg-amber-900/60 text-amber-300' : 'bg-white/5 text-muted'}`}>
                    {military2023.nuclear ? '☢ Nuclear power' : 'Conventional forces'}
                  </span>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-1.5">
                    <div>
                      <div className="text-caption text-muted">Active Personnel</div>
                      <div className="text-xs text-parchment font-mono">{military2023.activePersonnel.toLocaleString()}k</div>
                    </div>
                    <div>
                      <div className="text-caption text-muted">Defense Budget</div>
                      <div className="text-xs text-parchment font-mono">${military2023.budgetBnUsd}B USD</div>
                    </div>
                  </div>
                  <p className="text-caption text-parchment/70 leading-relaxed mt-1">{military2023.highlights}</p>
                </div>
              )}
              {!military2023 && profile?.militaryNote && (
                <p className="text-caption text-parchment/70 leading-relaxed">{profile.militaryNote}</p>
              )}
            </>
          ) : (
            <p className="text-caption text-muted italic">No military data for {year}.</p>
          )}
        </section>

        <div className="border-t border-white/10" />

        {/* ── Stock Market ───────────────────────────────────────────── */}
        <section>
          <div className="text-caption uppercase tracking-widest text-muted mb-2">📈 Stock Market</div>
          {stockIndex && currentVal != null ? (
            <>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-xs text-parchment/80 font-mono">{stockIndex.name}</span>
              </div>
              <div className="flex items-baseline gap-2 mb-1.5">
                <span className="text-parchment font-mono text-base font-bold">{currentVal.toLocaleString()}</span>
                {yoyPct != null && (
                  <span className={`text-sm font-mono font-semibold ${yoyPct >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {yoyPct >= 0 ? '▲' : '▼'} {Math.abs(yoyPct).toFixed(1)}%
                  </span>
                )}
              </div>
              <svg ref={sparkRef} className="w-full" style={{ height: 44 }} />
              <p className="text-caption text-muted mt-1.5 leading-relaxed">{stockIndex.description}</p>
            </>
          ) : (
            <p className="text-caption text-muted italic">
              {stockIndex ? `${stockIndex.shortName} data unavailable for ${year}.` : 'No stock index tracked for this country.'}
            </p>
          )}
        </section>

        {/* ── Economy ────────────────────────────────────────────────── */}
        {(gdpEst || profile) && (
          <>
            <div className="border-t border-white/10" />
            <section>
              <div className="text-caption uppercase tracking-widest text-muted mb-2">🏦 Economy</div>

              {/* GDP estimate */}
              {gdpEst && (
                <div className="bg-white/5 rounded p-2.5 mb-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-caption text-muted">GDP · {year}</span>
                    <span className="text-parchment font-mono font-semibold text-sm">{gdpEst}</span>
                  </div>
                  {gdpVal != null && gdpVal >= 1000 && (
                    <div className="mt-1.5 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-amber-500/60"
                        style={{ width: `${Math.min(100, (gdpVal / 30000) * 100)}%` }}
                      />
                    </div>
                  )}
                  <p className="text-caption text-muted/70 mt-1 leading-relaxed">PPP-adjusted estimate · not for financial use</p>
                </div>
              )}

              {profile && (
                <>
                  <p className="text-caption text-parchment/70 leading-relaxed">{profile.gdpNote}</p>
                  {profile.keyFact && (
                    <p className="text-caption text-gold/80 leading-relaxed mt-1 italic">"{profile.keyFact}"</p>
                  )}
                </>
              )}
            </section>
          </>
        )}

        {/* ── Part of an Empire ──────────────────────────────────────── */}
        {memberOf.length > 0 && (
          <>
            <div className="border-t border-white/10" />
            <section>
              <div className="text-caption uppercase tracking-widest text-muted mb-2">🏛 Imperial Status</div>
              {memberOf.map((t) => (
                <div key={t.iso3} className="mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: t.color }} />
                    <span className="text-xs text-parchment font-semibold">{t.label}</span>
                    <span className="text-caption text-muted">({t.yearFrom}–{t.yearTo})</span>
                  </div>
                  {t.controller && (
                    <div className="text-caption text-parchment/60 mb-1">
                      Controlled by: <span className="text-parchment/80 font-mono">{getName(t.controller)}</span>
                    </div>
                  )}
                  <p className="text-caption text-parchment/60 leading-relaxed">{t.economicNote}</p>
                </div>
              ))}
            </section>
          </>
        )}

      </div>
    </div>
  );
}
