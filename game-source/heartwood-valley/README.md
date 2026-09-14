# Stardate Valley

A compact, original TypeScript farming and polyamorous romance spoof for the browser. Inspired by Stardew-style farm life, with original characters, writing, art, and music. Formerly titled Heartwood Valley; the route and save key are retained for compatibility.

## Run

```sh
npm install
npm run dev
```

`npm run build` produces a portable static `dist/` directory. `npm test` checks farming, economy, relationships, save recovery, and map navigation. Vite uses relative asset paths so the build can live in a subdirectory or iframe.

## Play

- Click the map to walk. Click a crop, neighbor, or marked location to walk over and interact.
- WASD / arrows move, E or Space interacts, 1–6 select tools, F opens fishing, J opens the journal, and ? opens the field guide. Escape closes the notebook or current dialog.
- Garden beds and the neighbor list provide keyboard/touch alternatives to map interactions.
- Four turnips start planted. Water them, sleep, then harvest. Turnips take one watered night; strawberries and sunflowers take two.
- Talk and give a gift once per neighbor per day. Reach two hearts to date. All seven adults can be partners simultaneously.
- **Lord Goblin theTurd** lurks in the lower-left corner beside the farm. Click him or find him in Social. He loves fish, offers repeatable bawdy jokes through **Say something filthy**, and has his own compost-heap heart event. Joke requests do not add affection; daily chats and gifts do.
- With two or more partners, host the long-table picnic. Dating all seven completes the final journal milestone.
- For a short demonstration: **Grandpa’s letter → Skip to the flirting** (or **Field guide → Give me a little head start**) supplies ripe crops, gifts, and date-ready relationships while retaining existing progress.

Existing six-neighbor saves automatically gain the new goblin bond while retaining crops, resources, dates, and other progress.

Progress saves in localStorage on the current browser/device. Storage failure leaves the game playable and displays a notice. Sleep starts the next day; the clock caps at 11 pm with no forced bedtime or relationship penalties. There are no accounts, servers, analytics, or multiplayer.

## Structure

- `src/game.ts`: serializable game state and rules, independent of rendering.
- `src/world.ts`: canvas renderer, movement, walkable areas, and BFS click navigation.
- `src/main.ts`: interface, dialogue, inventory, fishing, and save orchestration.
- `src/retro.css`: responsive pixel interface, game HUD, notebook, and portrait dialogue.
- `src/audio.ts`: optional original synthesized chiptune and action chimes.
- `public/assets/`: original AI-generated village, portraits, character sprite sheet, item atlas, and dedicated goblin sprite and portrait.
- `public/fonts/`: self-hosted VT323 and Silkscreen fonts, with their SIL Open Font Licenses.
- `src/webmcp.ts`: optional, feature-detected farm tools for supporting browsers. WebMCP live-context validation was unavailable in this environment; it is not required to play.

This intentionally small demo uses one map, twelve beds, seven neighbors, three crops, and one fish. Character sprites, selected tools, crops, and action feedback render on canvas. Music begins only after enabling it and pauses when the tab is hidden. The date choices share the same positive relationship outcome. The parody uses original art and music; no Stardew Valley assets are included.

For a much larger game, separate scene/entity lifecycles, authored maps and collision layers, quest scripting, and versioned save migrations would be natural next steps.

## Cromblog

The static build is embedded at `/games/heartwood-valley` from `/games/heartwood-valley/index.html`, with a card in the Games list. Source is kept under `game-source/heartwood-valley` in Cromblog for reproducible updates.
