"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

import type { DoodleLabArtwork } from "@/content/doodle-lab-post";

import styles from "./post.module.css";

const ViewerContext = createContext<((id: string, trigger: HTMLButtonElement) => void) | null>(null);

export function ArtworkViewer({ artworks, children }: { artworks: DoodleLabArtwork[]; children: ReactNode }) {
  const [active, setActive] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const current = active === null ? null : artworks[active];
  const isOpen = active !== null;

  useEffect(() => {
    if (!isOpen) return;
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    if (!element?.open) element?.showModal();
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  function close() {
    dialog.current?.close();
    setActive(null);
    trigger.current?.focus({ preventScroll: true });
  }

  function step(direction: number) {
    setActive(index => index === null ? null : (index + direction + artworks.length) % artworks.length);
  }

  return (
    <ViewerContext.Provider value={(id, button) => {
      const index = artworks.findIndex(artwork => artwork.id === id);
      if (index < 0) return;
      trigger.current = button;
      setActive(index);
    }}>
      {children}
      <dialog
        ref={dialog}
        className={styles.viewer}
        aria-labelledby="artwork-viewer-title"
        onCancel={event => { event.preventDefault(); close(); }}
        onClick={event => { if (event.target === event.currentTarget) close(); }}
        onKeyDown={event => {
          if (event.key === "ArrowLeft") { event.preventDefault(); step(-1); }
          if (event.key === "ArrowRight") { event.preventDefault(); step(1); }
        }}
      >
        {current && (
          <div className={styles.viewerContent}>
            <header className={styles.viewerHeader}>
              <div>
                <span className={styles.micro}>Doodle Lab <span aria-hidden="true">/</span> {(active ?? 0) + 1} of {artworks.length}</span>
                <h2 id="artwork-viewer-title" lang="la">{current.title}</h2>
              </div>
              <button ref={closeButton} type="button" className={styles.closeButton} onClick={close} aria-label="Close artwork viewer">
                Close <span aria-hidden="true">×</span>
              </button>
            </header>
            <div className={`${styles.viewerImage} ${current.kind === "drawing" ? styles.viewerDrawing : ""}`}>
              {/* The full artwork is intentionally presented without cropping. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img key={current.id} src={current.src} width={current.width} height={current.height} alt={current.alt} />
            </div>
            <footer className={styles.viewerFooter}>
              <button type="button" onClick={() => step(-1)} aria-label="Previous artwork">← <span>Previous</span></button>
              <a href={current.src} target="_blank" rel="noreferrer">Open original <span aria-hidden="true">↗</span></a>
              <button type="button" onClick={() => step(1)} aria-label="Next artwork"><span>Next</span> →</button>
            </footer>
            <p className={styles.viewerHelp}>Use the arrow keys to explore. Escape closes the viewer.</p>
          </div>
        )}
      </dialog>
    </ViewerContext.Provider>
  );
}

export function ArtworkFigure({ artwork, className = "", priority = false, compact = false }: {
  artwork: DoodleLabArtwork;
  className?: string;
  priority?: boolean;
  compact?: boolean;
}) {
  const open = useContext(ViewerContext);
  return (
    <figure className={`${styles.artwork} ${className} ${compact ? styles.compactArtwork : ""} ${artwork.kind === "drawing" ? styles.sourceArtwork : ""}`}>
      <button
        type="button"
        className={styles.artworkButton}
        aria-label={`View artwork: ${artwork.title}`}
        data-artwork={artwork.id}
        onClick={event => open?.(artwork.id, event.currentTarget)}
      >
        {/* Source PNGs are used directly to retain the original pencil detail. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={artwork.src} width={artwork.width} height={artwork.height} alt={artwork.alt} loading={priority ? "eager" : "lazy"} decoding="async" />
        <span className={styles.expandMark} aria-hidden="true"><span>View artwork</span> ↗</span>
      </button>
      <figcaption>
        <span className={styles.figureNumber} aria-label={`Figure ${artwork.number}`}>{artwork.number}</span>
        <div lang="la"><strong>{artwork.title}</strong><p>{artwork.caption}</p></div>
      </figcaption>
    </figure>
  );
}
