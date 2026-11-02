// Run with: node scripts/test-clashvergence-proxy.cjs
// Loads only the route, with synthetic environment values and an in-memory upstream.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");
const ts = require("typescript");
const { NextRequest, NextResponse } = require("next/server");

const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(root, "app/api/clashvergence/[...path]/route.ts"), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
}).outputText;
const sessionId = "0123456789abcdef0123456789abcdef";
const collection = ["demo", "sessions"];
const session = [...collection, sessionId];
const advance = [...session, "advance"];
const history = [...session, "history"];
const maxBytes = 8 * 1024 * 1024;

// Same MapData shape as Clashvergence's tests/test_demo_sessions.py::_demo_map.
const map = { name: "Demo Test World", width: 4, height: 2, hexSize: 20, hexes: {}, rivers: {}, regions: {} };
for (const [column, region] of ["a", "b", "c", "d"].entries()) {
  map.regions[region] = { name: `Region ${region.toUpperCase()}`, color: "#777" };
  for (let row = 0; row < 2; row += 1) {
    map.hexes[`${column},${row}`] = {
      q: column, r: row, terrain: column % 2 === 0 ? "grassland" : "forest", climate: "Cfb", region
    };
  }
}
const createPayload = { map, num_factions: 4, seed: "browser-demo", target_turns: 25 };

function harness({ env = {}, upstream, immediateTimeout = false } = {}) {
  const calls = [];
  const timers = [];
  const cleared = [];
  const routeModule = { exports: {} };
  vm.runInNewContext(compiled, {
    module: routeModule,
    exports: routeModule.exports,
    require(name) {
      assert.equal(name, "next/server", "The route must not import other application code in this harness");
      return { NextRequest, NextResponse };
    },
    process: { env: {
      CLASHVERGENCE_API_URL: "https://backend.invalid/prefix",
      CLASHVERGENCE_DEMO_PROXY_SECRET: "test-only-placeholder",
      ...env
    } },
    URL, Headers, AbortController, TextDecoder, Error,
    setTimeout(callback, milliseconds) {
      timers.push(milliseconds);
      if (immediateTimeout) { queueMicrotask(callback); return 1; }
      return setTimeout(callback, milliseconds);
    },
    clearTimeout(timer) { cleared.push(timer); if (!immediateTimeout) clearTimeout(timer); },
    async fetch(url, init) {
      // No real fetch is available to the route. All responses stay in this process.
      assert.equal(url.origin, "https://backend.invalid");
      calls.push({ url: new URL(url), init });
      if (upstream) return upstream(url, init);
      return new Response(JSON.stringify({ ok: true }), {
        status: init.method === "POST" && url.pathname.endsWith("/sessions") ? 201 : 200,
        headers: { "content-type": "application/json", "x-request-id": "mock-request-id" }
      });
    }
  }, { filename: "clashvergence-route.test.js" });

  return {
    calls, timers, cleared,
    async request(method, segments, payload, { raw, headers = {}, query = "", failRead = false } = {}) {
      const body = raw === undefined && payload !== undefined ? JSON.stringify(payload) : raw;
      const request = new NextRequest(`https://site.invalid/api/clashvergence/${segments.map(encodeURIComponent).join("/")}${query}`, {
        method,
        headers: { ...(body !== undefined ? { "content-type": "application/json" } : {}), ...headers },
        ...(body !== undefined ? { body } : {})
      });
      if (failRead) request.arrayBuffer = async () => { throw new Error("synthetic read failure"); };
      // Unknown methods exercise the shared guard; Next also rejects unsupported exports.
      const handler = ["GET", "POST", "DELETE"].includes(method)
        ? routeModule.exports[method]
        : routeModule.exports.GET;
      return handler(request, { params: { path: segments } });
    }
  };
}

test("all five browser operations preserve payloads, upstream paths and no-store responses", async () => {
  const h = harness();
  for (const [method, segments, payload, status] of [
    ["POST", collection, createPayload, 201],
    ["GET", session, undefined, 200],
    ["POST", advance, {}, 200],
    ["POST", history, { faction_name: "Region A", length: "abridged" }, 200],
    ["DELETE", session, undefined, 200]
  ]) {
    const response = await h.request(method, segments, payload);
    assert.equal(response.status, status);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.equal(response.headers.get("x-request-id"), "mock-request-id");
    assert.deepEqual(await response.json(), { ok: true });
    const { url, init } = h.calls.at(-1);
    assert.equal(url.pathname, `/prefix/${segments.join("/")}`);
    assert.equal(url.search, "");
    assert.equal(init.method, method);
    assert.equal(init.cache, "no-store");
    assert.equal(init.headers["x-clashvergence-proxy-secret"], "test-only-placeholder");
    assert.equal(init.body ? new TextDecoder().decode(init.body) : "", payload === undefined ? "" : JSON.stringify(payload));
  }
  assert.deepEqual(h.timers, Array(5).fill(90_000));
  assert.equal(h.cleared.length, 5);
});

