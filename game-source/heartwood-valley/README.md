# Heartwood Valley

A compact, original TypeScript farming and polyamorous romance game for the browser. Inspired by the farming-life genre, with original characters, writing, art, and code.

## Run

```sh
npm install
npm run dev
```

`npm run build` produces a portable static `dist/` directory. `npm test` checks farming, economy, relationships, save recovery, and map navigation. Vite uses relative asset paths so the build can live in a subdirectory or iframe.

## Play

- Click the map to walk. Click a crop, neighbor, or marked location to walk over and interact.
- WASD / arrows move, E or Space interacts, 1–6 select tools, F opens fishing, and ? opens the field guide.
- Garden beds and the neighbor list provide keyboard/touch alternatives to map interactions.
- Four turnips start planted. Water them, sleep, then harvest. Turnips take one watered night; strawberries and sunflowers take two.
- Talk and give a gift once per neighbor per day. Reach two hearts to date. All six adults can be partners simultaneously.
- With two or more partners, host the long-table picnic. Dating all six completes the final journal milestone.
- For a short demonstration: **Field guide → Give me a little head start** supplies ripe crops, gifts, and date-ready relationships while retaining existing progress.

Progress saves in localStorage on the current browser/device. Storage failure leaves the game playable and displays a notice. Sleep starts the next day; the clock caps at 11 pm with no forced bedtime or relationship penalties. There are no accounts, servers, analytics, or multiplayer.

## Structure

- `src/game.ts`: serializable game state and rules, independent of rendering.
- `src/world.ts`: canvas renderer, movement, walkable areas, and BFS click navigation.
- `src/main.ts`: interface, dialogue, inventory, fishing, and save orchestration.
- `src/style.css`: responsive interface.
- `public/assets/`: two original AI-generated pixel-art assets.
- `src/webmcp.ts`: optional, feature-detected farm tools for supporting browsers. WebMCP live-context validation was unavailable in this environment; it is not required to play.

This intentionally small demo uses one map, twelve beds, six neighbors, three crops, and one fish. The character movement sprites and crops are rendered on canvas; the village and portraits are generated art. Sound is an optional synthesized action chime. The date choices share the same positive relationship outcome.

For a much larger game, separate scene/entity lifecycles, authored maps and collision layers, quest scripting, and versioned save migrations would be natural next steps.

## Cromblog

The static build is embedded at `/games/heartwood-valley` from `/games/heartwood-valley/index.html`, with a card in the Games list. Source is kept under `game-source/heartwood-valley` in Cromblog for reproducible updates.
