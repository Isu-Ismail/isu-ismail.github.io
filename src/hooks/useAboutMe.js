import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getAboutMe, getCachedAboutMe, localAboutMe } from '../api/about';

/**
 * Serves instantly on every render from cache or static data,
 * and always refetches fresh from Firestore on page navigation.
 */
export function useAboutMe() {
  const location = useLocation();
  const [state, setState] = useState(() => {
    const cached = getCachedAboutMe();
    if (cached) return { data: cached, source: 'cache' };
    return { data: localAboutMe(), source: 'static' };
  });

  useEffect(() => {
    let cancelled = false;
    // Always refetch fresh on navigation
    getAboutMe({ force: true }).then((result) => {
      if (!cancelled && result.source === 'firestore') {
        setState({ data: result.data, source: 'firestore' });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [location.pathname]);

  return state;
}
