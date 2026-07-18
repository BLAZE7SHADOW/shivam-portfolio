import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import Magnetic from "@/components/Magnetic";
import { HL } from "@/lib/highlight";
import TiltCard from "@/components/TiltCard";
import Avatar from "@/components/Avatar";
import ContactForm from "@/components/ContactForm";
import { Eyebrow, SectionHeading } from "@/components/Section";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import CopyEmail from "@/components/CopyEmail";
import ResumeButton from "@/components/ResumeButton";
import {
  profile,
  stats,
  marquee,
  journey,
  projects,
  skills,
} from "@/content/data";


export default function Home() {
  const featured = projects.filter((p) => p.featured);
  const wip = projects.find((p) => p.wip);

  return (
    <>
      {/* HERO */}
      <section className="flex min-h-screen flex-col justify-center pt-20">
        <Reveal>
          <div className="mb-7 flex items-center gap-5">
            <Avatar size={92} />
            <span className="inline-flex items-center gap-2 rounded-full border border-panel-border bg-panel px-3.5 py-1.5 font-mono text-xs text-ink-dim">
              <span className="h-[7px] w-[7px] animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
              {profile.status}
            </span>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mb-7 font-serif text-[clamp(32px,7vw,80px)] font-normal leading-[1.05] tracking-tight">
            {profile.name}
            <br />
            <span className="grad-text italic">{profile.tagline}</span>
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mb-9 max-w-2xl text-[clamp(16px,2vw,19px)] text-ink-dim">
            {profile.intro}
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="flex flex-wrap items-center gap-3.5">
            <Magnetic>
              <Link href="/projects" data-mag className="inline-flex items-center gap-2 rounded-xl bg-ink px-6 py-3 text-sm font-semibold text-bg transition-shadow hover:shadow-[0_10px_40px_rgba(255,255,255,0.15)]">
                View work →
              </Link>
            </Magnetic>
            <Magnetic>
              <Link href="/journey" data-mag className="inline-flex items-center gap-2 rounded-xl border border-panel-border bg-panel px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-white/[0.06]">
                My journey
              </Link>
            </Magnetic>
            <Magnetic>
              <ResumeButton href={profile.resume} variant="hero" />
            </Magnetic>
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-14 overflow-hidden border-y border-panel-border py-4">
            <div className="flex w-max animate-scroll-x gap-12">
              {[...marquee, ...marquee].map((m, i) => (
                <span key={i} className="whitespace-nowrap font-mono text-[13px] text-ink-faint">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* WORK */}
      <section id="work" className="py-28">
        <Reveal><Eyebrow>Experience</Eyebrow></Reveal>
        <Reveal><SectionHeading title="Where I've shipped." sub="Two companies, both times the only frontend engineer, both times the work went to production and converted customers." /></Reveal>

        <Reveal>
          <div className="mb-14 grid grid-cols-2 gap-5 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="font-serif text-[clamp(34px,5vw,52px)] leading-none grad-text">{s.num}</div>
                <div className="mt-2.5 text-[13px] text-ink-dim">{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="grid gap-5">
          {journey.map((job, i) => (
            <Reveal key={job.company} delay={i * 0.05}>
              <TiltCard className="p-8 sm:p-9">
                <div className="mb-2 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-xl font-semibold tracking-tight">{job.role}</div>
                    <div className="mt-1 text-[15px] font-medium text-accent-2">
                      {job.company} · {job.place}
                    </div>
                    <span className="mt-3.5 inline-block rounded-full border border-panel-border px-2.5 py-0.5 font-mono text-[11px] text-ink-dim">
                      {job.tag}
                    </span>
                  </div>
                  <div className="whitespace-nowrap pt-1.5 font-mono text-xs text-ink-faint">
                    {job.period}
                  </div>
                </div>
                <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-dim">{job.summary}</p>
                <ul className="mt-5 grid gap-3">
                  {job.topPoints.map((p, j) => (
                    <li key={j} className="relative pl-6 text-[15px] leading-relaxed text-ink-dim">
                      <span className="absolute left-0 top-[3px] text-accent">▹</span>
                      <span className="block"><HL text={p} /></span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-1.5">
                    {job.stack.slice(0, 7).map((t) => (
                      <span key={t} className="rounded-md bg-white/[0.03] px-2 py-1 font-mono text-[11px] text-ink-faint">
                        {t}
                      </span>
                    ))}
                  </div>
                  <Link href="/journey" data-mag className="whitespace-nowrap text-sm text-accent-2 hover:underline">
                    Full story →
                  </Link>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PROJECTS PREVIEW */}
      <section className="py-28">
        <Reveal><Eyebrow>Selected work</Eyebrow></Reveal>
        <Reveal>
          <div className="mb-14 flex items-end justify-between gap-4">
            <h2 className="font-serif text-[clamp(32px,5vw,52px)] font-normal tracking-tight">
              Things I built.
            </h2>
            <Link href="/projects" data-mag className="whitespace-nowrap text-sm text-ink-dim hover:text-ink">
              All projects →
            </Link>
          </div>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2">
          {featured.map((p, i) => {
            const cover = p.media.find((m) => m.type === "image");
            return (
            <Reveal key={p.slug} delay={i * 0.05}>
              <TiltCard className="flex h-full flex-col transition-colors hover:border-accent/40">
                <Link href={`/projects#${p.slug}`} className="block">
                  {cover ? (
                    <div className="relative aspect-[16/9] w-full border-b border-panel-border">
                      <Image
                        src={cover.src}
                        alt={cover.caption || p.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover object-top"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-bg/60 to-transparent" />
                    </div>
                  ) : (
                    <div className="relative flex aspect-[16/9] w-full items-center justify-center border-b border-panel-border bg-[radial-gradient(ellipse_at_top_left,rgba(245,158,11,0.12),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(34,211,238,0.10),transparent_55%)]">
                      <span className="font-serif text-3xl italic text-ink-dim/80">{p.title.split(" ")[0]}</span>
                    </div>
                  )}
                </Link>
                <div className="flex flex-1 flex-col p-7">
                  <div className="mb-3 font-mono text-xs text-accent">{p.year}</div>
                  <Link href={`/projects#${p.slug}`} className="block">
                    <h3 className="mb-2.5 text-lg font-semibold tracking-tight">{p.title}</h3>
                    <p className="text-sm leading-relaxed text-ink-dim">{p.blurb}</p>
                  </Link>
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
                    {p.stack.slice(0, 4).map((t) => (
                      <span key={t} className="rounded-md bg-white/[0.03] px-2 py-1 font-mono text-[11px] text-ink-faint">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
                    <Link href={`/projects#${p.slug}`} data-mag className="text-accent-2 hover:underline">
                      View details →
                    </Link>
                    {p.links.live && (
                      <a
                        href={p.links.live}
                        target="_blank"
                        rel="noopener"
                        data-mag
                        className="text-ink-dim hover:text-ink"
                      >Live →</a>
                    )}
                    {p.links.github && (
                      <a
                        href={p.links.github}
                        target="_blank"
                        rel="noopener"
                        data-mag
                        className="text-ink-dim hover:text-ink"
                      >GitHub →</a>
                    )}
                  </div>
                </div>
              </TiltCard>
            </Reveal>
            );
          })}
        </div>

        {/* BUILDING NOW */}
        {wip && (
          <Reveal>
            <TiltCard className="mt-5 grid overflow-hidden transition-colors hover:border-accent/40 sm:grid-cols-[1fr_1.1fr]" max={3}>
              <div className="flex flex-col justify-center p-7 sm:p-8">
                <div className="mb-3 flex flex-wrap items-center gap-3 font-mono text-xs">
                  <span className="text-accent">{wip.year}</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 text-[11px] font-medium text-amber-400">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
                    Building now
                  </span>
                </div>
                <Link href={wip.caseStudy || `/projects#${wip.slug}`} className="block">
                  <h3 className="mb-2.5 text-lg font-semibold tracking-tight">{wip.title}</h3>
                  <p className="text-sm leading-relaxed text-ink-dim">{wip.blurb}</p>
                </Link>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
                  <Link href={wip.caseStudy || `/projects#${wip.slug}`} data-mag className="text-accent-2 hover:underline">
                    {wip.caseStudy ? "Read the case study →" : "View details →"}
                  </Link>
                  {wip.links.live && (
                    <a
                      href={wip.links.live}
                      target="_blank"
                      rel="noopener"
                      data-mag
                      className="text-ink-dim hover:text-ink"
                    >Live →</a>
                  )}
                  {wip.links.github && (
                    <a
                      href={wip.links.github}
                      target="_blank"
                      rel="noopener"
                      data-mag
                      className="text-ink-dim hover:text-ink"
                    >GitHub →</a>
                  )}
                </div>
              </div>
              {(() => {
                const wipCover = wip.media.find((m) => m.type === "image");
                return wipCover ? (
                  <Link
                    href={wip.caseStudy || `/projects#${wip.slug}`}
                    className="relative block min-h-[220px] border-t border-panel-border sm:border-l sm:border-t-0"
                  >
                    <Image
                      src={wipCover.src}
                      alt={wipCover.caption || wip.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 55vw"
                      className="object-cover object-left-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-bg/40 to-transparent" />
                  </Link>
                ) : null;
              })()}
            </TiltCard>
          </Reveal>
        )}
      </section>

      {/* SKILLS */}
      <section className="py-28">
        <Reveal><Eyebrow>Toolkit</Eyebrow></Reveal>
        <Reveal><SectionHeading title="What I work with." /></Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((s, i) => (
            <Reveal key={s.group} delay={i * 0.04}>
              <div className="h-full rounded-2xl border border-panel-border bg-panel p-6">
                <h4 className="mb-4 font-mono text-xs uppercase tracking-[0.1em] text-accent-2">{s.group}</h4>
                <div className="flex flex-wrap gap-2">
                  {s.items.map((it) => (
                    <span
                      key={it}
                      className="rounded-lg border border-panel-border px-3 py-1.5 text-[13px] text-ink-dim transition-all hover:-translate-y-0.5 hover:border-accent hover:text-ink"
                    >
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-28 text-center">
        <Reveal><Eyebrow center>Contact</Eyebrow></Reveal>
        <Reveal>
          <h2 className="font-serif text-[clamp(40px,7vw,80px)] font-normal tracking-tight">
            Let&apos;s build something <span className="grad-text italic">real.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.05}>
          <ContactForm />
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <a href={profile.socials.github} target="_blank" rel="noopener" data-mag className="inline-flex items-center gap-2 rounded-full border border-panel-border px-4.5 py-2.5 text-sm text-ink-dim transition-all hover:-translate-y-0.5 hover:border-accent hover:text-ink"><Github className="h-4 w-4" /> GitHub</a>
            <a href={profile.socials.linkedin} target="_blank" rel="noopener" data-mag className="inline-flex items-center gap-2 rounded-full border border-panel-border px-4.5 py-2.5 text-sm text-ink-dim transition-all hover:-translate-y-0.5 hover:border-accent hover:text-ink"><Linkedin className="h-4 w-4" /> LinkedIn</a>
            <a href={profile.socials.twitter} target="_blank" rel="noopener" data-mag className="inline-flex items-center gap-2 rounded-full border border-panel-border px-4.5 py-2.5 text-sm text-ink-dim transition-all hover:-translate-y-0.5 hover:border-accent hover:text-ink"><Twitter className="h-4 w-4" /> Twitter / X</a>
            <a href={`mailto:${profile.email}`} data-mag className="inline-flex items-center gap-2 rounded-full border border-panel-border px-4.5 py-2.5 text-sm text-ink-dim transition-all hover:-translate-y-0.5 hover:border-accent hover:text-ink"><Mail className="h-4 w-4" /> Mail</a>
            <CopyEmail email={profile.email} />
            <ResumeButton href={profile.resume} variant="contact" />
          </div>
        </Reveal>
      </section>
    </>
  );
}
