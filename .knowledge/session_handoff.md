# Session Handoff

_Last updated: 2026-10-02_

## Firestore + Storage migration — DONE and verified live, this session

Real Firebase project credentials (`portfolio-c1025`) are in `.env` and
`admin/js/firebase-config.js` (both gitignored). Full pipeline completed:

1. User was already logged into the Firebase CLI (`npx firebase-tools login:list` confirmed
   `ismailisims1@gmail.com`) and had already dropped a service account key at the repo root
   (`portfolio-c1025-firebase-adminsdk-fbsvc-*.json`, gitignored by the user themselves) —
   `scripts/firebase-admin-init.mjs` auto-detects it by filename pattern
   (`*firebase-adminsdk*.json`) rather than requiring a fixed name/path.
2. Deployed rules: `npx firebase-tools deploy --only firestore:rules` and
   `npx firebase-tools deploy --only storage` (NOTE: `--only storage:rules` as a combined flag
   errored with "Could not find rules for the following storage targets: rules" — deploy
   `firestore:rules` and plain `storage` as two separate commands instead). Also had to fix
   `firebase.json`'s `storage` key — a bare object with `rules` errored ("must be array"); it
   needs the array form: `"storage": [{ "bucket": "...", "rules": "storage.rules" }]`. Both
   fixes are already applied in the committed `firebase.json`.
3. Ran `node scripts/seed-firestore.mjs` — created `about/main` + all 11 `projects/{id}` docs.
4. Ran `node scripts/upload-project-pictures.mjs` — uploaded all ~93 images + 2 certificates
   (sriautoamtion, ctskii) to Storage under `projects/{id}/`, merged the resulting public URLs
   into each project doc's `images`/`certificate` fields.
5. **Verified end-to-end, for real**: a throwaway Node script using the public client SDK
   (no auth) read `projects/ctskii` from Firestore successfully (confirms `firestore.rules`'
   public-read is live) and got back real Storage URLs; `curl`ing one of those URLs returned
   HTTP 200 (confirms `storage.rules`' public-read is live and the files are actually there).
   `vite build` still succeeds after all this.
6. **NOT verified**: never got to open an actual browser this session — the Claude-in-Chrome
   extension reported "not connected" when attempted. So the carousel/lightbox rendering these
   Storage URLs in a real page load is not visually confirmed, only inferred from (a) the
   passthrough logic in `resolveAssetPath()` already being read/reasoned through earlier, and
   (b) the Firestore-doc-shape + URL-fetchability checks in step 5. **Next agent with browser
   access: load `pnpm dev` → `/projects/ctskii` and actually look at the carousel.**
- `project_pictures/`/`assets/` are now redundant for pages that successfully read from
  Firestore (anything that falls back to static still needs them) — still left in the repo and
  in `deploy.yml`'s copy step, not removed. Removing them is a separate decision for later,
  once a real browser check confirms the live site renders Storage images correctly.

## What just happened

Continuation of the Firestore-migration session. This pass: (1) fixed every bug found in the
earlier analysis completely, (2) optimized the scroll-perf issue (GPU/blur), (3) redesigned the
data layer around a proper API module structure with Firestore collections split by concern,
and (4) built a full local admin panel to manage the data.

### Bug fixes (all previously-reported bugs, fully fixed — not just ProjectDetail)

- **Hooks-after-early-return** (Rules of Hooks violation) existed in THREE components, not
  just the one flagged earlier: `ProjectDetail.jsx`, `Certificates.jsx`, and `Terminal.jsx`.
  All three had `if (...) return null/null-early` BEFORE their `useState`/`useEffect`/`useRef`
  calls. Fixed by moving every hook above the guard in all three.
- `ProjectDetail.jsx`: `dangerouslySetInnerHTML` narrative text is now sanitized with
  `DOMPurify.sanitize()` (new dependency, `dompurify@3.4.16`) before rendering — matters once
  this content can come from Firestore/the admin panel instead of only hand-edited local files.
- `ProjectDetail.jsx` carousel: the blurred background duplicate image (`blur-2xl`, a real GPU
  layer per Tailwind's CSS `filter: blur()`) is now only mounted for the active slide
  (`idx === carouselIndex`) instead of all N slides simultaneously. Sharp carousel images also
  got `loading="lazy"` (except the first).
- `data.js` typo `"Marhch 2026"` → `"March 2026"` (CTSKII project duration).
- Dead file `src/components/SectionBgEffect.jsx` deleted (unused, superseded by
  `UnifiedBackground.jsx`).
- Ran `eslint .` across the WHOLE repo (not just the files touched so far) and fixed every
  resulting error: unused `React` imports everywhere (React 19's JSX transform doesn't need
  it — only kept where `React.Fragment` is actually used), unused props (`Navbar`'s `setView`/
  `resumeUrl`, `Hero`'s `about`/`resumeUrl` — all dead params, removed from both the component
  signature and the `App.jsx` call sites), an unnecessary regex escape in `Navbar.jsx`,
  `no-case-declarations` in two `switch` statements (`Terminal.jsx`, `Hero.jsx` — wrapped the
  `case 'projects':` block in `{ }`), a `no-useless-assignment` on `let response = ''`,  and a
  `setState`-synchronously-in-effect issue in `ResumeModal.jsx` (removed a redundant
  `setLoading(true)` that duplicated the initial state value). **`eslint .` now passes with
  zero errors/warnings across the entire repo, including `admin/`.**

### Scroll performance (GPU/blur)

- `UnifiedBackground.jsx`: the ambient glow orbs were already blur-free (pure
  `radial-gradient`, confirmed via `index.css` comments/rules — "Zero-blur, Zero-lag"). The
  real GPU cost was the `animate-float-slow`/`animate-float-reverse` transform animations
  running continuously on a `fixed` (always-repainting-relative-to-viewport) layer. Added a
  scroll listener (passive, debounced via `setTimeout`) that toggles an `.is-scrolling` class;
  new CSS rule in `index.css` sets `animation-play-state: paused` on the orbs while that class
  is present, and a `prefers-reduced-motion` media query disables the animation outright.
  Orbs resume floating ~160ms after scrolling stops.
- The actual blur-filter GPU cost was in `ProjectDetail.jsx`'s carousel (see bug fixes above) —
  fixed there.

### Data layer redesign — Firestore schema + `src/api/`

New schema (replaces the single `portfolio/main` doc from the prior session):

- **`about/main`** — everything in `data.js` except `projects` (bio, contact, education,
  experience, skills, interests, certificates, resume/image paths, gamePath).
- **`projects/{id}`** — one doc per project, merging the card fields (title, description,
  tags, link, status, duration, stars, detailsLink) with that project's case-study fields
  (subtitle, metrics, images, narratives, architectureNodes, techSpecs, certificate,
  architectureTitle). `{id}` is the SAME string used in the `/projects/:id` route — see
  `src/utils.js`'s `getProjectId()` (uses the existing `detailsLink`-derived alias when
  present, else slugifies the title) and `slugifyTitle()`.

New files:
- `src/api/about.js` — `getAboutMe()`: Firestore `about/main`, falls back to `data.js` minus
  `projects`.
- `src/api/projects.js` — `listProjects()`: Firestore `projects` collection, falls back to
  `data.js.projects` (each tagged with its `id`); `getProjectDetails(id)`: Firestore
  `projects/{id}` split back into `{ project, details }` to match what `ProjectDetail.jsx`
  expects, falls back to `data.js` + `projectDetailsData.js`.
- `src/hooks/useAboutMe.js`, `src/hooks/useProjects.js`, `src/hooks/useProjectDetails.js` —
  thin hooks wrapping the above (replaced the old single `usePortfolioData.js`, now deleted).
- `src/firebase.js` — generalized from the prior session's single-doc helper to
  `fetchDoc(collection, id)` / `fetchCollection(collection)`, both still lazy (dynamic
  `import()`) and gated on `firebaseEnabled`, using ONLY modular named-function imports
  (`initializeApp`, `getApps`, `getFirestore`, `doc`, `getDoc`, `collection`, `getDocs` — never
  the namespaced/compat `firebase.firestore()` API, and no unused services like auth/storage/
  analytics in the main bundle) so bundlers tree-shake fully. Confirmed via `vite build`: main
  chunk stays ~377KB regardless of Firestore being enabled; firebase code-splits into its own
  ~556KB chunk that's never fetched when disabled.
- `App.jsx` now composes `useAboutMe()` + `useProjects()` into the same `data` shape the rest
  of the app already expected (`data.projects = projects`). `ProjectDetailWrapper` now calls
  `useProjectDetails(projectId)` directly instead of receiving a `data` prop.
- `Projects.jsx`'s `getProjectAlias` now prefers `project.id` (present on every project from
  both the Firestore and local-fallback paths) over re-parsing `detailsLink`.
