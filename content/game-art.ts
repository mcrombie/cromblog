// Current game artwork shared by blog previews, Projects, and Games.
export const gameArt = {
  // First Adviser illustration introduced in Clio commit 99e9719 (September 13, 2026).
  clio: {
    src: "/cromblog/clio/first-adviser.png",
    alt: "Pencil portrait of Clio's First Adviser, a bearded sage in a pointed hat",
    width: 1254,
    height: 1254
  },
  // M7 screenshot: cromonsters/artifacts/battle-ui/goblin-desktop.png.
  cromonsters: {
    src: "/cromblog/cromonsters/estate-goblin-battle.png",
    alt: "A farmhand facing a goblin raider in Cromonsters' estate battle",
    width: 1920,
    height: 1080
  }
} as const;
