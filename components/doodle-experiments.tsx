"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import type { DoodleExperiment } from "@/content/doodle-experiments";

function AnimationPreview({ animation, poster, alt, image }: {
  animation: NonNullable<DoodleExperiment["animation"]>;
  poster: string;
  alt: string;
  image: DoodleExperiment["image"];
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playbackFailed, setPlaybackFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    return () => { video?.pause(); };
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        controls
        loop
        playsInline
        muted
        preload="none"
        poster={poster}
        width={image.width}
        height={image.height}
        aria-label={alt}
        className="doodle-experiment-preview-image"
        onError={() => setPlaybackFailed(true)}
      >
        <source src={animation.mp4} type="video/mp4" onError={() => setPlaybackFailed(true)} />
        Your browser cannot play this animation. Download the MP4 or GIF below.
      </video>
      {playbackFailed ? (
        <p className="doodle-experiment-playback-note" role="status">
          This animation could not play here. Use the MP4 or GIF download below.
        </p>
      ) : null}
    </>
  );
}

export function DoodleExperiments({ entries, description }: {
  entries: readonly DoodleExperiment[];
  description: string;
}) {
  const [selected, setSelected] = useState<DoodleExperiment | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const selectedIndex = selected ? entries.findIndex((entry) => entry.id === selected.id) : -1;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (selected && dialog && !dialog.open) dialog.showModal();
    if (!selected && dialog?.open) dialog.close();
  }, [selected]);

  useEffect(() => {
    if (!selected) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnTabChange = () => {
      if (window.location.hash !== "#experiments") setSelected(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("hashchange", closeOnTabChange);
    window.addEventListener("popstate", closeOnTabChange);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("hashchange", closeOnTabChange);
      window.removeEventListener("popstate", closeOnTabChange);
    };
  }, [selected]);

  return (
    <section className="doodle-experiments" aria-label="Doodle Lab experiments">
      <p className="doodle-experiments-intro">{description}</p>
      <div className="doodle-experiments-grid">
        {entries.map((entry) => (
          <figure key={entry.id} className="art-card doodle-experiment-card">
            <button
              type="button"
              className={`doodle-experiment-open${entry.animation ? " is-animation" : ""}`}
              aria-label={entry.animation ? `Play animation: ${entry.title}` : `View ${entry.title}`}
              onClick={() => setSelected(entry)}
            >
              <Image
                src={entry.src}
                alt={entry.alt}
                width={entry.image.width}
                height={entry.image.height}
                sizes="(max-width: 767px) 90vw, (max-width: 1279px) 43vw, 480px"
                quality={90}
                className="doodle-experiment-image"
              />
              <span className={`doodle-gallery-enlarge${entry.animation ? " doodle-experiment-play" : ""}`} aria-hidden="true">
                {entry.animation ? "▶ Play animation" : "View image ↗"}
              </span>
            </button>
            <figcaption className="doodle-gallery-caption doodle-experiment-caption">
              <div>
                <h2>{entry.title}</h2>
                <p>{entry.description}</p>
              </div>
              <span className="doodle-gallery-status">{entry.kind}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <dialog
        ref={dialogRef}
        className="doodle-gallery-dialog doodle-experiment-dialog"
        aria-labelledby="experiment-preview-title"
        onClose={() => setSelected(null)}
        onCancel={() => setSelected(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setSelected(null);
        }}
      >
        {selected ? (
          <div>
            <div className="doodle-gallery-preview-toolbar">
              <span>Experiment {selectedIndex + 1} of {entries.length}</span>
              <button type="button" className="doodle-gallery-close" onClick={() => setSelected(null)} autoFocus>
                Close <span aria-hidden="true">×</span>
              </button>
            </div>
            {selected.animation ? (
              <AnimationPreview
                key={selected.id}
                animation={selected.animation}
                poster={selected.src}
                alt={selected.alt}
                image={selected.image}
              />
            ) : (
              <Image
                src={selected.src}
                alt={selected.alt}
                width={selected.image.width}
                height={selected.image.height}
                sizes="(max-width: 760px) 92vw, 920px"
                quality={95}
                className="doodle-experiment-preview-image"
              />
            )}
            <div className="doodle-gallery-preview-details">
              <div>
                <p className="doodle-gallery-preview-batch">
                  {selected.kind}{selected.animation ? ` · ${selected.animation.durationSeconds} seconds` : ""}
                </p>
                <h2 id="experiment-preview-title">{selected.title}</h2>
                <p>{selected.description}</p>
              </div>
              <div className="doodle-gallery-preview-actions">
                <div className="doodle-gallery-step" aria-label="Browse experiments">
                  <button type="button" disabled={selectedIndex <= 0} onClick={() => setSelected(entries[selectedIndex - 1])}>
                    ← Previous
                  </button>
                  <button type="button" disabled={selectedIndex >= entries.length - 1} onClick={() => setSelected(entries[selectedIndex + 1])}>
                    Next →
                  </button>
                </div>
                {selected.animation ? (
                  <div className="doodle-experiment-downloads" role="group" aria-label="Download animation">
                    <a href={selected.animation.mp4} download>Download MP4</a>
                    <a href={selected.animation.gif} download>Download GIF</a>
                  </div>
                ) : (
                  <a href={selected.src} target="_blank" rel="noopener noreferrer">
                    Open full size <span aria-hidden="true">↗</span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </dialog>
    </section>
  );
}
