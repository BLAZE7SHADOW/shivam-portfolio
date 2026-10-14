"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Play, RotateCcw, Hand } from "lucide-react";
import { voiceAgent, type StageId } from "@/content/voiceagent";

// The real-time loop, played at real speed. Segment durations are the measured
// p50s from LATENCY_LOG; the tool-turn split is approximate (see note in UI).

export const STAGE_COLOR: Record<StageId, string> = {
  caller: "#f4f4f6",
  livekit: "#a1a1ad",
  vad: "#22d3ee",
  stt: "#22d3ee",
  llm: "#a78bfa",
  tts: "#f59e0b",
  guard: "#34d399",
  tools: "#34d399",
  db: "#60a5fa",
  telemetry: "#6b6b78",
};

const POS: Record<StageId, [number, number]> = {
  caller: [70, 92],
  livekit: [205, 92],
  vad: [340, 92],
  stt: [475, 92],
  llm: [610, 92],
  tts: [745, 92],
  telemetry: [900, 92],
  guard: [610, 222],
  tools: [745, 222],
  db: [900, 222],
};
const W = 112;
const H = 48;

const EDGES: { id: string; d: string; dashed?: boolean }[] = [
  { id: "caller-livekit", d: "M 126 92 H 149" },
  { id: "livekit-vad", d: "M 261 92 H 284" },
  { id: "vad-stt", d: "M 396 92 H 419" },
  { id: "stt-llm", d: "M 531 92 H 554" },
  { id: "llm-tts", d: "M 666 92 H 689" },
  { id: "tts-telemetry", d: "M 801 92 H 844", dashed: true },
  { id: "llm-guard", d: "M 610 116 V 198" },
  { id: "guard-tools", d: "M 666 222 H 689" },
  { id: "tools-db", d: "M 801 222 H 844" },
  { id: "tts-caller", d: "M 745 68 V 34 H 70 V 68" },
];

type Seg = { key: string; label: string; ms: number; stages: StageId[]; edges: string[]; color: string };

function segments(kind: "plain" | "tool"): Seg[] {
  const t = voiceAgent.turns[kind];
  if (kind === "plain") {
    const rest = t.total - t.eot - t.llm - t.tts;
    return [
      { key: "eot", label: "End of turn (VAD + turn detector) · STT final", ms: t.eot, stages: ["livekit", "vad", "stt"], edges: ["caller-livekit", "livekit-vad", "vad-stt"], color: STAGE_COLOR.vad },
      { key: "llm", label: "LLM first token", ms: t.llm, stages: ["llm"], edges: ["stt-llm"], color: STAGE_COLOR.llm },
      { key: "sent", label: "First sentence → TTS", ms: rest, stages: ["llm", "tts"], edges: ["llm-tts"], color: "#c4b5fd" },
      { key: "tts", label: "TTS first audio", ms: t.tts, stages: ["tts"], edges: ["tts-caller", "tts-telemetry"], color: STAGE_COLOR.tts },
    ];
  }
  const tool = 270; // tool DB time measured at 150–390 ms
  const llm2 = t.llm;
  const rest = Math.max(0, t.total - t.eot - t.llm - tool - llm2 - t.tts);
  return [
    { key: "eot", label: "End of turn · STT final", ms: t.eot, stages: ["livekit", "vad", "stt"], edges: ["caller-livekit", "livekit-vad", "vad-stt"], color: STAGE_COLOR.vad },
    { key: "llm1", label: "LLM call 1 → tool call", ms: t.llm, stages: ["llm"], edges: ["stt-llm"], color: STAGE_COLOR.llm },
    { key: "tool", label: "Guard → tool → Postgres (150–390 ms)", ms: tool, stages: ["guard", "tools", "db"], edges: ["llm-guard", "guard-tools", "tools-db"], color: STAGE_COLOR.guard },
    { key: "llm2", label: "LLM call 2 → answer", ms: llm2, stages: ["llm"], edges: ["llm-guard"], color: STAGE_COLOR.llm },
    { key: "sent", label: "First sentence → TTS", ms: rest, stages: ["llm", "tts"], edges: ["llm-tts"], color: "#c4b5fd" },
    { key: "tts", label: "TTS first audio", ms: t.tts, stages: ["tts"], edges: ["tts-caller", "tts-telemetry"], color: STAGE_COLOR.tts },
  ];
}

