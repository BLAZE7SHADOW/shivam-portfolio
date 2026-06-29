import type { Metadata } from "next";
import "./globals.css";
import Ambient from "@/components/Ambient";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { profile } from "@/content/data";

export const metadata: Metadata = {
  title: `${profile.name} — ${profile.role}`,
  description: profile.intro,
  openGraph: {
    title: `${profile.name} — ${profile.role}`,
    description: profile.intro,
    type: "website",
  },
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
