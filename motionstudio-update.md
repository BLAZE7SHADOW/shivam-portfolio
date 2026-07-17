# MotionStudio — Build Notes

> A browser-based video editor I built to learn what it actually takes to ship a real product: composition engine, frame-accurate timeline, two export paths, auth, abuse prevention, cloud infrastructure. This document covers the architecture, the real problems I hit, and what I learned.

---

## What it is

MotionStudio lets you place text, images, video, and audio on a canvas, arrange and animate them on a frame-accurate timeline, and export to MP4 — either directly in the browser or via AWS Lambda. It's live and deployed.

**Numbers:**
- ~5,000 lines of strict TypeScript
- 7 engine modules (pure data + logic, zero UI)
- 70+ logically-grouped commits
- 3 infrastructure layers: Vercel serverless, Supabase, AWS Lambda

---

## Architecture: two layers, one rule

The codebase is split into two layers:

- **`engines/`** — own data and logic, no UI
- **`features/`** — own UI, call into engines

The one rule: **the Project is the aggregate root.** Every element, asset, and setting lives in one `Project` object. Every edit flows through one mutation point (`updateProject`). This sounds obvious, but it's what made undo/redo, autosave, and WYSIWYG essentially free to build later. None of them needed per-feature wiring — they all hook into the same single mutation path.

**7 engines:**
| Engine | What it owns |
|---|---|
| `project` | The projects array + undo history + persistence (the only real store) |
| `editor` | Ephemeral view state — selection, frame, playing, zoom |
| `canvas` | Verbs: addText/Image/Video/Audio, updateElement, removeElement |
| `timeline` | Pure frame ↔ pixel math (stateless helpers) |
| `animation` | interpolate / spring evaluation + presets (pure functions) |
| `rendering` | The shared `style.ts` + Remotion `MotionComposition` |
| `asset` | Upload, metadata probing, blob persistence |

---

## Remotion as the foundation

The product renders real video. Remotion gives me frames as a first-class unit, `<Sequence>` for temporal composition, `<Player>` for in-app preview, and `renderMedia` for the actual encode. Building a renderer and encoder from scratch would be months of work that has nothing to do with this product.

The non-obvious integration choices:

- **Frame-based model:** Every element carries `startFrame + durationInFrames`, mapped onto `<Sequence from={startFrame}>`. Frames, not seconds — because Remotion is frame-based and frames are exact. No floating-point drift.

- **WYSIWYG by design:** The editor preview and the export call the *same* `style.ts` function, differing only by a `scale` argument (editor < 1, Remotion = 1). WYSIWYG isn't "we tried to match" — it's a mathematical consequence of sharing one renderer.

- **Animation on Remotion's primitives:** `interpolate` with `extrapolate: 'clamp'` so animations finish instead of extrapolating to infinity. `spring` for physics, because a bounce is time-dependent (it needs `fps`). Multiple animations accumulate into one transform — factors multiply, offsets add — the same algebra video compositors use.

---

## The export story: from CLI to two production paths

### Why the CLI wasn't the answer

The original export: a button that generated the correct `npx remotion render` command and a `props.json`. It worked — if you were a developer willing to open a terminal. For any other user, it didn't exist.

The gap forced a real question: what does "export" mean for a product?

### Path 1 — Browser export (WebCodecs)

Free. Unlimited. Chrome and Edge only. No server.

1. Each frame is rendered to an off-screen canvas using the shared `style.ts`
2. The canvas `ImageData` is pushed into a `VideoEncoder` (WebCodecs API) — GPU-accelerated H.264 encoding, in the browser
3. All audio tracks are mixed using `OfflineAudioContext` — a Web Audio context that renders faster than real-time, producing a precise `AudioBuffer`. No timing drift.
4. Video chunks and audio buffer are muxed into an MP4 container by Mediabunny
5. The finished blob is downloaded to the user's device

**Why this works:** WebCodecs uses the device's hardware encoder. `OfflineAudioContext` eliminates the desync risk you'd get from real-time mixing. Mediabunny handles the MP4 container format. The result is frame-perfect, audio-included output with zero per-render infrastructure cost.

