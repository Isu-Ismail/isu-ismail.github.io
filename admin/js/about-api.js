import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-storage.js";
import { db, storage } from "./firebase-init.js";

const COLLECTION = "about";
const DOC_ID = "main";

export async function getAboutMe() {
  const snap = await getDoc(doc(db, COLLECTION, DOC_ID));
  return snap.exists() ? snap.data() : null;
}

export async function saveAboutMe(data) {
  await setDoc(doc(db, COLLECTION, DOC_ID), data);
}

// Uploads the resume PDF (or its preview image) to Storage under
// about/resume.* and returns the public download URL — the caller still
// has to Save the form afterward to write that URL into about/main.resume
// / about/main.images.resume_image.
export async function uploadResumeFile(file) {
  const ext = file.name.split('.').pop();
  const path = `about/resume-${Date.now()}.${ext}`;
  const fileRef = ref(storage, path);
  await uploadBytes(fileRef, file, { contentType: file.type || 'application/pdf' });
  return getDownloadURL(fileRef);
}
