export const VIBE_STORAGE_KEY = "cromblog:vibe";
export const VIBE_CHANGE_EVENT = "cromblog:vibe-change";
export const VIBE_DISMISSED_SESSION_KEY = "cromblog:vibe-control-dismissed";

export const VIBES = [
  { id: "professional", label: "Professional" },
  { id: "forest", label: "Forest Folio" },
  { id: "minimal", label: "Essential" },
  { id: "whimsical", label: "Cosmic Almanac" },
  { id: "codex", label: "Illuminated Codex" },
  { id: "ember", label: "Ember & Ink" },
  { id: "ocean", label: "Tidal Archive" },
  { id: "princess", label: "Pretty Pink Princess" },
  { id: "baron", label: "Baleful Black Baron" },
  { id: "rose", label: "Rose & Ruin" },
  { id: "doodle", label: "Doodle Lab" }
] as const;

export type VibeId = (typeof VIBES)[number]["id"];

export const ART_NAV_LABELS_BY_VIBE = {
  professional: "Visual Work",
  forest: "Marginalia",
  minimal: "Drawings",
  whimsical: "Curiosities",
  codex: "Illuminations",
  ember: "Inkwork",
  ocean: "Specimens",
  princess: "Pretty Pictures",
  baron: "Dark Arts",
  rose: "Keepsakes",
  doodle: "Doodles"
} as const satisfies Record<VibeId, string>;

export const DEFAULT_VIBE: VibeId = "doodle";

export function isVibeId(value: unknown): value is VibeId {
  return VIBES.some((vibe) => vibe.id === value);
}
