import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Projects by Shivam Govind Rao, AI Engineer: PayOps AI (multi-agent payment investigator), a Hinglish clinic voice agent (real-time voice AI, in development), FAXFlo (document AI for US clinics), VoiceGenie (AI voice platform), ClinRAG (hybrid RAG with RAGAS evals) and MotionStudio.",
  alternates: { canonical: "https://www.shivamgovindrao.com/projects" },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
