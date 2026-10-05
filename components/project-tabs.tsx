"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

import type { ProjectCategory } from "@/content/site";

type ProjectTab = "all" | ProjectCategory;

/**
 * The Projects page's tabs: All, then one per category. The cards are all rendered on the server; the active tab
 * only decides which are shown, and is kept in the URL (`/projects#games`) so a tab can be linked to.
 */
export function ProjectTabs({ tabs, counts, children }: {
  tabs: readonly { id: ProjectCategory; label: string }[];
  counts: Readonly<Record<ProjectTab, number>>;
  children: ReactNode;
}) {
  const all: readonly { id: ProjectTab; label: string }[] = [{ id: "all", label: "All" }, ...tabs];
  const [active, setActive] = useState<ProjectTab>("all");
  const buttons = useRef<Partial<Record<ProjectTab, HTMLButtonElement | null>>>({});

  useEffect(() => {
    const sync = () => {
      const hash = window.location.hash.slice(1);
      setActive(all.some((tab) => tab.id === hash) ? (hash as ProjectTab) : "all");
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
    // The tab list is fixed for the page's lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function select(tab: ProjectTab) {
    setActive(tab);
    const { pathname, search } = window.location;
    window.history.replaceState(window.history.state, "", `${pathname}${search}${tab === "all" ? "" : `#${tab}`}`);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, tab: ProjectTab) {
    const index = all.findIndex((item) => item.id === tab);
    const next = event.key === "ArrowRight" ? all[(index + 1) % all.length]
      : event.key === "ArrowLeft" ? all[(index - 1 + all.length) % all.length]
        : event.key === "Home" ? all[0]
          : event.key === "End" ? all[all.length - 1] : null;
    if (!next) return;
    event.preventDefault();
    select(next.id);
    buttons.current[next.id]?.focus();
  }

  return (
    <div className="project-tabs">
      <div className="art-tab-list" role="tablist" aria-label="Project categories" style={{ flexWrap: "wrap" }}>
        {all.map((tab) => (
          <button
            key={tab.id}
            ref={(element) => { buttons.current[tab.id] = element; }}
            id={`project-tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            aria-controls="project-tab-panel"
            tabIndex={active === tab.id ? 0 : -1}
            className={`art-tab${active === tab.id ? " is-active" : ""}`}
            onClick={() => select(tab.id)}
            onKeyDown={(event) => handleKeyDown(event, tab.id)}
          >
            {tab.label}
            <span className="doodle-gallery-count">{counts[tab.id]}</span>
          </button>
        ))}
      </div>
      <div id="project-tab-panel" role="tabpanel" aria-labelledby={`project-tab-${active}`} data-category={active}
        className="project-tab-panel">
        {children}
      </div>
    </div>
  );
}
