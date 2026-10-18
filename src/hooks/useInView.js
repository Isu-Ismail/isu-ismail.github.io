import { useEffect, useRef, useState } from 'react';

/**
 * Returns [ref, isVisible] — isVisible flips true once the ref'd element
 * enters the viewport (IntersectionObserver, not a scroll listener, so it's
 * cheap and doesn't run on every scroll frame) and stays true afterward
 * (one-shot reveal, not a repeating show/hide on every scroll pass).
 *
 * threshold is deliberately tiny (not e.g. 0.15): threshold is a ratio of
 * the TARGET's own area, not the viewport's. Sections wrapped whole in
 * <Reveal> (Projects, Skills) can be much taller than the viewport on a
 * narrow mobile screen (single-column card stack) — a 15%-of-own-area
 * threshold then requires scrolling most of the way through the section
 * before it ever fires, so cards sat at opacity:0 (still clickable, since
 * opacity doesn't block pointer events) well past where they visually
 * should have appeared. A near-zero threshold fires as soon as the section's
 * top edge is on screen, independent of how tall the section itself is.
 */
export function useInView(options) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.01, rootMargin: '0px 0px -60px 0px', ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);

  return [ref, isVisible];
}
