"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useInView, useReducedMotion } from "framer-motion";
import { Play, RotateCcw, Pause } from "lucide-react";
import { payops, type Owner } from "@/content/payops";
import { OWNER, OwnerChip, TIER_COLOR } from "./owners";

type NodeId = keyof typeof payops.nodes;
type Scenario = (typeof payops.scenarios)[number];
type Step = Scenario["steps"][number] & { tools?: number; pause?: boolean; fail?: boolean };

// ─── Layout (viewBox 1200 × 610) ─────────────────────────────────────────────
const HW = 56;
const HH = 22;
const ROW_A = 196;
const ROW_B = 440;

const POS: Record<NodeId, [number, number]> = {
  loadCase: [66, ROW_A],
  triage: [206, ROW_A],
  diagnose: [346, ROW_A],
  plan: [486, ROW_A],
  payment: [660, 96],
  reconciliation: [660, ROW_A],
  risk: [660, 296],
  join: [834, ROW_A],
  groundCheck: [974, ROW_A],
  resolve: [1124, ROW_A],
  policyGate: [346, ROW_B],
  awaitApproval: [536, ROW_B],
  execute: [726, ROW_B],
  validate: [916, ROW_B],
  closeResolved: [1124, ROW_B],
  replan: [916, 556],
  closeEscalated: [1124, 556],
};

type Edge = { d: string; to: NodeId; label?: [string, number, number]; dashed?: boolean };
const EDGES: Record<string, Edge> = {
  "loadCase-triage": { d: "M 122 196 H 150", to: "triage" },
  "triage-diagnose": { d: "M 262 196 H 290", to: "diagnose" },
  "diagnose-plan": { d: "M 402 196 H 430", to: "plan", label: ["conf < 0.80", 416, 164] },
  "plan-payment": { d: "M 542 196 C 575 196, 571 96, 604 96", to: "payment" },
  "plan-reconciliation": { d: "M 542 196 H 604", to: "reconciliation" },
  "plan-risk": { d: "M 542 196 C 575 196, 571 296, 604 296", to: "risk" },
  "payment-join": { d: "M 716 96 C 749 96, 745 196, 778 196", to: "join" },
  "reconciliation-join": { d: "M 716 196 H 778", to: "join" },
  "risk-join": { d: "M 716 296 C 749 296, 745 196, 778 196", to: "join" },
  "join-groundCheck": { d: "M 890 196 H 918", to: "groundCheck" },
  "groundCheck-plan": { d: "M 974 174 C 974 18, 486 18, 486 174", to: "plan", dashed: true, label: ["evidence gap · round < 2", 730, 52] },
  "groundCheck-resolve": { d: "M 1030 196 H 1068", to: "resolve" },
  "resolve-policyGate": { d: "M 1124 218 V 340 H 370 V 418", to: "policyGate" },
  "diagnose-policyGate": { d: "M 322 218 V 418", to: "policyGate", label: ["J6 ≥ 0.80 · fast path", 216, 330] },
  "policyGate-awaitApproval": { d: "M 402 440 H 480", to: "awaitApproval", label: ["OPS / MGR", 441, 430] },
  "awaitApproval-execute": { d: "M 592 440 H 670", to: "execute", label: ["approved", 631, 430] },
  "policyGate-execute": { d: "M 346 462 C 346 512, 726 512, 726 462", to: "execute", label: ["AUTO", 536, 524] },
  "execute-validate": { d: "M 782 440 H 860", to: "validate" },
  "validate-closeResolved": { d: "M 972 440 H 1068", to: "closeResolved", label: ["PASS", 1020, 430] },
  "validate-replan": { d: "M 916 462 V 534", to: "replan", label: ["FAIL", 936, 502] },
  "replan-resolve": { d: "M 972 548 H 1040 V 262 H 1100 V 218", to: "resolve", dashed: true },
  "replan-closeEscalated": { d: "M 972 564 H 1068", to: "closeEscalated", dashed: true, label: ["escalate", 1020, 582] },
};

const STEP_MS = 1000;
const PAUSE_MS = 1500;

type NodeState = "ok" | "fail" | "pause";
type LogLine = { seq: number; name: string; detail: string };

