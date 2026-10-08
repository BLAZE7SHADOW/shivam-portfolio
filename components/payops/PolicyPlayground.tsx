"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { payops } from "@/content/payops";
import { TIER_COLOR } from "./owners";

// A faithful, simplified port of packages/core/src/policy (rules P0–P11).
// All rules run; the strictest tier wins; AUTO must be granted by a rule.

type Tier = "AUTO" | "OPS" | "MANAGER" | "BLOCKED";
type Risk = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
type ActionId = (typeof payops.actions)[number]["id"];
const RANK: Record<Tier, number> = { AUTO: 0, OPS: 1, MANAGER: 2, BLOCKED: 3 };

type Input = {
  action: ActionId;
  actor: "agent" | "person";
  amount: number; // rupees
  risk: Risk;
  confidence: number;
  captureCited: boolean;
  attempt: 1 | 2;
  preconditionFails: boolean;
};

const RULES: { id: string; tier: Tier; text: string; test: (i: Input, cls: string) => boolean }[] = [
  { id: "P0", tier: "BLOCKED", text: "A precondition fails, or the proposal relies on an ungrounded finding", test: (i) => i.preconditionFails },
  { id: "P1", tier: "BLOCKED", text: "Risk is CRITICAL and the action is not hold / escalate", test: (i, c) => i.risk === "CRITICAL" && c !== "CONTROL" },
  { id: "P2", tier: "MANAGER", text: "Risk is HIGH or CRITICAL", test: (i) => i.risk === "HIGH" || i.risk === "CRITICAL" },
  { id: "P3", tier: "MANAGER", text: "Money-moving, amount > ₹10,000", test: (i, c) => c === "MONEY_MOVEMENT" && i.amount > 10000 },
  { id: "P4", tier: "OPS", text: "Money-moving, ₹1,000 < amount ≤ ₹10,000", test: (i, c) => c === "MONEY_MOVEMENT" && i.amount > 1000 && i.amount <= 10000 },
  { id: "P5", tier: "AUTO", text: "Money-moving ≤ ₹1,000, risk LOW, confidence ≥ 0.9", test: (i, c) => c === "MONEY_MOVEMENT" && i.amount <= 1000 && i.risk === "LOW" && (i.actor === "person" || i.confidence >= 0.9) },
  { id: "P6", tier: "AUTO", text: "State correction only, gateway CAPTURED cited, confidence ≥ 0.85", test: (i, c) => c === "STATE_CORRECTION" && i.captureCited && (i.actor === "person" || i.confidence >= 0.85) },
  { id: "P7", tier: "OPS", text: "Attempt ≥ 2", test: (i) => i.attempt >= 2 },
  { id: "P8", tier: "OPS", text: "Agent diagnosis confidence < 0.6", test: (i) => i.actor === "agent" && i.confidence < 0.6 },
  { id: "P9", tier: "OPS", text: "Raises a claim against a third party", test: (_, c) => c === "CLAIM" },
  { id: "P10", tier: "AUTO", text: "Only control actions (hold / escalate)", test: (_, c) => c === "CONTROL" },
];

function evaluate(i: Input) {
  const cls = payops.actions.find((a) => a.id === i.action)!.cls;
  const fired = RULES.filter((r) => r.test(i, cls)).map((r) => ({ id: r.id, tier: r.tier }));
  if (!fired.some((f) => f.tier === "AUTO")) fired.push({ id: "P11", tier: "OPS" });
  const tier = fired.reduce<Tier>((t, f) => (RANK[f.tier] > RANK[t] ? f.tier : t), "AUTO");
  return { tier, fired, cls };
}

