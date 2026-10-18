import { useEffect } from 'react';
import Lenis from 'lenis';
import { setLenisInstance } from '../lib/lenis';

/**
 * Lenis still drives the REAL document scroll position each frame (not a
 * virtual/transform-based scroll), so every existing scroll listener
 * (Navbar's scrolled-state, UnifiedBackground's `is-scrolling` toggle,
 * `history.scrollRestoration`) keeps working with no changes. Skipped
 * entirely under prefers-reduced-motion.
 */
export function useLenis() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
    });
    setLenisInstance(lenis);

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      setLenisInstance(null);
    };
  }, []);
}
