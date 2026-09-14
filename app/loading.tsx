import Image from "next/image";

import { LoadingSigil } from "@/components/loading-sigil";
import { NotebookDoodle } from "@/components/notebook-doodle";

export default function Loading() {
  return (
    <div
      className="route-loading"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="loading-sigil-frame" aria-hidden="true">
        <Image
          src="/loading-sigil.png"
          alt=""
          width={192}
          height={192}
          priority
          unoptimized
          className="loading-sigil-image loading-sigil-original"
        />
        <LoadingSigil className="loading-sigil-image loading-sigil-themed" />
        <NotebookDoodle id="um22-p083-e" className="doodle-loading-knot" />
      </div>
      <p className="loading-copy">Opening the next folio…</p>
    </div>
  );
}
