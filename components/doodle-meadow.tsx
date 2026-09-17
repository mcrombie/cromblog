"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import { NotebookDoodle } from "@/components/notebook-doodle";
import { doodleVibeCompositions, doodleVibeFootForPath } from "@/content/doodle-vibe";

/* The page foot in the Doodle Lab vibe: route-specific compositions of intact
 * leaf and tree drawings. It renders in every appearance and is hidden by CSS
 * outside Doodle, so switching vibes never changes the markup. */
export function DoodleMeadow() {
  const pathname = usePathname() ?? "/";
  const foot = doodleVibeFootForPath(pathname);
  const root = useRef<HTMLDivElement>(null);

  // Drawings sketch in on load. A composition that starts below the fold is marked so the
  // CSS can hand its reveal to a scroll-driven timeline instead, where the browser has one.
  useEffect(() => {
    root.current?.querySelectorAll<HTMLElement>(".doodle-composition").forEach((composition) => {
      if (composition.getBoundingClientRect().top > window.innerHeight) {
        composition.classList.add("doodle-composition-below");
      }
    });
  }, [pathname]);

  return (
    <div ref={root} className="doodle-meadow" aria-hidden="true" data-doodle-foot={foot.join(" ")}>
      {foot.map((compositionId, slot) => {
        const composition = doodleVibeCompositions[compositionId];
        return (
          <div
            key={compositionId}
            className={`doodle-composition doodle-composition-slot-${slot + 1}`}
            data-doodle-composition={compositionId}
          >
            {composition.items.map((item, index) => (
              <span
                key={`${item.id}-${index}`}
                className="doodle-composition-item"
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  width: `${item.width}%`,
                  transform: `translate(-50%, -50%) rotate(${item.rotate}deg)`
                }}
              >
                <NotebookDoodle id={item.id} className="doodle-composition-drawing" index={slot * 3 + index} />
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
}
