"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { voiceAgent } from "@/content/voiceagent";

const MAX = 6500;
const TARGET = 1500;

const ROWS = [
  { key: "eot", label: "End of turn", color: "#22d3ee" },
  { key: "llm", label: "LLM first token", color: "#a78bfa" },
  { key: "tts", label: "TTS first audio", color: "#f59e0b" },
  { key: "v2v", label: "Voice-to-voice", color: "#f4f4f6" },
  { key: "stop", label: "Barge-in stop", color: "#fb7185" },
] as const;

const VERDICT: Record<string, { text: string; color: string }> = {
  base: { text: "baseline", color: "#a1a1ad" },
  kept: { text: "kept", color: "#34d399" },
  reverted: { text: "reverted", color: "#fb7185" },
};

export default function LatencyWaterfall() {
  const runs = voiceAgent.latencyRuns;
  const [idx, setIdx] = useState(runs.length - 1);
  const reduce = useReducedMotion();
  const run = runs[idx];

  return (
    <div className="rounded-2xl border border-panel-border bg-panel p-4 sm:p-6">
      <div role="tablist" aria-label="Latency runs" className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {runs.map((r, i) => {
          const v = VERDICT[r.verdict];
          const on = i === idx;
          return (
            <button
              key={r.id}
              type="button"
              role="tab"
              aria-selected={on}
              data-mag
              onClick={() => setIdx(i)}
              className={`rounded-xl border p-3 text-left transition-colors ${on ? "border-white/25 bg-white/[0.05]" : "border-panel-border hover:bg-white/[0.03]"}`}
            >
              <div className="mb-1 flex items-center justify-between gap-2 font-mono text-[10.5px]">
                <span className="text-ink-faint">{r.date}</span>
                <span style={{ color: v.color }}>{v.text}</span>
              </div>
              <div className={`text-[13px] leading-snug ${on ? "text-ink" : "text-ink-dim"}`}>{r.label}</div>
            </button>
          );
        })}
      </div>

      <div className="grid gap-3.5">
        {ROWS.map((row) => {
          const [p50, p95] = run[row.key];
          return (
            <div key={row.key} className="grid gap-1.5 sm:grid-cols-[130px_1fr_110px] sm:items-center sm:gap-4">
              <div className="text-[13px] text-ink-dim">{row.label}</div>
              <div className="relative h-5 rounded-md bg-white/[0.03]">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-md"
                  style={{ background: row.color, opacity: 0.18 }}
                  initial={false}
                  animate={{ width: `${(p95 / MAX) * 100}%` }}
                  transition={{ duration: reduce ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-md"
                  style={{ background: row.color, opacity: 0.85 }}
                  initial={false}
                  animate={{ width: `${(p50 / MAX) * 100}%` }}
                  transition={{ duration: reduce ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
                {row.key === "v2v" && (
                  <div className="absolute -bottom-1 -top-1 w-px bg-emerald-400" style={{ left: `${(TARGET / MAX) * 100}%` }} title="1.5 s target" />
                )}
              </div>
              <div className="font-mono text-[12px] text-ink sm:text-right">
                {p50.toLocaleString()} <span className="text-ink-faint">/ {p95.toLocaleString()} ms</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-panel-border pt-4 font-mono text-[11px] text-ink-faint">
        <span>
          {run.sample} · solid = p50, faint = p95 · <span className="text-emerald-400">|</span> 1.5 s target
        </span>
        <span className="text-ink-dim">{run.outcome}</span>
      </div>
    </div>
  );
}
