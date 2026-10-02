// Shared Firebase Admin SDK bootstrap for the one-off scripts in this folder.
// Admin SDK auth bypasses Firestore/Storage security rules entirely (that's
// the point — these are trusted local scripts run by the project owner, not
// the browser-facing client SDK the site/admin panel use).
//
// Requires a service account key (Firebase Console → Project settings →
// Service accounts → Generate new private key) at the repo root, matching
// whatever is gitignored there (see .gitignore — currently
// portfolio-c1025-firebase-adminsdk-*.json).

import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const keyFilename = readdirSync(repoRoot).find((f) => f.includes('firebase-adminsdk') && f.endsWith('.json'));

let serviceAccount;
try {
  if (!keyFilename) throw new Error('not found');
  serviceAccount = JSON.parse(readFileSync(`${repoRoot}${keyFilename}`, 'utf-8'));
} catch {
  console.error(
    'Missing service account key.\n' +
    'Generate one: Firebase Console -> Project settings -> Service accounts ' +
    '-> Generate new private key, then save the downloaded JSON file at the repo root ' +
    '(and make sure .gitignore covers its filename).'
  );
  process.exit(1);
}

const env = Object.fromEntries(
  readFileSync(new URL('../.env', import.meta.url), 'utf-8')
    .split('\n')
    .filter((line) => line.includes('='))
    .map((line) => line.split('=').map((s) => s.trim()))
);

const app = initializeApp({
  credential: cert(serviceAccount),
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
});

export const db = getFirestore(app);
export const bucket = getStorage(app).bucket();
export const storageBucketName = env.VITE_FIREBASE_STORAGE_BUCKET;

// Mirrors what the client SDK's getDownloadURL() returns — works without a
// download token because storage.rules already grants public read on
// projects/** (see storage.rules), so no token is required to bypass rules.
export function publicDownloadUrl(storagePath) {
  const encoded = encodeURIComponent(storagePath);
  return `https://firebasestorage.googleapis.com/v0/b/${storageBucketName}/o/${encoded}?alt=media`;
}
