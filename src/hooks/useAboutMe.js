import { useEffect, useState } from 'react';
import { subscribeToAboutMe, getCurrentAboutMe } from '../api/about';

/**
 * Real-time subscription to about/main.
 * Pushes live updates immediately whenever changes are saved in port-admin.
 * Serves instantly from memory / sessionStorage on initial mount, and incurs
 * 0 additional Firestore reads on internal route navigation.
 */
export function useAboutMe() {
  const [state, setState] = useState(() => getCurrentAboutMe());

  useEffect(() => {
    const unsubscribe = subscribeToAboutMe((newState) => {
      setState(newState);
    });
    return unsubscribe;
  }, []);

  return state;
}
