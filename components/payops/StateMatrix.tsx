"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { payops } from "@/content/payops";

const { systems, matrix } = payops;
const BAD = "#fb7185";
const GOOD = "#34d399";

// 0 = systems disagree · 1 = investigating · 2 = fix replayed, cells resolving · 3 = validator PASS
type Phase = 0 | 1 | 2 | 3;

export default function StateMatrix() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -120px 0px" });
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>(0);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setPhase(3);
      return;
    }
    setPhase(0);
    const t = [
      setTimeout(() => setPhase(1), 1400),
      setTimeout(() => setPhase(2), 3300),
      setTimeout(() => setPhase(3), 4900),
    ];
    return () => t.forEach(clearTimeout);
  }, [inView, reduce, run]);

  const fixed = phase >= 2;
  const badIdx = matrix.before.map((c, i) => (c.bad ? i : -1)).filter((i) => i >= 0);

  const caption = [
    `${badIdx.length} systems disagree: order, ledger, webhook`,
    "Investigating: evidence cited, root cause WEBHOOK_PROCESSING_FAILURE",
    `Executing ${matrix.fix} · policy AUTO (P6)`,
    "Validator re-read every system: PASS",
  ][phase];

  return (
    <div ref={ref} className="relative overflow-hidden rounded-2xl border border-panel-border bg-bg-soft/80">
      {/* header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-panel-border px-5 py-3.5">
        <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
          <span className="text-ink">State matrix</span>
          <span>·</span>
          <span>₹12,499.00 · one payment, five systems</span>
        </div>
        <button
          type="button"
          data-mag
          onClick={() => setRun((r) => r + 1)}
          className="inline-flex items-center gap-1.5 rounded-full border border-panel-border px-3 py-1 font-mono text-[11px] text-ink-dim transition-colors hover:border-accent-2/50 hover:text-ink"
        >
          <RotateCcw className="h-3 w-3" /> Replay
        </button>
      </div>

      {/* scanner sweep while investigating */}
      <AnimatePresence>
        {phase === 1 && !reduce && (
          <motion.div
            key="scan"
            className="pointer-events-none absolute inset-y-0 z-10 w-1/4 bg-gradient-to-r from-transparent via-accent-2/15 to-transparent"
            initial={{ left: "-25%" }}
            animate={{ left: "100%" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: "easeInOut", repeat: 1 }}
          />
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-px bg-panel-border sm:grid-cols-5">
        {systems.map((sys, i) => {
          const before = matrix.before[i];
          const after = matrix.after[i];
          const wasBad = before.bad;
          const isBad = wasBad && !fixed;
          const cell = fixed ? after : before;
          const order = badIdx.indexOf(i);
          return (
            <div key={sys.key} className="relative bg-bg-soft p-4 sm:p-5">
              <motion.div
                className="pointer-events-none absolute inset-0"
                animate={{
                  backgroundColor: isBad ? "rgba(251,113,133,0.09)" : fixed && wasBad ? "rgba(52,211,153,0.07)" : "rgba(0,0,0,0)",
                }}
                transition={{ duration: 0.5, delay: fixed && wasBad && !reduce ? order * 0.35 : 0 }}
              />
              <div className="relative">
                <div className="mb-0.5 text-[13px] font-semibold text-ink">{sys.name}</div>
                <div className="mb-3 text-[11.5px] leading-snug text-ink-faint">{sys.analogy}</div>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={fixed ? "a" : "b"}
                    initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
                    transition={{ duration: 0.35, delay: fixed && wasBad && !reduce ? order * 0.35 : 0 }}
                  >
                    <div
                      className="font-mono text-[13px] font-semibold tracking-wide"
                      style={{ color: isBad ? BAD : fixed && wasBad ? GOOD : "#f4f4f6" }}
                    >
                      {cell.status}
                      {isBad && " ▲"}
                      {fixed && wasBad && " ✓"}
                    </div>
                    <div className="mt-1 font-mono text-[12px] text-ink-dim">{cell.amount}</div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>

      {/* status line */}
      <div className="flex min-h-[52px] flex-wrap items-center justify-between gap-3 border-t border-panel-border px-5 py-3">
        <AnimatePresence mode="wait">
          <motion.span
            key={phase}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 6 }}
            transition={{ duration: 0.25 }}
            className="font-mono text-[12px]"
            style={{ color: phase === 0 ? BAD : phase === 3 ? GOOD : "#22d3ee" }}
          >
            {phase === 1 && <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent-2 align-middle" />}
            {caption}
          </motion.span>
        </AnimatePresence>
        <AnimatePresence>
          {phase === 3 && (
            <motion.span
              initial={{ opacity: 0, scale: 1.6, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: -3 }}
              transition={{ type: "spring", stiffness: 260, damping: 16 }}
              className="rounded-md border-2 px-2.5 py-0.5 font-mono text-[12px] font-bold tracking-[0.18em]"
              style={{ color: GOOD, borderColor: GOOD }}
            >
              RESOLVED
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
