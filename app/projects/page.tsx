"use client";

import Link from "next/link";
import posthog from "posthog-js";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";
import Gallery from "@/components/Gallery";
import { Eyebrow } from "@/components/Section";
import { HL } from "@/lib/highlight";
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
            <TiltCard className="p-8 sm:p-11" max={3}>
              <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-start">
                <div>
                  <div className="mb-3 flex flex-wrap items-center gap-3 font-mono text-xs">
                    <span className="text-accent">{p.year}</span>
                    <span className="text-ink-faint">·</span>
                    <span className="text-ink-dim">{p.role}</span>
                    {p.wip && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 text-[11px] font-medium text-amber-400">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
                        In Development
                      </span>
                    )}
                  </div>
                  <h2 className="mb-3 font-serif text-3xl">{p.title}</h2>
                  <p className="mb-5 text-[15px] leading-relaxed text-ink-dim">{p.blurb}</p>
                  <ul className="mb-6 grid gap-3.5">
                    {p.highlights.map((h, j) => (
                      <li key={j} className="relative pl-6 text-[15px] leading-relaxed text-ink-dim">
                        <span className="absolute left-0 top-[4px] text-accent">▹</span>
                        <span className="block"><HL text={h} /></span>
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
                  {(p.links.live || p.links.github || p.caseStudy) && (
                    <div className="mt-6 flex gap-4">
                      {p.caseStudy && (
                        <Link
                          href={p.caseStudy}
                          data-mag
                          className="text-sm font-medium text-accent hover:underline"
                        >Read the case study →</Link>
                      )}
                      {p.links.live && (
                        <a
                          href={p.links.live}
                          target="_blank"
                          rel="noopener"
                          data-mag
                          onClick={() => posthog.capture("project_link_clicked", { project: p.slug, link_type: "live" })}
                          className="text-sm text-accent-2 hover:underline"
                        >Live →</a>
                      )}
                      {p.links.github && (
                        <a
                          href={p.links.github}
                          target="_blank"
                          rel="noopener"
                          data-mag
                          onClick={() => posthog.capture("project_link_clicked", { project: p.slug, link_type: "github" })}
                          className="text-sm text-ink-dim hover:text-ink"
                        >GitHub →</a>
                      )}
                    </div>
                  )}
                </div>
                <div className="lg:sticky lg:top-28">
                  {p.media.length > 0 ? (
                    <Gallery media={p.media} />
                  ) : (
                    <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-xl border border-panel-border bg-[radial-gradient(ellipse_at_top_left,rgba(245,158,11,0.10),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(34,211,238,0.08),transparent_55%)]">
                      <span className="font-serif text-3xl italic text-ink-dim/80">{p.title.split(" ")[0]}</span>
                      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
                        {p.wip ? "In development · demo coming soon" : "Screenshots coming soon"}
                      </span>
                    </div>
                  )}
                </div>
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
