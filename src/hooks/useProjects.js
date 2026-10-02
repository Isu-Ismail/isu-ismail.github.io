import { useEffect, useState } from 'react';
import { listProjects, getCachedProjects } from '../api/projects';

export function useProjects() {
  // Lazy initializer: a fresh cache hit is checked BEFORE first paint, so a
  // cached project list renders immediately with no skeleton flash at all.
  const [state, setState] = useState(() => {
    const cached = getCachedProjects();
    if (cached) return { ...cached, loading: false };
    return { projects: [], loading: true, error: null, source: 'pending' };
  });

  useEffect(() => {
    if (getCachedProjects()) return; // already satisfied by the lazy initializer above

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
