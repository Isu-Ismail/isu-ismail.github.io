import {
  collection, getDocs, doc, getDoc, setDoc, deleteDoc,
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import {
  ref, uploadBytes, getBlob, getDownloadURL, deleteObject,
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-storage.js";
import { db, storage } from "./firebase-init.js";

const COLLECTION = "projects";

export async function listProjects() {
  const snap = await getDocs(collection(db, COLLECTION));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getProject(id) {
  const snap = await getDoc(doc(db, COLLECTION, id));
  return snap.exists() ? { id, ...snap.data() } : null;
}

// `id` is the Firestore doc id AND the /projects/:id route the public site
// uses — keep it URL-safe (lowercase, hyphenated) and stable once published.
export async function saveProject(id, data) {
  await setDoc(doc(db, COLLECTION, id), data);
}

export async function deleteProject(id) {
  await deleteDoc(doc(db, COLLECTION, id));
}

// Uploads to Storage under projects/{id}/{position}.{ext} (1-indexed, matching
// the same `1.png`, `2.png`... convention project_pictures/ and the seed
// script already use) — `position` is the slot this image will occupy
// (normally `images.length` at upload time, i.e. appended at the end).
export async function uploadProjectImage(projectId, file, position) {
  const ext = file.name.split('.').pop();
  const path = `projects/${projectId}/${position}.${ext}`;
  const fileRef = ref(storage, path);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
}

// Certificate gets a fixed name (not part of the numbered sequence) —
// matches the `certificate.jpg`/`certificate.png` convention the original
// project_pictures/ migration used.
export async function uploadCertificateImage(projectId, file) {
  const ext = file.name.split('.').pop();
  const fileRef = ref(storage, `projects/${projectId}/certificate.${ext}`);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
}

// Best-effort delete of a previously uploaded image given its download URL
// (only works for files actually stored under this project's Storage path).
export async function deleteProjectImage(downloadUrl) {
  try {
    await deleteObject(ref(storage, downloadUrl));
  } catch {
    // URL wasn't a Storage ref (e.g. an external link) — nothing to delete.
  }
}

// After a delete (or a drag-reorder that swaps which URL sits at which
// array index), Storage filenames can drift out of sync with position
// (e.g. removing "1.png" leaves "2.png" sitting at position 0, or swapping
// two images means each wants the OTHER's current name). Renames every
// image whose Storage filename doesn't match its 1-indexed position, and
// returns the array of (possibly new) URLs. Skips anything not actually a
// Storage URL (e.g. a manually pasted link).
//
// Two-phase (temp name, then final name) rather than a direct rename:
// renaming index 0 straight to "2.png" while index 1 (currently "2.png",
// not yet processed) still occupies that name would silently overwrite
// index 1's file before its own bytes could be migrated — corrupting it.
// Going through a unique temp name first makes the order of processing
// irrelevant, at the cost of an extra upload/download per renamed file
// (fine for an admin tool used occasionally on a handful of images).
export async function renumberProjectImages(projectId, images) {
  const pending = []; // { i, blob, ext }

  for (let i = 0; i < images.length; i++) {
    const url = images[i];
    let oldRef;
    try {
      oldRef = ref(storage, url);
    } catch {
      continue; // not a Storage URL — leave it alone, it stays in `images` untouched
    }

    const ext = oldRef.name.split('.').pop();
    if (oldRef.name === `${i + 1}.${ext}`) continue; // already correctly named

    const blob = await getBlob(oldRef);
    const tempRef = ref(storage, `projects/${projectId}/__tmp_${i}_${Date.now()}.${ext}`);
    await uploadBytes(tempRef, blob);
    await deleteObject(oldRef);
    pending.push({ i, tempRef, ext });
  }

  const result = [...images];
  for (const { i, tempRef, ext } of pending) {
    const blob = await getBlob(tempRef);
    const finalRef = ref(storage, `projects/${projectId}/${i + 1}.${ext}`);
    await uploadBytes(finalRef, blob);
    await deleteObject(tempRef);
    result[i] = await getDownloadURL(finalRef);
  }

  return result;
}
