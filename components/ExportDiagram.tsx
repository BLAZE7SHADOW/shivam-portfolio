"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  Layers, Cpu, Music2, Package, Download,
  Server, ShieldCheck, Zap, Database, Link2,
  Monitor, Cloud,
} from "lucide-react";

// ─── Config ──────────────────────────────────────────────────────────────────

const B = "#22d3ee"; // browser path — cyan (accent-2)
const C = "#f59e0b"; // cloud path  — amber (accent)

// ─── Data ────────────────────────────────────────────────────────────────────

interface Step {
  Icon: React.ElementType;
  label: string;
  tech: string;
  desc?: string;
  gates?: string[];
}

const BROWSER: Step[] = [
  {
    Icon: Layers,
    label: "Frame Renderer",
    tech: "shared style.ts · same as editor preview",
    desc: "Each frame is painted to an off-screen canvas using the exact same function the editor preview uses. WYSIWYG is a mathematical consequence, not a design goal.",
  },
  {
    Icon: Cpu,
    label: "VideoEncoder — WebCodecs",
    tech: "GPU-accelerated H.264 · frame-by-frame",
    desc: "Each frame's ImageData is pushed into a VideoEncoder. WebCodecs uses the device's hardware encoder — no plugin, no server, no round-trip.",
  },
  {
    Icon: Music2,
    label: "OfflineAudioContext",
    tech: "Web Audio API · faster than real-time",
    desc: "All audio tracks are mixed into a precise AudioBuffer — no timing drift, no desync risk from real-time mixing.",
  },
  {
    Icon: Package,
    label: "Mediabunny — MP4 Mux",
    tech: "video chunks + AudioBuffer → MP4 container",
    desc: "Encoded chunks and audio are muxed into an MP4. The finished blob downloads directly to the user's device. No server.",
  },
];

const CLOUD: Step[] = [
  {
    Icon: Server,
    label: "Vercel Serverless",
    tech: "/api/render · Node.js",
    desc: "Client posts project state + device ID. Four gates run in order — nothing reaches Lambda until all pass.",
  },
  {
    Icon: ShieldCheck,
    label: "4-Gate Auth Guard",
    tech: "JWT → device → quota → Lambda",
    gates: [
      "JWT verified via Supabase admin",
      "Device cookie checked — anon only",
      "Monthly render count vs. quota",
      "Lambda called — only if all pass",
    ],
  },
  {
    Icon: Zap,
    label: "renderMediaOnLambda()",
    tech: "@remotion/lambda-client · 2 GB · 120 s",
    desc: "Pre-deployed Lambda renders the same MotionComposition in headless Node.js — same composition, AWS infrastructure.",
  },
  {
    Icon: Database,
    label: "S3 — MP4 written",
    tech: "Remotion bucket · signed URL returned",
    desc: "Lambda writes the MP4 to S3. The Vercel function polls getRenderProgress() until done, then returns the URL to the client.",
  },
];

// ─── Connector ───────────────────────────────────────────────────────────────

function Connector({ color, pulseClass }: { color: string; pulseClass: string }) {
  return (
    <div className="flex justify-center my-0">
      <div
        className="relative h-6 w-px overflow-hidden rounded-full"
        style={{ background: `${color}22` }}
      >
        <div
          className={`absolute left-1/2 -translate-x-1/2 h-2.5 w-1.5 rounded-full ${pulseClass}`}
          style={{ background: color, boxShadow: `0 0 6px ${color}`, top: -10 }}
        />
      </div>
    </div>
  );
}

// ─── Step card ───────────────────────────────────────────────────────────────

