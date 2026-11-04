// Run with: node scripts/test-draft-proxy.cjs
// Synthetic metadata keeps private drafts out of test output and fixtures.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");
const ts = require("typescript");
const { NextRequest, NextResponse } = require("next/server");
const { unstable_doesMiddlewareMatch } = require("next/experimental/testing/server");

const root = path.resolve(__dirname, "..");
function load(relativePath, env, imports = {}) {
  const module = { exports: {} };
  const source = fs.readFileSync(path.join(root, relativePath), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
  }).outputText;
  vm.runInNewContext(compiled, {
    module, exports: module.exports, process: { env: { NODE_ENV: env } },
    require(name) {
      assert(Object.hasOwn(imports, name), `Unexpected dependency: ${name}`);
      return imports[name];
    }
  }, { filename: relativePath });
  return module.exports;
}

function guard(env) {
  return load("proxy.ts", env, {
    "next/server": { NextResponse },
    "@/app/cromblog/draft-preview": load("app/cromblog/draft-preview.ts", env),
    "@/content/blog": {
      blogPosts: { hidden: { href: "/cromblog/security-test-draft" } },
      draftBlogOrder: ["hidden"]
    }
  });
}

test("production drafts and descendants return uncached, unindexed 404 responses", async () => {
  const { proxy, config } = guard("production");
  for (const suffix of ["", "/", "/asset.png", "?preview=draft", "?_rsc=test"]) {
    const url = `https://site.invalid/cromblog/security-test-draft${suffix}`;
    assert(unstable_doesMiddlewareMatch({ config, nextConfig: {}, url }));
    for (const headers of [{}, { rsc: "1" }, { "x-middleware-subrequest": "proxy:proxy:proxy:proxy:proxy" }]) {
      const response = proxy(new NextRequest(url, { headers }));
      assert.equal(response.status, 404);
      assert.equal(await response.text(), "Not Found");
      assert.equal(response.headers.get("cache-control"), "no-store");
      assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow");
      assert.equal(response.headers.get("x-middleware-next"), null);
    }
  }
});

test("published pages and similar names remain accessible", () => {
  const { proxy } = guard("production");
  for (const pathname of ["/cromblog", "/cromblog/azhora-iii", "/cromblog/security-test-draft-published"]) {
    assert.equal(proxy(new NextRequest(`https://site.invalid${pathname}`)).headers.get("x-middleware-next"), "1");
  }
});

test("development retains local draft preview without changing the production policy", () => {
  const preview = load("app/cromblog/draft-preview.ts", "development");
  assert.equal(preview.isDraftPreviewRequest({ preview: "draft" }), true);
  assert.equal(preview.isDraftPreviewRequest(undefined), false);
  assert.equal(guard("development").proxy(new NextRequest("https://site.invalid/cromblog/security-test-draft")).headers.get("x-middleware-next"), "1");
  const production = load("app/cromblog/draft-preview.ts", "production");
  assert.equal(production.canPreviewDrafts(), false);
  assert.equal(production.isDraftPreviewRequest({ preview: "draft" }), false);
});

test("the matcher covers blog requests but leaves applications, APIs and images alone", () => {
  const { config } = guard("production");
  for (const pathname of ["/cromblog", "/cromblog/azhora-iii", "/cromblog/security-test-draft/asset.png"]) {
    assert(unstable_doesMiddlewareMatch({ config, nextConfig: {}, url: `https://site.invalid${pathname}` }));
  }
  for (const pathname of ["/projects", "/games/azhora", "/api/clashvergence/demo/sessions", "/_next/image?url=%2Fimage.png&w=640&q=75"]) {
    assert.equal(unstable_doesMiddlewareMatch({ config, nextConfig: {}, url: `https://site.invalid${pathname}` }), false);
  }
});
