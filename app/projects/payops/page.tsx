import type { Metadata } from "next";
import Link from "next/link";
import { Github, ExternalLink, ShieldCheck } from "lucide-react";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";
import Gallery from "@/components/Gallery";
import Collapse from "@/components/Collapse";
import Magnetic from "@/components/Magnetic";
import { Eyebrow } from "@/components/Section";
import StateMatrix from "@/components/payops/StateMatrix";
import DecisionPipeline from "@/components/payops/DecisionPipeline";
import AgentGraph from "@/components/payops/AgentGraph";
import PolicyPlayground from "@/components/payops/PolicyPlayground";
import HexArchitecture from "@/components/payops/HexArchitecture";
import ReplayModes from "@/components/payops/ReplayModes";
import { TIER_COLOR } from "@/components/payops/owners";
import { payops as p } from "@/content/payops";

export const metadata: Metadata = {
  title: "PayOps AI — a multi-agent payment investigator that isn't allowed to touch the money",
  description:
    "Case study of PayOps AI: a LangGraph multi-agent system (Jev + Gemini) that reconciles payments across five systems, cites evidence, and proposes fixes, while deterministic policy, idempotent execution, four-eyes approvals and an independent validator keep money safe. Architecture, agent orchestration, evals and decisions.",
  alternates: { canonical: "https://www.shivamgovindrao.com/projects/payops" },
};

