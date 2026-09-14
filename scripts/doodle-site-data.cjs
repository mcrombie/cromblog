const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
const cache = new Map();

// Read the canonical public content without importing a browser bundle or any
// private art-source preparation files.
function loadContent(name) {
  assert(/^@\/content\/[a-z0-9/-]+(?:\.[a-z0-9-]+)*$/.test(name), `Unexpected content import: ${name}`);
  const file = path.resolve(root, name.slice(2) + (name.endsWith(".json") ? "" : ".ts"));
  if (cache.has(file)) return cache.get(file);
  if (name.endsWith(".json")) {
    const value = JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/, ""));
    cache.set(file, value);
    return value;
  }
  const output = ts.transpileModule(fs.readFileSync(file, "utf8"), { compilerOptions: {
    module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2020
  } }).outputText;
  const exports = {};
  cache.set(file, exports);
  new Function("require", "exports", output)(loadContent, exports);
  return exports;
}

function publicPath(src) {
  assert(src.startsWith("/cromblog/"), "Unexpected public asset path");
  const file = path.resolve(root, "public", src.slice(1));
  assert(file.startsWith(path.resolve(root, "public") + path.sep), "Asset escaped public directory");
  return file;
}

function snapshot() {
  return {
    experiments: loadContent("@/content/doodle-experiments").doodleExperiments,
    catalog: loadContent("@/content/doodle-catalog").doodleCatalog
  };
}

module.exports = { loadContent, publicPath, snapshot };
