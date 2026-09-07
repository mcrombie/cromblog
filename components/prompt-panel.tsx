"use client";

import { useEffect, useRef, useState } from "react";

import styles from "./prompt-panel.module.css";

type PromptPanelProps = {
  id: string;
  title: string;
  prompt: string;
  downloadHref?: string;
};

export function PromptPanel({
  id,
  title,
  prompt,
  downloadHref
}: PromptPanelProps) {
  const disclosure = useRef<HTMLDetailsElement>(null);
  const manualCopy = useRef<HTMLTextAreaElement>(null);
  const [copying, setCopying] = useState(false);
  const [selectManually, setSelectManually] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    if (selectManually) {
      manualCopy.current?.focus();
      manualCopy.current?.select();
    }
  }, [selectManually]);

  async function copyPrompt() {
    setCopying(true);
    setAnnouncement("");

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard access is unavailable.");
      }

      await navigator.clipboard.writeText(prompt);
      setSelectManually(false);
      setAnnouncement("Prompt copied.");
    } catch {
      if (disclosure.current) {
        disclosure.current.open = true;
      }

      setSelectManually(true);
      // Re-select on a repeated attempt as well as the first failed attempt.
      manualCopy.current?.focus();
      manualCopy.current?.select();
      setAnnouncement(
        "Automatic copying is unavailable. The full prompt is selected. Press Ctrl+C or Command+C, or use your device’s Copy command."
      );
    } finally {
      setCopying(false);
    }
  }

  return (
    <section id={id} className={styles.panel} aria-labelledby={`${id}-title`}>
      <div className={styles.header}>
        <h3 id={`${id}-title`} className={styles.title}>
          {title}
        </h3>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.copyButton}
            onClick={copyPrompt}
            disabled={copying}
            aria-describedby={`${id}-title`}
          >
            {copying ? "Copying…" : "Copy prompt"}
          </button>
          {downloadHref ? (
            <a className={styles.download} href={downloadHref} download>
              Download .txt
            </a>
          ) : null}
        </div>
      </div>

      <details ref={disclosure} className={styles.disclosure}>
        <summary className={styles.summary}>
          <span className={styles.closedLabel}>Read the full prompt</span>
          <span className={styles.openLabel}>Close the full prompt</span>
        </summary>
        {selectManually ? (
          <textarea
            ref={manualCopy}
            className={styles.manualCopy}
            value={prompt}
            readOnly
            spellCheck={false}
            aria-label={`${title}: full prompt for manual copying`}
            aria-describedby={`${id}-status`}
          />
        ) : (
          <pre
            className={styles.prompt}
            role="region"
            aria-label={`${title}: full prompt`}
            tabIndex={0}
          >
            {prompt}
          </pre>
        )}
      </details>

      <div
        id={`${id}-status`}
        className={styles.status}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>
    </section>
  );
}
