import { useEffect, useState } from 'react';
import { getProjectDetails } from '../api/projects';

export function useProjectDetails(id) {
  const [state, setState] = useState({ project: null, details: null, loading: true, error: null, source: 'pending' });

  useEffect(() => {
    if (!id) return;
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
