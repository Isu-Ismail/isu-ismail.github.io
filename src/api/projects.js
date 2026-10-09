import { fetchDoc, fetchCollection, subscribeDoc } from '../firebase';
import { cacheGet, cacheSet } from './cache';
import { data as staticData } from '../../data.js';
import { getProjectId } from '../utils';

const COLLECTION = 'projects';
const PROJECT_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const LIST_CACHE_KEY = 'projects:list';

function localProjectsList() {
  return (staticData.projects || []).map((p) => ({ id: getProjectId(p), ...p }));
}

let inMemoryProjectsList = null;

export function getCachedProjectsList() {
  if (inMemoryProjectsList && inMemoryProjectsList.length > 0) {
    return inMemoryProjectsList;
  }
  const cached = cacheGet(LIST_CACHE_KEY);
  if (cached && cached.length > 0) {
    inMemoryProjectsList = cached;
    return cached;
  }
  return localProjectsList();
}

/**
 * GET /projects — project grid card data.
 * Cached in memory and sessionStorage for 24h.
 */
export async function listProjects({ force = false } = {}) {
  if (!force) {
    if (inMemoryProjectsList && inMemoryProjectsList.length > 0) {
      return { projects: inMemoryProjectsList, source: 'memory' };
    }
    const cached = cacheGet(LIST_CACHE_KEY);
    if (cached && cached.length > 0) {
      inMemoryProjectsList = cached;
      return { projects: cached, source: 'cache' };
    }
  }

  try {
    const remote = await fetchCollection(COLLECTION);
    if (remote && remote.length > 0) {
      inMemoryProjectsList = remote;
      cacheSet(LIST_CACHE_KEY, remote, PROJECT_TTL_MS);
      return { projects: remote, source: 'firestore' };
    }
  } catch (err) {
    return { projects: inMemoryProjectsList || localProjectsList(), source: 'static-fallback', error: err };
  }
  return { projects: inMemoryProjectsList || localProjectsList(), source: 'static' };
}

export function parseProjectDoc(id, remote) {
  if (!remote) return { project: null, details: null };
  const { title, description, tags, link, detailsLink, status, duration, stars, ...details } = remote;
  return {
    project: { id, title, description, tags, link, detailsLink, status, duration, stars },
    details,
  };
}

const projectMemoryCache = new Map();
const projectSubscribers = new Map();
const projectListeners = new Map();

/**
 * Synchronous lookup for project details from memory or sessionStorage.
 * Lets ProjectDetail render instantly on mount without flashing skeleton.
 */
export function getCachedProjectDetails(id) {
  if (!id) return { project: null, details: null, loading: false, source: 'empty' };

  if (projectMemoryCache.has(id)) {
    const mem = projectMemoryCache.get(id);
    return { ...mem, loading: false, source: 'memory' };
  }

  const cached = cacheGet('project:' + id);
  if (cached) {
    projectMemoryCache.set(id, cached);
    return { ...cached, loading: false, source: 'cache' };
  }

  return { project: null, details: null, loading: true, source: 'pending' };
}

/**
 * Real-time subscription to a project's full details via Firestore onSnapshot.
 * Notifies immediately with cached data, then pushes live updates on change.
 */
export function subscribeToProjectDetails(id, callback) {
  if (!id) return () => {};

  if (!projectSubscribers.has(id)) {
    projectSubscribers.set(id, new Set());
  }
  const subs = projectSubscribers.get(id);
  subs.add(callback);

  // Immediately notify with best available data
  const initial = getCachedProjectDetails(id);
  callback(initial);

  // Start real-time listener if not already active for this project id
  if (!projectListeners.has(id)) {
    const unsub = subscribeDoc(
      COLLECTION,
      id,
      (remote) => {
        if (remote) {
          const parsed = parseProjectDoc(id, remote);
          const payload = { ...parsed, loading: false, source: 'firestore-live', error: null };
          projectMemoryCache.set(id, payload);
          cacheSet('project:' + id, payload, PROJECT_TTL_MS);

          const currentSubs = projectSubscribers.get(id);
          if (currentSubs) {
            for (const sub of currentSubs) {
              try {
                sub(payload);
              } catch (e) {
                console.error(e);
              }
            }
          }
        } else {
          const payload = { project: null, details: null, loading: false, source: 'empty', error: null };
          const currentSubs = projectSubscribers.get(id);
          if (currentSubs) {
            for (const sub of currentSubs) {
              try {
                sub(payload);
              } catch (e) {
                console.error(e);
              }
            }
          }
        }
      },
      (err) => {
        console.warn(`Real-time listener error for project ${id}:`, err);
        const cached = getCachedProjectDetails(id);
        if (!cached.loading) {
          const currentSubs = projectSubscribers.get(id);
          if (currentSubs) {
            for (const sub of currentSubs) {
              try {
                sub(cached);
              } catch (e) {
                console.error(e);
              }
            }
          }
        }
      }
    );

    projectListeners.set(id, unsub);
  }

  return () => {
    const currentSubs = projectSubscribers.get(id);
    if (currentSubs) {
      currentSubs.delete(callback);
    }
  };
}

/**
 * GET /projects/details/{id} — one-off fetch with cache.
 */
export async function getProjectDetails(id) {
  const cached = getCachedProjectDetails(id);
  if (!cached.loading && cached.project) {
    return cached;
  }

  try {
    const remote = await fetchDoc(COLLECTION, id);
    if (remote) {
      const parsed = parseProjectDoc(id, remote);
      const payload = { ...parsed, loading: false, source: 'firestore', error: null };
      projectMemoryCache.set(id, payload);
      cacheSet('project:' + id, payload, PROJECT_TTL_MS);
      return payload;
    }
  } catch (err) {
    return { project: null, details: null, source: 'error', error: err, loading: false };
  }
  return { project: null, details: null, source: 'empty', loading: false };
}

