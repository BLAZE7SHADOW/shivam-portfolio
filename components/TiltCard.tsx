"use client";

import { useRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function TiltCard({
  children,
  className,
  max = 6,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--cx", px * 100 + "%");
    el.style.setProperty("--cy", py * 100 + "%");
    const rotY = (px - 0.5) * max;
    const rotX = (0.5 - py) * max;
    el.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-3px)`;
  };

  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn(
        "tilt group relative overflow-hidden rounded-2xl border border-panel-border bg-panel transition-[transform,border-color] duration-300",
        "hover:border-accent/40",
        className
      )}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(400px circle at var(--cx,50%) var(--cy,50%), rgba(124,92,255,0.12), transparent 40%)",
        }}
      />
      {children}
    </div>
  );
}
