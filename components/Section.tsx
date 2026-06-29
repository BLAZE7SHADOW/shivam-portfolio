import { ReactNode } from "react";

export function Eyebrow({ children, center }: { children: ReactNode; center?: boolean }) {
  return (
    <div
      className={`mb-6 flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.18em] text-accent-2 ${
        center ? "justify-center" : ""
      }`}
    >
      <span className="h-px w-7 bg-accent-2/60" />
      {children}
    </div>
  );
}

export function SectionHeading({
  title,
  sub,
}: {
  title: ReactNode;
  sub?: ReactNode;
}) {
  return (
    <>
      <h2 className="mb-3.5 font-serif text-[clamp(32px,5vw,52px)] font-normal tracking-tight">
        {title}
      </h2>
      {sub && <p className="mb-14 max-w-xl text-base text-ink-dim">{sub}</p>}
    </>
  );
}
