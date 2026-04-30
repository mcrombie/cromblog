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
