import Image from "next/image";

import { showcaseDrawings, showcaseScenes } from "@/content/doodle-showcase";

export function ArtShowcase() {
  return (
    <div className="art-showcase">
      <div className="art-showcase-intro">
        <p className="art-showcase-kicker">A small exhibition</p>
        <p className="art-showcase-inventory">
          {showcaseDrawings.length} selected drawings <span aria-hidden="true">/</span> {showcaseScenes.length} imagined scenes
        </p>
      </div>

      <section className="art-showcase-section" aria-labelledby="showcase-drawings-heading">
        <div className="art-showcase-section-heading">
          <div>
            <p className="art-showcase-kicker">01 / The drawings</p>
            <h2 id="showcase-drawings-heading">Studies from the notebook</h2>
          </div>
          <p>Birds, botanical studies, trees, architecture, and a robot. Open a drawing for a closer look.</p>
        </div>
        <div className="art-showcase-drawings">
          {showcaseDrawings.map((drawing, index) => (
            <a
              key={drawing.id}
              href={`/art?drawing=${encodeURIComponent(drawing.id)}#drawings`}
              className="art-showcase-drawing-link"
              aria-label={`View drawing: ${drawing.title}`}
            >
              <figure className="art-showcase-drawing">
                <div className="art-showcase-paper">
                  <Image
                    src={drawing.src}
                    alt={drawing.alt}
                    width={drawing.image.width}
                    height={drawing.image.height}
                    sizes="(max-width: 599px) 84vw, (max-width: 899px) 42vw, (max-width: 1279px) 29vw, 21vw"
                    priority={index === 0}
                  />
                  <span className="art-showcase-open" aria-hidden="true">View drawing ↗</span>
                </div>
                <figcaption className="art-showcase-caption">
                  <span className="art-showcase-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{drawing.title}</h3>
                    {drawing.note ? <p>{drawing.note}</p> : null}
                  </div>
                </figcaption>
              </figure>
            </a>
          ))}
        </div>
        <a className="art-showcase-archive-link" href="#drawings">Browse the full drawing archive <span aria-hidden="true">→</span></a>
      </section>

      <section className="art-showcase-section art-showcase-scenes-section" aria-labelledby="showcase-scenes-heading">
        <div className="art-showcase-section-heading">
          <div>
            <p className="art-showcase-kicker">02 / The experiments</p>
            <h2 id="showcase-scenes-heading">Into imagined worlds</h2>
          </div>
          <p>Scenes made with ImageGen using drawings from the archive. Familiar marks become new places.</p>
        </div>
        <div className="art-showcase-scenes">
          {showcaseScenes.map((scene, index) => (
            <figure className={`art-showcase-scene${index === 0 ? " art-showcase-scene-featured" : ""}`} key={scene.id}>
              <a href={scene.src} target="_blank" rel="noopener noreferrer" className="art-showcase-scene-link" aria-label={`View ${scene.title} at full size (opens in a new tab)`}>
                <Image
                  src={scene.src}
                  alt={scene.alt}
                  width={scene.image.width}
                  height={scene.image.height}
                  sizes={index === 0
                    ? "(max-width: 1279px) 90vw, 70vw"
                    : "(max-width: 599px) 84vw, (max-width: 899px) 42vw, 32vw"}
                />
                <span className="art-showcase-open" aria-hidden="true">View full image ↗</span>
              </a>
              <figcaption className="art-showcase-scene-caption">
                <div>
                  {index === 0 ? <p className="art-showcase-kicker">Featured scene</p> : null}
                  <h3>{scene.title}</h3>
                </div>
                {scene.description || scene.note ? <p>{scene.description ?? scene.note}</p> : null}
              </figcaption>
            </figure>
          ))}
        </div>
        <a className="art-showcase-archive-link" href="?collection=scenic#experiments">Explore all scenic experiments <span aria-hidden="true">→</span></a>
      </section>
    </div>
  );
}
