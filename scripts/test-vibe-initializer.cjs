const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

const root = path.join(__dirname, "..");
function loadConstants(file) {
  const code = ts.transpileModule(fs.readFileSync(path.join(root, file), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
  }).outputText;
  const mod = { exports: {} };
  new Function("module", "exports", code)(mod, mod.exports);
  return mod.exports;
}
const constants = { ...loadConstants("lib/vibes.ts"), ...loadConstants("lib/doodle-designs.ts") };
const source = ts.createSourceFile("layout.tsx", fs.readFileSync(path.join(root, "app/layout.tsx"), "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
let expression;
function find(node) {
  if (ts.isVariableDeclaration(node) && node.name.getText(source) === "vibeInitializer") expression = node.initializer.getText(source);
  ts.forEachChild(node, find);
}
find(source);
assert.ok(expression, "The pre-paint theme initializer exists");
const initializer = new Function(...Object.keys(constants), `return ${expression}`)(...Object.values(constants));

function open({ query = "", stored, blocked = false } = {}) {
  const saved = new Map(stored ? [[constants.VIBE_STORAGE_KEY, stored]] : []);
  const storage = {
    getItem(key) { if (blocked) throw new Error("Storage unavailable"); return saved.get(key) ?? null; },
    setItem(key, value) { if (blocked) throw new Error("Storage unavailable"); saved.set(key, value); }
  };
  const document = { documentElement: { dataset: {} } };
  vm.runInNewContext(initializer, { document, URL, window: { localStorage: storage, sessionStorage: storage, location: { href: `http://localhost/${query}` } } });
  return { dataset: document.documentElement.dataset, saved };
}

assert.equal(open().dataset.vibe, constants.DEFAULT_VIBE, "Adding a vibe preserves the existing default");
assert.equal(open({ stored: "slow-garden" }).dataset.vibe, "slow-garden", "A selected garden theme survives a return visit");
const selected = open({ query: "?vibe=slow-garden", stored: "ember" });
assert.equal(selected.dataset.vibe, "slow-garden", "A direct link selects the requested vibe before paint");
assert.equal(selected.saved.get(constants.VIBE_STORAGE_KEY), "slow-garden", "Following a theme link saves the choice for subsequent pages");
assert.equal(open({ query: "?vibe=unknown", stored: "ember" }).dataset.vibe, "ember", "Unknown query values cannot replace a saved appearance");
assert.equal(open({ query: "?vibe=slow-garden", blocked: true }).dataset.vibe, "slow-garden", "The theme works when browser storage is unavailable");
assert.equal(open({ query: "?doodle-design=original-strokes", stored: "slow-garden" }).dataset.vibe, "doodle", "Existing Doodle Lab preview links keep working");
assert.equal(open({ query: "?doodle-design=original-strokes&vibe=slow-garden" }).dataset.vibe, "slow-garden", "An explicit vibe takes precedence over a stale doodle-design query");
for (const vibe of constants.VIBES) assert.equal(open({ stored: vibe.id }).dataset.vibe, vibe.id, `${vibe.label} remains selectable`);
for (const vibe of constants.ARCHIVED_VIBES) {
  assert.equal(open({ stored: vibe.id }).dataset.vibe, constants.DEFAULT_VIBE, `A saved ${vibe.label} choice falls back to the default`);
  assert.equal(open({ query: `?vibe=${vibe.id}`, stored: "ember" }).dataset.vibe, "ember", `A ${vibe.label} link cannot replace a saved appearance`);
}
assert.equal(constants.VIBES[constants.VIBES.findIndex(v => v.id === "doodle") + 1].id, "slow-garden", "Slow Garden follows Doodle Lab in the cycle");
console.log("Vibe initializer: all appearances, persistent selection, direct links, invalid values, blocked storage, and Doodle Lab compatibility passed.");
