"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";

const animationBase =
  "/cromblog/auspicious-august-and-a-signal-september/sunflower-bloom-only";

const animationAlt =
  "A hand-tinted nineteenth-century botanical plate in which a sunflower gradually opens from a tight bud into a full bloom.";

function subscribeMotion(onChange: () => void) {
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  preference.addEventListener("change", onChange);
  return () => preference.removeEventListener("change", onChange);
}

const readReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const serverReducedMotion = () => true;

export function SunflowerBloom() {
  const reducedMotion = useSyncExternalStore(subscribeMotion, readReducedMotion, serverReducedMotion);
  const [playbackChoice, setPlaying] = useState<boolean | null>(null);
  const playing = playbackChoice ?? !reducedMotion;
  const [run, setRun] = useState(0);

  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleMotionPreference = (event: MediaQueryListEvent) => {
      if (event.matches) setPlaying(false);
    };

    motionPreference.addEventListener("change", handleMotionPreference);
    return () => {
      motionPreference.removeEventListener("change", handleMotionPreference);
    };
  }, []);

  const handleControl = () => {
    if (playing) {
      setPlaying(false);
      return;
    }
    setRun((current) => current + 1);
    setPlaying(true);
  };

  return (
    <div className="relative overflow-hidden bg-[#e9d7ad]">
      {playing ? (
        <picture key={run} className="block">
          <source srcSet={`${animationBase}.webp`} type="image/webp" />
          <Image
            src={`${animationBase}.gif`}
            alt={animationAlt}
            width={1024}
            height={1024}
            loading="lazy"
            unoptimized
            className="block h-auto w-full"
          />
        </picture>
      ) : (
        <Image
          src={`${animationBase}-poster.png`}
          alt={animationAlt}
          width={1024}
          height={1024}
          loading="lazy"
          className="block h-auto w-full"
        />
      )}

      <button
        type="button"
        onClick={handleControl}
        aria-pressed={playing}
        className="absolute bottom-3 right-3 rounded-full border border-[color:var(--border)] bg-[color:var(--panel-strong)]/95 px-3 py-2 text-xs font-medium text-ink shadow-md backdrop-blur-sm transition hover:bg-[color:var(--panel-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine-700"
      >
        {playing ? "Pause animation" : "Play animation"}
      </button>
    </div>
  );
}
