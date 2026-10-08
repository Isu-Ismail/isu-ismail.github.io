import { fetchDoc } from '../firebase';
import { cacheGet, cacheSet } from './cache';

const CACHE_KEY = 'about:main';
const CACHE_TTL_MS = 30 * 1000; // 30 seconds

// No hardcoded personal content here — if Firestore is unreachable there is
// genuinely nothing to show but an empty/safe shape, so the rest of the app
// doesn't crash destructuring `data.contact.email` etc. All real content
// lives in Firestore `about/main` now, managed by an external admin panel.
export function emptyAboutMe() {
  return {
    name: '',
    role: '',
    resume: '',
    images: { profile: '', hero: '', resume_image: '' },
    contact: { email: '', phone: '', location: '', github: '', linkedin: '', instagram: '' },
    about: '',
    hero_about: '',
    education: [],
    experience: [],
    skills: [],
    interests: [],
    certificates: [],
    stats: [],
    gamePath: [],
  };
}

// Synchronous cache-only lookup for a lazy useState initializer — lets the
// very first render show cached Firestore data instantly, no flash.
export function getCachedAboutMe() {
  return cacheGet(CACHE_KEY);
}

/**
 * GET about/main — name, role, bio, hero tagline, contact, education,
 * experience, skills, interests, certificates, stats, resume + images.
 * Cached in sessionStorage for 30s. Set force: true to bypass the cache.
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
    return { data: emptyAboutMe(), source: 'error', error: err };
  }
  return { data: emptyAboutMe(), source: 'empty' };
}
