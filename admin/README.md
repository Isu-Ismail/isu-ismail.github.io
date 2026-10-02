# Admin Panel (local-only)

Plain static HTML/JS pages that write directly to Firestore and Firebase
Storage from the browser. Not part of the Vite build, not deployed — run it
locally whenever you want to edit live content.

## One-time setup

1. Create a Firebase project (if you haven't) and enable:
   - **Firestore** (production mode)
   - **Storage**
   - **Authentication** → Email/Password provider → add exactly one user
     (yourself) under Authentication → Users.
2. Copy `js/firebase-config.example.js` to `js/firebase-config.js` and fill in
   the values from Firebase Console → Project settings → General → Your apps
   → Web app. These are the **same values** as the main site's `.env`
   (`VITE_FIREBASE_*`), just in object form.
3. Deploy the security rules (repo root `firestore.rules` / `storage.rules` —
   public read, write requires `request.auth != null`):
   ```
   npx firebase-tools login
   npx firebase-tools deploy --only firestore:rules
   npx firebase-tools deploy --only storage
   ```
   (needs `firebase.json` at repo root, already present. Run these as two
   separate commands — `--only storage:rules` as a combined flag errors with
   "Could not find rules for the following storage targets: rules"; plain
   `storage` works.)
4. For the one-off scripts in `scripts/` (seeding, image migration): generate
   a service account key — Firebase Console → Project settings → Service
   accounts → **Generate new private key** — save it as
   `scripts/serviceAccountKey.json` (gitignored). These scripts use the
   Firebase Admin SDK, which bypasses the rules above (trusted local script,
   not the browser-facing client SDK).
5. Seed the database from the existing `data.js` + `projectDetailsData.js`
   content, then migrate `project_pictures/` into Storage:
   ```
   node scripts/seed-firestore.mjs
   node scripts/upload-project-pictures.mjs
   ```
   (run both from the repo root — they read `.env`, not
   `admin/js/firebase-config.js`)

## Running it

```
python admin/serve.py
```

Open `http://127.0.0.1:8787/login.html`, sign in with the user you created in
step 1, then use:

- **About Me** — bio, contact info, education, experience, skills,
  certificates (array fields are edited as raw JSON — keep the existing
  shape).
- **Projects** — add/edit/delete project cards and case-study pages,
  including uploading screenshots and a certificate image to Storage.

## Going live with Firestore on the public site

Fill in the repo root's `.env` (copy from `.env.example`) with the same
Firebase values, then `pnpm build` / `pnpm dev` — `src/firebase.js` picks up
`VITE_FIREBASE_*` automatically and the site starts reading from Firestore
instead of the bundled `data.js`. Until `.env` is filled in, the public site
keeps reading the static `data.js` + `src/projectDetailsData.js` regardless
of what's in Firestore.

## Notes

- This is a local admin tool with no deploy step and no server-side
  authorization beyond Firebase Auth + your Firestore/Storage rules — don't
  expose `serve.py` to anything but `localhost`.
- The project `id` field doubles as both the Firestore doc id and the public
  `/projects/:id` URL — it's locked after first save to avoid silently
  breaking a published link. Delete and recreate under a new id if you really
  need to rename one.
