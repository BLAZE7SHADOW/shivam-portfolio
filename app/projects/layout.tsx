import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Production projects by Shivam Govind Rao — FAXFlo (AI healthcare platform) and VoiceGenie (AI voice sales platform).",
  alternates: { canonical: "https://www.shivamgovindrao.com/projects" },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
