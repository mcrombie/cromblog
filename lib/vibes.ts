export const VIBE_STORAGE_KEY = "cromblog:vibe";
export const VIBE_QUERY_KEY = "vibe";
export const VIBE_CHANGE_EVENT = "cromblog:vibe-change";
export const VIBE_DISMISSED_SESSION_KEY = "cromblog:vibe-control-dismissed";

export const VIBES = [
  { id: "professional", label: "Professional" },
  { id: "forest", label: "Forest Folio" },
  { id: "minimal", label: "Essential" },
  { id: "ember", label: "Ember & Ink" },
  { id: "princess", label: "Pretty Pink Princess" },
  { id: "baron", label: "Baleful Black Baron" },
  { id: "rose", label: "Rose & Ruin" },
  { id: "doodle", label: "Doodle Lab" },
  { id: "slow-garden", label: "Slow Garden" }
] as const;

/**
 * Retired appearances. Their CSS in app/vibes.css and hero art in public/home
 * are kept; a saved or linked archived vibe falls back to the default. Move an
 * entry back into VIBES (and its hero image into app/page.tsx) to restore it.
 */
export const ARCHIVED_VIBES = [
  { id: "whimsical", label: "Cosmic Almanac", artNavLabel: "Curiosities", heroImage: "/home/cosmic-almanac-hero.png" },
  { id: "codex", label: "Illuminated Codex", artNavLabel: "Illuminations", heroImage: "/home/illuminated-codex-still-life.png" },
  { id: "ocean", label: "Tidal Archive", artNavLabel: "Specimens", heroImage: "/home/tidal-archive-hero.png" }
] as const;

export type VibeId = (typeof VIBES)[number]["id"];

export const ART_NAV_LABELS_BY_VIBE = {
  professional: "Visual Work",
  forest: "Marginalia",
  minimal: "Drawings",
  ember: "Inkwork",
  princess: "Pretty Pictures",
  baron: "Dark Arts",
  rose: "Keepsakes",
  doodle: "Doodles",
  "slow-garden": "Botanical plates"
} as const satisfies Record<VibeId, string>;

export const DEFAULT_VIBE: VibeId = "doodle";

export function isVibeId(value: unknown): value is VibeId {
  return VIBES.some((vibe) => vibe.id === value);
}