// Renders `code` spans in copy as mono.
function Rich({ text }: { text: string }) {
  const parts = text.split(/`([^`]+)`/g);
  return (
    <>
      {parts.map((t, i) =>
        i % 2 ? (
          <code key={i} className="rounded bg-white/[0.06] px-1 py-px font-mono text-[0.9em] text-ink">{t}</code>
        ) : (
          <span key={i}>{t}</span>
        )
      )}
    </>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-4 max-w-3xl font-serif text-[clamp(28px,4.5vw,44px)] font-normal leading-[1.1] tracking-tight">{children}</h2>;
}

function Lead({ children }: { children: React.ReactNode }) {
  return <p className="mb-8 max-w-2xl text-[15px] leading-relaxed text-ink-dim">{children}</p>;
}

function DecisionCard({ d }: { d: (typeof p.decisions)[number] }) {
  return (
    <TiltCard className="h-full p-6" max={2}>
      <div className="mb-2 flex items-center gap-3">
        <span className="font-mono text-[11px] text-accent">{d.id}</span>
        <h3 className="text-[16px] font-semibold tracking-tight">{d.title}</h3>
      </div>
      <dl className="grid gap-2.5 text-[14px] leading-relaxed">
        <div><dt className="inline font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-faint">Problem · </dt><dd className="inline text-ink-dim"><Rich text={d.problem} /></dd></div>
        <div><dt className="inline font-mono text-[10.5px] uppercase tracking-[0.12em] text-accent-2">Choice · </dt><dd className="inline text-ink"><Rich text={d.choice} /></dd></div>
        <div><dt className="inline font-mono text-[10.5px] uppercase tracking-[0.12em] text-emerald-400">Payoff · </dt><dd className="inline text-ink-dim"><Rich text={d.payoff} /></dd></div>
      </dl>
    </TiltCard>
  );
}

export default function PayOpsPage() {
  const topDecisions = p.decisions.slice(0, 4);
  const restDecisions = p.decisions.slice(4);

  return (
    <div className="pt-32">
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-24 h-[420px] w-[620px] max-w-full opacity-70 blur-3xl"
          style={{ background: "radial-gradient(closest-side, rgba(167,139,250,0.16), transparent), radial-gradient(closest-side at 70% 60%, rgba(34,211,238,0.10), transparent)" }}
        />
        <Reveal>
          <div className="relative mb-6 flex flex-wrap items-center gap-3">
            <Eyebrow>Case study · Agentic AI</Eyebrow>
          </div>
        </Reveal>
        <Reveal>
          <h1 className="relative mb-5 font-serif text-[clamp(42px,7.4vw,80px)] font-normal leading-[1.02] tracking-tight">
            PayOps AI<span className="grad-text">.</span>
            <br />
            <span className="grad-text italic">{p.tagline}</span>
          </h1>
        </Reveal>
        <Reveal delay={0.05}>
          <div className="relative mb-5 flex flex-wrap items-center gap-3 font-mono text-xs">
            <span className="text-accent">{p.year}</span>
            <span className="text-ink-faint">·</span>
            <span className="text-ink-dim">{p.role}</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/30 bg-violet-400/10 px-2.5 py-0.5 text-[11px] font-medium text-violet-300">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-300 shadow-[0_0_8px_#c4b5fd]" />
              Flagship project
            </span>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="relative mb-4 max-w-2xl text-lg leading-relaxed text-ink-dim">{p.intro}</p>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="relative mb-7 flex max-w-2xl items-start gap-2.5 text-[15px] text-ink">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            {p.pitch}
          </p>
        </Reveal>
        <Reveal delay={0.14}>
          <div className="relative mb-14 flex flex-wrap items-center gap-3">
            <Magnetic>
              <a href={p.links.live} target="_blank" rel="noopener" data-mag className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4.5 py-2.5 text-sm text-ink transition-all hover:border-accent hover:bg-accent/20">
                <ExternalLink className="h-4 w-4" /> Live demo
              </a>
            </Magnetic>
            <Magnetic>
              <a href={p.links.github} target="_blank" rel="noopener" data-mag className="inline-flex items-center gap-2 rounded-full border border-panel-border px-4.5 py-2.5 text-sm text-ink-dim transition-all hover:border-accent hover:text-ink">
                <Github className="h-4 w-4" /> GitHub
              </a>
            </Magnetic>
            <a href="#graph" data-mag className="px-2 text-sm text-accent-2 hover:underline">Watch an agent run ↓</a>
          </div>
        </Reveal>
      </div>

      {/* facts */}
      <Reveal>
        <div className="mb-24 grid grid-cols-2 gap-6 border-y border-panel-border py-8 sm:grid-cols-4">
          {p.facts.map((f) => (
            <div key={f.label}>
              <div className="font-serif text-[clamp(30px,4.4vw,46px)] leading-none grad-text">{f.num}</div>
              <div className="mt-2.5 text-[13px] leading-relaxed text-ink-dim">{f.label}</div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* ── WATCH ────────────────────────────────────────────────── */}
      <section className="mb-24">
        <Reveal><Eyebrow>Watch it</Eyebrow></Reveal>
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-panel-border shadow-[0_30px_120px_-40px_rgba(167,139,250,0.35)]">
            <video
              className="aspect-video w-full bg-black"
              src={p.video.src}
              poster={p.video.poster}
              controls
              playsInline
              preload="metadata"
            >
              <track kind="captions" src={p.video.captions} srcLang="en" label="English" default />
            </video>
          </div>
          <div className="mt-2.5 text-center font-mono text-[11px] text-ink-faint">{p.video.caption}</div>
        </Reveal>
        <Reveal delay={0.05}>
          <div className="mt-12">
            <Gallery media={p.media} />
          </div>
        </Reveal>
      </section>

      {/* ── THE PROBLEM ──────────────────────────────────────────── */}
      <section className="mb-24">
        <Reveal><Eyebrow>The problem</Eyebrow></Reveal>
        <Reveal><H2>The payment succeeded. <span className="grad-text italic">The records disagree.</span></H2></Reveal>
        <Reveal delay={0.05}><Lead>{p.matrix.story}</Lead></Reveal>
        <Reveal delay={0.08}><StateMatrix /></Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-3xl text-[14px] leading-relaxed text-ink-faint">
            The fix: <code className="font-mono text-ink-dim">{p.matrix.fix}</code>. {p.matrix.fixNote}
          </p>
        </Reveal>
      </section>

      {/* ── WHO DECIDES ──────────────────────────────────────────── */}
      <section className="mb-24">
        <Reveal><Eyebrow>Who decides what</Eyebrow></Reveal>
        <Reveal><H2>Models propose. <span className="grad-text italic">Code decides.</span></H2></Reveal>
        <Reveal delay={0.05}>
          <Lead>
            Three rules are never broken. Models never touch data directly. Models never authorise or execute. Models never do arithmetic
            or date math: code computes every number and hands the model the result as a fact. Every model-facing step sits behind a
            port with a coded fallback, so a slow or unsure model degrades to a safe path instead of blocking work.
          </Lead>
        </Reveal>
        <Reveal delay={0.08}><DecisionPipeline /></Reveal>
      </section>

      {/* ── AGENT GRAPH ──────────────────────────────────────────── */}
      <section id="graph" className="mb-24 scroll-mt-24">
        <Reveal><Eyebrow>The agent system</Eyebrow></Reveal>
        <Reveal><H2>A deterministic spine, <span className="grad-text italic">with agents where reasoning pays.</span></H2></Reveal>
        <Reveal delay={0.05}>
          <Lead>
            Not one big ReAct agent, and not a supervisor chatting with sub-agents in a loop. It's a LangGraph state machine. Jev plans
            once, the selected specialists fan out in parallel, their findings are grounded against evidence, and then the deterministic
            half takes over. Pick a recorded run and watch it stream. Hover any node to see what it reads, writes, and why it exists.
          </Lead>
        </Reveal>
        <Reveal delay={0.08}><AgentGraph /></Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 font-mono text-[11px] leading-relaxed text-ink-faint">
            Runs, tiers, tool counts and costs come from the live eval report (2026-09-29). The event names are the real Socket.IO events
            the workbench streams; the detail text is condensed.
          </p>
        </Reveal>
      </section>

      {/* ── TWO MODELS ───────────────────────────────────────────── */}
      <section className="mb-24">
        <Reveal><Eyebrow>Two models, two jobs</Eyebrow></Reveal>
        <Reveal><H2>A fast judge and a careful investigator.</H2></Reveal>
        <div className="grid gap-5 lg:grid-cols-2">
          <Reveal>
            <TiltCard className="h-full p-6 sm:p-7" max={2}>
              <div className="mb-1 flex items-baseline gap-3">
                <span className="font-serif text-3xl italic text-accent-2">{p.models.jev.name}</span>
                <span className="font-mono text-[11px] text-ink-faint">{p.models.jev.by}</span>
              </div>
              <p className="mb-5 text-[14px] leading-relaxed text-ink-dim">{p.models.jev.role}</p>
              <ul className="grid gap-1.5">
                {p.models.jev.points.map((j) => (
                  <li key={j.tag} className="grid grid-cols-[30px_1fr] gap-x-3 rounded-lg border border-panel-border bg-black/20 px-3 py-2 sm:grid-cols-[30px_1fr_auto]">
                    <span className="font-mono text-[12px] font-semibold text-accent-2">{j.tag}</span>
                    <span className="text-[13px] text-ink">{j.q}</span>
                    <span className="col-start-2 font-mono text-[10.5px] text-ink-faint sm:col-start-auto">fallback: {j.fb}</span>
                  </li>
                ))}
              </ul>
            </TiltCard>
          </Reveal>
          <Reveal delay={0.05}>
            <TiltCard className="h-full p-6 sm:p-7" max={2}>
              <div className="mb-1 flex items-baseline gap-3">
                <span className="font-serif text-3xl italic text-violet-300">{p.models.gemini.name}</span>
                <span className="font-mono text-[11px] text-ink-faint">{p.models.gemini.by}</span>
              </div>
              <p className="mb-5 text-[14px] leading-relaxed text-ink-dim"><Rich text={p.models.gemini.role} /></p>
              <ul className="mb-6 grid gap-2.5">
                {p.models.gemini.points.map((g) => (
                  <li key={g} className="relative pl-5 text-[14px] leading-relaxed text-ink-dim">
                    <span className="absolute left-0 top-[3px] text-violet-300">▹</span>{g}
                  </li>
                ))}
              </ul>
              <div className="rounded-xl border border-accent-2/25 bg-accent-2/[0.06] p-4">
                <div className="mb-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-accent-2">The fast path</div>
                <p className="text-[13.5px] leading-relaxed text-ink-dim">{p.models.fastPathNote}</p>
              </div>
            </TiltCard>
          </Reveal>
        </div>
      </section>

      {/* ── POLICY ───────────────────────────────────────────────── */}
      <section className="mb-24">
        <Reveal><Eyebrow>Policy engine · try it</Eyebrow></Reveal>
        <Reveal><H2>Who has to say yes? <span className="grad-text italic">Plain code decides.</span></H2></Reveal>
        <Reveal delay={0.05}>
          <Lead>
            Each rule is a small pure function. They all run, the strictest tier wins, and AUTO has to be granted by a rule: nothing is
            automatic by omission. The same engine judges proposals from people and from the agent; rules that use model confidence are
            skipped for people. Change the inputs and watch the decision move.
          </Lead>
        </Reveal>
        <Reveal delay={0.08}><PolicyPlayground /></Reveal>
      </section>

      {/* ── ARCHITECTURE ─────────────────────────────────────────── */}
      <section className="mb-24">
        <Reveal><Eyebrow>System architecture</Eyebrow></Reveal>
        <Reveal><H2>{p.architecture.heading}</H2></Reveal>
        <Reveal delay={0.05}><Lead><Rich text={p.architecture.body} /></Lead></Reveal>
        <Reveal delay={0.08}><HexArchitecture /></Reveal>
        <Reveal delay={0.1}>
          <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-ink-dim">{p.architecture.oneDb}</p>
        </Reveal>
      </section>

      {/* ── SAFETY ───────────────────────────────────────────────── */}
      <section className="mb-24">
        <Reveal><Eyebrow>Guardrails</Eyebrow></Reveal>
        <Reveal><H2>A manipulated model can, at worst, <span className="grad-text italic">propose something.</span></H2></Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {p.guardrails.map((g, i) => (
            <Reveal key={g.title} delay={(i % 4) * 0.04}>
              <div className="h-full rounded-2xl border border-panel-border bg-panel p-5 transition-colors hover:border-accent/40">
                <div className="mb-2 font-mono text-[11px] text-accent">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="mb-2 text-[15px] font-semibold tracking-tight text-ink">{g.title}</h3>
                <p className="text-[13.5px] leading-relaxed text-ink-dim"><Rich text={g.body} /></p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── EVALS ────────────────────────────────────────────────── */}
      <section className="mb-24">
        <Reveal><Eyebrow>Evals & replay</Eyebrow></Reveal>
        <Reveal><H2>Measured, not vibes.</H2></Reveal>
        <Reveal>
          <div className="mb-8 mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {p.evalMetrics.map((m) => (
              <div key={m.label}>
                <div className="font-serif text-[clamp(28px,4vw,40px)] leading-none grad-text">{m.num}</div>
                <div className="mt-2 text-[13px] text-ink-dim">{m.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <div className="overflow-x-auto rounded-2xl border border-panel-border">
            <table className="w-full min-w-[640px] text-left text-[13px]">
              <thead className="bg-white/[0.02] font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-faint">
                <tr>
                  <th className="px-4 py-3 font-normal">Golden scenario</th>
                  <th className="px-4 py-3 font-normal">Tier</th>
                  <th className="px-4 py-3 font-normal">Outcome</th>
                  <th className="px-4 py-3 font-normal">Actions</th>
                  <th className="px-4 py-3 text-right font-normal">Tools</th>
                  <th className="px-4 py-3 text-right font-normal">Cost</th>
                </tr>
              </thead>
              <tbody>
                {p.evals.map((e) => (
                  <tr key={e.s} className="border-t border-panel-border transition-colors hover:bg-white/[0.02]">
                    <td className="px-4 py-2.5 font-mono text-[12px] text-ink">
                      <span className="mr-2 text-emerald-400">✓</span>{e.s}{"caveat" in e && e.caveat ? <span className="text-accent"> *</span> : null}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="rounded px-1.5 py-0.5 font-mono text-[10.5px] font-semibold" style={{ color: TIER_COLOR[e.tier], background: TIER_COLOR[e.tier] + "18" }}>{e.tier}</span>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-[11.5px] text-ink-dim">{e.status}</td>
                    <td className="px-4 py-2.5 font-mono text-[11.5px] text-ink-dim">{e.actions}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-[12px] text-ink-dim">{e.tools}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-[12px] text-ink-dim">{e.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mt-4 max-w-3xl text-[14px] leading-relaxed text-ink-faint">
            <span className="text-accent">* </span><Rich text={p.evalCaveat} />
          </p>
        </Reveal>
        <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_1fr] lg:items-start">
          <Reveal><ReplayModes /></Reveal>
          <Reveal delay={0.05}>
            <p className="text-[15px] leading-relaxed text-ink-dim">
              AI calls cost money and vary between runs, and a public demo shouldn't spend my API credits.{" "}
              <Rich text={p.replayNote} />
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── DECISIONS ────────────────────────────────────────────── */}
      <section className="mb-24">
        <Reveal><Eyebrow>Engineering decisions</Eyebrow></Reveal>
        <Reveal><H2>The calls that shaped it.</H2></Reveal>
        <Reveal delay={0.05}><Lead>From a decision log of nearly 80 entries. Each one names the problem, the choice and what it bought.</Lead></Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          {topDecisions.map((d, i) => (
            <Reveal key={d.id} delay={(i % 2) * 0.04}><DecisionCard d={d} /></Reveal>
          ))}
        </div>
        {restDecisions.length > 0 && (
          <Reveal>
            <div className="mt-4">
              <Collapse label="More decisions" hint={`${restDecisions.length} more`}>
                <div className="grid gap-4 sm:grid-cols-2">
                  {restDecisions.map((d) => <DecisionCard key={d.id} d={d} />)}
                </div>
              </Collapse>
            </div>
          </Reveal>
        )}
      </section>

      {/* ── STACK ────────────────────────────────────────────────── */}
      <section className="mb-24">
        <Reveal><Eyebrow>Stack, and why each</Eyebrow></Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          {p.stack.map((s, i) => (
            <Reveal key={s.name} delay={(i % 2) * 0.03}>
              <div className="h-full rounded-2xl border border-panel-border bg-panel p-5">
                <div className="mb-1.5 font-mono text-[13px] text-accent-2">{s.name}</div>
                <p className="text-sm leading-relaxed text-ink-dim"><Rich text={s.why} /></p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <div className="mt-6 flex flex-wrap gap-2">
            {p.numbers.map((n) => (
              <span key={n} className="rounded-md border border-panel-border bg-white/[0.02] px-2.5 py-1 font-mono text-[11.5px] text-ink-dim">{n}</span>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── LIMITS ───────────────────────────────────────────────── */}
      <section className="mb-24">
        <Reveal><Eyebrow>Honest limitations</Eyebrow></Reveal>
        <ul className="grid max-w-3xl gap-3.5">
          {p.limitations.map((t, i) => (
            <Reveal key={i} delay={i * 0.03}>
              <li className="relative pl-6 text-[15px] leading-relaxed text-ink-dim">
                <span className="absolute left-0 top-[4px] text-accent">▹</span>
                <Rich text={t} />
              </li>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ── LESSONS ──────────────────────────────────────────────── */}
      <section className="mb-28">
        <Reveal><Eyebrow>Lessons</Eyebrow></Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          {p.lessons.map((l, i) => (
            <Reveal key={i} delay={(i % 2) * 0.04}>
              <TiltCard className="h-full p-6" max={2}>
                <div className="mb-2 font-serif text-2xl italic grad-text">{String(i + 1).padStart(2, "0")}</div>
                <p className="text-[15px] leading-relaxed text-ink-dim">{l}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal>
        <div className="mb-28 flex flex-wrap items-center justify-between gap-4">
          <Link href="/projects" data-mag className="text-sm text-ink-dim hover:text-ink">← All projects</Link>
          <Link href="/#contact" data-mag className="text-sm text-accent-2 hover:underline">Building agentic systems that touch real money? Let&apos;s talk →</Link>
        </div>
      </Reveal>
    </div>
  );
}
