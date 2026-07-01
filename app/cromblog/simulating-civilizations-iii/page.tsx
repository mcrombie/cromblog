import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { blogPosts } from "@/content/blog";
import {
  simulatingCivilizationsIIIChronicle,
  simulatingCivilizationsIIIGrassicOnly150
} from "@/content/simulating-civilizations-iii";

const post = blogPosts["simulating-civilizations-iii"];

export const metadata: Metadata = {
  title: post.title
};

const arrivalWaves = [
  {
    turn: "0",
    name: "Boueni",
    entry: "North Riesov",
    doctrine: "Industrious, population growth"
  },
  {
    turn: "20",
    name: "Moreshi",
    entry: "Marosh",
    doctrine: "Commercial, population growth"
  },
  {
    turn: "120",
    name: "Grassic",
    entry: "East Mithala",
    doctrine: "Territorial, population growth"
  },
  {
    turn: "150",
    name: "Pyrosi",
    entry: "West Pyros",
    doctrine: "Militarist, conquering"
  },
  {
    turn: "250",
    name: "Mittoli",
    entry: "East Mithala",
    doctrine: "Territorial, conquering"
  },
  {
    turn: "270",
    name: "Ibenal",
    entry: "South Acordwood",
    doctrine: "Industrious, isolationist"
  },
  {
    turn: "370",
    name: "Telemoni",
    entry: "Telemonia",
    doctrine: "Militarist, isolationist"
  },
  {
    turn: "400",
    name: "Tennoca",
    entry: "Cape Thalmagar",
    doctrine: "Commercial, defensive"
  }
] as const;

function Figure({
  src,
  alt,
  caption,
  width,
  height
}: {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}) {
  return (
    <figure className="m-0 content-flow mb-10">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="block h-auto w-full rounded-xl border border-[color:var(--border)] shadow-md"
      />
      <figcaption className="text-center text-sm leading-7 text-[color:var(--muted)] mt-3">
        {caption}
      </figcaption>
    </figure>
  );
}

