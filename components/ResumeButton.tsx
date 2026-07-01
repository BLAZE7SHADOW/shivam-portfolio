"use client";

import posthog from "posthog-js";
import { Download } from "lucide-react";

interface ResumeButtonProps {
  href: string;
  variant?: "hero" | "contact";
}

export default function ResumeButton({ href, variant = "contact" }: ResumeButtonProps) {
  function handleClick() {
    posthog.capture("resume_downloaded", { variant });
  }

  if (variant === "hero") {
    return (
      <a
        href={href}
        download
        data-mag
        onClick={handleClick}
        className="inline-flex items-center gap-2 rounded-xl border border-panel-border bg-panel px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-white/[0.06]"
      >
        <Download className="h-4 w-4" /> Resume
      </a>
    );
  }

  return (
    <a
      href={href}
      download
      data-mag
      onClick={handleClick}
      className="inline-flex items-center gap-2 rounded-full border border-panel-border px-4.5 py-2.5 text-sm text-ink-dim transition-all hover:-translate-y-0.5 hover:border-accent hover:text-ink"
    >
      <Download className="h-4 w-4" /> Resume
    </a>
  );
}
