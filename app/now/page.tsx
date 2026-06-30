import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";
import { Eyebrow } from "@/components/Section";

export const metadata: Metadata = {
  title: "Now",
  description: "What Shivam Govind Rao is building, learning, and thinking about right now.",
  alternates: { canonical: "https://www.shivamgovindrao.com/now" },
};
import { now } from "@/content/data";

function Column({
  label,
  items,
}: {
  label: string;
  items: { title: string; note: string }[];
}) {
  return (
    <div>
      <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-accent-2">{label}</h3>
      <div className="grid gap-3">
        {items.map((it, i) => (
          <Reveal key={it.title} delay={i * 0.05}>
            <TiltCard className="p-5" max={4}>
              <div className="text-[15px] font-semibold">{it.title}</div>
              <div className="mt-1 text-sm text-ink-dim">{it.note}</div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export default function NowPage() {
  return (
    <div className="pt-32">
      <Reveal>
        <div className="mb-6 flex items-center gap-3">
          <Eyebrow>Now</Eyebrow>
          <span className="font-mono text-xs text-ink-faint">· updated {now.updated}</span>
        </div>
      </Reveal>
      <Reveal>
        <h1 className="mb-5 font-serif text-[clamp(40px,7vw,76px)] font-normal leading-[1.04] tracking-tight">
          What I&apos;m doing <span className="grad-text italic">right now.</span>
        </h1>
      </Reveal>
      <Reveal delay={0.05}>
        <p className="mb-16 max-w-2xl text-lg text-ink-dim">{now.intro}</p>
      </Reveal>

      <div className="mb-20 grid gap-12 lg:grid-cols-3">
        <Column label="🛠 Building" items={now.building} />
        <Column label="📚 Learning" items={now.learning} />
        <Column label="🔭 Reading & writing" items={now.reading} />
      </div>

      <section className="mb-28">
        <Reveal><Eyebrow>On my mind</Eyebrow></Reveal>
        <Reveal>
          <div className="flex flex-wrap gap-2.5">
            {now.interests.map((it) => (
              <span
                key={it}
                className="rounded-lg border border-panel-border px-3.5 py-2 text-sm text-ink-dim transition-all hover:-translate-y-0.5 hover:border-accent hover:text-ink"
              >
                {it}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      <Reveal>
        <p className="mb-20 font-mono text-xs text-ink-faint">
          This page is inspired by the{" "}
          <a href="https://nownownow.com/about" target="_blank" rel="noopener" data-mag className="underline hover:text-ink-dim">
            /now page
          </a>{" "}
          movement — a public snapshot of current focus.
        </p>
      </Reveal>
    </div>
  );
}
