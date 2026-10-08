# Session Handoff

_Last updated: 2026-10-09_

## Current state

Fully Firestore-backed SPA, no local static content anywhere in `src/`. `eslint .` clean,
`vite build` clean. Nothing committed yet this session — all changes below are staged/edited
only, not committed, not pushed. Follow `CLAUDE.md`'s git rules (no AI co-author trailer; a
bare "push" means just `git push`, nothing else) when the user asks to commit/push.

## What just happened (this session)

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

## Fallback data & unblocking render

- Restored `data.js` as the instant-render fallback (`localAboutMe()` and `localProjectsList()`) so first paint is never blank while Firestore initializes.
- Updated `useAboutMe.js` to serve cached or `localAboutMe()` immediately on mount, updating silently in background when Firestore returns.
- Fixed `aboutReady` in `App.jsx`: previously, every section was blocked waiting for `useImagePreload(data.images?.profile)`. Now latches to `true` whenever data is present or the profile image finishes loading, ensuring content never stays hidden.

## How to use this file

Overwrite this file each session — it's current state, not a changelog.
