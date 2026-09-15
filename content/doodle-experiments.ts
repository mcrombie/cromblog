import newWorlds from "@/content/doodle-experiment-batches/round-03.json";
import juneToJanuaryScenes from "@/content/doodle-experiment-batches/round-04.json";
import favoriteDrawingScenes from "@/content/doodle-experiment-batches/round-05.json";
import landscapePanoramas from "@/content/doodle-experiment-batches/round-06.json";
import januaryToJuneScenes from "@/content/doodle-experiment-batches/round-08.json";
import augustToJanuaryScenes from "@/content/doodle-experiment-batches/round-09.json";
import marchToAugustScenes from "@/content/doodle-experiment-batches/round-10.json";
import septemberToMarchScenes from "@/content/doodle-experiment-batches/round-11.json";
import aprilToAugustScenes from "@/content/doodle-experiment-batches/round-12.json";
import novemberToAprilScenes from "@/content/doodle-experiment-batches/round-13.json";
import februaryToNovemberScenes from "@/content/doodle-experiment-batches/round-14.json";
import earlyAndMiscScenes from "@/content/doodle-experiment-batches/round-15.json";
import hiddenGardenScene from "@/content/doodle-experiment-batches/round-16.json";
import characterEncounters from "@/content/doodle-experiment-batches/round-17.json";
import futureStudies from "@/content/doodle-experiment-batches/round-18.json";
import twentyCharacterStudies from "@/content/doodle-experiment-batches/round-19.json";
import memeGifs from "@/content/doodle-experiment-batches/round-20.json";
import crombCooCooScene from "@/content/doodle-experiment-batches/round-21.json";
import doodleLabBlogScenes from "@/content/doodle-experiment-batches/round-22.json";
import crombotComic from "@/content/doodle-experiment-batches/round-23.json";

export type DoodleExperiment = {
  id: string;
  title: string;
  kind: "Collage" | "Mosaic" | "Scene" | "Animation" | "Comic";
  src: string;
  alt: string;
  description: string;
  image: { width: number; height: number };
  round: string;
  sourceIds: readonly string[];
  animation?: { mp4: string; gif: string; durationSeconds: number };
};

export const doodleExperimentsDescription =
  "Scenes, comics, and animated experiments made with ImageGen from my notebook doodles and Crombot studies, exploring how familiar characters can share new worlds.";

