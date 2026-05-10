import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api.ts';
import type { CaseStudy } from '@arms-atlas/types';

interface StudySummary {
  slug: string;
  title: string;
  subtitle: string;
  yearRange: { from: number; to: number };
  highlightedCountries: string[];
}

function KeyNumber({ value, label, context }: { value: string; label: string; context?: string }) {
  return (
    <div className="border-l-2 border-gold pl-4 py-1">
      <div className="font-serif text-2xl font-semibold text-gold">{value}</div>
      <div className="text-caption text-parchment/80 mt-0.5">{label}</div>
      {context && <div className="text-caption text-muted mt-1 italic">{context}</div>}
    </div>
  );
}

function CaseStudyDetail({ slug }: { slug: string }) {
  const [study, setStudy] = useState<CaseStudy | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeBlock, setActiveBlock] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    api.caseStudy(slug)
      .then(setStudy)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = parseInt(entry.target.getAttribute('data-block-index') ?? '0', 10);
            setActiveBlock(idx);
          }
        }
      },
      { root: container, threshold: 0.5 },
    );

    const blocks = container.querySelectorAll('[data-block-index]');
    blocks.forEach((b) => observer.observe(b));
    return () => observer.disconnect();
  }, [study]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-caption text-muted animate-pulse">
        Loading story...
      </div>
    );
  }

  if (!study) {
    return (
      <div className="flex-1 flex items-center justify-center text-caption text-muted">
        Story not found.
      </div>
    );
  }

  const currentMapState = study.narrativeBlocks[activeBlock]?.mapState;

  return (
    <div className="flex h-full overflow-hidden">
      <div className="w-72 flex-shrink-0 bg-ink-light/30 flex flex-col items-center justify-center p-6 border-r border-ink-light">
        <div className="text-caption text-muted uppercase tracking-widest mb-2">Map state</div>
        <div className="font-serif text-sm text-parchment text-center">
          {currentMapState?.yearRange.from} to {currentMapState?.yearRange.to}
        </div>
        {currentMapState?.annotation && (
          <div className="mt-3 text-caption text-gold/80 italic text-center border-t border-ink-light/50 pt-3">
            {currentMapState.annotation}
          </div>
        )}
        <div className="mt-4 text-caption text-muted text-center">
          [Interactive map will render here in Phase 3+]
        </div>

        <div className="mt-auto pt-6 border-t border-ink-light/50 w-full">
          <div className="text-caption text-muted uppercase tracking-widest mb-3">Key numbers</div>
          <div className="flex flex-col gap-3">
            {study.keyNumbers.map((kn) => (
              <KeyNumber key={kn.label} {...kn} />
            ))}
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto"
        aria-label={`${study.title} story content`}
      >
        <div className="max-w-2xl mx-auto px-8 py-12">
          <header className="mb-10">
            <div className="font-sans text-caption text-gold uppercase tracking-widest mb-3">
              {study.yearRange.from} to {study.yearRange.to}
            </div>
            <h1 className="font-serif text-headline font-semibold text-parchment mb-3 leading-tight">
              {study.title}
            </h1>
            <p className="font-serif text-body-lg text-parchment/70 italic">{study.subtitle}</p>
          </header>

          {study.narrativeBlocks.map((block, idx) => (
            <section
              key={block.id}
              data-block-index={idx}
              className="mb-12 scroll-mt-8"
              aria-label={`Section ${idx + 1}`}
            >
              <div
                className={`w-1 h-full bg-brick transition-opacity duration-500 ${
                  activeBlock === idx ? 'opacity-100' : 'opacity-0'
                } absolute left-0`}
                aria-hidden="true"
              />
              <p className="editorial-body">{block.text}</p>
            </section>
          ))}

          <footer className="mt-12 pt-6 border-t border-ink-light/50">
            <h2 className="font-sans text-caption text-muted uppercase tracking-widest mb-4">Sources</h2>
            <ul className="flex flex-col gap-2">
              {study.sources.map((src) => (
                <li key={src.url}>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-caption text-muted hover:text-gold transition-colors"
                  >
                    {src.label}
                    {src.author && ` (${src.author})`}
                    {src.year && `, ${src.year}`}
                  </a>
                </li>
              ))}
            </ul>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default function Stories() {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const [summaries, setSummaries] = useState<StudySummary[]>([]);

  useEffect(() => {
    api.caseStudies().then(setSummaries).catch(console.error);
  }, []);

  if (slug) {
    return (
      <div className="h-full flex flex-col">
        <div className="px-6 py-2 border-b border-ink-light">
          <button
            onClick={() => navigate('/stories')}
            className="font-sans text-caption text-muted hover:text-parchment transition-colors"
            aria-label="Back to all stories"
          >
            All stories
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <CaseStudyDetail slug={slug} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto px-8 py-12">
        <header className="mb-10">
          <h1 className="font-serif text-headline font-semibold text-parchment mb-3">Stories</h1>
          <p className="editorial-body text-parchment/70">
            Five case studies in which arms transfers shaped the arc of history. Each traces a specific
            corridor of weapons, a set of actors, and a geopolitical outcome.
          </p>
        </header>

        <ul className="flex flex-col gap-4" role="list">
          {summaries.map((s) => (
            <li key={s.slug}>
              <button
                onClick={() => navigate(`/stories/${s.slug}`)}
                className="w-full text-left group border border-ink-light hover:border-gold/40 rounded-sm p-5 transition-colors bg-ink-light/20 hover:bg-ink-light/40"
              >
                <div className="font-sans text-caption text-gold uppercase tracking-widest mb-1">
                  {s.yearRange.from} to {s.yearRange.to}
                </div>
                <div className="font-serif text-lg font-semibold text-parchment group-hover:text-parchment mb-1 leading-snug">
                  {s.title}
                </div>
                <div className="text-caption text-muted">{s.subtitle}</div>
              </button>
            </li>
          ))}
        </ul>

        {summaries.length === 0 && (
          <div className="text-caption text-muted animate-pulse">Loading stories...</div>
        )}
      </div>
    </div>
  );
}
