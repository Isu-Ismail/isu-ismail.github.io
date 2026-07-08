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
