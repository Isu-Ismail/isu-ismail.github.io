# Session Handoff

_Last updated: 2026-10-02_

## What just happened

First substantial agent session on this project — set up the standard doc structure (this
file + `architecture.md` + root `README.md`/`CLAUDE.md`/`AGENTS.md`) and did a full SEO pass:

- `index.html`: added `robots` meta, canonical link, Open Graph + Twitter Card tags, and a
  JSON-LD `Person` schema (name, jobTitle, sameAs: GitHub/LinkedIn). Title and meta description
  already existed and were left mostly as-is (already reasonable — name + role + specialty).
- `public/robots.txt` — allow all, points to sitemap.
- `public/sitemap.xml` — home page + all 10 `/projects/:id` routes (ids read directly from
  `src/projectDetailsData.js`: middleman, slqc, sriautoamtion, ctskii, cwm, eggshell, seven5,
  virtuallab, billgenie, cgpa). If project ids change, this file goes stale — keep it in sync.
- `public/og-image.png` — copied from `src/assets/hero.png`. **Same limitation as the cgpa
  project**: 343×361px, not the recommended 1200×630 OG banner size. Works but will look
  small/cropped on share previews. Flagged, not fixed (can't generate images).
- Verified via `pnpm build` that `robots.txt`/`sitemap.xml`/`og-image.png` land in `dist/`
  automatically (Vite's default `publicDir` behavior) and confirmed the existing deploy
  workflow already `cp -r dist/*`s everything into the publish output — **no workflow edit was
  needed**, despite the user asking to "edit the deploy to add the sitemap." Told the user this
  explicitly rather than making a no-op edit just to match the literal ask.
- Live domain confirmed via `gh api repos/Isu-Ismail/portfolio/pages`: `codism.in` (apex, not a
  subdomain), custom domain set via GitHub repo Settings, NOT a committed `CNAME` file — this
  is deliberately different from the `cgpa` project's setup, don't "fix" it by adding one.

## State of the project

React 19 + Vite 8 + React Router 7 SPA, deployed to `codism.in` via GitHub Pages (`publish`
branch). No test suite. Confirmed working live (`curl -I https://codism.in/` → 200) before
this session started.

## Next agent: what to check

- **Not yet committed or pushed.** All changes above (index.html, public/robots.txt,
  public/sitemap.xml, public/og-image.png, README.md, CLAUDE.md, AGENTS.md, .knowledge/) are
  sitting in the working tree. Confirm with the user before committing/pushing — this repo's
  git status at session start showed OTHER unrelated uncommitted changes too (`data.js`,
  several `project_pictures/ctskii/*` images) that are NOT part of this SEO work — don't bundle
  those into a commit for this work without checking with the user first, they may be
  mid-edit on something else.
- After pushing, the user will likely want to register `codism.in` in Google Search Console
  and submit the sitemap — same mechanics as documented in the `search-engine-optimization`
  skill (full URL in the Sitemaps field, since this could end up as either a domain or
  URL-prefix property depending how they verify).
- If new projects get added to `projectDetailsData.js`, `public/sitemap.xml` needs a matching
  new `<url>` entry — this isn't automated.

## How to use this file

Overwrite this file each session — it's current state, not a changelog.
