"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  canMoveForward, choose, getDialogue, getHint, getJournal, getObjective, getScene,
  getTargets, initialState, islandScenes, isComplete, move, restoreState,
  type Dialogue, type GameState, type Target
} from "@/lib/cromb-coo-coo";
import styles from "./game.module.css";
import { DioramaScene } from "./diorama-scene";

const SAVE_KEY = "cromb-coo-coo:journey:v2";
const LEGACY_SAVE_KEY = "cromb-coo-coo:first-crossing:v1";
type Direction = "forward" | "back";
function Icon({ name, size = 20 }: { name: "eye" | "talk" | "book" | "sound" | "mute" | "arrow" | "close" | "leaf" | "help" | "settings"; size?: number }) {
  const paths = {
    eye: <><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>,
    talk: <><path d="M20 11a8 8 0 0 1-8 8H5l-4 3 2-7a8 8 0 1 1 17-4Z" /><path d="M7 10h9M7 14h5" /></>,
    book: <><path d="M12 5v15M3 3l9 2 9-2v15l-9 2-9-2V3Z" /><path d="m6 8 3 1m6 0 3-1M6 12l3 1m6 0 3-1" /></>,
    sound: <><path d="m11 4-6 5H2v6h3l6 5V4Zm4 4a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14" /></>,
    mute: <><path d="m11 4-6 5H2v6h3l6 5V4Zm5 5 6 6m0-6-6 6" /></>,
    arrow: <path d="M3 12h17m-6-6 6 6-6 6" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    leaf: <><path d="M20 3C6 0 0 10 7 17s16 0 13-14Z" /><path d="M3 21 16 8m-5 5-1-5m1 5 6 1" /></>,
    help: <><circle cx="12" cy="12" r="9" /><path d="M9 8c0-3 6-3 6 0 0 2-3 2-3 5m0 3v1" /></>,
    settings: <><path d="M4 7h16M4 17h16" /><circle cx="9" cy="7" r="3" /><circle cx="16" cy="17" r="3" /></>
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export function CrombCooCooGame() {
  const [state, setState] = useState<GameState>(initialState);
  const [loaded, setLoaded] = useState(false);
  const [hasSave, setHasSave] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [active, setActive] = useState<Target | null>(null);
  const [dialogue, setDialogue] = useState<Dialogue | null>(null);
  const [modal, setModal] = useState<"journal" | "settings" | "restart" | null>(null);
  const [showTargets, setShowTargets] = useState(false);
  const [sound, setSound] = useState(false);
  const [systemReducedMotion, setSystemReducedMotion] = useState(false);
  const [stillScene, setStillScene] = useState(false);
  const reducedMotion = systemReducedMotion || stillScene;
  const [hint, setHint] = useState<string | null>(null);
  const [arriving, setArriving] = useState(true);
  const [travelling, setTravelling] = useState<Direction | null>(null);
  const [sceneVisit, setSceneVisit] = useState(0);
  const [endingOpen, setEndingOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const modalRef = useRef<HTMLDialogElement>(null);
  const dialogueRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const travelRef = useRef<Direction | null>(null);
  const arrivalRef = useRef(true);
  const scene = getScene(state);
  const targets = getTargets(state);
  const journal = getJournal(state);
  const greeted = state.greeted[state.sceneIndex];
  const busy = arriving || travelling !== null;
  const finalIsland = state.sceneIndex === islandScenes.length - 1;
  const residentTarget = targets.find(target => target.id === "resident");
  const detailTarget = targets.find(target => target.id === "detail");
  const visibleChoices = dialogue?.choices.filter(choice => !(active === "resident" && greeted && choice.id === "greet")) ?? [];
  // Acquaintances stay in the notebook when walking back to an earlier island.
  const furthestIsland = Math.max(state.sceneIndex, state.greeted.lastIndexOf(true));

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SAVE_KEY) ?? window.localStorage.getItem(LEGACY_SAVE_KEY);
      if (raw) {
        const envelope = JSON.parse(raw);
        const restored = restoreState(envelope?.state);
        if (restored && envelope.started === true) { setState(restored); setHasSave(true); }
      }
    } catch { setStorageAvailable(false); }
    setLoaded(true);
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setSystemReducedMotion(media.matches);
    sync(); media.addEventListener("change", sync);
    return () => { media.removeEventListener("change", sync); };
  }, []);

  useEffect(() => {
    if (!loaded || !playing) return;
    try {
      window.localStorage.setItem(SAVE_KEY, JSON.stringify({ started: true, state }));
      setHasSave(true); setStorageAvailable(true);
    } catch { setStorageAvailable(false); }
  }, [state, loaded, playing]);

  useEffect(() => {
    const element = modalRef.current;
    if (modal && element && !element.open) {
      previousFocus.current = document.activeElement as HTMLElement;
      element.showModal();
    } else if (!modal && element?.open) {
      element.close(); previousFocus.current?.focus();
    }
  }, [modal]);

  useEffect(() => {
    if (dialogue) dialogueRef.current?.focus({ preventScroll: true });
  }, [dialogue]);

  useEffect(() => {
    if (!playing) return;
    // Only the next illustrated scene needs to be ready before a crossing.
    const next = islandScenes[state.sceneIndex + 1];
    if (next) { const image = new window.Image(); image.src = next.art; }
  }, [playing, state.sceneIndex]);

  useEffect(() => () => {
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    void audioRef.current?.close();
  }, []);

  function chime(celebrate = false) {
    if (!sound) return;
    try {
      const context = audioRef.current ?? new AudioContext(); audioRef.current = context;
      void context.resume();
      const notes = celebrate ? [261.63, 329.63, 392, 523.25] : [329.63, 392, 523.25];
      notes.forEach((frequency, index) => {
        const oscillator = context.createOscillator(); const gain = context.createGain();
        const start = context.currentTime + index * 0.24;
        oscillator.type = "sine"; oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0, start); gain.gain.linearRampToValueAtTime(0.07, start + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.8);
        oscillator.connect(gain); gain.connect(context.destination);
        oscillator.start(start); oscillator.stop(start + 0.85);
        oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
      });
    } catch { setSound(false); }
  }

  function announce(text: string) {
    setNotice(text);
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(""), 4500);
  }

  function begin() {
    arrivalRef.current = true;
    setArriving(true); setPlaying(true); setEndingOpen(isComplete(state));
    requestAnimationFrame(() => stageRef.current?.focus({ preventScroll: true }));
  }

  const onArrival = useCallback(() => {
    arrivalRef.current = false;
    setArriving(false);
  }, []);

  const onTravelComplete = useCallback(() => {
    const direction = travelRef.current;
    if (!direction) return;
    travelRef.current = null;
    arrivalRef.current = true;
    setState(current => move(current, direction));
    setTravelling(null); setArriving(true); setSceneVisit(value => value + 1);
    requestAnimationFrame(() => stageRef.current?.focus({ preventScroll: true }));
  }, []);

  function travel(direction: Direction) {
    if (arrivalRef.current || travelRef.current || (direction === "forward" ? !canMoveForward(state) || finalIsland : state.sceneIndex === 0)) return;
    travelRef.current = direction;
    setTravelling(direction); setActive(null); setDialogue(null); setHint(null); setEndingOpen(false);
    announce(direction === "forward" ? `Onward to ${islandScenes[state.sceneIndex + 1].name}.` : `Returning to ${islandScenes[state.sceneIndex - 1].name}.`);
    chime();
  }

  function finish() {
    if (busy || !finalIsland || !greeted) return;
    const result = choose("path", "finish", state);
    setState(result.state); setActive(null); setDialogue(null); setHint(null);
    setEndingOpen(true); chime(true);
    announce("Five islands, five new acquaintances. Your journey is complete.");
  }

  function openTarget(target: Target) {
    if (arrivalRef.current || travelRef.current || modal) return;
    if (target === "back") { travel("back"); return; }
    if (target === "path" && greeted) {
      if (finalIsland) finish(); else travel("forward");
      return;
    }
    setActive(target); setDialogue(getDialogue(target, state)); setHint(null); setEndingOpen(false);
  }

  function closeDialogue() {
    setActive(null); setDialogue(null);
    requestAnimationFrame(() => stageRef.current?.querySelector<HTMLButtonElement>(`[data-target="${active}"]`)?.focus({ preventScroll: true }));
  }

  function selectChoice(id: string) {
    if (!active || busy) return;
    if (id === "leave") { closeDialogue(); return; }
    if (id === "forward" || id === "back") { travel(id); return; }
    if (id === "finish") { finish(); return; }
    const result = choose(active, id, state);
    setState(result.state); setDialogue(result.dialogue); setHint(null);
    if (!greeted && result.state.greeted[state.sceneIndex]) {
      announce(finalIsland ? "You can rest here whenever you are ready." : "The way onward is open. Choose Go to the next island.");
      chime();
    } else if (getJournal(result.state).length > journal.length) {
      announce("A new observation is in your field notebook.");
    }
  }

  function restart() {
    travelRef.current = null; arrivalRef.current = true;
    setState({ ...initialState, greeted: [...initialState.greeted], inspected: [...initialState.inspected] });
    setActive(null); setDialogue(null); setHint(null); setTravelling(null); setArriving(true);
    setSceneVisit(value => value + 1); setEndingOpen(false); setNotice(""); setModal(null);
    setPlaying(true); setHasSave(false);
    requestAnimationFrame(() => stageRef.current?.focus({ preventScroll: true }));
  }

  useEffect(() => {
    if (!playing) return;
    function onKey(event: KeyboardEvent) {
      if (event.altKey || event.metaKey || event.ctrlKey || /INPUT|TEXTAREA|SELECT/.test((event.target as HTMLElement)?.tagName)) return;
      if (modal) return;
      if (event.key === "Escape") { if (dialogue) closeDialogue(); else setHint(null); }
      if (event.key.toLowerCase() === "h") { event.preventDefault(); setShowTargets(value => !value); }
      if (event.key.toLowerCase() === "j") { event.preventDefault(); setModal("journal"); }
      if (/^[1-9]$/.test(event.key) && dialogue && !busy) {
        const choice = visibleChoices[Number(event.key) - 1];
        if (choice) { event.preventDefault(); selectChoice(choice.id); }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // Number shortcuts intentionally capture the current conversation and state.
  });

  return (
    <div className={`${styles.game} ${reducedMotion ? styles.reduced : ""}`}>
      {!playing ? (
        <section className={styles.titleScreen} aria-labelledby="coocoo-title">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.titleArt} src={islandScenes[0].art} alt={islandScenes[0].artAlt} fetchPriority="high" />
          <div className={styles.titleShade} />
          <Link href="/games" className={styles.backLink}>← Back to Cromblog</Link>
          <div className={styles.titleCopy}>
            <p className={styles.eyebrow}>A journey through five floating islands</p>
            <h1 id="coocoo-title">Cromb<br /><em>Coo Coo</em></h1>
            <div className={styles.rule}><Icon name="leaf" /><span /></div>
            <p className={styles.titleDescription}>Say hello. Take a step.<br />See what’s next.</p>
            <button className={styles.beginButton} onClick={begin} disabled={!loaded}>
              {!loaded ? "Opening…" : hasSave ? "Continue your journey" : "Begin"}<Icon name="arrow" />
            </button>
          </div>
          <p className={styles.artCredit}>A world grown from Michael Crombie’s notebook drawings</p>
        </section>
      ) : (
        <div className={`${styles.playScreen} ${dialogue ? styles.conversing : ""}`}>
          <header className={styles.header}>
            <h1 className={styles.wordmark}><Link href="/games" aria-label="Cromb Coo Coo — back to Games">Cromb <em>Coo Coo</em></Link></h1>
            <span className={styles.chapterLabel}>Island {state.sceneIndex + 1} of {islandScenes.length}</span>
            <div className={styles.headerActions}>
              <button onClick={() => setModal("journal")} className={styles.toolButton} aria-label="Open field notebook" title="Field notebook (J)"><Icon name="book" /><span>Notebook</span></button>
              <button onClick={() => setModal("settings")} className={styles.iconButton} aria-label="Open game settings"><Icon name="settings" /></button>
            </div>
          </header>

          <div className={styles.sceneViewport}>
            <div ref={stageRef} tabIndex={-1} className={`${styles.scene} ${showTargets ? styles.reveal : ""}`} aria-label={`${scene.name} interactive 3D island`} aria-busy={busy}>
              <DioramaScene key={`${state.sceneIndex}-${sceneVisit}`} state={state} active={active} reducedMotion={reducedMotion} paused={modal !== null} disabled={busy || modal !== null} onTarget={openTarget} fallback={scene.art} travelling={travelling} onArrival={onArrival} onTravelComplete={onTravelComplete} />
            </div>
          </div>

          <section className={styles.storyArea} id="coocoo-story" aria-label="Story and actions">
            {busy ? (
              <section className={styles.walkingPanel} role="status">
                <span className={styles.walkingMark} aria-hidden="true"><Icon name="arrow" size={24} /></span>
                <div><p className={styles.eyebrow}>Island {state.sceneIndex + 1} of {islandScenes.length} · {scene.name}</p><h2>{travelling ? travelling === "forward" ? "On to the next island…" : "Back along the path…" : state.sceneIndex === 0 ? "Walking up to the frog…" : "A new place to say hello."}</h2><p>{travelling ? scene.departure : scene.arrival}</p></div>
              </section>
            ) : endingOpen ? (
              <section className={styles.endingPanel}>
                <p className={styles.eyebrow}>Five islands · journey complete</p>
                <h2>A little further from where you began.</h2>
                <p>A hello, a few steps, and another place to remember.<br />The lanterns will keep your place while you rest.</p>
                <div className={styles.endingActions}><button className={styles.primaryButton} onClick={() => setEndingOpen(false)}>Stay a little longer</button><button className={styles.textButton} onClick={() => setModal("journal")}>Open the notebook</button><button className={styles.textButton} onClick={() => setModal("restart")}>Begin again</button></div>
              </section>
            ) : dialogue && active ? (
              <section ref={dialogueRef} tabIndex={-1} className={styles.dialogue} aria-label={`Conversation with ${dialogue.speaker}`}>
                <div className={styles.dialogueHeader}><span className={styles.speaker}>{dialogue.speaker}</span><span className={styles.dialogueLine} /><button className={styles.closeButton} aria-label="Close conversation" onClick={closeDialogue}><Icon name="close" size={18} /></button></div>
                <div className={styles.lines} aria-live="polite">{dialogue.lines.map((line, index) => <p key={`${line}-${index}`}>{line}</p>)}</div>
                <div className={styles.choices}>{visibleChoices.map((choice, index) => <button key={choice.id} onClick={() => selectChoice(choice.id)} className={choice.id === "leave" ? styles.leaveChoice : styles.choice}><span className={styles.choiceNumber} aria-hidden="true">{index + 1}</span>{choice.label}<span className={styles.choiceArrow} aria-hidden="true">↗</span></button>)}</div>
              </section>
            ) : (
              <section className={styles.quietPanel}>
                <p className={styles.eyebrow}>Island {state.sceneIndex + 1} of {islandScenes.length} · {scene.name}</p>
                <h2>{getObjective(state)}</h2>
                {state.sceneIndex === 0 && !greeted && <p className={styles.firstInstruction}>Choose the frog to start a conversation.</p>}
              </section>
            )}

            {!busy && !endingOpen && <nav className={styles.journeyActions} aria-label="Island actions">
              <div className={styles.meetingActions}>
                {!dialogue && <button className={!greeted ? styles.primaryButton : styles.secondaryButton} onClick={() => openTarget("resident")}><Icon name="talk" size={18} />{residentTarget?.action ?? `Talk to ${scene.resident}`}</button>}
                {!dialogue && detailTarget && <button className={styles.textButton} onClick={() => openTarget("detail")}><Icon name="eye" size={17} />{detailTarget.action}</button>}
              </div>
              <div className={styles.forwardAction}>
                <button className={styles.primaryButton} onClick={() => finalIsland ? finish() : travel("forward")} disabled={!greeted} aria-describedby={!greeted ? "coocoo-path-help" : undefined}>{finalIsland ? "Rest here" : "Go to the next island"}<Icon name="arrow" size={18} /></button>
                {!greeted && <span id="coocoo-path-help">{state.sceneIndex === 0 ? "Talk to the frog first." : `Say hello to the ${scene.resident} first.`}</span>}
              </div>
            </nav>}

            <div className={styles.bottomBar}>
              {state.sceneIndex > 0 && <button className={styles.toolButton} onClick={() => travel("back")} disabled={busy}><span aria-hidden="true">←</span><span>Previous island</span></button>}
              {state.sceneIndex > 0 && <button className={styles.toolButton} onClick={() => { setHint(getHint(state)); setActive(null); setDialogue(null); setEndingOpen(false); }} disabled={busy}><Icon name="help" size={18} /><span>A little nudge</span></button>}
              <span className={styles.saveNote}>{storageAvailable ? "Progress saved on this device" : "Saving is unavailable · keep this tab open"}</span>
            </div>
            {hint && <aside className={styles.hint} aria-live="polite"><Icon name="leaf" /><p>{hint}</p><button className={styles.closeButton} aria-label="Dismiss hint" onClick={() => setHint(null)}><Icon name="close" size={16} /></button></aside>}
          </section>
          <p className={styles.notice} role="status">{notice}</p>
        </div>
      )}

      <dialog ref={modalRef} className={styles.modal} onCancel={event => { event.preventDefault(); setModal(null); }} onClick={event => { if (event.target === event.currentTarget) { const box = event.currentTarget.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) setModal(null); } }} aria-labelledby="coocoo-modal-title">
        <div className={styles.modalTop}><p className={styles.eyebrow}>Cromb Coo Coo</p><button className={styles.closeButton} onClick={() => setModal(null)} aria-label="Close panel"><Icon name="close" /></button></div>
        {modal === "journal" && <>
          <h2 id="coocoo-modal-title">Field notebook</h2><p className={styles.modalIntro}>A few places and people to remember.</p>
          {journal.length ? <ol className={styles.journal}>{journal.map((entry, index) => <li key={entry.title}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><div><h3>{entry.title}</h3><p>{entry.text}</p></div></li>)}</ol> : <p className={styles.emptyJournal}>An empty page is a fine place to begin.</p>}
          {furthestIsland >= 2 && <section className={styles.islandStudies} aria-label="Illustrations of islands visited">{islandScenes.slice(2, furthestIsland + 1).map(island => <figure key={island.id}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={island.art} alt={island.artAlt} loading="lazy" width={1672} height={941} /><figcaption>{island.name}</figcaption>
          </figure>)}</section>}
          <p className={styles.journalObjective}><strong>Your next step</strong>{getObjective(state)}</p>
        </>}
        {modal === "settings" && <>
          <h2 id="coocoo-modal-title">A few comforts</h2>
          <button className={styles.settingRow} aria-pressed={sound} onClick={() => setSound(value => !value)}><span><Icon name={sound ? "sound" : "mute"} /><span>Musical signals<small>Optional tones when you meet someone or move on.</small></span></span><b>{sound ? "On" : "Off"}</b></button>
          <button className={styles.settingRow} aria-pressed={showTargets} onClick={() => setShowTargets(value => !value)}><span><Icon name="eye" /><span>Places to explore<small>Keep character and path labels visible.</small></span></span><b>{showTargets ? "Shown" : "On focus"}</b></button>
          <button className={styles.settingRow} aria-pressed={!reducedMotion} disabled={systemReducedMotion} onClick={() => setStillScene(value => !value)}><span><Icon name="leaf" /><span>Scene animation<small>Keep the world still while you explore.</small></span></span><b>{systemReducedMotion ? "Reduced by device" : stillScene ? "Off" : "On"}</b></button>
          <p className={styles.controls}><strong>Say hello, then take a step.</strong> Choose a character directly, or use Tab and Enter. The buttons below each island work too. Drag the world to turn it; use the camera buttons to zoom or reset the view. H shows labels. J opens the notebook. Escape closes a conversation or panel. Number keys choose dialogue options.<br /><br />{systemReducedMotion ? "Reduced motion follows your device setting." : "Turn scene animation off for a still world; every conversation and island remains available."}</p>
          <div className={styles.settingFooter}><button className={styles.textButton} onClick={() => setModal("restart")}>Start this journey again</button><Link href="/games" className={styles.textButton}>Return to Cromblog ↗</Link></div>
        </>}
        {modal === "restart" && <><h2 id="coocoo-modal-title">A fresh arrival?</h2><p className={styles.modalIntro}>This will start your five-island journey again on this device.</p><div className={styles.endingActions}><button className={styles.primaryButton} onClick={restart}>Yes, begin again</button><button className={styles.textButton} onClick={() => setModal(null)}>Keep my journey</button></div></>}
      </dialog>
    </div>
  );
}
