// Runs before every build: every image Doodle Lab shows must have its pre-made copy, or the build stops here
// rather than shipping a gallery with holes in it. Fix with `npm run thumbs`.
import { existsSync } from "node:fs";
import { requiredCopies, publicFile } from "./doodle-images.mjs";

const missing = requiredCopies().filter(([, src, copy]) => existsSync(publicFile(src)) && !existsSync(publicFile(copy)));
if (missing.length) {
  console.error(`Doodle Lab is missing ${missing.length} pre-made image copies, e.g. ${missing.slice(0, 3).map(([, , copy]) => copy).join(", ")}.`);
  console.error("Run `npm run thumbs` and commit the new files in public/thumbs and public/views.");
  process.exit(1);
}
console.log("Doodle Lab: every image has its pre-made copy.");
