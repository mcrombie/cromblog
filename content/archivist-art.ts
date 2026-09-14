const dimensions = { width: 1672, height: 941 };

export const archivistArt = {
  featured: {
    ...dimensions,
    src: "/cromblog/archivist-art/reading-history.png",
    alt: "Pencil illustration of an open history book becoming a wooded river valley, with a spreading oak, sailing vessel, and paper citation tabs in a lamplit archive.",
    objectPosition: "50% 50%"
  },
  context: {
    ...dimensions,
    src: "/cromblog/archivist-art/context-window.png",
    alt: "Three illustrated manuscript leaves held in a brass reading frame, selecting one landscape from a much larger open history book.",
    objectPosition: "50% 50%"
  },
  evaluation: {
    ...dimensions,
    src: "/cromblog/archivist-art/evaluating-evidence.png",
    alt: "A brass balance compares two botanical manuscript leaves while a magnifying glass examines the balance itself.",
    objectPosition: "50% 50%"
  },
  latency: {
    ...dimensions,
    src: "/cromblog/archivist-art/time-and-the-index.png",
    alt: "A brass hourglass beside an indexed history folio, with paper ribbons taking a short route and a longer route through the pages.",
    objectPosition: "42% 50%"
  }
} as const;
