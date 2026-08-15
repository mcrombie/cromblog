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
