# Bounded Next.js security upgrade — November 4, 2026

Local candidate only. No commit, push, deployment, production-branch change,
content edit, or Azhora game change is part of this review.

## Recommendation

Upgrade directly from Next.js 13.4.19 to **16.4.5**, with React/React DOM
**19.3.1** and Node **24.22.2** (supported 24.x LTS).
Next 16 requires Node >=20.9; this project deliberately selects a supported LTS
line rather than its oldest technically compatible runtime. The local portable
runtime was checked against Node's published SHA256 manifest; the machine's
global Node installation was not changed.

Next 16 is Active LTS. Next 15's extended security support ends January 31,
2027; using it as an intermediate step would create another near-term upgrade.
The direct migration builds without architectural changes. Version 16.4.5 is
the stable November 3 security release, rather than a historical minimum patch.

Sources:
- https://nextjs.org/support-policy
- https://github.com/vercel/next.js/releases/tag/v16.4.5
- https://nextjs.org/docs/app/guides/upgrading/version-16
- https://github.com/nodejs/Release
- https://nodejs.org/dist/v24.22.2/SHASUMS256.txt

## Inventory and changes

The site uses App Router server-rendered/static pages, client components for
interactive controls, local images, a Google font fetched during builds,
Tailwind 3, and separately hosted or static embedded applications. There are no
Server Actions and no application calls requiring conversion of synchronous
`cookies()`, `headers()`, or page `searchParams`. The only asynchronous route
parameter conversion is the Clashvergence catch-all API.

- `package.json`, `package-lock.json`: pin Next 16.4.5 and React 19.3.1; align
  React/Node types and Next's lint configuration; declare the Node 24 runtime;
  replace removed `next lint` with the ESLint CLI; add route-aware type checking.
  Move existing patched Sharp 0.35.5 into production dependencies so image
  optimization does not depend on installing development packages. Refresh
  compatible transitive security fixes, without forced major overrides.
- `.eslintrc.json` -> `eslint.config.mjs`: use Next's flat Core Web Vitals
  configuration. No rules were disabled to obtain passing checks.
- `middleware.ts` -> `proxy.ts`: adopt Next 16's Node-runtime proxy convention.
  Preserve the matcher and production draft policy: uncached, unindexed 404s
  before rendering, including draft descendants. Existing page-level guards
  and the local-only preview policy are unchanged.
- `app/api/clashvergence/[...path]/route.ts`: await promised parameters and
  replace removed `NextRequest.ip` with the existing hosting-edge IP headers.
  Preserve method/path/query allowlists, validation, request-size limits,
  per-process throttling, secret handling, timeout and no-store behavior.
- `scripts/test-clashvergence-proxy.cjs`: supply the new promised parameters.
- `scripts/test-draft-proxy.cjs`: add synthetic production/development draft
  tests and actual framework matcher checks, without real draft material.
- `next-env.d.ts`, `tsconfig.json`: Next-generated route/root-parameter types
  and React's automatic JSX runtime.
- `components/vibe-cycle-button.tsx`: subscribe to the existing document/event
  appearance store with React's external-store hook, preserving hydration,
  persistence, storage events and synchronized controls.
- `app/cromblog/an-auspicious-august/sunflower-bloom.tsx`: read motion preference
  through an external-store subscription, preserving pause/replay and explicit
  playback under reduced motion.
- `components/living-garden.tsx`: stop playback in preference/timer callbacks
  rather than synchronously in effects. This retained component is currently
  unmounted; `/art/garden` already redirects to the Slow Garden appearance.
- `app/cromblog/simulating-civilizations-iii/viewer/page.tsx`: store the visible
  drag cursor state in React state instead of reading a ref during rendering.
- `README.md` and this review: runtime, check commands and release limitations.

No changes to `next.config.js`, CSS, content data, public assets, iframe
destinations, or the map endpoint. The map retains its five-minute ISR schedule.
Next's current image defaults remain in place: local image optimization works
and unconfigured remote image sources remain rejected. Its default minimum
image cache TTL is now four hours, rather than the old sixty seconds; image
replacement at the same URL can therefore remain cached longer.

## Verification

Tests used Node 24.22.2 and the production build on localhost, not production.

