import { useEffect } from 'react';
import { lockScroll, unlockScroll } from '../lib/lenis';

// Locks page scroll (body overflow + pausing Lenis) while `active` is true,
// unlocking on cleanup. Shared by every modal/drawer so the lock/unlock
// pairing — and the Lenis-aware part of it — lives in one place.
export function useScrollLock(active) {
  useEffect(() => {
    if (!active) return;
    lockScroll();
    return unlockScroll;
  }, [active]);
}