test("backend defaults, browser options and Unicode data remain supported", async () => {
  for (const payload of [
    { map }, { map, seed: null }, { map, seed: "" },
    { ...createPayload, num_factions: 2, target_turns: 1 },
    { ...createPayload, num_factions: 10, target_turns: 500, seed: "Seed 🌍" }
  ]) assert.equal((await harness().request("POST", collection, payload)).status, 201);
  for (const length of [undefined, "abridged", "standard", "long"]) {
    assert.equal((await harness().request("POST", history, { faction_name: "La région 🌍", length })).status, 200);
  }
  const h = harness();
  assert.equal((await h.request("POST", advance, undefined, {
    raw: " { } \n", headers: { "content-type": "Application/JSON; charset=utf-8" }
  })).status, 200);
  assert.equal(new TextDecoder().decode(h.calls[0].init.body), " { } \n");
});

test("extra routes, traversal syntax and malformed session IDs never reach upstream", async () => {
  const badPaths = [
    [], ["demo"], ["healthz"], ["admin", "sessions"], ["demo", "sessions-extra"],
    [...session, "state"], [...session, "delete"], [...advance, "extra"], [...session, "history", ""],
    [...collection, "..", "admin"], [...collection, "https://attacker.invalid"],
    ...["", ".", "..", "%2e%2e", "%252e%252e", "a/b", "a\\b", "a?b", "a#b", "\0",
      sessionId.toUpperCase(), sessionId.slice(1), `${sessionId}0`, `${sessionId}\n`, "g".repeat(32),
      "01234567-89ab-cdef-0123-456789abcdef"].map(id => [...collection, id])
  ];
  for (const segments of badPaths) {
    const h = harness();
    assert.equal((await h.request("GET", segments)).status, 404, JSON.stringify(segments));
    assert.equal(h.calls.length, 0);
  }
});

test("unsupported method/resource combinations return 405 and an accurate Allow header", async () => {
  for (const [segments, allowed] of [[collection, "POST"], [session, "GET, DELETE"], [advance, "POST"], [history, "POST"]]) {
    for (const method of ["GET", "POST", "DELETE", "PUT", "PATCH", "HEAD", "OPTIONS", "toString", "constructor", "__proto__"]) {
      if (allowed.split(", ").includes(method)) continue;
      const h = harness();
      const response = await h.request(method, segments);
      assert.equal(response.status, 405, `${method} ${segments.join("/")}`);
      assert.equal(response.headers.get("allow"), allowed);
      assert.equal(response.headers.get("cache-control"), "no-store");
      assert.equal(h.calls.length, 0);
    }
  }
});

test("query parameters are rejected on every operation", async () => {
  for (const [method, segments, payload] of [
    ["POST", collection, createPayload], ["GET", session], ["DELETE", session],
    ["POST", advance, {}], ["POST", history, { faction_name: "Region A" }]
  ]) {
    const h = harness();
    assert.equal((await h.request(method, segments, payload, { query: "?unused=1" })).status, 400);
    assert.equal(h.calls.length, 0);
  }
});

test("invalid JSON, UTF-8 and JSON media types fail before fetching", async () => {
  for (const raw of ["", "{", "null", "[]", "true", "123", '"string"', Buffer.from([0xff])]) {
    const h = harness();
    assert.equal((await h.request("POST", advance, undefined, { raw })).status, 400);
    assert.equal(h.calls.length, 0);
  }
  for (const contentType of ["", "text/plain", "application/x-www-form-urlencoded"]) {
    const h = harness();
    assert.equal((await h.request("POST", advance, {}, { headers: { "content-type": contentType } })).status, 415);
    assert.equal(h.calls.length, 0);
  }
});

