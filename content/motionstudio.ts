// ============================================================================
//  MOTIONSTUDIO CASE STUDY  —  /projects/motionstudio
//  Sourced from ARCHITECTURE.md. Edit this file to grow the page over time.
//  Add demo videos/screenshots to `media` (files go in /public/demos).
// ============================================================================
import type { Media } from "./data";

export const motionstudio = {
  title: "MotionStudio",
  status: "Live · Actively Building",
  year: "2026",
  role: "Personal project · solo build",
  tagline: "A browser-based video editor, built on Remotion.",
  links: {
    live: "https://motionstudio-six.vercel.app/",
    github: "https://github.com/BLAZE7SHADOW/MotionStudio",
  },
  intro:
    "Place text, images, video, audio and shader backgrounds on a canvas, arrange them on a frame-accurate timeline, animate them with keyframes and 22 text effects, and export to MP4 — in the browser or on the cloud. Projects auto-save locally and sync across devices when you're signed in. This page is the living build journal: the architecture, the decisions, and the bugs that taught me something.",

  // Drop demo videos / screenshots here as the build progresses.
  media: [
    { type: "image", src: "/images/canvas-editor-screenshot.png", caption: "The editor — assets panel, canvas, live properties, and a frame-accurate timeline, with text animation presets (Fade / Slide / Pop) on the right" },
    { type: "image", src: "/images/timeline-keyframes-screenshot.png", caption: "Keyframing a Position X animation (90 → 0 over 51 frames) — the keyframe bar sits directly on the layer's timeline track" },
    { type: "image", src: "/images/export-dialog-screenshot.png", caption: "One export dialog, two paths — Cloud Render on AWS Lambda with a live monthly render quota (4 of 5 remaining)" },
    { type: "image", src: "/images/MotionStudio.png", caption: "The editor today — canvas, properties panel, frame-accurate timeline" },
  ] as Media[],

  facts: [
    { num: "~5K+", label: "Lines of strict TypeScript" },
    { num: "7", label: "Engines — data & logic, zero UI" },
    { num: "85+", label: "Logically-grouped commits" },
    { num: "4", label: "Infrastructure layers — Vercel · Supabase · AWS Lambda · S3" },
  ],

  // ————— Why Remotion is the foundation —————
  remotion: {
    heading: "Why Remotion is the core bet",
    body:
      "The product renders real video. Remotion gives me frames as a first-class unit, <Sequence> for temporal composition, <Player> for in-app preview, and renderMedia for the actual encode — building a renderer and encoder myself would be months of work that teaches nothing about this product. The interesting engineering is everything I built on top of it:",
    points: [
      "**Frame-based temporal model** — every element carries `startFrame` + `durationInFrames`, mapped 1:1 onto `<Sequence from={startFrame}>`. Visibility is the half-open window `[start, start + duration)`. Frames, not seconds, because Remotion is frame-based and frames are exact — no floating-point drift.",
      "**One shared renderer = guaranteed WYSIWYG** — the editor canvas renders the *same* `MotionComposition` through a single Remotion `<Player>` (synced to the timeline frame), with selection, drag and resize as a transparent overlay on top. Preview, WebCodecs export and Lambda now run the *identical* component tree — WYSIWYG isn't \"we tried to match,\" the preview *is* the export pipeline.",
      "**Effects bought as source** — 22 Remocn text-effect components (per-character rise, typewriter, glitch, shimmer, highlights…) and 18 frame-synced WebGL shader backgrounds (mesh gradients, noise, warp, particles…), each lazy-loaded per preset and previewed live in a looping `<Player>` before you commit to it.",
      "**Animation on Remotion's primitives** — `interpolate` with `extrapolate: 'clamp'` so animations finish instead of extrapolating to infinity, and `spring` for physics (it needs `fps`, because a bounce is real-time). Multiple animations accumulate into one transform — factors multiply, offsets add — the same algebra compositors use.",
      "**Two export paths, one dialog** — a Browser tab (WebCodecs + OfflineAudioContext, in-process, Chrome/Edge only) and a Cloud Render tab (Remotion Lambda on AWS, any device, full 1080p, no local CPU). The same MotionComposition component powers both — the browser path encodes frames directly, the Lambda path renders the same composition in headless Node.",
      "**DOM video vs Remotion video** — the editor previews with a DOM `<video>` (seek on scrub for exact frames, play natively during playback, muted for reliable autoplay); the export uses `<OffthreadVideo>`, which is authoritative.",
    ],
  },

  // ————— The export pivot: from a CLI command to two production paths —————
  export: {
    heading: "The export pivot — from CLI to two production paths",
    story:
      "The original export was a Remotion CLI command generated by the app. It worked — if you were a developer willing to run a terminal command. For an actual end user it was unusable. That gap forced two separate solutions, each with a different tradeoff.",

    paths: [
      {
        name: "Browser export (WebCodecs)",
        subtitle: "Free · unlimited · Chrome/Edge only",
        how:
          "Each frame is rendered to a canvas using the same style.ts function the editor preview uses, then pushed into a VideoEncoder (WebCodecs API). Audio tracks are mixed frame-perfectly using OfflineAudioContext — a Web Audio context that renders faster than real-time, producing a precise AudioBuffer. Video frames and the audio buffer are muxed into an MP4 container using Mediabunny and downloaded directly to the user's device. No server, no round-trip.",
        why:
          "WebCodecs gives hardware-accelerated encoding in the browser. OfflineAudioContext eliminates the timing drift of real-time audio. Mediabunny handles the muxing complexity. The result is frame-perfect, audio-included output with zero infrastructure cost.",
        limits: "Chrome and Edge only (WebCodecs is not in Firefox/Safari). Large projects encode slowly on low-end hardware.",
      },
      {
        name: "Cloud render (Remotion Lambda)",
        subtitle: "Quota-based · any device · 1080p · AWS Lambda",
        how:
          "The user clicks Render in the Cloud Render tab. A Vercel serverless function verifies their JWT, checks their monthly quota against a Supabase renders table, and calls renderMediaOnLambda() from @remotion/lambda-client. A pre-deployed Lambda function (2GB memory, 120s timeout) renders the Remotion composition in headless Node, writes the output MP4 to S3, and returns a download URL. The serverless function polls getRenderProgress() until done, then returns the URL to the client. Media imported into the editor uploads to S3 in the background as soon as it's added — the browser keeps the blob: URL for local preview, and a storageUrl (a public S3 https:// link) is patched onto the asset once the upload completes, so Lambda has a real URL to fetch when it renders.",
        why:
          "This is the production path — the one that works on every device including mobile, Safari, low-end laptops. The render happens on dedicated infrastructure, not in the user's browser tab. The Lambda function is a standard Remotion deployment; the real engineering was the quota gate, the auth layer, and the background S3 upload around it.",
        limits: "2GB memory / 120s Lambda timeout caps how long or heavy a composition can be per render.",
      },
    ],
  },

  // ————— Auth, quota, and guest access —————
  auth: {
    heading: "Auth, quota, and guest access",
    body:
      "Three sign-in paths — Google OAuth, email/password (Supabase, with email confirmation flow), and anonymous guest (no sign-up required, 1 cloud render free). All auth state and actions live in a single useAuth hook; UI components call hook methods and never touch the Supabase client directly.",

    guestAbuse:
      "Anonymous sessions persist in localStorage — clearing it would give a user a new session and another free render. Solved with a device ID cookie: crypto.randomUUID() written to a 1-year cookie on first visit. The cookie survives localStorage clears. The API checks the device_renders table before allowing any anonymous render and records the device ID only after a confirmed successful output URL — failed renders don't consume the free slot.",

    apiLayer:
      "Four Vercel serverless functions (/api/render, /api/quota, /api/upload-url, /api/contact) sit between the client and AWS. Every render request is validated in four ordered gates: (1) JWT verified via Supabase admin client, (2) device cookie checked for anonymous users, (3) monthly render count checked against the renders table, (4) Lambda started — and only after all four pass. A failed render never consumes quota. Shared helpers in api/_lib/ (auth.ts, db.ts, device.ts) keep the handler logic thin and eliminate duplication across endpoints.",

    accountIsolation:
      "Projects are stored locally in IndexedDB. On every auth state change, AuthBridge (a non-rendering component in App.tsx) compares the new user ID to ms_last_user in localStorage. If they differ — a different account logged in, or a sign-out happened — it calls clearAll(), which resets the Zustand store and calls persist.clearStorage() to immediately wipe IndexedDB. User B never sees User A's projects.",
  },

  // ————— Tech stack, with the why —————
  stack: [
    { name: "Remotion", why: "Frames, <Sequence>, <Player>, renderMedia — the video engine. The one dependency the product is genuinely built around." },
    { name: "React 19 + TypeScript (strict)", why: "Discriminated-union element types; adding a new element type = one type + one renderer." },
    { name: "Zustand", why: "Global state with zero boilerplate: one create() → a hook + selectors. No providers, no reducers." },
    { name: "React Router v7", why: "/ dashboard, /editor/:projectId — the URL is the single input that selects a project." },
    { name: "react-moveable", why: "Drag/resize/rotate handles are a solved problem; rebuilding them is weeks of hit-testing math that teaches nothing about this product." },
    { name: "Remocn + shaders-react", why: "22 copy-paste Remotion text-effect components and 18 frame-synced WebGL shader backgrounds — animation polish bought as source in the repo and lazy-loaded per preset, not built from scratch." },
    { name: "Tailwind v4 + shadcn/ui", why: "Fast, consistent dark UI via design tokens; accessible primitives (Dialog, Popover, Select) without reinventing them." },
    { name: "IndexedDB + localStorage", why: "Client-only persistence, split by data shape: small JSON state in localStorage, large media blobs in IndexedDB." },
    { name: "Supabase", why: "Auth (Google OAuth, email/password, anonymous) + a renders table for quota, plus per-user JSONB project sync (RLS-scoped, 2s-debounced upsert). Service-role key stays server-side; publishable key in the browser." },
    { name: "Vercel Functions", why: "Four API endpoints — /api/render (Lambda trigger + quota gate), /api/quota (render count), /api/upload-url (presigned S3 PUTs), /api/contact (Resend email). Node.js, deployed alongside the SPA." },
    { name: "Remotion Lambda", why: "Cloud render path — headless Node on AWS Lambda, returns an S3 MP4 URL. Setup was configuration, not infrastructure engineering." },
    { name: "PostHog + Vercel Analytics", why: "Typed analytics.ts module captures every key event (auth methods, export starts/completions with duration, tab switches, undo/redo). PageTracker fires $pageview on every SPA route change." },
  ],

  // ————— Architecture —————
  architecture: {
    heading: "Two layers, one rule",
    diagram: `engines/   own DATA + LOGIC   (no UI)
features/  own UI             (compose engines)`,
    rule:
      "The Project is the aggregate root. One Project object owns all data — elements, assets, settings. Engines don't keep their own copies; they expose verbs that read and write the one Project through a single mutation point (updateProject). Everything downstream falls out of this: undo/redo hooks the one mutation point and covers every edit automatically, autosave persists the one Project with nothing to wire per-feature, and state drift is impossible because there's only ever one source of truth.",
    movesTitle: "The three data moves — immutability everywhere",
    moves: `add     → [...arr, x]
remove  → arr.filter(x => x.id !== id)
update  → arr.map(x => x.id === id ? { ...x, ...patch } : x)`,
    movesWhy:
      "React and Zustand detect change by reference identity, and undo snapshots must stay frozen. A single .push() would skip re-renders and corrupt history.",
  },

  engines: [
    { name: "project", owns: "The projects array (aggregate root) + undo history + persistence", note: "The only real store" },
    { name: "editor", owns: "Ephemeral view state: selection, current frame, playing, zoom", note: "Deliberately not persisted" },
    { name: "canvas", owns: "Verbs: addText/Image/Video/Audio, updateElement, removeElement, reorderLayer", note: "A hook, not a store — owns no data" },
    { name: "timeline", owns: "Pure frame ↔ pixel math", note: "Stateless helpers" },
    { name: "animation", owns: "interpolate / spring evaluation + presets", note: "Pure functions" },
    { name: "rendering", owns: "The shared style.ts + Remotion MotionComposition", note: "One renderer, two consumers" },
    { name: "asset", owns: "Upload, metadata probing, blob persistence", note: "Reads/writes project.assets" },
  ],
  enginesWhy:
    "Why some engines are stores and others are hooks: a store owns state (Project, Editor). A hook owns verbs over state it doesn't hold — Canvas and Asset read the active project and write back via updateProject. Keeping element data on the Project, not in the Canvas engine, is the aggregate root enforced.",

  // ————— Core systems —————
  systems: [
    {
      title: "Composition-space coordinates",
      body:
        "Elements are stored in output resolution (16:9 = 1920×1080), not screen pixels; the editor renders a scaled view. The export must match the editor — store coordinates once at final resolution and every view (editor at ~50%, Remotion at 100%) just multiplies by its own scale. This one conversion powers canvas dragging, drop-to-canvas, and scrubbing.",
      code: `data → screen : × scale   (shrink to fit the window)
screen → data : ÷ scale   (grow a drag back to real coords)`,
    },
    {
      title: "Timeline coordinate math",
      body:
        "The same idea, on the time axis. Dragging a clip to retime it is updateElement(id, { startFrame }) — the same verb as canvas dragging, through the same door.",
      code: `pxPerFrame  = trackWidth / totalFrames
frameToX(f) = f × pxPerFrame          (draw a clip / ruler tick)
xToFrame(x) = round(x / pxPerFrame)   (scrub / drag)`,
    },
    {
      title: "Time-based playback clock",
      body:
        "Playback advances by real elapsed time × fps, not currentFrame++ per animation frame. requestAnimationFrame fires at the monitor's rate — 60 or 120Hz, dropping under load — so frame++ would play 30fps content at 60fps on a 60Hz screen. Measuring wall-clock time keeps speed correct on any hardware.",
    },
    {
      title: "Animation engine — accumulate, don't replace",
      body:
        "Built on Remotion's interpolate (with extrapolate: 'clamp' so animations finish instead of running off to infinity) and spring (physics/overshoot — it needs fps because a bounce is real-time). Multiple animations on one element accumulate into a single transform: scale factors multiply, position offsets add — the same algebra a compositor uses. That's why a Fade In and a Slide Up stack cleanly instead of one clobbering the other.",
      code: `value  = base × Π(scaleFactors) + Σ(offsets)
finish = extrapolate:'clamp'   (no infinite extrapolation)`,
    },
    {
      title: "Persistence, split by data shape",
      body:
        "Object URLs die on reload, so the bytes are persisted and a fresh URL is minted each session. localStorage can't hold large binaries; IndexedDB is built for Blobs. Editor view state is intentionally not persisted — you don't want to reopen frozen mid-playback. For signed-in users, projects also sync to Supabase: on login the cloud copy is the source of truth, and a 2s-debounced upsert pushes each project as a JSONB row (RLS-scoped per user), so work survives session expiry, localStorage wipes and device switches. Because everything is one Project object, cloud sync was one table and ~40 lines.",
      code: `metadata (JSON, small)  → localStorage (Zustand persist) + Supabase (cloud, per user)
media bytes (binary)    → IndexedDB (local) + S3 (public URL for Lambda)`,
    },
    {
      title: "Undo/redo — snapshots + coalescing",
      body:
        "History is snapshots of the projects array. Because edits build new objects immutably, snapshots share unchanged sub-objects — no deep copies. Rapid edits within ~500ms coalesce into one step, so a whole drag or a typing burst is one undo. It was nearly free to build, because every edit already flows through updateProject.",
    },
  ],

  // ————— Problems & fixes (the war stories) —————
  problems: [
    {
      problem: "Every cloud render crashed with a raw \"supabaseUrl is required.\" on every single frame — while the browser app worked fine. Root.tsx imported getCompositionDimensions from the engines/project barrel, which also re-exported cloudSync.ts, which imported a Supabase client built with createClient() at module top-level. Remotion's bundler doesn't replace Vite's import.meta.env.VITE_* syntax, so the URL came through undefined in the Lambda/CLI bundle — throwing on construction before a frame rendered.",
      fix: "Made the client a lazy getSupabase() instead of an eager top-level singleton, so importing the module transitively (via a barrel) no longer has a side effect. Lesson: a top-level createClient() in a file a render entry can reach is a landmine — the render bundle isn't the app bundle.",
    },
    {
      problem: "Fixing the code didn't fix the render. After the lazy-getSupabase() fix shipped to Vercel, cloud renders still failed with the identical error.",
      fix: "The Lambda-executed bundle is a separate artifact in S3 that a Vercel deploy never rebuilds — REMOTION_SERVE_URL points at it. Added npm run deploy:lambda-site (remotion lambda sites create) and ran it to push the fixed bundle. Any change reachable from src/remotion/index.ts needs that command re-run, or cloud renders keep executing the old bundle while the rest of the app looks fully deployed.",
    },
    {
      problem: "Omit on a discriminated union silently collapses to common fields — updateElement lost content, assetId, and friends with no error.",
      fix: "An ElementPatch type: the intersection of per-member partials, so every field of every union member is patchable.",
    },
    {
      problem: "Remotion's <Composition> inferred props as unknown. An interface isn't assignable to Record<string, unknown> — it could be augmented later; a type alias is.",
      fix: "Changed interface ExportProps to type ExportProps. One keyword, fixed inference.",
    },
    {
      problem: "contenteditable cursor jumped to the start on every keystroke — React re-rendering the element reset the DOM selection.",
      fix: "Set initial text via a ref on mount only, then let onInput push to the store without React re-writing the node.",
    },
    {
      problem: "react-moveable under a scaled canvas: element coords are composition-space but the stage is scaled, so handles and elements disagreed.",
      fix: "Drive drag/resize with client-pixel deltas ÷ scale, committing composition coords on release.",
    },
    {
      problem: "Layer reorder did nothing. The first attempt shuffled array order — but stacking is driven by zIndex, not array order.",
      fix: "Rewrote it to reassign contiguous zIndex values.",
    },
    {
      problem: "Undo stepped pixel-by-pixel — a clip drag commits on every pointer-move, so one drag became dozens of undo steps.",
      fix: "Time-based coalescing groups edits within ~500ms into one history step, so a whole drag (or a typing burst) is a single undo.",
    },
    {
      problem: "Undo restored dead blob: URLs — asset rehydration went through updateProject and entered history.",
      fix: "Rehydration became a silent update ({ history: false }).",
    },
    {
      problem: "blob: URLs can't be rendered in Node/Lambda — browser-only object URLs are meaningless to a headless renderer on AWS, so cloud renders came out with missing media.",
      fix: "Assets upload to S3 in the background at import time (presigned PUT from /api/upload-url), the asset is patched with a public storageUrl, and the Export dialog remaps blob: → storageUrl before invoking Lambda. The browser keeps the blob: URL for instant local preview.",
    },
    {
      problem: "shadcn's CLI wrote generated components to a stray root @/ folder instead of src/.",
      fix: "The root tsconfig.json was missing paths — added it so @/ resolves to src/, and the CLI landed files where they belong.",
    },
    {
      problem: "White-on-white text: default text color was #ffffff on a white canvas. Invisible, and no error anywhere.",
      fix: "A default that contrasts with the canvas — and a lesson that \"no crash\" ≠ \"correct.\"",
    },
    {
      problem: "supabase-js .throwOnError() on count queries returned an error object with an empty message string — impossible to debug.",
      fix: "Replaced the supabase-js query with a direct fetch() to the Supabase REST API with explicit apikey and Authorization headers. The same query, raw HTTP, returned the actual error. Lesson: the abstraction was hiding the signal.",
    },
    {
      problem: "Supabase's new sb_secret_ key format caused 403s on the renders table even with the correct key value.",
      fix: "Switched back to the older JWT eyJ... format keys from the Supabase dashboard. The new format wasn't compatible with the supabase-js version in use.",
    },
    {
      problem: "renderMediaOnLambda() failed with 'remotion-lambda-role not found' despite correct AWS credentials.",
      fix: "The IAM role must be created manually: AWS Console → Roles → Create role → Lambda use case → attach the inline policy from npx remotion lambda policies role. The Remotion CLI doesn't create it.",
    },
    {
      problem: "Version mismatch: remotion at 4.0.483, @remotion/lambda-client at 4.0.488. Silent failures, no helpful error.",
      fix: "Pinned all Remotion packages to the exact same version (removed ^ prefix in package.json). Remotion packages must be at the exact same version across the tree.",
    },
    {
      problem: "404 after Google OAuth redirect on Vercel — the SPA route /dashboard didn't exist as a file.",
      fix: "Added a catch-all rewrite to vercel.json: { source: '/(.*)', destination: '/index.html' }. React Router handles routing client-side; Vercel just needs to serve index.html for every non-API path.",
    },
    {
      problem: "RLS blocked the service_role key from inserting into the renders table, even though service_role is supposed to bypass RLS.",
      fix: "The table was created with 'Automatically expose new tables' OFF, so the service_role had no grants at all. Explicit GRANT SELECT, INSERT, UPDATE, DELETE ON public.renders TO service_role was required.",
    },
  ],

  // ————— Honest limitations —————
  tradeoffs: [
    "Browser export needs Chrome or Edge (WebCodecs isn't in Safari yet); the Lambda cloud render covers every other device.",
    "Editor audio/video preview is muted and autoplay-dependent; the export is authoritative for sound and timing.",
    "Dashboard and editor are desktop-only (≥1024px) — below that a DesktopOnlyGate shows a \"use a bigger screen\" message; the landing page and sign-in stay fully responsive.",
    "Project JSON syncs across devices, but asset bytes stay in local IndexedDB — S3 copies exist only for Lambda's use.",
    "No scene grouping yet — sequencing is done by positioning clips on the timeline.",
    "Fonts fall back to system sans-serif in the Node render (not bundled yet).",
  ],

  payoffs: [
    { decision: "Project as aggregate root", payoff: "Undo/redo + autosave added at one point, covered everything" },
    { decision: "Engines own verbs, not state", payoff: "No state drift; features stayed thin and composable" },
    { decision: "One shared renderer", payoff: "WYSIWYG guaranteed, not hoped for" },
    { decision: "Player-based editor canvas", payoff: "Remocn text effects, video, and audio all preview for free — one render path, no editor/export drift" },
    { decision: "One Project object", payoff: "Cloud sync was one Supabase table and ~40 lines — nothing wired per feature" },
    { decision: "Composition-space coords", payoff: "Editor preview = export, at any zoom" },
    { decision: "Frames + <Sequence>", payoff: "Timeline maps directly onto Remotion; export just works" },
    { decision: "Immutable updates", payoff: "Cheap undo (structural sharing) + reliable re-renders" },
    { decision: "Discriminated-union elements", payoff: "New element type = one type + one renderer" },
    { decision: "Centralized useAuth hook", payoff: "Zero auth logic leaks into UI components — they call hook methods, never Supabase directly" },
    { decision: "Typed api client (apiClient.ts)", payoff: "Bearer token injection is automatic — impossible to forget on a new endpoint" },
    { decision: "Device ID cookie for guest limiting", payoff: "Abuse prevented without requiring accounts — localStorage clears don't help" },
    { decision: "AuthBridge + clearAll()", payoff: "Data isolation between users on a shared device, with no per-feature wiring" },
    { decision: "Record device render after success", payoff: "Failed Lambda renders don't consume the guest's one free slot" },
    { decision: "Background S3 upload + storageUrl patch", payoff: "Uploaded media now renders on Lambda too — blob: URLs stay local for preview, S3 URLs go to the cloud path" },
  ],

  lessons: [
    "A single mutation path is a superpower — it's what made undo, autosave, and WYSIWYG cheap. Decide where data changes before deciding how.",
    "Store data in the target domain (output resolution, frames), not the view's units — views come and go, the data shouldn't.",
    "\"No error\" isn't \"correct\" — white-on-white text and silent Omit-on-union both shipped zero warnings.",
    "Buy the boring parts (moveable handles, encoding) and build the parts that are actually your product: the composition model, the timeline, the animation system.",
    "The CLI export was always the wrong tool for end users — they can't run terminal commands. The gap wasn't a missing feature; it was a missing distribution model. Building both the browser path and the Lambda path was the actual product work.",
    "Remotion Lambda: a cloud render pipeline was 20 minutes of configuration, not months of infrastructure. The interesting engineering was the quota gate, the auth layer, and the device cookie — not the renderer itself. Know what to buy.",
    "Never trust the client. JWT is verified server-side first, quota checked second, Lambda called third — always in that order. The client supplies the token; the server decides what it means.",
    "Abstractions that hide errors are worse than no abstraction. supabase-js returning an empty error string sent us down a 2-hour debugging path. The direct fetch to the REST API returned the actual problem in 10 seconds.",
  ],
};
