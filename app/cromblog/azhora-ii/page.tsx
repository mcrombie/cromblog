import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { blogPosts, isDraftPost, type BlogPost } from "@/content/blog";
import { canPreviewDrafts } from "../draft-preview";

import styles from "./post.module.css";

const post: BlogPost = blogPosts["azhora-ii"];
// A draft is only shown in local development; a production build 404s it without leaking its title.
const hidden = isDraftPost(post) && !canPreviewDrafts();

const repo = "https://github.com/mcrombie/azhora-game/blob/main";

export function generateMetadata(): Metadata {
  if (hidden) return {};
  const image = post.image;
  return {
    title: isDraftPost(post) ? `${post.title} (draft)` : post.title,
    description: post.summary,
    alternates: { canonical: post.href },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary,
      publishedTime: isDraftPost(post) ? undefined : new Date(post.date).toISOString(),
      images: image ? [{ url: image.src, width: image.width, height: image.height, alt: image.alt }] : undefined
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: image ? [image.src] : undefined
    }
  };
}

type VideoProps = {
  id: string;
  videoId: string;
  title: string;
};

// The same lazy YouTube figure as the first Azhora post: nothing loads until the reader scrolls to it.
function Video({ id, videoId, title }: VideoProps) {
  const captionId = `${id}-caption`;
  return (
    <figure id={id} className={styles.videoFigure}>
      <div className={styles.videoFrame}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0`}
          title={title}
          aria-describedby={captionId}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      <figcaption id={captionId}>
        <span>{title}</span>
        <a href={`https://www.youtube.com/watch?v=${videoId}`}>Watch on YouTube</a>
      </figcaption>
    </figure>
  );
}

type LayoutRow = {
  location: string;
  responsibility: string;
  startingPoints: { label: string; path: string }[];
};

const layoutRows: LayoutRow[] = [
  {
    location: "src/app/",
    responsibility: "Startup choices, game mode, save validation and migration",
    startingPoints: [
      { label: "startup", path: "src/app/startup/startup.js" },
      { label: "save validation", path: "src/app/saves/road-checkpoint.js" }
    ]
  },
  {
    location: "src/content/chapters/",
    responsibility: "Authored main story, objectives and encounters",
    startingPoints: [{ label: "Chapter 1", path: "src/content/chapters/chapter-one/chapter-one.js" }]
  },
  {
    location: "src/content/quests/",
    responsibility: "Particular side quests, named characters and their local scenery",
    startingPoints: [{ label: "Kayla", path: "src/content/quests/kayla/kayla.js" }]
  },
  {
    location: "src/content/regions/",
    responsibility: "Actual settlements, terrain adjustments, residents and wildlife, grouped by place",
    startingPoints: [{ label: "Solis and West Suval", path: "src/content/regions/solis/west-suval-world.js" }]
  },
  {
    location: "src/content/characters/",
    responsibility: "Shared authored character definitions and cast",
    startingPoints: [{ label: "playable characters", path: "src/content/characters/player-characters.js" }]
  },
  {
    location: "src/gameplay/",
    responsibility: "Reusable combat, movement, inventory, skills, company and quest behavior",
    startingPoints: [
      { label: "combat", path: "src/gameplay/combat/combat.js" },
      { label: "skills", path: "src/gameplay/skills/skills.js" }
    ]
  },
  {
    location: "src/world/",
    responsibility: "Terrain machinery, collision, loading, scenery helpers and environment",
    startingPoints: [{ label: "region loading", path: "src/world/loading/region-loading.js" }]
  },
  {
    location: "src/ui/",
    responsibility: "Maps, journal, dialogue controls, skill panels and interface styles",
    startingPoints: [{ label: "ordinary M map", path: "src/ui/map/world-map.js" }]
  },
  {
    location: "src/dev/",
    responsibility: "Developer controls and native runtime verification",
    startingPoints: [{ label: "Chapter 1 checks", path: "src/dev/checks/chapter-one-smoke.js" }]
  },
  {
    location: "src/experiments/",
    responsibility: "Integrated but explicitly experimental scenes and systems",
    startingPoints: [
      { label: "frontier experiment", path: "src/experiments/frontier-command/strategic-prototype.js" }
    ]
  },
  {
    location: "src/simulation/",
    responsibility: "Reserved future world core; currently documentation only",
    startingPoints: [{ label: "scope", path: "src/simulation/README.md" }]
  },
  {
    location: "tests/",
    responsibility: "Node tests, fixtures and native test helpers",
    startingPoints: [{ label: "test manifest", path: "tests/test-manifest.json" }]
  },
  {
    location: "prototypes/",
    responsibility: "Standalone prototypes",
    startingPoints: [{ label: "campaign UI", path: "prototypes/campaign/ui.js" }]
  },
  {
    location: "assets/, vendor/",
    responsibility: "Maps, fonts and data; vendored dependencies",
    startingPoints: [{ label: "faction roster", path: "assets/campaign-factions.json" }]
  },
  {
    location: "scripts/",
    responsibility: "Launching, building, exporting and test execution",
    startingPoints: [{ label: "path checker", path: "scripts/check-source-layout.mjs" }]
  }
];

