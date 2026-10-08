import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getAboutMe, getCachedAboutMe, localAboutMe } from '../api/about';

/**
 * Serves instantly from a fresh (30s) sessionStorage cache or static fallback,
 * and always refetches fresh from Firestore on route changes.
 */
export function useAboutMe() {
  const location = useLocation();
  const [state, setState] = useState(() => {
    const cached = getCachedAboutMe();
    if (cached) return { data: cached, loading: false, source: 'cache' };
    return { data: localAboutMe(), loading: false, source: 'static' };
  });

  useEffect(() => {
    let cancelled = false;
    getAboutMe({ force: true }).then((result) => {
      if (!cancelled && result.data) {
        setState({ data: result.data, loading: false, source: result.source });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [location.pathname]);

  return state;
}
