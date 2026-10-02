// One-off migration: uploads the exact images/certificate files each project
// in src/projectDetailsData.js already references (preserves order) into
// Firebase Storage under projects/{id}/, then merges the resulting public
// URLs into that project's Firestore doc (projects/{id}.images /
// .certificate). Run seed-firestore.mjs first so the docs exist.
//
// Uses the Firebase Admin SDK (see firebase-admin-init.mjs) — needs
// scripts/serviceAccountKey.json.
//
// Usage: node scripts/upload-project-pictures.mjs

import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { db, bucket, publicDownloadUrl } from './firebase-admin-init.mjs';
import { projectDetailsData } from '../src/projectDetailsData.js';

const CONTENT_TYPES = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', gif: 'image/gif' };

function contentTypeFor(filePath) {
  const ext = filePath.split('.').pop().toLowerCase();
  return CONTENT_TYPES[ext] || 'application/octet-stream';
}

// relPath like "./project_pictures/ctskii/1.png" -> repo-root-relative disk path
function toDiskPath(relPath) {
  return fileURLToPath(new URL(`../${relPath.replace(/^\.\//, '')}`, import.meta.url));
}

async function uploadOne(id, relPath) {
  const diskPath = toDiskPath(relPath);
  if (!existsSync(diskPath)) {
    console.warn(`  SKIP (missing on disk): ${relPath}`);
    return null;
  }
  const filename = relPath.split('/').pop();
  const storagePath = `projects/${id}/${filename}`;
  await bucket.upload(diskPath, {
    destination: storagePath,
    metadata: { contentType: contentTypeFor(relPath) },
  });
  console.log(`  uploaded ${relPath} -> ${storagePath}`);
  return publicDownloadUrl(storagePath);
}

for (const [id, details] of Object.entries(projectDetailsData)) {
  console.log(`Project: ${id}`);
  const imageUrls = [];
  for (const relPath of details.images || []) {
    const url = await uploadOne(id, relPath);
    if (url) imageUrls.push(url);
  }

  const update = { images: imageUrls };
  if (details.certificate) {
    const certUrl = await uploadOne(id, details.certificate);
    if (certUrl) update.certificate = certUrl;
  }

  await db.doc(`projects/${id}`).set(update, { merge: true });
  console.log(`  updated projects/${id} (${imageUrls.length} image(s)${update.certificate ? ' + certificate' : ''})`);
}

console.log('Done.');
