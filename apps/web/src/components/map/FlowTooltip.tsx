import type { TradeFlow } from '@arms-atlas/types';

export interface FlowHoverState {
  flows: TradeFlow[];
  totalTiv: number;
  supplierName: string;
  recipientName: string;
}

export const CATEGORY_COLORS: Record<string, string> = {
  aircraft: '#5b9bd5',
  missiles: '#e05c4e',
  naval: '#2e6da4',
  armored_vehicles: '#70a353',
  artillery: '#c9a24b',
  sensors: '#9b70c2',
  other: '#888888',
};

const CATEGORY_LABELS: Record<string, string> = {
  aircraft: 'Aircraft',
  missiles: 'Missiles / Air Defense',
  naval: 'Naval',
  armored_vehicles: 'Armored Vehicles',
  artillery: 'Artillery',
  sensors: 'Sensors & Radar',
  other: 'Equipment',
};

interface Props {
  data: FlowHoverState | null;
  x: number;
  y: number;
}

export default function FlowTooltip({ data, x, y }: Props) {
  if (!data) return null;

  const tipW = 268;
  const left = x + 14 + tipW > (typeof window !== 'undefined' ? window.innerWidth : 1200)
    ? x - tipW - 14
    : x + 14;
  const top = Math.max(8, y - 12);

  return (
    <div
      className="fixed z-50 pointer-events-none bg-ink border border-gold/40 rounded-sm shadow-xl"
      style={{ left, top, width: tipW }}
    >
      <div className="px-3 pt-2.5 pb-2 border-b border-white/10">
        <div className="font-serif text-sm text-parchment leading-snug">
          {data.supplierName}
          <span className="text-gold/80 mx-1.5 text-xs">→</span>
          {data.recipientName}
        </div>
        <div className="text-gold font-medium text-caption mt-0.5">
          {data.totalTiv.toLocaleString()} TIV total
        </div>
      </div>

      <div className="px-3 py-2 space-y-1">
        {data.flows.slice(0, 8).map((f) => (
          <div key={f.id} className="flex items-start gap-2 text-[11px]">
            <span
              className="shrink-0 w-2 h-2 rounded-full mt-[3px]"
              style={{ backgroundColor: CATEGORY_COLORS[f.weaponCategory] ?? '#888' }}
            />
            <span className="text-muted shrink-0 w-24">
              {CATEGORY_LABELS[f.weaponCategory] ?? 'Other'}
            </span>
            {f.description ? (
              <span className="text-parchment/60 truncate flex-1">{f.description}</span>
            ) : (
              <span className="flex-1" />
            )}
            <span className="ml-1 shrink-0 text-gold/60 tabular-nums">{f.tiv}</span>
          </div>
        ))}
        {data.flows.length > 8 && (
          <div className="text-muted/50 text-[10px] pl-4">
            +{data.flows.length - 8} more weapons
          </div>
        )}
      </div>

      <div className="px-3 pb-2 text-muted/40 text-[10px]">
        TIV in millions, constant 1990 USD
      </div>
    </div>
  );
}
