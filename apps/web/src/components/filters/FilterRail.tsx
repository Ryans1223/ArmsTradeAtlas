import { useAtlasStore } from '../../store.ts';
import type { WeaponCategory } from '@arms-atlas/types';
import type { ShadingMode, ViewMode } from '../../store.ts';

const CATEGORIES: { id: WeaponCategory; label: string }[] = [
  { id: 'aircraft', label: 'Aircraft' },
  { id: 'missiles', label: 'Missiles' },
  { id: 'naval', label: 'Naval' },
  { id: 'armored_vehicles', label: 'Armor' },
  { id: 'artillery', label: 'Artillery' },
  { id: 'sensors', label: 'Sensors' },
  { id: 'other', label: 'Other' },
];

const SHADING: { id: ShadingMode; label: string }[] = [
  { id: 'exports', label: 'Exports' },
  { id: 'imports', label: 'Imports' },
  { id: 'net', label: 'Net' },
];

export default function FilterRail() {
  const {
    categories,
    setCategories,
    shadingMode,
    setShadingMode,
    viewMode,
    setViewMode,
    animationsEnabled,
    setAnimationsEnabled,
    selectedCountry,
    setSelectedCountry,
  } = useAtlasStore();

  const toggleCategory = (cat: WeaponCategory) => {
    if (categories.includes(cat)) {
      if (categories.length === 1) return;
      setCategories(categories.filter((c) => c !== cat));
    } else {
      setCategories([...categories, cat]);
    }
  };

  return (
    <aside
      className="w-48 flex-shrink-0 flex flex-col gap-4 p-4 border-r border-ink-light bg-ink overflow-y-auto"
      aria-label="Map filters"
    >
      <section>
        <h2 className="font-sans text-caption text-muted uppercase tracking-widest mb-2">View</h2>
        <div className="flex flex-col gap-1">
          {(['choropleth', 'flows'] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`text-left px-2 py-1 rounded-sm text-caption transition-colors ${
                viewMode === mode
                  ? 'bg-ink-light text-parchment'
                  : 'text-muted hover:text-parchment'
              }`}
              aria-pressed={viewMode === mode}
            >
              {mode === 'choropleth' ? 'Choropleth' : 'Flow Lines'}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-sans text-caption text-muted uppercase tracking-widest mb-2">Shading</h2>
        <div className="flex flex-col gap-1">
          {SHADING.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setShadingMode(id)}
              className={`text-left px-2 py-1 rounded-sm text-caption transition-colors ${
                shadingMode === id
                  ? 'bg-ink-light text-parchment'
                  : 'text-muted hover:text-parchment'
              }`}
              aria-pressed={shadingMode === id}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-sans text-caption text-muted uppercase tracking-widest mb-2">Categories</h2>
        <div className="flex flex-col gap-1">
          {CATEGORIES.map(({ id, label }) => (
            <label key={id} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={categories.includes(id)}
                onChange={() => toggleCategory(id)}
                className="accent-gold"
              />
              <span
                className={`text-caption transition-colors ${
                  categories.includes(id) ? 'text-parchment' : 'text-muted'
                } group-hover:text-parchment`}
              >
                {label}
              </span>
            </label>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-sans text-caption text-muted uppercase tracking-widest mb-2">Options</h2>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={animationsEnabled}
            onChange={(e) => setAnimationsEnabled(e.target.checked)}
            className="accent-gold"
          />
          <span className="text-caption text-muted hover:text-parchment transition-colors">
            Animations
          </span>
        </label>
      </section>

      {selectedCountry && (
        <section className="mt-auto">
          <button
            onClick={() => setSelectedCountry(null)}
            className="w-full text-caption text-muted hover:text-parchment border border-ink-light hover:border-parchment/30 rounded-sm py-1.5 transition-colors"
          >
            Clear selection
          </button>
        </section>
      )}
    </aside>
  );
}
