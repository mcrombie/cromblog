import type { CSSProperties } from "react";

import field from "@/content/doodle-vibe-field.generated.json";

type FieldDrawing = {
  id: string;
  src: string;
  maskWidth: number;
  maskHeight: number;
  width: number;
  x: number;
  y: number;
  rotate: number;
  narrow?: { x: number; y: number };
};

type FieldStyle = CSSProperties & Record<`--${string}`, number | string>;

const sheets: Record<"main" | "sidebar", readonly FieldDrawing[]> = field;

/* The Doodle Lab background: a few dozen of the best notebook drawings, each drawn once and
 * scattered over a sheet the size of the viewport. It renders in every appearance and is
 * hidden by CSS outside Doodle. Rebuild the layout with scripts/build-doodle-vibe-field.py. */
export function DoodleField({ placement }: { placement: "main" | "sidebar" }) {
  const rootStyle: FieldStyle = { "--field-narrow-scale": field.narrowScale };

  return (
    <div className={`doodle-field doodle-field-${placement}`} style={rootStyle} aria-hidden="true">
      <div className="doodle-field-sheet">
        {sheets[placement].map((drawing) => {
          const style: FieldStyle = {
            "--field-src": `url("${drawing.src}")`,
            "--field-x": `${drawing.x}%`,
            "--field-y": `${drawing.y}%`,
            "--field-width": `${drawing.width}rem`,
            "--field-turn": `${drawing.rotate}deg`,
            aspectRatio: `${drawing.maskWidth} / ${drawing.maskHeight}`
          };
          if (drawing.narrow) {
            style["--field-narrow-x"] = `${drawing.narrow.x}%`;
            style["--field-narrow-y"] = `${drawing.narrow.y}%`;
          }
          return (
            <span
              key={drawing.id}
              className={`doodle-field-drawing${drawing.narrow || placement === "sidebar" ? "" : " is-wide-only"}`}
              style={style}
              data-doodle-asset={drawing.id}
            />
          );
        })}
      </div>
    </div>
  );
}
