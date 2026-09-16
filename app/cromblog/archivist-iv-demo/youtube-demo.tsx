"use client";

import Image from "next/image";
import { useState, type MouseEvent } from "react";

import styles from "./post.module.css";

type YouTubeDemoProps = {
  videoId: string;
  title: string;
  poster: { src: string; alt: string };
  captionId: string;
};

// Shows a local poster until the reader asks to play, so the page loads no YouTube
// code or cookies up front. Without JavaScript the poster is a plain YouTube link.
export function YouTubeDemo({ videoId, title, poster, captionId }: YouTubeDemoProps) {
  const [playing, setPlaying] = useState(false);
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;

  function play(event: MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    setPlaying(true);
  }

  return (
    <div className={styles.videoFrame}>
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <a
          href={watchUrl}
          className={styles.posterLink}
          onClick={play}
          aria-label={`Play video: ${title}`}
          aria-describedby={captionId}
        >
          <Image
            src={poster.src}
            alt={poster.alt}
            fill
            sizes="(max-width: 840px) 100vw, 760px"
            className={styles.posterImage}
          />
          <span className={styles.playButton} aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M8 5.5v13l10.5-6.5L8 5.5Z" />
            </svg>
          </span>
        </a>
      )}
    </div>
  );
}
