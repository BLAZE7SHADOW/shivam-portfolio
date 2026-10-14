"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Check, RotateCcw, X } from "lucide-react";
import { voiceAgent } from "@/content/voiceagent";

type Lane = "caller" | "llm" | "agent" | "code" | "db";
type Variant = keyof typeof voiceAgent.booking.variants;

const LANES = [
  { id: "caller", label: "Caller", color: "#f4f4f6" },
  { id: "llm", label: "LLM", color: "#a78bfa" },
  { id: "code", label: "Code", color: "#34d399" },
  { id: "db", label: "Postgres", color: "#60a5fa" },
] as const;

// "agent" lines are spoken by code-built read-backs: shown in the LLM lane, tagged as voice.
const laneIndex = (l: Lane) => ({ caller: 0, llm: 1, agent: 1, code: 2, db: 3 })[l];
const laneColor = (l: Lane) => (l === "agent" ? "#f59e0b" : LANES[laneIndex(l)].color);
const laneTag = (l: Lane) => (l === "agent" ? "Agent voice" : LANES[laneIndex(l)].label);

const STEP_MS = 650;

export default function BookingSequence() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { once: true, margin: "-120px" });
  const reduce = useReducedMotion();
  const [variant, setVariant] = useState<Variant>("yes");
  const [shown, setShown] = useState(0);
  const runId = useRef(0);

  const v = voiceAgent.booking.variants[variant];
  const steps = [...voiceAgent.booking.common, ...v.steps] as { lane: Lane; text: string }[];
  const done = shown >= steps.length;

  const play = useCallback(
    async (key: Variant, from = 0) => {
      const id = ++runId.current;
      setVariant(key);
      const total = voiceAgent.booking.common.length + voiceAgent.booking.variants[key].steps.length;
      if (reduce) {
        setShown(total);
        return;
      }
      setShown(from);
      for (let i = from + 1; i <= total; i++) {
        await new Promise((r) => setTimeout(r, STEP_MS));
        if (runId.current !== id) return;
        setShown(i);
      }
    },
    [reduce]
  );

  const started = useRef(false);
  useEffect(() => {
    if (inView && !started.current) {
      started.current = true;
      play("yes");
    }
  }, [inView, play]);

  // Switching the ending keeps the shared part on screen and replays only the end.
  const pick = (key: Variant) => {
    const common = voiceAgent.booking.common.length;
    play(key, Math.min(shown, common));
  };

  return (
    <div ref={wrapRef} className="rounded-2xl border border-panel-border bg-bg-soft/80 p-4 sm:p-6">
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="mr-1 font-mono text-[11px] text-ink-faint">The caller answers the read-back with:</span>
        {(Object.keys(voiceAgent.booking.variants) as Variant[]).map((k) => {
          const on = k === variant;
          const ok = voiceAgent.booking.variants[k].outcome.ok;
          const col = ok ? "#34d399" : "#fb7185";
          return (
            <button
              key={k}
              type="button"
              data-mag
              onClick={() => pick(k)}
              className="rounded-full border px-3.5 py-1.5 font-mono text-[12px] transition-colors"
              style={{ borderColor: on ? col + "70" : "rgba(255,255,255,0.08)", background: on ? col + "14" : "transparent", color: on ? col : "#a1a1ad" }}
            >
              {voiceAgent.booking.variants[k].label}
            </button>
          );
        })}
      </div>

      {/* lane headers (desktop) */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 hidden md:grid md:grid-cols-4">
          {LANES.map((l) => (
            <div key={l.id} className="relative">
              <div className="absolute inset-y-8 left-1/2 w-px bg-white/[0.06]" />
            </div>
          ))}
        </div>
        <div className="mb-3 hidden grid-cols-4 md:grid">
          {LANES.map((l) => (
            <div key={l.id} className="text-center font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: l.color }}>
              {l.label}
            </div>
          ))}
        </div>

        <ol className="relative grid content-start gap-2 md:min-h-[690px]">
          <AnimatePresence initial={false}>
            {steps.slice(0, shown).map((s, i) => {
              const li = laneIndex(s.lane);
              const col = laneColor(s.lane);
              const isEnd = i >= voiceAgent.booking.common.length;
              return (
                <motion.li
                  key={`${isEnd ? variant : "c"}-${i}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.25 }}
                  className="seq-step"
                  style={{ ["--lane" as string]: li }}
                >
                  <div
                    className="rounded-lg border px-3 py-2 text-[13px] leading-snug text-ink-dim"
                    style={{ borderColor: col + "35", background: col + "0b" }}
                  >
                    <span className="mr-2 font-mono text-[10px] uppercase tracking-wider md:hidden" style={{ color: col }}>{laneTag(s.lane)}</span>
                    {s.lane === "agent" && <span className="mr-2 hidden font-mono text-[10px] uppercase tracking-wider md:inline" style={{ color: col }}>voice</span>}
                    <span className={s.lane === "agent" || s.lane === "caller" ? "text-ink" : ""}>{s.text}</span>
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ol>
      </div>

      <AnimatePresence mode="wait">
        {done && (
          <motion.div
            key={variant}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-5 flex flex-wrap items-start justify-between gap-3 rounded-xl border p-4"
            style={{ borderColor: (v.outcome.ok ? "#34d399" : "#fb7185") + "45", background: (v.outcome.ok ? "#34d399" : "#fb7185") + "0c" }}
          >
            <div className="flex items-start gap-2.5">
              {v.outcome.ok ? <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" /> : <X className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />}
              <p className="text-[14px] leading-relaxed text-ink">{v.outcome.text}</p>
            </div>
            <button type="button" data-mag onClick={() => play(variant)} className="inline-flex items-center gap-1.5 font-mono text-[11px] text-ink-faint hover:text-ink">
              <RotateCcw className="h-3 w-3" /> replay
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="mt-4 font-mono text-[11px] leading-relaxed text-ink-faint">{voiceAgent.booking.footnote}</p>
    </div>
  );
}
