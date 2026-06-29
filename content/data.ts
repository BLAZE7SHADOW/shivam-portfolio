// ============================================================================
//  EDIT THIS FILE TO UPDATE YOUR PORTFOLIO
//  Everything on the site reads from here. No need to touch component code.
// ============================================================================

export const profile = {
  name: "Shivam Govind Rao",
  initials: "SGR",
  role: "Software Development Engineer",
  tagline: "software development engineer · frontend-rooted · AI-powered products.",
  // Drop your photo at /public/images/avatar.jpg (square works best)
  avatar: "/images/avatar.jpg",
  location: "Gurugram, India",
  status: "Open to work · Looking for my next role",
  // Drop your resume PDF at /public/Shivam_Govind_Rao_Resume.pdf
  resume: "/Shivam_Govind_Rao_Resume.pdf",
  email: "ishivamgovindrao@gmail.com",
  phone: "+91 63862 20277",
  // EDIT: paste your real links
  socials: {
    github: "https://github.com/BLAZE7SHADOW",
    linkedin: "https://www.linkedin.com/in/shivam-govind-rao-138881157/",
    twitter: "https://twitter.com/your_handle", // EDIT
  },
  intro:
    "I started as a frontend engineer and grew into the full stack — backend, cloud, AI pipelines, and RPA automation. At Diagna AI I owned FAXFlo end-to-end: 110+ React components, a 40-endpoint Node.js API, a distributed AWS document pipeline processing 1,000+ faxes daily, and the AI + voice automation that took the product live in a paying US clinic.",
};

export const stats = [
  { num: "110+", label: "React components shipped solo" },
  { num: "1K+", label: "Medical docs processed daily" },
  { num: "$10K", label: "MRR built in 11 months" },
  { num: "40+", label: "AI doc categories at ~95% accuracy" },
];

export const marquee = [
  "React 19", "TypeScript", "Next.js", "Zustand", "Framer Motion",
  "GSAP", "Tailwind", "Node.js", "AWS Bedrock", "Remotion", "PostgreSQL", "PDF.js",
];

// ============================================================================
//  EXPERIENCE / JOURNEY  (used on Home + Journey page)
// ============================================================================
export const journey = [
  {
    period: "Jan 2025 — April 2026",
    role: "Software Development Engineer · Full-Stack",
    company: "Diagna AI — FAXFlo",
    place: "Gurugram",
    tag: "End-to-end product ownership",
    chapter: "The healthcare era",
    summary:
      "Took FAXFlo from a company pivot to its first paying US clinic in production. Owned the entire stack — React frontend, Node.js backend, AWS cloud pipeline, multi-model AI, Voice-AI scheduling, RPA automation, and analytics.",
    points: [
      "Full-stack owner: shipped the React 19 frontend solo (110+ components, lazy-loaded routes, per-clinic feature flags, ~60% bundle reduction) AND the production backend (Node.js · Express · PostgreSQL, 40+ REST endpoints, JWT/RBAC auth, Redis-backed BullMQ queues, Swagger docs).",
      "Architected a distributed AWS pipeline (S3 · SQS · Textract · SNS · Bedrock) processing 1,000+ medical documents daily at 99%+ uptime, with DLQ handling and Slack alerting.",
      "Integrated Claude (Sonnet), GPT-4o, and AWS Bedrock for document classification at ~95% accuracy across 40+ categories — extracting structured patient data with custom prompts and retry logic.",
      "Built an AI SMS orchestrator (Twilio · Telnyx · Vonage) for opt-in/opt-out flows, appointment reminders, and follow-up — and a Voice-AI scheduling module (VAPI + ElevenLabs) cutting manual outreach ~70%.",
      "Engineered an RPA automation suite (Robocorp · Python · FastAPI · Redis RQ) for MDLand EHR — OTP/2FA login, patient search, document upload, and schedule sync via iframe-heavy UI, with a React Chrome Extension for on-page orchestration.",
      "Built the HIPAA-compliant PostHog analytics dashboard (EMR sync counts, bar charts, appointment analytics) and the investor + clinic demo that closed the first paying US clinic.",
      "Wrote a custom Zustand + Immer document-editing engine with field-level diffing and patch-only updates; PDF.js rendering at 300 DPI with multi-page batch processing and ~80% image compression.",
    ],
    stack: ["React 19", "TypeScript", "Zustand", "Node.js", "Express", "PostgreSQL", "Redis", "BullMQ", "AWS Bedrock", "Claude", "GPT-4o", "Textract", "VAPI", "ElevenLabs", "Robocorp", "Python", "FastAPI", "PDF.js", "PostHog"],
  },
  {
    period: "Dec 2023 — Jan 2025",
    role: "Frontend Developer",
    company: "Oriserve — VoiceGenie.ai",
    place: "Noida",
    tag: "Sole frontend engineer",
    chapter: "The voice-AI era",
    summary:
      "The only frontend engineer on VoiceGenie, a generative-AI voice sales platform. Built the dashboard and marketing site that closed the first enterprise customers.",
    points: [
      "Grew VoiceGenie from 0 to $10K MRR in 11 months as the sole frontend engineer.",
      "Built a live variable composer for AI voice scripts — drop @name / @appointment tokens that resolve per-contact at call time.",
      "Integrated HubSpot, ElevenLabs, GoHighLevel, and Cal.com into one workflow.",
      "Cut page load times 30–50% with code splitting, lazy loading, and targeted caching.",
    ],
    stack: ["React", "Next.js", "TypeScript", "Material UI", "Redux", "Tailwind"],
  },
];

