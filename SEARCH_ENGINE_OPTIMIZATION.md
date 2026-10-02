# SEO — Portfolio (codism.in)

Project-specific SEO record. For general methodology, use the global
`search-engine-optimization` skill — this file only records what's actually true here.

## Review first

```bash
curl -sI https://codism.in/                  | head -3
curl -sI https://codism.in/robots.txt        | head -3
curl -sI https://codism.in/sitemap.xml       | head -3
curl -sI https://codism.in/og-image.png      | head -3
grep -n "title\|description\|og:\|twitter:\|ld+json" index.html
cat public/robots.txt public/sitemap.xml
git status --short   # check nothing SEO-related is sitting uncommitted
```

## What's implemented (as of 2026-10-02)

- `index.html` `<head>`: existing `<title>`/`<meta description>` kept (already reasonable —
  name + role + specialty); added `robots` meta, canonical link, OG + Twitter Card tags, and a
  JSON-LD `Person` schema (name, jobTitle, `sameAs`: GitHub + LinkedIn).
- `public/robots.txt` — allow all, points to sitemap.
- `public/sitemap.xml` — home page (`/`) plus all 10 `/projects/:id` routes. IDs come straight
  from the keys of `src/projectDetailsData.js` (currently: middleman, slqc, sriautoamtion,
  ctskii, cwm, eggshell, seven5, virtuallab, billgenie, cgpa). **Not automated** — if a project
  is added/removed there, update this file manually.
- `public/og-image.png` — copied from `src/assets/hero.png`. **Known limitation**: 343×361px,
  not the recommended 1200×630 OG banner size. Works but looks small/cropped on share
  previews. Needs an actual designed banner — flagged, not fixed.

## SPA gotcha that applies here

Pure client-side React Router SPA, no SSR. All routes — home and every `/projects/:id` page —
share the exact same `<head>` tags from `index.html`; there's no per-route title/description.
Google's crawler executes JS and will see each project page's actual content, but a crawler
that doesn't execute JS (most AI crawlers) sees identical generic meta on every URL. This is
an accepted tradeoff for a single-owner portfolio, not a bug — don't "fix" it with
react-helmet/per-route meta unless explicitly asked; it's real complexity for marginal benefit
at this site's scale (one person, ten projects, no SEO-driven traffic funnel per project).

## Deploy

No custom deploy step needed for SEO files — Vite copies `public/` into `dist/` automatically
(`publicDir` default), and `.github/workflows/deploy.yml` already copies all of `dist/*` into
the publish output. Verified via `pnpm build` + checking `dist/` contents.

Live domain `codism.in` is configured via GitHub repo Settings → Pages (confirmed via
`gh api repos/Isu-Ismail/portfolio/pages`), NOT a committed `CNAME` file. This is different
from how the `cgpa` project's custom domain is wired (that one does write a `CNAME` file in
its deploy workflow) — don't assume the same pattern applies here.

## Next possible SEO work (not done, not asked for)

- Proper 1200×630 OG banner image.
- Google Search Console registration + sitemap submission (same mechanics as the
  `search-engine-optimization` skill documents) — not done yet as of this writing.
