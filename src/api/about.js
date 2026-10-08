import { fetchDoc } from '../firebase';
import { cacheGet, cacheSet } from './cache';
import { data as staticData } from '../../data.js';

const CACHE_KEY = 'about:main';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes, per-tab (sessionStorage — see api/cache.js)

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
 * experience, skills, interests, certificates, stats, resume + images.
 * One document, one round-trip: Firestore's client SDK can't project
 * individual fields of a doc, so fetching "one field at a time" would mean
 * one full request per field — strictly slower, not faster. Cached in
 * sessionStorage for 5 minutes; a cache hit short-circuits this entirely
 * (see useAboutMe's lazy init) so most mounts never hit the network at all.
 */
export async function getAboutMe() {
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
