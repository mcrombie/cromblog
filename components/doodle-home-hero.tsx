import Image from "next/image";
import Link from "next/link";

import { NotebookDoodle } from "@/components/notebook-doodle";
import { doodleVibeHero, vibeDoodles } from "@/content/doodle-vibe";

export function DoodleHomeHero() {
  const framed = vibeDoodles[doodleVibeHero.framed];
  const originalHref = `/art?drawing=${encodeURIComponent(framed.id)}`;

  return (
    <>
      <div className="doodle-home-original doodle-home-strict">
        <NotebookDoodle id={doodleVibeHero.strict} className="doodle-home-bird" />
      </div>

      <figure className="doodle-home-scene doodle-home-strict">
        <Link href={originalHref} className="doodle-home-scene-print doodle-home-bird-print">
          <Image
            src={framed.sourceSrc}
            alt={framed.title}
            width={framed.sourceWidth}
            height={framed.sourceHeight}
            sizes="(max-width: 819px) 100vw, (max-width: 1023px) 53vw, 42vw"
            priority
          />
        </Link>
        <figcaption>
          <span>From the notebook: <em>{framed.title}</em></span>
          <Link href={originalHref}>View original drawing <span aria-hidden="true">↗</span></Link>
        </figcaption>
      </figure>

      <figure className="doodle-home-originals doodle-home-preferred">
        <div className="doodle-home-originals-drawings">
          {doodleVibeHero.preferred.map((id) => (
            <Link
              key={id}
              href={`/art?drawing=${encodeURIComponent(id)}`}
              className="doodle-home-drawing-link"
              aria-label={`View original drawing: ${vibeDoodles[id].title}`}
            >
              <NotebookDoodle id={id} className="doodle-home-character" />
            </Link>
          ))}
        </div>
        <figcaption>
          <Link href="/art">From the notebook <span aria-hidden="true">↗</span></Link>
          <span>Original drawings from the Doodle Lab</span>
        </figcaption>
        <Link className="doodle-home-experiment-link" href="/art#experiments">
          Explore the Doodle Lab experiments <span aria-hidden="true">↗</span>
        </Link>
      </figure>
    </>
  );
}
