import { fetchDoc } from '../firebase';
import { cacheGet, cacheSet } from './cache';
import { data as staticData } from '../../data.js';

const CACHE_KEY = 'about:main';
const CACHE_TTL_MS = 30 * 1000; // 30 seconds (reduced per user requirement)

// Everything in data.js except `projects` (that's its own collection/fetch —
// see api/projects.js) — the synchronous, always-available fallback.
export function localAboutMe() {
  const rest = { ...staticData };
  delete rest.projects;
  return rest;
}

// Synchronous cache-only lookup for a lazy useState initializer — lets the
// very first render show cached Firestore data instantly, no flash.
export function getCachedAboutMe() {
  return cacheGet(CACHE_KEY);
}

/**
 * GET about/main — name, role, bio, hero tagline, contact, education,
 * experience, skills, skillCards, interests, certificates, stats, resume + images.
 * Cached in sessionStorage for 30s. Set force: true to bypass cache.
 */
export async function getAboutMe({ force = false } = {}) {
  if (!force) {
    const cached = cacheGet(CACHE_KEY);
    if (cached) return { data: cached, source: 'cache' };
  }

  try {
    const remote = await fetchDoc('about', 'main');
    if (remote) {
      cacheSet(CACHE_KEY, remote, CACHE_TTL_MS);
      return { data: remote, source: 'firestore' };
    }
  } catch (err) {
    return { data: localAboutMe(), source: 'static-fallback', error: err };
  }
  return { data: localAboutMe(), source: 'static' };
}
