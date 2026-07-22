"use client";

import { useEffect, useId, useState, type ChangeEvent } from "react";

import {
  DEFAULT_VIBE,
  isVibeId,
  VIBES,
  VIBE_CHANGE_EVENT,
  VIBE_DISMISSED_SESSION_KEY,
  VIBE_STORAGE_KEY,
  type VibeId
} from "@/lib/vibes";

function setDocumentVibe(vibe: VibeId) {
  document.documentElement.dataset.vibe = vibe;
  window.dispatchEvent(new CustomEvent(VIBE_CHANGE_EVENT, { detail: vibe }));
}

type VibeCycleButtonProps = {
  variant?: "floating" | "inline";
};

export function VibeCycleButton({
  variant = "floating"
}: VibeCycleButtonProps) {
  const [vibe, setVibe] = useState<VibeId | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const pickerId = useId();

  useEffect(() => {
    const documentVibe = document.documentElement.dataset.vibe;

    if (isVibeId(documentVibe)) {
      setVibe(documentVibe);
    }

    const syncStoredVibe = (event: StorageEvent) => {
      if (event.key === VIBE_STORAGE_KEY) {
        const storedVibe = isVibeId(event.newValue)
          ? event.newValue
          : DEFAULT_VIBE;

        setDocumentVibe(storedVibe);
        setVibe(storedVibe);
      }
    };

    const syncVisibleVibe = (event: Event) => {
      const changedVibe = (event as CustomEvent<unknown>).detail;

      if (isVibeId(changedVibe)) {
        setVibe(changedVibe);
      }
    };

    window.addEventListener("storage", syncStoredVibe);
    window.addEventListener(VIBE_CHANGE_EVENT, syncVisibleVibe);
    return () => {
      window.removeEventListener("storage", syncStoredVibe);
      window.removeEventListener(VIBE_CHANGE_EVENT, syncVisibleVibe);
    };
  }, []);

  const resolvedVibe = vibe ?? DEFAULT_VIBE;
  const currentIndex = VIBES.findIndex((option) => option.id === resolvedVibe);
  const current = VIBES[currentIndex] ?? VIBES[0];
  const next = VIBES[(currentIndex + 1) % VIBES.length] ?? VIBES[0];

  function restoreFloatingControl() {
    if (variant === "inline") {
      delete document.documentElement.dataset.vibeControl;

      try {
        window.sessionStorage.removeItem(VIBE_DISMISSED_SESSION_KEY);
      } catch {
        // The floating control is still restored for the current page.
      }
    }
  }

  function applyVibe(nextVibe: VibeId) {
    const nextOption = VIBES.find((option) => option.id === nextVibe) ?? VIBES[0];

    setDocumentVibe(nextOption.id);
    setVibe(nextOption.id);
    setAnnouncement(`Appearance changed to ${nextOption.label}.`);

    try {
      window.localStorage.setItem(VIBE_STORAGE_KEY, nextOption.id);
    } catch {
      // The active vibe still works when storage is unavailable.
    }
  }

  function cycleVibe() {
    restoreFloatingControl();

    const documentVibe = document.documentElement.dataset.vibe;
    const activeVibe = isVibeId(documentVibe) ? documentVibe : DEFAULT_VIBE;
    const activeIndex = VIBES.findIndex((option) => option.id === activeVibe);
    const nextVibe = VIBES[(activeIndex + 1) % VIBES.length] ?? VIBES[0];

    applyVibe(nextVibe.id);
  }

  function chooseVibe(event: ChangeEvent<HTMLSelectElement>) {
    const selectedVibe = event.currentTarget.value;

    if (isVibeId(selectedVibe)) {
      restoreFloatingControl();
      applyVibe(selectedVibe);
    }
  }

  function dismissControl() {
    document.documentElement.dataset.vibeControl = "dismissed";

    try {
      window.sessionStorage.setItem(VIBE_DISMISSED_SESSION_KEY, "1");
    } catch {
      // Dismissal still applies until the page is reloaded.
    }
  }

  return (
    <div
      className={`vibe-control${
        variant === "inline" ? " vibe-control-inline" : ""
      }`}
      role={variant === "inline" ? "group" : undefined}
      aria-label={variant === "inline" ? "Vibe controls" : undefined}
    >
      <button
        type="button"
        className={`vibe-cycle-button${
          variant === "inline" ? " vibe-cycle-button-inline folio-button" : ""
        }`}
        onClick={cycleVibe}
        aria-label={
          vibe
            ? `Change vibe. Current: ${current.label}. Next: ${next.label}.`
            : "Change vibe."
        }
        title={vibe ? `Change to ${next.label}` : "Change vibe"}
      >
        <span className="vibe-cycle-mark" aria-hidden="true">
          {"\u21bb"}
        </span>
        <span className="vibe-cycle-copy">
          <span className="vibe-cycle-action">Change vibe</span>
          <span className="vibe-cycle-name">
            {vibe
              ? variant === "inline"
                ? `Current: ${current.label}`
                : current.label
              : variant === "inline"
                ? "Current style"
                : "Appearance"}
          </span>
        </span>
      </button>
      {variant === "inline" ? (
        <div className="vibe-picker">
          <label htmlFor={pickerId} className="vibe-picker-label">
            Current style
          </label>
          <select
            id={pickerId}
            className="vibe-select"
            value={resolvedVibe}
            onChange={chooseVibe}
          >
            {VIBES.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <span className="vibe-picker-chevron" aria-hidden="true">
            {"\u2304"}
          </span>
        </div>
      ) : null}
      {variant === "floating" ? (
        <button
          type="button"
          className="vibe-dismiss-button"
          onClick={dismissControl}
          aria-label="Dismiss vibe control"
          title="Dismiss for this session"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      ) : null}
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>
    </div>
  );
}
