"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { GARDEN_DAY, GARDEN_EPOCH, GARDEN_YEAR, clampGardenView, gardenAge, gardenCalendar, gardenDate, gardenPlaces, gardenTrees, treeGrowth, type GardenPlace } from "@/lib/living-garden";
import styles from "./living-garden.module.css";

const HOME = { zoom: 1, x: 50, y: 50 };
const MAX_DAYS = 3650;
const MIN_DAYS = -365;

function specimenPosition(cell: number): CSSProperties {
  return { backgroundPosition: `${(cell % 4) * 100 / 3}% ${Math.floor(cell / 4) * 100}%` };
}

export function LivingGarden({ embedded = false }: { embedded?: boolean }) {
  // A stable first render keeps server HTML and hydration identical. The clock
  // starts in the effect and thereafter follows real time, including after sleep.
  const [now, setNow] = useState<number | null>(null);
  const [offset, setOffset] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [view, setView] = useState(HOME);
  const [place, setPlace] = useState<GardenPlace>("oak");
  const [closeup, setCloseup] = useState(false);
  const [markers, setMarkers] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const viewport = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const drag = useRef<{ x: number; y: number; view: typeof HOME } | null>(null);
  const pinch = useRef<{ distance: number; view: typeof HOME } | null>(null);
  const date = (now ?? GARDEN_EPOCH) + offset * GARDEN_DAY;
  const calendar = gardenCalendar(date);
  const selected = gardenPlaces.find((entry) => entry.id === place)!;
  const age = gardenAge(date);
  const isLive = offset === 0 && !playing;

  useEffect(() => {
    const update = () => setNow(Date.now());
    update();
    const timer = window.setInterval(update, 30_000);
    document.addEventListener("visibilitychange", update);
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", update);
      preference.removeEventListener("change", updatePreference);
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    if (reducedMotion) { setPlaying(false); return; }
    // Playback is an explicit preview, never a change to the planting date.
    const timer = window.setInterval(() => {
      setOffset((days) => Math.min(MAX_DAYS, days + 7));
    }, 350);
    return () => window.clearInterval(timer);
  }, [playing, reducedMotion]);

  useEffect(() => {
    if (offset >= MAX_DAYS) setPlaying(false);
  }, [offset]);

  function changeZoom(factor: number) {
    setView((current) => clampGardenView({ ...current, zoom: current.zoom * factor }));
  }

  function visit(id: GardenPlace) {
    const next = gardenPlaces.find((entry) => entry.id === id)!;
    setPlace(id);
    setCloseup(false);
    setImageError(false);
    setView(clampGardenView({ zoom: next.zoom, x: next.x, y: next.y }));
  }

  function resetView() {
    setCloseup(false);
    setImageError(false);
    setView(HOME);
  }

  function openStrawberries() {
    setPlace("strawberries");
    setCloseup(true);
    setImageError(false);
    setView(HOME);
  }

  function changeTime(days: number) {
    setPlaying(false);
    setOffset(Math.max(MIN_DAYS, Math.min(MAX_DAYS, days)));
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("button") || (event.pointerType === "mouse" && event.button !== 0)) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    event.currentTarget.setPointerCapture(event.pointerId);
    const points = Array.from(pointers.current.values());
    if (points.length === 2) {
      pinch.current = { distance: Math.max(1, Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y)), view };
      drag.current = null;
    } else {
      drag.current = { x: event.clientX, y: event.clientY, view };
    }
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const points = Array.from(pointers.current.values());
    if (points.length === 2 && pinch.current) {
      const distance = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
      setView(clampGardenView({ ...pinch.current.view, zoom: pinch.current.view.zoom * distance / pinch.current.distance }));
    } else if (drag.current && viewport.current) {
      const rect = viewport.current.getBoundingClientRect();
      const start = drag.current;
      setView(clampGardenView({ zoom: start.view.zoom, x: start.view.x - (event.clientX - start.x) / rect.width * 100 / start.view.zoom, y: start.view.y - (event.clientY - start.y) / rect.height * 100 / start.view.zoom }));
    }
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    pointers.current.delete(event.pointerId);
    pinch.current = null;
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    const remaining = Array.from(pointers.current.values())[0];
    if (remaining) drag.current = { ...remaining, view };
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;
    const pan = 8 / view.zoom;
    if (event.key === "+" || event.key === "=") changeZoom(1.3);
    else if (event.key === "-") changeZoom(1 / 1.3);
    else if (event.key === "Home" || event.key === "Escape") resetView();
    else if (event.key === "ArrowLeft") setView(clampGardenView({ ...view, x: view.x - pan }));
    else if (event.key === "ArrowRight") setView(clampGardenView({ ...view, x: view.x + pan }));
    else if (event.key === "ArrowUp") setView(clampGardenView({ ...view, y: view.y - pan }));
    else if (event.key === "ArrowDown") setView(clampGardenView({ ...view, y: view.y + pan }));
    else return;
    event.preventDefault();
  }

  const Heading = embedded ? "h2" : "h1";
  const transform = `translate(${50 - view.x * view.zoom}%, ${50 - view.y * view.zoom}%) scale(${view.zoom})`;

  return (
    <section className={styles.garden} aria-label="The Slow Garden">
      <div className={styles.masthead}>
        <p className={styles.eyebrow}>Cromblog · A greenery workshop</p>
        <p className={styles.folio}>Plate I / Northern & central Virginia</p>
      </div>
      <header className={styles.heading}>
        <Heading>The Slow Garden</Heading>
        {embedded ? <Link href="/art/garden">Open the garden ↗</Link> : <span className={styles.folio}>Begun in a Signal September</span>}
      </header>
      <p className={styles.lede}>A little piece of woodland, left to grow. Follow a branch, look beneath a leaf, come back after a while.</p>

      <div className={styles.workspace}>
        <div className={styles.plate}>
          <div className={styles.plateTop}>
            <span>{closeup ? "Detail study · The strawberry republic" : "A garden in ink, leaf & passing time"}</span>
            <span className={isLive ? styles.live : undefined}>{now === null ? "Opening the garden…" : isLive ? "Growing with the clock" : "Time study"}</span>
          </div>
          <div
            ref={viewport}
            className={styles.viewport}
            data-zoomed={view.zoom > 1}
            data-closeup={closeup}
            tabIndex={0}
            role="region"
            aria-label={closeup ? "Strawberry patch close-up. Plus and minus zoom; arrow keys pan; Home returns to the garden." : "Illustrated living garden. Plus and minus zoom; arrow keys pan; numbered places open field notes."}
            onKeyDown={onKeyDown}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onDoubleClick={(event) => { if (!(event.target as HTMLElement).closest("button")) changeZoom(view.zoom >= 4.9 ? .2 : 1.5); }}
          >
            <div className={styles.world} style={{ transform }} data-season={calendar.season}>
              {/* Native images preserve the engraved source at every zoom level. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img key={closeup ? "detail" : "garden"} className={styles.landscape} src={closeup ? "/cromblog/garden/strawberry-republic.png" : "/cromblog/garden/woodland.png"} width={closeup ? 1536 : 1672} height={closeup ? 1024 : 941} alt={closeup ? "Two squirrels dispute an acorn hoard among strawberry leaves, ferns and mushrooms. A robin, a snail and an acorn-cap teacup hide in the undergrowth." : "A colored pencil and ink woodland on aged paper: an oak canopy, pine ridge, winding water, feathery cypress, orchard and strawberry beds."} draggable={false} onError={() => setImageError(true)} />
              {!closeup && [...gardenTrees].sort((a, b) => a.y - b.y).map((tree) => (
                <div key={tree.name} className={styles.tree} data-evergreen={tree.evergreen} style={{ left: `${tree.x}%`, top: `${tree.y}%`, width: `${tree.size}%` }} aria-hidden="true">
                  <div className={styles.treeInner} style={{ transform: `scale(${treeGrowth(date, tree.years)})` }}>
                    <span className={styles.specimen} style={specimenPosition(tree.cell)} />
                  </div>
                </div>
              ))}
              <div className={styles.light} data-light={calendar.light} />
              {!closeup && markers && gardenPlaces.filter((entry) => Math.abs(entry.x - view.x) <= 50 / view.zoom && Math.abs(entry.y - view.y) <= 50 / view.zoom).map((entry) => (
                <button key={entry.id} type="button" className={styles.marker} style={{ left: `${entry.x}%`, top: `${entry.y}%`, transform: `translate(-50%, -50%) scale(${1 / view.zoom})` }} aria-label={`Explore ${entry.name}`} aria-pressed={place === entry.id} onClick={() => visit(entry.id)}>{entry.number}</button>
              ))}
            </div>
            {view.zoom > 1 && <span className={styles.lensLabel}>{closeup ? "Among the strawberries" : selected.subtitle}</span>}
            {imageError && <div className={styles.error}><p>This plate could not be loaded.</p><button type="button" className={styles.button} onClick={() => window.location.reload()}>Try again</button></div>}
          </div>
          <div className={styles.toolbar}>
            <div className={styles.tools} aria-label="Garden magnification">
              <button className={styles.button} type="button" aria-label="Zoom out" onClick={() => changeZoom(1 / 1.3)} disabled={view.zoom <= 1}>−</button>
              <output className={styles.zoomReadout} aria-label="Magnification">{view.zoom.toFixed(1)}×</output>
              <button className={styles.button} type="button" aria-label="Zoom in" onClick={() => changeZoom(1.3)} disabled={view.zoom >= 5}>+</button>
              <button className={styles.button} type="button" onClick={resetView}>Whole garden</button>
            </div>
            <button className={styles.button} type="button" aria-pressed={markers} onClick={() => setMarkers(!markers)} disabled={closeup}>{markers ? "Hide" : "Show"} field marks</button>
          </div>
          <p className={styles.hint}>Choose a numbered place, or magnify and drag to wander. Keyboard: + / − and arrow keys. On touch, zoom in to pan or pinch.</p>
        </div>

        <aside className={styles.notebook} aria-label="Garden field notes">
          <div>
            <h2 className={styles.notebookTitle}>Places to linger</h2>
            <ol className={styles.placeList}>
              {gardenPlaces.map((entry) => <li key={entry.id}><button className={styles.placeButton} type="button" aria-pressed={place === entry.id} onClick={() => visit(entry.id)}><span>{entry.number}</span>{entry.name}</button></li>)}
            </ol>
          </div>
          <div aria-live="polite" aria-atomic="true">
            <p className={styles.eyebrow}>Field note {selected.number}</p>
            <h3 className={styles.noteTitle}>{selected.name}</h3>
            <p className={styles.noteCopy}>{selected.note}</p>
            <p className={styles.inhabitants}>{selected.inhabitants}</p>
            {place === "strawberries" && <button className={`${styles.button} ${styles.primary}`} type="button" onClick={closeup ? resetView : openStrawberries}>{closeup ? "Back to the woodland" : "Look beneath the leaves ↗"}</button>}
          </div>
        </aside>
      </div>

      <div className={styles.clock}>
        <div>
          <p className={styles.eyebrow}>{isLive ? "In the garden today" : "An imagined future / past"}</p>
          <time className={styles.date} dateTime={new Date(date).toISOString()}>{now === null ? "The garden is waking" : gardenDate(date)}</time>
          <p className={styles.seasonNote}>{calendar.note}</p>
        </div>
        <div>
          <label className={styles.timeLabel} htmlFor={embedded ? "garden-time-embedded" : "garden-time"}><span>Let the years pass</span><span>{offset === 0 ? "Today" : `${offset > 0 ? "+" : "−"}${Math.abs(offset) < 365 ? `${Math.abs(offset)} days` : `${(Math.abs(offset) / GARDEN_YEAR).toFixed(1)} years`}`}</span></label>
          <input id={embedded ? "garden-time-embedded" : "garden-time"} className={styles.range} type="range" min={MIN_DAYS} max={MAX_DAYS} step="1" value={offset} onChange={(event) => changeTime(Number(event.target.value))} aria-valuetext={`${gardenDate(date)}; ${offset} days from today`} />
          <div className={styles.rangeEnds}><span>A year ago</span><span>Ten years from now</span></div>
          <div className={styles.timeButtons}>
            {!reducedMotion && <button className={`${styles.button} ${styles.primary}`} type="button" aria-pressed={playing} onClick={() => { if (!playing && offset >= MAX_DAYS) setOffset(0); setPlaying(!playing); }}>{playing ? "Pause time" : "Watch time pass"}</button>}
            <button className={styles.button} type="button" onClick={() => changeTime(offset + 91)} disabled={offset >= MAX_DAYS}>Next season</button>
            <button className={styles.button} type="button" onClick={() => changeTime(offset + 365)} disabled={offset >= MAX_DAYS}>A year later</button>
            <button className={styles.button} type="button" onClick={() => { changeTime(0); setNow(Date.now()); }} disabled={isLive}>Return to today</button>
          </div>
        </div>
      </div>

      <details className={styles.ledger}>
        <summary>From the garden notebook</summary>
        <div className={styles.ledgerContent}>
          <div>
            <h3>A familiar wood, with a few guests</h3>
            <p>This is a place for the woods of northern and central Virginia, remembered and still here. The chestnut oak belongs in the present, too. Virginia pine and loblolly share the ridge; both are native in Virginia. Redcedar finds the edges.</p>
            <p>Down by the water, bald cypress meets a planted visitor from China: dawn redwood. Pawpaws, fruit trees, strawberry runners, herbs, flowers and uninvited weeds make the lower world. The beds are allowed to look lived in.</p>
            <p>Greenery study for a Signal September: a garden that might, in time, grow into the rest of this site.</p>
          </div>
          <div>
            <h3>The young trees</h3>
            <ul className={styles.plantList}>{gardenTrees.map((tree) => <li key={tree.name}><strong>{tree.name}</strong><em>{tree.botanical}</em></li>)}</ul>
          </div>
          <div>
            <h3>Time keeps the garden</h3>
            <p>The young trees grow from September 1, 2026. Their size follows elapsed time, so a return visit finds the same garden a little older. The established woodland behind them is the garden&apos;s memory.</p>
            <p>The time study changes only your view. Virginia&apos;s clock sets the light and seasonal ink wash. Growth is an illustration, not a botanical forecast; the engraved leaves and the strawberry close-up are held as drawings through the seasons.</p>
          </div>
          <div>
            <h3>Notes in the margin</h3>
            <p>Plant context: <a href="https://dcr.virginia.gov/natural-heritage/document/pied-nat-plants.pdf">Virginia DCR&apos;s Piedmont native plants</a>, <a href="https://plants.ces.ncsu.edu/plants/taxodium-distichum/">NC State on bald cypress</a>, and <a href="https://plantfinder.mobot.org/PlantFinderDetails.aspx?taxonid=287316">Missouri Botanical Garden on dawn redwood</a>.</p>
            <p>Original digital illustrations made with ImageGen for this garden. The acorn dispute is still awaiting arbitration.</p>
          </div>
        </div>
      </details>
      <footer className={styles.footer}><span>Planted 1 September 2026 · {now === null ? "A garden in its own time" : date < GARDEN_EPOCH ? "Before the planting · young trees shown at planting size" : `${Math.floor(age).toLocaleString("en-US")} days of growing`}</span><span>Pen, pencil, a little color. Leave room for the weeds.</span></footer>
    </section>
  );
}
