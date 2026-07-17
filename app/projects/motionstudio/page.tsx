import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";
import Gallery from "@/components/Gallery";
import ExportDiagram from "@/components/ExportDiagram";
import { Eyebrow } from "@/components/Section";
import { HL } from "@/lib/highlight";
import { motionstudio as ms } from "@/content/motionstudio";

export const metadata: Metadata = {
  title: "MotionStudio — a Remotion video editor, built in public",
  description:
    "Case study of MotionStudio: a browser-based programmatic video editor built on Remotion, with dual export paths (browser WebCodecs + AWS Lambda cloud render) and full auth. Architecture, engineering decisions, and the bugs along the way.",
  alternates: { canonical: "https://www.shivamgovindrao.com/projects/motionstudio" },
};

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-panel-border bg-black/40 p-4 font-mono text-[12.5px] leading-relaxed text-ink-dim">
      {code}
    </pre>
  );
}

export default function MotionStudioPage() {
  return (
    <div className="pt-32">
      {/* HERO */}
      <Reveal><Eyebrow>Case study · Building in public</Eyebrow></Reveal>
      <Reveal>
        <h1 className="mb-5 font-serif text-[clamp(40px,7vw,72px)] font-normal leading-[1.05] tracking-tight">
          MotionStudio<span className="grad-text">.</span>
          <br />
          <span className="grad-text italic">{ms.tagline}</span>
        </h1>
      </Reveal>
      <Reveal delay={0.05}>
        <div className="mb-5 flex flex-wrap items-center gap-3 font-mono text-xs">
          <span className="text-accent">{ms.year}</span>
          <span className="text-ink-faint">·</span>
          <span className="text-ink-dim">{ms.role}</span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 text-[11px] font-medium text-amber-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
            {ms.status}
          </span>
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="mb-14 max-w-2xl text-lg text-ink-dim">{ms.intro}</p>
      </Reveal>

      {/* QUICK FACTS */}
      <Reveal>
        <div className="mb-24 grid grid-cols-2 gap-5 sm:grid-cols-4">
          {ms.facts.map((f) => (
            <div key={f.label}>
              <div className="font-serif text-[clamp(30px,4.5vw,44px)] leading-none grad-text">{f.num}</div>
              <div className="mt-2.5 text-[13px] text-ink-dim">{f.label}</div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* DEMO MEDIA */}
      <section className="mb-24">
        <Reveal><Eyebrow>See it</Eyebrow></Reveal>
        <Reveal>
          {ms.media.length > 0 ? (
            <Gallery media={ms.media} />
          ) : (
            <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-2xl border border-panel-border bg-[radial-gradient(ellipse_at_top_left,rgba(245,158,11,0.10),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(34,211,238,0.08),transparent_55%)]">
              <span className="font-serif text-3xl italic text-ink-dim/80">MotionStudio</span>
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
                Demo video & screenshots landing here soon
              </span>
            </div>
          )}
        </Reveal>
      </section>

      {/* WHY REMOTION */}
      <section className="mb-24">
        <Reveal><Eyebrow>Remotion</Eyebrow></Reveal>
        <Reveal>
          <h2 className="mb-4 font-serif text-[clamp(28px,4.5vw,44px)] font-normal tracking-tight">
            {ms.remotion.heading}
          </h2>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mb-8 max-w-2xl text-[15px] leading-relaxed text-ink-dim">{ms.remotion.body}</p>
        </Reveal>
        <div className="grid gap-4">
          {ms.remotion.points.map((p, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <div className="rounded-2xl border border-panel-border bg-panel p-5">
                <p className="text-[15px] leading-relaxed text-ink-dim"><HL text={p} /></p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* EXPORT */}
      <section className="mb-24">
        <Reveal><Eyebrow>Export</Eyebrow></Reveal>
        <Reveal>
          <h2 className="mb-4 font-serif text-[clamp(28px,4.5vw,44px)] font-normal tracking-tight">
            {ms.export.heading}
          </h2>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mb-8 max-w-2xl text-[15px] leading-relaxed text-ink-dim">{ms.export.story}</p>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2">
          {ms.export.paths.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.05}>
              <TiltCard className="h-full p-6 sm:p-7" max={2}>
                <h3 className="mb-1 text-lg font-semibold tracking-tight">{p.name}</h3>
                <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-2">{p.subtitle}</div>
                <p className="mb-3 text-sm leading-relaxed text-ink-dim">{p.how}</p>
                <p className="mb-3 text-sm leading-relaxed text-ink-dim">{p.why}</p>
                <p className="text-[13px] leading-relaxed text-ink-faint"><span className="text-amber-400">Limits: </span>{p.limits}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1}>
          <ExportDiagram />
        </Reveal>
      </section>

      {/* AUTH */}
      <section className="mb-24">
        <Reveal><Eyebrow>Auth & infrastructure</Eyebrow></Reveal>
        <Reveal>
          <h2 className="mb-4 font-serif text-[clamp(28px,4.5vw,44px)] font-normal tracking-tight">
            {ms.auth.heading}
          </h2>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mb-8 max-w-2xl text-[15px] leading-relaxed text-ink-dim">{ms.auth.body}</p>
        </Reveal>
        <div className="grid gap-5">
          {[
            { title: "Preventing guest abuse", body: ms.auth.guestAbuse },
            { title: "The API layer", body: ms.auth.apiLayer },
            { title: "Account isolation", body: ms.auth.accountIsolation },
          ].map((s, i) => (
            <Reveal key={s.title} delay={i * 0.03}>
              <TiltCard className="p-6 sm:p-7" max={2}>
                <h3 className="mb-3 text-lg font-semibold tracking-tight">{s.title}</h3>
                <p className="max-w-3xl text-[15px] leading-relaxed text-ink-dim">{s.body}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* STACK */}
      <section className="mb-24">
        <Reveal><Eyebrow>Tech stack — and why each</Eyebrow></Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          {ms.stack.map((s, i) => (
            <Reveal key={s.name} delay={i * 0.03}>
              <div className="h-full rounded-2xl border border-panel-border bg-panel p-5">
                <div className="mb-1.5 font-mono text-[13px] text-accent-2">{s.name}</div>
                <p className="text-sm leading-relaxed text-ink-dim">{s.why}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ARCHITECTURE */}
      <section className="mb-24">
        <Reveal><Eyebrow>Architecture</Eyebrow></Reveal>
        <Reveal>
          <h2 className="mb-6 font-serif text-[clamp(28px,4.5vw,44px)] font-normal tracking-tight">
            {ms.architecture.heading}
          </h2>
        </Reveal>
        <Reveal delay={0.05}>
          <div className="mb-6"><CodeBlock code={ms.architecture.diagram} /></div>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mb-10 max-w-3xl text-[15px] leading-relaxed text-ink-dim">{ms.architecture.rule}</p>
        </Reveal>
        <Reveal>
          <h3 className="mb-4 text-lg font-semibold tracking-tight">{ms.architecture.movesTitle}</h3>
        </Reveal>
        <Reveal delay={0.05}>
          <div className="mb-4"><CodeBlock code={ms.architecture.moves} /></div>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="max-w-3xl text-[15px] leading-relaxed text-ink-dim">{ms.architecture.movesWhy}</p>
        </Reveal>
      </section>

      {/* ENGINES */}
      <section className="mb-24">
        <Reveal><Eyebrow>The seven engines</Eyebrow></Reveal>
        <div className="mb-6 grid gap-3">
          {ms.engines.map((e, i) => (
            <Reveal key={e.name} delay={i * 0.03}>
              <div className="grid gap-2 rounded-xl border border-panel-border bg-panel p-4 sm:grid-cols-[130px_1fr_auto] sm:items-baseline sm:gap-4">
                <span className="font-mono text-[13px] text-accent">{e.name}</span>
                <span className="text-sm leading-relaxed text-ink-dim">{e.owns}</span>
                <span className="font-mono text-[11px] text-ink-faint">{e.note}</span>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="max-w-3xl text-[15px] leading-relaxed text-ink-dim">{ms.enginesWhy}</p>
        </Reveal>
      </section>

      {/* CORE SYSTEMS */}
      <section className="mb-24">
        <Reveal><Eyebrow>Core systems & decisions</Eyebrow></Reveal>
        <div className="grid gap-5">
          {ms.systems.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.03}>
              <TiltCard className="p-6 sm:p-7" max={2}>
                <h3 className="mb-3 text-lg font-semibold tracking-tight">{s.title}</h3>
                <p className="mb-4 max-w-3xl text-[15px] leading-relaxed text-ink-dim">{s.body}</p>
                {s.code && <CodeBlock code={s.code} />}
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PROBLEMS & FIXES */}
      <section className="mb-24">
        <Reveal><Eyebrow>Bugs that taught me something</Eyebrow></Reveal>
        <Reveal>
          <h2 className="mb-8 font-serif text-[clamp(28px,4.5vw,44px)] font-normal tracking-tight">
            Problems faced, <span className="grad-text italic">and how they fell.</span>
          </h2>
        </Reveal>
        <div className="grid gap-4">
          {ms.problems.map((p, i) => (
            <Reveal key={i} delay={i * 0.03}>
              <div className="rounded-2xl border border-panel-border bg-panel p-5 sm:p-6">
                <div className="mb-2 flex items-start gap-3">
                  <span className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.14em] text-amber-400">Bug</span>
                  <p className="text-[15px] leading-relaxed text-ink-dim">{p.problem}</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-2">Fix</span>
                  <p className="text-[15px] leading-relaxed text-ink">{p.fix}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PAYOFFS */}
      <section className="mb-24">
        <Reveal><Eyebrow>What each decision bought</Eyebrow></Reveal>
        <div className="grid gap-3">
          {ms.payoffs.map((p, i) => (
            <Reveal key={p.decision} delay={i * 0.02}>
              <div className="grid gap-1.5 rounded-xl border border-panel-border bg-panel p-4 sm:grid-cols-[260px_1fr] sm:gap-4">
                <span className="text-sm font-semibold text-ink">{p.decision}</span>
                <span className="text-sm leading-relaxed text-ink-dim">{p.payoff}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* TRADE-OFFS */}
      <section className="mb-24">
        <Reveal><Eyebrow>Trade-offs, honestly</Eyebrow></Reveal>
        <ul className="grid max-w-3xl gap-3.5">
          {ms.tradeoffs.map((t, i) => (
            <Reveal key={i} delay={i * 0.03}>
              <li className="relative pl-6 text-[15px] leading-relaxed text-ink-dim">
                <span className="absolute left-0 top-[4px] text-accent">▹</span>
                {t}
              </li>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* LESSONS */}
      <section className="mb-28">
        <Reveal><Eyebrow>Lessons</Eyebrow></Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          {ms.lessons.map((l, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <TiltCard className="h-full p-6" max={2}>
                <div className="mb-2 font-serif text-2xl italic grad-text">{String(i + 1).padStart(2, "0")}</div>
                <p className="text-[15px] leading-relaxed text-ink-dim">{l}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FOOTER NAV */}
      <Reveal>
        <div className="mb-28 flex flex-wrap items-center justify-between gap-4">
          <Link href="/projects" data-mag className="text-sm text-ink-dim hover:text-ink">
            ← All projects
          </Link>
          <Link href="/#contact" data-mag className="text-sm text-accent-2 hover:underline">
            Building something like this? Let&apos;s talk →
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