function StepCard({
  step,
  color,
  gateColor,
}: {
  step: Step;
  color: string;
  gateColor: string;
}) {
  const { Icon, label, tech, desc, gates } = step;
  return (
    <div
      className="ed-node rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.025)] p-4 sm:p-5"
      style={{ opacity: 0 }}
    >
      <div className="flex items-start gap-3">
        <div
          className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl"
          style={{ background: `${color}18`, border: `1px solid ${color}30` }}
        >
          <Icon size={15} strokeWidth={1.7} style={{ color }} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-0.5 text-[13px] font-semibold leading-snug text-[#f4f4f6]">
            {label}
          </div>
          <div className="mb-2.5 font-mono text-[10px] leading-none" style={{ color: `${color}99` }}>
            {tech}
          </div>
          {desc && (
            <p className="text-[12.5px] leading-relaxed text-[#a1a1ad]">{desc}</p>
          )}
          {gates && (
            <div className="flex flex-col gap-1.5">
              {gates.map((g, i) => (
                <div key={i} className="flex items-baseline gap-2">
                  <span
                    className="flex-shrink-0 rounded px-1.5 font-mono text-[9px] leading-[16px]"
                    style={{
                      color: gateColor,
                      background: `${gateColor}18`,
                      border: `1px solid ${gateColor}30`,
                    }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-[12px] leading-relaxed text-[#a1a1ad]">{g}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Outcome node ────────────────────────────────────────────────────────────

function OutcomeNode({
  Icon,
  label,
  badge,
  color,
}: {
  Icon: React.ElementType;
  label: string;
  badge: string;
  color: string;
}) {
  return (
    <div
      className="ed-node rounded-2xl p-4 sm:p-5"
      style={{
        background: `${color}12`,
        border: `1px solid ${color}35`,
        opacity: 0,
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl"
          style={{ background: color }}
        >
          <Icon size={15} strokeWidth={2} className="text-black" />
        </div>
        <div>
          <div className="mb-1 text-[13px] font-bold leading-snug" style={{ color }}>
            {label}
          </div>
          <div className="font-mono text-[10.5px] leading-relaxed text-[#6b6b78]">{badge}</div>
        </div>
      </div>
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

export default function ExportDiagram() {
  const rootRef = useRef<HTMLDivElement>(null);
  const entryRef = useRef<HTMLDivElement>(null);
  const bColRef = useRef<HTMLDivElement>(null);
  const cColRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const svgWrapRef = useRef<HTMLDivElement>(null);

  // ── Draw SVG Y-fork ──────────────────────────────────────────────────────
  useEffect(() => {
    function draw() {
      const svg = svgRef.current;
      const wrap = svgWrapRef.current;
      const entry = entryRef.current;
      const bCol = bColRef.current;
      const cCol = cColRef.current;
      if (!svg || !wrap || !entry || !bCol || !cCol) return;

      const svgR = wrap.getBoundingClientRect();
      if (svgR.width === 0) return;

      const eR = entry.getBoundingClientRect();
      const bR = bCol.getBoundingClientRect();
      const cR = cCol.getBoundingClientRect();

      const ex = eR.left + eR.width / 2 - svgR.left;
      const bx = bR.left + bR.width / 2 - svgR.left;
      const cx = cR.left + cR.width / 2 - svgR.left;
      const h = svgR.height;
      const mid = h * 0.52;

      // Clear previous lines
      while (svg.firstChild) svg.removeChild(svg.firstChild);

      const line = (x1: number, y1: number, x2: number, y2: number) => {
        const el = document.createElementNS("http://www.w3.org/2000/svg", "line");
        el.setAttribute("x1", String(x1));
        el.setAttribute("y1", String(y1));
        el.setAttribute("x2", String(x2));
        el.setAttribute("y2", String(y2));
        el.setAttribute("stroke", "rgba(255,255,255,0.07)");
        el.setAttribute("stroke-width", "1.5");
        el.setAttribute("stroke-linecap", "round");
        svg.appendChild(el);
      };

      line(ex, 0, ex, mid);
      line(bx, mid, cx, mid);
      line(bx, mid, bx, h);
      line(cx, mid, cx, h);
    }

    draw();

    const ro = new ResizeObserver(draw);
    if (rootRef.current) ro.observe(rootRef.current);
    return () => ro.disconnect();
  }, []);

  // ── GSAP animations ─────────────────────────────────────────────────────
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      // Entrance: stagger nodes in when scrolled into view
      const tl = gsap.timeline({ paused: true });
      tl.to(".ed-node", {
        y: 0,
        opacity: 1,
        stagger: 0.065,
        duration: 0.45,
        ease: "power2.out",
      });

      gsap.set(".ed-node", { y: 16, opacity: 0 });

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            tl.play();
            obs.disconnect();
          }
        },
        { threshold: 0.08 }
      );
      obs.observe(root);

      // Pulse: browser path (cyan)
      root.querySelectorAll(".ed-b-pulse").forEach((el, i) => {
        const tl = gsap.timeline({ repeat: -1, delay: i * 0.42 });
        tl.set(el, { y: -10, opacity: 0 })
          .to(el, { opacity: 0.9, duration: 0.12 })
          .to(el, { y: 16, opacity: 0.9, duration: 1.5, ease: "none" }, "<")
          .to(el, { opacity: 0, duration: 0.12 }, "-=0.15")
          .set(el, { y: -10 });
      });

      // Pulse: cloud path (amber) — offset from browser
      root.querySelectorAll(".ed-c-pulse").forEach((el, i) => {
        const tl = gsap.timeline({ repeat: -1, delay: 0.21 + i * 0.42 });
        tl.set(el, { y: -10, opacity: 0 })
          .to(el, { opacity: 0.9, duration: 0.12 })
          .to(el, { y: 16, opacity: 0.9, duration: 1.5, ease: "none" }, "<")
          .to(el, { opacity: 0, duration: 0.12 }, "-=0.15")
          .set(el, { y: -10 });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="mt-10 mb-2">
      {/* ── Entry node ── */}
      <div className="flex justify-center">
        <div
          ref={entryRef}
          className="ed-node flex items-center gap-3 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.025)] px-5 py-3.5"
          style={{ opacity: 0, boxShadow: "0 0 0 4px rgba(34,211,238,0.06)" }}
        >
          <div
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
            style={{ background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.25)" }}
          >
            <Monitor size={16} strokeWidth={1.6} className="text-[#22d3ee]" />
          </div>
          <div>
            <div className="text-[13.5px] font-semibold text-[#f4f4f6]">Export Dialog</div>
            <div className="font-mono text-[10px] text-[#6b6b78]">Browser tab · Cloud Render tab</div>
          </div>
        </div>
      </div>

      {/* ── SVG Y-fork (hidden on mobile, where grid stacks) ── */}
      <div ref={svgWrapRef} className="hidden h-12 sm:block">
        <svg
          ref={svgRef}
          className="h-full w-full overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        />
      </div>
      {/* Mobile: simple gap */}
      <div className="h-5 sm:hidden" />

      {/* ── Two columns ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Browser path */}
        <div ref={bColRef} className="flex flex-col gap-0">
          {/* Path label */}
          <div className="ed-node mb-3 flex justify-center" style={{ opacity: 0 }}>
            <div
              className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.07em]"
              style={{
                color: B,
                background: `${B}14`,
                border: `1px solid ${B}30`,
              }}
            >
              <Monitor size={11} strokeWidth={1.8} />
              Browser Export
            </div>
          </div>

          {BROWSER.map((step, i) => (
            <div key={step.label}>
              <StepCard step={step} color={B} gateColor={B} />
              {i < BROWSER.length - 1 && (
                <Connector color={B} pulseClass="ed-b-pulse" />
              )}
            </div>
          ))}

          <Connector color={B} pulseClass="ed-b-pulse" />

          <OutcomeNode
            Icon={Download}
            label="MP4 downloaded"
            badge={"Free · Unlimited · No server\nChrome & Edge only · GPU-accelerated"}
            color={B}
          />
        </div>

        {/* Cloud path */}
        <div ref={cColRef} className="flex flex-col gap-0">
          {/* Path label */}
          <div className="ed-node mb-3 flex justify-center" style={{ opacity: 0 }}>
            <div
              className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.07em]"
              style={{
                color: C,
                background: `${C}14`,
                border: `1px solid ${C}30`,
              }}
            >
              <Cloud size={11} strokeWidth={1.8} />
              Cloud Render
            </div>
          </div>

          {CLOUD.map((step, i) => (
            <div key={step.label}>
              <StepCard step={step} color={C} gateColor={C} />
              {i < CLOUD.length - 1 && (
                <Connector color={C} pulseClass="ed-c-pulse" />
              )}
            </div>
          ))}

          <Connector color={C} pulseClass="ed-c-pulse" />

          <OutcomeNode
            Icon={Link2}
            label="Download URL returned"
            badge={"Any device · Any browser · Quota-based\nAuthenticated · 1080p · No local CPU"}
            color={C}
          />
        </div>
      </div>

      {/* ── Footnote ── */}
      <p className="mt-8 text-center font-mono text-[11px] leading-relaxed text-[#6b6b78]">
        Both paths render the same{" "}
        <span className="text-[#a1a1ad]">MotionComposition</span> component —
        the browser encodes frames locally, Lambda renders them in headless Node.js.
      </p>
    </div>
  );
}
