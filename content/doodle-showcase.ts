import selection from "@/content/doodle-showcase.generated.json";

export type ShowcaseWork = {
  id: string;
  title: string;
  alt: string;
  src: string;
  image: { width: number; height: number };
  note?: string;
  description?: string;
};

// A small projection of the canonical catalog, shared by Home and Art.
// Rebuild after editing the hand-ordered selection with:
// node scripts/build-doodle-showcase.cjs
export const showcaseDrawings: readonly ShowcaseWork[] = selection.drawings;
export const showcaseScenes: readonly ShowcaseWork[] = selection.scenes;
export const homeShowcaseDrawings: readonly ShowcaseWork[] = selection.homeDrawingIds.map(id => {
  const drawing = showcaseDrawings.find(entry => entry.id === id);
  if (!drawing) throw new Error(`Missing homepage showcase drawing: ${id}`);
  return drawing;
});
