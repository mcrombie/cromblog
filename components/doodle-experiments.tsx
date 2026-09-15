"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";

import type { DoodleExperiment } from "@/content/doodle-experiments";
import {
  collectionForKey,
  collectionFromSearch,
  experimentCollectionLabels,
  experimentCollections,
  experimentCollectionUrl,
  groupDoodleExperiments,
  type ExperimentCollection
} from "@/lib/doodle-experiment-collections";

function ExperimentGrid({ entries, onOpen, grouped = false, fullWidth = false }: {
  entries: readonly DoodleExperiment[];
  onOpen: (entry: DoodleExperiment) => void;
  grouped?: boolean;
  fullWidth?: boolean;
}) {
  const Heading = grouped ? "h3" : "h2";

  return (
    <div className="doodle-experiments-grid">
      {entries.map((entry) => (
        <figure key={entry.id} className="art-card doodle-experiment-card">
          <button
            type="button"
            className={`doodle-experiment-open${entry.animation ? " is-animation" : ""}`}
            aria-label={entry.animation ? `Play animation: ${entry.title}` : `View ${entry.title}`}
            onClick={() => onOpen(entry)}
          >
            <Image
              src={entry.src}
              alt={entry.alt}
              width={entry.image.width}
              height={entry.image.height}
              sizes={fullWidth ? "(max-width: 1279px) 90vw, 1000px" : "(max-width: 767px) 90vw, (max-width: 1279px) 43vw, 480px"}
              quality={90}
              className="doodle-experiment-image"
            />
            <span className={`doodle-gallery-enlarge${entry.animation ? " doodle-experiment-play" : ""}`} aria-hidden="true">
              {entry.animation ? "▶ Play animation" : "View image ↗"}
            </span>
          </button>
          <figcaption className="doodle-gallery-caption doodle-experiment-caption">
            <div>
              <Heading>{entry.title}</Heading>
              <p>{entry.description}</p>
            </div>
            <span className="doodle-gallery-status">{entry.kind}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

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
  const { twoCharacterScenes, futureStudies, memeGifs, comics, scenic, characterStudies } = groupDoodleExperiments(entries);
  const hasCharacterStudies = characterStudies.length > 0;
  const hasCollections = hasCharacterStudies || scenic.length > 0 || comics.length > 0 || futureStudies.length > 0 || memeGifs.length > 0;
  const [activeCollection, setActiveCollection] = useState<ExperimentCollection>(
    hasCharacterStudies ? "character-studies" : "all"
  );
  const [selected, setSelected] = useState<DoodleExperiment | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const collectionButtons = useRef<Partial<Record<ExperimentCollection, HTMLButtonElement | null>>>({});
  const collectionEntries = { all: entries, scenic, comics, "character-studies": characterStudies, "future-studies": futureStudies, "meme-gifs": memeGifs };
  const visibleEntries = collectionEntries[activeCollection];
  const selectedIndex = selected ? visibleEntries.findIndex((entry) => entry.id === selected.id) : -1;

  function selectCollection(collection: ExperimentCollection) {
    setSelected(null);
    setActiveCollection(collection);
    window.history.replaceState(window.history.state, "", experimentCollectionUrl(window.location.href, collection));
  }

  useEffect(() => {
    const syncCollection = () => {
      setActiveCollection(collectionFromSearch(window.location.search, hasCharacterStudies ? "character-studies" : "all"));
      setSelected(null);
    };
    syncCollection();
    window.addEventListener("popstate", syncCollection);
    window.addEventListener("hashchange", syncCollection);
    return () => {
      window.removeEventListener("popstate", syncCollection);
      window.removeEventListener("hashchange", syncCollection);
    };
  }, [hasCharacterStudies]);

  function handleCollectionKeyDown(event: KeyboardEvent<HTMLButtonElement>, collection: ExperimentCollection) {
    const next = collectionForKey(collection, event.key);
    if (!next) return;
    event.preventDefault();
    selectCollection(next);
    collectionButtons.current[next]?.focus();
  }

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
      {hasCollections ? (
        <div className="doodle-experiment-collections" role="tablist" aria-label="Experiment collections">
          {experimentCollections.map((collection) => (
            <button
              key={collection}
              ref={(element) => { collectionButtons.current[collection] = element; }}
              id={`experiment-tab-${collection}`}
              type="button"
              role="tab"
              aria-selected={activeCollection === collection}
              aria-controls={`experiment-panel-${collection}`}
              tabIndex={activeCollection === collection ? 0 : -1}
              className="doodle-experiment-collection"
              onClick={() => selectCollection(collection)}
              onKeyDown={(event) => handleCollectionKeyDown(event, collection)}
            >
              {experimentCollectionLabels[collection]}
              <span className="doodle-experiment-collection-count">
                {collectionEntries[collection].length}
              </span>
            </button>
          ))}
        </div>
      ) : null}
      <div
        id="experiment-panel-all"
        role={hasCollections ? "tabpanel" : undefined}
        aria-labelledby={hasCollections ? "experiment-tab-all" : undefined}
        hidden={activeCollection !== "all"}
        tabIndex={hasCollections ? 0 : undefined}
        className="doodle-experiment-collection-panel"
      >
        <ExperimentGrid entries={entries} onOpen={setSelected} />
      </div>
      {hasCollections ? (
        <div
          id="experiment-panel-scenic"
          role="tabpanel"
          aria-labelledby="experiment-tab-scenic"
          hidden={activeCollection !== "scenic"}
          tabIndex={0}
          className="doodle-experiment-collection-panel"
        >
          <ExperimentGrid entries={scenic} onOpen={setSelected} />
        </div>
      ) : null}
      {hasCollections ? (
        <div
          id="experiment-panel-comics"
          role="tabpanel"
          aria-labelledby="experiment-tab-comics"
          hidden={activeCollection !== "comics"}
          tabIndex={0}
          className="doodle-experiment-collection-panel doodle-experiment-comics"
        >
          <ExperimentGrid entries={comics} onOpen={setSelected} fullWidth />
        </div>
      ) : null}
      {hasCollections ? (
        <div
          id="experiment-panel-character-studies"
          role="tabpanel"
          aria-labelledby="experiment-tab-character-studies"
          hidden={activeCollection !== "character-studies"}
          tabIndex={0}
          className="doodle-experiment-collection-panel"
        >
          {twoCharacterScenes.length > 0 ? (
            <section className="doodle-experiment-study-group" aria-labelledby="two-character-scenes-title">
              <div className="doodle-experiment-study-heading">
                <h2 id="two-character-scenes-title">Two-character scenes</h2>
                <span>{twoCharacterScenes.length} scenes</span>
              </div>
              <ExperimentGrid entries={twoCharacterScenes} onOpen={setSelected} grouped />
            </section>
          ) : null}
        </div>
      ) : null}
      {hasCollections ? (
        <div
          id="experiment-panel-future-studies"
          role="tabpanel"
          aria-labelledby="experiment-tab-future-studies"
          hidden={activeCollection !== "future-studies"}
          tabIndex={0}
          className="doodle-experiment-collection-panel"
        >
          {futureStudies.length > 0 ? (
            <section className="doodle-experiment-study-group" aria-labelledby="future-studies-title">
              <div className="doodle-experiment-study-heading">
                <h2 id="future-studies-title">Future studies</h2>
                <span>{futureStudies.length} iterations</span>
              </div>
              <ExperimentGrid entries={futureStudies} onOpen={setSelected} grouped />
            </section>
          ) : null}
        </div>
      ) : null}
      {hasCollections ? (
        <div
          id="experiment-panel-meme-gifs"
          role="tabpanel"
          aria-labelledby="experiment-tab-meme-gifs"
          hidden={activeCollection !== "meme-gifs"}
          tabIndex={0}
          className="doodle-experiment-collection-panel"
        >
          <ExperimentGrid entries={memeGifs} onOpen={setSelected} />
        </div>
      ) : null}
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
              <span>Experiment {selectedIndex + 1} of {visibleEntries.length}</span>
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
                  <button type="button" disabled={selectedIndex <= 0} onClick={() => setSelected(visibleEntries[selectedIndex - 1])}>
                    ← Previous
                  </button>
                  <button type="button" disabled={selectedIndex >= visibleEntries.length - 1} onClick={() => setSelected(visibleEntries[selectedIndex + 1])}>
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
