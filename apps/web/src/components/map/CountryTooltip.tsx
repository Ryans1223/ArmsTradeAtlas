interface TooltipData {
  iso3: string;
  name: string;
  exports: number;
  imports: number;
  topSuppliers: { iso3: string; tiv: number }[];
  topRecipients: { iso3: string; tiv: number }[];
}

interface CountryTooltipProps {
  data: TooltipData | null;
  x: number;
  y: number;
}

function fmt(tiv: number): string {
  if (tiv >= 1000) return `${(tiv / 1000).toFixed(1)}B TIV`;
  return `${tiv.toFixed(0)}M TIV`;
}

export default function CountryTooltip({ data, x, y }: CountryTooltipProps) {
  if (!data) return null;

  const style: React.CSSProperties = {
    left: x + 12,
    top: y - 8,
    transform: x > window.innerWidth - 280 ? 'translateX(-100%)' : undefined,
  };

  return (
    <div
      className="absolute z-50 pointer-events-none bg-ink-light border border-ink-light/50 rounded-sm p-3 w-60 shadow-xl animate-fade-in"
      style={style}
      role="tooltip"
    >
      <div className="font-serif text-sm font-semibold text-parchment mb-2">{data.name}</div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-2">
        <div>
          <div className="text-caption text-muted uppercase tracking-wider">Exports</div>
          <div className="text-sm text-gold font-medium">{data.exports > 0 ? fmt(data.exports) : 'none'}</div>
        </div>
        <div>
          <div className="text-caption text-muted uppercase tracking-wider">Imports</div>
          <div className="text-sm text-brick-light font-medium">{data.imports > 0 ? fmt(data.imports) : 'none'}</div>
        </div>
      </div>

      {data.topRecipients.length > 0 && (
        <div className="mb-1">
          <div className="text-caption text-muted uppercase tracking-wider mb-1">Top recipients</div>
          {data.topRecipients.slice(0, 3).map((r) => (
            <div key={r.iso3} className="flex justify-between text-caption text-parchment/80">
              <span>{r.iso3}</span>
              <span className="text-parchment/50">{fmt(r.tiv)}</span>
            </div>
          ))}
        </div>
      )}

      {data.topSuppliers.length > 0 && (
        <div>
          <div className="text-caption text-muted uppercase tracking-wider mb-1">Top suppliers</div>
          {data.topSuppliers.slice(0, 3).map((s) => (
            <div key={s.iso3} className="flex justify-between text-caption text-parchment/80">
              <span>{s.iso3}</span>
              <span className="text-parchment/50">{fmt(s.tiv)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
