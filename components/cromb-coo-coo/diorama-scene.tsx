"use client";

import { useEffect, useRef, useState } from "react";
import { getScene, type GameState, type Target } from "@/lib/cromb-coo-coo";
import type { Diorama, SceneControl } from "./diorama-world";
import { sceneTargets } from "./scene-targets";
import styles from "./game.module.css";

type Props = {
  state: GameState;
  active: Target | null;
  reducedMotion: boolean;
  paused: boolean;
  disabled: boolean;
  onTarget: (target: Target) => void;
  fallback: string;
  travelling: "forward" | "back" | null;
  onArrival: () => void;
  onTravelComplete: () => void;
};

export function DioramaScene(props: Props) {
  const host = useRef<HTMLDivElement>(null);
  const world = useRef<Diorama | null>(null);
  const buttons = useRef<Partial<Record<Target, HTMLButtonElement>>>({});
  const latest = useRef(props);
  const arrivalSent = useRef(false);
  const travelSent = useRef(false);
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">("loading");
  const [imageError, setImageError] = useState(false);
  const [hovered, setHovered] = useState<Target | null>(null);
  latest.current = props;
  const targets = sceneTargets(props.state);
  const island = getScene(props.state);

  useEffect(() => {
    let cancelled = false;
    let timedOut = false;
    const container = host.current;
    if (!container) return;
    const timeout = window.setTimeout(() => {
      timedOut = true;
      if (!cancelled) setStatus("fallback");
    }, 12000);
    import("./diorama-world").then(({ createDiorama }) => {
      window.clearTimeout(timeout);
      if (cancelled || timedOut) return;
      try {
        const instance = createDiorama(container, latest.current, {
          onTarget: target => { if (!latest.current.disabled) latest.current.onTarget(target); },
          onHover: target => { if (!cancelled) setHovered(target); },
          onProject: points => {
            sceneTargets(latest.current.state).forEach(({ id }) => {
              const button = buttons.current[id];
              const point = points[id];
              if (!button) return;
              if (!point) { button.style.visibility = "hidden"; return; }
              button.style.left = point.x + "%";
              button.style.top = point.y + "%";
              button.style.visibility = point.visible ? "visible" : "hidden";
            });
          },
          onArrival: () => {
            if (cancelled || arrivalSent.current) return;
            arrivalSent.current = true; latest.current.onArrival();
          },
          onTravelComplete: () => {
            if (cancelled || travelSent.current || !latest.current.travelling) return;
            travelSent.current = true; latest.current.onTravelComplete();
          },
          onFailure: () => {
            world.current?.dispose(); world.current = null;
            if (!cancelled) setStatus("fallback");
          }
        });
        world.current = instance;
        setStatus("ready");
      } catch {
        setStatus("fallback");
      }
    }).catch(() => { window.clearTimeout(timeout); if (!cancelled) setStatus("fallback"); });
    return () => { cancelled = true; window.clearTimeout(timeout); world.current?.dispose(); world.current = null; };
  }, []);

  useEffect(() => {
    if (!props.travelling) travelSent.current = false;
    world.current?.update(props);
  }, [props]);

  useEffect(() => {
    host.current?.parentElement?.setAttribute("data-scene-mode", status);
  }, [status]);

  // Illustrated mode must never strand the journey behind an animation callback.
  useEffect(() => {
    if (status !== "fallback") return;
    if (!arrivalSent.current) { arrivalSent.current = true; latest.current.onArrival(); }
    if (props.travelling && !props.paused && !travelSent.current) {
      travelSent.current = true; latest.current.onTravelComplete();
    }
    sceneTargets(props.state).forEach(target => {
      const button = buttons.current[target.id];
      if (!button) return;
      button.style.left = target.x + "%";
      button.style.top = target.y + "%";
      button.style.visibility = "visible";
    });
  }, [status, props.state, props.travelling, props.paused]);

  function control(action: SceneControl) { world.current?.control(action); }

  return <>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img className={styles.sceneArt + (status === "ready" ? " " + styles.hiddenIllustration : "")} src={props.fallback} alt={island.artAlt} onLoad={() => setImageError(false)} onError={() => setImageError(true)} />
    <div ref={host} className={styles.dioramaHost + (status === "ready" ? " " + styles.dioramaReady : "")} aria-hidden="true" data-renderer={status} data-island={island.id} />
    <div className={styles.paperGrain} aria-hidden="true" />
    <div className={styles.sceneVignette} aria-hidden="true" />
    {targets.map(target => <button
      key={target.id}
      ref={element => { if (element) buttons.current[target.id] = element; else delete buttons.current[target.id]; }}
      data-target={target.id}
      className={styles.hotspot + (props.active === target.id || hovered === target.id ? " " + styles.selected : "") + (target.id === "path" && props.state.greeted[props.state.sceneIndex] ? " " + styles.openCrossing : "")}
      style={status === "ready" ? undefined : { left: target.x + "%", top: target.y + "%" }}
      onClick={() => props.onTarget(target.id)}
      disabled={props.disabled}
      aria-label={target.action}
      aria-pressed={props.active === target.id}
    >
      <span className={styles.hotspotRing}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {target.kind === "move" ? <path d={target.id === "back" ? "M21 12H4m6-6-6 6 6 6" : "M3 12h17m-6-6 6 6-6 6"} /> : target.kind === "talk" ? <><path d="M20 11a8 8 0 0 1-8 8H5l-4 3 2-7a8 8 0 1 1 17-4Z" /><path d="M7 10h9M7 14h5" /></> : <><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>}
        </svg>
      </span>
      <span className={styles.hotspotLabel}>{target.label}</span>
    </button>)}
    {status === "ready" ? <>
      <div className={styles.dioramaCaption}><span className={styles.eyebrow}>{island.name}</span><span>{props.reducedMotion ? "A world to turn in your hands" : "A small world, quietly alive"}</span></div>
      <div className={styles.cameraTools} role="group" aria-label="Island camera controls">
        <span className={styles.cameraHint}>Drag to turn</span>
        <button aria-label="Turn view left" title="Turn view left" onClick={() => control("left")}>↶</button>
        <button aria-label="Turn view right" title="Turn view right" onClick={() => control("right")}>↷</button>
        <button aria-label="Zoom out" title="Zoom out" onClick={() => control("out")}>−</button>
        <button aria-label="Zoom in" title="Zoom in" onClick={() => control("in")}>+</button>
        <button className={styles.resetCamera} onClick={() => control("reset")} title="Return to the original view">Reset view</button>
      </div>
    </> : <p className={styles.sceneLoading} role="status">{status === "loading" ? "Growing a little island…" : "Illustrated mode · use the scene or the buttons below to explore"}</p>}
    {imageError && status !== "ready" && <p role="alert" className={styles.assetError}>The illustration couldn’t load. The buttons below still let you talk and move between islands.</p>}
  </>;
}
