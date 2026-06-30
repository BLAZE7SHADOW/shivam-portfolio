import type { Metadata } from "next";
import "./globals.css";
import Ambient from "@/components/Ambient";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { profile } from "@/content/data";

const BASE_URL = "https://www.shivamgovindrao.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: `${profile.name} — ${profile.role}`,
    template: `%s | ${profile.name}`,
  },
  description: profile.intro,
  keywords: [
    "Shivam Govind Rao",
    "Shivam Govind",
    "Software Development Engineer",
    "Full Stack Engineer",
    "Frontend Engineer",
    "AI Engineer",
    "React Developer",
    "Next.js",
    "TypeScript",
    "Node.js",
    "AWS",
    "Healthcare AI",
    "Voice AI",
    "Diagna AI",
    "FAXFlo",
    "VoiceGenie",
    "Gurugram",
    "India",
  ],
  authors: [{ name: profile.name, url: BASE_URL }],
  creator: profile.name,
  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: profile.name,
    title: `${profile.name} — ${profile.role}`,
    description: profile.intro,
    images: [{ url: "/images/avatar.jpg", width: 400, height: 400, alt: profile.name }],
  },
  twitter: {
    card: "summary",
    site: "@BLAZE07SHADOW",
    creator: "@BLAZE07SHADOW",
    title: `${profile.name} — ${profile.role}`,
    description: profile.intro,
    images: ["/images/avatar.jpg"],
  },
  alternates: {
    canonical: BASE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: BASE_URL,
  email: profile.email,
  jobTitle: profile.role,
  description: profile.intro,
  image: `${BASE_URL}/images/avatar.jpg`,
  address: { "@type": "PostalAddress", addressLocality: "Gurugram", addressCountry: "IN" },
  sameAs: [
    profile.socials.github,
    profile.socials.linkedin,
    profile.socials.twitter,
  ],
  knowsAbout: [
    "React", "Next.js", "TypeScript", "Node.js", "AWS", "AI Engineering",
    "Full Stack Development", "Voice AI", "Healthcare AI", "RPA Automation",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans">
        <Ambient />
        <Cursor />
        <Nav />
        <main className="relative z-[2] mx-auto max-w-[980px] px-7">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
