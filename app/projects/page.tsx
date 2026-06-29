"use client";

import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";
import Gallery from "@/components/Gallery";
import { Eyebrow } from "@/components/Section";
import { projects } from "@/content/data";

export default function ProjectsPage() {
  return (
    <div className="pt-32">
      <Reveal><Eyebrow>Projects</Eyebrow></Reveal>
      <Reveal>
        <h1 className="mb-5 font-serif text-[clamp(40px,7vw,76px)] font-normal leading-[1.04] tracking-tight">
          Built, shipped, <span className="grad-text italic">in use.</span>
        </h1>
      </Reveal>
      <Reveal delay={0.05}>
        <p className="mb-20 max-w-2xl text-lg text-ink-dim">
          Production products and personal explorations. Screenshots and demos are blurred where needed for compliance.
        </p>
      </Reveal>

      <div className="grid gap-8">
        {projects.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.05}>
            <div id={p.slug} className="scroll-mt-28">
            <TiltCard className="p-7 sm:p-9" max={3}>
              <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-start">
                <div>
                  <div className="mb-3 flex items-center gap-3 font-mono text-xs">
                    <span className="text-accent">{p.year}</span>
                    <span className="text-ink-faint">·</span>
                    <span className="text-ink-dim">{p.role}</span>
                  </div>
                  <h2 className="mb-3 font-serif text-3xl">{p.title}</h2>
                  <p className="mb-5 text-[15px] leading-relaxed text-ink-dim">{p.blurb}</p>
                  <ul className="mb-6 grid gap-2">
                    {p.highlights.map((h, j) => (
                      <li key={j} className="relative pl-5 text-sm text-ink-dim">
                        <span className="absolute left-0 text-accent">▹</span>
                        <span className="block pl-3">{h}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-1.5">
                    {p.stack.map((t) => (
                      <span key={t} className="rounded-md bg-white/[0.03] px-2 py-1 font-mono text-[11px] text-ink-faint">
                        {t}
                      </span>
                    ))}
                  </div>
                  {(p.links.live || p.links.github) && (
                    <div className="mt-6 flex gap-3">
                      {p.links.live && (
                        <a href={p.links.live} target="_blank" rel="noopener" data-mag className="text-sm text-accent-2 hover:underline">Live →</a>
                      )}
                      {p.links.github && (
                        <a href={p.links.github} target="_blank" rel="noopener" data-mag className="text-sm text-ink-dim hover:text-ink">GitHub →</a>
                      )}
                    </div>
                  )}
                </div>
                <Gallery media={p.media} />
              </div>
            </TiltCard>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="h-28" />
    </div>
  );
}
