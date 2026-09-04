# ⚡ NeoCGPA — Intelligent GPA/CGPA Calculator & Target Planner

**NeoCGPA** is a modern, high-performance, client-side web application designed for students and educators to seamlessly calculate, track, and plan SGPA (Semester Grade Point Average) and CGPA (Cumulative Grade Point Average). Built with **Svelte 5** and styled using a striking **Neo-Brutalist** aesthetic, NeoCGPA offers instant real-time calculations, automated marksheet OCR scanning, vector PDF reporting, custom grade scales, and smart goal planning.

---

## 🌟 Key Features

- ⚡ **Svelte 5 Reactive Engine**: Lightning-fast, instant real-time SGPA and CGPA updates as you type or change grades.
- 📸 **Client-Side Marksheet OCR Scanner**: Powered by `Tesseract.js`. Upload grade card images/transcripts to automatically extract course codes, titles, credits, and grades directly into semester cards with **100% privacy** (no server uploads).
- 🔄 **5-Step History Undo Stack (`Ctrl + Z`)**: Easily undo up to 5 state modifications (row additions/deletions, grade edits, text changes, credit updates).
- 📄 **Vector PDF & Data Export**: Generate clean, professional academic transcript summaries in vector PDF format via `jsPDF` or export/import complete raw JSON workspace backups.
- 🎯 **Target CGPA Planner**: Calculate the exact average SGPA required in remaining semesters to achieve your desired target CGPA.
- ⚙️ **Custom Grading Scale Engine**: Fully configurable grade scales (10.0 scale, 4.0 scale, letter grade to grade point mappings) adaptable to any university grading system.
- ☁️ **Community Template Cloud Manager**: Save custom course curriculums or load pre-built university degree templates synchronized via Firebase Firestore.
- ⌨️ **Spreadsheet-Style Keyboard Navigation**: Quick key navigation (`Ctrl + Arrow Keys`), rapid letter key cycling (pressing `A` toggles `A+` → `A`), `Ctrl + Enter` (insert row below), and `Ctrl + Delete` (delete active row).
- 🎨 **Neo-Brutalist Visual Design**: Bold black borders (`border-4 border-black`), sharp box shadows (`shadow-brutal`), high-contrast HSL color accents, and dedicated mobile/desktop views.

---

