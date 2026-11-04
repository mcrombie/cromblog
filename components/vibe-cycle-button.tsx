"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore, type ChangeEvent } from "react";
import { DOODLE_DESIGN_QUERY_KEY } from "@/lib/doodle-designs";
import styles from "./vibe-navigation.module.css";

import {
  DEFAULT_VIBE,
  isVibeId,
  VIBES,
  VIBE_CHANGE_EVENT,
  VIBE_DISMISSED_SESSION_KEY,
  VIBE_QUERY_KEY,
  VIBE_STORAGE_KEY,
  type VibeId
} from "@/lib/vibes";

function setDocumentVibe(vibe: VibeId) {
  document.documentElement.dataset.vibe = vibe;
  window.dispatchEvent(new CustomEvent(VIBE_CHANGE_EVENT, { detail: vibe }));
}

function subscribeVibe(onChange: () => void) {
  const syncStoredVibe = (event: StorageEvent) => {
    if (event.key === VIBE_STORAGE_KEY) {
      setDocumentVibe(isVibeId(event.newValue) ? event.newValue : DEFAULT_VIBE);
    }
  };
  window.addEventListener("storage", syncStoredVibe);
  window.addEventListener(VIBE_CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", syncStoredVibe);
    window.removeEventListener(VIBE_CHANGE_EVENT, onChange);
  };
}

function readDocumentVibe() {
  const vibe = document.documentElement.dataset.vibe;
  return isVibeId(vibe) ? vibe : null;
}

const serverVibe = () => null;

function focusFloatingControl() {
  const control = document.querySelector<HTMLElement>(".vibe-control:not(.vibe-control-inline)");
  const target = control?.querySelector<HTMLButtonElement>(
    window.matchMedia("(max-width: 639px)").matches ? ".vibe-mobile-trigger" : ".vibe-previous-button"
  );
  if (target && getComputedStyle(target).visibility !== "hidden") {
    target.focus({ preventScroll: true });
  } else {
    document.getElementById("main-content")?.focus({ preventScroll: true });
  }
}

type VibeCycleButtonProps = {
  variant?: "floating" | "inline" | "navigation";
};

