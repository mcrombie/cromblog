import { NotebookDoodle } from "@/components/notebook-doodle";
import { doodleVibeMeadow, doodleVibeLeafClusters } from "@/content/doodle-vibe";

export function DoodleMeadow() {
  return (
    <>
        <div className="doodle-meadow doodle-meadow-field-notebook" aria-hidden="true">
          {doodleVibeMeadow.map(({ id, role, mobile }, index) => (
            <NotebookDoodle
              key={id}
              id={id}
              className={[
                "doodle-meadow-item",
                `doodle-meadow-item-${index + 1}`,
                `doodle-meadow-${role}`,
                mobile ? "doodle-meadow-mobile" : ""
              ].filter(Boolean).join(" ")}
            />
          ))}
        </div>
        <div className="doodle-meadow doodle-meadow-original-strokes" aria-hidden="true">
          {doodleVibeLeafClusters.map(({ id, primary, leaves }) => (
            <div
              key={id}
              data-leaf-composition={id}
              className={`doodle-leaf-cluster${primary ? " doodle-leaf-cluster-primary" : ""}`}
            >
              {leaves.map(({ id: drawingId, x, y, width, rotate }, index) => (
                <span
                  key={`${drawingId}-${index}`}
                  className="doodle-leaf"
                  style={{ left: `${x}%`, top: `${y}%`, width: `${width}%`, transform: `translate(-50%, -50%) rotate(${rotate}deg)` }}
                >
                  <NotebookDoodle id={drawingId} className="doodle-leaf-drawing" />
                </span>
              ))}
            </div>
          ))}
        </div>
    </>
  );
}
