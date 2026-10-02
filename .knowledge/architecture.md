# Architecture

## Layout

See README.md for the top-level folder map. Key points not obvious from file names:

- `App.jsx` defines two routes: `/` (the full one-page scroll: Hero, About, Skills, Timeline,
  Projects, Certificates) and `/projects/:projectId` (`ProjectDetailWrapper` → reads
  `src/projectDetailsData.js[projectId]` for that project's case-study content).
- `data.js` (repo root, not under `src/`) holds the site owner's bio/contact/education/
  experience — imported by the home-page components. `src/projectDetailsData.js` is separate,
  holds per-project case-study content (metrics, tech specs, architecture diagrams data,
  narrative paragraphs) keyed by project id.
- No global state management — content is static data imported directly, no store/context for
  app state beyond local component state (theme toggle, modals, terminal).
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
