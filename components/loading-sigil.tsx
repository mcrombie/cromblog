const LEAF_ANGLES = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

// Triangle vertices inscribed at r=62 about (100, 100), at -90deg, 30deg, 150deg.
const VERTICES = [
  { x: 100, y: 38 },
  { x: 153.7, y: 131 },
  { x: 46.3, y: 131 }
];

type LoadingSigilProps = {
  className?: string;
};

/**
 * The route sigil, drawn from theme tokens rather than baked pixels so that
 * every vibe recolors it through the palette it already defines.
 */
export function LoadingSigil({ className }: LoadingSigilProps) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <circle className="sigil-plate" cx="100" cy="100" r="99" />

      <g fill="none">
        <circle className="sigil-ring" cx="100" cy="100" r="94" />
        <circle className="sigil-ring-hair" cx="100" cy="100" r="88" />
        <circle className="sigil-ring-hair" cx="100" cy="100" r="70" />
      </g>

      <g className="sigil-leaf">
        {LEAF_ANGLES.map((angle) => (
          <path
            key={angle}
            d="M100 12 C105.5 17.5 105.5 24.5 100 30 C94.5 24.5 94.5 17.5 100 12 Z"
            transform={`rotate(${angle} 100 100)`}
          />
        ))}
      </g>

      <g className="sigil-seal">
        {[-90, 30, 150].map((angle) => (
          <circle
            key={angle}
            cx="100"
            cy="6"
            r="3"
            transform={`rotate(${angle + 90} 100 100)`}
          />
        ))}
      </g>

      <path
        className="sigil-figure"
        d={`M${VERTICES[0].x} ${VERTICES[0].y} L${VERTICES[1].x} ${VERTICES[1].y} L${VERTICES[2].x} ${VERTICES[2].y} Z`}
      />

      <g className="sigil-arc" fill="none">
        {VERTICES.map((vertex, index) => (
          <circle
            key={index}
            cx={vertex.x}
            cy={vertex.y}
            r="13"
            strokeDasharray="41 41"
            transform={`rotate(${index * 120 - 30} ${vertex.x} ${vertex.y})`}
          />
        ))}
      </g>

      <g className="sigil-node">
        {VERTICES.map((vertex, index) => (
          <circle key={index} cx={vertex.x} cy={vertex.y} r="4" />
        ))}
      </g>
    </svg>
  );
}