const SCALE_MAX = 4200;
const TARGET = 1500;

export default function VoicePipeline() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { once: true, margin: "-120px" });
  const reduce = useReducedMotion();

  const [kind, setKind] = useState<"plain" | "tool">("plain");
  const [t, setT] = useState(0);
  const [status, setStatus] = useState<"idle" | "running" | "done" | "barge">("idle");
  const [selected, setSelected] = useState<StageId | null>(null);
  const [bargeT, setBargeT] = useState(0);
  const raf = useRef<number | null>(null);

  const segs = segments(kind);
  const total = segs.reduce((a, s) => a + s.ms, 0);

  const stop = () => {
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = null;
  };

  const play = useCallback(
    (k: "plain" | "tool") => {
      stop();
      setKind(k);
      setStatus("running");
      const tot = segments(k).reduce((a, s) => a + s.ms, 0);
      if (reduce) {
        setT(tot);
        setStatus("done");
        return;
      }
      const start = performance.now();
      const tick = (now: number) => {
        const el = now - start;
        if (el >= tot) {
          setT(tot);
          setStatus("done");
          raf.current = null;
          return;
        }
        setT(el);
        raf.current = requestAnimationFrame(tick);
      };
      setT(0);
      raf.current = requestAnimationFrame(tick);
    },
    [reduce]
  );

  const bargeIn = useCallback(() => {
    stop();
    setStatus("barge");
    const stopMs = voiceAgent.bargeIn.stopMs;
    if (reduce) {
      setBargeT(stopMs);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const el = Math.min(stopMs, now - start);
      setBargeT(el);
      if (el < stopMs) raf.current = requestAnimationFrame(tick);
      else raf.current = null;
    };
    setBargeT(0);
    raf.current = requestAnimationFrame(tick);
  }, [reduce]);

  useEffect(() => {
    if (inView && status === "idle") play("plain");
  }, [inView, status, play]);

  useEffect(() => () => stop(), []);

  // Which segment is live, and what has been passed.
  let activeIdx = -1;
  const passedEdges = new Set<string>();
  const litStages = new Set<StageId>(["caller"]);
  let acc = 0;
  segs.forEach((s, i) => {
    const reached = status === "done" || (status === "running" && t >= acc);
    if (reached) {
      s.edges.forEach((e) => passedEdges.add(e));
      s.stages.forEach((st) => litStages.add(st));
    }
    if (status === "running" && t >= acc && t < acc + s.ms) activeIdx = i;
    acc += s.ms;
  });
  const activeStages = new Set<StageId>(activeIdx >= 0 ? segs[activeIdx].stages : []);
  const barge = status === "barge";
  if (barge) {
    ["caller", "livekit", "vad", "tts"].forEach((s) => litStages.add(s as StageId));
  }

  const info = selected ? voiceAgent.stages[selected] : null;

  return (
    <div ref={wrapRef} className="rounded-2xl border border-panel-border bg-bg-soft/80 p-4 sm:p-6">
      {/* controls */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button type="button" data-mag onClick={() => play("plain")} className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-mono text-[12px] transition-colors ${kind === "plain" && !barge ? "border-accent-2/50 bg-accent-2/10 text-accent-2" : "border-panel-border text-ink-dim hover:text-ink"}`}>
          <Play className="h-3 w-3" /> Plain turn
        </button>
        <button type="button" data-mag onClick={() => play("tool")} className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-mono text-[12px] transition-colors ${kind === "tool" && !barge ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-400" : "border-panel-border text-ink-dim hover:text-ink"}`}>
          <Play className="h-3 w-3" /> Tool turn
        </button>
        <button type="button" data-mag onClick={bargeIn} className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-mono text-[12px] transition-colors ${barge ? "border-rose-400/50 bg-rose-400/10 text-rose-400" : "border-panel-border text-ink-dim hover:text-ink"}`}>
          <Hand className="h-3 w-3" /> Barge in
        </button>
        <span className="ml-auto font-mono text-[11px] text-ink-faint">played at real speed · click a stage</span>
      </div>

      {/* diagram */}
      <div className="-mx-1 overflow-x-auto px-1">
        <svg viewBox="0 0 980 270" className="min-w-[680px]" role="img" aria-label="Voice agent pipeline: caller, LiveKit, VAD and turn detector, speech-to-text, LLM, text-to-speech, with a branch from the LLM to code guards, tools and Postgres">
          <text x={407} y={26} textAnchor="middle" className="fill-ink-faint font-mono" fontSize={10.5}>audio back to the caller</text>
          <text x={540} y={170} className="fill-ink-faint font-mono" fontSize={10.5}>tool call</text>
          {EDGES.map((e) => {
            const on = passedEdges.has(e.id) || (barge && ["caller-livekit", "livekit-vad", "tts-caller"].includes(e.id));
            const col = barge && e.id === "tts-caller" ? "#fb7185" : "#22d3ee";
            return (
              <g key={e.id}>
                <path d={e.d} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={1.5} strokeDasharray={e.dashed ? "4 4" : undefined} />
                <motion.path
                  d={e.d}
                  fill="none"
                  stroke={col}
                  strokeWidth={2}
                  strokeDasharray={e.dashed ? "4 4" : undefined}
                  initial={false}
                  animate={{ pathLength: on ? 1 : 0, opacity: on ? 0.85 : 0 }}
                  transition={{ duration: reduce ? 0 : 0.35 }}
                  style={{ filter: on ? `drop-shadow(0 0 4px ${col})` : undefined }}
                />
              </g>
            );
          })}
          {(Object.keys(POS) as StageId[]).map((id) => {
            const [x, y] = POS[id];
            const c = STAGE_COLOR[id];
            const lit = litStages.has(id);
            const active = activeStages.has(id) || (barge && id === "tts");
            const st = voiceAgent.stages[id];
            return (
              <g
                key={id}
                role="button"
                tabIndex={0}
                aria-label={`${st.label}: ${st.provider}`}
                data-mag
                onClick={() => setSelected(selected === id ? null : id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelected(selected === id ? null : id);
                  }
                }}
                className="cursor-pointer outline-none"
              >
                {active && !reduce && (
                  <motion.rect
                    x={x - W / 2 - 4}
                    y={y - H / 2 - 4}
                    width={W + 8}
                    height={H + 8}
                    rx={14}
                    fill="none"
                    stroke={barge && id === "tts" ? "#fb7185" : c}
                    strokeWidth={1.5}
                    initial={{ opacity: 0.9 }}
                    animate={{ opacity: [0.9, 0.2, 0.9] }}
                    transition={{ duration: 0.9, repeat: Infinity }}
                  />
                )}
                <rect
                  x={x - W / 2}
                  y={y - H / 2}
                  width={W}
                  height={H}
                  rx={11}
                  fill={lit ? c + "16" : "rgba(255,255,255,0.02)"}
                  stroke={selected === id ? c : lit ? c + "70" : "rgba(255,255,255,0.1)"}
                  strokeWidth={selected === id ? 2 : 1}
                  style={{ transition: "all .3s" }}
                />
                <text x={x} y={y - 2} textAnchor="middle" fontSize={12.5} fontWeight={600} fill={lit ? c : "#6b6b78"} style={{ transition: "fill .3s" }}>
                  {st.label}
                </text>
                <text x={x} y={y + 14} textAnchor="middle" fontSize={9.5} className="font-mono" fill="#6b6b78">
                  {shortProvider(id)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* timeline */}
      <div className="mt-4 rounded-xl border border-panel-border bg-black/30 p-4">
        <AnimatePresence mode="wait">
          {barge ? (
            <motion.div key="barge" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="mb-2 flex items-baseline justify-between font-mono text-[11px]">
                <span className="text-rose-400">Caller talks over the agent</span>
                <span className="text-ink">{Math.round(bargeT)} ms</span>
              </div>
              <div className="relative h-3 overflow-hidden rounded-full bg-white/[0.05]">
                <div className="absolute inset-y-0 left-0 rounded-full bg-rose-400/70" style={{ width: `${(bargeT / 1000) * 100}%` }} />
              </div>
              <div className="mt-1 flex justify-between font-mono text-[10px] text-ink-faint">
                <span>0</span><span>500 ms</span><span>1 s</span>
              </div>
              <p className="mt-3 text-[13.5px] leading-relaxed text-ink-dim">{voiceAgent.bargeIn.note}</p>
            </motion.div>
          ) : (
            <motion.div key={kind} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="mb-2 flex items-baseline justify-between gap-3 font-mono text-[11px]">
                <span className="text-ink-dim">{activeIdx >= 0 ? segs[activeIdx].label : status === "done" ? "Caller hears the first word" : "Caller stops speaking"}</span>
                <span className="text-ink">{(t / 1000).toFixed(2)} s</span>
              </div>
              <div className="relative h-4 rounded-full bg-white/[0.05]">
                {(() => {
                  let left = 0;
                  return segs.map((s) => {
                    const start = left;
                    left += s.ms;
                    const filled = Math.max(0, Math.min(s.ms, t - start));
                    return (
                      <div
                        key={s.key}
                        className="absolute inset-y-0 border-r border-bg first:rounded-l-full"
                        style={{ left: `${(start / SCALE_MAX) * 100}%`, width: `${(filled / SCALE_MAX) * 100}%`, background: s.color, opacity: 0.8 }}
                      />
                    );
                  });
                })()}
                <div className="absolute -top-1.5 bottom-[-6px] w-px bg-emerald-400/80" style={{ left: `${(TARGET / SCALE_MAX) * 100}%` }} />
              </div>
              <div className="relative mt-1 h-4 font-mono text-[10px] text-ink-faint">
                <span className="absolute left-0">0</span>
                <span className="absolute -translate-x-1/2 text-emerald-400/90" style={{ left: `${(TARGET / SCALE_MAX) * 100}%` }}>target 1.5 s</span>
                <span className="absolute right-0">{SCALE_MAX / 1000} s</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
                {segs.map((s) => (
                  <span key={s.key} className="inline-flex items-center gap-1.5 font-mono text-[10.5px] text-ink-faint">
                    <span className="h-2 w-2 rounded-sm" style={{ background: s.color }} />
                    {s.label.split(" (")[0]} <span className="text-ink-dim">{s.ms} ms</span>
                  </span>
                ))}
              </div>
              <p className="mt-3 text-[13.5px] leading-relaxed text-ink-dim">
                {voiceAgent.turns[kind].note}
                {kind === "tool" && <span className="text-ink-faint"> The split between the two LLM calls is approximate; the measured numbers are each stage&apos;s p50 and the 3.9 s total.</span>}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        {status === "done" && !barge && (
          <button type="button" data-mag onClick={() => play(kind)} className="mt-3 inline-flex items-center gap-1.5 font-mono text-[11px] text-ink-faint hover:text-ink">
            <RotateCcw className="h-3 w-3" /> replay
          </button>
        )}
      </div>

      {/* stage inspector */}
      <AnimatePresence>
        {info && selected && (
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="mt-4 rounded-xl border p-4"
            style={{ borderColor: STAGE_COLOR[selected] + "45", background: STAGE_COLOR[selected] + "0a" }}
          >
            <div className="mb-1 font-mono text-[12px] font-semibold" style={{ color: STAGE_COLOR[selected] }}>{info.label}</div>
            <div className="mb-2 text-[13.5px] text-ink">{info.provider}</div>
            <p className="text-[13.5px] leading-relaxed text-ink-dim">{info.why}</p>
            {info.fallback !== "—" && (
              <div className="mt-2 font-mono text-[11px] text-ink-faint">fallback · <span className="text-ink-dim">{info.fallback}</span></div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function shortProvider(id: StageId) {
  return {
    caller: "browser · WebRTC",
    livekit: "India South",
    vad: "Silero VAD · v1-mini",
    stt: "Deepgram nova-3",
    llm: "Gemini Flash",
    tts: "Cartesia sonic-3",
    telemetry: "p50 / p95",
    guard: "state.check()",
    tools: "9 tools",
    db: "Supabase · Mumbai",
  }[id];
}
