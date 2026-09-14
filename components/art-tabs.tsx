"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

type ArtTab = "showcase" | "drawings" | "experiments";
const tabs: readonly ArtTab[] = ["showcase", "drawings", "experiments"];

// Next's client navigation can change a drawing query without a native history
// event. Keep the existing gallery URL listeners in sync in that case, too.
function ArtLocationObserver() {
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  useEffect(() => {
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  }, [query]);
  return null;
}

function tabFromLocation(): ArtTab {
  const url = new URL(window.location.href);
  if (url.hash === "#experiments") return "experiments";
  if (url.hash === "#drawings" || url.searchParams.has("drawing")) return "drawings";
  return "showcase";
}

export function ArtTabs({ showcase, drawings, experiments, experimentCount }: {
  showcase: ReactNode;
  drawings: ReactNode;
  experiments: ReactNode;
  experimentCount: number;
}) {
  const [active, setActive] = useState<ArtTab>("showcase");
  const buttons = useRef<Partial<Record<ArtTab, HTMLButtonElement | null>>>({});

  useEffect(() => {
    const syncTab = () => setActive(tabFromLocation());
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
    const url = new URL(window.location.href);
    url.hash = tab;
    if (tab !== "drawings") url.searchParams.delete("drawing");
    window.history.pushState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, tab: ArtTab) {
    let next: ArtTab;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      const direction = event.key === "ArrowRight" ? 1 : -1;
      next = tabs[(tabs.indexOf(tab) + direction + tabs.length) % tabs.length];
    } else if (event.key === "Home") {
      next = "showcase";
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
      <Suspense fallback={null}><ArtLocationObserver /></Suspense>
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
            {tab === "showcase" ? "Showcase" : tab === "drawings" ? "Drawings" : "Experiments"}
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
          {tab === "showcase" ? showcase : tab === "drawings" ? drawings : experiments}
        </div>
      ))}
    </div>
  );
}
