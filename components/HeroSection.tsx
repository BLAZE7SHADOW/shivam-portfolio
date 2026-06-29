"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Avatar from "./Avatar";
import Magnetic from "./Magnetic";
import { profile, marquee } from "@/content/data";
import { Download } from "lucide-react";

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Phase 1 (centered portrait) fades out as user scrolls
  const phase1Opacity = useTransform(scrollYProgress, [0, 0.38], [1, 0]);
  const phase1Scale = useTransform(scrollYProgress, [0, 0.38], [1, 0.88]);

  // Phase 2 (full hero content) fades in
  const phase2Opacity = useTransform(scrollYProgress, [0.38, 0.72], [0, 1]);
  const phase2Y = useTransform(scrollYProgress, [0.38, 0.72], [60, 0]);

  return (
    // 180vh gives enough scroll runway for both phases
    <div ref={ref} style={{ height: "180vh" }} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* ── PHASE 1 ── large centered portrait ───────────────── */}
        <motion.div
          style={{ opacity: phase1Opacity, scale: phase1Scale }}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center"
        >
          <Avatar size={148} />
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-panel-border bg-panel px-3.5 py-1.5 font-mono text-xs text-ink-dim">
              <span className="h-[7px] w-[7px] animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
              {profile.status}
            </span>
            <h1 className="mt-5 font-serif text-[clamp(36px,7vw,80px)] font-normal leading-[1.06] tracking-tight">
              {profile.name}
            </h1>
            <p className="mt-2 font-mono text-sm text-ink-dim">{profile.role}</p>
          </div>

          {/* scroll hint */}
          <div className="absolute bottom-10 flex flex-col items-center gap-2">
            <span className="font-mono text-[11px] uppercase tracking-widest text-ink-faint">scroll</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
            >
              <svg width="14" height="18" viewBox="0 0 14 18" fill="none" className="text-ink-faint">
                <path d="M7 2v14M1 10l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
          </div>
        </motion.div>

        {/* ── PHASE 2 ── full hero layout ───────────────────────── */}
        <motion.div
          style={{ opacity: phase2Opacity, y: phase2Y }}
          className="absolute inset-0 flex flex-col justify-center px-6 pt-20"
        >
          <div className="mx-auto w-full max-w-5xl">
            <div className="mb-7 flex items-center gap-5">
              <Avatar size={92} />
              <span className="inline-flex items-center gap-2 rounded-full border border-panel-border bg-panel px-3.5 py-1.5 font-mono text-xs text-ink-dim">
                <span className="h-[7px] w-[7px] animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
                {profile.status}
              </span>
            </div>

            <h1 className="mb-7 font-serif text-[clamp(32px,8vw,92px)] font-normal leading-[1.02] tracking-tight">
              {profile.name}
              <br />
              <span className="grad-text italic">{profile.tagline}</span>
            </h1>

            <p className="mb-10 max-w-2xl text-[clamp(16px,2.2vw,21px)] text-ink-dim">
              {profile.intro}
            </p>

            <div className="flex flex-wrap items-center gap-3.5">
              <Magnetic>
                <Link
                  href="/projects"
                  data-mag
                  className="inline-flex items-center gap-2 rounded-xl bg-ink px-6 py-3 text-sm font-semibold text-bg transition-shadow hover:shadow-[0_10px_40px_rgba(255,255,255,0.15)]"
                >
                  View work →
                </Link>
              </Magnetic>
              <Magnetic>
                <Link
                  href="/journey"
                  data-mag
                  className="inline-flex items-center gap-2 rounded-xl border border-panel-border bg-panel px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-white/[0.06]"
                >
                  My journey
                </Link>
              </Magnetic>
              <Magnetic>
                <a
                  href={profile.resume}
                  download
                  data-mag
                  className="inline-flex items-center gap-2 rounded-xl border border-panel-border bg-panel px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-white/[0.06]"
                >
                  <Download className="h-4 w-4" /> Resume
                </a>
              </Magnetic>
            </div>

            {/* marquee */}
            <div className="mt-16 overflow-hidden border-y border-panel-border py-4">
              <div className="flex w-max animate-scroll-x gap-12">
                {[...marquee, ...marquee].map((m, i) => (
                  <span key={i} className="whitespace-nowrap font-mono text-[13px] text-ink-faint">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
