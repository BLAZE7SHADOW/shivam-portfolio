"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

// Hexagonal monorepo — dependency direction is lint-enforced:
// shared ← core ← agents ← server · simulator → core · shared ← web. core never imports agents.

type BlockId = "web" | "server" | "agents" | "core" | "ports" | "db" | "shared" | "simulator";

const BLOCKS: Record<BlockId, { title: string; tag: string; items: string[]; deps: BlockId[]; color: string }> = {
  web: { title: "apps/web", tag: "React 19 · Vite · Tailwind v4", items: ["Workbench: overview, cases, approvals, agent runs", "TanStack Query (REST) · Socket.IO client", "Never imports core"], deps: ["shared"], color: "#22d3ee" },
  server: { title: "apps/server", tag: "Express 5 · Socket.IO · pg-boss", items: ["One Node process: API + realtime + workers", "jobs: agent-run · agent-resume · reconcile-sweep", "Permission table guards every route"], deps: ["agents", "core", "shared"], color: "#f4f4f6" },
  agents: { title: "packages/agents", tag: "LangGraph JS", items: ["19-node graph, state, context builders", "Read-only tools → typed evidence", "Grounding predicates · Jev questions"], deps: ["core", "shared"], color: "#a78bfa" },
  core: { title: "packages/core", tag: "Domain · the deterministic spine", items: ["Detection · policy · executor · validator", "Drizzle schema · audit · services", "Composition root wires adapters once"], deps: ["ports", "shared"], color: "#34d399" },
  ports: { title: "Ports → Adapters", tag: "swappable at the edge", items: ["PaymentGatewayPort → Simulator · (Razorpay)", "LlmPort → Gemini · Recording · Replay", "DecisionPort → Jev · Recording · Replay", "EventPublisherPort · ClockPort"], deps: ["db"], color: "#f59e0b" },
  db: { title: "Postgres", tag: "Supabase · PGlite locally", items: ["public.*: business + ops tables", "pgboss.*: job queue", "checkpoints: LangGraph PostgresSaver"], deps: [], color: "#60a5fa" },
  shared: { title: "packages/shared", tag: "Zod 4", items: ["DTOs · enums · action catalog", "Money utils (integer paise) · event names"], deps: [], color: "#a1a1ad" },
  simulator: { title: "packages/simulator", tag: "seeded faults", items: ["8 faults + a healthy control", "Writes gw_* (external) + internal rows"], deps: ["core"], color: "#fb7185" },
};

function Block({ id, active, onHover }: { id: BlockId; active: BlockId | null; onHover: (b: BlockId | null) => void }) {
  const b = BLOCKS[id];
  const lit = !active || active === id || BLOCKS[active].deps.includes(id);
  const isDep = active && active !== id && BLOCKS[active].deps.includes(id);
  return (
    <div
      tabIndex={0}
      data-mag
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(id)}
      onBlur={() => onHover(null)}
      className="rounded-xl border p-4 outline-none transition-all duration-300"
      style={{
        borderColor: active === id ? b.color + "90" : isDep ? b.color + "55" : "rgba(255,255,255,0.08)",
        background: active === id ? b.color + "12" : "rgba(255,255,255,0.02)",
        opacity: lit ? 1 : 0.32,
      }}
    >
      <div className="mb-0.5 flex items-center justify-between gap-2">
        <span className="font-mono text-[13px] font-semibold" style={{ color: b.color }}>{b.title}</span>
        {isDep && <span className="font-mono text-[9.5px] uppercase tracking-wider text-ink-faint">dependency</span>}
      </div>
      <div className="mb-2.5 text-[11.5px] text-ink-faint">{b.tag}</div>
      <ul className="grid gap-1">
        {b.items.map((it) => (
          <li key={it} className="text-[12.5px] leading-snug text-ink-dim">{it}</li>
        ))}
      </ul>
    </div>
  );
}

function Wire({ label }: { label: string }) {
  const reduce = useReducedMotion();
  return (
    <div className="relative flex h-10 items-center justify-center">
      <div className="absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-white/5 via-white/20 to-white/5" />
      {!reduce && (
        <motion.span
          className="absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-accent-2 shadow-[0_0_8px_#22d3ee]"
          initial={{ top: "0%" }}
          animate={{ top: ["0%", "100%"] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
        />
      )}
      <span className="relative ml-24 rounded bg-bg px-1.5 font-mono text-[10px] text-ink-faint">{label}</span>
    </div>
  );
}

export default function HexArchitecture() {
  const [active, setActive] = useState<BlockId | null>(null);
  const h = setActive;

  return (
    <div className="rounded-2xl border border-panel-border bg-bg-soft/80 p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-ink-faint">
        <span>Hover a layer to see what it is allowed to depend on</span>
        <span>{active ? `${BLOCKS[active].title} → ${BLOCKS[active].deps.map((d) => BLOCKS[d].title).join(", ") || "nothing"}` : "core never imports agents"}</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
        <div>
          <Block id="web" active={active} onHover={h} />
          <Wire label="REST /api/* · websocket" />
          <Block id="server" active={active} onHover={h} />
          <Wire label="graph.invoke · resume" />
          <div className="grid gap-3 sm:grid-cols-2">
            <Block id="agents" active={active} onHover={h} />
            <Block id="core" active={active} onHover={h} />
          </div>
          <Wire label="ports (interfaces)" />
          <Block id="ports" active={active} onHover={h} />
          <Wire label="one connection pool" />
          <Block id="db" active={active} onHover={h} />
        </div>
        <div className="grid content-start gap-3">
          <Block id="shared" active={active} onHover={h} />
          <Block id="simulator" active={active} onHover={h} />
          <div className="rounded-xl border border-dashed border-panel-border p-4 text-[12.5px] leading-relaxed text-ink-faint">
            <span className="text-ink-dim">Not used, on purpose:</span> Redis, Kafka, microservices, a vector DB, a separate worker service, Supabase Auth/RLS.
          </div>
        </div>
      </div>
    </div>
  );
}
