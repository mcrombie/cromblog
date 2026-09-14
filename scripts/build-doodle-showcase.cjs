const fs = require("fs");
const path = require("path");
const assert = require("assert/strict");
const { snapshot, publicPath } = require("./doodle-site-data.cjs");

const root = path.resolve(__dirname, "..");
const selection = JSON.parse(fs.readFileSync(path.join(root, "content/doodle-showcase.selection.json"), "utf8"));
const source = snapshot();

function project(picks, entries, count, kind) {
  assert.equal(picks.length, count, `Expected ${count} ${kind} selections`);
  assert.equal(new Set(picks.map(pick => pick.id)).size, count, `Duplicate ${kind} selection`);
  return picks.map(pick => {
    const entry = entries.find(entry => entry.id === pick.id);
    assert(entry, `Unknown selection: ${pick.id}`);
    assert(fs.existsSync(publicPath(entry.src)), `Missing image: ${entry.src}`);
    if (kind === "scenes") assert.equal(entry.kind, "Scene", `Expected a still scene: ${entry.id}`);
    else assert.notEqual(entry.status, "archive", `Archived drawing in showcase: ${entry.id}`);
    return {
      id: entry.id, title: entry.title, alt: entry.alt, src: entry.src,
      image: entry.image, note: pick.note,
      ...(entry.description ? { description: entry.description } : {})
    };
  });
}

const result = {
  drawings: project(selection.drawings, source.catalog, 12, "drawings"),
  scenes: project(selection.scenes, source.experiments, 6, "scenes"),
  homeDrawingIds: selection.homeDrawingIds
};
assert.equal(result.homeDrawingIds.length, 3);
assert.equal(new Set(result.homeDrawingIds).size, 3);
for (const id of result.homeDrawingIds) assert(result.drawings.some(entry => entry.id === id), `Homepage drawing absent from showcase: ${id}`);
const output = path.join(root, "content/doodle-showcase.generated.json");
const bytes = JSON.stringify(result, null, 2) + "\n";
if (process.argv.includes("--check")) {
  assert.equal(fs.readFileSync(output, "utf8"), bytes, "Showcase metadata is stale; run node scripts/build-doodle-showcase.cjs");
} else {
  fs.writeFileSync(output, bytes);
}
console.log(JSON.stringify({ status: "passed", drawings: result.drawings.length, scenes: result.scenes.length, metadataBytes: Buffer.byteLength(bytes) }));