const PRESETS: { name: string; input: Partial<Input> }[] = [
  { name: "₹78,000 refund", input: { action: "INITIATE_REFUND", amount: 78000, risk: "LOW", confidence: 0.92, attempt: 1, preconditionFails: false } },
  { name: "₹500 refund", input: { action: "INITIATE_REFUND", amount: 500, risk: "LOW", confidence: 0.95, attempt: 1, preconditionFails: false } },
  { name: "Replay webhook", input: { action: "REPLAY_WEBHOOK_EVENT", captureCited: true, risk: "LOW", confidence: 0.9, attempt: 1, preconditionFails: false } },
  { name: "Suspected fraud", input: { action: "INITIATE_REFUND", amount: 4200, risk: "CRITICAL", confidence: 0.8, attempt: 1, preconditionFails: false } },
];

const DEFAULT: Input = {
  action: "INITIATE_REFUND",
  actor: "agent",
  amount: 78000,
  risk: "LOW",
  confidence: 0.92,
  captureCited: true,
  attempt: 1,
  preconditionFails: false,
};

const APPROVER: Record<Tier, string> = {
  AUTO: "Executes immediately, then the validator verifies.",
  OPS: "Waits for an OPS analyst who isn't the requester.",
  MANAGER: "Waits for a MANAGER. The requester can never approve it.",
  BLOCKED: "Cannot run. The case is escalated to a person.",
};

function Seg<T extends string | number>({ value, options, onChange, label }: { value: T; options: readonly T[]; onChange: (v: T) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-1 rounded-lg border border-panel-border bg-black/30 p-1">
      {options.map((o) => (
        <button
          key={String(o)}
          type="button"
          role="radio"
          aria-checked={o === value}
          data-mag
          onClick={() => onChange(o)}
          className={`flex-1 rounded-md px-2.5 py-1.5 font-mono text-[11.5px] transition-colors ${
            o === value ? "bg-white/[0.08] text-ink" : "text-ink-faint hover:text-ink-dim"
          }`}
        >
          {String(o)}
        </button>
      ))}
    </div>
  );
}

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      data-mag
      onClick={() => onChange(!on)}
      className="flex w-full items-center justify-between gap-3 rounded-lg border border-panel-border bg-black/20 px-3 py-2 text-left text-[13px] text-ink-dim transition-colors hover:text-ink"
    >
      {label}
      <span className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${on ? "bg-accent-2/70" : "bg-white/10"}`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${on ? "left-[18px]" : "left-0.5"}`} />
      </span>
    </button>
  );
}

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-faint">{children}</div>
);

