import { useEffect, useState } from 'react';
import { getAboutMe, getCachedAboutMe, localAboutMe } from '../api/about';

/**
 * Serves instantly on every render — from a fresh (<5min) sessionStorage
 * cache if one exists, else from the bundled data.js — and never shows a
 * loading state itself. If the cache is cold/expired, a fetch happens in
 * the background and the result swaps in silently once it resolves (no
 * flag ever flips to "loading", so no visual reload). Callers that want a
 * loading/skeleton state for a specific piece (e.g. an image) should gate
 * on that piece's own readiness (onLoad, etc.), not on this hook.
 */
export function useAboutMe() {
  const [state, setState] = useState(() => {
    const cached = getCachedAboutMe();
    if (cached) return { data: cached, source: 'cache' };
    return { data: localAboutMe(), source: 'static' };
  });

  useEffect(() => {
    if (getCachedAboutMe()) return; // within the 5-minute window — skip the network entirely

    let cancelled = false;
    getAboutMe().then((result) => {
      if (!cancelled && result.source === 'firestore') {
        setState({ data: result.data, source: 'firestore' });
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
