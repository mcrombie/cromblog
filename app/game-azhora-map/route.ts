// The Azhora world map as the game draws it, fully revealed, at /game-azhora-map.
// (The older World Builder map is a separate static bundle at /world-builder-azhora-map.)
//
// Nothing of the map lives in this site. The page is a shell: the chart, its lettering, the map code and its
// stylesheet are the game's own files (github.com/mcrombie/azhora-game), served by jsDelivr from the latest
// commit on the game's main branch. The commit is looked up at most every five minutes, so a change pushed to
// the game reaches this page within minutes, with no deploy here.
//
// The shell's <base> points at that commit, so the relative paths the game's code already uses
// (./assets/azhora-world-map.svg, ./src/...) resolve to the game's files. Links back to this site are absolute.

const REPO = "mcrombie/azhora-game";
const SITE = "https://www.mcrombie.com";

/** How often, in seconds, the page looks for a newer commit of the game. */
export const revalidate = 300;

const COMMIT = /^[0-9a-f]{40}$/;

/** The latest commit on the game's main branch, or "main" if GitHub cannot be asked. */
async function latestCommit(): Promise<string> {
  try {
    const response = await fetch(`https://api.github.com/repos/${REPO}/commits/main`, {
      headers: { Accept: "application/vnd.github.sha", "User-Agent": "mcrombie.com game-azhora-map" },
      next: { revalidate },
    });
    if (response.ok) {
      const sha = (await response.text()).trim();
      if (COMMIT.test(sha)) return sha;
    }
  } catch {}
  // The git protocol's ref listing is not rate-limited the way the REST API is.
  try {
    const response = await fetch(`https://github.com/${REPO}.git/info/refs?service=git-upload-pack`, { next: { revalidate } });
    if (response.ok) {
      const match = (await response.text()).match(/([0-9a-f]{40}) refs\/heads\/main\b/);
      if (match) return match[1];
    }
  } catch {}
  return "main";
}

function page(commit: string): string {
  const base = `https://cdn.jsdelivr.net/gh/${REPO}@${commit}/`;
  const short = COMMIT.test(commit) ? commit.slice(0, 7) : "main";
  const commitLink = `https://github.com/${REPO}/${COMMIT.test(commit) ? `commit/${commit}` : "tree/main"}`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Azhora — the map</title>
<meta name="description" content="The whole chart of Azhora, fully revealed, drawn live from the latest version of the game.">
<meta property="og:title" content="Azhora — the map">
<meta property="og:description" content="The whole chart of Azhora, fully revealed, drawn live from the latest version of the game.">
<meta property="og:url" content="${SITE}/game-azhora-map">
<link rel="canonical" href="${SITE}/game-azhora-map">
<link rel="icon" href="${SITE}/favicon.ico">
<base href="${base}">
<link rel="stylesheet" href="src/world-map.css">
<style>
  /* The game draws its place names in "Adventure", which it maps to Georgia (src/style.css). */
  @font-face { font-family: Adventure; src: local("Georgia"); }
  * { box-sizing: border-box; }
  html, body { margin: 0; height: 100%; }
  body { background: #1d1711; color: #f7e6bf; font-family: "Segoe UI", system-ui, sans-serif; }
  #world-map { height: 100vh; height: 100dvh; padding: 18px 22px 14px; }
  .map-head { display: flex; align-items: baseline; gap: 14px; flex: none; margin-bottom: 12px; }
  .map-head h1 { margin: 0; font: 600 26px Georgia, "Palatino Linotype", serif; letter-spacing: .02em; color: #f7e6bf; }
  .map-head .eyebrow { font-size: 11px; letter-spacing: .18em; text-transform: uppercase; color: #c9b27e; }
  .map-head .spacer { flex: 1; }
  .map-head a { color: #d8c48f; font-size: 12px; text-decoration: none; }
  .map-head a:hover { text-decoration: underline; }
  /* There is no traveler on this chart. */
  #atlas-traveler-button { display: none; }
  #world-map .atlas-caption a { color: #e7d29b; }
  @media (max-width: 640px) {
    #world-map { padding: 10px 10px 8px; }
    .map-head h1 { font-size: 20px; }
    .map-head .eyebrow { display: none; }
    #world-map .atlas-help { display: none; }
  }
</style>
</head>
<body>
<main id="world-map">
  <header class="map-head">
    <span class="eyebrow">A traveler's chart</span>
    <h1>Azhora</h1>
    <span class="spacer"></span>
    <a href="${SITE}/">mcrombie.com</a>
  </header>
  <div class="atlas-toolbar" role="group" aria-label="Map controls"><button id="atlas-fit" disabled>Whole map</button><button id="atlas-izol" disabled>Drent</button><button id="atlas-traveler-button" disabled>Where I am</button><span class="atlas-spacer"></span><button id="atlas-out" class="atlas-zoom-button" aria-label="Zoom out" disabled>&minus;</button><output id="atlas-zoom" aria-label="Map zoom">100%</output><button id="atlas-in" class="atlas-zoom-button" aria-label="Zoom in" disabled>+</button></div>
  <div id="atlas-viewport" tabindex="0" role="region" aria-label="Azhora world map. Arrow keys pan; plus and minus zoom; Home shows the whole map."><img id="atlas-image" alt="The chart of Azhora drawn from the World Builder map, with terrain, region names, boundaries and rivers" draggable="false"><div id="atlas-traveler" hidden aria-label="You are here"><b hidden></b><i></i><span>You are here</span></div><div id="atlas-loading" role="status">Opening the atlas...</div></div>
  <p class="atlas-help">Scroll or pinch to zoom &middot; Drag to explore &middot; Arrow keys pan &middot; Home shows the whole map</p>
  <p class="atlas-caption">The whole chart, fully revealed, drawn by the game's own map from its latest version (<a href="${commitLink}">${short}</a>).</p>
</main>
<script type="module">
  // The game's own modules, at the same commit as the chart.
  import { createWorldMap } from "./src/world-map.js";
  import { SUBREGIONS } from "./src/map-fog.js";
  import { atlasRevealedCityMarks } from "./src/world-map-detail.js";
  import { TRANSFORM } from "./src/region-world.js";
  const map = createWorldMap();
  // What the game's chart shows with its fog lifted: every region named, every named area and city marked.
  const areas = SUBREGIONS.map(area => ({ id: area.id, name: area.name, kind: "area", ...TRANSFORM.worldToAtlas(area.x, area.z) }));
  map.setChart({ reveal: true, status: [], marks: [...atlasRevealedCityMarks({ sevron: true }), ...areas] });
  map.open();
  window.azhoraMap = map;
</script>
</body>
</html>
`;
}

export async function GET() {
  const commit = await latestCommit();
  return new Response(page(commit), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": `public, s-maxage=${revalidate}, stale-while-revalidate=86400`,
    },
  });
}