**Limitation:** WebCodecs is not in Firefox or Safari. Large projects are slow on low-end hardware.

### Path 2 — Cloud render (Remotion Lambda)

Quota-based. Any device. Any browser. Rendered on AWS.

0. Media imported into the editor uploads to S3 in the background, as soon as it's added — the browser keeps the `blob:` URL for local preview, and a `storageUrl` (public S3 `https://` link) is patched onto the asset once the upload finishes
1. User clicks "Render & download" in the Cloud tab
2. A Vercel serverless function receives the request and runs four gates:
   - **Gate 1:** Verify the JWT against Supabase. No valid token = rejected.
   - **Gate 2 (anonymous only):** Check the device cookie against the `device_renders` table.
   - **Gate 3:** Check monthly render count. Over quota = rejected.
   - **Gate 4:** Call `renderMediaOnLambda()`.
3. A pre-deployed AWS Lambda function (2 GB RAM, 120s timeout) renders the same `MotionComposition` in headless Node.js — using each asset's `storageUrl`, not its `blob:` URL
4. Lambda writes the output MP4 to S3 and returns a download URL
5. The Vercel function polls `getRenderProgress()` until complete, then returns the URL to the client

**Why this matters:** This is the production path — the one that works on every device, including mobile, Safari, and low-end laptops. The render happens on dedicated infrastructure, not in the user's browser tab.

**Current limitation:** The 2 GB RAM / 120s timeout on the Lambda function caps how long or heavy a single composition can be per render.

---

## Auth, quota, and guest access

Three sign-in paths:
- **Google OAuth** — 5 cloud renders/month
- **Email/password** — 5 cloud renders/month (Supabase, with email confirmation flow)
- **Guest (anonymous)** — 1 free cloud render, no account required

All auth state and actions live in a single `useAuth` hook. UI components never touch the Supabase client directly — they call hook methods. When I added guest sign-in later, the change was one function in the hook and one button in the auth panel. The boundary held.

### Guest abuse prevention

Anonymous Supabase sessions live in localStorage. Clearing localStorage gives a fresh anonymous session — and another free render. This is an obvious abuse vector.

**Solution:** A device ID cookie. On first visit, `crypto.randomUUID()` is written to a 1-year cookie (`ms_device`). The cookie survives localStorage clears. Before any anonymous render, the API checks the `device_renders` table for that device ID.

The device ID is recorded *only after* a confirmed successful render output URL. If Lambda fails, the user's one free slot isn't consumed.

### Account isolation

Projects are stored in IndexedDB. If user A signs in, creates projects, then user B signs in on the same device — they'd see user A's data.

**Solution:** `AuthBridge` — a non-rendering component in `App.tsx` that watches `user.id` and compares it to `ms_last_user` in localStorage on every auth state change. When they differ (different account, or sign-out), it calls `clearAll()`, which resets the Zustand store and calls `persist.clearStorage()` to immediately wipe IndexedDB. User B sees a clean state.

---

## Real engineering problems

These are the actual bugs and blockers, not the generic kind:

**1. The Supabase SDK was hiding the actual error.**
`supabase-js`'s `.throwOnError()` on a count query returned an error object with an empty `.message`. Completely opaque. Two hours of debugging.

Fix: Replaced the SDK call with a direct `fetch()` to the Supabase REST API with explicit `apikey` and `Authorization` headers. Same query, raw HTTP — the actual error came back immediately. The abstraction was swallowing the signal.

**2. Supabase's new key format silently caused 403s.**
Supabase added a `sb_secret_...` key format. Using it with the version of `supabase-js` in the project produced 403 responses on all table operations — no useful error, just rejection.

Fix: Switched to the older `eyJ...` JWT-format keys from the dashboard. The new format requires a newer SDK version.

**3. The Lambda IAM role didn't exist.**
`renderMediaOnLambda()` failed with "remotion-lambda-role not found" despite correct AWS credentials, region, and Lambda function deployment.

Fix: The IAM role is not created by `npx remotion lambda deploy` — it must be created manually: AWS Console → Roles → Create role → Lambda use case → attach the inline policy from `npx remotion lambda policies role`. It's in the Remotion docs, but easy to miss.

