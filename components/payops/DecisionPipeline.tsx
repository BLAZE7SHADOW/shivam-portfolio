"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { payops } from "@/content/payops";
import { OWNER, OwnerChip } from "./owners";

const stages = payops.stages;
const MODEL_OWNERS = new Set(["jev", "gemini"]);

export default function DecisionPipeline() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-80px" });
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(false);

  // Auto-advance through the pipeline until the visitor takes over.
  useEffect(() => {
    if (!inView || pinned || reduce) return;
    const t = setInterval(() => setActive((a) => (a + 1) % stages.length), 2600);
    return () => clearInterval(t);
  }, [inView, pinned, reduce]);

  const s = stages[active];
  const color = OWNER[s.owner].color;

  return (
    <div ref={ref} className="rounded-2xl border border-panel-border bg-panel p-4 sm:p-6">
      {/* legend */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {(["rules", "jev", "gemini", "code", "human", "validator"] as const).map((o) => (
          <OwnerChip key={o} owner={o} />
        ))}
      </div>

      <div className="relative grid grid-cols-5 gap-2 lg:grid-cols-10">
        {stages.map((st, i) => {
          const c = OWNER[st.owner].color;
          const on = i === active;
          const past = i < active;
          return (
            <button
              key={st.stage}
              type="button"
              data-mag
              onMouseEnter={() => { setPinned(true); setActive(i); }}
              onFocus={() => { setPinned(true); setActive(i); }}
              onClick={() => { setPinned(true); setActive(i); }}
              aria-pressed={on}
              className="group relative flex flex-col items-start gap-2 rounded-xl border px-2.5 py-3 text-left transition-colors"
              style={{
                borderColor: on ? c + "80" : "rgba(255,255,255,0.08)",
                background: on ? c + "14" : "rgba(255,255,255,0.015)",
              }}
            >
              <span className="font-mono text-[10px] text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-[13px] font-semibold leading-tight text-ink">{st.stage}</span>
              <span className="flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full transition-transform"
                  style={{ background: c, boxShadow: on ? `0 0 12px ${c}` : "none", transform: on ? "scale(1.3)" : "none" }}
                />
                <span className="font-mono text-[9.5px] uppercase tracking-[0.1em]" style={{ color: past || on ? c : "#6b6b78" }}>
                  {OWNER[st.owner].label}
                </span>
              </span>
              {MODEL_OWNERS.has(st.owner) && (
                <span className="absolute right-2 top-2 font-mono text-[9px] text-ink-faint" title="A model is involved">AI</span>
              )}
            </button>
          );
        })}
      </div>

      {/* progress rail */}
      <div className="mt-3 h-[2px] w-full overflow-hidden rounded bg-white/[0.05]">
        <motion.div
          className="h-full"
          animate={{ width: `${((active + 1) / stages.length) * 100}%`, backgroundColor: color }}
          transition={{ duration: reduce ? 0 : 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        />
      </div>

      {/* detail */}
      <div className="mt-5 min-h-[112px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: reduce ? 0 : 0.25 }}
            className="grid gap-4 sm:grid-cols-[1fr_1fr]"
          >
            <div>
              <div className="mb-2 flex items-center gap-3">
                <span className="font-serif text-2xl italic" style={{ color }}>{s.stage}</span>
                <OwnerChip owner={s.owner} />
              </div>
              <p className="text-[15px] leading-relaxed text-ink-dim">{s.what}</p>
            </div>
            <div className="rounded-xl border border-panel-border bg-black/30 p-4">
              <div className="mb-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-faint">
                If this step fails
              </div>
              <p className="text-sm leading-relaxed text-ink">{s.fallback}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
