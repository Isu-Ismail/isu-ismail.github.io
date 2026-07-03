# 🌐 Middleman: Serverless Sourcing & RFQ Engine

Middleman is an ultra-lightweight, automated, and visually interactive **Request for Quote (RFQ) Sourcing Engine** designed to streamline procurement workflows, eliminate email communication chaos, and slash operational overhead.

By bridging the gap between raw mail streams (Gmail, Outlook) and structured project management, Middleman allows sourcing managers to onboard clients, issue personalized bulk RFQs to suppliers, and visually track every single thread in real-time.

---

## 🎯 What it Solves (The Sourcing Pain Points)

In modern manufacturing, supply chain, and procurement, sourcing parts and materials is heavily dependent on email:
1. **Email Overwhelm & Fragmentation**: Sourcing agents send specifications to dozens of vendors. Tracking who replied, who sent a drawing revision, and who is pending NDA becomes a logistical nightmare scattered across personal inboxes.
2. **High ERP Costs & Friction**: Traditional ERPs and heavy e-sourcing suites (SAP, Oracle) are extremely expensive to license, configure, and maintain. Onboarding external suppliers into these complex portals is met with high friction.
3. **Manual Overhead**: Sourcing agents spend hours copy-pasting specs, manually updating spreadsheets, downloading attachment revisions, and sending duplicate reminder emails.
4. **Data Disconnect**: Sourcing attachments (large PDF drawings, CAD files) get lost or overwrite existing revisions during email updates, breaking history trails.

---

## 💡 How Middleman Solves It (The Architecture & Features)

Middleman solves this by offering a **low-cost, high-automation, and visually interactive hub**:

### 1. 🕸️ Interactive Sourcing Timeline Map
* Built on **React Flow**, the app generates a concentric node graph showing the **Sourcing Hub (RFQ)** at the center, radiating outward to **Clients** and **Suppliers**, with **Email Nodes** arranged chronologically in ascending order from top to bottom.
* Connection spoke handles converge cleanly on node borders, visually highlighting the network flow at a single glance.
* Clicking any node instantly toggles a dedicated sidebar inspector with attachments managers, file download grids, and raw message body contents.

### 2. ⚡ Lightweight, Serverless & Ultra-Low Cost
* Powered by a highly efficient, single-binary **PocketBase** backend, running database operations, auth, and API routes in less than 50MB of RAM.
* Runs custom JS hooks (`pb_hooks`) triggered natively on database events or webhook endpoints, eliminating the need to maintain heavy, costly backend application servers (Node/Go/Python).

### 3. 📥 Automated Mail Sync & Webhooks
* Integrated Google and Microsoft webhook listeners (`gmail_webhook.pb.js`, `outlook_webhook.pb.js`) automatically ingest supplier replies.
* Automatically links incoming messages to active RFQ projects using pattern matches, compiling them directly into the visual timeline so sourcing teams don't have to copy-paste or search their inbox.

### 4. ✉️ Template Designer & Personalized Dispatch
* Built-in template creator supports rich canvas styling (custom fonts, body text sizing, custom headers/footers with uploaded brand logos, signature files, and background canvas images).
* Allows bulk dispatching to multiple target vendors at once with global tag substitutions (e.g. `{{RFQ_CODE}}`, `{{VENDOR_NAME}}`, `{{CLIENT_NAME}}`).

### 5. 📎 Smart File Attachments & URL Resolving
* Supports direct, automatic file uploads.
* Instead of bloating outbox storage or mail servers by inline-encoding text/binary attachments, the engine appends dynamic, clickable public download links at the bottom of the mail body.
* Automatically resolves base paths to the active web hostname (supports **ngrok** tunnels out-of-the-box in development and custom domains in production).

### ⛔ 6. Data Integrity & Archival Safeguards
* **RFQ Deletion Guards**: Deleting an RFQ requires typing exactly `"I WANT TO DELETE IT"`, which triggers a cascade purge deleting the RFQ along with all associated email logs and files.
* **Profile Guards**: Clients or Vendors currently assigned to active RFQ projects cannot be deleted. If attempted, a premium warning popup displays referencing the active RFQ code.
* **Attachment Guards**: Drawings or specification files archived in sent mail outbox logs are protected and cannot be deleted from the RFQ project, preserving reference trails.

---

## 🛠️ Technology Stack

| Layer | Component | Technologies |
| :--- | :--- | :--- |
| **Frontend** | Core framework | React (TypeScript), Vite |
| | Visual Graph | React Flow (custom handles, custom nodes) |
| | State & Queries | Tanstack React Query |
| | Icons | Lucide React |
| **Backend** | Engine & DB | PocketBase (SQLite) |
| | Server Logic | JavaScript VM Hooks (`pb_hooks`) |
| **Tunneling** | Local Dev | ngrok (for real-time Google/MS mail webhooks) |

---

## 📂 Project Structure

```bash
gt-solve/
├── middleman/             # React SPA Front-End (Vite, TypeScript, React Query)
│   ├── src/
│   │   ├── api/           # PocketBase SDK clients, queries & mutations
│   │   ├── pages/
│   │   │   ├── client/    # Client lists & NDA management
│   │   │   ├── email/     # Composing mail, templates & EmailsHub
│   │   │   ├── rfq/       # RFQ lists, timelines, and details inspector
│   │   │   └── template/  # Visual template builder
│   │   └── types/         # Sourcing entity typings
│   ├── package.json
│   └── vite.config.ts
│
├── pocketbase/            # PocketBase DB Backend & Hooks
│   ├── pb_hooks/          # Serverless JavaScript event hooks & REST endpoints
│   │   ├── db_init.pb.js        # Bootstraps default templates & settings
│   │   ├── gmail_webhook.pb.js  # Automated Google Workspace mail parser
│   │   ├── schema.json          # DB collections schema definition
│   │   └── smtp_config.pb.js    # Configures system outbound SMTP mail transport
│   └── docker-compose.yml # Backend containerization
│
└── deploy.py              # Script to build & sync frontend assets to pb_public
```

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18+)
* [pnpm](https://pnpm.io/)
* [PocketBase Binary](https://pocketbase.io/docs/) (placed in `/pocketbase`)

### 1. Running the Backend
1. Go to the `pocketbase` directory.
2. Start PocketBase:
   ```bash
   ./pocketbase serve --http 127.0.0.1:8030
   ```
3. Open the admin dashboard at `http://127.0.0.1:8030/_/` to create your initial superuser.

### 2. Running the Frontend
1. Go to the `middleman` directory.
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the Vite dev server:
   ```bash
   pnpm run dev
   ```
4. Open the web interface at `http://localhost:5173`.

### 3. Deploying Frontend to PocketBase
To compile the frontend and host it directly from PocketBase's static web server (`pb_public`):
1. Run the deploy script from the root:
   ```bash
   python deploy.py
   ```
2. Your compiled app is now available at the base PocketBase URL: `http://127.0.0.1:8030`.

---

## 🌐 Dynamic Host Customization (ngrok / Custom Domains)

Middleman automatically resolves its database asset URLs dynamically. If you expose the app publicly for supplier webhooks or remote viewing:
* Start your tunnel (e.g. `ngrok http 8030`).
* The system checks the browser's current `window.location.origin`. If loaded through `*.ngrok-free.dev` or a custom domain, all header logos, templates, and attachment download links are dynamically updated to use the public domain.
