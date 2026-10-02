import { useEffect, useState } from 'react';
import { getProjectDetails, getCachedProjectDetails } from '../api/projects';

export function useProjectDetails(id) {
  // Lazy initializer: a fresh cache hit is checked BEFORE first paint, so a
  // cached project renders immediately with no loading/skeleton flash at all.
  const [state, setState] = useState(() => {
    const cached = id ? getCachedProjectDetails(id) : null;
    if (cached) return { ...cached, loading: false };
    return { project: null, details: null, loading: true, error: null, source: 'pending' };
  });

  useEffect(() => {
    if (!id) return;
    if (getCachedProjectDetails(id)) return; // already satisfied by the lazy initializer above

    let cancelled = false;
    getProjectDetails(id).then((result) => {
      if (!cancelled) setState({ ...result, loading: false });
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return state;
}
