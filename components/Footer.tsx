import { profile } from "@/content/data";

export default function Footer() {
  return (
    <footer className="relative z-[2] py-12 text-center font-mono text-[13px] text-ink-faint">
      Designed & built by {profile.name} · {new Date().getFullYear()}
    </footer>
  );
}
