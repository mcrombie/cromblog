/**
 * Editable draft for the Doodle Lab visual essay.
 * Replace the Latin copy here; page.tsx owns the layout, not the prose.
 * Captions and headings are deliberately placeholders. Image descriptions stay
 * descriptive for accessibility. This draft has no invented publication date.
 */
export type DoodleLabArtwork = {
  id: string;
  src: string;
  width: number;
  height: number;
  title: string;
  alt: string;
  caption: string;
  number: string;
  kind?: "drawing";
};

const media = "/cromblog/doodle-lab";

export const doodleLabPost = {
  title: "( ) Doodle Lab: Fusing Five Years of Doodling into a Web Art Gallery",
  titlePrefix: "( )",
  titleName: "Doodle Lab:",
  titleSubtitle: "Fusing Five Years of Doodling into a Web Art Gallery",
  description: "Tentative and still in development: a Doodle Lab visual essay template with Latin placeholder text that Michael will replace with his own words.",
  developmentLabel: "TENTATIVE — STILL IN DEVELOPMENT",
  developmentNotice: "This post is a work in progress. The Latin text is placeholder copy; Michael will keep refining this template and replace it with his own words.",
  eyebrow: "Studia · Fragmenta · Imaginatio",
  introduction: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ex parvis lineis, nova spatia; ex paginis quietis, mirabilia.",
  nav: [
    { href: "#initium", label: "Initium", number: "01" },
    { href: "#fragmenta", label: "Fragmenta", number: "02" },
    { href: "#mundi", label: "Mundi", number: "03" },
    { href: "#deinceps", label: "Deinceps", number: "04" }
  ],
  opening: {
    eyebrow: "De primis lineis",
    title: "Omnia incipiunt in margine.",
    lead: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae lorem vel neque facilisis volutpat. Curabitur in libero quis arcu tempus elementum; quisque pagina, parvus mundus.",
    paragraphs: [
      "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae. Aenean commodo ligula eget dolor. Nulla facilisi. Cras euismod, risus sed tincidunt interdum, urna lacus suscipit erat, non finibus magna sapien id leo.",
      "Suspendisse potenti. Aliquam erat volutpat. Mauris at nibh ut arcu mollis mattis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Interdum et malesuada fames ac ante ipsum primis in faucibus."
    ],
    noteTitle: "In margine",
    note: "Nulla linea perit. Aliud invenitur, aliud mutatur, aliud in pagina manet."
  },
  sources: {
    eyebrow: "Fragmenta originalia",
    title: "Ex charta, in lucem.",
    text: "Nunc tincidunt, magna vel cursus commodo, neque sem feugiat erat, sit amet viverra dui ipsum vel erat. Integer ac lacus vitae nibh porttitor laoreet.",
    note: "Vestigia manus, initia mundorum."
  },
  worlds: {
    eyebrow: "Studia imaginaria",
    title: "Una linea. Infiniti mundi.",
    text: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Nam viverra, lorem sed tempus ornare, lacus purus aliquam urna, vitae faucibus nibh neque quis nibh.",
    passage: "Quisque finibus tellus vel quam vestibulum, vitae pharetra erat sollicitudin. Donec posuere erat a felis fermentum, sed feugiat nisi aliquet. Morbi a justo vitae lorem hendrerit pulvinar."
  },
  interlude: {
    quote: "Parva in pagina. Immensa in animo.",
    eyebrow: "Inter lineas",
    title: "Quod manet, quod mutatur.",
    paragraphs: [
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem. Praesent vitae mi in velit pulvinar faucibus. Nulla vulputate lectus quis enim bibendum, sed aliquet nisl egestas. Donec quis lorem ut nisi volutpat faucibus.",
      "Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et."
    ],
    note: "Vestibulum, memoria, imaginatio."
  },
  ending: {
    eyebrow: "Et deinceps",
    title: "Adhuc, tantum initium.",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam porta sem malesuada magna mollis euismod. Cras mattis consectetur purus sit amet fermentum. Aliquam erat volutpat; semper est altera pagina.",
    signature: "Finis paginae, non fabulae."
  }
} as const;

