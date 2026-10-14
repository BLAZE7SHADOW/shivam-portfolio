"use client";

import { motion, useReducedMotion } from "framer-motion";

// Decorative voice waveform used where the project has no screenshots yet.
const BARS = 44;
const heights = Array.from({ length: BARS }, (_, i) => {
  const env = Math.sin((i / (BARS - 1)) * Math.PI);
  return 0.18 + env * (0.45 + 0.37 * Math.abs(Math.sin(i * 1.7)));
});

export default function Waveform({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className={`flex h-full items-center justify-center gap-[3px] ${className}`}>
      {heights.map((h, i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full"
          style={{
            height: `${h * 100}%`,
            background: `linear-gradient(to top, #22d3ee, ${i % 3 === 0 ? "#a78bfa" : "#f59e0b"})`,
            opacity: 0.75,
            originY: 0.5,
          }}
          animate={reduce ? undefined : { scaleY: [1, 0.35 + ((i * 7) % 5) / 10, 1] }}
          transition={reduce ? undefined : { duration: 1.1 + ((i * 3) % 7) / 10, repeat: Infinity, ease: "easeInOut", delay: (i % 9) * 0.07 }}
        />
      ))}
    </div>
  );
}
