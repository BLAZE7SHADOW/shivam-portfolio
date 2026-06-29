import Image from "next/image";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";
import { Eyebrow } from "@/components/Section";
import { journey, growthPath, hobbies, profile } from "@/content/data";

export default function JourneyPage() {
  return (
    <div className="pt-32">
      <Reveal><Eyebrow>My journey</Eyebrow></Reveal>
      <Reveal>
        <h1 className="mb-5 font-serif text-[clamp(40px,7vw,76px)] font-normal leading-[1.04] tracking-tight">
          Frontend to founding,
          <br />
          <span className="grad-text italic">one era at a time.</span>
        </h1>
      </Reveal>
      <Reveal delay={0.05}>
        <p className="mb-16 max-w-2xl text-lg text-ink-dim">
          I move fast across domains. Each role pulled me into a new part of the stack — voice AI, then healthcare AI — and each time I owned more of the product. Here&apos;s how I got here, and why I&apos;m built for whatever&apos;s next.
        </p>
      </Reveal>

      {/* ABOUT with portrait */}
      <Reveal delay={0.1}>
        <TiltCard className="mb-24 p-7 sm:p-8" max={2}>
          <div className="grid gap-7 sm:grid-cols-[auto_1fr] sm:items-center">
            <div className="relative mx-auto sm:mx-0">
              <div
                className="absolute -inset-1 rounded-2xl opacity-70 blur-md"
                style={{ background: "linear-gradient(135deg, #7c5cff, #22d3ee)" }}
              />
              <Image
                src="/images/portrait.jpg"
                alt={profile.name}
                width={200}
                height={250}
                className="relative h-[230px] w-[184px] rounded-2xl border border-panel-border object-cover"
              />
            </div>
            <div>
              <div className="mb-2 font-mono text-xs uppercase tracking-[0.14em] text-accent-2">
                {profile.location} · {profile.status}
              </div>
              <p className="text-[15px] leading-relaxed text-ink-dim">
                {profile.intro} I learn by building, prefer shipping over endless tutorials, and
                enjoy taking ownership beyond traditional frontend boundaries.
              </p>
            </div>
          </div>
        </TiltCard>
      </Reveal>

      {/* GROWTH PATH */}
      <section className="mb-28">
        <Reveal><Eyebrow>The path</Eyebrow></Reveal>
        <div className="relative grid gap-3">
          {growthPath.map((g, i) => (
            <Reveal key={g.label} delay={i * 0.06}>
              <div className="flex items-start gap-5">
                <div className="flex flex-col items-center">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-accent/40 bg-panel font-mono text-xs text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  {i < growthPath.length - 1 && (
                    <div className="mt-1 h-12 w-px bg-gradient-to-b from-accent/40 to-transparent" />
                  )}
                </div>
                <div className="pt-1.5">
                  <div className="text-lg font-semibold tracking-tight">{g.label}</div>
                  <div className="text-sm text-ink-dim">{g.note}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* TIMELINE / ERAS */}
      <section className="mb-28">
        <Reveal><Eyebrow>The chapters</Eyebrow></Reveal>
        <div className="grid gap-5">
          {journey.map((job, i) => (
            <Reveal key={job.company} delay={i * 0.05}>
              <TiltCard className="p-8">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <span className="font-serif text-2xl italic grad-text">{job.chapter}</span>
                  <span className="font-mono text-xs text-ink-faint">{job.period}</span>
                </div>
                <div className="mb-1 text-xl font-semibold tracking-tight">
                  {job.role} <span className="text-ink-dim">·</span>{" "}
                  <span className="text-accent-2">{job.company}</span>
                </div>
                <p className="mb-5 max-w-2xl text-[15px] text-ink-dim">{job.summary}</p>
                <ul className="grid gap-3">
                  {job.points.map((p, j) => (
                    <li key={j} className="relative pl-5 text-[14.5px] leading-relaxed text-ink-dim">
                      <span className="absolute left-0 text-accent">▹</span>
                      <span className="block pl-3">{p}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-1.5">
                  {job.stack.map((t) => (
                    <span key={t} className="rounded-md bg-white/[0.03] px-2 py-1 font-mono text-[11px] text-ink-faint">
                      {t}
                    </span>
                  ))}
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* WHAT'S NEXT */}
      <section className="mb-28">
        <Reveal>
          <TiltCard className="p-9 text-center" max={3}>
            <div className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-accent-2">What&apos;s next</div>
            <h3 className="mx-auto mb-3 max-w-2xl font-serif text-[clamp(26px,4vw,40px)] font-normal leading-tight">
              Frontend, full-stack, AI — <span className="grad-text italic">open to everything.</span>
            </h3>
            <p className="mx-auto max-w-xl text-[15px] text-ink-dim">
              I&apos;ve shipped in the voice-AI era and the healthcare-AI era. I learn by building, take ownership beyond traditional boundaries, and I&apos;m looking for the next hard problem to own end-to-end.
            </p>
          </TiltCard>
        </Reveal>
      </section>

      {/* HOBBIES */}
      <section className="mb-28">
        <Reveal><Eyebrow>Beyond the keyboard</Eyebrow></Reveal>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {hobbies.map((h, i) => (
            <Reveal key={h.title} delay={i * 0.05}>
              <div className="h-full rounded-2xl border border-panel-border bg-panel p-6 text-center">
                <div className="mb-3 text-3xl">{h.emoji}</div>
                <div className="text-sm font-semibold">{h.title}</div>
                <div className="mt-1 text-xs text-ink-dim">{h.note}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
