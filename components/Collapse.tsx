"use client";

import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Collapse — a "dig deeper" disclosure. Summary row (icon + label + chevron)
 * toggles a body with a smooth height transition. Respects prefers-reduced-motion
 * (opens instantly). Styled to match the site's glass panels.
 */
export default function Collapse({
  label,
  hint,
  children,
  defaultOpen = false,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const bodyRef = useRef<HTMLDivElement>(null);

  return (
    <div className="overflow-hidden rounded-2xl border border-panel-border bg-panel">
      <button
        type="button"
        data-mag
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-white/[0.02]"
      >
        <span className="flex items-baseline gap-3">
          <span className="text-[15px] font-semibold text-ink">{label}</span>
          {hint && <span className="font-mono text-[11px] text-ink-faint">{hint}</span>}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-ink-dim transition-transform duration-300 motion-reduce:transition-none ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        ref={bodyRef}
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
        className="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
      >
        <div className="overflow-hidden">
          <div className="border-t border-panel-border px-5 py-5">{children}</div>
        </div>
      </div>
    </div>
  );
}
