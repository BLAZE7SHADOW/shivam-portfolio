import type { Metadata } from "next";
import Link from "next/link";
import { Github, Zap, ShieldCheck, BadgeCheck } from "lucide-react";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";
import Collapse from "@/components/Collapse";
import Magnetic from "@/components/Magnetic";
import { Eyebrow } from "@/components/Section";
import VoicePipeline from "@/components/voice/VoicePipeline";
import LatencyWaterfall from "@/components/voice/LatencyWaterfall";
import ModeMachine from "@/components/voice/ModeMachine";
import BookingSequence from "@/components/voice/BookingSequence";
import Roadmap from "@/components/voice/Roadmap";
import Waveform from "@/components/voice/Waveform";
import { voiceAgent as v } from "@/content/voiceagent";

export const metadata: Metadata = {
  title: "Hinglish Clinic Voice Agent — a real-time voice receptionist, in development",
  description:
    "Case study (in progress) of a real-time Hinglish voice receptionist for Indian clinics: LiveKit Agents, Deepgram, Gemini Flash, Cartesia, Silero VAD and barge-in. Guards in code, per-mode tool allowlists, caller verification, read-backs built from the database row, sandboxed evals and per-stage latency measured on every turn.",
  alternates: { canonical: "https://www.shivamgovindrao.com/projects/voice-agent" },
};