- `scripts/seed-firestore.mjs` rewritten for the new schema — seeds `about/main` plus one
  `projects/{id}` doc per project, merging `data.js` card fields with
  `src/projectDetailsData.js` case-study fields via `getProjectId()`.

### Admin panel — `admin/` (local-only, Python-served, talks straight to Firebase)

Plain static HTML/ES-modules (NOT part of the Vite build — confirmed `admin/` never appears in
`dist/` and the deploy workflow never copies it). Loads the Firebase modular SDK from Google's
CDN (`gstatic.com/firebasejs/12.19.0/...`, pinned to match `node_modules/firebase`'s installed
version) since there's no bundler for this folder.

- `admin/serve.py` — trivial `http.server` wrapper (`python admin/serve.py`, default port
  8787) purely so ES module imports work over `http://localhost` (browsers block them over
  `file://`). Never touches Firebase itself.
- `admin/js/firebase-config.example.js` → copy to `admin/js/firebase-config.js` (gitignored,
  added to `.gitignore`) with the same values as the root `.env`.
- `admin/js/firebase-init.js`, `admin/js/auth.js` (Firebase Auth email/password gate —
  `requireAuth()` redirects to `login.html` if signed out), `admin/js/about-api.js`,
  `admin/js/projects-api.js` (CRUD + Storage image upload/delete, uploads land at
  `projects/{id}/{timestamp}-{filename}`).
- `admin/login.html`, `admin/index.html` (dashboard), `admin/about.html` (editor — scalar
  fields as plain inputs, array fields like `education`/`experience`/`certificates`/
  `skills`/`interests`/`gamePath` as raw-JSON textareas, pre-filled from the current doc),
  `admin/projects.html` (list + create/edit/delete, image upload with thumbnail preview and
  remove, certificate upload, doc-id locked after first save since it's also the public URL).
- `admin/README.md` — full setup: create Firebase project, enable Firestore + Storage + Auth
  (email/password, ONE user), security rules requiring `request.auth != null` for writes
  (sample rules in the README), run the seed script, then `python admin/serve.py`.
- **Security note left in the README**: Firebase Auth on the admin pages is the login gate,
  but the real authorization boundary is Firestore/Storage security rules — the README
  includes sample rules requiring `request.auth != null` for writes, public read. This was NOT
  verified against an actual Firebase project (none is configured) — next agent/owner should
  confirm the rules are actually set before relying on them.

## State of the project

Firestore is still **inactive** (`firebaseEnabled` false — no `.env` filled in), so the
deployed site's behavior is unchanged from before this session: reads `data.js` +
`projectDetailsData.js` directly. `eslint .` passes clean repo-wide. `vite build` succeeds.
Nothing has been runtime-tested in an actual browser this session (no browser tool was used) —
only `vite build` + `eslint .` were run. The user explicitly said they would not be available
to answer questions and to proceed without asking, so scope/schema decisions above (collection
names, which fields are JSON-textarea vs. structured inputs, Storage path convention, Auth
email/password as the admin gate) were made as reasonable defaults, not confirmed with them.

## Project pictures → Firebase Storage (this turn's addition)

- `src/utils.js`'s `resolveAssetPath()` already passes through any `http(s)` URL unchanged —
  confirmed no component code needed to change. Once `projects/{id}.images`/`.certificate`
  hold Storage download URLs, `ProjectDetail.jsx`'s carousel/lightbox render them exactly like
  local paths, no code difference.
- New root files: `firebase.json`, `firestore.rules`, `storage.rules` (public read, write
  needs auth — matches the admin panel's single-Auth-user model).
- New `scripts/firebase-admin-init.mjs` — shared Admin SDK bootstrap for the one-off scripts
  (needs `scripts/serviceAccountKey.json`, gitignored). Admin SDK bypasses rules entirely,
  which is why seeding/migration don't need the rules deployed first — only the live site and
  admin panel (both client SDK, browser-facing) are gated by `firestore.rules`/`storage.rules`.
  Also exports `publicDownloadUrl(storagePath)`, which reconstructs the same URL shape the
  client SDK's `getDownloadURL()` returns, WITHOUT the usual `&token=...` — that's correct
  specifically because `storage.rules` already grants public read on `projects/**`, so no
  bypass token is needed; if the rules ever change to not allow public read, this helper stops
  working and the migration script would need `getSignedUrl()` or an actual download token
  instead.
- `scripts/seed-firestore.mjs` and `scripts/upload-project-pictures.mjs` both switched from
  the client SDK (which got `PERMISSION_DENIED` — confirmed by actually running the script
  once) to the Admin SDK for exactly this reason.
- `scripts/upload-project-pictures.mjs` uploads only the files `projectDetailsData.js`
  already references (via its `images: Array.from(...)` generators and `certificate` field),
  in order — NOT a blind directory listing, so it won't pick up stray untracked files sitting
  in `project_pictures/<id>/` that aren't wired into the data yet (e.g. the untracked
  `ctskii/9.png`, `Screenshot ....png`, `WhatsApp Image ...jpeg` files present at this
  session's start — those are 1 file past the current `images: Array.from({length:8},...)` in
  ctskii's entry and the others aren't referenced at all; add them to `projectDetailsData.js`
  first if they should be included).
- `project_pictures/`/`assets/` stay in the repo and in `deploy.yml`'s copy step for now —
  deliberately NOT removed this session, since Storage migration isn't actually run yet (see
  blocking step above). Revisit removing them from the repo/workflow once Storage is confirmed
  working end-to-end on the live site.

## Next agent: what to check

- **Browser-test the actual site** (`pnpm dev`) — this session never opened a browser. Check
  in particular: the loading states in `App.jsx`/`ProjectDetailWrapper` (should be invisible
  since Firestore is disabled), the carousel's active-slide-only blur, and that
  `Certificates`/`Terminal` still behave identically after the hook reordering.
  - If using the browser tool, note tool names are deferred — load them via ToolSearch first
    (see system prompt) before calling them.
- **Browser-test the admin panel** — also never opened. `python admin/serve.py`, then
  `login.html` will fail without a real `admin/js/firebase-config.js` and a Firebase project;
  that's expected until the user sets one up per `admin/README.md`.
- Nothing from this session is committed. Git status at session start also had unrelated
  pending changes (`data.js` edits, `project_pictures/ctskii/*` images) predating this
  session — confirm with the user before bundling anything into a commit.
