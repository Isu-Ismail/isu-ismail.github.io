export const resolveAssetPath = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  
  // Strip leading dot-slash or leading slash
  let cleanPath = path;
  if (cleanPath.startsWith('./')) {
    cleanPath = cleanPath.slice(2);
  }
  if (cleanPath.startsWith('/')) {
    cleanPath = cleanPath.slice(1);
  }
  
  // If Vite's base is relative (like './'), default to root '/' to ensure absolute paths
  let base = import.meta.env.BASE_URL || '/';
  if (base === './' || base === '.') {
    base = '/';
  }
  
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  return `${cleanBase}${cleanPath}`;
};

export const slugifyTitle = (title) =>
  title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// Derives the stable id used as both the /projects/:id route param and the
// Firestore projects/{id} document id. Projects with a detailsLink keep their
// existing alias (e.g. "./project_details/ctskii.html" -> "ctskii") so
// existing URLs and the seeded Firestore doc ids line up; projects without
// one (no case-study page) fall back to a slug of the title.
export const getProjectId = (project) => {
  if (project.detailsLink) {
    return project.detailsLink.split('/').pop().replace('.html', '');
  }
  return slugifyTitle(project.title);
};
