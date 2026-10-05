// npm run thumbs: make the pre-made copies Doodle Lab serves (see scripts/doodle-images.mjs). Only missing or
// out-of-date copies are made, so running it after adding drawings is quick. `--force` remakes everything.
import { existsSync, mkdirSync, statSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { requiredCopies, publicFile, THUMB, VIEW } from "./doodle-images.mjs";

const force = process.argv.includes("--force");
const jobs = requiredCopies().filter(([, src, copy]) => {
  if (!existsSync(publicFile(src))) { console.warn(`missing source ${src}`); return false; }
  return force || !existsSync(publicFile(copy)) || statSync(publicFile(copy)).mtimeMs < statSync(publicFile(src)).mtimeMs;
});

let done = 0, bytes = 0;
async function make([kind, src, copy]) {
  const { width, quality } = kind === "view" ? VIEW : THUMB;
  const out = publicFile(copy);
  mkdirSync(path.dirname(out), { recursive: true });
  const info = await sharp(publicFile(src)).resize({ width, withoutEnlargement: true }).webp({ quality, effort: 5 }).toFile(out);
  bytes += info.size;
  if (++done % 200 === 0) console.log(`${done} / ${jobs.length}`);
}

const queue = [...jobs];
await Promise.all(Array.from({ length: 8 }, async () => { while (queue.length) await make(queue.shift()); }));
console.log(`made ${done} copies, ${(bytes / 1e6).toFixed(1)} MB${jobs.length ? `, ${(bytes / done / 1e3).toFixed(0)} KB each on average` : ""}`);
