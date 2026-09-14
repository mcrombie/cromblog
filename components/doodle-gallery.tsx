"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { doodleGalleryViews } from "@/content/art";
import type {
  DoodleBatch,
  DoodleCatalogEntry
} from "@/content/doodle-catalog";
import { doodleSubjects, type DoodleSubjectGroups } from "@/content/doodle-subjects";

type DoodleGalleryProps = {
  entries: readonly DoodleCatalogEntry[];
  batches: readonly DoodleBatch[];
  subjectGroups: DoodleSubjectGroups;
};

type GalleryView = (typeof doodleGalleryViews)[number]["id"];

const PAGE_SIZE = 24;

function readableLabel(value: string) {
  return value.replace(/[-_]/g, " ");
}

export function drawingFromUrl(href: string, entries: readonly DoodleCatalogEntry[]): DoodleCatalogEntry | undefined {
  const url = new URL(href);
  if (url.hash === "#experiments") return undefined;
  const id = url.searchParams.get("drawing");
  return id ? entries.find((entry) => entry.id === id) : undefined;
}

export function drawingPreviewUrl(href: string, id: string | null): string {
  const url = new URL(href);
  if (id) url.searchParams.set("drawing", id);
  else url.searchParams.delete("drawing");
  return `${url.pathname}${url.search}${url.hash}`;
}

export function filterDoodleEntries(
  entries: readonly DoodleCatalogEntry[],
  subjectGroups: DoodleSubjectGroups,
  filters: { query: string; batchId: string; subject: string }
): DoodleCatalogEntry[] {
  const searchTerms = filters.query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return entries.filter((entry) => {
    if (filters.batchId !== "all" && entry.batchId !== filters.batchId) return false;
    if (filters.subject !== "all" && subjectGroups[entry.category] !== filters.subject) return false;
    const subjectLabel = doodleSubjects.find((subject) => subject.id === subjectGroups[entry.category])?.label ?? "";
    const searchable = [entry.title, entry.category, subjectLabel, ...entry.tags]
      .join(" ").replace(/[-_]/g, " ").toLocaleLowerCase();
    return searchTerms.every((term) => searchable.includes(term.replace(/[-_]/g, " ")));
  });
}

