# Session Handoff

_Last updated: 2026-10-09_

## Current state

Fully Firestore-backed SPA with local fallbacks (`data.js` and `datas/projectDetailsData.js`) for instant frame-0 renders and resilient offline/unreachable network handling. Firebase client config in `src/firebase.js` carries default public web credentials so GitHub Actions builds without `.env` connect to Firestore seamlessly. Profile image prioritizes loading via `fetchPriority="high"` and storage preconnect.

## What just happened (this session)

1. **"Project not found" / "Page not found" on `/projects/ctskii`**:
   - Fixed `src/firebase.js`: added fallback public client credentials so production builds on GitHub Actions (where `.env` is absent) can connect to Firestore.
   - Fixed `src/api/projects.js`: added `localProjectDetails(id)` fallback using `datas/projectDetailsData.js` and `localProjectsList()`, preventing "Project not found" if network is slow or Firestore is temporarily disconnected.
   - Clarified `detailsLink`: explained that `detailsLink` was the legacy static HTML link (`./project_details/ctskii.html`), whereas the modern app uses clean dynamic routing `/projects/:id` (`id: 'ctskii'`).
   - Expanded `hasDetailPage` in `Projects.jsx` to recognize projects with `subtitle` or `images`.
2. **Profile image loading slow**:
   - Removed `loading="lazy"` on the main profile picture in `About.jsx` and added `fetchPriority="high"`.
   - Added `<link rel="preconnect" href="https://firebasestorage.googleapis.com" crossorigin>` to `index.html` so network handshakes complete before the image request.

User reported three problems in one request: (1) reloading on a project detail page
(`/projects/:id`) showed a blank page, (2) the "View Live" project link didn't seem to reflect
updates, (3) wanted all hardcoded content values archived (not deleted) into a `datas/` folder,
without switching routing to a hash router.

1. **Reload-blank-page — FIXED.** Root cause: `vite.config.js` had `base: './'` (relative).
   The built `index.html` then emitted `<script src="./assets/...">`, which resolves relative
   to the current URL path — breaks the moment the browser loads a nested route directly (e.g.
   `/projects/certflow`), since `./assets/` then resolves under `/projects/`, not site root.
   Fixed to `base: '/'`. Confirmed via `vite build` + reading `dist/index.html`: script/css
   `src`/`href` are now `/assets/...` (absolute). GitHub Pages' `public/404.html` +
   `index.html`'s inline redirect script (the actual SPA-routing workaround, NOT a hash
   router) were confirmed intact and untouched — satisfies the user's explicit constraint.
2. **"View Live" link — likely same root cause, not hardcoded values.** Grepped
   `Projects.jsx`/`ProjectDetail.jsx`: both read `project.link` straight from the fetched
   Firestore doc, zero hardcoded URLs anywhere. Working theory: the same base-path bug meant
   reload never actually re-fetched, so "the link doesn't update" was really "you're looking
   at a stale render that can't refresh." Not yet confirmed with the user after the fix —
   worth asking them to verify now that reload works.