| Check | Result |
| --- | --- |
| `npm run lint` | Pass, zero errors/warnings |
| `npm run typecheck` | Pass |
| `npm run build` | Pass; Turbopack, all 50 pages generated; API dynamic, map ISR 5m |
| `node scripts/test-clashvergence-proxy.cjs` | 12 tests pass; mocked upstream, all five operations, validation and rate limits |
| `node scripts/test-draft-proxy.cjs` | 4 tests pass, including multiple request variants |
| `node scripts/test-vibe-initializer.cjs` | Pass |
| `node scripts/test-living-garden.cjs` | Pass; model-level tests, not a mounted component browser test |
| Synthetic draft fixture on real Next servers | 23 HTTP assertions pass: production denies, development allows |
| Fresh-profile headless Chrome 156 | 33 assertions pass; desktop/narrow rendering, project links/metadata, client blog routing and sorting, art tabs, appearance persistence, animation/motion controls, viewer cursor, embed HTML, image optimization and API rejections |
| `npm audit --omit=dev` | Zero vulnerabilities |
| Full `npm audit` | 16 moderate package findings, all development-only; one underlying minimatch advisory |
| `npm ls --depth=0` | Clean dependency tree; no invalid peers |

The draft HTTP fixture copied the actual proxy/helper and used synthetic
metadata and content. Production checks covered direct requests, trailing
slashes, descendants, preview queries, RSC requests, forged middleware bypass
headers and encoded paths. No private content or credentials were needed.
Both final fixture builds used Turbopack; an initial fixture location inside
`node_modules` was not processed as application source. Moving this disposable
fixture into the ignored build directory resolved that test setup issue.

Browser JavaScript/hydration errors: none. The strict network-error collector
still exits nonzero because it retains these observations rather than hiding
them:
- `/favicon.ico` returns 404 (pre-existing, also recorded in the prior review).
- The older civilization viewer's unchanged external
  `Clashvergence/main/reports/runs/azhora_sc4_live/sim_world.json` URL returns
  404. Viewer interaction works, but that data feed remains unavailable.
- The YouTube embed request was canceled when automated navigation left the
  article; it was not a site runtime failure.

Screenshots and detailed JSON/audit results are local, ignored files under
`node_modules/.cache/next-security-review`. Embedded-app HTML and static bundle
delivery were checked; this was not a full game playthrough or a live
Clashvergence simulation against production credentials.

## Security findings and remaining limits

The candidate removes the production dependency findings associated with the
unsupported Next 13 installation, including the high-severity RSC DoS
advisories [GHSA-mwv6-3258-q52c](https://github.com/vercel/next.js/security/advisories/GHSA-mwv6-3258-q52c)
and [GHSA-5j59-xgg2-r9c4](https://github.com/vercel/next.js/security/advisories/GHSA-5j59-xgg2-r9c4).
It also includes the November 3 Next security fixes. Compatible transitive
updates clear the reported source-map-js, baseline-browser-mapping,
browserslist, brace-expansion and selector-parser findings. A clean dependency
audit is evidence of known-advisory coverage, not proof of absolute security.

Two development-tooling debts remain explicit:

1. **Minimatch DoS, moderate**: CVE-2026-118764 /
   [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249).
   npm reports 16 affected packages through dependency propagation, not 16
   independent flaws. Installed minimatch 10.2.6 under typescript-eslint is
   affected; npm also flags the 3.1.5 lint tree, although the GitHub advisory's
   stated affected range starts at 7.0.0. The patched release is 11.0.1, outside
   these consumers' compatible ranges. These parse local lint/configuration
   inputs, not public HTTP requests, and are absent from the production
   dependency graph. Do not force a major override or the audit tool's proposed
   downgrade to ESLint 4. Follow up when upstream consumers support the fix.
2. **ESLint 9.39.5 is end-of-life**. ESLint 10.14.0 was tested but Next's current
   import, React and accessibility plugins still declare peers only through 9.
   The candidate keeps the latest compatible 9 release rather than accepting
   invalid peer dependencies or dropping rules/plugins. This is local/build
   tooling, not the deployed Next runtime. See
   https://eslint.org/version-support/ .

No architectural migration remains. Before any release, allow roughly 30–60
minutes for an authorized Vercel preview, confirmation of its actual patched
Node 24 runtime, draft rejection, image delivery, configured backend behavior
and ordinary navigation. Hosting-specific behavior and production credentials
have not been exercised locally. A separate tooling follow-up may require a
small compatibility update once upstream dependencies are ready; its timing
depends on those releases. The current production site remains unchanged and
does not receive these fixes until a separately authorized deployment.