export default function PolicyPlayground() {
  const [i, setI] = useState<Input>(DEFAULT);
  const set = (p: Partial<Input>) => setI((s) => ({ ...s, ...p }));
  const { tier, fired, cls } = useMemo(() => evaluate(i), [i]);
  const winners = fired.filter((f) => f.tier === tier).map((f) => f.id);
  const firedIds = new Set(fired.map((f) => f.id));
  const color = TIER_COLOR[tier];

  return (
    <div className="grid overflow-hidden rounded-2xl border border-panel-border bg-bg-soft/80 lg:grid-cols-[1fr_1.1fr]">
      {/* controls */}
      <div className="grid content-start gap-4 border-b border-panel-border p-5 sm:p-6 lg:border-b-0 lg:border-r">
        <div>
          <Label>Try a preset</Label>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.name}
                type="button"
                data-mag
                onClick={() => set(p.input)}
                className="rounded-full border border-panel-border px-3 py-1 text-[12.5px] text-ink-dim transition-colors hover:border-accent/50 hover:text-ink"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label>Proposed action <span className="normal-case tracking-normal text-ink-faint">· {cls.replace("_", " ").toLowerCase()}</span></Label>
          <select
            value={i.action}
            onChange={(e) => set({ action: e.target.value as ActionId })}
            className="w-full rounded-lg border border-panel-border bg-bg px-3 py-2 font-mono text-[12.5px] text-ink"
            aria-label="Proposed action"
          >
            {payops.actions.map((a) => (
              <option key={a.id} value={a.id}>{a.id}</option>
            ))}
          </select>
        </div>

        <div>
          <Label>Proposed by</Label>
          <Seg label="Proposed by" value={i.actor} options={["agent", "person"] as const} onChange={(v) => set({ actor: v })} />
        </div>

        {cls === "MONEY_MOVEMENT" && (
          <div>
            <Label>Refund amount · ₹{i.amount.toLocaleString("en-IN")}</Label>
            <input
              type="range"
              min={100}
              max={100000}
              step={100}
              value={i.amount}
              onChange={(e) => set({ amount: Number(e.target.value) })}
              className="w-full accent-[#f59e0b]"
              aria-label="Refund amount in rupees"
            />
            <div className="flex justify-between font-mono text-[10px] text-ink-faint">
              <span>₹100</span><span>₹1k</span><span>₹10k</span><span>₹1L</span>
            </div>
          </div>
        )}

        <div>
          <Label>Risk tier (J3 composite)</Label>
          <Seg label="Risk tier" value={i.risk} options={["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const} onChange={(v) => set({ risk: v })} />
        </div>

        {i.actor === "agent" && (
          <div>
            <Label>Diagnosis confidence · {i.confidence.toFixed(2)}</Label>
            <input
              type="range"
              min={0.3}
              max={1}
              step={0.01}
              value={i.confidence}
              onChange={(e) => set({ confidence: Number(e.target.value) })}
              className="w-full accent-[#22d3ee]"
              aria-label="Diagnosis confidence"
            />
          </div>
        )}

        <div className="grid gap-2">
          {cls === "STATE_CORRECTION" && (
            <Toggle on={i.captureCited} onChange={(v) => set({ captureCited: v })} label="Gateway CAPTURED is cited evidence" />
          )}
          <Toggle on={i.attempt === 2} onChange={(v) => set({ attempt: v ? 2 : 1 })} label="This is attempt 2 (after a failed fix)" />
          <Toggle on={i.preconditionFails} onChange={(v) => set({ preconditionFails: v })} label="A precondition fails / finding ungrounded" />
        </div>
      </div>

      {/* verdict */}
      <div className="p-5 sm:p-6">
        <Label>Policy decision</Label>
        <div className="mb-2 flex items-center gap-4">
          <AnimatePresence mode="wait">
            <motion.span
              key={tier}
              initial={{ opacity: 0, scale: 0.85, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -6 }}
              transition={{ type: "spring", stiffness: 380, damping: 24 }}
              className="rounded-xl border-2 px-4 py-1.5 font-mono text-2xl font-bold tracking-[0.12em]"
              style={{ color, borderColor: color, background: color + "14", boxShadow: `0 0 40px ${color}22` }}
            >
              {tier}
            </motion.span>
          </AnimatePresence>
          <span className="font-mono text-[12px] text-ink-dim">
            strictest of {fired.length} fired → {winners.join(", ")}
          </span>
        </div>
        <p className="mb-5 text-[14px] text-ink-dim">{APPROVER[tier]}</p>

        <ul className="grid gap-1">
          {[...RULES, { id: "P11", tier: "OPS" as Tier, text: "Default: no rule granted AUTO" }].map((r) => {
            const on = firedIds.has(r.id);
            const win = winners.includes(r.id);
            const c = TIER_COLOR[r.tier];
            return (
              <li
                key={r.id}
                className="grid grid-cols-[34px_1fr_auto] items-center gap-3 rounded-lg px-2.5 py-1.5 transition-all duration-300"
                style={{
                  background: win ? c + "16" : on ? "rgba(255,255,255,0.03)" : "transparent",
                  opacity: on ? 1 : 0.38,
                  boxShadow: win ? `inset 2px 0 0 ${c}` : "none",
                }}
              >
                <span className="font-mono text-[11.5px] text-ink-dim">{r.id}</span>
                <span className="text-[12.5px] leading-snug text-ink-dim">{r.text}</span>
                <span className="font-mono text-[10.5px] font-semibold" style={{ color: on ? c : "#6b6b78" }}>{r.tier}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
