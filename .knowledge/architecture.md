# Architecture

## Layout

See README.md for the top-level folder map. Key points not obvious from file names:

- `App.jsx` defines two routes: `/` (the full one-page scroll: Hero, About, Skills, Timeline,
  Projects, Certificates) and `/projects/:projectId` (`ProjectDetailWrapper` → calls
  `useProjectDetails(projectId)` for that project's case-study content).
- **Data layer (`src/api/` + `src/hooks/` + `src/firebase.js`)** — Firestore is now the ONLY
  data source. There is no local static fallback anywhere in `src/` — `data.js` and
  `src/projectDetailsData.js` were archived to `datas/` (see "Archived local data" below) and
  nothing under `src/` imports from that folder.
  - **Bio/contact/education/experience/skills/interests/certificates/stats/resume** —
    `src/hooks/useAboutMe.js` + `src/api/about.js`, reading the single `about/main` doc.
    `src/api/about.js` exports `emptyAboutMe()`, a fully-shaped-but-blank object (every field
    present as `''`/`[]`/nested empty object) used as the base of `App.jsx`'s composed `data`
    (`{ ...emptyAboutMe(), ...aboutData, projects }`) so components that destructure fields
    unconditionally during render (e.g. `Hero.jsx`'s `name.split(" ")`) never see `undefined`,
    even while Firestore is still loading or if it's unreachable. `getAboutMe()` caches in
    sessionStorage for 30s (`src/api/cache.js`); `useAboutMe()` always refetches with
    `force: true` on route change, so admin edits show up promptly without waiting 30s.
  - **Projects** — a separate Firestore collection (genuinely needs its own fetch — unbounded-
    size list, not a single small doc). Schema: `projects/{id}` (one doc per project, merging
    card fields + case-study fields; `{id}` doubles as the `/projects/:id` route param).
    `src/api/projects.js` (`listProjects()`, `getProjectDetails(id)`) has NO caching and NO
    local fallback — on error or empty result it returns `{ projects: [] }` /
    `{ project: null, details: null }`, nothing more. Edits from the external admin panel must
    show up on next load, not after a stale cache window.
  - `src/hooks/useProjects.js`, `useProjectDetails.js` are thin wrappers exposing
    `{ projects/project+details, loading, error, source }` to components, refetching on
    `location.pathname` change.
  - `src/firebase.js` exposes generic `fetchDoc(collection, id)` / `fetchCollection(collection)`
    — both dynamically `import()` only `firebase/app` + `firebase/firestore`'s modular
    named-function exports (`initializeApp`, `getApps`, `getFirestore`, `doc`, `getDoc`,
    `collection`, `getDocs`; never the namespaced/compat API, never unused services like
    auth/storage), gated on `firebaseEnabled` (`VITE_FIREBASE_*` env vars set). Confirmed via
    `vite build`: the main chunk's size is unaffected by Firestore being enabled or not —
    firebase code-splits into its own chunk that's simply never fetched when disabled.
- `Projects.jsx`'s project-card click handler derives the `/projects/:id` route from
  `project.id`, falling back to `detailsLink` only if present; a project is considered to have
  a detail page if it has `detailsLink` OR a non-empty `narratives` array.

## Archived local data (`datas/`)

`data.js`, `src/projectDetailsData.js`, `assets/`, and `project_pictures/` were moved to
`datas/` (as `datas/data.js`, `datas/projectDetailsData.js`, `datas/assets/`,
`datas/project_pictures/`) once the site became fully Firestore-only — they're historical seed
data, not live code. Nothing in `src/` references this folder. The only things that still read
from it are the one-off migration scripts:
- `scripts/seed-firestore.mjs` — pushes `datas/data.js` + `datas/projectDetailsData.js` into
  Firestore (`about/main` + `projects/{id}`). Run once per fresh Firestore project.
- `scripts/upload-project-pictures.mjs` — uploads the image files `datas/projectDetailsData.js`
  references (under `datas/project_pictures/`) into Firebase Storage and merges the resulting
  URLs into each `projects/{id}` doc.

Favicon is the one exception: `assets/logo.svg` had an identical copy already at
`public/logo.svg`, so `index.html` references `/logo.svg` (served from `public/`) directly —
no dependency on `datas/`.
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

`.github/workflows/deploy.yml` (push to `main`) builds, then additionally copies `games/` into
the deploy output alongside `dist/`'s contents, because it's referenced by relative/absolute
runtime paths (iframe/links) that Vite never touches (not imported in JS, just referenced as
URL strings). `assets/`/`project_pictures/` are no longer copied — they were archived to
`datas/` and all real content now comes from Firestore/Firebase Storage. Pushes the result to
the `publish` branch via `JamesIves/github-pages-deploy-action`. GitHub Pages serves `publish`
at `codism.in` — custom domain is configured in repo Settings → Pages, not via a `CNAME` file
in the repo (there deliberately isn't one).

`vite.config.js` sets `base: '/'` (NOT `'./'`) — a relative base breaks any direct load/reload
of a nested route like `/projects/certflow`, because the built `<script src="./assets/...">`
then resolves relative to `/projects/`, not site root. This was the root cause of a real "blank
page on reload" bug; don't change this back to a relative base.

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
again (re-seeding from `datas/data.js`, or the one-time local-image migration), they're still
here and still use the Admin SDK (`scripts/firebase-admin-init.mjs`) independent of the deleted
admin panel.
