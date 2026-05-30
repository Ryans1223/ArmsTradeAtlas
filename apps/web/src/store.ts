import { create } from 'zustand';
import type { WeaponCategory } from '@arms-atlas/types';

export type Scene = 'atlas' | 'stories' | 'methodology' | 'markets' | 'finance';
export type ShadingMode = 'exports' | 'imports' | 'net';
export type ViewMode = 'choropleth' | 'flows';

interface AtlasState {
  scene: Scene;
  year: number;
  selectedCountry: string | null;
  hoveredCountry: string | null;
  supplierFilter: string | null;
  recipientFilter: string | null;
  categories: WeaponCategory[];
  shadingMode: ShadingMode;
  viewMode: ViewMode;
  isPlaying: boolean;
  animationsEnabled: boolean;
  activeCaseStudy: string | null;

  setScene: (scene: Scene) => void;
  setYear: (year: number) => void;
  setSelectedCountry: (iso3: string | null) => void;
  setHoveredCountry: (iso3: string | null) => void;
  setSupplierFilter: (iso3: string | null) => void;
  setRecipientFilter: (iso3: string | null) => void;
  setCategories: (cats: WeaponCategory[]) => void;
  setShadingMode: (mode: ShadingMode) => void;
  setViewMode: (mode: ViewMode) => void;
  setIsPlaying: (playing: boolean) => void;
  setAnimationsEnabled: (enabled: boolean) => void;
  setActiveCaseStudy: (slug: string | null) => void;
}

export const useAtlasStore = create<AtlasState>((set) => ({
  scene: 'atlas',
  year: 1914,
  selectedCountry: null,
  hoveredCountry: null,
  supplierFilter: null,
  recipientFilter: null,
  categories: ['aircraft', 'missiles', 'naval', 'armored_vehicles', 'artillery', 'sensors', 'other'],
  shadingMode: 'exports',
  viewMode: 'choropleth',
  isPlaying: false,
  animationsEnabled: true,
  activeCaseStudy: null,

  setScene: (scene) => set({ scene }),
  setYear: (year) => set({ year }),
  setSelectedCountry: (selectedCountry) => set({ selectedCountry }),
  setHoveredCountry: (hoveredCountry) => set({ hoveredCountry }),
  setSupplierFilter: (supplierFilter) => set({ supplierFilter }),
  setRecipientFilter: (recipientFilter) => set({ recipientFilter }),
  setCategories: (categories) => set({ categories }),
  setShadingMode: (shadingMode) => set({ shadingMode }),
  setViewMode: (viewMode) => set({ viewMode }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setAnimationsEnabled: (animationsEnabled) => set({ animationsEnabled }),
  setActiveCaseStudy: (activeCaseStudy) => set({ activeCaseStudy }),
}));
