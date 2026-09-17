import type { CSSProperties } from "react";

import { vibeDoodles, type VibeDoodleId } from "@/content/doodle-vibe";

type NotebookDoodleProps = {
  id: VibeDoodleId;
  className?: string;
  /** Position in a group, used by the CSS to stagger the sketch-in reveal. */
  index?: number;
};

export function NotebookDoodle({ id, className, index }: NotebookDoodleProps) {
  const drawing = vibeDoodles[id];
  if (!drawing) throw new Error(`Unknown Doodle vibe drawing: ${id}`);
  const style: CSSProperties & Record<`--${string}`, number | string> = {
    aspectRatio: `${drawing.width} / ${drawing.height}`,
    backgroundColor: "currentColor",
    maskImage: `url("${drawing.src}")`,
    maskPosition: "center",
    maskRepeat: "no-repeat",
    maskSize: "contain",
    WebkitMaskImage: `url("${drawing.src}")`,
    WebkitMaskPosition: "center",
    WebkitMaskRepeat: "no-repeat",
    WebkitMaskSize: "contain"
  };
  if (index !== undefined) style["--doodle-index"] = index;

  return (
    <span
      className={["notebook-doodle", className].filter(Boolean).join(" ")}
      style={style}
      data-doodle-asset={id}
      data-doodle-placement={drawing.role}
      aria-hidden="true"
    />
  );
}
