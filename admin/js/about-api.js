import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { db } from "./firebase-init.js";

const COLLECTION = "about";
const DOC_ID = "main";

export async function getAboutMe() {
  const snap = await getDoc(doc(db, COLLECTION, DOC_ID));
  return snap.exists() ? snap.data() : null;
}

export async function saveAboutMe(data) {
  await setDoc(doc(db, COLLECTION, DOC_ID), data);
}
