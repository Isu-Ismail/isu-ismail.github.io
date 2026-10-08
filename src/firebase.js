const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyD_hseKbtTHsPsza5bnwGF6BZDUp-N49EQ',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'portfolio-c1025.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'portfolio-c1025',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'portfolio-c1025.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '553904145158',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:553904145158:web:e83560ca6a789221481487',
};

export const firebaseEnabled = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

// Firestore's default transport is a long-lived WebChannel connection that
// some ad blockers / tracking-protection lists (it resembles a tracking
// pixel URL) block outright — the SDK then retries internally for a long
// time rather than failing fast. Bound every read so a blocked/slow network
// degrades to the static fallback quickly instead of hanging the page.
const FETCH_TIMEOUT_MS = 5000;
function withTimeout(promise, ms = FETCH_TIMEOUT_MS) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Firestore request timed out')), ms)),
  ]);
}

let firestoreReady = null;

// Lazy-loads only the modular functions actually used (initializeApp, getApps,
// getFirestore, doc, getDoc, collection, getDocs) via dynamic import(), so
// tree-shaking + code-splitting keep this out of the main bundle entirely when
// Firestore isn't configured, and pull in only those functions (not the full
// SDK, and not unused services like auth/storage) when it is.
function getFirestoreModule() {
  if (!firestoreReady) {
    firestoreReady = Promise.all([
      import('firebase/app'),
      import('firebase/firestore'),
    ]).then(([{ initializeApp, getApps }, firestoreMod]) => {
      const app = getApps()[0] ?? initializeApp(firebaseConfig);
      const db = firestoreMod.getFirestore(app);
      return { db, ...firestoreMod };
    });
  }
  return firestoreReady;
}

// Reads a single document. Returns null if Firestore is disabled or the doc
// doesn't exist.
export async function fetchDoc(collectionName, docId) {
  if (!firebaseEnabled) return null;
  return withTimeout((async () => {
    const { db, doc, getDoc } = await getFirestoreModule();
    const snap = await getDoc(doc(db, collectionName, docId));
    return snap.exists() ? snap.data() : null;
  })());
}

// Reads every document in a collection as [{ id, ...data }]. Returns [] if
// Firestore is disabled or the collection is empty.
export async function fetchCollection(collectionName) {
  if (!firebaseEnabled) return [];
  return withTimeout((async () => {
    const { db, collection, getDocs } = await getFirestoreModule();
    const snap = await getDocs(collection(db, collectionName));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  })());
}
