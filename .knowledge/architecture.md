# Architecture

## Layout

See README.md for the top-level folder map. Key points not obvious from file names:

- `App.jsx` defines two routes: `/` (the full one-page scroll: Hero, About, Skills, Timeline,
  Projects, Certificates) and `/projects/:projectId` (`ProjectDetailWrapper` → calls
  `useProjectDetails(projectId)` for that project's case-study content).
- **Data layer (`src/api/` + `src/hooks/` + `src/firebase.js`)** — split by what's actually
  worth fetching:
  - **Bio/contact/education/experience/skills/interests/certificates/stats/resume are
    Firestore-backed** via `src/hooks/useAboutMe.js` + `src/api/about.js`, reading the single
    `about/main` doc. (An earlier turn this session had reverted this to `data.js`-only to
    kill an empty-page flash on first visit; a later turn restored Firestore-backing properly
    once the user started actually editing `about/main` via the admin panel and needed it to
    show up — don't re-revert without checking which instruction is current.) The hook never
    exposes a loading flag: a lazy `useState` initializer serves a 5-minute sessionStorage
    cache instantly if present, else `data.js`'s static values instantly, and a background
    fetch silently swaps in Firestore's result when it resolves (no visual reload). `App.jsx`
    stages WHEN each section reveals that already-available data — Hero instantly (text only,
    falls back to static if Firestore never responds), About once its profile image actually
    finishes downloading (`src/hooks/useImagePreload.js`, gates via a one-way latch — see
    session_handoff.md for why a non-latched version was a real bug), Education/Experience
    once About's ready AND Projects' fetch resolved, Certificates/Skills/Contact once
    Education's ready. Matching skeletons: `AboutSkeleton.jsx`, `TimelineSkeleton.jsx`,
    `SectionSkeletons.jsx`. There is deliberately no separate `useResume.js`/`api/resume.js`
    anymore — that was a second independent fetch of the identical `about/main` doc; folded
    into `useAboutMe` since one fetch read for everything is strictly faster than two.
  - **Only projects are a separate Firestore collection** (genuinely needs its own fetch —
    unbounded-size list, not a single small doc). Schema: `projects/{id}` (one doc per
    project, merging card fields + case-study fields; `{id}` doubles as the `/projects/:id`
    route param — see `src/utils.js`'s `getProjectId()`/`slugifyTitle()`).
  - `src/api/projects.js` (`listProjects()`, `getProjectDetails(id)`) is the only file that
    knows this schema and the Firestore-vs-local-fallback split. Falls back to
    `data.js.projects` + `src/projectDetailsData.js` (per-project case-study content, keyed by
    the same id) when Firestore is disabled, empty, or errors.
  - `src/hooks/useProjects.js`, `useProjectDetails.js` are thin wrappers exposing
    `{ projects/project+details, loading, error, source }` to components.
  - `App.jsx` renders `staticData.projects` immediately and swaps in the Firestore-sourced
    list once `useProjects()` resolves (`projectsLoading ? staticData.projects : projects`) —
    so the Projects section never shows an empty grid either, just a near-instant content
    swap once (usually) sub-second Firestore round-trip completes.
  - `src/firebase.js` exposes generic `fetchDoc(collection, id)` / `fetchCollection(collection)`
    — both dynamically `import()` only `firebase/app` + `firebase/firestore`'s modular
    named-function exports (`initializeApp`, `getApps`, `getFirestore`, `doc`, `getDoc`,
    `collection`, `getDocs`; never the namespaced/compat API, never unused services like
    auth/storage), gated on `firebaseEnabled` (`VITE_FIREBASE_*` env vars set). Confirmed via
    `vite build`: the main chunk's size is unaffected by Firestore being enabled or not —
    firebase code-splits into its own chunk that's simply never fetched when disabled.
  - `scripts/seed-firestore.mjs` pushes `data.js` + `projectDetailsData.js` into this schema —
    run once after setting up a Firestore project and filling `.env` (see `.env.example`).
- `Projects.jsx`'s project-card click handler derives the `/projects/:id` route from
  `project.id` (present on every project object from both Firestore and the local fallback)
  rather than re-parsing `detailsLink`.
- No global state management beyond these hooks — no store/context for app state besides
  local component state (theme toggle, modals, terminal).
- Theme (`data-theme` on `<html>`) is set by a blocking inline script in `index.html` BEFORE
  the CSS cascade runs, reading `localStorage.theme` — this prevents a flash of wrong theme on
  load. Don't move this into a React effect; it would reintroduce the flash.

## Routing & SPA-on-GitHub-Pages

Pure client-side routing (React Router), no SSR. GitHub Pages can't serve arbitrary client
routes on direct hit/refresh, so `public/404.html` + an inline script in `index.html` work
together as the standard "SPA GitHub Pages redirect" trick (see README for the mechanism).
Both halves must stay in sync — don't edit one without the other.

Consequence for SEO: every route shares the exact same `<head>` tags (title, meta description,
OG, JSON-LD) from `index.html` — there's no per-route metadata. See
`SEARCH_ENGINE_OPTIMIZATION.md` (or the `search-engine-optimization` skill) before changing
anything SEO-related.

## Build & deploy

`pnpm build` → Vite outputs to `dist/`, automatically including everything in `public/`
(favicon, `404.html`, `robots.txt`, `sitemap.xml`, `og-image.png`) via Vite's default
`publicDir` behavior — no extra config needed for those files to end up live.

`.github/workflows/deploy.yml` (push to `main`) builds, then additionally copies `assets/`,
`project_pictures/`, and `games/` into the deploy output alongside `dist/`'s contents, because
those are referenced by relative/absolute runtime paths (image `src`, game iframe/links) that
Vite never touches (they're not imported in JS, just referenced as URL strings). Pushes the
result to the `publish` branch via `JamesIves/github-pages-deploy-action`. GitHub Pages serves
`publish` at `codism.in` — custom domain is configured in repo Settings → Pages, not via a
`CNAME` file in the repo (there deliberately isn't one).

The deploy workflow has no `VITE_FIREBASE_*` env step — even with a local `.env` filled in, a
CI build currently ships with Firestore disabled (static fallback only) unless those are added
as repo secrets and wired into the `Build Production Bundle` step.

## Content management is external, not in this repo

There used to be a local static admin panel at `admin/` (plain HTML/ES modules, Firebase Auth-
gated, wrote directly to Firestore/Storage) — the user built a separate admin panel elsewhere
and deleted this repo's `admin/` folder entirely. **Don't recreate it without being asked.**
`about/main` and `projects/{id}` are still edited via that external tool, in the same schema
`src/api/*.js` reads (see "Data layer" above) — this repo only ever reads that data, never
writes it. If `scripts/seed-firestore.mjs` or `scripts/upload-project-pictures.mjs` are needed
again (re-seeding from `data.js`, or the one-time local-image migration), they're still here
and still use the Admin SDK (`scripts/firebase-admin-init.mjs`) independent of the deleted
admin panel.
