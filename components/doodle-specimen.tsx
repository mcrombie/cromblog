"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NotebookDoodle } from "@/components/notebook-doodle";
import { doodleVibeForPath, vibeDoodles } from "@/content/doodle-vibe";

export function DoodleSpecimen() {
  const pathname = usePathname() ?? "/";
  const id = doodleVibeForPath(pathname);
  const drawing = vibeDoodles[id];

  return (
    <figure className="doodle-specimen" data-doodle-specimen={id}>
      <NotebookDoodle id={id} className="doodle-specimen-drawing" />
      <figcaption className="doodle-specimen-caption">
        <p className="doodle-specimen-eyebrow">From the notebook</p>
        <p className="doodle-specimen-title">{drawing.title}</p>
        <p className="doodle-specimen-collection">{drawing.collection}</p>
        <Link href={`/art?drawing=${encodeURIComponent(id)}`} className="doodle-specimen-link">
          Visit the Doodle Lab
        </Link>
      </figcaption>
    </figure>
  );
}