test("unsupported create fields and malformed field types are rejected", async () => {
  const invalid = [{}, { map: null }, { map: [] }, { map: "map" }, { ...createPayload, admin: true }];
  for (const value of [null, true, "4", 1, 2.5, Number.MAX_SAFE_INTEGER + 1]) invalid.push({ ...createPayload, num_factions: value });
  for (const value of [null, false, "25", 0, -1, 1.5]) invalid.push({ ...createPayload, target_turns: value });
  for (const value of [42, {}, []]) invalid.push({ ...createPayload, seed: value });
  for (const payload of invalid) {
    const h = harness();
    assert.equal((await h.request("POST", collection, payload)).status, 400);
    assert.equal(h.calls.length, 0);
  }
});

test("history, advance and delete accept only their supported payload shapes", async () => {
  for (const payload of [{}, { faction_name: "" }, { faction_name: 1 },
    { faction_name: "Region A", length: null }, { faction_name: "Region A", length: "unlimited" },
    { faction_name: "Region A", model: "other" }]) {
    const h = harness();
    assert.equal((await h.request("POST", history, payload)).status, 400);
    assert.equal(h.calls.length, 0);
  }
  for (const [method, segments, payload] of [["POST", advance, { turns: 100 }], ["DELETE", session, {}]]) {
    const h = harness();
    assert.equal((await h.request(method, segments, payload)).status, 400);
    assert.equal(h.calls.length, 0);
  }
});

test("declared and actual 8 MiB request limits and body-read failures are preserved", async () => {
  for (const options of [{ headers: { "content-length": String(maxBytes + 1) } }, { raw: " ".repeat(maxBytes + 1) }]) {
    const h = harness();
    assert.equal((await h.request("POST", advance, {}, options)).status, 413);
    assert.equal(h.calls.length, 0);
  }
  const h = harness();
  assert.equal((await h.request("POST", advance, {}, { failRead: true })).status, 400);
  assert.equal(h.calls.length, 0);
});

test("existing create and history rate limits still stop the seventh request", async () => {
  for (const [segments, payload, status] of [[collection, createPayload, 201], [history, { faction_name: "Region A" }, 200]]) {
    const h = harness();
    for (let i = 0; i < 6; i += 1) assert.equal((await h.request("POST", segments, payload)).status, status);
    const response = await h.request("POST", segments, payload);
    assert.equal(response.status, 429);
    assert.ok(Number(response.headers.get("retry-after")) > 0);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.equal(h.calls.length, 6);
  }
});

test("browser credentials are not forwarded and absent proxy configuration is unchanged", async () => {
  const h = harness();
  await h.request("GET", session, undefined, { headers: {
    authorization: "test-browser-auth", cookie: "test-cookie=value", "x-clashvergence-proxy-secret": "browser-spoof"
  } });
  assert.deepEqual(Object.keys(h.calls[0].init.headers), ["x-clashvergence-proxy-secret"]);
  assert.equal(h.calls[0].init.headers["x-clashvergence-proxy-secret"], "test-only-placeholder");
  const optional = harness({ env: { CLASHVERGENCE_DEMO_PROXY_SECRET: "" } });
  await optional.request("GET", session);
  assert.equal(optional.calls[0].init.headers["x-clashvergence-proxy-secret"], undefined);
  for (const url of ["", "invalid-url", "http://backend.invalid", "https://user:placeholder@backend.invalid"]) {
    const unconfigured = harness({ env: { CLASHVERGENCE_API_URL: url } });
    assert.equal((await unconfigured.request("GET", session)).status, 503);
    assert.equal(unconfigured.calls.length, 0);
  }
});

test("upstream failures, statuses and the 90 second timeout retain their behavior", async () => {
  const failure = harness({ upstream: async () => { throw new Error("synthetic failure"); } });
  assert.equal((await failure.request("GET", session)).status, 502);
  assert.equal(failure.cleared.length, 1);
  const missing = harness({ upstream: async () => new Response('{"error":"expired"}', { status: 404 }) });
  const response = await missing.request("DELETE", session);
  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), { error: "expired" });
  const timeout = harness({ immediateTimeout: true, upstream: async (_url, init) => {
    await Promise.resolve();
    assert.equal(init.signal.aborted, true);
    const error = new Error("synthetic timeout");
    error.name = "AbortError";
    throw error;
  } });
  assert.equal((await timeout.request("GET", session)).status, 504);
  assert.deepEqual(timeout.timers, [90_000]);
  assert.equal(timeout.cleared.length, 1);
});

