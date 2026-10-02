# Architecture

## Layout

See README.md for the top-level folder map. Key points not obvious from file names:

- `App.jsx` defines two routes: `/` (the full one-page scroll: Hero, About, Skills, Timeline,
  Projects, Certificates) and `/projects/:projectId` (`ProjectDetailWrapper` → calls
  `useProjectDetails(projectId)` for that project's case-study content).
- **Data layer (`src/api/` + `src/hooks/` + `src/firebase.js`)** — split by what's actually
  worth fetching:
  - **Bio/contact/education/experience/skills/interests/certificates always come straight
    from `data.js`** — `App.jsx` imports it directly (`staticData`), no fetch, no loading
    state, no empty-page flash on first visit. There is no `src/hooks/useAboutMe.js` or
    `src/api/about.js` on purpose (deleted) — the only thing that still reads/writes Firestore
    `about/main` is the admin panel (`admin/js/about-api.js`), which is now a content-notes
    store the live site doesn't consult. Don't recreate a site-side `useAboutMe` hook without
    re-confirming the user still wants that; last explicit instruction was "data.js for the
    home page only."
  - **Only projects are Firestore-backed.** Firestore schema: `projects/{id}` (one doc per
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

## Admin panel (`admin/`)

Separate, NOT part of the Vite build or the deploy workflow (confirmed: never appears in
`dist/`, never copied by `deploy.yml`) — plain static HTML + ES modules, served locally via
`python admin/serve.py` purely so browser ES module imports work over `http://` (they're
blocked from `file://`). Loads the Firebase modular SDK straight from
`gstatic.com/firebasejs/<version>/...` (pin matches `node_modules/firebase`'s version) since
there's no bundler here. Talks directly to Firestore/Storage/Auth from the browser — writes
`about/main` and `projects/{id}` in the same shape `src/api/*.js` reads. Gated by Firebase Auth
email/password (one user, created manually in Firebase Console); see `admin/README.md` for
full setup including sample Firestore/Storage security rules. Not wired into CI; run it only
locally.
