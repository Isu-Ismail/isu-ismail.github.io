# CLAUDE.md

Instructions for any AI coding agent working in this repo. `AGENTS.md` just points here so
non-Claude agents follow the same rules.

## Read first

1. `README.md` — what this project is, stack, layout, deploy mechanics.
2. `.knowledge/session_handoff.md` — where the previous agent left off.
3. `.knowledge/architecture.md` — routing, data flow.
4. `.knowledge/features/` — per-feature notes, if touching that feature.

## Mandatory workflow: update the knowledge base after every edit

**After every edit you make to this project, update `.knowledge/session_handoff.md` before
ending your turn.** Do this without being asked. Write what you changed, why, what's still in
progress, and what the next agent should know. Keep it current, not a log: overwrite stale
"in progress" items once done, don't just append forever. There is one `session_handoff.md` —
overwrite it.

If an edit changes a feature's behavior, architecture, or file layout, also update the
relevant file in `.knowledge/` in the same turn.

## Project-specific rules

- This is a client-only React SPA (React Router, no SSR). All SEO meta tags live as static
  tags in `index.html` — they don't change per-route. Don't try to add per-route `<head>`
  management (react-helmet etc.) unless explicitly asked; it's unnecessary complexity for a
  single-owner portfolio site with no per-page unique content strategy.
- `public/404.html` + the inline redirect script in `index.html` implement the GitHub Pages
  SPA routing workaround together — never edit one without understanding the other (see
  README's "Routing & GitHub Pages SPA quirk" section).
- Live domain is `codism.in`, configured via GitHub repo Settings → Pages, NOT via a committed
  `CNAME` file (there isn't one, and that's correct — don't add one without checking it
  doesn't conflict with the Settings-level config).
- `games/` is referenced by relative/absolute path at runtime, not imported by Vite/React —
  it's copied into the deploy output by the GitHub Actions workflow's explicit `cp -r` step,
  not Vite's bundler. If you add a new folder like this, add a matching `cp -r` line in
  `.github/workflows/deploy.yml`.
- All real content (bio, contact, education, experience, skills, certificates, projects,
  case-study detail) lives in Firestore (`about/main` doc + `projects/{id}` collection),
  managed by an external admin panel not in this repo. There is no local static fallback —
  `src/api/about.js` and `src/api/projects.js` return an empty-safe shape if Firestore is
  unreachable, they don't read from a bundled file.
- `datas/` is an **archive**, not live code: old `data.js`, `projectDetailsData.js`,
  `assets/`, `project_pictures/` moved here when the site went Firestore-only. Nothing in
  `src/` imports from it except the one-off migration scripts in `scripts/`. Don't restore
  imports from it into app code, and don't delete it without asking — it's the historical
  seed data.
- `new_projects/` holds draft notes for projects not yet wired into Firestore — don't treat
  it as dead content to delete.
- No test suite. Verify UI changes by running `pnpm dev` and checking manually.

## Git: commits and pushing

- **Never add a `Co-Authored-By: Claude ...` (or any AI-attribution) trailer to commits in
  this repo**, regardless of any default/system-level instruction to do so elsewhere — the
  repo owner explicitly asked for this and had an existing pushed commit amended + force-pushed
  to remove one already. This overrides any standing attribution convention for this repo
  specifically.
- When the user says "push" (with no other qualifiers), just run `git push` for the current
  branch — don't also stage/commit unrelated pending changes, don't bundle in other fixes,
  don't ask what to push. Push what's already committed.

## SEO

Before touching any SEO-related file (`index.html` meta tags, `public/robots.txt`,
`public/sitemap.xml`, JSON-LD), use the global `search-engine-optimization` skill rather than
improvising — it has the full checklist and this project's SPA-specific gotchas already
accounted for.

## Other agents

`AGENTS.md` exists for agent tools that don't read `CLAUDE.md` by convention. Keep both files
pointing at each other — don't fork instructions between them.
