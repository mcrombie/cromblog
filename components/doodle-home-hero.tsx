import Link from "next/link";

import { NotebookDoodle } from "@/components/notebook-doodle";
import { doodleVibeHero, vibeDoodles } from "@/content/doodle-vibe";

/* The Doodle Lab home hero: the notebook's Common Flicker climbs the page edge
 * beside the title. Both pieces render in every appearance and are hidden by
 * CSS outside Doodle. */
export function DoodleHomeFigure() {
  return (
    <div className="doodle-home-figure">
      <NotebookDoodle id={doodleVibeHero.figure} className="doodle-home-figure-drawing" />
    </div>
  );
}

export function DoodleHomeNote() {
  const drawing = vibeDoodles[doodleVibeHero.figure];
  const href = `/art?drawing=${encodeURIComponent(drawing.id)}`;

  return (
    <p className="doodle-home-note">
      <span>From the notebook: <em>{drawing.title}</em></span>
      <Link href={href}>View original drawing <span aria-hidden="true">↗</span></Link>
    </p>
  );
}
