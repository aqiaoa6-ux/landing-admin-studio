import { create } from "zustand";
import { DEFAULT_SITE_CONFIG, type SiteConfig } from "../../shared/site-config";

interface SiteState {
  config: SiteConfig;
  loading: boolean;
  setConfig: (config: SiteConfig) => void;
  patchConfig: (updater: (current: SiteConfig) => SiteConfig) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useSiteStore = create<SiteState>((set) => ({
  config: DEFAULT_SITE_CONFIG,
  loading: false,
  setConfig: (config) => set({ config }),
  patchConfig: (updater) => set((state) => ({ config: updater(state.config) })),
  setLoading: (loading) => set({ loading }),
  reset: () => set({ config: DEFAULT_SITE_CONFIG, loading: false }),
}));
