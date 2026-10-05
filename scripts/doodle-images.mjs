// Every image Doodle Lab shows, read straight from its content files, and where its pre-made copies live.
//
// Doodle Lab used to send each drawing through Vercel's Image Optimization, which made and stored a new copy for
// every screen size and quality anyone asked for. These copies are made once instead, here, and served as plain
// files: a thumbnail for every grid tile, and for the AI experiments (whose originals average 2.9 MB) a viewing copy
// for the enlarged view. The drawings' own PNGs are small enough to be their enlarged view as they are.
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const IMAGE = /"(\/[^"]+\.(?:png|jpe?g|webp))"/g;

function imagesIn(file) {
  return [...readFileSync(path.join(ROOT, file), "utf8").matchAll(IMAGE)].map((match) => match[1]);
}
const jsonFiles = (directory) => readdirSync(path.join(ROOT, directory)).filter((name) => name.endsWith(".json")).map((name) => `${directory}/${name}`);

/** The drawings: the batches the catalog is built from, and the older collections it folds in. */
export function drawingImages() {
  return unique([...jsonFiles("content/doodle-batches"), "content/doodles.ts", "content/art.ts"].flatMap(imagesIn));
}
/** The AI experiments: their batches and the few written inline. */
export function experimentImages() {
  return unique([...jsonFiles("content/doodle-experiment-batches"), "content/doodle-experiments.ts"].flatMap(imagesIn));
}
const unique = (list) => [...new Set(list)].sort();

// Mirrors lib/doodle-image-paths.ts, which the components use.
export const thumbPath = (src) => `/thumbs${src.replace(/\.[a-z]+$/i, ".webp")}`;
export const viewPath = (src) => `/views${src.replace(/\.[a-z]+$/i, ".webp")}`;
export const publicFile = (src) => path.join(ROOT, "public", src);

export const THUMB = Object.freeze({ width: 640, quality: 72 });
export const VIEW = Object.freeze({ width: 1600, quality: 85 });

/** Every copy that must exist: [kind, source image, pre-made copy]. */
export function requiredCopies() {
  const drawings = drawingImages(), experiments = experimentImages();
  return [
    ...drawings.map((src) => ["thumb", src, thumbPath(src)]),
    ...experiments.map((src) => ["thumb", src, thumbPath(src)]),
    ...experiments.map((src) => ["view", src, viewPath(src)]),
  ];
}
