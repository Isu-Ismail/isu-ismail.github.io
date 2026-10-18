# Session Handoff

_Last updated: 2026-10-18_

## Current state

Firestore-backed SPA with local fallbacks (`datas/data.js`, `datas/projectDetailsData.js`) for
instant frame-0 renders and resilient offline/unreachable handling (added in a session between
the previous handoff and this one — not something this turn touched). Real-time Firestore
listeners (`onSnapshot`) for `about/main` and project details, long-TTL (24h) memory +
sessionStorage caching. Modals are portaled to `document.body`, dimmed (no blur), scroll-locked.
Page-wide smooth scroll via Lenis (new this turn). `eslint .` and `vite build` both clean.

## What just happened (this turn)

Three asks: (1) on mobile, Projects section cards were invisible (but clicking where a card
should be still navigated into its detail page), (2) reduce font sizes dynamically on mobile,
(3) add Lenis smooth-scroll.

1. **Mobile invisible-but-clickable cards — FIXED.** Root cause: `src/hooks/useInView.js`
   (used by `Reveal`, which wraps the whole Projects/Skills/etc. sections) used
   `threshold: 0.15` — a ratio of the *target's own area*, not the viewport. On a narrow phone
   screen the Projects section (single-column card stack) is much taller than the viewport, so
   15% of its own height needs to be on-screen simultaneously before `isVisible` ever flips —
   requiring scrolling most of the way through the section first. Until then the section sat
   at `.reveal`'s `opacity: 0` (CSS opacity doesn't block clicks, which is why the cards still
   "worked" invisibly). Fixed by dropping the threshold to `0.01` so it fires as soon as the
   section's top edge is on screen, independent of the section's own height. Applies to every
   `<Reveal>`-wrapped section, not just Projects.
2. **Mobile font sizes — fluid, not per-component.** All Tailwind `text-*` sizes are rem-based,
   so added one fluid rule instead of editing every component:
   ```css
   @media (max-width: 640px) {
     html { font-size: clamp(14px, 4vw, 16.5px); }
   }
   ```
   in `src/index.css` (base `html` rule was a fixed `17.6px`). Scales every heading/body/badge
   proportionally and keeps adjusting smoothly across phone widths, not just at one breakpoint.
3. **Lenis smooth scroll — added.** `pnpm add lenis` (v1.3.27).
   - `src/hooks/useLenis.js` — creates one `Lenis` instance + its own `requestAnimationFrame`
     loop, destroyed on unmount. Skipped entirely under `prefers-reduced-motion`. Called once
     at the top of `App.jsx` (`useLenis();`).
   - `src/lib/lenis.js` — module-level singleton holding the live instance, exposing
     `smoothScrollTo(target)` so other code can scroll through the SAME engine instead of
     fighting it with a separate native animation.
   - `Navbar.jsx`'s nav-link clicks (`handleNavClick`) now call `smoothScrollTo(element)`
     instead of `element.scrollIntoView({ behavior: 'smooth' })` — avoids two competing scroll
     animations (native smooth-scroll vs. Lenis's rAF-driven one) fighting each other.
   - Lenis drives the REAL document scroll position each frame (not a virtual/transform
     scroll), so every existing scroll listener (`Navbar`'s scrolled-state,
     `UnifiedBackground`'s `is-scrolling` toggle, `history.scrollRestoration = 'manual'` in
     `main.jsx`) needed no changes — confirmed by reading each one, not by assumption.
   - Modals' `document.body.style.overflow = 'hidden'` still blocks scrolling correctly with
     Lenis active — overflow:hidden on body means there's nothing for Lenis to scroll either,
     no extra wiring needed.

Verified: `npx eslint .` clean, `npx vite build` succeeds (main chunk ~331KB/100KB gzip, Lenis
added ~3KB to that; no new chunk warnings beyond the pre-existing firebase SDK one).

## Next agent: what to check

- Not browser-verified this turn (no browser tool used) — worth a real mobile-width check that
  Projects cards now fade in promptly and that Lenis's wheel/touch feel is good, not too heavy
  (`duration: 1.1` is a starting guess, not tuned against real feedback).
- Nothing from this turn is committed. Follow `CLAUDE.md`'s git rules exactly when asked to
  commit/push (no AI attribution trailer; a bare "push" means just `git push`).

## How to use this file

Overwrite this file each session — it's current state, not a changelog.
