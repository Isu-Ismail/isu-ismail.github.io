# A.M. Ismail — Portfolio

React + Vite single-page portfolio site for Ismail (Production Engineering student, systems/
automation projects). Live at [codism.in](https://codism.in).

## Stack

- React 19 + React Router 7 (client-side routing, no SSR)
- Vite 8, Tailwind CSS v4
- Deployed as a static SPA to GitHub Pages (custom domain `codism.in`) via a GitHub Actions
  workflow that pushes the build to a `publish` branch

## Layout

```
port/
├── index.html              # SPA entry — title/meta/OG/JSON-LD all live here (see SEO note)
├── data.js                 # site owner's bio/contact/education/experience content
├── src/
│   ├── App.jsx              # routes: "/" (home) and "/projects/:projectId" (detail pages)
│   ├── projectDetailsData.js  # per-project detail content, keyed by project id
│   └── components/          # Hero, Projects, About, Skills, Timeline, Certificates,
│                             # ProjectDetail, Navbar, Terminal, ResumeModal, backgrounds
├── public/                 # static assets copied as-is into the build (robots.txt,
│                            # sitemap.xml, og-image.png, favicon.svg, 404.html)
├── project_pictures/       # per-project screenshot folders, referenced by projectDetailsData.js
├── assets/                 # resume PDF, profile/hero images referenced by data.js
├── games/                  # standalone HTML mini-games (dino/pacman/snake/tetris) linked
│                            # from the site, not part of the React app
├── new_projects/           # draft README notes for projects not yet added to the site
└── overleaf/                # (empty / LaTeX resume source, not part of the deployed site)
```

## Routing & GitHub Pages SPA quirk

This is a pure client-side SPA (React Router, no server rendering). GitHub Pages doesn't
support client-side routes natively, so `public/404.html` + an inline script in `index.html`
implement the standard "SPA GitHub Pages redirect" trick: a direct hit on `/projects/foo`
bounces through `404.html`, which redirects to `/?p=/projects/foo`, which `index.html`'s
inline script then rewrites back to the real path before React Router takes over. Don't
remove either half of this without understanding both sides break together.

## Getting started

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # outputs to dist/
pnpm lint
```

## Deploy

`.github/workflows/deploy.yml` builds on every push to `main`, then copies `dist/` plus
`assets/`, `project_pictures/`, and `games/` (referenced by relative paths at runtime, not
bundled by Vite) into a `deploy_out/` folder, and pushes that to the `publish` branch via
`JamesIves/github-pages-deploy-action`. GitHub Pages serves `publish` at the custom domain
`codism.in` (configured in repo Settings, not via a committed `CNAME` file). `public/`
contents (`robots.txt`, `sitemap.xml`, `og-image.png`, etc.) are copied into `dist/`
automatically by Vite's default `publicDir` behavior — no extra workflow step needed for
those.

## SEO

Full detail in `SEARCH_ENGINE_OPTIMIZATION.md` (if present) or the global
`search-engine-optimization` skill. Short version: this is a client-only SPA, so all
title/meta/OG/JSON-LD tags live as static tags in `index.html`'s `<head>` — they're the same
on every route (no per-route meta, React Router doesn't change `<head>` contents). `/projects/
:projectId` pages ARE listed in `sitemap.xml` since Google's crawler executes JS and will see
their content, even though they share the home page's meta tags.
