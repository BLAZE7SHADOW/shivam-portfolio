"use client";

import { useState } from "react";
import type { Media } from "@/content/data";

function MediaFrame({ item }: { item: Media }) {
  if (item.type === "video") {
    return (
      <video
        key={item.src}
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
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      key={item.src}
      src={item.src}
      alt={item.caption || "project media"}
      className="aspect-video w-full rounded-xl border border-panel-border object-cover"
    />
  );
}

export default function Gallery({ media }: { media: Media[] }) {
  const [active, setActive] = useState(0);

  // Placeholder when no media yet
  if (!media || media.length === 0) {
    return (
      <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border border-panel-border bg-bg-soft">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(500px circle at 30% 20%, rgba(124,92,255,0.25), transparent 50%), radial-gradient(400px circle at 80% 80%, rgba(34,211,238,0.18), transparent 50%)",
          }}
        />
        <span className="relative font-mono text-xs text-ink-faint">demo coming soon</span>
      </div>
    );
  }

  const current = media[Math.min(active, media.length - 1)];

  return (
    <div>
      <MediaFrame item={current} />

      {current.caption && (
        <div className="mt-2 text-center font-mono text-[11px] text-ink-faint">{current.caption}</div>
      )}

      {/* thumbnails — only when more than one */}
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
  );
}
