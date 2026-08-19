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

The `/art` route publishes a curated selection from `content/art.ts`, where its
two gallery groupings and reviewed image descriptions are kept separate from
the decorative semantics in the asset manifest. Gallery images use the cleaned
PNGs through Next Image; original phone photographs remain private.

After adding or replacing a cleaned monochrome PNG, normalize its line darkness
into real alpha and then build the checkerboard QA sheet:

```bash
npm run doodles:prepare
npm run doodles:review
```

The review command checks the complete catalog, including the eight restrained
starter assets and the experimental Doodle Workshop cast, for transparency, clear
corners, manifest dimensions, and file size. It writes its contact sheet to the
workspace `.tmp` directory rather than shipping it with the site.

The `Doodle Workshop` vibe is the final entry in `lib/vibes.ts` and the default
for visitors without a saved preference, so cycling forward from it reaches
Professional. It uses the less-formal characters as a restrained working-notebook layer.
Ambient art is mounted inside `SiteShell`, so it never leaks into standalone
apps or viewers. The floating vibe control steps in either direction; the
native picker remains available wherever the inline control is mounted. Keep
new Workshop art deterministic and cataloged rather than choosing it randomly at
render time.

## Blog Style

Keep Cromblog posts visually uniform:

- Use the `Cromblog` eyebrow above the title.
- Use a large serif `h1` for the post title.
- The first metadata line under the title should match the standard post format: `Original date · estimated read time`.
- If a post has updates, show the latest update on its own second metadata line: `Updated Month Day, Year`.
- Do not show the full internal update history on the public post page.
- Keep body copy inside the existing `article-prose` treatment.
- Place figures between prose sections when they support the surrounding text.
- Preserve existing media dimensions, captions, and animation behavior unless a post specifically calls for a media change.
- Use concise, descriptive figure captions that explain what the reader is seeing.
