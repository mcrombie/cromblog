// Export the actual public catalog and collection labels without a browser bundle.
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
const cache = new Map();

function load(file) {
  if (cache.has(file)) return cache.get(file);
  if (file.endsWith(".json")) {
    const value = JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/, ""));
    cache.set(file, value);
    return value;
  }
  const module = { exports: {} };
  cache.set(file, module.exports);
  const output = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true }
  }).outputText;
  const localRequire = (request) => {
    if (!request.startsWith("@/content/")) {
      throw new Error(`Unexpected catalog dependency: ${request}`);
    }
    const target = path.join(root, request.slice(2));
    return load(path.extname(target) ? target : `${target}.ts`);
  };
  const wrapper = vm.runInThisContext(`(function(require,module,exports){${output}\n})`, { filename: file });
  wrapper(localRequire, module, module.exports);
  cache.set(file, module.exports);
  return module.exports;
}

const { doodleCatalog, doodleBatches } = load(path.join(root, "content/doodle-catalog.ts"));
process.stdout.write(JSON.stringify({ catalog: doodleCatalog, batches: doodleBatches }));
