import { fetchDoc, fetchCollection } from '../firebase';

const COLLECTION = 'projects';

/**
 * GET /projects — project grid card data (title, tags, link, status,
 * duration, stars...). Each returned project carries its stable `id`, used
 * both as the /projects/:id route param and the Firestore doc id.
 *
 * No local fallback, no caching — projects are managed via an external admin
 * panel and edits should show up on the next load, not up to 30 minutes
 * later or from a bundled snapshot.
 */
export async function listProjects() {
  try {
    const remote = await fetchCollection(COLLECTION);
    return { projects: remote, source: 'firestore' };
  } catch (err) {
    return { projects: [], source: 'error', error: err };
  }
}

/**
 * GET /projects/details/{id} — one project's full case-study content: card
 * fields (title, tags, link, status, duration, stars) plus detail fields
 * (subtitle, metrics, images, narratives, architectureNodes, techSpecs,
 * certificate). Firestore stores both merged in one `projects/{id}` doc;
 * this splits them back into { project, details } to match the shape
 * `ProjectDetail.jsx` expects. No local fallback, no caching.
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