**4. Five-patch version mismatch, no error.**
`remotion` was at `4.0.483` and `@remotion/lambda-client` at `4.0.488`. Five patches apart — silent failures, wrong behavior, no useful message.

Fix: Pinned all Remotion packages to the exact same version by removing `^` from `package.json`. Remotion's packages must be at identical versions across the dependency tree.

**5. 404 after Google OAuth redirect.**
Google OAuth redirected to `/dashboard` on Vercel. 404 — that route doesn't correspond to a real file.

Fix: Added a catch-all rewrite to `vercel.json`: `{ "source": "/(.*)", "destination": "/index.html" }`. React Router handles routing client-side; Vercel just needs to serve `index.html` for every non-API path.

**6. RLS blocked the service role key.**
`service_role` is supposed to bypass Supabase Row-Level Security. On the `renders` table, inserts were failing anyway.

Fix: The table was created with "Automatically expose new tables" off, which means no grants were applied — not even to `service_role`. Required an explicit `GRANT SELECT, INSERT, UPDATE, DELETE ON public.renders TO service_role`.

---

## What worked well (and why)

| Decision | Why it paid off |
|---|---|
| Project as aggregate root | Undo/redo + autosave added at one point, covered every edit automatically |
| Engines own verbs, not state | No state drift; features stayed thin and composable |
| One shared renderer | WYSIWYG guaranteed, not hoped for — same function, different scale |
| Composition-space coordinates | Store data at output resolution; every view just multiplies by scale |
| Centralized `useAuth` hook | Zero auth logic in UI components; adding guest auth was one function |
| Typed `apiClient.ts` | Bearer token injection is automatic on every request |
| Device cookie for guest limiting | Abuse prevented without requiring accounts; localStorage clears don't help |
| `AuthBridge` + `clearAll()` | Data isolation between users on a shared device with no per-feature wiring |
| Record device render after success | Failed Lambda renders don't consume the guest's free slot |
| Background S3 upload + `storageUrl` patch | Uploaded media now renders on Lambda too — `blob:` stays local for preview, S3 URL goes to the cloud path |

---

## Lessons

**A single mutation path is a superpower.** It's what made undo, autosave, and WYSIWYG cheap. Deciding where data changes — before deciding how it changes — is the most important architectural move.

**The CLI was always the wrong tool for real users.** They can't run terminal commands. The missing piece wasn't a feature — it was a distribution model. Building both the browser path and the Lambda path was the actual product work.

**Know what to buy.** The Lambda deployment itself was ~20 minutes of configuration. The interesting engineering was the quota gate, the auth layer, and the guest-abuse prevention around it. Remotion handles the rendering. Build the parts that are actually your product.

**Never trust the client.** JWT verified server-side first, device and quota checked second, Lambda called third — always in that order. The client supplies the token; the server decides what it means.

**Abstractions that hide errors are worse than no abstraction.** `supabase-js` returning an empty error string cost two hours. The direct REST call returned the real problem in ten seconds. When something breaks and the SDK gives you nothing, go one level down.

---

## Stack

| Technology | Why |
|---|---|
| Remotion | Frames, `<Sequence>`, `<Player>`, `renderMedia` — the video engine the product is built around |
| React 19 + TypeScript (strict) | Discriminated-union element types; new element = one type + one renderer |
| Zustand | One `create()` → a hook + selectors. No providers, no reducers. |
| React Router v7 | URL selects the project: `/editor/:projectId` |
| react-moveable | Drag/resize/rotate handles are a solved problem |
| Tailwind v4 + shadcn/ui | Consistent dark UI; accessible primitives without reinventing them |
| IndexedDB + localStorage | Small JSON in localStorage, large blobs in IndexedDB |
| Supabase | Three auth methods + JWT verification server-side. Service-role key stays on the server. |
| Vercel serverless | `/api/render` and `/api/quota` — Node.js, deployed alongside the SPA |
| Remotion Lambda | Headless Node on AWS Lambda, MP4 output to S3 |
| PostHog + Vercel Analytics | Typed `analytics.ts` captures every key event. `PageTracker` fires `$pageview` on SPA route changes. |