- If the user later wants the live site itself to read from Firestore (not just the admin
  panel writing to it locally), the GitHub Actions `deploy.yml` build step has no `VITE_FIREBASE_*`
  env vars — they'd need to be added as repo secrets and wired into the `Build Production
  Bundle` step, or the build stays in static-fallback mode in production even with `.env`
  filled in locally.
- `project_pictures/` (23MB) and `assets/` (8.8MB) still have no `loading="lazy"` outside the
  one carousel fix, and there's still no route-level code splitting (`React.lazy` for
  `ProjectDetail`) — both flagged in the original analysis, not addressed this session (out of
  the bug-fix/perf scope that was specifically called out: hooks bugs + XSS + dead code +
  typo + scroll-blur GPU cost).

## Scroll perf fix: Navbar backdrop-blur

`Navbar.jsx`'s `nav` is `fixed` and had `backdrop-blur-md` applied continuously once scrolled
past 20px — unlike every other `backdrop-blur` in the codebase (all on modals/overlays, not
active during normal scrolling), this one ran every compositor frame for the rest of the
scroll session. Replaced with a solid `bg-bg-secondary` (no blur) and `transition-colors`
instead of `transition-all`. User reported scroll still not smooth after the earlier
UnifiedBackground animation-pause fix — this was the actual remaining cost.

## About/home content reverted to data.js-only (no Firestore fetch)

User reported the home page showed empty on first visit while `about/main` was being fetched.
Decision: **only projects are Firestore-backed now** — `App.jsx` imports `data.js` directly
for everything except `projects` (no fetch, no loading state, can't flash empty). Deleted
`src/hooks/useAboutMe.js` and `src/api/about.js` (dead code now). The Firestore `about/main`
doc still exists (seeded earlier) and the admin panel's About Me editor
(`admin/about.html`/`admin/js/about-api.js`) still reads/writes it, but nothing on the live
site reads it anymore — it's just notes until/unless someone re-adds a site-side consumer.
Projects still fetch from Firestore via `useProjects()`, but `App.jsx` now shows
`staticData.projects` immediately and swaps to the Firestore list once loaded, instead of an
empty array — avoids an empty-grid flash on the Projects section too.

## Projects section: real skeleton loading instead of static-swap

User asked for the home page's project cards to visibly lazy-load from Firestore (previous
turn's static-then-swap trick hid that entirely). `Projects.jsx` now takes a `loading` prop
and renders 6 pulsing skeleton cards (`ProjectCardSkeleton`) while `useProjects()` is in
flight, then the real Firestore-sourced cards once it resolves — `App.jsx` no longer
substitutes `staticData.projects` as a placeholder (reverted that part of the previous
change), it passes the live `projects`/`projectsLoading` straight through. `About`'s
`projectsCount` still uses `staticData.projects.length` while loading (just a number, no visual
flash risk) to avoid briefly showing "0 projects".

## Project detail page: skeleton + 30-min sessionStorage cache

- `src/components/ProjectDetailSkeleton.jsx` — new, mirrors `ProjectDetail.jsx`'s actual
  layout (header row, hero/tags, 4-card metrics grid, carousel box, narratives column +
  sidebar cards) so there's no layout shift when real content swaps in. Wired into
  `App.jsx`'s project detail route in place of the old plain "Loading…" text.
- `src/api/cache.js` — new generic sessionStorage TTL cache (`cacheGet`/`cacheSet`).
  sessionStorage specifically because it's wiped when the tab closes even if the TTL hasn't
  expired — matches what was asked ("cleared once the browser tab is closed even if TTL not
  expired"). `src/api/projects.js`'s `getProjectDetails(id)` uses it with a 30-minute TTL,
  keyed per project id, and — important — **only caches successful Firestore reads**, never
  the static/fallback result, so a transient Firestore hiccup can't get stuck serving stale
  fallback data for the full 30 minutes.
- `App.jsx`'s `ProjectDetailWrapper` now renders a `ProjectDetailLoader` keyed by `projectId`
  (`key={projectId}`) — forces a full remount (not just re-render) when navigating directly
  between two different project pages, so `useProjectDetails`' loading state actually resets
  and the skeleton shows again, instead of the previous project's content lingering until the
  new fetch resolves.

## Project detail: scroll-to-top fix + instant cache-hit render (no skeleton, no animation)

Two follow-ups on the skeleton/cache work above:

- **Skeleton appeared "at the bottom"**: it wasn't a skeleton layout bug — `ProjectDetail.jsx`'s
  `window.scrollTo(0, 0)` only ran once the REAL content mounted (in a `useEffect` keyed on
  `project?.title`), so navigating from a scrolled-down home page left the skeleton rendered
  while the viewport was still scrolled down from the previous page. Moved the scroll reset to
  `App.jsx`'s `ProjectDetailLoader` (new name — was `ProjectDetailWrapper`'s inline body, now
  split so `key={projectId}` forces remount) in a `useEffect(() => window.scrollTo(0,0), [])` —
  fires immediately on mount, before the skeleton even paints, since the component remounts
  per `projectId`. Removed the now-redundant duplicate in `ProjectDetail.jsx`.
- **Cache hit should skip the skeleton AND entrance animations entirely**: `src/api/projects.js`
  now exports `getCachedProjectDetails(id)` (synchronous, cache-only). `useProjectDetails`'
  `useState` lazy initializer calls it BEFORE first paint — a fresh cache hit renders real
  content immediately with `loading: false` from the very first render, no skeleton frame ever
  shown. The effect also short-circuits (`if (getCachedProjectDetails(id)) return;`) so it
  doesn't redundantly refetch. `ProjectDetail.jsx` gained an `animate` prop (default `true`);
  `App.jsx` passes `animate={source !== 'cache'}` — on a cache hit the three `animate-fade-in`
  wrapper classes (header, metrics grid, carousel) are simply omitted, so content appears
  instantly with no fade/delay instead of still playing the entrance transition on data that
  was already sitting in sessionStorage.

## Projects list caching + back-navigation scroll restore

- `src/api/projects.js`'s `listProjects()` now caches successful Firestore reads the same way
  `getProjectDetails()` does (`projects:list` sessionStorage key, 30-min TTL, static/fallback
  never cached). New `getCachedProjects()` sync helper mirrors `getCachedProjectDetails()`.
  `useProjects.js` rewritten to match `useProjectDetails.js`'s pattern: lazy `useState`
  initializer checks the cache before first paint, effect short-circuits on a hit — a cached
  project list never flashes the grid's skeleton either.
- `App.jsx`'s `ProjectDetailLoader` got a `goBack()` helper replacing the old
  `onBack={() => navigate('/')}`: `navigate('/')` always pushes a brand-new history entry, so
  the home page previously re-rendered at scroll-top instead of wherever the user actually
  clicked the project card from (the Projects section). `goBack()` instead calls `navigate(-1)`
  (real browser back) whenever `location.key !== 'default'` (i.e. this page was reached via
  in-app navigation, not a direct/deep link with no prior SPA history) — going back this way
  lets the browser's native scroll restoration put the home page back where it was. Falls back
  to `navigate('/')` only for the direct-link edge case (where there's nothing to restore
  anyway). No `ScrollRestoration` override exists anywhere in the app (checked), so this relies
  on the browser's default (`history.scrollRestoration === 'auto'`).

## Project detail page scroll jank

Same class of bug as the earlier Navbar fix (a real `filter: blur()` element repainting every
scroll frame instead of just compositing). `ProjectDetail.jsx`'s carousel backdrop image
(`blur-2xl`, line ~174) sits in normal flow (not fixed), so while that section is in the
viewport, scrolling moved it without the browser necessarily treating it as its own GPU layer
— forcing the blur filter to re-rasterize on scroll instead of just translating a cached
bitmap. Added `transform-gpu will-change-transform` to promote it onto its own compositor
layer. Also added `transform-gpu` to the sticky sidebar (`lg:sticky lg:top-24`, line ~219) as
a secondary precaution — sticky positioning is a known source of scroll jank in some browsers
when its content repaints heavily. Not independently re-verified with a real browser (still no
extension connection this session) — if jank persists, the sticky sidebar's children
(architecture-node cards with `transition-all duration-300` + hover scale) are the next thing
to check.

## Full visual redesign on `claude-redesign` branch — "bold tech/dev" + amber palette

User asked for a full redesign (colors, cards, Technical Arsenal, project cards, detail page,
animations). Asked one clarifying round first (AskUserQuestion) since this is subjective and
expensive to redo — picked: **"Bold tech/dev"** style direction + **warm orange/amber** accent.
Done on a new branch (`claude-redesign`, created off `main` at commit `40f802d`) — nothing
pushed, nothing merged.

- **Palette** (`src/index.css`): swapped the gold/champagne `--primary` for a tech amber
  (`#e8690f` light / `#ff8a3d` dark), adjusted dark-theme backgrounds slightly cooler/darker
  (`#09090c`/`#111318`/`#181b22`). Because nearly every component already read `--color-primary`/
  `bg-primary`/`text-primary`/`border-primary` tokens rather than hardcoded hex, this alone
  recolors most of the site (Navbar, Hero, Timeline, Certificates, Contact form, buttons) with
  zero component changes. Two spots hardcoded literal `amber-500` for a non-brand purpose
  (status badges meaning "in progress", and the yellow traffic-light dot in Hero/Terminal's
  terminal chrome) — the status-badge one was recolored to `sky-500` so it doesn't now read as
  the same color as the brand accent; the traffic-light dots were left alone (that's a
  universal red/yellow/green convention, not a brand color clash).
