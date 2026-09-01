import type { DoodleAssetId } from "@/content/doodles";

export type ArtGallery = {
  id: string;
  title: "Birds" | "Characters" | "Miscellaneous";
  works: readonly {
    assetId: DoodleAssetId;
    alt: string;
  }[];
};

export const artGalleries = [
  {
    id: "birds",
    title: "Birds",
    works: [
      {
        assetId: "common-flicker-tree-01",
        alt: "Graphite sketch of a common flicker clinging vertically to the side of a tree trunk."
      },
      {
        assetId: "owl-on-branch-01",
        alt: "Graphite sketch of a front-facing horned owl perched on a bent branch."
      },
      {
        assetId: "red-eyed-vireo-01",
        alt: "Graphite sketch of a rounded red-eyed vireo perched on a thin twig and facing left."
      },
      {
        assetId: "carolina-wren-01",
        alt: "Graphite sketch of a Carolina wren perched in left-facing profile, with its compact body and tail cocked sharply upward."
      },
      {
        assetId: "raven-01",
        alt: "Graphite profile study of a raven facing left, with a bright eye, heavy beak, and folded wing."
      },
      {
        assetId: "scissor-tailed-flycatcher-01",
        alt: "Graphite sketch of a scissor-tailed flycatcher perched in profile, its long tail extending below the branch."
      }
    ]
  },
  {
    id: "characters",
    title: "Characters",
    works: [
      {
        assetId: "crombot-1-01",
        alt: "Graphite drawing of Crombot 1, a homemade robot with twin ultrasonic-sensor eyes, exposed electronics, wheels, and a crown of looping jumper wires."
      },
      {
        assetId: "one-eyed-gentleman-01",
        alt: "Graphite drawing of a one-eyed birdlike gentleman in a top hat, bow tie, trousers, and cane."
      },
      {
        assetId: "bow-tied-crocodile-01",
        alt: "Graphite drawing of a bespectacled crocodile wearing a bow tie and patterned trousers."
      },
      {
        assetId: "caped-rabbit-01",
        alt: "Graphite drawing of a wide-eyed rabbit wearing a bow tie and flowing cape."
      },
      {
        assetId: "orb-balancing-slug-01",
        alt: "Graphite drawing of a slug balancing a shaded orb above its head."
      }
    ]
  },
  {
    id: "miscellaneous",
    title: "Miscellaneous",
    works: [
      {
        assetId: "eye-flower-sentinel-01",
        alt: "Graphite drawing of a surreal eye-flower sentinel, with a moonlike face above a shaded body and pedestal."
      },
      {
        assetId: "feathered-eye-01",
        alt: "Graphite drawing of an almond-shaped eye atop a long serrated feather or leaf, with two wing-like forms."
      },
      {
        assetId: "leaf-vine-01",
        alt: "Graphite line drawing of a slender curling vine with alternating leaves."
      }
    ]
  }
] as const satisfies readonly ArtGallery[];
