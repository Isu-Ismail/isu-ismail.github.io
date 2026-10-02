// Tiny TTL cache on top of sessionStorage: survives re-renders/route changes
// within the same tab, but — unlike localStorage — is wiped by the browser
// the moment the tab closes, even if the TTL hasn't expired yet. That's the
// point: avoid re-fetching the same project while browsing, without the
// cached data persisting in any way between visits/tabs/sessions.
const PREFIX = 'fscache:';

export function cacheGet(key) {
  try {
    const raw = sessionStorage.getItem(PREFIX + key);
    if (!raw) return null;
    const { cachedAt, ttlMs, payload } = JSON.parse(raw);
    if (Date.now() - cachedAt > ttlMs) {
      sessionStorage.removeItem(PREFIX + key);
      return null;
    }
    return payload;
  } catch {
    return null; // sessionStorage unavailable (private mode quirks, etc.) — just skip caching
  }
}

export function cacheSet(key, payload, ttlMs) {
  try {
    sessionStorage.setItem(PREFIX + key, JSON.stringify({ cachedAt: Date.now(), ttlMs, payload }));
  } catch {
    // storage full or unavailable — not fatal, just means no caching this time
  }
}
