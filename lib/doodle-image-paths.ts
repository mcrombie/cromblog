/**
 * Doodle Lab's pre-made image copies (scripts/doodle-images.mjs makes them with `npm run thumbs`). They are served
 * as plain files, never through Vercel's Image Optimization: a thumbnail for every grid tile, and for the AI
 * experiments, whose originals are large, a viewing copy for the enlarged view.
 */
export const doodleThumbSrc = (src: string) => `/thumbs${src.replace(/\.[a-z]+$/i, ".webp")}`;
export const doodleViewSrc = (src: string) => `/views${src.replace(/\.[a-z]+$/i, ".webp")}`;
