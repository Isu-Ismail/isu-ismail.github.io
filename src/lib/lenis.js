// Shared handle to the single Lenis instance `useLenis` creates, so other
// components (Navbar's section-link clicks, modal scroll-locking) can drive
// the SAME engine instead of fighting it with separate native scroll calls.
let instance = null;

export function setLenisInstance(lenis) {
  instance = lenis;
}

export function smoothScrollTo(target, options = {}) {
  if (instance) {
    instance.scrollTo(target, { duration: 1.2, ...options });
    return;
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth' });
}

// `lenis.stop()` turns out too broad: it blocks ALL wheel/touch handling,
// including inside the modal's own scrollable content (Terminal history,
// Resume preview, lightbox captions) — not just the page behind it. Locking
// via `overflow: hidden` on both <html> and <body> instead: with nothing
// left for the page to scroll, Lenis's wheel handler has no effect on it,
// while elements marked `data-lenis-prevent` (Terminal output, modal scroll
// areas — see each component) keep scrolling natively, untouched by Lenis
// either way. Counted so two modals opening/closing independently (e.g.
// Terminal + a lightbox) can't have the second modal's close prematurely
// re-enable scrolling while the first is still open.
let lockCount = 0;

export function lockScroll() {
  lockCount += 1;
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
}

export function unlockScroll() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  }
}
