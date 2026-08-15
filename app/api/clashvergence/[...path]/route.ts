import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_REQUEST_BYTES = 8 * 1024 * 1024;
const REQUEST_TIMEOUT_MS = 90_000;
const MAX_RATE_BUCKETS = 10_000;

type RatePolicy = {
  name: string;
  limit: number;
  windowMs: number;
};

type RateBucket = {
  count: number;
  expiresAt: number;
};

const RATE_POLICIES: Record<string, RatePolicy> = {
  create: { name: "create", limit: 6, windowMs: 10 * 60_000 },
  advance: { name: "advance", limit: 480, windowMs: 60_000 },
  history: { name: "history", limit: 6, windowMs: 60 * 60_000 },
  standard: { name: "standard", limit: 240, windowMs: 60_000 }
};

const rateBuckets = new Map<string, RateBucket>();

type RouteContext = {
  params: { path: string[] };
};

function clientIdentity(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",", 1)[0];
  const candidate = request.ip || request.headers.get("x-real-ip") || forwardedFor;
  return (candidate?.trim() || "unknown").slice(0, 128);
}

function ratePolicy(method: string, path: string[]): RatePolicy {
  if (method === "POST" && path.length === 2) return RATE_POLICIES.create;
  if (method === "POST" && path.at(-1) === "advance") return RATE_POLICIES.advance;
  if (method === "POST" && path.at(-1) === "history") return RATE_POLICIES.history;
  return RATE_POLICIES.standard;
}

function enforceRateLimit(
  request: NextRequest,
  path: string[]
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const policy = ratePolicy(request.method, path);
  const key = `${policy.name}:${clientIdentity(request)}`;
  let bucket = rateBuckets.get(key);

  if (bucket && now >= bucket.expiresAt) {
    rateBuckets.delete(key);
    bucket = undefined;
  }

  if (!bucket && rateBuckets.size >= MAX_RATE_BUCKETS) {
    rateBuckets.forEach((candidate, candidateKey) => {
      if (now >= candidate.expiresAt) rateBuckets.delete(candidateKey);
    });
    if (rateBuckets.size >= MAX_RATE_BUCKETS) {
      return { allowed: false, retryAfterSeconds: 60 };
    }
  }

  if (!bucket) {
    rateBuckets.set(key, {
      count: 1,
      expiresAt: now + policy.windowMs
    });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= policy.limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((bucket.expiresAt - now) / 1_000)
      )
    };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

function backendBaseUrl(): URL | null {
  const rawUrl = process.env.CLASHVERGENCE_API_URL?.trim();
  if (!rawUrl) return null;

  try {
    const url = new URL(rawUrl);
    const isLocalHttp =
      url.protocol === "http:" &&
      (url.hostname === "127.0.0.1" || url.hostname === "localhost");
    if (url.username || url.password || (url.protocol !== "https:" && !isLocalHttp)) {
      return null;
    }
    return url;
  } catch {
    return null;
  }
}

function backendRequestUrl(baseUrl: URL, path: string[], requestUrl: URL): URL | null {
  if (path.length < 2 || path[0] !== "demo" || path[1] !== "sessions") {
    return null;
  }

  const basePath = baseUrl.pathname.endsWith("/")
    ? baseUrl.pathname
    : `${baseUrl.pathname}/`;
  const encodedPath = path.map(encodeURIComponent).join("/");
  const target = new URL(baseUrl);
  target.pathname = `${basePath}${encodedPath}`.replace(/\/{2,}/g, "/");
  target.search = requestUrl.search;
  return target;
}

async function proxy(request: NextRequest, context: RouteContext) {
  const baseUrl = backendBaseUrl();
  if (!baseUrl) {
    return NextResponse.json(
      { error: "The Clashvergence demo service is not configured." },
      { status: 503 }
    );
  }

  const target = backendRequestUrl(baseUrl, context.params.path, request.nextUrl);
  if (!target) {
    return NextResponse.json({ error: "Unknown demo endpoint." }, { status: 404 });
  }

  const rateLimit = enforceRateLimit(request, context.params.path);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many demo requests. Please wait and try again." },
      {
        status: 429,
        headers: {
          "cache-control": "no-store",
          "retry-after": String(rateLimit.retryAfterSeconds)
        }
      }
    );
  }

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(declaredLength) && declaredLength > MAX_REQUEST_BYTES) {
    return NextResponse.json({ error: "Demo request is too large." }, { status: 413 });
  }

  let body: ArrayBuffer | undefined;
  if (request.method !== "GET" && request.method !== "HEAD") {
    body = await request.arrayBuffer();
    if (body.byteLength > MAX_REQUEST_BYTES) {
      return NextResponse.json({ error: "Demo request is too large." }, { status: 413 });
    }
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const forwardHeaders: Record<string, string> = {};
    if (body) {
      forwardHeaders["content-type"] =
        request.headers.get("content-type") ?? "application/json";
    }
    const proxySecret = process.env.CLASHVERGENCE_DEMO_PROXY_SECRET?.trim();
    if (proxySecret) {
      forwardHeaders["x-clashvergence-proxy-secret"] = proxySecret;
    }

    const response = await fetch(target, {
      method: request.method,
      body,
      headers: forwardHeaders,
      cache: "no-store",
      signal: controller.signal
    });
    const responseBody = await response.arrayBuffer();
    const responseHeaders = new Headers();
    responseHeaders.set(
      "content-type",
      response.headers.get("content-type") ?? "application/json; charset=utf-8"
    );
    const requestId = response.headers.get("x-request-id");
    if (requestId) responseHeaders.set("x-request-id", requestId);
    responseHeaders.set("cache-control", "no-store");

    return new NextResponse(responseBody, {
      status: response.status,
      headers: responseHeaders
    });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "AbortError";
    return NextResponse.json(
      {
        error: timedOut
          ? "The Clashvergence service took too long to respond."
          : "The Clashvergence service is unavailable."
      },
      { status: timedOut ? 504 : 502 }
    );
  } finally {
    clearTimeout(timeout);
  }
}

export function GET(request: NextRequest, context: RouteContext) {
  return proxy(request, context);
}

export function POST(request: NextRequest, context: RouteContext) {
  return proxy(request, context);
}

export function DELETE(request: NextRequest, context: RouteContext) {
  return proxy(request, context);
}
