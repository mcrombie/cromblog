"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  choose, getDialogue, getHint, getJournal, getObjective, initialState,
  isBridgeOpen, isComplete, restoreState,
  type Dialogue, type GameState, type Target
} from "@/lib/cromb-coo-coo";
import styles from "./game.module.css";

const SAVE_KEY = "cromb-coo-coo:first-crossing:v1";
const ORIGINAL = "/cromblog/doodle-experiments/round-21/at-the-center-of-cromb-coo-coo.png";
const BRIDGE = "/games/cromb-coo-coo/bridge-open.png";
const CROSSED = "/games/cromb-coo-coo/crossed.png";
const targets: { id: Target; label: string; action: string; x: number; y: number; kind: "talk" | "look" }[] = [
  { id: "bird", label: "Woodgrain Bird", action: "Talk to the Woodgrain Bird", x: 17, y: 36, kind: "talk" },
  { id: "turtle", label: "Trumpet Turtle", action: "Talk to the Trumpet Turtle", x: 32, y: 73, kind: "talk" },
  { id: "juggler", label: "Orb Juggler", action: "Talk to the Orb Juggler", x: 81, y: 74, kind: "talk" },
  { id: "visitor", label: "The Visitor", action: "Check in with the Visitor", x: 49, y: 55, kind: "talk" },
  { id: "roots", label: "Listening roots", action: "Examine the roots", x: 48, y: 9, kind: "look" },
  { id: "gap", label: "The crossing", action: "Examine the crossing", x: 66.5, y: 86, kind: "look" },
  { id: "islands", label: "Distant islands", action: "Look at the distant islands", x: 63, y: 24, kind: "look" }
];

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
  const [reducedMotion, setReducedMotion] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [moment, setMoment] = useState<"bridge" | "crossed" | null>(null);
  const [endingOpen, setEndingOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [assetError, setAssetError] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);
  const dialogueRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const complete = isComplete(state);
  const bridgeOpen = isBridgeOpen(state);
  const scene = complete ? CROSSED : bridgeOpen ? BRIDGE : ORIGINAL;
  const journal = getJournal(state);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SAVE_KEY);
      if (raw) {
        const envelope = JSON.parse(raw);
        const restored = restoreState(envelope?.state);
        if (restored && envelope.started === true) { setState(restored); setHasSave(true); }
      }
    } catch { setStorageAvailable(false); }
    setLoaded(true);
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
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
    if (dialogue && !moment) dialogueRef.current?.focus({ preventScroll: true });
  }, [dialogue, moment]);

  useEffect(() => {
    if (!playing) return;
    // Load the two reward illustrations ahead of the player's final actions.
    for (const src of [BRIDGE, CROSSED]) { const image = new window.Image(); image.src = src; }
  }, [playing]);

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
        const start = context.currentTime + (index === 2 ? 0.8 : index * 0.24);
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
    setPlaying(true); setEndingOpen(isComplete(state));
    requestAnimationFrame(() => stageRef.current?.focus({ preventScroll: true }));
  }

  function openTarget(target: Target) {
    if (moment) return;
    setActive(target); setDialogue(getDialogue(target, state)); setHint(null); setEndingOpen(false);
  }

  function closeDialogue() {
    setActive(null); setDialogue(null);
    requestAnimationFrame(() => stageRef.current?.querySelector<HTMLButtonElement>(`[data-target="${active}"]`)?.focus({ preventScroll: true }));
  }

  function selectChoice(id: string) {
    if (!active || moment) return;
    if (id === "leave") { closeDialogue(); return; }
    const result = choose(active, id, state);
    setState(result.state); setDialogue(result.dialogue); setHint(null);
    if (!bridgeOpen && isBridgeOpen(result.state)) {
      setMoment("bridge"); setActive(null); setDialogue(null); chime(true);
      announce("The roots weave a bridge between the two islands.");
    } else if (!complete && isComplete(result.state)) {
      setMoment("crossed"); setActive(null); setDialogue(null); chime(true);
      announce("You cross the living bridge. The first crossing is complete.");
    } else if (getJournal(result.state).length > journal.length) {
      announce("A new observation is in your field notebook.");
      if (active === "roots" || active === "juggler") chime();
    }
  }

  function restart() {
    setState({ ...initialState }); setActive(null); setDialogue(null); setHint(null);
    setMoment(null); setEndingOpen(false); setNotice(""); setModal(null);
    setPlaying(true); setHasSave(false);
    requestAnimationFrame(() => stageRef.current?.focus());
  }

  useEffect(() => {
    if (!playing) return;
    function onKey(event: KeyboardEvent) {
      if (event.altKey || event.metaKey || event.ctrlKey || /INPUT|TEXTAREA|SELECT/.test((event.target as HTMLElement)?.tagName)) return;
      if (modal) return; // Native dialog owns Escape and focus while open.
      if (event.key === "Escape") { if (dialogue) closeDialogue(); else setHint(null); }
      if (event.key.toLowerCase() === "h") { event.preventDefault(); setShowTargets(value => !value); }
      if (event.key.toLowerCase() === "j") { event.preventDefault(); setModal("journal"); }
      if (/^[1-9]$/.test(event.key) && dialogue && !moment) {
        const choice = dialogue.choices[Number(event.key) - 1];
        if (choice) { event.preventDefault(); selectChoice(choice.id); }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // The current dialogue and state are deliberately captured for number shortcuts.
  });

  return (
    <div className={`${styles.game} ${reducedMotion ? styles.reduced : ""}`}>
      {!playing ? (
        <section className={styles.titleScreen} aria-labelledby="coocoo-title">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.titleArt} src={ORIGINAL} alt="An anxious visitor surrounded by floating forests, a woodgrain bird, a trumpet turtle and an orb juggler." fetchPriority="high" />
          <div className={styles.titleShade} />
          <Link href="/games" className={styles.backLink}>← Back to Cromblog</Link>
          <div className={styles.titleCopy}>
            <p className={styles.eyebrow}>An illustrated adventure</p>
            <h1 id="coocoo-title">Cromb<br /><em>Coo Coo</em></h1>
            <div className={styles.rule}><Icon name="leaf" /><span /></div>
            <p className={styles.chapter}>The First Crossing</p>
            <p className={styles.titleDescription}>A very small visitor.<br />A very peculiar way across.</p>
            <button className={styles.beginButton} onClick={begin} disabled={!loaded}>
              {!loaded ? "Opening the notebook…" : hasSave ? "Continue your journey" : "Begin the crossing"}<Icon name="arrow" />
            </button>
            <p className={styles.titleFootnote}>Explore. Meet the inhabitants. Find a way onward.<br />Take your time; this place isn’t going anywhere. Probably.</p>
          </div>
          <p className={styles.artCredit}>A world grown from Michael Crombie’s notebook drawings</p>
        </section>
      ) : (
        <div className={`${styles.playScreen} ${dialogue && !moment ? styles.conversing : ""}`}>
          <header className={styles.header}>
            <h1 className={styles.wordmark}><Link href="/games" aria-label="Cromb Coo Coo — back to Games">Cromb <em>Coo Coo</em></Link></h1>
            <span className={styles.chapterLabel}>I · The First Crossing</span>
            <div className={styles.headerActions}>
              <button onClick={() => setModal("journal")} className={styles.toolButton} aria-label="Open field notebook" title="Field notebook (J)"><Icon name="book" /><span>Notebook</span>{journal.length > 0 && <small>{journal.length}</small>}</button>
              <button onClick={() => setModal("settings")} className={styles.iconButton} aria-label="Open game settings"><Icon name="settings" /></button>
            </div>
          </header>

          <div className={styles.sceneViewport}>
            <div ref={stageRef} tabIndex={-1} className={`${styles.scene} ${showTargets ? styles.reveal : ""} ${moment ? styles.sceneMoment : ""}`} aria-label="The First Crossing illustrated scene">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img key={scene} src={scene} className={styles.sceneArt} alt={complete ? "The Visitor has crossed the new root bridge and stands safely beside the Orb Juggler." : bridgeOpen ? "A living root bridge now connects the central terrace to the Orb Juggler’s island." : "The Visitor and Trumpet Turtle stand on the central terrace. The Orb Juggler is across a gap; the Woodgrain Bird watches from a rooted cliff."} onLoad={() => setAssetError(false)} onError={() => setAssetError(true)} />
              <div className={styles.sceneVignette} aria-hidden="true" />
              {targets.map(target => (
                <button key={target.id} data-target={target.id} className={`${styles.hotspot} ${active === target.id ? styles.selected : ""} ${target.id === "gap" && bridgeOpen ? styles.openCrossing : ""}`} style={{ left: `${target.id === "visitor" && complete ? 90 : target.x}%`, top: `${target.id === "visitor" && complete ? 62 : target.y}%` }} onClick={() => openTarget(target.id)} disabled={!!moment} aria-label={target.action} aria-pressed={active === target.id}>
                  <span className={styles.hotspotRing}><Icon name={target.id === "gap" && bridgeOpen ? "arrow" : target.kind === "talk" ? "talk" : "eye"} size={17} /></span>
                  <span className={styles.hotspotLabel}>{target.id === "gap" && bridgeOpen ? "The bridge is ready" : target.label}</span>
                </button>
              ))}
              <div className={styles.locationTag}><span /> The listening terraces</div>
              {assetError && <p role="alert" className={styles.assetError}>The illustration couldn’t load. Your progress is saved; refresh to try again.</p>}
            </div>
          </div>

          <section className={styles.storyArea} id="coocoo-story" aria-label="Story and actions">
            {moment ? (
              <section className={styles.momentPanel} aria-live="polite">
                <p className={styles.eyebrow}>{moment === "bridge" ? "A call. An answer." : "One step, then another."}</p>
                <h2>{moment === "bridge" ? "The roots remember the way." : "You are on the other side."}</h2>
                <p>{moment === "bridge" ? "Wood stirs beneath the moss. The gap becomes a path, and the turtle gives the smallest possible bow." : state.approach === "honest" ? "Your first step is a little frightened. The root holds it just as carefully as any other step. Across the gap, the juggler makes a little room." : state.approach === "playful" ? "You take the bird’s handrail. It is an excellent extra root. On the other side, you turn and give the bird a grateful wave." : "The juggler makes a little room. Behind you, the bridge settles into the shape of something that was always possible."}</p>
                <button className={styles.primaryButton} onClick={() => { if (moment === "crossed") setEndingOpen(true); setMoment(null); }}>{moment === "bridge" ? "Look at the crossing" : "Take a breath"}<Icon name="arrow" size={18} /></button>
              </section>
            ) : endingOpen ? (
              <section className={styles.endingPanel}>
                <p className={styles.eyebrow}>The First Crossing · complete</p>
                <h2>A beginning, on the other side.</h2>
                <p>You arrived alone. You crossed because you listened.<br />Beyond these terraces, there are other places to ask.</p>
                <div className={styles.endingActions}><button className={styles.primaryButton} onClick={() => setEndingOpen(false)}>Stay a little longer</button><button className={styles.textButton} onClick={() => setModal("restart")}>Play again</button><Link href="/art?collection=scenic#experiments" className={styles.textButton}>Explore the artwork ↗</Link></div>
                <small>This is the end of the playable opening.</small>
              </section>
            ) : dialogue && active ? (
              <section ref={dialogueRef} tabIndex={-1} className={styles.dialogue} aria-label={`Conversation with ${dialogue.speaker}`}>
                <div className={styles.dialogueHeader}><span className={styles.speaker}>{dialogue.speaker}</span><span className={styles.dialogueLine} /><button className={styles.closeButton} aria-label="Close conversation" onClick={closeDialogue}><Icon name="close" size={18} /></button></div>
                <div className={styles.lines} aria-live="polite">{dialogue.lines.map((line, index) => <p key={`${line}-${index}`}>{line}</p>)}</div>
                <div className={styles.choices}>{dialogue.choices.map((choice, index) => <button key={choice.id} onClick={() => selectChoice(choice.id)} className={choice.id === "leave" ? styles.leaveChoice : styles.choice}><span className={styles.choiceNumber} aria-hidden="true">{index + 1}</span>{choice.label}<span className={styles.choiceArrow} aria-hidden="true">↗</span></button>)}</div>
              </section>
            ) : (
              <section className={styles.quietPanel}>
                <div className={styles.objective}><Icon name="leaf" size={28} /><div><p className={styles.eyebrow}>{complete ? "A place to remember" : bridgeOpen ? "A way onward" : "A thought to follow"}</p><h2>{getObjective(state)}</h2></div></div>
                <p className={styles.instructions}>{complete ? "You can still talk to your new acquaintances, or return to the artwork." : "Choose a character or something that catches your eye. There is no hurry."}</p>
              </section>
            )}

            <div className={styles.bottomBar}>
              <button className={styles.toolButton} aria-pressed={showTargets} onClick={() => setShowTargets(value => !value)}><Icon name="eye" size={18} /><span>{showTargets ? "Hide places to explore" : "Show places to explore"}</span></button>
              <button className={styles.toolButton} onClick={() => { setHint(getHint(state)); setActive(null); setDialogue(null); setEndingOpen(false); }} disabled={!!moment}><Icon name="help" size={18} /><span>A little nudge</span></button>
              <span className={styles.saveNote}>{storageAvailable ? "Progress saved on this device" : "Saving is unavailable · keep this tab open"}</span>
            </div>
            {showTargets && <nav className={styles.targetList} aria-label="Places to explore">{targets.map(target => <button key={target.id} onClick={() => openTarget(target.id)} disabled={!!moment}>{target.label}</button>)}</nav>}
            {hint && <aside className={styles.hint} aria-live="polite"><Icon name="leaf" /><p>{hint}</p><button className={styles.closeButton} aria-label="Dismiss hint" onClick={() => setHint(null)}><Icon name="close" size={16} /></button></aside>}
          </section>
          <p className={styles.notice} role="status">{notice}</p>
        </div>
      )}

      <dialog ref={modalRef} className={styles.modal} onCancel={event => { event.preventDefault(); setModal(null); }} onClick={event => { if (event.target === event.currentTarget) { const box = event.currentTarget.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) setModal(null); } }} aria-labelledby="coocoo-modal-title">
        <div className={styles.modalTop}><p className={styles.eyebrow}>Cromb Coo Coo</p><button className={styles.closeButton} onClick={() => setModal(null)} aria-label="Close panel"><Icon name="close" /></button></div>
        {modal === "journal" && <><h2 id="coocoo-modal-title">Field notebook</h2><p className={styles.modalIntro}>Things you’ve noticed. People you’ve begun to understand.</p>{journal.length ? <ol className={styles.journal}>{journal.map((entry, index) => <li key={entry.title}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><div><h3>{entry.title}</h3><p>{entry.text}</p></div></li>)}</ol> : <p className={styles.emptyJournal}>An empty page is a fine place to begin. Take a look around the terrace.</p>}<p className={styles.journalObjective}><strong>Your next thought</strong>{getObjective(state)}</p></>}
        {modal === "settings" && <><h2 id="coocoo-modal-title">A few comforts</h2><button className={styles.settingRow} aria-pressed={sound} onClick={() => setSound(value => !value)}><span><Icon name={sound ? "sound" : "mute"} /><span>Musical signals<small>Optional tones; every clue is also written.</small></span></span><b>{sound ? "On" : "Off"}</b></button><button className={styles.settingRow} aria-pressed={showTargets} onClick={() => setShowTargets(value => !value)}><span><Icon name="eye" /><span>Places to explore<small>Keep character and object labels visible.</small></span></span><b>{showTargets ? "Shown" : "On focus"}</b></button><p className={styles.controls}><strong>Take your time.</strong> Use a mouse, touch, or Tab and Enter. H shows places to explore. J opens the notebook. Escape closes a conversation or panel. Number keys choose dialogue options.<br /><br />{reducedMotion ? "Reduced motion follows your device setting." : "You can reduce motion through your device’s accessibility settings."}</p><div className={styles.settingFooter}><button className={styles.textButton} onClick={() => setModal("restart")}>Start this chapter again</button><Link href="/games" className={styles.textButton}>Return to Cromblog ↗</Link></div></>}
        {modal === "restart" && <><h2 id="coocoo-modal-title">A fresh arrival?</h2><p className={styles.modalIntro}>This will reset your progress in The First Crossing on this device.</p><div className={styles.endingActions}><button className={styles.primaryButton} onClick={restart}>Yes, begin again</button><button className={styles.textButton} onClick={() => setModal(null)}>Keep my journey</button></div></>}
      </dialog>
    </div>
  );
}
