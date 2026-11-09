// Current game artwork shared by blog previews, Projects, and Games.
export const gameArt = {
  // Published sage-37 renderer, captured offscreen from a replayed turn-28 game.
  clio: {
    src: "/cromblog/clio/clio-sage37-turn28.webp",
    alt: "Clio at turn 28: the Zholhen tribe beside mountains, rivers and woodland, with Gather, Move and End turn controls",
    width: 1600,
    height: 960,
    unoptimized: true,
    objectFit: "contain"
  },
  // M7 screenshot: cromonsters/artifacts/battle-ui/goblin-desktop.png.
  cromonsters: {
    src: "/cromblog/cromonsters/estate-goblin-battle.png",
    alt: "A farmhand facing a goblin raider in Cromonsters' estate battle",
    width: 1920,
    height: 1080
  }
} as const;
