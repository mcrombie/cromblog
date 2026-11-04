"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { DEFAULT_VIBE, isArchivedVibeId, isVibeId, VIBE_QUERY_KEY, VIBE_STORAGE_KEY, VIBE_CHANGE_EVENT } from "@/lib/vibes";

/** Theme links work on client navigation as well as the first load. */
export function VibeLocationObserver() {
  const query = useSearchParams().get(VIBE_QUERY_KEY);
  useEffect(() => {
    const vibe = isVibeId(query) ? query : isArchivedVibeId(query) ? DEFAULT_VIBE : null;
    if (!vibe) return;
    document.documentElement.dataset.vibe = vibe;
    window.dispatchEvent(new CustomEvent(VIBE_CHANGE_EVENT, { detail: vibe }));
    try { window.localStorage.setItem(VIBE_STORAGE_KEY, vibe); } catch {}
  }, [query]);
  return null;
}
