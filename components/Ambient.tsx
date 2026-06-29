"use client";

import { useEffect, useRef } from "react";

export default function Ambient() {
  const spotRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const spot = spotRef.current;
    const move = (e: MouseEvent) => {
      if (!spot) return;
      spot.style.setProperty("--mx", e.clientX + "px");
      spot.style.setProperty("--my", e.clientY + "px");
    };
    const scroll = () => {
      const rail = railRef.current;
      if (!rail) return;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      rail.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("scroll", scroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("scroll", scroll);
    };
  }, []);

  return (
    <>
      {/* dot grid */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%)",
        }}
      />
      {/* glow orbs */}
      <div className="pointer-events-none fixed -left-20 -top-32 z-0 h-[480px] w-[480px] rounded-full bg-accent opacity-[0.16] blur-[120px]" />
      <div className="pointer-events-none fixed -right-24 bottom-[10%] z-0 h-[420px] w-[420px] rounded-full bg-accent-2 opacity-[0.16] blur-[120px]" />
      {/* spotlight */}
      <div
        ref={spotRef}
        className="pointer-events-none fixed inset-0 z-[1] opacity-50"
        style={{
          background:
            "radial-gradient(600px circle at var(--mx,50%) var(--my,0%), var(--accent-glow), transparent 45%)",
        }}
      />
      {/* scroll rail */}
      <div
        ref={railRef}
        className="fixed left-0 top-0 z-[999] h-[2px] w-0"
        style={{
          background: "linear-gradient(90deg, #7c5cff, #22d3ee)",
          boxShadow: "0 0 12px var(--accent-glow)",
        }}
      />
    </>
  );
}