// The narrative growth path shown on the Journey page
export const growthPath = [
  { label: "Frontend Developer", note: "Where it started — components, state, UI craft." },
  { label: "Product Engineer", note: "Owning features end-to-end, thinking in user outcomes." },
  { label: "Full Stack Engineer", note: "Node, Postgres, queues, cloud — building the whole pipe." },
  { label: "AI Engineer", note: "Bedrock, Claude, document intelligence, voice automation." },
  { label: "Software Development Engineer", note: "0→production ownership in a fast-paced AI startup." },
];

// ============================================================================
//  PROJECTS
//  Each project has a `media` array — add as many images/videos as you want.
//  type: "image" | "video".  src: a path under /public.
//  Drop files in /public/demos and reference them here. Blur PHI before adding.
//  An empty media array shows a styled "demo coming soon" placeholder.
// ============================================================================
export type Media = { type: "image" | "video"; src: string; caption?: string };

export type Project = {
  slug: string;
  title: string;
  blurb: string;
  year: string;
  role: string;
  featured: boolean;
  media: Media[];
  highlights: string[];
  stack: string[];
  links: { live: string; github: string };
};

export const projects: Project[] = [
  {
    slug: "faxflo",
    title: "FAXFlo — Diagna AI",
    blurb: "Full-stack AI medical-document platform — clinical inbox, eFax triage, voice scheduling, RPA EHR automation, and analytics. Taken from a company pivot to its first paying US clinic.",
    year: "2025",
    role: "Software Development Engineer · Full-Stack",
    featured: true,
    media: [
      { type: "image", src: "/images/Faxflo_main_dashboard.png", caption: "Main clinical dashboard" },
      { type: "image", src: "/images/Faxfllo-appointment_dashboad.png", caption: "Appointment scheduling dashboard" },
      { type: "image", src: "/images/Faxflo_analytics_dashboard-1.png", caption: "Analytics dashboard — document & EMR metrics" },
      { type: "image", src: "/images/Faxflo_analytics_dashboard-2.png", caption: "Analytics dashboard — appointment & AI status" },
    ],
    highlights: [
      "Full-stack: 110+ React components · 40+ REST endpoints · distributed AWS pipeline",
      "AI classification at ~95% accuracy across 40+ medical document categories",
      "1,000+ documents processed daily — S3 · SQS · Textract · Bedrock at 99%+ uptime",
      "AI SMS orchestrator (Twilio · Telnyx · Vonage) + Voice-AI scheduling (VAPI + ElevenLabs) cutting manual outreach ~70%",
      "RPA automation suite (Robocorp · FastAPI · Redis) for MDLand EHR entry and schedule sync",
      "HIPAA-compliant analytics dashboard — demo that closed the first paying US clinic",
    ],
    stack: ["React 19", "TypeScript", "Zustand", "Node.js", "Express", "PostgreSQL", "Redis", "BullMQ", "AWS Bedrock", "Claude", "GPT-4o", "Textract", "VAPI", "ElevenLabs", "Robocorp", "Python", "FastAPI", "Prisma", "PostHog"],
    links: { live: "", github: "" },
  },
  {
    slug: "voicegenie",
    title: "VoiceGenie",
    blurb: "Generative-AI voice sales platform. Built the full dashboard and marketing site as the sole frontend engineer; reached $10K MRR.",
    year: "2024",
    role: "Frontend Developer",
    featured: true,
    media: [
      // { type: "image", src: "/demos/voicegenie-dashboard.png", caption: "Campaign dashboard" },
      // { type: "video", src: "/demos/voicegenie-demo.mp4" },
    ],
    highlights: [
      "0 → $10K MRR in 11 months",
      "Live variable composer for AI voice scripts",
      "HubSpot / ElevenLabs / Cal.com integrations",
      "30–50% faster page loads",
    ],
    stack: ["React", "Next.js", "TypeScript", "Ant Design", "Tailwind"],
    links: { live: "", github: "" },
  },
  {
    slug: "motionstudio",
    title: "MotionStudio",
    blurb: "A browser-based video editor built on Remotion — early stage, timeline engine in progress. A deep exploration of programmatic video generation and creative tooling.",
    year: "2026",
    role: "Personal project · In development",
    featured: false,
    media: [],
    highlights: [
      "Early stage — timeline engine actively in progress",
      "Programmatic video generation in the browser via Remotion",
      "Thinking in frames, keyframes, and composition engines — not just features",
    ],
    stack: ["Remotion", "React", "TypeScript", "Tailwind"],
    links: { live: "", github: "" },
  },
];

