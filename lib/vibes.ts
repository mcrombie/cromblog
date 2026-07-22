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
  { id: "ocean", label: "Tidal Archive" }
] as const;

export type VibeId = (typeof VIBES)[number]["id"];

export const DEFAULT_VIBE: VibeId = "professional";

export function isVibeId(value: unknown): value is VibeId {
  return VIBES.some((vibe) => vibe.id === value);
}
