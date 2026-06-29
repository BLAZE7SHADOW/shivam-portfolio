# CLAUDE.md — Project context for Claude Code

This file gives you (Claude Code) the context to work on this repo effectively.
Read it at the start of each session.

## What this is

A personal portfolio for **Shivam Govind Rao** — a Founding Engineer (frontend-leaning,
full-stack capable, AI-focused). Premium dark, animation-heavy, inspired by Aceternity /
Linear / Vercel aesthetics. The interaction quality *is* the portfolio's thesis (Shivam's
craft is frontend/interaction work), so motion and polish matter.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** (custom theme in `tailwind.config.ts`)
- **Framer Motion** for scroll reveals
- **GSAP** is a dependency (available for richer timeline work; not heavily used yet)
- **Resend** for the contact form email API
- `lucide-react` for icons
- Fonts loaded via `<link>` in `app/layout.tsx` (Inter / Instrument Serif / JetBrains Mono).
  NOTE: intentionally NOT using `next/font/google` — it failed in a sandboxed build env.
  The `<link>` approach works everywhere.

## The one rule for content

**`content/data.ts` is the single source of truth for ALL content.** Profile, socials,
stats, journey/experience, projects, the Now page, hobbies, skills — all live there as typed
objects. Pages and components import from it. When asked to change wording, add a project,
update the Now page, etc., edit `content/data.ts` — do NOT hardcode content into components.

## Structure

```
app/
  layout.tsx        Root layout: fonts, Ambient, Cursor, Nav, Footer
  page.tsx          Home: hero, stats, experience, featured projects, skills, contact
  journey/page.tsx  Journey: growth path + experience "chapters" + hobbies
  projects/page.tsx Projects: cards with media slots (image/video)
  now/page.tsx      Now: living status (building/learning/reading/interests)
  api/contact/route.ts   Contact form handler (Resend + mailto fallback)
  globals.css       Theme vars, base styles, custom cursor hiding
components/
  Ambient.tsx       Fixed dot-grid, glow orbs, mouse spotlight, scroll progress rail
  Cursor.tsx        Custom cursor (dot + lagging ring), only on fine pointers
  Nav.tsx           Floating pill nav
  Magnetic.tsx      Wrapper: element leans toward cursor on hover
  TiltCard.tsx      3D perspective tilt + cursor-following glow
  Reveal.tsx        Framer Motion scroll-reveal wrapper
  ContactForm.tsx   Client form -> /api/contact, mailto fallback
  Avatar.tsx        Circular avatar with gradient ring + hover glow (reads profile.avatar)
  Gallery.tsx       Multi-image/video project gallery with thumbnail switcher
  Section.tsx       Eyebrow + SectionHeading primitives
  Footer.tsx
content/data.ts     ← EDIT THIS for all content
lib/utils.ts        cn() class merge helper
public/demos/       Project screenshots/videos go here (blur PHI first)
public/images/      avatar.jpg + portrait.jpg
public/Shivam_Govind_Rao_Resume.pdf   Resume (placeholder; replace with the real PDF)
```

## Design tokens (Tailwind theme)

- Background `#08080a`, soft panel `#0e0e12`
- Text: `ink #f4f4f6`, `ink-dim #a1a1ad`, `ink-faint #6b6b78`
- Accents: `accent #7c5cff` (violet), `accent-2 #22d3ee` (cyan)
- `panel` / `panel-border` for glass surfaces
- Display font = serif (Instrument Serif, often italic for emphasis)
- Body = Inter, mono labels = JetBrains Mono
- `.grad-text` utility = violet→cyan gradient text
- Custom spacing added: `4.5`, `5.5`

## Conventions

- Interactive elements get `data-mag` so the custom cursor enlarges over them; wrap key
  CTAs in `<Magnetic>`.
- Cards that should tilt use `<TiltCard>`.
- Animations must respect `prefers-reduced-motion` (already handled in components + globals.css).
- Custom cursor only activates on `(hover: hover) and (pointer: fine)`.

## Contact form

`app/api/contact/route.ts`: if `RESEND_API_KEY` env var is absent it returns `{fallback:true}`
and the client opens the visitor's mail client (mailto). With the key set, it sends via Resend.
Env vars: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`. See `.env.example`.

## Media slots (projects)

Each project in `content/data.ts` has a `media: Media[]` array where
`Media = { type: "image" | "video"; src: string; caption?: string }`. Add as many as you
want; `Gallery.tsx` renders the first as the main frame with thumbnails to switch. An empty
array shows a styled "demo coming soon" placeholder. Drop files in `public/demos/`. Blur PHI.

## Resume

`profile.resume` points to `/Shivam_Govind_Rao_Resume.pdf` (in `public/`). A placeholder PDF
ships in the repo — replace it with the real resume, same filename, or change the path in data.

## TODO / open items

- [ ] Add real Twitter/X handle in `content/data.ts` (currently placeholder `your_handle`)
- [ ] Replace placeholder hobbies with real ones
- [ ] Replace `public/Shivam_Govind_Rao_Resume.pdf` with the real resume
- [ ] Add blurred demo screenshots/videos to `public/demos/` and list them in each project's `media`
- [ ] (Optional) A blog / writing page, if requested

## Commands

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```
