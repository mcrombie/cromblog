# Cromblog

Cromblog is Michael Crombie's personal site for essays, projects, and project notes. It is built with Next.js, React, TypeScript, and Tailwind CSS.

## Development

Install dependencies:

```bash
npm install
```

Run the local development server:

```bash
npm run dev
```

Build the production site:

```bash
npm run build
```

For a non-Vercel deployment, set `NEXT_PUBLIC_SITE_URL` to the canonical site
origin so Open Graph and social-preview image URLs resolve correctly.

Archivist is hosted separately because its Python service uses a private
full-manuscript retrieval index. Once its public deployment is verified, set:

```text
NEXT_PUBLIC_ARCHIVIST_URL=https://your-archivist-service.example
```

Without that variable, Cromblog labels Archivist as deployment-ready and links
the featured panel to its entry on the Projects page. With a valid HTTPS URL,
the featured panel and project entry expose the live demo. Do not guess or
hard-code a deployment address.

Clashvergence's browser interface is served with the World Builder bundle, but
its simulations and AI-written histories run in a separate Python service. Set
the server-only backend origin before deploying Cromblog:

```text
CLASHVERGENCE_API_URL=https://your-clashvergence-service.example
CLASHVERGENCE_DEMO_PROXY_SECRET=a-long-random-server-only-value
```

The browser calls Cromblog's same-origin `/api/clashvergence` proxy. Keep
`OPENAI_API_KEY` in the Python service only; it is not a Cromblog environment
variable and must not be prefixed with `NEXT_PUBLIC_`.
The proxy applies best-effort per-process limits to session creation, turns,
histories, and observer requests, and it never forwards a browser-controlled
client identity to the Python service. Also apply durable per-client limits to
`/api/clashvergence` at the hosting edge: warm-instance counters reset and do
not coordinate across horizontally scaled site instances.

## Blog Content

Blog metadata lives in `content/blog.ts`. Each post should have a stable slug, title, href, original publication date, estimated read time, and summary.

Use `updateDates` to track every meaningful update internally:

```ts
updateDates: ["April 30th, 2026"]
```

Keep dates ordered from oldest to newest. Blog post pages should display only the original publication date and the most recent update date.

## Doodle Assets

Approved transparent artwork lives in `public/cromblog/doodles`, with dimensions,
placements, semantics, tags, and source provenance recorded in
`content/doodles.ts`. Route-level pilot compositions live in
`content/doodle-designs.ts`; the shared `DoodleArt` component validates every
configured placement against the asset catalog. Keep the original notebook
photographs outside `public`.

The restored `/art` route is **Doodle Lab**. Its default **Showcase** tab
opens with twelve hand-picked originals and six
scenes; **Drawings** and **Experiments** retain the full collections. The
selection is maintained in `content/doodle-showcase.selection.json`; run
`node scripts/build-doodle-showcase.cjs` after editing it, and use `--check`
to verify its lightweight generated metadata. The full catalog in
`content/doodle-catalog.ts` includes every published extraction, with selected,
texture, archive and all-drawings views, batch/subject filters, search and full-size
previews. The earlier reviewed descriptions in `content/art.ts` remain intact.
The **Experiments** tab (`/art#experiments`) presents composed artwork with image
previews and full-size links. Add each new composition to
`content/doodle-experiments.ts` and copy its selected PNG into
`public/cromblog/doodle-experiments/round-NN/`. Keep generation prompts and source
provenance in `art-source/doodle-lab-compositions/`, outside the public bundle.
Larger experiment sets have a visitor-safe JSON catalog under
`content/doodle-experiment-batches/`, imported by the shared catalog. Round 03
adds twenty varied scenes using 102 cataloged doodles, while retaining the first
eight experiments. Their source-usage index and exact prompts are kept privately
with the selected PNGs in `art-source/doodle-lab-compositions/round-03/`.
Round 04 adds twenty more scenes made from 101 distinct doodles in the
June 2025–January 2026 intake, bringing Experiments to 48 images. Its unchanged
PNGs, exact prompts, source-usage manifest and downloadable ZIP are in
`art-source/doodle-lab-compositions/round-04/`.
Round 05 adds five scenes using 17 carefully selected curated drawings across
three notebook collections, bringing Experiments to 53 images. All 48 earlier
experiments and all 631 catalog drawings are preserved. Its source selection
reasons, exact prompts, unchanged PNGs and ZIP are kept in
`art-source/doodle-lab-compositions/round-05/`.
Round 06 adds three wide landscape panoramas, each bringing twelve curated
doodles together across foreground, middle ground and distance. The set uses
36 distinct source drawings and brings Experiments to 56 images, preserving
the prior 53 experiments and all 631 drawings. Original 1774 x 887 PNGs,
source-by-source visual review notes, exact prompts and the ZIP are kept in
`art-source/doodle-lab-compositions/round-06/`.
New batch metadata lives in `content/doodle-batches/`; original phone photographs
and full-resolution masters stay outside `public`. The repeatable intake,
provenance and review workflow is documented in `art-source/DOODLE-LAB.md`.
The June 2025–January 2026 batch contains 367 extracted samples from 305 reviewed
photos: 178 curated drawings, 137 textures and 52 archived studies. Its private
page index and held-drawing inventory are in
`art-source/2025-06-2026-01/REVIEW.md`.