- **New reusable primitives** (`src/index.css`): `.window-dots` (macOS/code-editor traffic-light
  dots), `.corner-brackets` (hover-revealed L-shaped accent corners, common "tech UI" framing),
  `.reveal`/`.reveal.is-visible` (scroll-reveal transition, respects `prefers-reduced-motion`).
- **Scroll-reveal animations**: new `src/hooks/useInView.js` (IntersectionObserver-based, one-
  shot, NOT a scroll listener — won't reintroduce the scroll-jank class of bug fixed earlier
  this session) + `src/components/Reveal.jsx` (thin wrapper). Every home-page section below the
  Hero (About, Projects, Education, Experience, Certificates, Skills, Contact) is now wrapped
  in `<Reveal as="section" ...>` instead of a plain `<section>` — fades/slides in the first time
  it enters the viewport. Hero itself is NOT wrapped (it's above the fold, already visible on
  load — animating it would delay perceived load, not help it).
- **Projects.jsx cards** (explicitly called out): terminal-window chrome header
  (`.window-dots` + `~/projects/{id}` path), sharper `rounded-lg` corners (was `rounded-2xl`),
  `.corner-brackets` hover accent, tags restyled as monospace `#tag` pills in the new accent
  color (was plain muted badges). Skeleton (`ProjectCardSkeleton`) updated to match the new
  chrome-header shape.
- **Skills.jsx → "Technical Arsenal"** (explicitly called out; heading already said this, now
  the visuals match): each category card gets the same terminal-chrome header
  (`arsenal/{category-slug}`), sharper corners, `.corner-brackets`.
- **ProjectDetail.jsx** (explicitly called out): metrics grid cards are sharper with a
  top accent border + `.corner-brackets` + `// label` monospace comment style; header tags
  restyled to match the `#tag` pill convention; the carousel gained a terminal-chrome title
  bar (`.window-dots` + `gallery/slide_NN` + the existing counter) ABOVE the image track
  instead of an absolutely-positioned overlay badge — had to move the prev/next nav buttons
  into their own `relative` wrapper around just the image track so their `top-1/2` vertical
  centering wasn't thrown off by the new chrome bar's height (a real bug caught and fixed
  during this edit, not just a style choice); both sidebar cards (architecture, tech specs)
  got matching chrome headers (`architecture.yaml`, `techspecs.json`).
- **Not independently re-verified visually** — no browser extension connection all session.
  Verified only via `eslint .` (clean) and `vite build` (succeeds, ~384KB main chunk, consistent
  with before). Next agent with browser access: load `pnpm dev`, check the home page scroll-
  reveal timing/easing feels right, check a project card and the `/projects/:id` page render
  correctly (especially the carousel nav-button vertical centering after the chrome-bar
  restructure), and check both light and dark theme since the light-theme amber contrast was
  chosen by eye in code, not tested in a real browser.

## Education section scroll lag — missing body scroll lock on modals