// ============================================================================
//  NOW PAGE  —  update this whenever you want. It's your living status.
// ============================================================================
export const now = {
  // EDIT: the date you last updated this page
  updated: "June 2026",
  intro:
    "A living snapshot of what I'm building, learning, and thinking about right now. Updated regularly.",
  building: [
    { title: "MotionStudio", note: "A Remotion-based browser video editor — early stage, timeline engine in progress." },
    { title: "What's next", note: "Actively exploring founding engineer and senior full-stack roles. If you're building something ambitious in AI or product, let's talk." },
  ],
  learning: [
    { title: "System Design", note: "Distributed systems, queues, and scaling patterns — applied directly to FAXFlo's pipeline." },
    { title: "DSA", note: "Sharpening data structures & algorithms regularly." },
    { title: "Remotion deep-dive", note: "Programmatic video as a first-class engineering problem." },
  ],
  reading: [
    // Hard-coded — no auto-sync. Just edit these lines.
    { title: "On Twitter / X", note: "Following the agentic-workflows and AI-tooling space." },
    { title: "Blog writing", note: "Starting to write about building in the AI era." },
  ],
  interests: [
    "AI Applications", "Developer Tools", "System Design", "Distributed Systems",
    "Video Generation", "Remotion", "Creative Tooling", "Automation",
    "Interactive UIs", "Agentic Workflows", "Building in Public",
  ],
};

// ============================================================================
//  HOBBIES  (shown on Home / Journey)
//  EDIT these — placeholders below.
// ============================================================================
export const hobbies = [
  { emoji: "🎬", title: "Video editing", note: "Motion design and creative tooling." },
  { emoji: "✍️", title: "Writing", note: "Documenting what I build." },
  { emoji: "🧩", title: "Side projects", note: "Always building something." },
  { emoji: "🎧", title: "Music", note: "Fuel for long build sessions." },
];

// ============================================================================
//  SKILLS
// ============================================================================
export const skills = [
  { group: "Frontend", items: ["React 19", "Next.js", "TypeScript", "Tailwind", "Framer Motion", "GSAP", "Zustand", "React Query", "MUI", "Ant Design", "shadcn/ui", "Remotion"] },
  { group: "Backend", items: ["Node.js", "Express", "Prisma", "PostgreSQL", "Redis", "BullMQ", "REST APIs", "JWT", "FastAPI", "Python"] },
  { group: "Cloud", items: ["AWS", "S3", "SQS", "SNS", "Textract", "Bedrock", "Lambda", "IAM", "Docker"] },
  { group: "AI", items: ["Claude", "GPT-4o", "Llama", "AWS Bedrock", "VAPI", "ElevenLabs", "Twilio", "Prompt Engineering", "Document Intelligence"] },
  { group: "Automation", items: ["Robocorp", "Playwright", "Puppeteer", "RPA", "Chrome Extensions", "Redis RQ", "Job Queues"] },
  { group: "Tools", items: ["Git", "PostHog", "Swagger", "Vercel", "Claude Code", "Cursor", "VS Code"] },
];
