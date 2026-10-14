"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { voiceAgent } from "@/content/voiceagent";

const STATE = {
  done: { color: "#34d399", label: "done" },
  current: { color: "#f59e0b", label: "in progress" },
  next: { color: "#6b6b78", label: "planned" },
};

export default function Roadmap() {
  const weeks = voiceAgent.roadmap;
  const [sel, setSel] = useState(weeks.findIndex((w) => w.state === "current"));
  const w = weeks[sel];
  const doneCount = weeks.filter((x) => x.state === "done").length;

  return (
    <div className="rounded-2xl border border-panel-border bg-panel p-4 sm:p-6">
      <div className="relative mb-6">
        {/* rail */}
        <div className="absolute left-[6.25%] right-[6.25%] top-[15px] hidden h-px bg-white/10 sm:block" />
        <motion.div
          className="absolute left-[6.25%] top-[15px] hidden h-px bg-gradient-to-r from-emerald-400 to-amber-400 sm:block"
          initial={{ width: 0 }}
          whileInView={{ width: `${(doneCount / (weeks.length - 1)) * 87.5}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="grid grid-cols-4 gap-y-4 sm:grid-cols-8">
          {weeks.map((x, i) => {
            const st = STATE[x.state];
            const on = i === sel;
            return (
              <button
                key={x.week}
                type="button"
                data-mag
                aria-pressed={on}
                onClick={() => setSel(i)}
                className="relative flex flex-col items-center gap-2 text-center"
              >
                <span
                  className="relative flex h-[30px] w-[30px] items-center justify-center rounded-full border font-mono text-[11px] transition-all"
                  style={{
                    borderColor: st.color + (on ? "" : "80"),
                    background: x.state === "done" ? st.color + "22" : "#0e0e12",
                    color: st.color,
                    boxShadow: on ? `0 0 0 4px ${st.color}22` : undefined,
                  }}
                >
                  {x.state === "current" && <span className="absolute inset-0 animate-ping rounded-full border border-amber-400/60" />}
                  {x.state === "done" ? <Check className="h-3.5 w-3.5" /> : x.week}
                </span>
                <span className={`text-[11.5px] leading-tight ${on ? "text-ink" : "text-ink-faint"}`}>{x.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={w.week}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="rounded-xl border p-4"
          style={{ borderColor: STATE[w.state].color + "35", background: STATE[w.state].color + "08" }}
        >
          <div className="mb-2 flex flex-wrap items-baseline gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: STATE[w.state].color }}>
              Week {w.week} · {STATE[w.state].label}
            </span>
            <span className="text-[15px] font-semibold text-ink">{w.title}</span>
          </div>
          <ul className="grid gap-1.5">
            {w.items.map((it) => (
              <li key={it} className="relative pl-4 text-[13.5px] leading-relaxed text-ink-dim">
                <span className="absolute left-0 top-[9px] h-1 w-1 rounded-full" style={{ background: STATE[w.state].color }} />
                {it}
              </li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
