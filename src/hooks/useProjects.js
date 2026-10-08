import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { listProjects } from '../api/projects';

export function useProjects() {
  const location = useLocation();
  const [state, setState] = useState({ projects: [], loading: true, error: null, source: 'pending' });

  useEffect(() => {
    let cancelled = false;
    listProjects().then((result) => {
      if (!cancelled) setState({ ...result, loading: false });
    });
    return () => {
      cancelled = true;
    };
  }, [location.pathname]);

  return state;
}
