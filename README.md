# Shivam Govind Rao — Portfolio

A premium, animated portfolio built with **Next.js 14, TypeScript, Tailwind, Framer Motion, and GSAP**.
Custom cursor, mouse spotlight, magnetic buttons, 3D-tilt cards, scroll choreography, and four pages:
**Home · Journey · Projects · Now**, plus a working contact form.

---

## 1. Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

---

## 2. Edit your content (the only file you need)

**`content/data.ts`** is the single source of truth. Everything on the site reads from it:

- `profile` — name, role, tagline, email, phone, **social links** (← edit your Twitter handle here)
- `stats`, `marquee`, `skills`
- `journey` — your experience + the narrative "chapters"
- `growthPath` — the frontend → founding arc on the Journey page
- `projects` — FAXFlo, VoiceGenie, MotionStudio (+ media slots, see below)
- `now` — the living **/now** page; update `now.updated` and the lists whenever
- `hobbies`

No need to touch any component code to update content.

---

## 3. Add your photo

Drop a square image at:

```
public/images/avatar.jpg
```

---

## 4. Add demo screenshots & videos (blur first for compliance)

Each project in `content/data.ts` has two media fields. Drop your files into
`public/demos/` and point to them:

```ts
{
  slug: "faxflo",
  image: "/demos/faxflo-dashboard.png",   // a screenshot (png/jpg/webp)
  video: "/demos/faxflo-demo.mp4",        // optional — overrides image if set
  ...
}
```

Recommended filenames (already referenced in comments in `data.ts`):

| Project       | Screenshot                          | Video                          |
|---------------|-------------------------------------|--------------------------------|
| FAXFlo        | `public/demos/faxflo-dashboard.png` | `public/demos/faxflo-demo.mp4` |
| VoiceGenie    | `public/demos/voicegenie.png`       | `public/demos/voicegenie.mp4`  |
| MotionStudio  | `public/demos/motionstudio.png`     | `public/demos/motionstudio.mp4`|

If a field is left as `""`, a styled "demo coming soon" placeholder shows automatically — so the
site looks finished even before you add media. **Blur any PHI / patient data before adding.**

---

## 5. Wire up the contact form (optional but recommended)

The form works out of the box with a **mailto fallback** — if no email service is configured,
clicking "Send" opens the visitor's mail client addressed to you.

To receive submissions directly in your inbox:

1. Make a free account at https://resend.com and create an API key.
2. Copy `.env.example` to `.env.local` and fill it in:
   ```
   RESEND_API_KEY=re_xxxxxxxx
   CONTACT_TO_EMAIL=ishivamgovindrao@gmail.com
   ```
3. On Vercel, add those same two variables under **Settings → Environment Variables**.

The default `from` address (`onboarding@resend.dev`) works immediately. To send from your own
domain, verify it in Resend and update the `from` line in `app/api/contact/route.ts`.

---

## 6. Deploy to Vercel (one click)

1. Push this folder to a new GitHub repo:
   ```bash
   git init && git add . && git commit -m "portfolio"
   git branch -M main
   git remote add origin https://github.com/BLAZE7SHADOW/portfolio.git
   git push -u origin main
   ```
2. Go to https://vercel.com → **New Project** → import the repo.
3. (Optional) add the two environment variables from step 5.
4. Deploy. Done.

Vercel auto-detects Next.js — no config needed.

---

## Tech

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · GSAP · Resend · lucide-react

## Accessibility

Respects `prefers-reduced-motion` (all animation disabled), custom cursor only on fine pointers,
keyboard-focusable interactive elements.