export default function AzhoraIIPage() {
  if (hidden) notFound();

  return (
    <article className="content-flow">
      <Link
        href="/cromblog"
        className="inline-flex text-sm text-pine-700 underline decoration-pine-300 underline-offset-4 hover:text-pine-950"
      >
        Back to Cromblog
      </Link>

      <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel-strong)] px-6 py-10 shadow-card sm:px-8 sm:py-14">
        <div className="mx-auto max-w-[760px] content-flow">
          <header className="content-flow">
            <p className="text-xs uppercase tracking-[0.22em] text-pine-700">Cromblog</p>
            <h1 className="font-serif text-4xl text-ink sm:text-5xl">{post.title}</h1>
            {post.subtitle ? (
              <p className="font-serif text-xl italic text-pine-700 sm:text-2xl">{post.subtitle}</p>
            ) : null}
            <p className="text-sm text-pine-700/80">
              {isDraftPost(post) ? <span className="post-draft-badge">Draft · not published</span> : post.date}
              {" "}&middot; {post.readTime}
            </p>
          </header>

          <hr className="border-[color:var(--border)]" />

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>
              Having gone overboard with vibe coding{" "}
              <Link href="/cromblog/azhora-game">this game</Link>, I am trying to pull
              myself back into earth’s orbit, and what better way than to revisit two of
              the most fundamental ideas of computer science: time and space.
            </p>
            <p>
              Time concerns how much work a program does. In algorithm analysis, we often
              count basic operations rather than seconds, so we can reason about that work
              without tying the answer to one particular computer.
            </p>
            <p>
              Space concerns how much memory the program needs. The important question for
              both is how those requirements grow as the problem gets bigger. In my case,
              the problem is a continent I keep finding new things to put in.
            </p>
            <p>
              The reason I feel the need to go back to basics is that I have been in a
              frenzy of world building, bringing to pixels a world I have been tinkering
              with in my head for years. Never having expected to get to do such a thing, I
              suppose it is only natural I went overboard.
            </p>
            <p>
              I have been having ChatGPT Astra and Claude code for me most of the last
              week, prompting them on my desktop, or remotely through my phone, to keep
              them almost full-time building out this world.
            </p>
            <p>
              I drew the map approximately ten years ago, and a few months ago I used it in
              my <Link href="/projects/clashvergence-demo">Clashvergence</Link> and{" "}
              <Link href="/projects/world-builder">World Builder</Link> projects,{" "}
              <Link href="/cromblog/simulating-civilizations-iii">
                refining it with hexagonal organization and Köppen climate classification
              </Link>{" "}
              of hexes. This gave the agents a strong basis for how to shape the terrain
              and wildlife.
            </p>
            <p>
              Here is the most recent map version adapted for the game:{" "}
              {/* A plain link: the map is a standalone page outside the site's shell. */}
              <a href="/game-azhora-map">mcrombie.com/game-azhora-map</a>
            </p>
            <p>
              The game itself is live, but no promises on its current state as I am in the
              midst of developmental upheaval. You can check it out here:{" "}
              <a href="https://azhora.onrender.com">azhora.onrender.com</a> (or framed in
              this site at <Link href="/games/azhora">mcrombie.com/games/azhora</Link>).
            </p>
            <p>It may be easier to check out this demo I made.</p>
          </div>

          <Video id="demo" videoId="DL8SF_iODXE" title="Azhora — a dragon flight over Drent, Ambron and Minora" />

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>Or this quest where you help a fire wizard slay a giant spider:</p>
          </div>

          <Video id="spider" videoId="rr2HDSHFlsU" title="Azhora — Ben and the spider in the thorns" />

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>
              Or this other quest where you ride a bear in a race with a chameleon on a
              unicycle:
            </p>
          </div>

          <Video id="race" videoId="hn0k5CVNvws" title="Azhora — Kayla’s honey race" />

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>Or this more beautiful flyover of the whole continent:</p>
          </div>

          <Video id="flyover" videoId="2G9Z69i47Bw" title="Azhora — a flyover of the whole continent" />

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>Perhaps I got carried away having Claude Fable make so many videos.</p>
            <p>
              To create such high quality recordings, it ran the real game in a hidden
              browser, stopped its clock, and advanced it one sixtieth of a second at a
              time, saving a picture with each step and sending the pictures into ffmpeg to
              make a smooth 60 fps video, regardless of how slowly the game actually draws
              (which makes the quality here deceiving). For the flyover path, a script
              steered the dragon and camera along a preplanned route. For the quests, the
              game already had a computer playtest that walked through the quest without
              user input. Meanwhile, whole-page screenshots captured the dialogue and HUD.
            </p>
            <p>
              This is all well and good for a video, however, for a playable game, I need
              to track how much work it is doing and whether it is fast enough for a smooth
              playing experience.
            </p>
            <p>
              The problem now is that I have expanded both the world and the current quest
              arc without paying enough attention to the game’s fundamental architecture.
              In other words, I got sloppy. Now I am taking a step back to take stock and
              consider where I am ultimately going with the project.
            </p>
            <p>
              Looking at the directories, I found there was a lot of tidying to be done.
              Most of the source files sat together in the src directory, with little
              separation between the game’s reusable systems and the particular places,
              characters, and quests built on top of them.
            </p>

            <details className={styles.layoutDetails}>
              <summary>Here is the new design structure</summary>
              <div className={styles.layoutTableWrap}>
                <table className={styles.layoutTable}>
                  <thead>
                    <tr>
                      <th>Location</th>
                      <th>Responsibility</th>
                      <th>Starting point</th>
                    </tr>
                  </thead>
                  <tbody>
                    {layoutRows.map((row) => (
                      <tr key={row.location}>
                        <td>
                          <code>{row.location}</code>
                        </td>
                        <td>{row.responsibility}</td>
                        <td>
                          {row.startingPoints.map((point, index) => (
                            <span key={point.path}>
                              {index > 0 ? ", " : null}
                              <a href={`${repo}/${point.path}`}>{point.label}</a>
                            </span>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>

            <p>
              Going forward, I want to focus on a single, stable scenario that gives the
              player a clear path through the game and gives me a manageable place to test
              its basic systems.
            </p>
            <p>
              To do that, I am shelving most of the existing quests and skill trees. I am
              not deleting them, but I don’t want the new foundation to be constrained by
              everything I have already built. For now, I will work within a sandbox of
              about five regions, developing the core game loop and a consistent way to
              track the state of the campaign. Before expanding across the continent, I
              want to find out whether this smaller version actually supports the kind of
              game I am envisioning.
            </p>
            <p>
              This brings me back to time and space. As I add regions, characters, and
              things for them to do, how much more work does the computer have to perform?
              How much more information does it need to keep in memory?
            </p>
            <p>
              For example, how often does the game need to update a character on the other
              side of the continent? Does a distant settlement need to be loaded in the
              same detail as the one the player is walking through? Could the game preserve
              a smaller record of what is happening there without keeping the whole scene
              in memory?
            </p>
            <p>
              These are the kinds of questions I want to investigate in the smaller
              sandbox. The time question is what needs to be calculated, how often, and how
              that work grows. The space question is what needs to remain in memory, and
              how that requirement grows. Getting five regions to work will be a starting
              point. Then I want to think about scaling. Adding a sixth will tell me more
              about whether the design can scale.
            </p>
            <p>
              Although reorganizing the directories does not answer those questions, it
              gives me a clearer starting point for asking them.
            </p>
            <p>
              Until recently, I have mostly been asking the coding agents what else we can
              add. Now, I need to spend more time figuring out what all these added
              features require to make an enjoyable game.
            </p>
            <p>In that spirit, here is one more demo of what I have so far:</p>
          </div>

          <Video id="ride" videoId="ylEe1MuQXOg" title="Azhora — riding from Minora to defend Ovesos" />

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>Don’t get me wrong though. I still want the whole continent!</p>
            <p>
              But first I’ll limit myself to understanding what it takes to get a good
              combat system within five regions running and if that can scale.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
