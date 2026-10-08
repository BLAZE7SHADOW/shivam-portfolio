"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { payops } from "@/content/payops";

const COLOR: Record<string, string> = { LIVE: "#34d399", RECORD: "#fb7185", REPLAY: "#22d3ee" };

export default function ReplayModes() {
  const [mode, setMode] = useState(2);
  const m = payops.aiModes[mode];
  const c = COLOR[m.mode];
  return (
    <div className="rounded-2xl border border-panel-border bg-panel p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-faint">AI_MODE</span>
        <div role="radiogroup" aria-label="AI mode" className="flex gap-1 rounded-full border border-panel-border bg-black/30 p-1">
          {payops.aiModes.map((x, i) => (
            <button
              key={x.mode}
              type="button"
              role="radio"
              aria-checked={i === mode}
              data-mag
              onClick={() => setMode(i)}
              className="relative rounded-full px-3.5 py-1 font-mono text-[12px] transition-colors"
              style={{ color: i === mode ? COLOR[x.mode] : "#6b6b78" }}
            >
              {i === mode && (
                <motion.span layoutId="aimode" className="absolute inset-0 rounded-full" style={{ background: COLOR[x.mode] + "1c" }} />
              )}
              <span className="relative">{x.mode}</span>
            </button>
          ))}
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={m.mode} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
          <p className="mb-3 text-[15px] leading-relaxed text-ink">{m.body}</p>
          <div className="flex flex-wrap gap-2 font-mono text-[11px]">
            <span className="rounded-md border px-2 py-0.5" style={{ color: c, borderColor: c + "40" }}>
              {m.keys ? "needs API keys" : "no keys · no network"}
            </span>
            <span className="rounded-md border border-panel-border px-2 py-0.5 text-ink-dim">graph · tools · DB · policy · validator always real</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
