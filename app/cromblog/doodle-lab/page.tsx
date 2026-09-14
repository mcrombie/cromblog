import type { Metadata } from "next";
import Link from "next/link";

import { doodleLabArtworks, doodleLabPost as post, doodleLabSources } from "@/content/doodle-lab-post";

import { ArtworkFigure, ArtworkViewer } from "./artwork-viewer";
import styles from "./post.module.css";

export const metadata: Metadata = {
  title: `${post.title} (Tentative draft)`,
  description: post.description,
  robots: { index: false, follow: false },
  openGraph: {
    type: "article",
    title: `${post.title} (Tentative draft)`,
    description: post.description,
    images: [{ url: doodleLabArtworks[0].src, width: 1672, height: 941, alt: doodleLabArtworks[0].alt }]
  },
  twitter: { card: "summary_large_image", title: `${post.title} (Tentative draft)`, description: post.description, images: [doodleLabArtworks[0].src] }
};

function SectionIndex({ number, children }: { number: string; children: React.ReactNode }) {
  return <p className={styles.sectionIndex}><span aria-hidden="true">{number}</span><span lang="la">{children}</span></p>;
}

export default function DoodleLabPage() {
  const [hero, tidal, glasshouse, cinder, winter, midnight] = doodleLabArtworks;
  return (
    <ArtworkViewer artworks={[...doodleLabArtworks, ...doodleLabSources]}>
      <article className={styles.post}>
        <a className={styles.skipLink} href="#initium">Skip to essay</a>
        <header className={styles.cover}>
          <div className={styles.topbar}>
            <Link className={styles.wordmark} href="/cromblog"><span aria-hidden="true">←</span> Cromblog</Link>
            <span className={styles.draft}><span aria-hidden="true" /> Draft</span>
            <Link href="/art" className={styles.textLink}>Art gallery <span aria-hidden="true">↗</span></Link>
          </div>
          <aside className={styles.developmentNotice} aria-labelledby="development-status">
            <strong id="development-status">{post.developmentLabel}</strong>
            <p>{post.developmentNotice}</p>
          </aside>
          <div className={styles.masthead}>
            <p className={styles.eyebrow} lang="la">{post.eyebrow}</p>
            <h1>
              <span className={styles.titleLine}><span className={styles.titleMark}>{post.titlePrefix}</span>{" "}<span className={styles.titleName}>{post.titleName}</span></span>{" "}
              <span className={styles.subtitle}>{post.titleSubtitle}</span>
            </h1>
            <div className={styles.coverIntroduction}>
              <span className={styles.coverRule} aria-hidden="true" />
              <p lang="la">{post.introduction}</p>
              <a href="#initium" className={styles.readLink}>Read the essay <span aria-hidden="true">↓</span></a>
            </div>
          </div>
          <div className={styles.heroFrame}><ArtworkFigure artwork={hero} priority className={styles.heroArtwork} /></div>
        </header>

        <nav className={styles.chapterNav} aria-label="Essay sections">
          <a href="#" className={styles.navMark} aria-label="Back to the beginning">( )</a>
          <div>{post.nav.map(item => <a key={item.href} href={item.href}><span aria-hidden="true">{item.number}</span><span lang="la">{item.label}</span></a>)}</div>
          <span className={styles.navTitle}>Doodle Lab</span>
        </nav>

        <section id="initium" className={`${styles.section} ${styles.opening}`} aria-labelledby="initium-title">
          <SectionIndex number="01">{post.opening.eyebrow}</SectionIndex>
          <div className={styles.proseGrid}>
            <aside className={styles.marginNote} lang="la"><span>{post.opening.noteTitle}</span><p>{post.opening.note}</p><i aria-hidden="true">↳</i></aside>
            <div className={styles.prose} lang="la">
              <h2 id="initium-title">{post.opening.title}</h2>
              <p className={styles.lead}>{post.opening.lead}</p>
              {post.opening.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </div>
        </section>

        <section id="fragmenta" className={styles.sourceSection} aria-labelledby="fragmenta-title">
          <div className={styles.section}>
            <SectionIndex number="02">{post.sources.eyebrow}</SectionIndex>
            <div className={styles.sectionHeading} lang="la"><h2 id="fragmenta-title">{post.sources.title}</h2><p>{post.sources.text}</p></div>
            {doodleLabSources.length > 0 && <div className={styles.sourceGrid}>{doodleLabSources.map(artwork => <ArtworkFigure key={artwork.id} artwork={artwork} compact />)}</div>}
            <p className={styles.sourceNote} lang="la"><span aria-hidden="true">( )</span>{post.sources.note}</p>
          </div>
        </section>

        <section id="mundi" className={styles.worlds} aria-labelledby="mundi-title">
          <div className={styles.section}>
            <SectionIndex number="03">{post.worlds.eyebrow}</SectionIndex>
            <div className={`${styles.sectionHeading} ${styles.worldsHeading}`} lang="la"><h2 id="mundi-title">{post.worlds.title}</h2><p>{post.worlds.text}</p></div>
            <ArtworkFigure artwork={tidal} className={styles.wideArtwork} />
            <div className={styles.worldsPair}>
              <ArtworkFigure artwork={glasshouse} />
              <div className={styles.offsetStudy}><p lang="la" className={styles.passage}>{post.worlds.passage}</p><ArtworkFigure artwork={cinder} /></div>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.interlude}`} aria-labelledby="interlude-title">
          <blockquote className={styles.pullQuote} lang="la"><span aria-hidden="true">“</span><p>{post.interlude.quote}</p></blockquote>
          <div className={styles.interludeCopy} lang="la">
            <div><p className={styles.eyebrow}>{post.interlude.eyebrow}</p><h2 id="interlude-title">{post.interlude.title}</h2></div>
            <div className={styles.prose}>{post.interlude.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
          </div>
          <ArtworkFigure artwork={winter} className={styles.winterArtwork} />
          <p className={styles.interludeNote} lang="la">{post.interlude.note}</p>
        </section>

        <section id="deinceps" className={styles.ending} aria-labelledby="deinceps-title">
          <div className={styles.section}>
            <SectionIndex number="04">{post.ending.eyebrow}</SectionIndex>
            <ArtworkFigure artwork={midnight} className={styles.midnightArtwork} />
            <div className={styles.endingCopy} lang="la"><h2 id="deinceps-title">{post.ending.title}</h2><p>{post.ending.text}</p></div>
            <div className={styles.exploreLinks}>
              <Link href="/art"><span>Explore the doodle archive</span><span aria-hidden="true">↗</span></Link>
              <Link href="/games/cromb-coo-coo"><span>Explore the five floating islands</span><span aria-hidden="true">↗</span></Link>
            </div>
            <footer className={styles.footer}><Link href="/cromblog">← Back to Cromblog</Link><span lang="la">{post.ending.signature}</span><a href="#">Back to top ↑</a></footer>
          </div>
        </section>
      </article>
    </ArtworkViewer>
  );
}
