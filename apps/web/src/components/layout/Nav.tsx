import { useLocation } from 'react-router-dom';
import type { Scene } from '../../store.ts';

interface NavProps {
  onNavigate: (scene: Scene) => void;
}

const NAV_ITEMS: { scene: Scene; label: string }[] = [
  { scene: 'atlas', label: 'Atlas' },
  { scene: 'markets', label: 'Markets' },
  { scene: 'finance', label: 'Finance' },
  { scene: 'stories', label: 'Stories' },
  { scene: 'methodology', label: 'Methodology' },
];

export default function Nav({ onNavigate }: NavProps) {
  const location = useLocation();
  const current = location.pathname.split('/')[1] ?? 'atlas';

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-ink-light bg-ink z-50 flex-shrink-0">
      <button
        onClick={() => onNavigate('atlas')}
        className="group flex items-baseline gap-2 focus-visible:outline-none"
        aria-label="Arms Trade Atlas home"
      >
        <span className="font-serif text-lg font-semibold text-parchment tracking-tight">
          Arms Trade Atlas
        </span>
        <span className="font-sans text-caption text-muted tracking-widest uppercase">
          1914 to present
        </span>
      </button>

      <nav aria-label="Primary navigation">
        <ul className="flex items-center gap-6" role="list">
          {NAV_ITEMS.map(({ scene, label }) => {
            const isActive = current === scene || (current === '' && scene === 'atlas');
            return (
              <li key={scene}>
                <button
                  onClick={() => onNavigate(scene)}
                  className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