export const doodleLabArtworks: DoodleLabArtwork[] = [
  {
    id: "from-a-line-a-world",
    src: `${media}/from-a-line-a-world.png`,
    width: 1672,
    height: 941,
    title: "Ex linea, mundus",
    alt: "An open sketchbook becomes a sunlit fantasy world: pencil roots form a bridge beneath a monumental tree-crowned bird, with a traveler, trumpet turtle, and orb juggler.",
    caption: "Lorem ipsum dolor sit amet. Ex lineis familiaribus, nova et mirabilia.",
    number: "01"
  },
  {
    id: "tidal-observatory",
    src: `${media}/01-tidal-observatory.png`,
    width: 1672,
    height: 941,
    title: "Litus et caelum",
    alt: "A caped rabbit and a one-eyed gentleman align a brass tide instrument among sculptural towers above a bright turquoise sea.",
    caption: "Donec ullamcorper nulla non metus auctor fringilla. Aenean eu leo quam.",
    number: "02"
  },
  {
    id: "glasshouse-monsoon",
    src: `${media}/02-glasshouse-monsoon.png`,
    width: 1672,
    height: 941,
    title: "Hortus in pluvia",
    alt: "A wooden leaf-hatted robot directs a raindrop toward a fern beside a spiral-shelled snail in a luminous botanical glasshouse.",
    caption: "Curabitur blandit tempus porttitor. Etiam porta sem malesuada magna.",
    number: "03"
  },
  {
    id: "cinder-procession",
    src: `${media}/03-cinder-procession.png`,
    width: 1672,
    height: 941,
    title: "Iter per cineres",
    alt: "A bow-tied crocodile and a striped-hat bird wizard carry a small green seedling through monumental terracotta ridges.",
    caption: "Integer posuere erat a ante venenatis dapibus posuere velit aliquet.",
    number: "04"
  },
  {
    id: "winter-archive",
    src: `${media}/04-winter-archive.png`,
    width: 1672,
    height: 941,
    title: "Memoria hiemis",
    alt: "An antlered deer and an eccentric shaggy owl study an autumn leaf in a folio beside a snowbound manor archive.",
    caption: "Maecenas sed diam eget risus varius blandit sit amet non magna.",
    number: "05"
  },
  {
    id: "midnight-estuary",
    src: `${media}/05-midnight-estuary.png`,
    width: 1671,
    height: 941,
    title: "Ubi flumina dormiunt",
    alt: "An antlered canoe paddler reaches toward the branching whiskers of a giant fish beneath stars in a luminous estuary.",
    caption: "Aenean lacinia bibendum nulla sed consectetur. Vestibulum id ligula porta.",
    number: "06"
  }
];

/** Original archive drawings used as visual source material in this essay's scenes. */
export const doodleLabSources: DoodleLabArtwork[] = [
  {
    id: "source-leaf-robot",
    src: "/cromblog/doodles/2024-03-08/ma24-p208-a.png",
    width: 672,
    height: 1600,
    title: "Forma et folium",
    alt: "Original pencil doodle of a wooden robot with an enormous veined leaf for a hat.",
    caption: "Lorem ipsum, prima figura.",
    number: "A",
    kind: "drawing"
  },
  {
    id: "source-spiral-snail",
    src: "/cromblog/doodles/2023-09-2024-03/sm2324-p012-a.png",
    width: 753,
    height: 431,
    title: "Spira quieta",
    alt: "Original pencil doodle of a snail with a large spiral shell.",
    caption: "Curabitur, linea secunda.",
    number: "B",
    kind: "drawing"
  },
  {
    id: "source-antlered-deer",
    src: "/cromblog/doodles/2024-03-08/ma24-p014-a.png",
    width: 1147,
    height: 1107,
    title: "Silvae memoria",
    alt: "Original pencil drawing of a deer with branching antlers.",
    caption: "Vestibulum, tertia forma.",
    number: "C",
    kind: "drawing"
  },
  {
    id: "source-whiskered-fish",
    src: "/cromblog/doodles/2025-01-06/jj25-p146-a.png",
    width: 1600,
    height: 1295,
    title: "Sub aqua",
    alt: "Original pencil doodle of a giant whiskered fish with a tiny passenger.",
    caption: "Aenean, fabula quarta.",
    number: "D",
    kind: "drawing"
  }
];