function splitLabel(label: string) {
  const [main, tag] = label.split(" · ");
  return { main: main.replace(" agent", ""), tag };
}

// A glowing dot that travels along an SVG path once.
function Token({ d, color, duration }: { d: string; color: string; duration: number }) {
  const pathRef = useRef<SVGPathElement>(null);
  const [pt, setPt] = useState<{ x: number; y: number } | null>(null);
  useEffect(() => {
    const p = pathRef.current;
    if (!p) return;
    const len = p.getTotalLength();
    const controls = animate(0, 1, {
      duration: duration / 1000,
      ease: [0.45, 0, 0.2, 1],
      onUpdate: (v) => {
        const q = p.getPointAtLength(v * len);
        setPt({ x: q.x, y: q.y });
      },
    });
    return () => controls.stop();
  }, [d, duration]);
  return (
    <>
      <path ref={pathRef} d={d} fill="none" stroke="none" />
      {pt && (
        <g>
          <circle cx={pt.x} cy={pt.y} r={9} fill={color} opacity={0.18} />
          <circle cx={pt.x} cy={pt.y} r={4} fill={color} style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
        </g>
      )}
    </>
  );
}

export default function AgentGraph() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { once: true, margin: "-120px" });
  const reduce = useReducedMotion();

  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [nodeState, setNodeState] = useState<Partial<Record<NodeId, NodeState>>>({});
  const [doneEdges, setDoneEdges] = useState<Set<string>>(new Set());
  const [activeEdges, setActiveEdges] = useState<string[]>([]);
  const [current, setCurrent] = useState<NodeId[]>([]);
  const [log, setLog] = useState<LogLine[]>([]);
  const [tools, setTools] = useState(0);
  const [status, setStatus] = useState<"idle" | "running" | "paused" | "done">("idle");
  const [selected, setSelected] = useState<NodeId | null>(null);

  const runId = useRef(0);
  const logRef = useRef<HTMLDivElement>(null);
  const scenario = payops.scenarios[scenarioIdx];

  const reset = useCallback(() => {
    setNodeState({});
    setDoneEdges(new Set());
    setActiveEdges([]);
    setCurrent([]);
    setLog([]);
    setTools(0);
  }, []);

  const play = useCallback(
    async (idx: number) => {
      const id = ++runId.current;
      const sc = payops.scenarios[idx];
      reset();
      setStatus("running");
      const wait = (ms: number) => new Promise((r) => setTimeout(r, reduce ? 0 : ms));
      let seq = 0;

      for (const raw of sc.steps) {
        const step = raw as Step;
        if (runId.current !== id) return;
        const nodes = (Array.isArray(step.node) ? step.node : [step.node]) as NodeId[];

        if (step.edges.length) {
          setActiveEdges(step.edges);
          await wait(STEP_MS * 0.6);
          if (runId.current !== id) return;
          setDoneEdges((s) => new Set([...Array.from(s), ...step.edges]));
          setActiveEdges([]);
        }
        setCurrent(nodes);
        setNodeState((s) => {
          const next = { ...s };
          nodes.forEach((n) => (next[n] = step.fail ? "fail" : step.pause ? "pause" : "ok"));
          return next;
        });
        if (step.tools) setTools((t) => t + step.tools!);

        for (const [name, detail] of step.events) {
          if (runId.current !== id) return;
          const n = ++seq;
          setLog((l) => [...l, { seq: n, name, detail }]);
          if (step.pause && name === "approval.requested") {
            setStatus("paused");
            await wait(PAUSE_MS);
            if (runId.current !== id) return;
            setStatus("running");
          } else {
            await wait(160);
          }
        }
        if (step.pause) {
          setNodeState((s) => ({ ...s, [nodes[0]]: "ok" }));
        }
        await wait(STEP_MS * 0.4);
      }
      if (runId.current !== id) return;
      setCurrent([]);
      setStatus("done");
    },
    [reset, reduce]
  );

  // Autoplay the fast path the first time the graph scrolls into view.
  useEffect(() => {
    if (inView) play(0);
    return () => {
      runId.current++;
    };
  }, [inView, play]);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [log]);

  const choose = (i: number) => {
    setScenarioIdx(i);
    play(i);
  };

  const inspect: NodeId = selected ?? current[0] ?? "diagnose";
  const inspectNode = payops.nodes[inspect];
  const r = scenario.result;
  const done = status === "done";

  return (
    <div ref={wrapRef} className="overflow-hidden rounded-2xl border border-panel-border bg-bg-soft/80">
      {/* ── Controls ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 border-b border-panel-border p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Recorded runs">
          {payops.scenarios.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === scenarioIdx}
              data-mag
              onClick={() => choose(i)}
              className={`rounded-full border px-3.5 py-1.5 text-[13px] transition-colors ${
                i === scenarioIdx
                  ? "border-accent-2/60 bg-accent-2/10 text-ink"
                  : "border-panel-border text-ink-dim hover:border-accent-2/40 hover:text-ink"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-ink-faint">{scenario.scenario}</span>
          <button
            type="button"
            data-mag
            onClick={() => play(scenarioIdx)}
            className="inline-flex items-center gap-1.5 rounded-full border border-panel-border bg-white/[0.03] px-3.5 py-1.5 font-mono text-[12px] text-ink transition-colors hover:border-accent/50"
          >
            {status === "running" || status === "paused" ? (
              <><RotateCcw className="h-3.5 w-3.5" /> Restart</>
            ) : (
              <><Play className="h-3.5 w-3.5" /> {done ? "Replay run" : "Play run"}</>
            )}
          </button>
        </div>
      </div>

      <p className="border-b border-panel-border px-4 py-3 text-[14px] leading-relaxed text-ink-dim sm:px-5">{scenario.blurb}</p>

      {/* ── Graph (desktop) ───────────────────────────────────────── */}
      <div className="relative hidden px-3 pt-4 md:block">
        <svg viewBox="0 0 1200 610" className="h-auto w-full" role="img" aria-label="PayOps LangGraph investigation graph">
          <defs>
            <pattern id="pg-dots" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.05)" />
            </pattern>
            <marker id="pg-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0,0 L8,4 L0,8 z" fill="rgba(255,255,255,0.28)" />
            </marker>
          </defs>
          <rect width="1200" height="610" fill="url(#pg-dots)" />

          {/* lane labels */}
          <text x="8" y="70" className="fill-ink-faint font-mono" fontSize="10" letterSpacing="2">INVESTIGATE</text>
          <text x="8" y="390" className="fill-ink-faint font-mono" fontSize="10" letterSpacing="2">DECIDE → ACT → VERIFY</text>
          <rect x="572" y="52" width="176" height="290" rx="14" fill="none" stroke="rgba(167,139,250,0.22)" strokeDasharray="4 5" />
          <text x="660" y="338" textAnchor="middle" className="font-mono" fontSize="9.5" fill="rgba(167,139,250,0.7)" letterSpacing="1.5">PARALLEL · Send()</text>
          <rect x="430" y="404" width="212" height="72" rx="14" fill="none" stroke="rgba(245,158,11,0.22)" strokeDasharray="4 5" />

          {/* base edges */}
          {Object.entries(EDGES).map(([id, e]) => (
            <g key={id}>
              <path
                d={e.d}
                fill="none"
                stroke="rgba(255,255,255,0.13)"
                strokeWidth={1.4}
                strokeDasharray={e.dashed ? "4 4" : undefined}
                markerEnd="url(#pg-arrow)"
              />
              {e.label && (
                <text x={e.label[1]} y={e.label[2]} textAnchor="middle" className="font-mono" fontSize="9.5" fill="#6b6b78">
                  {e.label[0]}
                </text>
              )}
            </g>
          ))}

          {/* travelled edges */}
          {Object.entries(EDGES).map(([id, e]) =>
            doneEdges.has(id) ? (
              <motion.path
                key={`done-${id}-${scenarioIdx}`}
                d={e.d}
                fill="none"
                stroke={OWNER[payops.nodes[e.to].owner].color}
                strokeWidth={2}
                strokeLinecap="round"
                initial={{ pathLength: reduce ? 1 : 0, opacity: 0.9 }}
                animate={{ pathLength: 1, opacity: 0.75 }}
                transition={{ duration: 0.35 }}
              />
            ) : null
          )}

          {/* tokens in flight */}
          {!reduce &&
            activeEdges.map((id) => (
              <Token
                key={`${id}-${log.length}`}
                d={EDGES[id].d}
                duration={STEP_MS * 0.6}
                color={OWNER[payops.nodes[EDGES[id].to].owner].color}
              />
            ))}

          {/* nodes */}
          {(Object.keys(POS) as NodeId[]).map((id) => {
            const [x, y] = POS[id];
            const n = payops.nodes[id];
            const c = OWNER[n.owner].color;
            const st = nodeState[id];
            const isCur = current.includes(id);
            const isSel = selected === id;
            const stroke = st === "fail" ? "#fb7185" : st ? c : isSel ? c : "rgba(255,255,255,0.14)";
            const fill = st === "fail" ? "rgba(251,113,133,0.12)" : st ? c + "1c" : "rgba(14,14,18,0.95)";
            const { main, tag } = splitLabel(n.label);
            return (
              <g
                key={id}
                role="button"
                tabIndex={0}
                aria-label={`${n.label}: ${OWNER[n.owner].label}`}
                data-mag
                onClick={() => setSelected(id)}
                onMouseEnter={() => setSelected(id)}
                onFocus={() => setSelected(id)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSelected(id)}
                className="cursor-pointer outline-none"
              >
                {isCur && !reduce && (
                  <motion.rect
                    x={x - HW - 5}
                    y={y - HH - 5}
                    width={HW * 2 + 10}
                    height={HH * 2 + 10}
                    rx={14}
                    fill="none"
                    stroke={st === "fail" ? "#fb7185" : c}
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: [0.8, 0.15, 0.8] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                )}
                <rect
                  x={x - HW}
                  y={y - HH}
                  width={HW * 2}
                  height={HH * 2}
                  rx={10}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={isCur || isSel ? 1.8 : 1.2}
                  style={{ transition: "fill .3s, stroke .3s", filter: isCur ? `drop-shadow(0 0 10px ${c}66)` : undefined }}
                />
                <circle cx={x - HW + 11} cy={y - 5} r={3} fill={c} />
                <text x={x - HW + 20} y={y - 1.5} fontSize="12.5" fontWeight={600} fill="#f4f4f6">
                  {main}
                </text>
                <text x={x - HW + 20} y={y + 13} className="font-mono" fontSize="9" letterSpacing="0.8" fill={c} opacity={0.85}>
                  {OWNER[n.owner].label.toUpperCase()}
                  {tag ? ` · ${tag}` : ""}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* ── Path stepper (mobile) ─────────────────────────────────── */}
      <ol className="grid gap-1.5 px-4 pt-4 md:hidden">
        {scenario.steps.map((raw, i) => {
          const step = raw as Step;
          const nodes = (Array.isArray(step.node) ? step.node : [step.node]) as NodeId[];
          const reached = nodes.some((n) => nodeState[n]);
          const owner = payops.nodes[nodes[0]].owner as Owner;
          const c = step.fail && reached ? "#fb7185" : OWNER[owner].color;
          return (
            <li
              key={i}
              className="flex items-center gap-3 rounded-lg border px-3 py-2 transition-colors"
              style={{ borderColor: reached ? c + "55" : "rgba(255,255,255,0.06)", background: reached ? c + "10" : "transparent" }}
            >
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: reached ? c : "#3a3a44" }} />
              <span className={`text-[13px] ${reached ? "text-ink" : "text-ink-faint"}`}>
                {nodes.map((n) => splitLabel(payops.nodes[n].label).main).join(" ∥ ")}
              </span>
              <span className="ml-auto font-mono text-[10px] uppercase tracking-wider" style={{ color: reached ? c : "#6b6b78" }}>
                {OWNER[owner].label}
              </span>
            </li>
          );
        })}
      </ol>

      {/* ── Run readout ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-px border-y border-panel-border bg-panel-border sm:grid-cols-5 mt-4">
        {[
          { k: "Path", v: r.path, c: r.path === "FAST" ? "#22d3ee" : "#a78bfa" },
          { k: "Tool calls", v: String(tools), c: "#f4f4f6" },
          { k: "Policy tier", v: done ? `${r.tier} · ${r.rule}` : "…", c: done ? TIER_COLOR[r.tier] : "#6b6b78" },
          { k: "Verdict", v: done ? `${r.verdict}${r.attempt > 1 ? ` · attempt ${r.attempt}` : ""}` : status === "paused" ? "awaiting approval" : "…", c: done ? "#34d399" : status === "paused" ? "#f59e0b" : "#6b6b78" },
          { k: "Model cost", v: done ? r.cost : "…", c: done ? "#f4f4f6" : "#6b6b78" },
        ].map((m) => (
          <div key={m.k} className="bg-bg-soft px-4 py-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">{m.k}</div>
            <div className="mt-1 font-mono text-[13px] font-semibold" style={{ color: m.c }}>
              {m.v}
            </div>
          </div>
        ))}
      </div>

      {/* ── Event log + inspector ─────────────────────────────────── */}
      <div className="grid md:grid-cols-[1.25fr_1fr]">
        <div className="border-b border-panel-border md:border-b-0 md:border-r">
          <div className="flex items-center justify-between px-4 pt-3 sm:px-5">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-faint">
              Socket.IO · room case:&lt;id&gt;
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[10.5px]" style={{ color: status === "paused" ? "#f59e0b" : status === "running" ? "#34d399" : "#6b6b78" }}>
              {status === "paused" ? <Pause className="h-3 w-3" /> : <span className={`h-1.5 w-1.5 rounded-full ${status === "running" ? "animate-pulse bg-emerald-400" : "bg-ink-faint"}`} />}
              {status === "paused" ? "interrupt() · checkpointed" : status}
            </span>
          </div>
          <div ref={logRef} className="h-[232px] overflow-y-auto px-4 py-3 font-mono text-[12px] leading-[1.7] sm:px-5" aria-live="polite">
            <AnimatePresence initial={false}>
              {log.map((l) => (
                <motion.div
                  key={`${scenarioIdx}-${l.seq}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: reduce ? 0 : 0.2 }}
                  className="flex gap-3"
                >
                  <span className="w-6 shrink-0 text-right text-ink-faint">{l.seq}</span>
                  <span className="shrink-0 text-accent-2">{l.name}</span>
                  <span className="truncate text-ink-dim" title={l.detail}>{l.detail}</span>
                </motion.div>
              ))}
            </AnimatePresence>
            {log.length === 0 && <span className="text-ink-faint">Press play to stream a recorded run…</span>}
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="mb-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-faint">
            Node inspector {selected ? "" : "· hover or tap a node"}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={inspect}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: reduce ? 0 : 0.2 }}
            >
              <div className="mb-2 mt-2 flex flex-wrap items-center gap-2.5">
                <span className="font-mono text-[15px] font-semibold text-ink">{inspectNode.label}</span>
                <OwnerChip owner={inspectNode.owner} />
              </div>
              <dl className="mb-3 grid grid-cols-[56px_1fr] gap-x-3 gap-y-1 font-mono text-[11.5px]">
                <dt className="text-ink-faint">reads</dt>
                <dd className="text-ink-dim">{inspectNode.reads}</dd>
                <dt className="text-ink-faint">writes</dt>
                <dd className="text-ink-dim">{inspectNode.writes}</dd>
              </dl>
              <p className="text-[14px] leading-relaxed text-ink-dim">{inspectNode.why.replace(/`/g, "")}</p>
            </motion.div>
          </AnimatePresence>
          {/* mobile node picker */}
          <select
            className="mt-4 w-full rounded-lg border border-panel-border bg-bg px-3 py-2 font-mono text-[12px] text-ink md:hidden"
            value={inspect}
            onChange={(e) => setSelected(e.target.value as NodeId)}
            aria-label="Inspect a node"
          >
            {(Object.keys(payops.nodes) as NodeId[]).map((n) => (
              <option key={n} value={n}>{payops.nodes[n].label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
