"use client";

import { useRef, useEffect, ReactNode } from "react";

export default function Reveal({
  children,
  delay = 0,
  className,
  y = 28,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion: skip animation entirely
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -60px 0px", threshold: 0 }
    );

    // Hide after first paint (SSR HTML stays visible, only hides on client)
    requestAnimationFrame(() => {
      el.style.opacity = "0";
      el.style.transform = `translateY(${y}px)`;
      el.style.transition = `opacity 0.55s ${delay}s cubic-bezier(0.2,0.8,0.2,1), transform 0.55s ${delay}s cubic-bezier(0.2,0.8,0.2,1)`;
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [delay, y]);

  return (
    <div ref={ref} className={className} style={{ willChange: "opacity, transform" }}>
      {children}
    </div>
  );
}