function ChronicleDisclosure({
  title,
  subtitle,
  paragraphs,
  tone
}: {
  title: string;
  subtitle: string;
  paragraphs: readonly string[];
  tone: "grassic" | "staged";
}) {
  const toneClass =
    tone === "grassic"
      ? "border-pine-700/25 bg-[#f4f8ef]"
      : "border-[#a67c52]/35 bg-[#fbf2e4]";

  return (
    <details className={`rounded-xl border ${toneClass} shadow-sm`}>
      <summary className="cursor-pointer list-none px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="m-0 text-xs uppercase tracking-[0.18em] text-pine-700">
              Generated Historical Chronicle
            </p>
            <p className="m-0 mt-1 font-serif text-xl leading-7 text-ink">
              {title}
            </p>
            <p className="m-0 mt-1 text-sm leading-6 text-[color:var(--muted)]">
              {subtitle}
            </p>
          </div>
          <span className="text-sm font-medium text-pine-700">
            Open chronicle
          </span>
        </div>
      </summary>
      <div className="border-t border-[color:var(--border)] px-4 py-5 sm:px-6">
        <div className="space-y-5 font-serif text-[1.05rem] leading-8 text-ink">
          {paragraphs.map((paragraph, index) => (
            <p key={`${title}-${index}`} className="m-0">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </details>
  );
}

export default function SimulatingCivilizationsIIIPage() {
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
            <p className="text-xs uppercase tracking-[0.22em] text-pine-700">
              Cromblog
            </p>
            <h1 className="font-serif text-4xl text-ink sm:text-5xl">
              {post.title}
            </h1>
            <p className="text-sm text-pine-700/80">
              {post.date} &middot; {post.readTime}
            </p>
          </header>

          <hr className="border-[color:var(--border)]" />

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>
              Returning to the custom Azhora map from the last post, I decided
              this run to integrate the Clashvergence and World Builder projects,
              making the latter more like the setting. The climate layer now uses
              the Koppen classification system. Each hex can carry a more
              specific climate than before. A wide range of climates from humid
              subtropical shores, oceanic coasts, steppe interiors, highlands,
              tundra, and desert margins all shape the continent of Azhora at
              the same time. The World Builder map now exports into the
              simulation format, and it carries a prebuilt Azhora lore corpus
              plus a map-linked lore file so regions, climates, languages, and
              authored geography can all travel with the simulation rather than
              being pasted in afterward, though they may be tampering with the
              organic development of the history.
            </p>
            <p>
              In the first, the premise is simple: one people, one map, and 150
              years of splintering. The parameters in this post are for feeling
              out how the system behaves. They should not be read as a careful
              assessment of ideal comparison settings.
            </p>
          </div>

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <h2>First: One Founding People</h2>
            <p>
              The first scenario uses the same Azhora map and climate layer, but
              only one founding people is present at the beginning and no new
              peoples arrive from outside the map. By turn 150, the result is
              already recognizably historical rather than blankly procedural. It
              is not calmer than the larger run, but its violence has a different
              flavor: almost every later polity is a descendant, rebel branch,
              or renamed daughter house of the original founding people.
            </p>
          </div>

          <Figure
            src="/cromblog/simulating-civilizations-iii/azhora-grassic-only-150.png"
            alt="World Builder simulation view showing the single-civilization Azhora run at turn 150"
            caption="The single-civilization Azhora comparison at turn 150. With no staged arrivals, the map still fragments quickly, but the conflicts are largely genealogical."
            width={1920}
            height={1080}
          />

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <h2>The Narrative Layer</h2>
            <p>
              I also reworked the narrative generator. Earlier versions could
              read the simulation results, but they still sounded too much like
              out of touch analysts summarizing game state. They would say,
              plainly, how much money a polity had or how many regions it held.
              That is useful evidence for the engine, but it is not how a person
              in Azhora would talk about a troubled realm, and the goal is
              believability within the scope of this world.
            </p>
            <p>
              The new version uses retrieval-augmented generation. Before the
              final chronicle is written, the generator pulls style passages from
              a small corpus. Right now it includes Herodotus and Lord Dunsany,
              combining their influence into an idiosyncratically structured
              summary of the simulation. It also now builds story seeds from raw
              outcomes: weak treasuries lead to unpaid garrisons, low
              storehouses, and toll roads costing more than they return.
            </p>
          </div>

          <ChronicleDisclosure
            title="The Single-Civilization Chronicle"
            subtitle="Turn 150, one founding people, no staged arrivals"
            paragraphs={simulatingCivilizationsIIIGrassicOnly150}
            tone="grassic"
          />

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <h2>Then: Staged Arrivals</h2>
            <p>
              In this larger example here I change the premise. Instead of one
              ancestral people generating almost every later faction by descent,
              eight founding civilizations enter Azhora over the first 400
              turns. That gives the engine several unrelated centers of memory,
              language, religion, and ambition, so the generated chronicle has
              to explain both internal fragmentation and collisions between
              peoples who do not share the same starting story.
            </p>
            <p>
              This run is larger and messier by design. It is influenced by the
              push I have based on a vision I have long had for how the history
              of this fictional continent would take shape, meaning these
              settings are exploratory rather than carefully optimized. The
              attention is also to narrative quality, particularly believability.
            </p>
            <p>
              For this run I gave the narrator a position inside the world. He
              is an East Lond chronicler of Boueni descent, writing among
              surviving Riesov speakers whose language still belongs to the
              Boueni family. That changes the shape of the account, opening it
              with the arrival, loss, inherited grievance, and the uneasy
              knowledge that a homeland may survive without the people who first
              named it.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[color:var(--border)]">
            <table className="min-w-full border-collapse text-left text-sm text-[color:var(--muted)]">
              <thead className="bg-pine-50 text-xs uppercase tracking-[0.18em] text-pine-700">
                <tr>
                  <th className="px-4 py-3 font-semibold">Turn</th>
                  <th className="px-4 py-3 font-semibold">Civilization</th>
                  <th className="px-4 py-3 font-semibold">Arrival</th>
                  <th className="px-4 py-3 font-semibold">Pressure</th>
                </tr>
              </thead>
              <tbody>
                {arrivalWaves.map((wave) => (
                  <tr
                    key={`${wave.turn}-${wave.name}`}
                    className="border-t border-[color:var(--border)]"
                  >
                    <td className="px-4 py-3 font-medium text-ink">
                      {wave.turn}
                    </td>
                    <td className="px-4 py-3">{wave.name}</td>
                    <td className="px-4 py-3">{wave.entry}</td>
                    <td className="px-4 py-3">{wave.doctrine}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Figure
            src="/cromblog/simulating-civilizations-iii/azhora-450-turn.png"
            alt="World Builder simulation view showing Azhora at turn 450"
            caption="Azhora at turn 450, with Elagos selected in World Builder and the simulation panel open."
            width={1920}
            height={1080}
          />

          <ChronicleDisclosure
            title="The Boueni-Descended Chronicle"
            subtitle="Turn 450, staged arrivals, Boueni-remnant narrator"
            paragraphs={simulatingCivilizationsIIIChronicle}
            tone="staged"
          />

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <h2>The Simulation Continues</h2>
            <p>
              These snapshots are an update, not a finished system. Even with
              minimal attention to narrator development, the simulation is
              already producing histories with complex texture. They have
              inheritance, grievance, overextension, religion, political memory,
              economy, and so on. That is encouraging, however, many of the
              mechanics still need a lot of tuning before I would trust the
              outcomes as more than evocative prototypes. I am also interested
              in learning how I can tune to steer simulation outcomes.
            </p>
            <p>
              The next step is then to build more systematic test simulations.
              These will likely include repeated runs, clearer scenario families,
              better metrics for fragmentation and overextension, and
              side-by-side narrative comparisons that show whether a mechanic
              reliably creates the kind of history it is supposed to create. In
              short, the settings here are useful for exploration, but the real
              calibration work is still to be done.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
