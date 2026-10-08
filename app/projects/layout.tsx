import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Projects by Shivam Govind Rao: PayOps AI (multi-agent payment investigator), FAXFlo (AI healthcare platform), VoiceGenie (AI voice sales platform) and MotionStudio.",
  alternates: { canonical: "https://www.shivamgovindrao.com/projects" },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
