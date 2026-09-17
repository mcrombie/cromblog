/**
 * The Doodle Lab vibe once offered two designs (Field Notebook and Original
 * Strokes) behind a sidebar switch. There is a single design now; these
 * constants only keep the old `?doodle-design=` links working as aliases for
 * `?vibe=doodle`.
 */
export const DOODLE_DESIGN_QUERY_KEY = "doodle-design";
export const LEGACY_DOODLE_DESIGN_IDS = ["field-notebook", "original-strokes"] as const;

export type LegacyDoodleDesignId = (typeof LEGACY_DOODLE_DESIGN_IDS)[number];

export function isLegacyDoodleDesignId(value: unknown): value is LegacyDoodleDesignId {
  return LEGACY_DOODLE_DESIGN_IDS.some((id) => id === value);
}
