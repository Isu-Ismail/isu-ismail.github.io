import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { auth } from "./firebase-init.js";

// Firebase Auth is the access gate — create exactly one user for yourself in
// Firebase Console → Authentication → Users (Email/Password provider) and
// sign in with it here. Firestore security rules should also require
// `request.auth != null` for writes to `about` and `projects`, so this page
// gating isn't the only thing standing between the internet and your data.
export function requireAuth(onReady) {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      if (!location.pathname.endsWith("login.html")) {
        location.href = "login.html";
      }
      return;
    }
    onReady(user);
  });
}

export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function logout() {
  await signOut(auth);
  location.href = "login.html";
}