export function VibeCycleButton({
  variant = "floating"
}: VibeCycleButtonProps) {
  const vibe = useSyncExternalStore(subscribeVibe, readDocumentVibe, serverVibe);
  const [announcement, setAnnouncement] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const controlRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const pickerId = useId();
  const panelId = useId();

  useEffect(() => {
    if (variant !== "floating") return;
    const control = controlRef.current;
    const trigger = triggerRef.current;
    if (!control || !trigger) return;
    const mobile = window.matchMedia("(max-width: 639px)");
    let frame = 0;
    let disposed = false;

    // Even a small fixed button can cover a link. Yield its space while any
    // page interaction crosses it, rather than forwarding or swallowing taps.
    function updateClearance() {
      if (!control || !trigger) return;
      if (!mobile.matches) {
        delete control.dataset.mobileBlocked;
        return;
      }
      if (document.documentElement.dataset.vibeControl === "dismissed") return;
      const box = trigger.getBoundingClientRect();
      const targets = document.querySelectorAll<HTMLElement>(
        'a[href], button, input, select, textarea, summary, [role="button"], [tabindex]:not([tabindex="-1"]), [contenteditable="true"]'
      );
      const blocked = Array.from(targets).some((target) => {
        if (control.contains(target) || target.closest('[aria-hidden="true"]')) return false;
        const style = getComputedStyle(target);
        if (style.visibility === "hidden" || style.display === "none") return false;
        return Array.from(target.getClientRects()).some((rect) =>
          rect.width > 0 && rect.height > 0 && rect.left < box.right + 4 &&
          rect.right > box.left - 4 && rect.top < box.bottom + 4 && rect.bottom > box.top - 4
        );
      });
      control.dataset.mobileBlocked = String(blocked);
      if (blocked) {
        setMobileOpen(false);
        if (control.contains(document.activeElement)) {
          document.getElementById("main-content")?.focus({ preventScroll: true });
        }
      }
    }

    function scheduleClearance() {
      if (disposed) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateClearance);
    }

    function closeForScroll() {
      if (!mobile.matches) return;
      updateClearance();
      if (control?.dataset.mobileOpen === "true") {
        setMobileOpen(false);
        if (control.contains(document.activeElement)) focusFloatingControl();
      }
    }

    function closeFromOutside(event: PointerEvent) {
      if (mobile.matches && control?.dataset.mobileOpen === "true" &&
          event.target instanceof Node && !control.contains(event.target)) {
        setMobileOpen(false);
        if (control.contains(document.activeElement)) focusFloatingControl();
      }
    }

    function closeWithEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && mobile.matches && control?.dataset.mobileOpen === "true") {
        event.preventDefault();
        setMobileOpen(false);
        focusFloatingControl();
      }
    }

    function changeBreakpoint() {
      setMobileOpen(false);
      updateClearance();
      if (control?.contains(document.activeElement)) focusFloatingControl();
    }

    const resize = new ResizeObserver(scheduleClearance);
    resize.observe(document.body);
    resize.observe(trigger);
    const mutations = new MutationObserver(scheduleClearance);
    mutations.observe(document.documentElement, { attributes: true, attributeFilter: ["data-vibe", "data-vibe-control"] });
    mutations.observe(document.body, { childList: true, subtree: true });
    document.addEventListener("scroll", closeForScroll, { passive: true, capture: true });
    document.addEventListener("load", scheduleClearance, true);
    document.addEventListener("pointerdown", closeFromOutside, true);
    document.addEventListener("keydown", closeWithEscape);
    window.addEventListener("resize", scheduleClearance);
    window.visualViewport?.addEventListener("resize", scheduleClearance);
    window.visualViewport?.addEventListener("scroll", closeForScroll);
    mobile.addEventListener("change", changeBreakpoint);
    document.fonts.ready.then(scheduleClearance);
    updateClearance();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resize.disconnect();
      mutations.disconnect();
      document.removeEventListener("scroll", closeForScroll, true);
      document.removeEventListener("load", scheduleClearance, true);
      document.removeEventListener("pointerdown", closeFromOutside, true);
      document.removeEventListener("keydown", closeWithEscape);
      window.removeEventListener("resize", scheduleClearance);
      window.visualViewport?.removeEventListener("resize", scheduleClearance);
      window.visualViewport?.removeEventListener("scroll", closeForScroll);
      mobile.removeEventListener("change", changeBreakpoint);
    };
  }, [variant]);

  const resolvedVibe = vibe ?? DEFAULT_VIBE;
  const currentIndex = VIBES.findIndex((option) => option.id === resolvedVibe);
  const current = VIBES[currentIndex] ?? VIBES[0];
  const previous =
    VIBES[(currentIndex - 1 + VIBES.length) % VIBES.length] ??
    VIBES[VIBES.length - 1];
  const next = VIBES[(currentIndex + 1) % VIBES.length] ?? VIBES[0];

  function restoreFloatingControl() {
    if (variant !== "floating") {
      delete document.documentElement.dataset.vibeControl;

      try {
        window.sessionStorage.removeItem(VIBE_DISMISSED_SESSION_KEY);
      } catch {
        // The floating control is still restored for the current page.
      }
    }
  }

  // The sidebar offers this once the floating control has been dismissed for the session.
  function restoreDismissedControl() {
    delete document.documentElement.dataset.vibeControl;

    try {
      window.sessionStorage.removeItem(VIBE_DISMISSED_SESSION_KEY);
    } catch {
      // The floating control is still restored for the current page.
    }
    // Let the restored mobile control check its space before moving focus.
    requestAnimationFrame(() => requestAnimationFrame(focusFloatingControl));
  }

  function applyVibe(nextVibe: VibeId) {
    const nextOption = VIBES.find((option) => option.id === nextVibe) ?? VIBES[0];

    const url = new URL(window.location.href);
    if (url.searchParams.has(DOODLE_DESIGN_QUERY_KEY) || url.searchParams.has(VIBE_QUERY_KEY)) {
      url.searchParams.delete(DOODLE_DESIGN_QUERY_KEY);
      url.searchParams.delete(VIBE_QUERY_KEY);
      window.history.replaceState(window.history.state, "", url);
    }

    setDocumentVibe(nextOption.id);
    setAnnouncement(`Appearance changed to ${nextOption.label}.`);

    try {
      window.localStorage.setItem(VIBE_STORAGE_KEY, nextOption.id);
    } catch {
      // The active vibe still works when storage is unavailable.
    }
  }

  function stepVibe(direction: -1 | 1) {
    restoreFloatingControl();

    const documentVibe = document.documentElement.dataset.vibe;
    const activeVibe = isVibeId(documentVibe) ? documentVibe : DEFAULT_VIBE;
    const activeIndex = VIBES.findIndex((option) => option.id === activeVibe);
    const adjacentIndex =
      (activeIndex + direction + VIBES.length) % VIBES.length;
    const adjacentVibe = VIBES[adjacentIndex] ?? VIBES[0];

    applyVibe(adjacentVibe.id);
  }

  function chooseVibe(event: ChangeEvent<HTMLSelectElement>) {
    const selectedVibe = event.currentTarget.value;

    if (isVibeId(selectedVibe)) {
      restoreFloatingControl();
      applyVibe(selectedVibe);
    }
  }

  function dismissControl() {
    setMobileOpen(false);
    document.documentElement.dataset.vibeControl = "dismissed";
    // Keep the reading position and move focus off the now-hidden button.
    document.getElementById("main-content")?.focus({ preventScroll: true });

    try {
      window.sessionStorage.setItem(VIBE_DISMISSED_SESSION_KEY, "1");
    } catch {
      // Dismissal still applies until the page is reloaded.
    }
  }

  // This permanent entry point deliberately has no floating-control classes:
  // footer positioning and a dismissed widget must never hide theme selection.
  if (variant === "navigation") {
    return (
      <div className={`${styles.navigation} vibe-navigation`}>
        <label className={styles.label} htmlFor={pickerId}>Vibe</label>
        <span className={styles.selectWrap}>
          <select id={pickerId} className={styles.select} value={resolvedVibe} onChange={chooseVibe}>
            {VIBES.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
          </select>
        </span>
        <button type="button" className={`${styles.restore} vibe-restore-button`} onClick={restoreDismissedControl}>
          Show appearance controls
        </button>
        <span className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</span>
      </div>
    );
  }

  return (
    <div
      ref={controlRef}
      className={`vibe-control${
        variant === "inline" ? " vibe-control-inline" : ""
      }`}
      role="group"
      aria-label="Vibe controls"
      data-mobile-open={variant === "floating" ? mobileOpen : undefined}
      data-mobile-blocked={variant === "floating" ? "pending" : undefined}
    >
      {variant === "floating" ? (
        <button
          ref={triggerRef}
          type="button"
          className="vibe-mobile-trigger"
          aria-expanded={mobileOpen}
          aria-controls={panelId}
          aria-label={`${mobileOpen ? "Close" : "Open"} appearance controls. Current: ${current.label}.`}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? "Close" : "Vibe"}
        </button>
      ) : null}
      <div className="vibe-control-panel" id={panelId}>
        {variant === "floating" ? <p className="vibe-mobile-current">{current.label}</p> : null}
        <div className="vibe-stepper">
          <button
            type="button"
            className="vibe-previous-button"
            onClick={() => stepVibe(-1)}
            aria-label={
              vibe
                ? `Previous vibe: ${previous.label}. Current: ${current.label}.`
                : "Previous vibe."
            }
            title={vibe ? `Previous: ${previous.label}` : "Previous vibe"}
          >
            <span aria-hidden="true">{"\u2190"}</span>
          </button>
          <button
            type="button"
            className={`vibe-cycle-button${
              variant === "inline"
                ? " vibe-cycle-button-inline folio-button"
                : ""
            }`}
            onClick={() => stepVibe(1)}
            aria-label={
              vibe
                ? `Next vibe: ${next.label}. Current: ${current.label}.`
                : "Next vibe."
            }
            title={vibe ? `Next: ${next.label}` : "Next vibe"}
          >
            <span className="vibe-cycle-mark" aria-hidden="true">
              {"\u2192"}
            </span>
            <span className="vibe-cycle-copy">
              <span className="vibe-cycle-action">{variant === "floating" ? "Current vibe" : "Next vibe"}</span>
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
            {variant === "floating" ? <span className="vibe-cycle-compact-label" aria-hidden="true">Vibe</span> : null}
          </button>
        </div>
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
            aria-label="Dismiss vibe control for this session"
            title="Dismiss for this session"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        ) : null}
      </div>
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>
    </div>
  );
}
