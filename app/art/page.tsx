import type { Metadata } from "next";
import Image from "next/image";

import { artGalleries } from "@/content/art";
import { doodleAssets } from "@/content/doodles";

export const metadata: Metadata = {
  title: "Art"
};

export default function ArtPage() {
  return (
    <div className="content-flow art-page">
      <h1 className="sr-only">Art</h1>

      {artGalleries.map((gallery) => {
        const galleryHeadingId = `art-gallery-${gallery.id}`;

        return (
          <section
            key={gallery.id}
            className="art-gallery"
            aria-labelledby={galleryHeadingId}
          >
            <h2 id={galleryHeadingId} className="art-gallery-title">
              {gallery.title}
            </h2>

            <div className="art-gallery-grid">
              {gallery.works.map((work) => {
                const asset = doodleAssets[work.assetId];
                const displayName =
                  "displayName" in asset ? asset.displayName : undefined;

                return (
                  <figure key={work.assetId} className="art-card">
                    <div className="art-card-visual">
                      <div className="art-card-image-frame">
                        <Image
                          src={asset.src}
                          alt={work.alt}
                          fill
                          sizes="(max-width: 639px) 82vw, (max-width: 1279px) 44vw, 30vw"
                          quality={90}
                          className="art-card-image"
                        />
                      </div>
                    </div>
                    {displayName ? (
                      <figcaption className="art-card-caption">
                        {displayName}
                      </figcaption>
                    ) : null}
                  </figure>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
