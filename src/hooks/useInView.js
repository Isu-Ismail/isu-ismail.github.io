import { useEffect, useRef, useState } from 'react';

/**
 * Returns [ref, isVisible] — isVisible flips true once the ref'd element
 * enters the viewport (IntersectionObserver, not a scroll listener, so it's
 * cheap and doesn't run on every scroll frame) and stays true afterward
 * (one-shot reveal, not a repeating show/hide on every scroll pass).
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
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px', ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);

  return [ref, isVisible];
}