export function DoodleGallery({ entries, batches, subjectGroups }: DoodleGalleryProps) {
  const [view, setView] = useState<GalleryView>("curated");
  const [query, setQuery] = useState("");
  const [batchId, setBatchId] = useState("all");
  const [category, setCategory] = useState("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selected, setSelected] = useState<DoodleCatalogEntry | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const focusSearchOnClose = useRef(false);
  const subjects = doodleSubjects.filter((subject) => Object.values(subjectGroups).includes(subject.id));
  const scopedEntries = filterDoodleEntries(entries, subjectGroups, { query, batchId, subject: category });
  const filteredEntries = scopedEntries.filter(
    (entry) => view === "all" || entry.status === view
  );
  const visibleEntries = filteredEntries.slice(0, visibleCount);
  const currentView = doodleGalleryViews.find((item) => item.id === view)!;
  const hasFilters = query !== "" || batchId !== "all" || category !== "all";
  const selectedIndex = selected
    ? filteredEntries.findIndex((entry) => entry.id === selected.id)
    : -1;
  const selectedBatch = batches.find((batch) => batch.id === selected?.batchId);

  useEffect(() => {
    const syncDrawing = () => {
      const drawing = drawingFromUrl(window.location.href, entries);
      if (!drawing) {
        setSelected(null);
        return;
      }
      setView("all");
      setQuery("");
      setBatchId("all");
      setCategory("all");
      setVisibleCount(PAGE_SIZE);
      focusSearchOnClose.current = true;
      setSelected(drawing);
    };
    syncDrawing();
    window.addEventListener("popstate", syncDrawing);
    window.addEventListener("hashchange", syncDrawing);
    return () => {
      window.removeEventListener("popstate", syncDrawing);
      window.removeEventListener("hashchange", syncDrawing);
    };
  }, [entries]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (selected && dialog && !dialog.open) dialog.showModal();
    if (!selected && dialog?.open) dialog.close();
  }, [selected]);

  function openDrawing(entry: DoodleCatalogEntry) {
    setSelected(entry);
    window.history.replaceState(window.history.state, "", drawingPreviewUrl(window.location.href, entry.id));
  }

  function closePreview() {
    setSelected(null);
    window.history.replaceState(window.history.state, "", drawingPreviewUrl(window.location.href, null));
  }

  useEffect(() => {
    if (!selected) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [selected]);

  function resetFilters() {
    setQuery("");
    setBatchId("all");
    setCategory("all");
    setVisibleCount(PAGE_SIZE);
  }

  function searchTag(tag: string) {
    setQuery(readableLabel(tag));
    setBatchId("all");
    setCategory("all");
    setView("all");
    setVisibleCount(PAGE_SIZE);
    focusSearchOnClose.current = true;
    closePreview();
  }

  return (
    <section className="art-gallery doodle-gallery" aria-label="Notebook drawing collection">
      <div className="doodle-gallery-overview">
        <span>{entries.length} drawings</span>
        <span>{batches.length} {batches.length === 1 ? "collection" : "collections"}</span>
      </div>

      <div className="doodle-gallery-views" role="group" aria-label="Drawing selection">
        {doodleGalleryViews.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`doodle-gallery-view${view === item.id ? " is-active" : ""}`}
            aria-pressed={view === item.id}
            onClick={() => {
              setView(item.id);
              setVisibleCount(PAGE_SIZE);
            }}
          >
            {item.label}
            <span className="doodle-gallery-count">
              {item.id === "all"
                ? scopedEntries.length
                : scopedEntries.filter((entry) => entry.status === item.id).length}
            </span>
          </button>
        ))}
      </div>

      <div className="doodle-gallery-filters">
        <label className="doodle-gallery-field doodle-gallery-search">
          <span>Find a doodle</span>
          <input
            ref={searchRef}
            type="search"
            value={query}
            placeholder="Search drawings or tags…"
            onChange={(event) => {
              setQuery(event.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
          />
        </label>
        <label className="doodle-gallery-field">
          <span>Collection</span>
          <select
            value={batchId}
            onChange={(event) => {
              setBatchId(event.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
          >
            <option value="all">All batches</option>
            {batches.map((batch) => (
              <option key={batch.id} value={batch.id}>{batch.title}</option>
            ))}
          </select>
        </label>
        <label className="doodle-gallery-field">
          <span>Subject</span>
          <select
            value={category}
            onChange={(event) => {
              setCategory(event.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
          >
            <option value="all">All subjects</option>
            {subjects.map((item) => (
              <option key={item.id} value={item.id}>{item.label}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="doodle-gallery-results" aria-live="polite" aria-atomic="true">
        <p>
          {hasFilters
            ? `${filteredEntries.length} matching ${filteredEntries.length === 1 ? "drawing" : "drawings"}.`
            : currentView.description}
        </p>
        {hasFilters ? (
          <button type="button" className="doodle-gallery-clear" onClick={resetFilters}>
            Clear filters
          </button>
        ) : null}
      </div>

      {visibleEntries.length ? (
        <div className="art-gallery-grid doodle-gallery-grid">
          {visibleEntries.map((entry) => (
            <figure key={entry.id} className="art-card doodle-gallery-card">
              <button
                type="button"
                className="art-card-visual doodle-gallery-open"
                aria-label={`View ${entry.title}`}
                onClick={() => openDrawing(entry)}
              >
                <span className="art-card-image-frame">
                  <Image
                    src={entry.src}
                    alt={entry.alt}
                    fill
                    sizes="(max-width: 639px) 88vw, (max-width: 1279px) 44vw, 30vw"
                    quality={90}
                    className="art-card-image"
                  />
                </span>
                <span className="doodle-gallery-enlarge" aria-hidden="true">View drawing ↗</span>
              </button>
              <figcaption className="doodle-gallery-caption">
                <div>
                  <h2>{entry.title}</h2>
                  <p>{doodleSubjects.find((subject) => subject.id === subjectGroups[entry.category])?.label}</p>
                </div>
                <span className="doodle-gallery-status">
                  {doodleGalleryViews.find((item) => item.id === entry.status)?.label}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <div className="doodle-gallery-empty">
          <h2>No drawings in this selection</h2>
          <p>Try another subject, batch, or search term.</p>
          {view !== "all" ? (
            <button
              type="button"
              className="folio-button"
              onClick={() => {
                setView("all");
                setVisibleCount(PAGE_SIZE);
              }}
            >
              Search all drawings
            </button>
          ) : null}
        </div>
      )}

      {filteredEntries.length > PAGE_SIZE ? (
        <div className="doodle-gallery-pagination">
          <p>Showing {visibleEntries.length} of {filteredEntries.length} drawings</p>
          {visibleEntries.length < filteredEntries.length ? (
            <button
              type="button"
              className="folio-button"
              onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            >
              Show more drawings
            </button>
          ) : null}
        </div>
      ) : null}

      <dialog
        ref={dialogRef}
        className="doodle-gallery-dialog"
        aria-labelledby="doodle-preview-title"
        onClose={() => {
          closePreview();
          if (focusSearchOnClose.current) {
            searchRef.current?.focus();
            focusSearchOnClose.current = false;
          }
        }}
        onCancel={closePreview}
        onClick={(event) => {
          if (event.target === event.currentTarget) closePreview();
        }}
      >
        {selected ? (
          <div className="doodle-gallery-preview">
            <div className="doodle-gallery-preview-toolbar">
              <span>Drawing {selectedIndex + 1} of {filteredEntries.length}</span>
              <button
                type="button"
                className="doodle-gallery-close"
                onClick={closePreview}
                autoFocus
              >
                Close <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="doodle-gallery-preview-image art-card-visual">
              <Image
                src={selected.src}
                alt={selected.alt}
                width={selected.image.width}
                height={selected.image.height}
                sizes="(max-width: 760px) 92vw, 900px"
                quality={95}
                className="art-card-image"
              />
            </div>
            <div className="doodle-gallery-preview-details">
              <div>
                <p className="doodle-gallery-preview-batch">{selectedBatch?.title}</p>
                <h2 id="doodle-preview-title">{selected.title}</h2>
                <p>{selected.alt}</p>
              </div>
              <div className="doodle-gallery-tags" aria-label="Find related drawings">
                {selected.tags.map((tag) => (
                  <button key={tag} type="button" onClick={() => searchTag(tag)}>
                    {readableLabel(tag)}
                  </button>
                ))}
              </div>
              <div className="doodle-gallery-preview-actions">
                <div className="doodle-gallery-step" aria-label="Browse drawings">
                  <button
                    type="button"
                    disabled={selectedIndex <= 0}
                    onClick={() => openDrawing(filteredEntries[selectedIndex - 1])}
                  >
                    ← Previous
                  </button>
                  <button
                    type="button"
                    disabled={selectedIndex >= filteredEntries.length - 1}
                    onClick={() => openDrawing(filteredEntries[selectedIndex + 1])}
                  >
                    Next →
                  </button>
                </div>
                <a href={selected.src} target="_blank" rel="noopener noreferrer">
                  Open full size <span aria-hidden="true">↗</span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>
            </div>
          </div>
        ) : null}
      </dialog>
    </section>
  );
}
