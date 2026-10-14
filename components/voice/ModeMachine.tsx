"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lock } from "lucide-react";
import { voiceAgent } from "@/content/voiceagent";

const POS: Record<string, [number, number]> = {
  Greeting: [80, 170],
  FAQ: [300, 46],
  Booking: [300, 128],
  Rescheduling: [300, 212],
  Cancelling: [300, 294],
  Handoff: [530, 170],
};
const W = 124;
const H = 40;

const COLOR: Record<string, string> = {
  Greeting: "#a1a1ad",
  FAQ: "#22d3ee",
  Booking: "#34d399",
  Rescheduling: "#a78bfa",
  Cancelling: "#f59e0b",
  Handoff: "#fb7185",
};

const WRITE_TOOLS = new Set(["hold_slot", "confirm_booking", "reschedule_booking", "cancel_booking"]);

// Edge path between two mode boxes: right side → left side, or vertical for stacked neighbours.
function edgePath(a: string, b: string) {
  const [x1, y1] = POS[a];
  const [x2, y2] = POS[b];
  if (x1 === x2) {
    const dir = y2 > y1 ? 1 : -1;
    const x = x1 + (dir > 0 ? 18 : -18);
    return `M ${x} ${y1 + dir * (H / 2)} V ${y2 - dir * (H / 2)}`;
  }
  const sx = x1 + (x2 > x1 ? W / 2 : -W / 2);
  const ex = x2 + (x2 > x1 ? -W / 2 : W / 2);
  const mx = (sx + ex) / 2;
  return `M ${sx} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${ex} ${y2}`;
}

export default function ModeMachine() {
  const [active, setActive] = useState("Booking");
  const mode = voiceAgent.modes.find((m) => m.id === active)!;
  const c = COLOR[active];

  const edges = voiceAgent.modes.flatMap((m) => m.to.map((to) => ({ from: m.id, to })));

  return (
    <div className="rounded-2xl border border-panel-border bg-bg-soft/80 p-4 sm:p-6">
      <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
        <div className="min-w-0">
          <div className="mb-2 font-mono text-[11px] text-ink-faint">Click a mode</div>
          <div className="-mx-1 overflow-x-auto px-1">
            <svg viewBox="0 0 610 340" className="min-w-[480px]" role="group" aria-label="Agent modes state diagram">
              <defs>
                <marker id="mm-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,255,255,0.35)" />
                </marker>
                <marker id="mm-arrow-on" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={c} />
                </marker>
              </defs>
              {edges.map((e) => {
                const on = e.from === active;
                return (
                  <path
                    key={`${e.from}-${e.to}`}
                    d={edgePath(e.from, e.to)}
                    fill="none"
                    stroke={on ? c : "rgba(255,255,255,0.12)"}
                    strokeWidth={on ? 1.8 : 1}
                    markerEnd={on ? "url(#mm-arrow-on)" : "url(#mm-arrow)"}
                    style={{ transition: "stroke .3s" }}
                  />
                );
              })}
              <text x={530} y={214} textAnchor="middle" fontSize={10} className="font-mono" fill="#6b6b78">sticky · callback only</text>
              {voiceAgent.modes.map((m) => {
                const [x, y] = POS[m.id];
                const on = m.id === active;
                const col = COLOR[m.id];
                return (
                  <g
                    key={m.id}
                    role="button"
                    tabIndex={0}
                    aria-pressed={on}
                    aria-label={`${m.id} mode`}
                    data-mag
                    className="cursor-pointer outline-none"
                    onClick={() => setActive(m.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setActive(m.id);
                      }
                    }}
                  >
                    <rect
                      x={x - W / 2}
                      y={y - H / 2}
                      width={W}
                      height={H}
                      rx={20}
                      fill={on ? col + "22" : "rgba(14,14,18,0.95)"}
                      stroke={on ? col : col + "50"}
                      strokeWidth={on ? 2 : 1}
                      style={{ transition: "all .3s", filter: on ? `drop-shadow(0 0 10px ${col}55)` : undefined }}
                    />
                    <text x={x} y={y + 4.5} textAnchor="middle" fontSize={13} fontWeight={600} fill={on ? col : "#a1a1ad"}>
                      {m.id}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        <div className="min-w-0">
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: c }}>{active} mode can call</span>
            <span className="font-mono text-[11px] text-ink-faint">{mode.tools.length} / {voiceAgent.allTools.length} tools</span>
          </div>
          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {voiceAgent.allTools.map((tool) => {
              const on = mode.tools.includes(tool);
              const writes = WRITE_TOOLS.has(tool);
              return (
                <motion.div
                  key={tool}
                  layout
                  className="flex items-center justify-between gap-2 rounded-lg border px-2.5 py-1.5 font-mono text-[11.5px]"
                  style={{
                    borderColor: on ? c + "55" : "rgba(255,255,255,0.06)",
                    background: on ? c + "10" : "transparent",
                    color: on ? "#f4f4f6" : "#4b4b55",
                    transition: "all .3s",
                  }}
                >
                  <span className={on ? "" : "line-through decoration-white/20"}>{tool}</span>
                  {on ? (
                    writes && <span className="text-[9.5px] uppercase tracking-wider" style={{ color: c }}>writes</span>
                  ) : (
                    <Lock className="h-3 w-3 opacity-60" aria-label="not callable" />
                  )}
                </motion.div>
              );
            })}
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={active}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="mt-4 text-[14px] leading-relaxed text-ink-dim"
            >
              {mode.note}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
