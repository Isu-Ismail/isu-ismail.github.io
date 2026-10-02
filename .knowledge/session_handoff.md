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

## How to use this file

Overwrite this file each session — it's current state, not a changelog.
