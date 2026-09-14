export const DOODLE_DESIGN_STORAGE_KEY = "cromblog:doodle-design";
export const DOODLE_DESIGN_CHANGE_EVENT = "cromblog:doodle-design-change";
export const DOODLE_DESIGN_QUERY_KEY = "doodle-design";
export const DOODLE_DESIGNS = [
  { id: "field-notebook", label: "Field Notebook" },
  { id: "original-strokes", label: "Original Strokes" }
] as const;
export type DoodleDesignId = typeof DOODLE_DESIGNS[number]["id"];
export const DEFAULT_DOODLE_DESIGN: DoodleDesignId = "field-notebook";
export function isDoodleDesignId(value: unknown): value is DoodleDesignId {
  return DOODLE_DESIGNS.some(design => design.id === value);
}