After adding or replacing a cleaned monochrome PNG, normalize its line darkness
into real alpha and then build the checkerboard QA sheet:

```bash
npm run doodles:prepare
npm run doodles:review
```

The legacy review command checks the original thirteen notebook assets for
transparency, clear corners, manifest dimensions, and file size. It writes its
contact sheet to the workspace `.tmp` directory rather than shipping it with the
site. New batches use `scripts/doodle_batch.py` and its source, master, and catalog
checks described in the Doodle Lab guide.

The `Doodle Lab` vibe is a single design, **Field Notebook**: warm dotted paper
with a field of original notebook doodles behind the panels (denser at the page
edges, fading under the content), handwritten annotations, and every content
image presented as a matted print. Deterministic, cataloged originals supply
the home hero (the Common Flicker climbing the page edge beside the title), a
route-specific sidebar specimen and heading mark, and page-foot compositions of
intact leaf and tree drawings; no drawing appears twice on one screen. Drawings
sketch in as they arrive and the field drifts a little on scroll, both disabled
under `prefers-reduced-motion`. Art and standalone apps omit ambient
decorations. The floating vibe control can be dismissed and restored from the
sidebar. The retired design switch's `?doodle-design=` links still open the
vibe. Archived studies remain browseable in Art, and the Future GIF experiments
have their own collection tab.

The small `content/doodle-vibe.ts` registry keeps the full art catalog out of the
shared layout; it maps routes to specimens, marks and foot compositions. After
changing `content/doodle-vibe-assets.json`, run `npm run doodles:vibe` to rebuild
the original-alpha PNG derivatives, delete any PNG the registry no longer lists,
and run `npm run doodles:vibe:check` to verify them. See the
[Doodle Lab guide](art-source/DOODLE-LAB.md) and
[design implementation notes](art-source/doodle-vibe-redesign/IMPLEMENTATION.md).

## Blog Style

Keep Cromblog posts visually uniform:

- Preserve supplied author wording and paragraph structure. Correct only clear spelling, grammar, or factual errors; do not paraphrase, soften, expand, or rewrite sound prose without an explicit request. Keep quoted prompts verbatim.
- Use the `Cromblog` eyebrow above the title.
- Use a large serif `h1` for the post title.
- The first metadata line under the title should match the standard post format: `Original date · estimated read time`.
- If a post has updates, show the latest update on its own second metadata line: `Updated Month Day, Year`.
- Do not show the full internal update history on the public post page.
- Keep body copy inside the existing `article-prose` treatment.
- Place figures between prose sections when they support the surrounding text.
- Preserve existing media dimensions, captions, and animation behavior unless a post specifically calls for a media change.
- Use concise, descriptive figure captions that explain what the reader is seeing.