3. **Archived to `datas/`** (git-detected renames, confirmed via `git status`): `assets/` →
   `datas/assets/`, `project_pictures/` → `datas/project_pictures/`, `data.js` →
   `datas/data.js`, `src/projectDetailsData.js` → `datas/projectDetailsData.js`. Scope decided
   by grep: these were the only files holding hardcoded personal/project content; `games/` was
   deliberately left alone (real interactive game files, referenced via Firestore's `gamePath`
   field, not "data" in the sense the user meant).
   - `index.html`'s favicon now points to `/logo.svg` (an identical copy already existed in
     `public/`) instead of `./assets/logo.svg`.
   - `src/api/about.js` rewritten: no more `data.js` import/fallback. Exports `emptyAboutMe()`
     — a fully-shaped-but-blank object — used whenever Firestore is unreachable/empty.
   - `src/hooks/useAboutMe.js` rewritten to match (no `localAboutMe()`; returns
     `{ data: null, loading: true }` on a cold cache instead of instant static data).
   - `src/App.jsx`: dropped the `data.js` import; `data = { ...emptyAboutMe(), ...aboutData,
     projects }` — this merge matters because `Hero.jsx` does unconditional `name.split(" ")`
     at render time, which would throw on `undefined` without it. `projectsCount` now reads
     `data.projects.length` directly (no more static-count-while-loading fallback).
   - `src/api/projects.js` rewritten: no more `data.js`/`projectDetailsData.js` import,
     `localProjectsList()`/`localProjectDetails()` deleted. `listProjects()` returns
     `{ projects: [] }` on error; `getProjectDetails()` returns `{ project: null, details:
     null }` on error/empty. No caching (already was the case before this session).
   - `scripts/seed-firestore.mjs`, `scripts/upload-project-pictures.mjs`: import paths updated
     to `../datas/data.js` / `../datas/projectDetailsData.js`; the latter's `toDiskPath()`
     helper now resolves through `../datas/` so it can still find images on disk if re-run.
   - `.github/workflows/deploy.yml`: removed the now-dead `cp -r assets` / `cp -r
     project_pictures` steps (nothing at those paths anymore); kept `cp -r games`.
   - Audited every other component (`About.jsx`, `Navbar.jsx`, `Timeline.jsx`, `Skills.jsx`,
     `Certificates.jsx`, the Contact section in `App.jsx`, `Terminal.jsx`, `ProjectDetail.jsx`)
     for unconditional access to fields `emptyAboutMe()` doesn't cover — `Skills.jsx`'s
     `skillCards` has its own `= []` default param, everything else only touches fields
     `emptyAboutMe()` already guarantees. No other crash risks found.
   - `README.md`, `CLAUDE.md`, `.knowledge/architecture.md` updated to drop references to
     root-level `assets/`/`project_pictures/`/`data.js` and document `datas/` as an archive
     folder only `scripts/` still reads from.
   - Verified: `npx eslint .` clean, `npx vite build` succeeds, `dist/index.html` confirmed
     using absolute asset paths.

## Real-time Firestore Listeners & Long-TTL Caching

- **`about/main`**:
  - `src/hooks/useAboutMe.js` subscribes via `subscribeToAboutMe` (`onSnapshot`).
  - Zero additional Firestore reads on route navigation.
  - Live push updates across all fields (bio, resume, skills, stats).
- **Project Details (`/projects/:id`)**:
  - Added `subscribeToProjectDetails(id, callback)` and `getCachedProjectDetails(id)` in `src/api/projects.js` with 24-hour TTL caching across memory and `sessionStorage`.
  - Updated `src/hooks/useProjectDetails.js`: renders instantly from cache when revisiting project pages (no skeleton flash or refetch delays).
  - Subscribes via Firestore `onSnapshot`: any updates published from `port-admin` (e.g. narratives, images, metrics) push live without requiring a page refresh.
- **Project List (`/projects`)**:
  - Added 24-hour caching (`projects:list`) and instant synchronous initialization in `src/hooks/useProjects.js`.
  - Removed route-change refetch (`[location.pathname]`), cutting down redundant `listProjects()` network requests on navigation.
- **Cleaned redundant duplicate images**:
  - Removed duplicate `new Image()` preloading in `App.jsx`, eliminating Firefox's `NS_BINDING_ABORTED` cancelled connection.
  - In `ProjectDetail.jsx`, replaced the duplicate blurred backdrop `<img>` with a CSS `background-image` container, ensuring each slide only creates a single DOM image request instead of two competing requests.
  - In development mode (`pnpm run dev`), React StrictMode's dev-only mount-unmount-remount can trigger harmless aborted sockets on in-flight requests during unmount; in production builds, StrictMode is bypassed.
- **Portaled Modals to `document.body` (No Blur, Dim Only, Scroll Locked)**:
  - Previously, modals inside `Timeline.jsx` and `Certificates.jsx` were nested within `<Reveal as="section">`. Because `<Reveal>` uses CSS `transform: translateY(0)`, CSS specification rules trapped `position: fixed` modals inside that section's coordinates instead of the viewport, hindering scrolling and clipping overlays.
  - Portaled all modals directly into `document.body` via React's `createPortal(..., document.body)`:
    - `Timeline.jsx`: Experience and Education certificate modals.
    - `Certificates.jsx`: Certificate lightbox preview modal.
    - `ResumeModal.jsx`: Resume preview modal.
    - `ProjectDetail.jsx`: Gallery and certificate lightbox modal.
    - `Terminal.jsx`: Interactive terminal popup modal.
  - Removed all `backdrop-blur-*` filters across all modals, replacing them with a crisp, performant dimmed backdrop (`bg-black/80` / `bg-black/85`).
  - Enforced body scroll locking (`document.body.style.overflow = 'hidden'`) whenever any modal or mobile drawer is open.

## How to use this file

Overwrite this file each session — it's current state, not a changelog.
