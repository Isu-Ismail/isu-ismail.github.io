import { fetchDoc, fetchCollection } from '../firebase';
import { data as staticData } from '../../data.js';
import { projectDetailsData } from '../projectDetailsData.js';
import { getProjectId } from '../utils';

const COLLECTION = 'projects';

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
 *
 * No caching — projects are managed via an external admin panel and edits
 * should show up on the next load, not up to 30 minutes later. (This used
 * to cache for 30 minutes; dropped after a newly-added project didn't show
 * up because of it — same reasoning as about/resume never caching.)
 */
export async function listProjects() {
  try {
    const remote = await fetchCollection(COLLECTION);
    if (remote.length > 0) return { projects: remote, source: 'firestore' };
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
 * No caching — see listProjects() above for why.
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
    return { ...localProjectDetails(id), source: 'static-fallback', error: err };
  }
  return { ...localProjectDetails(id), source: 'static' };
}