## 🧭 Complete Website User Flow & How It Works

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           1. Onboarding & Setup                         │
│  - Select/customize grade points scale (10.0, 4.0, Letter Mappings)     │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      2. Populate Semester Courses                        │
│ ┌──────────────────────┐  ┌───────────────────────┐  ┌────────────────┐ │
│ │  Manual Course Entry │  │ Client-Side OCR Scan  │  │ Cloud Template │ │
│ │  (Spreadsheet Keys)  │  │ (Image Parsing Engine)│  │ (Firestore Sync│ │
│ └──────────────────────┘  └───────────────────────┘  └────────────────┘ │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    3. Real-Time Calculation & Analytics                 │
│  - Instant SGPA per semester card & overall Cumulative CGPA display     │
│  - Interactive stats summary bar (total credits, earned points)         │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     4. Target CGPA Goal Planning                        │
│  - Input desired CGPA goal & future semesters to compute target SGPA    │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         5. Export & Integration                         │
│  - Print/Save Vector PDF Report • Backup JSON Workspace • Cloud Share   │
└─────────────────────────────────────────────────────────────────────────┘
```

### 1. Onboarding & Scale Setup
- Upon entering the application, users are greeted with the **Welcome Modal** providing quick-start options and shortcut hints.
- Clicking **Scale Settings** allows users to customize the grading scale:
  - Max scale value (e.g. 10.0 or 4.0).
  - Letter grade thresholds (A+, A, B+, B, C+, C, D, F) and corresponding numeric grade points.

### 2. Populating Academic Semesters
Users can construct their multi-semester workspace using three flexible methods:
- **Manual Data Entry**:
  - Click **"+ Add Semester"** (top header or bottom card button).
  - Type Course Code, Title, Credits, and select Grade.
  - Use spreadsheet keyboard shortcuts (`Ctrl + Arrow Keys` to jump between cells, `Ctrl + Enter` to insert a row below, `Ctrl + Delete` to delete a row).
  - Quick Grade Selection: Pressing key `A` once selects `A+`, pressing `A` again switches to `A`.
- **Automatic OCR Marksheet Scanning**:
  - Click **"Scan Marksheet Image"** on any semester card or main navigation.
  - Drag & drop or choose a marksheet image (PNG, JPG, WebP).
  - **Tesseract.js** pre-processes the image in-browser (grayscale thresholding, noise removal) and parses course codes (e.g. `CS23904`, `UC23LXX`), multi-line titles, credit values, and letter grades.
  - Automatically populates or creates a semester card with extracted courses.
- **Cloud Template Loading**:
  - Open **Template Manager** to load pre-configured university curriculum templates (e.g. B.Tech Computer Science 8-Semester syllabus).
  - Save custom semester structures to Firebase Firestore to share with peers.

### 3. Real-Time Calculation Engine
- As courses, credits, or grades are modified, the **`gpaCalculator.js`** engine instantly recalculates:
  $$\text{Semester SGPA} = \frac{\sum (\text{Credits}_i \times \text{GradePoints}_i)}{\sum \text{Credits}_i}$$
  $$\text{Cumulative CGPA} = \frac{\sum_{\text{all sem}} (\text{Credits}_j \times \text{GradePoints}_j)}{\sum_{\text{all sem}} \text{Credits}_j}$$
- Results are displayed across the **QuickStats Header**, individual **Semester Cards**, and **Semester Summaries**.

### 4. Target CGPA Planning
- Click **"Target CGPA"** in the top action bar.
- Enter your target CGPA goal (e.g., `8.50`) and the number of future remaining semesters.
- The system evaluates completed credits vs. remaining credits and outputs the exact average SGPA required across future semesters to hit your goal.

### 5. Exporting & Undo History
- **Undo System (`Ctrl + Z`)**: Revert up to 5 previous edits across the entire application state.
- **PDF Export**: Generate a high-resolution vector PDF grade report containing all semester tables, total credits, SGPA/CGPA stats, and custom header notes via `jsPDF`.
- **JSON Backup**: Download a local `.json` file backup of your entire workspace or upload an existing backup file anytime.

---

## 🏗️ Technical Architecture & Project Structure

The project is structured around modular Svelte 5 components, reactive state management, and lightweight utility libraries.

```
cgpa/
├── public/                     # Static assets & icons
├── src/
│   ├── assets/                 # App icons & branding resources
│   ├── components/             # UI Components
│   │   ├── Header.svelte             # Top navigation & mobile horizontal tab bar
│   │   ├── Logo.svelte               # Neo-Brutalist branded logo
│   │   ├── QuickStats.svelte         # Overall CGPA, total credits, & summary badges
│   │   ├── SemesterCard.svelte       # Semester container, course table, & card actions
│   │   ├── CourseRow.svelte          # Editable course row with keyboard handlers
│   │   ├── SemesterSummary.svelte    # Semester breakdown stats & credit distribution
│   │   ├── ImageUploadModal.svelte   # Client-side Tesseract.js OCR engine modal
│   │   ├── ScaleSettingsModal.svelte # Custom grade points & scale editor modal
│   │   ├── TargetGpaModal.svelte     # Target CGPA goal calculation modal
│   │   ├── TemplateManagerModal.svelte# Cloud curriculum template manager modal
│   │   ├── ExportModal.svelte        # PDF generator & JSON backup modal
│   │   ├── ConfirmModal.svelte       # Reusable confirmation dialog
│   │   └── WelcomeModal.svelte       # Initial onboarding modal
│   ├── store/                  # Application State
│   │   ├── gpaStore.js               # Reactive workspace store & 5-step undo stack
│   │   └── templateStore.js          # Firestore template cloud integration store
│   ├── utils/                  # Core Utilities & Logic
│   │   ├── gpaCalculator.js          # Math logic for SGPA/CGPA computations
│   │   ├── ocrExtractor.js           # Image preprocessing & Tesseract text parser
│   │   ├── pdfGenerator.js           # jsPDF document layout renderer
│   │   ├── keyboardNav.js            # Global & row keyboard event handler
│   │   └── firebaseService.js        # Firebase Firestore connection helper
│   ├── app.css                 # Neo-Brutalist CSS design system & Tailwind utilities
│   ├── App.svelte              # Root component & modal router
│   └── main.js                 # App entry point
├── package.json
├── svelte.config.js
└── vite.config.js
```

---

## 🎨 Design Philosophy & Aesthetics

NeoCGPA follows a **Neo-Brutalist** design language:
- **Bold Linework**: Solid `3px` and `4px` pure black borders (`border-black`) around containers, cards, and inputs.
- **Hard Offset Shadows**: Distinct hard shadows (`box-shadow: 4px 4px 0px #000`) without Gaussian blur.
- **High-Contrast Palette**: Vibrant HSL background colors (Neo-Yellow `#FACC15`, Soft Cyan `#A5F3FC`, Mint Green `#86EFAC`, Hot Pink `#F472B6`, Lavender `#C084FC`).
- **Typography**: Clean, high-legibility modern sans-serif typography (`Inter` / system font stack) with uppercase headings and high tracking.
- **Micro-Interactions**: Tactile button push animations (`active:translate-x-[2px] active:translate-y-[2px] active:shadow-none`).

---

## ⌨️ Keyboard Shortcuts Reference

| Shortcut | Context | Action |
| :--- | :--- | :--- |
| `Ctrl` + `Z` | Global | Undo last action (up to 5 history steps) |
| `Ctrl` + `Arrow Keys` | Course Cell | Navigate up/down/left/right between table cells |
| `Ctrl` + `Enter` | Course Cell | Insert a new course row directly below |
| `Ctrl` + `Delete` | Course Cell | Delete the currently selected course row |
| `A` / `B` / `C` / `D` | Grade Selector | Rapid grade toggling (e.g. press `A` → `A+`, press `A` again → `A`) |

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **Package Manager**: `pnpm` (recommended) or `npm`

### Installation & Running Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/gpa_calc.git
   cd gpa_calc/cgpa
   ```

2. Install dependencies:
   ```bash
   pnpm install
   # or
   npm install
   ```

3. Start the Vite development server:
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

### Production Build

To build the application for production:
```bash
pnpm build
```
The optimized static output will be generated in the `dist/` directory.

---

## 🔒 Privacy & Security

NeoCGPA processes **all user data locally in your web browser**:
- **Zero Image Uploads**: Marksheet OCR processing occurs 100% inside your browser via Tesseract WebAssembly.
- **Local Storage Persistence**: Workspace data is saved locally in `localStorage`.
- **No Analytics / Tracking**: Your grades, course titles, and academic records remain entirely private on your device.

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
