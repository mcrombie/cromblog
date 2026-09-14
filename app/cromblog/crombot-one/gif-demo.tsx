"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import styles from "./post.module.css";

type GifDemoProps = {
  name: string;
  title: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  seconds: string;
};

export function GifDemo({ name, title, alt, caption, width, height, seconds }: GifDemoProps) {
  const [playing, setPlaying] = useState(false);
  const base = `/cromblog/crombot-one/${name}`;

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stopForReducedMotion = (event: MediaQueryListEvent) => {
      if (event.matches) setPlaying(false);
    };
    preference.addEventListener("change", stopForReducedMotion);
    return () => preference.removeEventListener("change", stopForReducedMotion);
  }, []);

  return (
    <figure className={styles.figure} aria-labelledby={`${name}-caption`}>
      <div className={styles.gifStage}>
        <Image
          src={`${base}.${playing ? "gif" : "jpg"}`}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          unoptimized
          className={styles.gifImage}
          sizes="(max-width: 640px) 86vw, 620px"
        />
      </div>
      <figcaption id={`${name}-caption`} className={styles.caption}>
        <div>
          <strong>{title}</strong>
          <span>{caption}</span>
        </div>
        <button
          type="button"
          aria-pressed={playing}
          aria-label={`${playing ? "Stop" : "Play"} ${title}`}
          onClick={() => setPlaying((current) => !current)}
          className={styles.playButton}
        >
          {playing ? "Stop GIF" : `Play GIF · ${seconds}`}
        </button>
      </figcaption>
    </figure>
  );
}
