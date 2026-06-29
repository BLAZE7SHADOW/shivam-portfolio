"use client";

import { useState, useEffect, useCallback } from "react";
import type { Media } from "@/content/data";

function MediaFrame({
  item,
  onClick,
}: {
  item: Media;
  onClick?: () => void;
}) {
  if (item.type === "video") {
    return (
      <video
        className="aspect-video w-full rounded-xl border border-panel-border object-cover"
        src={item.src}
        autoPlay
        muted
        loop
        playsInline
        controls
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={item.src}
      alt={item.caption || "project media"}
      onClick={onClick}
      className="aspect-video w-full cursor-zoom-in rounded-xl border border-panel-border object-cover transition-opacity hover:opacity-90"
    />
  );
}

export default function Gallery({ media }: { media: Media[] }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  const prev = useCallback(() =>
    setLightbox((i) => (i !== null && i > 0 ? i - 1 : i)), []);

  const next = useCallback(() =>
    setLightbox((i) => (i !== null && i < media.length - 1 ? i + 1 : i)), [media.length]);

  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, closeLightbox, prev, next]);

  if (!media || media.length === 0) return null;

  const current = media[Math.min(active, media.length - 1)];

  return (
    <>
      <div>
        <MediaFrame item={current} onClick={() => setLightbox(active)} />

        {current.caption && (
          <div className="mt-2 text-center font-mono text-[11px] text-ink-faint">
            {current.caption} <span className="ml-1 text-accent-2">· click to zoom</span>
          </div>
        )}

        {media.length > 1 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {media.map((m, i) => (
              <button
                key={m.src}
                data-mag
                onClick={() => setActive(i)}
                aria-label={`View ${m.caption || m.type + " " + (i + 1)}`}
                className={`relative h-12 w-16 overflow-hidden rounded-md border transition-all ${
                  i === active
                    ? "border-accent ring-1 ring-accent"
                    : "border-panel-border opacity-60 hover:opacity-100"
                }`}
              >
                {m.type === "video" ? (
                  <span className="flex h-full w-full items-center justify-center bg-bg-soft text-[10px] text-ink-dim">
                    ▶ vid
                  </span>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.src} alt="" className="h-full w-full object-cover" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[9999] bg-black/94 backdrop-blur-md"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>

          {/* Main layout: prev | image | next */}
          <div className="flex h-full w-full items-center justify-between gap-3 px-4">
            {/* Prev */}
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              disabled={lightbox === 0}
              className="z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white disabled:opacity-0"
              aria-label="Previous"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Image + caption */}
            <div
              className="flex flex-1 flex-col items-center gap-3 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={media[lightbox].src}
                alt={media[lightbox].caption || "project screenshot"}
                className="max-h-[82vh] w-full rounded-2xl border border-white/10 object-contain shadow-2xl"
              />
              <div className="flex items-center gap-4">
                {media[lightbox].caption && (
                  <span className="font-mono text-xs text-white/50">{media[lightbox].caption}</span>
                )}
                {media.length > 1 && (
                  <span className="font-mono text-xs text-white/30">{lightbox + 1} / {media.length}</span>
                )}
              </div>
            </div>

            {/* Next */}
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              disabled={lightbox === media.length - 1}
              className="z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white disabled:opacity-0"
              aria-label="Next"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
