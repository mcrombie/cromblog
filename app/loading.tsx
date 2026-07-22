import Image from "next/image";

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
          className="loading-sigil-image"
        />
      </div>
      <p className="loading-copy">Opening the next folio…</p>
    </div>
  );
}
