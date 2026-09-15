import type { Metadata } from "next";
import Link from "next/link";

import { PromptPanel } from "@/components/prompt-panel";
import { blogPosts } from "@/content/blog";

import styles from "./post.module.css";

const post = blogPosts.clio;
const media = "/cromblog/clio";
// Keep the original announcement's social preview tied to its historical demo.
const originalPreview = {
  src: `${media}/clio-demo-poster.jpg`,
  alt: "Clio's hex map, with bands and neighboring peoples exploring a wooded landscape",
  width: 1920,
  height: 1080
};

// Quoted historical brief supplied for this announcement, not implementation instructions.
const originalPrompt = "Clio is the Greek Muse of Epic Poetry.\n\nThat is what I want this game to feel like: playing history. \n\nMy major inspirations are Sid Mier’s Civilization IV, V, and V; Sega’s Humankind; Total War Warhammer III; and mods of those games. \n\nHowever, I want to make an original game not constrained by any of the inspirations.\n\nI want to call it simply Clio. \n\nThe player is in charge of a polity.\n\nThat polity can range from small band of a couple dozens people to vast empire over a billion people. \n\nPart of the game is building your polity.\n\nIt is also about survival.\n\nPart of the challenge is just surviving the onslaught of history. \n\nPlayers start in charge of a band of 50 people. \n\nThe world can start with anywhere from one to as many as the game could comfortably fit. \n\nIt may be interesting to make the game always start with one band the player controls with no other players. The player would open in a world where their greatest threat is the wild beasts and winter. The player’s band perhaps inevitably divides into rival bands and tribes and later countries so that as the game progressed in time the challenge transitions from mastering the environment and beasts to competing with other human polities.\n\nThat band is a single unit on the board, which is an oblate ellipsoid world like our own with varying terrain and climate. \n\nUnits should be able to circumnavigate the poles but the extreme conditions should make it virtually impossible without advanced aircraft.\n\nThe beginning should take note of Humankind’s beginning where there is a hunter gather phase before the sedentary phase.\n\nPlayers start as the chief of a band of 50 that engages in foraging, hunting, exploring, and so on. They navigate around the map collecting advantages from the terrain to survive and grow. To grow they must secure food surpluses.\n\nAs the population grows, the polity becomes more complex. More technological advancement leads to evermore divisions in labor.\n\nHunting and foraging strategy polities should not disappear entirely as small bands remain in the Amazon to this day. Such strategies can in theory lead to Mongol Empires. There should however be sedentary polities that emerge through bands of people falling into what has been called in Big History the trap of sedentism, where they settle in an abundant area and come to rely on the more food to sustain a growing population, one that becomes too large to hope to go back to hunting and gather, especially with evermore competitors around.\n\nPlayers can make their way along whatever path: nomadic, sedentary, semi-nomadic, semi-sedentary, and so on. I want this games polities to be more dynamic and complex than the games I listed.\n\nIn Clio, you don’t play some preset civilization or race, like China or Brettonia, you start with a blank slate band that you can name whatever you want. \n\nThe cultural character, the memic code if you will, of the polity emerges based on your game play, your interaction with the map, events, other units polities. \n\nWild beasts shall interact like primitive polities with units moving across the map. Like in humankind, the player can chase the wild animal units, generally only the larger ones of significant economic consequence: herds of large mammals, packs of wolves, and so on. But make for a large and dynamic set of animals with nuanced effects that subtly influence the polities cultural code. \n\nYou should have an option to try cooperating and taming wolves. This should sometimes backfire, but come with dog power ups if done successfully. \n\nDomestication should be an option for engaging with large animals and eventually lead to power ups like animal husbandry. While these are researched like technologies in normal games, in Clio these things should be like milestones triggered by accomplishing certain things or something like the missions or quests in Total War. It could be something like: have ten positive taming attempts on this one particular species in order to gain your own domestic breed, giving the player a resource of something like a domestic herd of 100 cattle. This herd could be grown to be much larger and traded to perhaps become the most widely used particular type of cow, or be one of the many less popular cows, or die off completely because your people didn’t do too well or found better cows. Cow breeds have different stats based on the conditions of their development and can change overtime. \n\nInstead of having a technology tree, perhaps these advances are embedded as parts of the culture in a knowledge tree. That way the discovery of new technologies/advancements like animal husbandry aren’t just set power ups, they are junctures in the development of the culture, with the domestication of a dog on the plain is different than domesticating a dog in a forest. In this way, cultures are on something like the ideological axes of humankind or the axes of the big 5 personalty psychology but elaborated to represent a continuous but evolving human society/culture.\n\nMost cultures that emerge will be absorbed by larger composite cultures overtime. Players become more powerful by being at the helm of one of the polities carrying the winning composite culture.\n\nLet’s make it turn based but not confine the turns to any strict unit of time so the game can be optimized for playability. \n\nLet’s make this a standalone app with a descent original graphics map. I was thinking Language: C#\nEngine: Unity 6\nRenderer: HDRP\nInitial platform: Windows desktop\nShaders: Shader Graph plus HLSL where necessary\nModeling: Blender\nProject structure: Engine-independent simulation library with Unity as the presentation layer\n\nTake a substantial amount of time and effort to build a good graphic interface map design.\n\n\nWe can start with hammering out the early pre-bronze age period, from the small hunter gathering bands to larger tribes, confederacies, settlements, villages, and small towns. We can start building an advancement web that is something akin to the tech tree and also serves as a way to organize and measure the ages.\n\nI want there to be languages in the game and have them tied to cultural development. Languages should branch off and diversify overtime. Whole languages do not need to be built out, but creating basic language maps with some key words an characteristics could go along way in adding flavor. Take substantial time to flesh out the language system. If the game starts with just one player, one band, then everything should descending from that one proto-language. Names for things then evolve organically overtime. Players can set characteristics of their initial base language in the settings. Otherwise there would be randomizer that generates phonoaesthetic new languages.\n\nLets also add a fantasy twist to this game like Total War Warhammer III.\n\nThere are different races. Let’s say to start: humans (balanced adaptabilty across most climates and terrains), elves (adapted extremely well to forests), dwarves (adapted extremely well to mountains and to a lesser extent hills), goblins (adapted well to mountains, barrens, and hills). Wild animals can include dragons as well as great mega fauna of Earth’s past.\n\nRaces are set from the initial band, so the base game can be to start with the human controlled single human band and see the game advance from there. Or you could startwith four bands, one human, one elf, one dwarf, and one goblin.\n\nThe map design matters significantly: hexes, a grid, territories like humankind, and so many possibilities. Help me design this to be optimal for the game I would like to see here.";