export const doodleExperiments: readonly DoodleExperiment[] = [
  ...(crombotComic as DoodleExperiment[]),
  ...(doodleLabBlogScenes as DoodleExperiment[]),
  ...(crombCooCooScene as DoodleExperiment[]),
  ...(memeGifs as DoodleExperiment[]),
  ...(twentyCharacterStudies as DoodleExperiment[]),
  ...(characterEncounters as DoodleExperiment[]),
  ...(futureStudies as DoodleExperiment[]),
  ...(hiddenGardenScene as DoodleExperiment[]),
  ...(earlyAndMiscScenes as DoodleExperiment[]),
  ...(februaryToNovemberScenes as DoodleExperiment[]),
  ...(novemberToAprilScenes as DoodleExperiment[]),
  ...(aprilToAugustScenes as DoodleExperiment[]),
  ...(septemberToMarchScenes as DoodleExperiment[]),
  ...(marchToAugustScenes as DoodleExperiment[]),
  ...(augustToJanuaryScenes as DoodleExperiment[]),
  ...(januaryToJuneScenes as DoodleExperiment[]),
  {
    id: "round-07-sculpture-park-in-motion",
    title: "Sculpture Park in Motion",
    kind: "Animation",
    src: "/cromblog/doodle-experiments/round-07/sculpture-park-in-motion.png",
    alt: "A pencil sculpture park comes gently to life as a top-hatted snail glides, a bow-tied crocodile and an eye-balancing reptile sway, and the floating eye bobs above the reptile's hand.",
    description: "A gentle drift through the sculpture park, with a few visitors beginning to stir.",
    image: { width: 1280, height: 640 },
    round: "07",
    sourceIds: [
      "jj2526-p263-a", "jj2526-p229-a", "jj2526-p293-a", "jj2526-p305-a",
      "jj2526-p267-a", "jj2526-p275-a", "jj2526-p303-a", "jj2526-p276-b",
      "jj2526-p304-a", "jj2526-p215-a", "jj2526-p258-a", "bow-tied-crocodile-01"
    ],
    animation: {
      mp4: "/cromblog/doodle-experiments/round-07/sculpture-park-in-motion.mp4",
      gif: "/cromblog/doodle-experiments/round-07/sculpture-park-in-motion.gif",
      durationSeconds: 8
    }
  },
  ...(landscapePanoramas as DoodleExperiment[]),
  ...(favoriteDrawingScenes as DoodleExperiment[]),
  ...(juneToJanuaryScenes as DoodleExperiment[]),
  ...(newWorlds as DoodleExperiment[]),
  {
    id: "round-02-seed-moon-meadow",
    title: "Seed Moon Meadow",
    kind: "Scene",
    src: "/cromblog/doodle-experiments/round-02/seed-moon-meadow.png",
    alt: "A wide-eyed orb juggler, tall feathered bird, winged insect, and feathered eye share a lightly sketched meadow beneath small moons and stars.",
    description: "A juggler and a few curious visitors gather beneath seed-sized moons.",
    image: { width: 1536, height: 1024 },
    round: "02",
    sourceIds: [
      "jm26-p189-a", "jm26-p196-a", "jm26-p170-a", "feathered-eye-01", "jm26-p171-a"
    ]
  },
  {
    id: "round-02-star-pond",
    title: "Star Pond",
    kind: "Scene",
    src: "/cromblog/doodle-experiments/round-02/star-pond.png",
    alt: "A curled fish floats in a pale blue pencil pond while a top-hatted one-eyed gentleman, orb-balancing slug, and eye-flower watch beneath a crescent moon.",
    description: "A curled fish disturbs the still water of a small moonlit pond.",
    image: { width: 1536, height: 1024 },
    round: "02",
    sourceIds: [
      "jm26-p203-a", "one-eyed-gentleman-01", "orb-balancing-slug-01",
      "eye-flower-sentinel-01", "leaf-vine-01"
    ]
  },
  {
    id: "round-02-moonlit-crossing",
    title: "Moonlit Crossing",
    kind: "Scene",
    src: "/cromblog/doodle-experiments/round-02/moonlit-crossing.png",
    alt: "A leaf-eared cat, caped rabbit, and orb-balancing slug meet beside a winding path, with an eye-flower and rooted spore trees under a sparse starry sky.",
    description: "A winding path brings the cat, rabbit, and slug together under the moon.",
    image: { width: 1536, height: 1024 },
    round: "02",
    sourceIds: [
      "jm26-p197-a", "caped-rabbit-01", "orb-balancing-slug-01",
      "eye-flower-sentinel-01", "jm26-p171-a"
    ]
  },
  {
    id: "round-01-doodle-collage",
    title: "Doodle Collage",
    kind: "Collage",
    src: "/cromblog/doodle-experiments/round-01/doodle-collage.png",
    alt: "Pencil-drawn creatures, an owl, a leaf-eared cat, a curled fish, and leafy sprigs overlap like paper scraps on an ivory background.",
    description: "Familiar creatures and small botanical details meet in a loose paper collage.",
    image: { width: 1536, height: 1024 },
    round: "01",
    sourceIds: [
      "owl-on-branch-01", "jm26-p196-a", "jm26-p197-a", "jm26-p203-a",
      "jm26-p170-a", "jm26-p189-a", "jm26-p172-a", "one-eyed-gentleman-01",
      "orb-balancing-slug-01", "leaf-vine-01"
    ]
  },
  {
    id: "round-01-owl-mosaic",
    title: "Owl Mosaic",
    kind: "Mosaic",
    src: "/cromblog/doodle-experiments/round-01/owl-mosaic.png",
    alt: "A square grid of tiny doodles forms a large dark owl perched on a branch, with pale tiles defining its face and belly.",
    description: "Look closely for individual doodles; step back to find the owl.",
    image: { width: 1254, height: 1254 },
    round: "01",
    sourceIds: [
      "owl-on-branch-01", "jm26-p196-a", "jm26-p197-a", "jm26-p203-a",
      "jm26-p170-a", "jm26-p189-a", "jm26-p172-a", "one-eyed-gentleman-01",
      "orb-balancing-slug-01", "leaf-vine-01"
    ]
  },
  {
    id: "round-01-woodland-gathering",
    title: "Woodland Gathering",
    kind: "Scene",
    src: "/cromblog/doodle-experiments/round-01/woodland-gathering.png",
    alt: "A bow-tied crocodile, caped rabbit, leaf-eared cat, and tall feathered bird gather in a softly colored woodland clearing.",
    description: "Four notebook characters gather beneath a canopy of pencil-drawn trees.",
    image: { width: 1536, height: 1024 },
    round: "01",
    sourceIds: [
      "jm26-p197-a", "jm26-p196-a", "jm26-p145-a",
      "caped-rabbit-01", "bow-tied-crocodile-01"
    ]
  },
  {
    id: "round-01-river-voyage",
    title: "River Voyage",
    kind: "Scene",
    src: "/cromblog/doodle-experiments/round-01/river-voyage.png",
    alt: "A one-eyed gentleman in a top hat stands in a leaf boat on a blue river, above a curled fish, while a wren and an orb-balancing slug watch from the banks.",
    description: "A leaf boat carries the one-eyed gentleman past a fish, a wren, and a patient slug.",
    image: { width: 1536, height: 1024 },
    round: "01",
    sourceIds: [
      "one-eyed-gentleman-01", "orb-balancing-slug-01", "carolina-wren-01",
      "leaf-vine-01", "jm26-p203-a"
    ]
  },
  {
    id: "round-01-moon-garden",
    title: "Moon Garden",
    kind: "Scene",
    src: "/cromblog/doodle-experiments/round-01/moon-garden.png",
    alt: "An eye-flower, feathered eye, round wide-eyed creature, and smiling winged insect inhabit a garden of rooted spore trees beneath a crescent moon and stars.",
    description: "Strange flowers, floating eyes, and a winged visitor share a quiet lunar garden.",
    image: { width: 1536, height: 1024 },
    round: "01",
    sourceIds: [
      "eye-flower-sentinel-01", "feathered-eye-01", "jm26-p189-a",
      "jm26-p170-a", "jm26-p171-a"
    ]
  }
];
