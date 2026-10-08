import type { Owner } from "@/content/payops";

// Who decides — one colour per actor, used by every PayOps diagram.
export const OWNER: Record<Owner, { label: string; color: string }> = {
  rules: { label: "Rules", color: "#a1a1ad" },
  code: { label: "Code", color: "#d4d4dc" },
  jev: { label: "Jev", color: "#22d3ee" },
  gemini: { label: "Gemini", color: "#a78bfa" },
  human: { label: "Person", color: "#f59e0b" },
  validator: { label: "Validator", color: "#34d399" },
};

export const TIER_COLOR: Record<string, string> = {
  AUTO: "#34d399",
  OPS: "#22d3ee",
  MANAGER: "#f59e0b",
  BLOCKED: "#fb7185",
};

export function OwnerChip({ owner, className = "" }: { owner: Owner; className?: string }) {
  const o = OWNER[owner];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[10.5px] uppercase tracking-[0.12em] ${className}`}
      style={{ color: o.color, borderColor: o.color + "40", background: o.color + "12" }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: o.color }} />
      {o.label}
    </span>
  );
}