export const metadata: Metadata = {
  title: post.title,
  description: post.summary,
  openGraph: {
    type: "article",
    title: post.title,
    description: post.summary,
    images: [{ url: originalPreview.src, width: originalPreview.width, height: originalPreview.height, alt: originalPreview.alt }]
  },
  twitter: {
    card: "summary_large_image",
    title: post.title,
    description: post.summary,
    images: [originalPreview.src]
  }
};

export default function ClioPage() {
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
            <p className="text-xs uppercase tracking-[0.22em] text-pine-700">Cromblog / Games</p>
            <h1 className="font-serif text-4xl text-ink sm:text-5xl">{post.title}</h1>
            <p className="text-sm text-pine-700/80">{post.date} &middot; {post.readTime}</p>
            <p className={styles.projectLinks}>
              <a href="https://github.com/mcrombie/clio">Clio on GitHub</a>
              <Link href="/games">Browse my games</Link>
            </p>
          </header>

          <aside className="rounded-2xl border border-[color:var(--border)] p-5">
            <p className="mb-3 text-sm text-pine-800">
              The latest Windows prototype adds a guided opening, the First Adviser’s
              spoken reports, travel previews, and wildlife on the map. The video below
              shows an earlier build.
            </p>
            <a href="/games/clio/clio-sage-37-windows.zip" className="folio-button" download>
              Download the latest Clio for Windows · 16.8 MB
            </a>
            <p className="mt-3 text-sm text-pine-700">
              Windows 10 or 11 with .NET Framework 4.x. Extract the ZIP and open Clio.exe.
              Opening recordings are included; live reports use Windows speech, with an
              optional offline voice setup in the download.
            </p>
          </aside>

          <hr className="border-[color:var(--border)]" />

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>
              Even though I have been spending the last couple of days working on
              this starter robot and designing new paperback proofs, I still seem
              to find the time and tokens to tinker with making games. Making the{" "}
              <Link href="/cromblog/cromonsters">Cromonsters prototype</Link> made
              me realize how I could use agents to develop my own versions of
              games I still play.
            </p>
            <p>
              The games I have played the most, by far, are Sid Meier’s
              Civilization games. I also took inspiration from Humankind and
              Total War for this 4X prototype: <strong>Clio</strong>.
            </p>
            <p>
              Coming off writing a history book, I reckon wanting to use these
              tools to make such a game is only natural. I was resisting the game
              path in my last few{" "}
              <Link href="/cromblog/simulating-civilizations-iv">Simulating Civilizations posts</Link>,
              but I think it is time to see how designing for fun rather than
              accuracy changes things.
            </p>
            <p>Here is a short look at the prototype:</p>
          </div>

          <figure id="demo" className={styles.videoFigure}>
            <video
              controls
              playsInline
              preload="metadata"
              width={1920}
              height={1080}
              poster={`${media}/clio-demo-poster.jpg`}
              aria-label="Clio: opening and accelerated gameplay demo"
              aria-describedby="clio-demo-caption"
            >
              <source src={`${media}/clio-demo.mp4`} type="video/mp4" />
              Your browser does not support embedded video. Use the link below to watch.
            </video>
            <figcaption id="clio-demo-caption">
              <span>
                61 seconds in Clio: the opening at normal speed, then gameplay at
                3× and 16× as bands explore and new peoples emerge. Silent video.
              </span>
              <a href={`${media}/clio-demo.mp4`}>Open demo</a>
            </figcaption>
          </figure>

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>
              Here is the original prompt I gave GPT-6 Astra on September 4.
              It lays out the larger idea; much of it is still ahead of the
              prototype you see above.
            </p>
          </div>

          <PromptPanel
            id="original-prompt"
            title="The original Clio prompt · September 4, 2026"
            prompt={originalPrompt}
          />

          <aside className={styles.correction} aria-label="A note on the original prompt">
            One correction to the prompt: Clio is the Muse of history; Calliope
            is the Muse of epic poetry. The name fits this project all the same.{" "}
            <a href="https://blogs.loc.gov/international-collections/2018/04/the-greco-roman-muses-of-the-library-of-congress/">
              The Muses, at the Library of Congress
            </a>.
          </aside>

          <div className="article-prose" style={{ maxWidth: "none" }}>
            <p>
              I have been tweaking it since then. Working on the video demo has
              taken much longer than I thought, but I am learning the video
              recording and editing process in the meantime.
            </p>
            <p>It will be fun to see what this side project evolves into.</p>
          </div>
        </div>
      </div>
    </article>
  );
}
