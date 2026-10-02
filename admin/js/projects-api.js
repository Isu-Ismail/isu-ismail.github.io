import {
  collection, getDocs, doc, getDoc, setDoc, deleteDoc,
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import {
  ref, uploadBytes, getDownloadURL, deleteObject,
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

// Uploads to Storage under projects/{id}/..., returns the public download URL
// to store in the project doc's `images` array or `certificate` field.
export async function uploadProjectImage(projectId, file) {
  const path = `projects/${projectId}/${Date.now()}-${file.name}`;
  const fileRef = ref(storage, path);
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
