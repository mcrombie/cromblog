"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { isVibeId, VIBE_QUERY_KEY, VIBE_STORAGE_KEY, VIBE_CHANGE_EVENT } from "@/lib/vibes";

/** Theme links work on client navigation as well as the first load. */
export function VibeLocationObserver() {
  const query = useSearchParams().get(VIBE_QUERY_KEY);
  useEffect(() => {
    if (!isVibeId(query)) return;
    document.documentElement.dataset.vibe = query;
    window.dispatchEvent(new CustomEvent(VIBE_CHANGE_EVENT, { detail: query }));
    try { window.localStorage.setItem(VIBE_STORAGE_KEY, query); } catch {}
  }, [query]);
  return null;
}
