"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

type ArtTab = "drawings" | "experiments";
const tabs: readonly ArtTab[] = ["drawings", "experiments"];

export function ArtTabs({ drawings, experiments, experimentCount }: {
  drawings: ReactNode;
  experiments: ReactNode;
  experimentCount: number;
}) {
  const [active, setActive] = useState<ArtTab>("drawings");
  const buttons = useRef<Partial<Record<ArtTab, HTMLButtonElement | null>>>({});

  useEffect(() => {
    const syncTab = () => setActive(window.location.hash === "#experiments" ? "experiments" : "drawings");
    syncTab();
    window.addEventListener("hashchange", syncTab);
    window.addEventListener("popstate", syncTab);
    return () => {
      window.removeEventListener("hashchange", syncTab);
      window.removeEventListener("popstate", syncTab);
    };
  }, []);

  function selectTab(tab: ArtTab) {
    setActive(tab);
    window.history.replaceState(window.history.state, "", `#${tab}`);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, tab: ArtTab) {
    let next: ArtTab;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      next = tabs[(tabs.indexOf(tab) + 1) % tabs.length];
    } else if (event.key === "Home") {
      next = "drawings";
    } else if (event.key === "End") {
      next = "experiments";
    } else {
      return;
    }
    event.preventDefault();
    selectTab(next);
    buttons.current[next]?.focus();
  }

  return (
    <div className="art-tabs">
      <div className="art-tab-list" role="tablist" aria-label="Art collections">
        {tabs.map((tab) => (
          <button
            key={tab}
            ref={(element) => { buttons.current[tab] = element; }}
            id={`art-tab-${tab}`}
            type="button"
            role="tab"
            aria-selected={active === tab}
            aria-controls={tab}
            tabIndex={active === tab ? 0 : -1}
            className={`art-tab${active === tab ? " is-active" : ""}`}
            onClick={() => selectTab(tab)}
            onKeyDown={(event) => handleKeyDown(event, tab)}
          >
            {tab === "drawings" ? "Drawings" : "Experiments"}
            {tab === "experiments" ? <span className="doodle-gallery-count">{experimentCount}</span> : null}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab}
          id={tab}
          role="tabpanel"
          aria-labelledby={`art-tab-${tab}`}
          hidden={active !== tab}
          tabIndex={0}
          className="art-tab-panel"
        >
          {tab === "drawings" ? drawings : experiments}
        </div>
      ))}
    </div>
  );
}