// Renders **bold** and `code` spans in copy.
function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return (
    <>
      {parts.map((t, i) =>
        t.startsWith("**") ? (
          <span key={i} className="font-semibold text-ink">{t.slice(2, -2)}</span>
        ) : t.startsWith("`") ? (
          <code key={i} className="rounded bg-white/[0.06] px-1 py-px font-mono text-[0.9em] text-ink">{t.slice(1, -1)}</code>
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

function DecisionCard({ d }: { d: (typeof v.decisions)[number] }) {
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

const WHY_ICON = [Zap, ShieldCheck, BadgeCheck];

export default function VoiceAgentPage() {
  const topDecisions = v.decisions.slice(0, 4);
  const restDecisions = v.decisions.slice(4);

  return (
    <div className="pt-32">
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-24 h-[420px] w-[620px] max-w-full opacity-70 blur-3xl"
          style={{ background: "radial-gradient(closest-side, rgba(245,158,11,0.13), transparent), radial-gradient(closest-side at 70% 60%, rgba(34,211,238,0.10), transparent)" }}
        />
        <Reveal>
          <div className="relative mb-6 flex flex-wrap items-center gap-3">
            <Eyebrow>Case study · Real-time voice AI</Eyebrow>
          </div>
        </Reveal>
        <Reveal>
          <h1 className="relative mb-5 font-serif text-[clamp(40px,7vw,76px)] font-normal leading-[1.03] tracking-tight">
            Hinglish Clinic Voice Agent<span className="grad-text">.</span>
            <br />
            <span className="grad-text italic">{v.tagline}</span>
          </h1>
        </Reveal>
        <Reveal delay={0.05}>
          <div className="relative mb-5 flex flex-wrap items-center gap-3 font-mono text-xs">
            <span className="text-accent">2026</span>
            <span className="text-ink-faint">·</span>
            <span className="text-ink-dim">Personal project · solo build, 8-week plan</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 text-[11px] font-medium text-amber-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
              {v.status.label}
            </span>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="relative mb-4 max-w-2xl text-lg leading-relaxed text-ink-dim">{v.intro}</p>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="relative mb-7 max-w-2xl text-[14px] leading-relaxed text-ink-faint">
            <span className="text-ink-dim">Status, {v.status.updated}:</span> {v.status.note} All clinic and patient data is synthetic.
          </p>
        </Reveal>
        <Reveal delay={0.14}>
          <div className="relative mb-14 flex flex-wrap items-center gap-3">
            <Magnetic>
              <a href={v.links.github} target="_blank" rel="noopener" data-mag className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4.5 py-2.5 text-sm text-ink transition-all hover:border-accent hover:bg-accent/20">
                <Github className="h-4 w-4" /> GitHub · follow the build
              </a>
            </Magnetic>
            <a href="#loop" data-mag className="px-2 text-sm text-accent-2 hover:underline">Play a turn ↓</a>
          </div>
        </Reveal>
      </div>

      {/* facts */}
      <Reveal>
        <div className="mb-20 grid grid-cols-2 gap-6 border-y border-panel-border py-8 sm:grid-cols-4">
          {v.facts.map((f) => (
            <div key={f.label}>
              <div className="font-serif text-[clamp(28px,4.2vw,44px)] leading-none grad-text">{f.num}</div>
              <div className="mt-2.5 text-[13px] leading-relaxed text-ink-dim">{f.label}</div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* demo slot */}
      <Reveal>
        <div className="relative mb-24 overflow-hidden rounded-2xl border border-dashed border-panel-border bg-bg-soft/60">
          <div className="h-40 px-6 pt-6 sm:h-48">
            <Waveform />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-panel-border px-5 py-3.5">
            <span className="font-mono text-[12px] text-ink-dim">The V1 demo video lands in week 3, in Hinglish if possible.</span>
            <a href={v.links.github} target="_blank" rel="noopener" data-mag className="font-mono text-[12px] text-accent-2 hover:underline">Watch the repo →</a>
          </div>
        </div>
      </Reveal>

      {/* ── WHY ──────────────────────────────────────────────────── */}
      <section className="mb-24">
        <Reveal><Eyebrow>Why this is hard</Eyebrow></Reveal>
        <Reveal><H2>A phone call forgives nothing. <span className="grad-text italic">Not slowness, not a guess.</span></H2></Reveal>
        <div className="grid gap-4 sm:grid-cols-3">
          {v.why.map((w, i) => {
            const Icon = WHY_ICON[i];
            return (
              <Reveal key={w.title} delay={i * 0.04}>
                <TiltCard className="h-full p-6" max={3}>
                  <Icon className="mb-3 h-5 w-5 text-accent-2" />
                  <div className="mb-1.5 text-[17px] font-semibold tracking-tight">{w.title}</div>
                  <p className="text-[14px] leading-relaxed text-ink-dim">{w.body}</p>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ── LIVE LOOP ────────────────────────────────────────────── */}
      <section id="loop" className="mb-24 scroll-mt-24">
        <Reveal><Eyebrow>The real-time loop</Eyebrow></Reveal>
        <Reveal><H2>Every turn, timed <span className="grad-text italic">to the millisecond.</span></H2></Reveal>
        <Reveal delay={0.05}>
          <Lead>
            Audio streams through LiveKit into turn detection, speech-to-text, the LLM and text-to-speech. When the model wants data, it
            goes through code guards to a tool and Postgres. Nothing in a turn waits on a queue or a workflow engine. Each stage has a
            fallback provider. Press play: the bar runs at real speed with the measured p50s.
          </Lead>
        </Reveal>
        <Reveal delay={0.08}><VoicePipeline /></Reveal>
      </section>

      {/* ── LATENCY ──────────────────────────────────────────────── */}
      <section className="mb-24">
        <Reveal><Eyebrow>Measured, not guessed</Eyebrow></Reveal>
        <Reveal><H2>Every change gets a row. <span className="grad-text italic">Some get reverted.</span></H2></Reveal>
        <Reveal delay={0.05}>
          <Lead>
            English audio over a browser connection, cold first call excluded, p50 and p95 in milliseconds. Pick a run to see how each
            change moved each stage.
          </Lead>
        </Reveal>
        <Reveal delay={0.08}><LatencyWaterfall /></Reveal>
        <ul className="mt-6 grid max-w-3xl gap-3">
          {v.latencyNotes.map((n, i) => (
            <Reveal key={i} delay={i * 0.03}>
              <li className="relative pl-6 text-[15px] leading-relaxed text-ink-dim">
                <span className="absolute left-0 top-[4px] text-accent-2">▹</span>
                <Rich text={n} />
              </li>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ── MODES ────────────────────────────────────────────────── */}
      <section className="mb-24">
        <Reveal><Eyebrow>One agent, many modes</Eyebrow></Reveal>
        <Reveal><H2>The model can only reach <span className="grad-text italic">what this moment needs.</span></H2></Reveal>
        <Reveal delay={0.05}><Lead>{v.modeWhy}</Lead></Reveal>
        <Reveal delay={0.08}><ModeMachine /></Reveal>
      </section>

      {/* ── BOOKING ──────────────────────────────────────────────── */}
      <section className="mb-24">
        <Reveal><Eyebrow>How a booking is written safely</Eyebrow></Reveal>
        <Reveal><H2>The caller says yes to <span className="grad-text italic">the row that gets stored.</span></H2></Reveal>
        <Reveal delay={0.05}>
          <Lead>
            The LLM proposes, code decides. Dates are resolved in code, only an offered slot can be held, the read-back is built from the
            database row and spoken word for word, and a second confirm call writes only after a clear yes to that exact sentence.
            Try the three answers.
          </Lead>
        </Reveal>
        <Reveal delay={0.08}><BookingSequence /></Reveal>
      </section>

      {/* ── CAPABILITIES ─────────────────────────────────────────── */}
      <section className="mb-24">
        <Reveal><Eyebrow>What it does today</Eyebrow></Reveal>
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-panel-border">
            {v.capabilities.map(([what, how], i) => (
              <div key={what} className={`grid gap-1 px-5 py-3.5 sm:grid-cols-[1fr_1.3fr] sm:gap-6 ${i % 2 ? "bg-white/[0.015]" : ""}`}>
                <div className="text-[14px] text-ink">{what}</div>
                <div className="text-[14px] leading-relaxed text-ink-dim"><Rich text={how} /></div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── DECISIONS ────────────────────────────────────────────── */}
      <section className="mb-24">
        <Reveal><Eyebrow>Engineering decisions</Eyebrow></Reveal>
        <Reveal><H2>Built the way production voice agents are.</H2></Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          {topDecisions.map((d, i) => (
            <Reveal key={d.id} delay={(i % 2) * 0.04}><DecisionCard d={d} /></Reveal>
          ))}
        </div>
        <Reveal>
          <div className="mt-4">
            <Collapse label="More decisions" hint={`${restDecisions.length} more`}>
              <div className="grid gap-4 sm:grid-cols-2">
                {restDecisions.map((d) => <DecisionCard key={d.id} d={d} />)}
              </div>
            </Collapse>
          </div>
        </Reveal>
      </section>

      {/* ── EXPERIMENTS ──────────────────────────────────────────── */}
      <section className="mb-24">
        <Reveal><Eyebrow>Experiments</Eyebrow></Reveal>
        <Reveal><H2>One measured change <span className="grad-text italic">at a time.</span></H2></Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          {v.experiments.map((e, i) => (
            <Reveal key={e.id} delay={(i % 2) * 0.04}>
              <div className="h-full rounded-2xl border border-panel-border bg-panel p-5">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="font-mono text-[12px] text-accent-2">{e.id}</span>
                  <span className={`rounded px-1.5 py-0.5 font-mono text-[10.5px] ${e.verdict === "kept" ? "bg-emerald-400/10 text-emerald-400" : "bg-rose-400/10 text-rose-400"}`}>{e.verdict}</span>
                </div>
                <div className="mb-2 text-[15px] font-semibold leading-snug tracking-tight">{e.title}</div>
                <p className="mb-2 text-[14px] leading-relaxed text-ink-dim">{e.result}</p>
                <p className="font-mono text-[11.5px] text-ink-faint">→ {e.decision}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── EVALS + VOICE TEST ───────────────────────────────────── */}
      <section className="mb-24">
        <Reveal><Eyebrow>Evals and the voice test</Eyebrow></Reveal>
        <Reveal><H2>Tested in a sandbox <span className="grad-text italic">before any real call.</span></H2></Reveal>
        <div className="grid gap-5 lg:grid-cols-2 lg:items-start [&>*]:min-w-0">
          <Reveal>
            <div className="overflow-x-auto rounded-2xl border border-panel-border">
              <table className="w-full min-w-[420px] text-left">
                <thead className="border-b border-panel-border bg-white/[0.02] font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-faint">
                  <tr>
                    <th className="px-4 py-2.5 font-normal">Split</th>
                    <th className="px-4 py-2.5 font-normal">Scenarios</th>
                    <th className="px-4 py-2.5 font-normal">Task success</th>
                    <th className="px-4 py-2.5 font-normal">Wrong actions</th>
                  </tr>
                </thead>
                <tbody>
                  {v.evals.rows.map((r) => (
                    <tr key={r.split} className="border-b border-panel-border/60 last:border-0">
                      <td className="px-4 py-2.5 text-[14px] text-ink">{r.split}</td>
                      <td className="px-4 py-2.5 font-mono text-[12.5px] text-ink-dim">{r.scenarios}</td>
                      <td className={`px-4 py-2.5 font-mono text-[12.5px] ${r.wrong ? "text-emerald-400" : "text-ink-faint"}`} colSpan={r.wrong ? 1 : 2}>{r.success}</td>
                      {r.wrong && <td className="px-4 py-2.5 font-mono text-[12.5px] text-ink-dim">{r.wrong}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-[14px] leading-relaxed text-ink-dim">{v.evals.story}</p>
            <ul className="mt-5 grid gap-3">
              {v.evals.points.map((pt, i) => (
                <li key={i} className="relative pl-6 text-[14px] leading-relaxed text-ink-dim">
                  <span className="absolute left-0 top-[3px] text-accent-2">▹</span>
                  <Rich text={pt} />
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="rounded-2xl border border-panel-border bg-panel p-5">
              <div className="mb-3 flex items-baseline justify-between gap-3">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">Week 2 voice test · 14 Oct</span>
                <span className="font-mono text-[11px] text-emerald-400">0 wrong actions</span>
              </div>
              <ul className="grid gap-2.5">
                {v.voiceTest.map((c) => (
                  <li key={c.id} className="grid grid-cols-[44px_1fr] gap-2">
                    <span className={`font-mono text-[12px] ${c.ok ? "text-emerald-400" : "text-rose-400"}`}>{c.ok ? "✓" : "✗"} {c.id}</span>
                    <div>
                      <div className="text-[13.5px] text-ink">{c.what}</div>
                      <div className="text-[13px] leading-relaxed text-ink-dim">{c.result}</div>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-4 border-t border-panel-border pt-3 text-[12.5px] leading-relaxed text-ink-faint">
                Every row in the <code className="font-mono text-ink-dim">events</code> table matches what the caller asked for.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── PROBLEMS ─────────────────────────────────────────────── */}
      <section className="mb-24">
        <Reveal><Eyebrow>Problems found and fixed</Eyebrow></Reveal>
        <Reveal><Lead>{v.problemsNote}</Lead></Reveal>
        <Reveal>
          <Collapse label="The problem log" hint={`${v.problems.length} entries`}>
            <div className="grid gap-0">
              {v.problems.map(([n, problem, fix]) => (
                <div key={n} className="grid gap-1 border-b border-panel-border/60 py-3 last:border-0 sm:grid-cols-[64px_1fr_1fr] sm:gap-5">
                  <span className="font-mono text-[11.5px] text-accent">#{n}</span>
                  <span className="text-[13.5px] leading-relaxed text-ink-dim">{problem}</span>
                  <span className="text-[13.5px] leading-relaxed text-ink">→ {fix}</span>
                </div>
              ))}
            </div>
          </Collapse>
        </Reveal>
      </section>

      {/* ── STACK ────────────────────────────────────────────────── */}
      <section className="mb-24">
        <Reveal><Eyebrow>Stack, and why each</Eyebrow></Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          {v.stack.map((s, i) => (
            <Reveal key={s.layer} delay={(i % 2) * 0.03}>
              <div className="h-full rounded-2xl border border-panel-border bg-panel p-5">
                <div className="mb-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-faint">{s.layer}</div>
                <div className="mb-1.5 font-mono text-[13px] text-accent-2">{s.choice}</div>
                <p className="text-sm leading-relaxed text-ink-dim">{s.why}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── ROADMAP ──────────────────────────────────────────────── */}
      <section className="mb-24">
        <Reveal><Eyebrow>Roadmap</Eyebrow></Reveal>
        <Reveal><H2>Eight weeks, <span className="grad-text italic">built in the open.</span></H2></Reveal>
        <Reveal delay={0.05}><Roadmap /></Reveal>
      </section>

      {/* ── GAPS ─────────────────────────────────────────────────── */}
      <section className="mb-24">
        <Reveal><Eyebrow>Known gaps, honestly</Eyebrow></Reveal>
        <ul className="grid max-w-3xl gap-3.5">
          {v.gaps.map((t, i) => (
            <Reveal key={i} delay={i * 0.03}>
              <li className="relative pl-6 text-[15px] leading-relaxed text-ink-dim">
                <span className="absolute left-0 top-[4px] text-accent">▹</span>
                <Rich text={t} />
              </li>
            </Reveal>
          ))}
        </ul>
      </section>

      <Reveal>
        <div className="mb-28 flex flex-wrap items-center justify-between gap-4">
          <Link href="/projects" data-mag className="text-sm text-ink-dim hover:text-ink">← All projects</Link>
          <Link href="/#contact" data-mag className="text-sm text-accent-2 hover:underline">Building voice AI that has to get it right? Let&apos;s talk →</Link>
        </div>
      </Reveal>
    </div>
  );
}
