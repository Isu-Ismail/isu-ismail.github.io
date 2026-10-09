import { fetchDoc, subscribeDoc } from '../firebase';
import { cacheGet, cacheSet } from './cache';
import { data as staticData } from '../../data.js';

const CACHE_KEY = 'about:main';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours (listener keeps it fresh in-memory)

export function localAboutMe() {
  const rest = { ...staticData };
  delete rest.projects;
  return rest;
}

export function emptyAboutMe() {
  return localAboutMe();
}

// Synchronous cache-only lookup for a lazy useState initializer — lets the
// very first render show cached Firestore data instantly, no flash.
export function getCachedAboutMe() {
  return cacheGet(CACHE_KEY);
}

// In-memory live store for about/main
let inMemoryData = null;
const subscribers = new Set();
let firestoreUnsubscribe = null;

export function getCurrentAboutMe() {
  if (inMemoryData) {
    return { data: inMemoryData, loading: false, source: 'firestore-live' };
  }
  const cached = getCachedAboutMe();
  if (cached) {
    return { data: cached, loading: false, source: 'cache' };
  }
  return { data: localAboutMe(), loading: false, source: 'static' };
}

function notifySubscribers(state) {
  for (const sub of subscribers) {
    try {
      sub(state);
    } catch (err) {
      console.error('Subscriber callback error:', err);
    }
  }
}

/**
 * Subscribes to real-time updates for about/main via Firestore onSnapshot.
 * Notifies with the latest data whenever Firestore pushes an update.
 */
export function subscribeToAboutMe(callback) {
  subscribers.add(callback);

  // Immediately notify the new subscriber with the best available current data
  callback(getCurrentAboutMe());

  // If this is the first subscriber, start the Firestore real-time listener
  if (!firestoreUnsubscribe) {
    firestoreUnsubscribe = subscribeDoc(
      'about',
      'main',
      (remote) => {
        if (remote) {
          inMemoryData = remote;
          cacheSet(CACHE_KEY, remote, CACHE_TTL_MS);
          notifySubscribers({ data: remote, loading: false, source: 'firestore-live' });
        }
      },
      (err) => {
        console.warn('Real-time about/main listener error, using cached/static fallback:', err);
        if (!inMemoryData) {
          notifySubscribers(getCurrentAboutMe());
        }
      }
    );
  }

  return () => {
    subscribers.delete(callback);
  };
}

/**
 * GET about/main — name, role, bio, hero tagline, contact, education,
 * experience, skills, skillCards, interests, certificates, stats, resume + images.
 * Cached in sessionStorage for 24h. Set force: true to bypass the cache.
 */
export async function getAboutMe({ force = false } = {}) {
  if (!force) {
    if (inMemoryData) return { data: inMemoryData, source: 'firestore-live' };
    const cached = cacheGet(CACHE_KEY);
    if (cached) return { data: cached, source: 'cache' };
  }

  try {
    const remote = await fetchDoc('about', 'main');
    if (remote) {
      inMemoryData = remote;
      cacheSet(CACHE_KEY, remote, CACHE_TTL_MS);
      return { data: remote, source: 'firestore' };
    }
  } catch (err) {
    return { data: inMemoryData || localAboutMe(), source: 'static-fallback', error: err };
  }
  return { data: inMemoryData || localAboutMe(), source: 'static' };
}
