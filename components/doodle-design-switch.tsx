"use client";

import { useEffect, useId, useState } from "react";
import {
  DEFAULT_DOODLE_DESIGN, DOODLE_DESIGNS, DOODLE_DESIGN_CHANGE_EVENT,
  DOODLE_DESIGN_QUERY_KEY, DOODLE_DESIGN_STORAGE_KEY, isDoodleDesignId,
  type DoodleDesignId
} from "@/lib/doodle-designs";
import { VIBE_DISMISSED_SESSION_KEY } from "@/lib/vibes";

export function DoodleDesignSwitch() {
  const id = useId();
  const [design, setDesign] = useState<DoodleDesignId>(DEFAULT_DOODLE_DESIGN);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    const sync = () => {
      const value = document.documentElement.dataset.doodleDesign;
      if (isDoodleDesignId(value)) setDesign(value);
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key !== DOODLE_DESIGN_STORAGE_KEY) return;
      document.documentElement.dataset.doodleDesign = isDoodleDesignId(event.newValue)
        ? event.newValue : DEFAULT_DOODLE_DESIGN;
      sync();
    };
    const onPopState = () => {
      const value = new URL(window.location.href).searchParams.get(DOODLE_DESIGN_QUERY_KEY);
      if (isDoodleDesignId(value)) document.documentElement.dataset.doodleDesign = value;
      sync();
    };
    sync();
    window.addEventListener(DOODLE_DESIGN_CHANGE_EVENT, sync);
    window.addEventListener("storage", onStorage);
    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener(DOODLE_DESIGN_CHANGE_EVENT, sync);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  function choose(value: string) {
    if (!isDoodleDesignId(value)) return;
    document.documentElement.dataset.doodleDesign = value;
    setDesign(value);
    const url = new URL(window.location.href);
    url.searchParams.set(DOODLE_DESIGN_QUERY_KEY, value);
    window.history.replaceState(window.history.state, "", url);
    try { window.localStorage.setItem(DOODLE_DESIGN_STORAGE_KEY, value); } catch {}
    window.dispatchEvent(new Event(DOODLE_DESIGN_CHANGE_EVENT));
    setAnnouncement(`Doodle Lab design changed to ${DOODLE_DESIGNS.find(option => option.id === value)?.label}.`);
  }

  function restoreControls() {
    delete document.documentElement.dataset.vibeControl;
    try { window.sessionStorage.removeItem(VIBE_DISMISSED_SESSION_KEY); } catch {}
  }

  return (
    <div className="doodle-design-switch">
      <label htmlFor={id}>Doodle Lab design</label>
      <select id={id} value={design} onChange={event => choose(event.currentTarget.value)}>
        {DOODLE_DESIGNS.map(option => <option key={option.id} value={option.id}>{option.label}</option>)}
      </select>
      <button type="button" className="doodle-restore-controls" onClick={restoreControls}>
        Show appearance controls
      </button>
      <span className="sr-only" aria-live="polite">{announcement}</span>
    </div>
  );
}
