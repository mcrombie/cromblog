const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

const source = fs.readFileSync(path.join(__dirname, "../lib/living-garden.ts"), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const gardenModule = { exports: {} };
new Function("module", "exports", compiled)(gardenModule, gardenModule.exports);
const { GARDEN_EPOCH, GARDEN_DAY, gardenAge, treeGrowth, gardenCalendar, gardenDate, clampGardenView, gardenTrees, gardenPlaces } = gardenModule.exports;

assert.equal(gardenAge(GARDEN_EPOCH - GARDEN_DAY), 0, "Past previews must not create negative ages");
assert.equal(gardenAge(GARDEN_EPOCH + 42 * GARDEN_DAY), 42, "The garden advances while the visitor is away");
for (const tree of gardenTrees) {
  const initial = treeGrowth(GARDEN_EPOCH, tree.years);
  const inOneYear = treeGrowth(GARDEN_EPOCH + 365 * GARDEN_DAY, tree.years);
  const inTenYears = treeGrowth(GARDEN_EPOCH + 3650 * GARDEN_DAY, tree.years);
  assert.ok(initial > 0 && initial < inOneYear && inOneYear < inTenYears && inTenYears <= 1, `${tree.name} grows continuously within the frame`);
  assert.equal(treeGrowth(GARDEN_EPOCH, tree.years), initial, "Previewing the future must not mutate the live garden");
  assert.ok(treeGrowth(GARDEN_EPOCH + 365000 * GARDEN_DAY, tree.years) <= 1, "Long absences stay bounded");
}

assert.equal(gardenCalendar(Date.parse("2026-12-01T04:30:00Z")).season, "autumn", "Season boundaries follow Virginia, not UTC");
assert.equal(gardenCalendar(Date.parse("2026-12-01T05:30:00Z")).season, "winter");
assert.equal(gardenCalendar(Date.parse("2026-03-01T17:00:00Z")).season, "spring");
assert.equal(gardenCalendar(Date.parse("2026-07-01T16:00:00Z")).season, "summer");
assert.equal(gardenCalendar(Date.parse("2026-07-02T01:00:00Z")).light, "night", "DST summer evenings use Eastern time");
assert.equal(gardenCalendar(Date.parse("2026-01-02T01:00:00Z")).light, "night", "Winter evenings use Eastern time");
assert.equal(gardenDate(Date.parse("2026-09-02T02:00:00Z")), "September 1, 2026");

assert.deepEqual(clampGardenView({ zoom: .2, x: -100, y: 400 }), { zoom: 1, x: 50, y: 50 }, "Whole-garden view cannot be panned off canvas");
assert.deepEqual(clampGardenView({ zoom: 10, x: -100, y: 400 }), { zoom: 5, x: 10, y: 90 }, "Zoom and pan have safe edges");
for (const place of gardenPlaces) {
  const view = clampGardenView({ zoom: place.zoom, x: place.x, y: place.y });
  assert.ok(Math.abs(place.x - view.x) <= 50 / view.zoom && Math.abs(place.y - view.y) <= 50 / view.zoom, `${place.name} remains visible when selected`);
}
console.log("Living garden: elapsed growth, stable preview, Virginia seasons, DST, and all zoom destinations passed.");
