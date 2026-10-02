// One-off script: pushes the local data.js + projectDetailsData.js content
// into Firestore, matching the schema src/api/about.js and src/api/projects.js
// read from:
//   - about/main            — everything in data.js except `projects`
//   - projects/{id}          — one doc per project, card fields (title, tags,
//                              link, status, duration, stars...) merged with
//                              that project's case-study fields (subtitle,
//                              metrics, images, narratives, techSpecs...)
//
// Uses the Firebase Admin SDK (see firebase-admin-init.mjs) — needs
// scripts/serviceAccountKey.json.
//
// Usage: node scripts/seed-firestore.mjs

import { db } from './firebase-admin-init.mjs';
import { data } from '../data.js';
import { projectDetailsData } from '../src/projectDetailsData.js';
import { getProjectId } from '../src/utils.js';

const { projects, ...aboutMe } = data;
await db.doc('about/main').set(aboutMe);
console.log('Seeded about/main.');

for (const project of projects) {
  const id = getProjectId(project);
  const details = projectDetailsData[id] || {};
  await db.doc(`projects/${id}`).set({ ...project, ...details });
  console.log(`Seeded projects/${id}.`);
}

console.log('Done.');
