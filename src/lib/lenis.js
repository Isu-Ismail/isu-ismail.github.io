// Shared handle to the single Lenis instance `useLenis` creates, so other
// components (Navbar's section-link clicks) can trigger a smooth scroll
// through the SAME engine driving the page, instead of fighting it with a
// separate native `scrollIntoView({ behavior: 'smooth' })` animation.
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
