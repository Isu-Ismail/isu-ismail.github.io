import { fetchDoc, fetchCollection } from '../firebase';
import { data as staticData } from '../../data.js';
import { projectDetailsData } from '../projectDetailsData.js';
import { getProjectId } from '../utils';
import { cacheGet, cacheSet } from './cache';

const COLLECTION = 'projects';
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes, cleared early if the tab closes
const LIST_CACHE_KEY = 'projects:list';

// Synchronous cache-only lookups — let callers (useProjects'/
// useProjectDetails' lazy initial state) check for a fresh cache hit before
// the first paint, so cached data never flashes a loading skeleton.
export function getCachedProjects() {
  const cached = cacheGet(LIST_CACHE_KEY);
  return cached ? { ...cached, source: 'cache' } : null;
}

export function getCachedProjectDetails(id) {
  const cached = cacheGet(`project:${id}`);
  return cached ? { ...cached, source: 'cache' } : null;
}

function localProjectsList() {
  return staticData.projects.map((p) => ({ id: getProjectId(p), ...p }));
}

function localProjectDetails(id) {
  const project = staticData.projects.find((p) => getProjectId(p) === id);
  const details = projectDetailsData[id];
  if (!project || !details) return { project: null, details: null };
  return { project: { id, ...project }, details };
}

/**
 * GET /projects — the project grid card data (title, tags, link, status,
 * duration, stars...). Each returned project carries its stable `id`, used
 * both as the /projects/:id route param and the Firestore doc id. Falls back
 * to the bundled data.js when Firestore is disabled, empty, or unreachable.
 * Successful Firestore reads are cached in sessionStorage for 30 minutes
 * (see api/cache.js) — a static/fallback result is never cached.
 */
export async function listProjects() {
  const cached = getCachedProjects();
  if (cached) return cached;

  try {
    const remote = await fetchCollection(COLLECTION);
    if (remote.length > 0) {
      const result = { projects: remote, source: 'firestore' };
      cacheSet(LIST_CACHE_KEY, result, CACHE_TTL_MS);
      return result;
    }
  } catch (err) {
    return { projects: localProjectsList(), source: 'static-fallback', error: err };
  }
  return { projects: localProjectsList(), source: 'static' };
}

/**
 * GET /projects/details/{id} — one project's full case-study content: card
 * fields (title, tags, link, status, duration, stars) plus detail fields
 * (subtitle, metrics, images, narratives, architectureNodes, techSpecs,
 * certificate). Firestore stores both merged in one `projects/{id}` doc;
 * this splits them back into { project, details } to match the shape
 * `ProjectDetail.jsx` expects. Falls back to data.js + projectDetailsData.js.
 *
 * Successful Firestore reads are cached per-id in sessionStorage for 30
 * minutes (see api/cache.js) — a static/fallback result is never cached, so
 * a transient Firestore hiccup can't get "stuck" for the full TTL.
 */
export async function getProjectDetails(id) {
  const cached = getCachedProjectDetails(id);
  if (cached) return cached;

  try {
    const remote = await fetchDoc(COLLECTION, id);
    if (remote) {
      const { title, description, tags, link, detailsLink, status, duration, stars, ...details } = remote;
      const result = {
        project: { id, title, description, tags, link, detailsLink, status, duration, stars },
        details,
        source: 'firestore',
      };
      cacheSet(`project:${id}`, result, CACHE_TTL_MS);
      return result;
    }
  } catch (err) {
    return { ...localProjectDetails(id), source: 'static-fallback', error: err };
  }
  return { ...localProjectDetails(id), source: 'static' };
}
