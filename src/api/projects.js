import { fetchDoc, fetchCollection } from '../firebase';
import { data as staticData } from '../../data.js';
import { getProjectId } from '../utils';

const COLLECTION = 'projects';

function localProjectsList() {
  return (staticData.projects || []).map((p) => ({ id: getProjectId(p), ...p }));
}

/**
 * GET /projects — project grid card data (title, tags, link, status,
 * duration, stars...). Each returned project carries its stable `id`, used
 * both as the /projects/:id route param and the Firestore doc id.
 * Falls back to bundled data.js if Firestore is loading or unreachable.
 */
export async function listProjects() {
  try {
    const remote = await fetchCollection(COLLECTION);
    if (remote && remote.length > 0) {
      return { projects: remote, source: 'firestore' };
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
 * `ProjectDetail.jsx` expects. Falls back to bundled local details if
 * Firestore is unreachable or loading.
 */
export async function getProjectDetails(id) {
  try {
    const remote = await fetchDoc(COLLECTION, id);
    if (remote) {
      const { title, description, tags, link, detailsLink, status, duration, stars, ...details } = remote;
      return {
        project: { id, title, description, tags, link, detailsLink, status, duration, stars },
        details,
        source: 'firestore',
      };
    }
  } catch (err) {
    return { project: null, details: null, source: 'error', error: err };
  }
  return { project: null, details: null, source: 'empty' };
}
