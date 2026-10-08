import { useEffect, useState } from 'react';

// Preloads an image off-DOM (via `new Image()`) and reports when it's ready
// — lets a section show a skeleton until its hero image has actually
// downloaded, instead of flashing a blank/broken box while it loads.
export function useImagePreload(src) {
  const [prevSrc, setPrevSrc] = useState(src);
  const [loaded, setLoaded] = useState(false);

  // Reset synchronously during render when src changes (not via setState in
  // an effect) — React's documented pattern for this.
  if (src !== prevSrc) {
    setPrevSrc(src);
    setLoaded(false);
  }

  useEffect(() => {
    if (!src) return;
    let cancelled = false;
    const img = new Image();
    img.onload = () => { if (!cancelled) setLoaded(true); };
    img.onerror = () => { if (!cancelled) setLoaded(true); }; // don't block forever on a broken URL
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);

  return loaded;
}
