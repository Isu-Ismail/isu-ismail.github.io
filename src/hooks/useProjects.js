import { useEffect, useState } from 'react';
import { listProjects, getCachedProjectsList } from '../api/projects';

export function useProjects() {
  const [state, setState] = useState(() => {
    const cached = getCachedProjectsList();
    return {
      projects: cached || [],
      loading: !cached || cached.length === 0,
      error: null,
      source: cached && cached.length > 0 ? 'cache' : 'pending',
    };
  });

  useEffect(() => {
    let cancelled = false;
    listProjects().then((result) => {
      if (!cancelled) setState({ ...result, loading: false });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
