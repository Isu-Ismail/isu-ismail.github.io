import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getAboutMe, getCachedAboutMe } from '../api/about';

/**
 * Serves instantly from a fresh (30s) sessionStorage cache if one exists,
 * else starts loading — there is no local static fallback anymore (all
 * content lives in Firestore, managed by an external admin panel), so a
 * cold cache genuinely has nothing to show until the fetch resolves.
 * Always refetches fresh on route changes (force: true), bypassing the
 * cache, so navigating around picks up admin edits promptly.
 */
export function useAboutMe() {
  const location = useLocation();
  const [state, setState] = useState(() => {
    const cached = getCachedAboutMe();
    if (cached) return { data: cached, loading: false, source: 'cache' };
    return { data: null, loading: true, source: 'pending' };
  });

  useEffect(() => {
    let cancelled = false;
    getAboutMe({ force: true }).then((result) => {
      if (!cancelled) setState({ ...result, loading: false });
    });
    return () => {
      cancelled = true;
    };
  }, [location.pathname]);

  return state;
}
