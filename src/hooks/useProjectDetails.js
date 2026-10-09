import { useEffect, useState } from 'react';
import { subscribeToProjectDetails, getCachedProjectDetails } from '../api/projects';

/**
 * Subscribes to real-time project details via Firestore onSnapshot.
 * Synchronously initializes from memory / sessionStorage (no skeleton flash on revisit),
 * and live-pushes any changes saved in port-admin.
 */
export function useProjectDetails(id) {
  const [state, setState] = useState(() => getCachedProjectDetails(id));

  useEffect(() => {
    if (!id) return;
    const unsubscribe = subscribeToProjectDetails(id, (nextState) => {
      setState(nextState);
    });
    return unsubscribe;
  }, [id]);

  return state;
}