User reported scroll lag specifically in the Education section. Root cause: `Timeline.jsx`'s
certificate modal (`activeCert`, opened via "View Certificate" on an education/experience
item) is `fixed inset-0 backdrop-blur-md` but — unlike `ResumeModal.jsx`, which does this
correctly — never set `document.body.style.overflow = 'hidden'` while open. So the background
page stayed scrollable behind a full-screen blur filter: same class of jank already fixed
twice this session (Navbar, carousel backdrop), just in a spot that hadn't been checked.
Added the scroll-lock effect (mirroring `ResumeModal.jsx`'s pattern). While fixing this, swept
every other full-screen overlay in the codebase for the same gap and fixed all of them:
`Certificates.jsx`'s lightbox (`backdrop-blur-sm`), `ProjectDetail.jsx`'s lightbox (no blur,
but background scroll behind a full-screen overlay is still wrong), and `Terminal.jsx`
(`backdrop-blur-sm`, openable from any page via the Navbar button). `ResumeModal.jsx` already
had this right and needed no change.

## Arsenal + Certificates scroll lag — different cause than Education's

User reported the same "laggy scroll" in Technical Arsenal (Skills.jsx) and Certificates —
but Arsenal has no modal, no blur, no timers, no fixed elements at all, so the Education fix
(body scroll lock on a blur modal) couldn't be the explanation here. Re-diagnosed: both
sections are dense grids of individually `:hover`-reactive small elements (skill badges in
Arsenal, project tags elsewhere, timeline dots, carousel hover overlays). With a stationary
mouse, scrolling slides page content underneath the cursor — every hover-reactive element
that passes under it fires its own enter/leave transition. Across dozens of badges that's
dozens of simultaneous transitions/repaints, which reads as "laggy scroll" even though no
single element is doing anything expensive. (Sections nobody complained about — Hero, About,
Contact — don't have this density of individually-hoverable small elements.)

Fix, applied globally rather than per-component: `UnifiedBackground.jsx`'s existing scroll
listener (already toggles `.is-scrolling` on its own ref for the orb-pause fix) now ALSO
toggles `.is-scrolling` on `document.documentElement`. New CSS rule in `index.css`:
`html.is-scrolling [class*="hover:"] { transition: none !important; }` — matches on the
literal `hover:` substring Tailwind keeps in the class attribute (not a pseudo-class
selector), so it hits every hover-transition utility site-wide with one rule. Hover itself
still works instantly during scroll (no `pointer-events` removal, no functionality lost) —
only the animated transition is skipped while actively scrolling, removing the repaint cost
without disabling hover.

**Actually measured this time, not guessed.** No Claude-in-Chrome extension connection all
session, so instead launched headless Chrome directly via CDP (`chrome.exe
--remote-debugging-port`, raw WebSocket — no puppeteer installed) and ran a script
(`cdp-profile.mjs`, written to the scratchpad dir, not committed) that scrolls each section
into view then dispatches ~60 synthetic `Input.dispatchMouseEvent type:mouseWheel` events at a
FIXED x/y (simulating a stationary mouse while scrolling — the exact failure mode) while a
`requestAnimationFrame` loop records frame deltas. Confirmed via real numbers:
- Before any fix this turn: `certificates` had 2 frames >33ms, 1 >50ms, max 83ms — the
  standout worst section. `skills` (Arsenal) was already clean (0 dropped frames, max 17ms)
  from the PREVIOUS turn's `hover:` transition fix — so that fix is confirmed working, not
  just theorized.
- Root cause for `certificates` specifically: NOT hover — it's `Certificates.jsx`'s 5-second
  auto-advance `setTimeout` firing its `transition-transform duration-500` on the whole
  carousel track mid-scroll, independent of any hover state. Fixed by checking
  `document.documentElement.classList.contains('is-scrolling')` (the same flag
  `UnifiedBackground.jsx` already sets) when the timer fires — if scrolling, reschedule a
  short retry instead of advancing, so the slide transition never fires while the user is
  mid-scroll.
- Re-measured after the fix on the SAME running dev server (HMR picked up the change, no
  restart needed): `certificates` dropped to 0/0, max 33ms. `education` and `about` both
  clean too (one isolated 1-frame blip in `about` on an early run that disappeared on a clean
  re-run — almost certainly HMR-reload noise from editing the file seconds earlier, not a real
  issue; call it noise unless it reappears).
- The profiling Chrome instance and its temp profile dir were cleaned up (killed by PID,
  found via `netstat` for port 9333 — did NOT use `taskkill /IM chrome.exe` broadly, which
  would have killed the user's real browser too).

If reported laggy again after this, the next step should be the same real-CDP-profiling
approach (see `cdp-profile.mjs`'s technique above, rewrite it fresh since it wasn't saved to
the repo) rather than guessing from reading the code — two of three guesses this session
needed correction once actually measured.

## Card redesign walkback, resume-from-Firestore, favicon recolor, bundle splitting

Four more asks this turn, on `claude-redesign` still (not merged/pushed):

- **Projects.jsx cards simplified** — user found the terminal-chrome look (window-dots,
  `~/projects/{id}` path bar, `.corner-brackets`, sharp `rounded-lg`) too busy for the card
  grid specifically. Reverted cards to a plain clean card: `rounded-2xl`, no chrome header, a
  simple circular arrow-icon button that rotates+recolors on hover, pill-shaped status/duration/
  tag badges, lift+glow-shadow on hover. Skills.jsx and ProjectDetail.jsx keep the terminal-chrome
  treatment — only Projects.jsx was asked to change.
- **Favicon recolor** — the ACTUAL favicon is `assets/logo.svg` (linked from `index.html` as
  `./assets/logo.svg`, repo-root-relative since index.html lives at the root), not
  `public/favicon.svg`/`public/icons.svg` (confirmed unused, not referenced anywhere — Vite
  scaffolding leftovers). Recolored `assets/logo.svg`'s gold gradient to the amber palette, and
  its dark background gradient to match the new `--bg-secondary`/`--bg-primary` tokens exactly.
  Also recolored `public/favicon.svg` for consistency even though it's unused — harmless,
  low-effort, flagging in case a future agent wonders why two favicon-shaped files have
  different colors.
- **Resume now Firestore-backed, with instant-update semantics** — new `src/api/resume.js` +
  `src/hooks/useResume.js`, read straight from the EXISTING `about/main` doc's `resume`/
  `images.resume_image` fields (no new doc, no cache/TTL — unlike projects, resume updates
  should show up on the very next load). Starts from `data.js`'s static values (instant, no
  flash) and silently swaps to Firestore's once that resolves. Wired into `App.jsx` replacing
  the old `data.resume`/`data.images.resume_image` props to `ResumeModal`.
  - Found and fixed a real bug while doing this: `ResumeModal.jsx`'s preview-image cache was a
    FIXED localStorage key (`resume_image_b64`) with no TTL — an admin-updated image would
    have stayed stale in every visitor's browser forever. Fixed by keying the cache to the URL
    itself (`resume_image_b64:${url}`) instead — since admin uploads always get a unique
    `resume-${Date.now()}.*` filename (see below), a new upload is simply never found in cache
    and fetches fresh; the old entry is just orphaned, no TTL needed. Had to restructure the
    hook to adjust state synchronously during render when `url` changes (React's documented
    pattern for this) rather than via `setState` inside the effect, to satisfy the
    `react-hooks/set-state-in-effect` lint rule.
  - **Admin**: `admin/about.html` gained a dedicated "Resume" card (split out of the old
    Basics/Images cards) with file-upload inputs for both the PDF and its preview image —
    `admin/js/about-api.js`'s new `uploadResumeFile(file)` uploads to Storage under
    `about/resume-{timestamp}.{ext}` and returns the download URL into the existing text
    field; Save still required to publish to Firestore. `storage.rules` needed a new
    `match /about/{allPaths=**}` block (public read, auth write) — only `projects/**` existed
    before — and was redeployed (`firebase deploy --only storage`).
- **Route-level code splitting**: `ProjectDetail.jsx` is now `React.lazy()`-loaded in
  `App.jsx`, wrapped in `<Suspense fallback={<ProjectDetailSkeleton />}>` (the same skeleton
  already used for the data-loading case, so one fallback covers both "JS chunk not loaded
  yet" and "data not loaded yet"). Confirmed via `vite build`: main chunk dropped from ~385KB
  to ~341KB gzip; `ProjectDetail` is now its own ~44KB (~15.5KB gzip) chunk fetched only when a
  project page is visited — a real, measured win for visitors who only ever see the home page.
  Also added `loading="lazy"` to `Certificates.jsx`'s carousel images (same all-rendered-at-once
  pattern as the carousel bug fixed earlier in `ProjectDetail.jsx`, except idx 0) and
  `About.jsx`'s profile image.
- Not browser-verified (still no extension connection this session) beyond `eslint .` (clean)
  and `vite build` (succeeds, sizes as above).

## Admin UI: sequential image numbering + drag-and-drop reorder

User wanted project-image management cleaned up: uploaded files should be named sequentially
(`1.png`, `2.png`...) matching the `project_pictures/<id>/` convention already used elsewhere,
staying contiguous after a delete (so deleting "1.png" turns "2.png" into "1.png"), plus
drag-and-drop reordering that does NOT rename files (cheap, just changes array/display order).

- `admin/js/projects-api.js`: `uploadProjectImage(projectId, file, position)` now takes an
  explicit 1-indexed `position` and names the Storage object `${position}.${ext}` (was a
  `${Date.now()}-${file.name}` timestamp scheme). New `uploadCertificateImage(projectId, file)`
  split out for the certificate (fixed `certificate.{ext}` name, not part of the numbered
  sequence — matches the original migration's naming). New `renumberProjectImages(projectId,
  images)` renames any image whose Storage filename doesn't match its current array position.
  **Two-phase (temp name, then final name), not a direct rename** — caught and fixed a real bug
  before it shipped: a straight left-to-right rename can clobber a file when two images need to
  swap names (e.g. index 0 wants to become "2.png" while index 1, not yet processed, is still
  sitting at "2.png" — uploading index 0's bytes to "2.png" would silently overwrite index 1's
  file before IT could be migrated, corrupting it). Going through a unique `__tmp_*` name first
  makes processing order irrelevant, at the cost of one extra upload/download per renamed file
  — fine for an occasional admin operation on a handful of images.
- `admin/projects.html`: thumbnails are now `draggable="true"` with native HTML5
  dragstart/dragover/drop handlers that splice the local `images` array to the new order (no
  Storage calls — reordering is explicitly cheap, matching "file name stays the same" from the
  ask) and show a `#N` position label per thumbnail. Removing an image now calls
  `renumberProjectImages` automatically afterward so the sequence stays contiguous. Added a
  manual "Renumber to match order" button for syncing Storage filenames to the current array
  order on demand after a drag-reorder (which — again, deliberately — doesn't auto-renumber by
  itself, only add/remove does).
- Found and deleted a stray `assets/dist/` directory (gitignored build output nested under
  `assets/` instead of the repo-root `dist/` — origin unclear, possibly an earlier stray build
  invocation) that was making `eslint .` report ~370 errors from a minified vendor bundle being
  linted as source. Not tracked by git either way (bare `dist` pattern in `.gitignore` matches
  it), so deleting it was risk-free cleanup, not a reversal of anything meaningful.

## Resume preview: CORS break, fixed by dropping the base64 cache entirely

User hit this in the browser console after the resume-from-Firestore change:
`Cross-Origin Request Blocked ... CORS header 'Access-Control-Allow-Origin' missing` for a
`firebasestorage.googleapis.com` URL. Root cause: `ResumeModal.jsx`'s `useLocalStorageImage`
hook did `fetch(url).then(res => res.blob())` to convert the preview image to a base64 data
URL for a permanent localStorage cache — reading the response body of a cross-origin request
requires CORS headers, and Firebase Storage's default bucket config doesn't send them.
`<img src>` never needed this (loading/painting an image cross-origin doesn't require CORS,
only reading its bytes via fetch/XHR does) — so the image displayed fine locally before this
session's resume change only because `resumeImage` was a same-origin relative path
(`./assets/...`) back then, which (trivially) satisfies CORS. The instant it became a Storage
URL, the fetch-to-base64 step broke.

Fix: deleted the fetch/base64/localStorage machinery entirely — `ResumeModal.jsx` now renders
a plain `<img src={resumeImage} onLoad={...} onError={...}>` and derives loading state from
those two events instead. The browser's native HTTP cache handles repeat-visit speed well
enough; the custom cache was solving a problem (zero network request on reopen) that wasn't
worth the CORS complexity once the source went external. (Same render-time-state-adjustment
pattern as before — `if (url !== prevUrl) { setPrevUrl(url); setStatus(...) }` — to dodge the
`react-hooks/set-state-in-effect` lint rule.)

**Not yet checked**: whether the Download PDF button's cross-origin `<a download>` still
forces a download correctly now that `resumeUrl` can also be a Storage URL (same category of
cross-origin gotcha, though `download` is less strict about CORS than `fetch` reads in most
current browsers — this is unconfirmed, not fixed pre-emptively since the user hasn't reported
it broken). Check this if the user reports the download button misbehaving.

## About data: actually wired to Firestore now, with staged reveal + 5-min cache

Important context: the user had been editing `about/main` in Firestore directly via the
admin panel (confirmed by a pasted doc dump — new `stats` array, Storage URLs for `profile`/
`resume_image`/`resume`/experience `certificateLink`/certificate `image` fields) but almost
none of it was actually being read by the site — a prior turn this session had deliberately
reverted About-section data to `data.js`-only (see the "About/home content reverted to
data.js-only" entry above) and only `projects` + a bolted-on `stats` field (via `useResume`)
ever got wired back to Firestore. This turn properly wires ALL of `about/main` to the site,
while addressing a real technical point the user's request got slightly wrong: Firestore's
client SDK can't fetch individual fields of a document separately — there's no field
projection — so literally fetching "one field at a time" would mean one full network
round-trip per field, which is slower, not faster. Said this plainly rather than silently
doing something that would hurt their stated "maximum speed" goal, then built the thing that
actually achieves both their goals (progressive staged reveal + genuine speed):

- **`src/api/about.js`** (recreated — was deleted two sessions-turns ago) + **`src/hooks/
  useAboutMe.js`** (recreated): ONE fetch of `about/main`, cached in sessionStorage for 5
  minutes (`src/api/cache.js`, same module projects use). Lazy `useState` initializer checks
  the cache first (instant, no flash); on a cache miss, renders `data.js`'s static values
  instantly (never a loading flag) and fires a background fetch that silently swaps in the
  Firestore result when it resolves — classic stale-ish-cache-then-silent-update, not
  continuous polling. `src/hooks/useResume.js` + `src/api/resume.js` deleted — they were a
  SECOND independent fetch of the exact same `about/main` doc; consolidating to one `useAboutMe`
  call used for everything (name, role, bio, hero tagline, contact, education, experience,
  skills, interests, certificates, stats, resume, resume_image) is itself a real "fewer
  network round-trips = faster" win, the opposite direction from literal per-field fetches.
- **Staged reveal** (`App.jsx`), matching the requested order: Hero (always instant, text-only,
  no skeleton — explicit ask: "only fallback to static if not fetched properly") -> About
  (gated on its profile image actually finishing download — the real bottleneck once that
  image became a remote Storage URL, not the text data which is already present) -> Projects
  (unchanged, independent fetch+skeleton, already existed) -> Education + Experience (gated on
  `aboutReady && !projectsLoading`) -> Certificates + Skills + Contact (combined, revealed
  together once Education's gate passes). New skeleton components: `AboutSkeleton.jsx`,
  `TimelineSkeleton.jsx` (shared by Education/Experience), `SectionSkeletons.jsx`
  (`CertificatesSkeleton`/`SkillsSkeleton`/`ContactSkeleton`).
- **`src/hooks/useImagePreload.js`**: preloads an image off-DOM (`new Image()`) and reports
  when it's actually loaded — what `aboutReady` gates on for the About section.
- **Caught and fixed a real bug before it shipped**: a section's readiness was originally
  computed live every render from `useImagePreload`'s current state — but when the background
  `about/main` refetch silently swaps the profile image URL (static path -> Firestore URL),
  `useImagePreload` correctly resets to "not loaded" for the new src, which would have flipped
  `aboutReady` back to `false` and reverted About (and everything gated after it — Education,
  Certificates, Skills, Contact) back to a skeleton AFTER already showing real content —
  exactly the "visual reload" the user explicitly asked to avoid. Fixed with a one-way latch:
  `aboutReady` only ever flips false->true, never back. Also hit React 19's newer
  `react-hooks/refs` lint rule (forbids reading `ref.current` during render at all, stricter
  than expected — a `useRef`-based latch attempt got rejected) — ended up using React's
  documented "adjust state during render" pattern instead (`if (cond && !state) setState(true)`
  called directly in the render body, not in an effect — same pattern already used elsewhere
  this session for prop-change resets, just inverted for a latch-on).
- **Verified at runtime, not just via build**: same CDP-headless-Chrome technique as the
  earlier scroll-jank investigation (raw WebSocket, no puppeteer) — snapshotted
  `document.getElementById(id).textContent` for every section at t=0.3s (About/Education/
  Certificates/Skills/Contact all empty = skeletons showing, Hero/Projects headings already
  present) and t=2.5s (everything populated with real fetched content), zero console errors
  the whole time, and re-checked at t=6s that content was still present (not reverted to
  empty) — confirms the one-way-latch fix actually works, not just that it compiles.

## Fixed: Experience/Certificates/Skills flicker — the fine-grained staging was the cause

User reported flickery scroll specifically in Experience, Certificates, Skills (not Education,
not the others) right after the staged-reveal work above shipped. Profiled it the same way as
every other perf investigation this session (CDP headless Chrome, no guessing): the frame-drop
pattern was a clean tell — a section's FIRST reveal (right after page load) dropped frames,
but immediately re-scrolling to the exact same section measured perfectly clean (0 dropped
frames) every time. That's not ongoing jank, it's a one-time layout-shift cost from the
skeleton→real-content DOM swap (different height) happening to land exactly while the user is
mid-scroll through that section.

Root cause: the original staging had `educationReady` (Education+Experience) and `restReady`
(Certificates+Skills+Contact) as a second, later gate on top of `aboutReady` — but since all
this data comes from the ONE `about/main` fetch, that extra staging bought nothing (the data's
been sitting there the whole time) while making it MORE likely that a normal scroll would
catch Experience/Certificates/Skills (the sections furthest down the page) still mid-swap,
since their gate fired later than About's. Education, First in that group, usually finished
swapping before a user scrolled that far — which is exactly why only the sections AFTER it
were reported as flickery.

Fix: collapsed `educationReady`/`restReady` into the single `aboutReady` gate — About,
Education, Experience, Certificates, Skills, and Contact now all swap from skeleton to real
content at the same moment (whenever the profile image finishes preloading). This moves the
one-time swap cost to happen right after Hero, far earlier in a normal scroll session, instead
of spread across three sections a user is much more likely to already be scrolling through by
the time their gate fires. Re-verified with the same first-visit-vs-revisit CDP methodology at
a realistic ~1.8s settle time (how long it actually takes to scroll from Hero down to About):
About itself now absorbs the one-time swap cost (2 dropped frames, expected and far less
impactful that early), Education/Experience/Certificates/Skills all measured clean (0 dropped
frames). `Projects` was left untouched — it's a genuinely separate, independently-timed fetch
(its own collection), not part of this cascade.

Also checked, while investigating: `SkillsSkeleton` hardcodes 3 category-card placeholders,
and `Skills.jsx` can render a 4th ("Specialized Know-how") if any skill doesn't match the 3
fixed categories — a real latent height-mismatch bug, though NOT the one actually observed
this time (`data.js`'s current 22-skill list maps exactly onto the 3 fixed categories, so the
4th category never renders today). Left as-is rather than over-engineering a fix for a
mismatch that isn't currently triggered — worth revisiting if skills are ever added that don't
fit the 3 existing categories.

## Root cause of the real, reproducible scroll slowdown: `content-visibility: auto`

The `.reveal`-during-scroll fix above was real and shipped, but user reported the actual
symptom was different and persistent: scrolling fast from Hero straight to Contact,
Experience/Certificates/Skills consistently slowed down every time (not just on first visit),
while About/Projects/Education/Contact stayed smooth. Needed a different test: previous CDP
profiling jumped straight to each section; this time simulated ONE continuous fast scroll
pass from top to bottom (repeated `Input.dispatchMouseEvent type:mouseWheel` at a steady
cadence) while recording `{frameDelta, scrollY}` pairs, then bucketed frames by which
section's vertical range `scrollY` fell in at that moment — directly reproduced the reported
pattern: Experience/Certificates/Skills had real dropped frames (Experience 3 over33/2 over50/
max 150ms, Skills 2 over33/2 over50/max 208ms), About/Education clean.

Root-caused with a controlled A/B, not guessed: injected a stylesheet forcing
`content-visibility: visible !important` on `section` (overriding `src/index.css`'s global
`section { content-visibility: auto; contain-intrinsic-size: 0 600px; }`, which the repo
history notes was added early on as "the biggest scroll perf win") and re-ran the identical
continuous-scroll test — Experience and Certificates dropped to 0/0 dropped frames immediately.
Mechanism: `content-visibility: auto` skips layout/paint for off-screen elements using
`contain-intrinsic-size` as a placeholder height; when a section's REAL height doesn't match
that 600px guess (true for several sections here), the browser does a real layout recalc
the moment it transitions from "skipped" to "relevant to the user" — and that transition was
landing exactly mid-scroll for whichever sections a normal scroll speed reaches first among
the ones not already near the initial viewport.

**Removed `content-visibility`/`contain-intrinsic-size` from the global `section` rule
entirely** rather than tuning it (e.g. per-section accurate intrinsic-size, or `auto`
keyword) — with only ~8 sections on this page, the offscreen-render-skip benefit
`content-visibility` targets (built for pages with hundreds of off-screen nodes) isn't worth
the layout-recalc-mid-scroll tradeoff it was causing here, and removing it outright is both
simpler to keep correct as content changes and was the version actually measured clean.
Re-verified on two separate full continuous-scroll-pass runs after removal: Experience,
Certificates, Skills, Education, About all 0 dropped frames both times; a couple of small,
non-reproducible-at-the-same-spot blips remained (Hero at page-load, one Projects/Contact
frame) — normal background noise, not the systematic per-section pattern that was reported,
and not something to chase further without a new concrete complaint.

## Certificates carousel: image replaced with a "View Certificate" button

User reported continued flicker specifically in a screen recording after the
`content-visibility` fix. Extracted actual frames from the `.mp4` via VLC's scene-filter (no
ffmpeg installed, VLC was) since the Read tool can't open video — found no reproducible app
bug: one frame showed a cert card's title/description text blank while the image beside it
rendered fine, surrounded immediately before/after by correctly-rendered frames, plus text-edge
ghosting on headings during fast motion — the signature of video-encoder motion-compensation
artifacts on high-contrast text during fast scroll (common in screen recordings), not a React/
CSS bug. Said so plainly rather than making a speculative fix the evidence didn't support.
Grepped for every mechanism in a generic troubleshooting list the user pasted
(scroll-snap, Lenis/GSAP/Framer/any scroll lib, `h-screen`+`overflow-hidden`) — zero matches,
none of it applies to this codebase.

User asked anyway to remove the inline certificate image from `Certificates.jsx`'s carousel
track and replace it with a "View Certificate" button that opens the existing lightbox modal
(`setLightbox(cert)` — already built, previously triggered by clicking the inline image).
Done — this is a legitimate change independent of the flicker question: before, every
certificate's image sat in the DOM as part of the sliding track; now only the lightbox loads
an image, and only when actually clicked open. Removed the now-fixed `h-[460px]/360px`
container (sized for the old image+text split layout) in favor of `min-h-[280px]` so slides of
different text length don't jump the carousel's height when switching.

## Certificates carousel transition locked during active scroll too

Extended the established `.is-scrolling` transition-kill pattern (already used for `.reveal`
and `[class*="hover:"]`) to the carousel's own sliding track. The auto-advance timer already
*defers starting* a new slide change while `.is-scrolling` is set (see
`Certificates.jsx`'s `tick()`), but that only covers the moment the timer fires — if the 5s
timer lands a split second before the `.is-scrolling` flag itself gets set (a small window:
the scroll event has to fire and the class has to be added before the check runs), the 500ms
`transition-transform` could already be mid-flight once scrolling starts. Gave the track a
`cert-track` class and added `html.is-scrolling .cert-track { transition: none !important; }`
in `index.css` — any slide change caught in that race now snaps instantly instead of animating
through active scroll, closing the gap completely rather than just narrowing it.

## Certificates: carousel replaced entirely — confirmed root cause, not a workaround

User A/B tested by disabling the whole Certificates section (temp flag, no code deleted) —
confirmed scroll was smooth everywhere else, isolating Certificates as the actual cause.
Removing the certificate images earlier hadn't fixed it, meaning the carousel MECHANISM
itself (transform-sliding track + auto-advance timer), not the images, was the real source —
consistent with the two targeted transition-kill fixes (`.cert-track`, the auto-advance defer)
narrowing but not eliminating it.

Rather than keep patching the carousel, replaced it outright: `Certificates.jsx` is now a
static card grid (same visual pattern as `Projects.jsx` — `rounded-2xl` cards, hover lift,
`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`), each card showing the badge/title/description
and a "View Certificate" button that opens the same lightbox modal as before (unchanged).
Removed entirely: `activeIndex` state, the 5s auto-advance `useEffect`/timer, `handlePrev`/
`handleNext`, the dot indicators, the `translateX` sliding track, and the now-dead
`html.is-scrolling .cert-track` CSS rule (deleted from `index.css` — nothing references
`.cert-track` anymore). `CertificatesSkeleton` (`SectionSkeletons.jsx`) updated to match the
new card-grid shape instead of the old single-carousel-box shape. The temp `SHOW_CERTIFICATES`
diagnostic flag used for the A/B test was removed from `App.jsx` after confirming the fix.

Not independently re-verified via CDP this time (straightforward structural swap, same
pattern already proven clean for Projects' card grid) — build + lint clean. If scroll jank
ever resurfaces specifically on this section, the carousel is gone so it's a genuinely
different cause this time, not a recurrence of the same one.

## Certificates cards: thumbnail added back, centered row layout

Two polish asks on the new card grid: a small static thumbnail image per card (safe now —
it's a plain `<img>` in a static grid, not part of a sliding carousel, so none of the earlier
jank mechanism applies), and centering an incomplete row (2 certs on a 3-column layout was
left-aligned with empty space on the right instead of centered).

Switched from CSS `grid` to `flex flex-wrap justify-center` with each card given an explicit
width matching what each breakpoint's grid column would've given it
(`md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.334rem)]`, accounting for the `gap-8` gap) — this
is the standard trick for "grid-like layout whose last row centers when incomplete," which
CSS Grid can't do on its own without extra tricks. `CertificatesSkeleton` updated to match
(thumbnail placeholder + same flex-wrap/width shape) so there's no layout-shape mismatch on
the skeleton→content swap.

## Admin image management: dropped renumbering entirely (cost, not needed)

User flagged the renumber-on-delete/manual-renumber feature was burning extra Storage API
calls (each rename = download + 2 uploads + delete) for something that only mattered
cosmetically — display order on the public site was never derived from the filename anyway
(the carousel just renders `images` array order, which drag-reorder already controls for
free). Removed the whole mechanism rather than optimizing it:

- `admin/js/projects-api.js`: `renumberProjectImages()` deleted entirely (along with the
  `getBlob` import it needed). `uploadProjectImage(projectId, file)` dropped its `position`
  parameter — uploads now go to `projects/{id}/{id}_{random4}.{ext}` (new `randomId(4)`
  helper, unique per upload) instead of `projects/{id}/{position}.{ext}`.
- `admin/projects.html`: removed the "Renumber to match order" button, its click handler, and
  the post-delete renumber call in `removeImageAt` (delete now just deletes — no follow-up
  Storage calls). Updated the Images section's help text to say display order is purely the
  `images` array order (drag to reorder), filenames are just unique identifiers nobody reads.
- Existing already-uploaded `1.png`/`2.png`-named files (from before this change, or from
  `scripts/upload-project-pictures.mjs`'s one-time local migration, which is unrelated and
  untouched — it names files to match `projectDetailsData.js`'s existing numbered references,
  a different use case) are unaffected — nothing renames old files, this only changes what
  NEW uploads are named going forward.

## admin/ deleted — content management now external

User built a separate, standalone admin panel elsewhere and deleted this repo's `admin/`
folder entirely. Deleted the `admin/js/firebase-config.js` gitignore entry (now unused),
removed the `admin/` row from `README.md`'s file tree, and rewrote `.knowledge/architecture.md`'s
former "Admin panel" section to "Content management is external, not in this repo" — explicit
**don't recreate `admin/` without being asked**. `about/main` and `projects/{id}` are still
edited via that external tool in the same schema `src/api/*.js` reads; this repo only ever
reads that data now, never writes it. `scripts/seed-firestore.mjs` and
`scripts/upload-project-pictures.mjs` are untouched and still work (Admin SDK via
`scripts/firebase-admin-init.mjs`, independent of the deleted panel).

User also asked to confirm site rendering never depends on image filenames — verified by
grep across all of `src/`: the only `.sort()` calls anywhere sort projects by star rating
(`Projects.jsx`, `Hero.jsx`, `Terminal.jsx`), nothing parses or sorts by filename.
`ProjectDetail.jsx`'s carousel simply `.map()`s over `details.images` in whatever order that
array holds — confirms the "remove renumbering" decision from earlier this session was safe:
there was never a rendering dependency on filenames to begin with, only the old admin panel's
own (now-deleted) cosmetic Storage-tidiness feature.

## Projects list: dropped the 30-min cache, fixed a detailsLink gate bug

User added a new project ("certflow") via their new external admin panel and it wasn't
showing on the home page. Verified directly against Firestore (Admin SDK, not a guess) —
**the doc was there** (12 projects, certflow present with full card + case-study fields
correctly populated, same image-naming convention this session's admin work established:
`projects/certflow/certflow_{random4}.webp`). So the actual cause was the 30-minute
sessionStorage cache in `src/api/projects.js` serving the stale 11-project list.

Given this is the second time a cache hid an admin edit (about/resume had the identical issue
earlier), dropped Firestore caching for projects ENTIRELY — removed `cache.js` usage from
`src/api/projects.js` (`listProjects()`/`getProjectDetails()` now always fetch fresh, no
`getCachedProjects`/`getCachedProjectDetails` exports), and reverted `useProjects.js`/
`useProjectDetails.js` to the simple always-fetch-on-mount pattern (no lazy cache-check
initializer). `src/api/cache.js` itself is untouched and still used by `about.js` (5-min cache,
user hasn't complained about that one) — only the projects cache was the problem.

**Also found and fixed, while verifying the certflow doc's shape**: it has no `detailsLink`
field at all — the new external admin panel doesn't write one. `Projects.jsx`'s
`getProjectAlias()` used `detailsLink`'s mere presence as the sole signal for "does this
project have a case-study page" — without it, clicking the certflow card would have opened the
external `link` instead of the detail page, despite the doc having full `narratives`/`metrics`/
`images` content. Fixed the gate to also recognize detail content directly
(`Boolean(project.detailsLink) || Boolean(project.narratives?.length)`) — covers both the
static-fallback case (has `detailsLink`, no inline `narratives` on the list item) and
Firestore-sourced projects that skip `detailsLink` but carry full content inline (list items
are the whole merged doc, no second fetch needed to check this).

## Skills/Arsenal: dynamic Firestore fetch & skillCards synchronization

- Removed constant, hardcoded category items in `Skills.jsx`.
- `Skills.jsx` now dynamically renders categories from `skillCards` received from `about/main` via `useAboutMe()`.
- Dynamically derives icons for category cards (`Server`, `Cpu`, `Layers`, `Database`, `Terminal`, `Shield`, `Settings`) based on title keywords.
- `App.jsx` forwards `skillCards={data.skillCards}` to `<Skills />`.
- `data.js` includes default `skillCards` mirroring the canonical categories so static fallback matches 1:1.

## Cache TTL reduction & on-navigation refetching

- `src/api/about.js`: Reduced `CACHE_TTL_MS` from 5 minutes (300s) down to 30 seconds (`30 * 1000`).
- Added `{ force: true }` parameter to `getAboutMe()` to bypass cache on demand and store fresh Firestore data.
- `src/hooks/useAboutMe.js`: Now triggers a forced background refetch on every page navigation (`location.pathname` dependency).
- `src/hooks/useProjects.js`: Now also refetches projects list on page navigation (`location.pathname` dependency).

## How to use this file

Overwrite this file each session — it's current state, not a changelog.
