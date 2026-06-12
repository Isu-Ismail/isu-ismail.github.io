export const projectDetailsData = {
  "sriautoamtion": {
    subtitle: "A highly modular 3-layer overhead crane telemetry and real-time control system retrofitted with zero disruption to old physical controls.",
    images: Array.from({ length: 9 }, (_, i) => `./project_pictures/sriautoamtion/${i + 1}.jpeg`),
    metrics: [
      { value: "3 Layers", label: "Decoupled Architecture" },
      { value: "₹5,000", label: "Development Budget" },
      { value: "2x Nodes", label: "ESP32s Per Crane Redundancy" },
      { value: "10 Sensors", label: "Proximity Limit Sensors" }
    ],
    techSpecs: [
      { label: "MCU Module", value: "ESP32-S3-ETH (Ethernet)" },
      { label: "Broker Admin Panel", value: "Mosquitto Go-Auth Dashboard" },
      { label: "Message Protocol", value: "MQTT (TLS Secured)" },
      { label: "Automation VM", value: "Ubuntu Server (VMware)" },
      { label: "Sensors", value: "10x Proximity Limit Inductives" },
      { label: "Wiring Connectors", value: "Push-in Spring Terminals" }
    ],
    architectureTitle: "3-Layer Control Flow",
    architectureNodes: [
      { title: "1. Software Control", desc: "Python (VM) & React Dashboard", icon: "terminal" },
      { title: "2. MQTT Broker", desc: "Mosquitto (VM) + Custom ACLs", icon: "message-square" },
      { title: "3. Hardware (Ethernet)", desc: "Dual ESP32-S3-ETH + non-blocking code", icon: "cpu" },
      { title: "Fail-Safe Override", desc: "Manual Auto Bypass / 10 Sensors", icon: "shuffle" }
    ],
    narratives: [
      {
        heading: "Industrial Context & Scope",
        paragraphs: [
          "Sri Energy develops high-pressure petroleum extraction pipeline valves - a genuine, heavy-duty industrial facility. Automating an overhead crane in this environment means complying with strict safety requirements and absolute reliability. This project was not a school experiment, but a fully operational telemetry system built to manage and automate heavy cargo movement safely.",
          "A major design challenge was that we could not make any destructive modifications to the crane’s existing physical controller. The automation was retrofitted seamlessly on top of the manual controls, functioning as an additive layer so that plant operators could override it and use manual operations as an absolute hardware fail-safe."
        ]
      },
      {
        heading: "The 3-Layer Modular Architecture",
        paragraphs: [
          "To ensure high system flexibility, maintainability, and ease of expansion, I architected the automation in three decoupled, distinct layers:"
        ],
        bullets: [
          "Software Control Layer: Written completely in modular Python script blocks running on a local Virtual Machine (VM) provided by the company. Parameter configurations and high-level automation schedules are handled here. High-level commands can be published without ever touching or re-flashing the microcontrollers.",
          "MQTT Communication Layer: Telemetry messages and control commands are structured inside custom-designed topic formats so the user interface can listen to and parse them instantly. I deployed a self-hosted Mosquitto broker directly on the company VM, using an admin panel to manage client credentials, topics, and Access Control Lists (ACLs) for strict security isolation.",
          "Hardware Execution Layer: Powered by dual ESP32 microcontrollers per crane, separating workloads so each node does independent, specialized tasks. The motors are controlled by stateless drivers - they execute exactly what they are told, operating with non-blocking timer loops (avoiding delay() stalls entirely) so they can execute emergency halts instantly."
        ],
        paragraphsAfter: [
          "For simple maintenance and quick swapping of hardware nodes, I designed the electrical layout using push-in terminal connectors. I also configured the physical wiring and power distribution for 10 proximity sensors that detect cargo bounds."
        ]
      },
      {
        heading: "Resolving the Latency Challenge: Replacing Wi-Fi",
        paragraphs: [
          "Initially, I deployed a budget-friendly setup using standard ESP32 development boards communicating over the factory Wi-Fi with MQTT TLS encryption.",
          "However, we encountered a serious industrial problem: Wi-Fi signal delay. Intermittent wireless latencies meant that 'stop' messages were received fractions of a second late, causing the heavy overhead motor to overshoot its position and stop at the wrong locations, which posed a severe safety hazard.",
          "To eliminate wireless variables entirely, I replaced the budget Wi-Fi modules with wired ESP32-S3-ETH development boards equipped with dedicated ethernet ports. Connecting the crane nodes directly to the wired factory network bypassed Wi-Fi instability, providing absolute, real-time command execution and eliminating the overshooting delay completely."
        ]
      }
    ]
  },
  "ctskii": {
    subtitle: "A high-availability GPU container orchestration cluster provisioning custom development environments for Madras Institute of Technology.",
    images: Array.from({ length: 8 }, (_, i) => `./project_pictures/ctskii/${i + 1}.png`),
    certificate: "./project_pictures/ctskii/certificate.jpg",
    metrics: [
      { value: "10 Nodes", label: "GPU Computers Connected" },
      { value: "247+ Slots", label: "Total Slots Booked" },
      { value: "24/7/90+", label: "Uptime Without Errors" },
      { value: "16 active", label: "Concurrent Research Users" }
    ],
    techSpecs: [
      { label: "Orchestrator", value: "Docker Swarm" },
      { label: "Volume Driver", value: "GlusterFS (Replicated)" },
      { label: "Scheduler API", value: "FastAPI (Python)" },
      { label: "Proxy Server", value: "XAMPP Apache Proxy" },
      { label: "SSL Provider", value: "Certbot (Let's Encrypt)" },
      { label: "Mailing System", value: "SMTP Broadcast Client" }
    ],
    architectureTitle: "System Architecture Flow",
    architectureNodes: [
      { title: "Public Web Gate", desc: "XAMPP Proxy + Let's Encrypt", icon: "globe" },
      { title: "FastAPI & Admin Gateway", desc: "Admin Approval & Broadcast Server", icon: "calendar-check" },
      { title: "Docker Container Pool", desc: "Custom Container Startup Script", icon: "cpu" },
      { title: "GlusterFS Storage", desc: "10-Node Distributed Storage", icon: "hard-drive" },
      { title: "Portainer & Prometheus", desc: "Real-time health, uptime & logs", icon: "bar-chart-2" }
    ],
    narratives: [
      {
        heading: "System Conception & Orchestration",
        paragraphs: [
          "In our college lab, we had 10 powerful computers, each equipped with dedicated GPUs. However, they were sitting isolated as standard desktop rigs. I realized we could maximize our resources by pooling them into a unified private GPU cloud cluster for students. I designed and deployed this system almost single-handedly, writing the architecture, routing, and deployment configurations from scratch.",
          "I networked all 10 computer nodes inside a local network with static IP addresses. To ensure that students could create sessions, execute tasks, and save their training outputs on any machine without worrying about which physical host they were connected to, I established a GlusterFS distributed storage pool. The shared filesystem replicates data transparently across nodes, guaranteeing zero data loss if a single node falls offline."
        ]
      },
      {
        heading: "Overcoming Limited Resources with Custom Booking",
        paragraphs: [
          "Because GPU capabilities were limited and we had to prevent multiple resource-heavy ML models from fighting over the same GPU, I realized a slot-based scheduler was vital. I engineered a booking platform using FastAPI middleware.",
          "To guarantee high system reliability, security, and authorization integrity, I implemented a robust administration and booking workflow:"
        ],
        bullets: [
          "Two-Step User Authorization: First, when a new user signs up, the request goes to a specialized admin dashboard. The admin must manually authorize new users using a custom HTML template injection before they are permitted to sign in.",
          "Slot Request & Admin Control: Once signed in, users can request to book a 4-hour slot by providing their email and phone number. The admin reviews and approves these requests in the dashboard. The admin also retains the power to revoke server permissions at any moment; a revoked user can still sign in, but they will be blocked from booking slots or running notebook servers.",
          "Broadcasting & SMTP Notifications: Rather than verification links, I set up a dedicated SMTP server to broadcast designated system notifications and custom updates to selected users simultaneously.",
          "Custom Startup Constraints: When a user launches their notebook instance, a custom container startup script verifies slot reservations and permissions. The Jupyter server container only spawns if all booking rules, active reservations, and admin approvals are met."
        ]
      },
      {
        heading: "Going Public: Reverse Proxy & Let's Encrypt",
        paragraphs: [
          "Initially, the GPU cloud was only accessible over the college Wi-Fi. I wanted students to be able to run model trainings from their hostels or homes, so I investigated the lab's network perimeter. I found they had a public IP and domain running an instance of XAMPP.",
          "I modified the XAMPP web server configurations to act as a reverse proxy, translating incoming public domain HTTP requests to our local Docker cluster. To secure student data and clear annoying web browser warning popups, I configured automated Let's Encrypt ACME challenges, switching our initial self-signed certificates out for official SSL certificates. The system has run continuously for 3+ months without shutdown."
        ]
      },
      {
        heading: "Monitoring, Diagnostics, & Health Logs",
        paragraphs: [
          "To ensure maintenance overhead remained low, I deployed a localized Portainer instance on localhost. Portainer lets me inspect container health, view CPU/GPU memory workloads in real-time, and read console logs instantly if an environment encounters issues.",
          "I know exactly how data flows inside the cluster - from the reverse proxy interface to the container startup arguments - which allows me to diagnose network bottlenecks or GPU storage allocations instantly."
        ]
      }
    ]
  },
  "cwm": {
    subtitle: "A complete workspace and shell history manager for developers. Catalog projects, quick-jump to editors, search history banks, and copy token-condensed codebase contexts.",
    images: Array.from({ length: 6 }, (_, i) => `./project_pictures/cwm/${i + 1}.png`),
    metrics: [
      { value: "Python CLI", label: "Build Stack" },
      { value: "SQLite", label: "Local Database Storage" },
      { value: "Click & Rich", label: "UI / CLI Styling" },
      { value: "0ms Probing", label: "Instant Local Startup" }
    ],
    techSpecs: [
      { label: "Core Language", value: "Python 3.10+" },
      { label: "Library Framework", value: "Click (CLI Builder)" },
      { label: "Text Formatting", value: "Rich (Terminal Aesthetics)" },
      { label: "Storage Engine", value: "SQLite / SQLite3" },
      { label: "Editor Integration", value: "VS Code / Cursor / Sublime" },
      { label: "Context Packager", value: "Token-condensed Tree Parser" }
    ],
    architectureTitle: "CLI Command Pipeline",
    architectureNodes: [
      { title: "User Command Input", desc: "Fast CLI typing via cwm", icon: "terminal" },
      { title: "Click Command Parser", desc: "Maps switches, actions & args", icon: "shuffle" },
      { title: "SQLite Local History", desc: "Logs commands & project paths", icon: "database" },
      { title: "Rich Render Engine", desc: "Outputs beautiful tables & lists", icon: "layout" }
    ],
    narratives: [
      {
        heading: "Overview & Workspace Navigation",
        paragraphs: [
          "CWM (Command Watch Manager) was built out of my own frustration: I work on multiple codebases, servers, and scripts, and I kept losing track of where projects were located, what local commands I ran in each workspace, and how to quickly package codebase context for AI tools. I developed a unified CLI utility in Python that functions as a developer's cockpit.",
          "With CWM, a developer can register projects with custom tags. Running a simple command like `cwm open <project-alias>` instantly launches the editor of choice (like VS Code or Cursor) directly inside the correct directory. It bypasses manual terminal traversal completely."
        ]
      },
      {
        heading: "Command Storage & Shell History Banking",
        paragraphs: [
          "Unlike standard bash/zsh shell history which logs everything in a flat chronological file, CWM acts as a structured repository. It segments shell commands by project. When you run a command in a registered project directory, CWM logs the command, execution path, and timestamp in a local SQLite database.",
          "You can query historical commands using tags or search keywords. If you forget a complex docker deployment command you wrote 3 weeks ago, typing `cwm history -q docker` instantly pulls the precise command syntax, preventing repetitive debugging cycles."
        ]
      },
      {
        heading: "LLM Context Copier & AI Diagnostics",
        paragraphs: [
          "A major feature of CWM is its integration with AI workflows. When writing prompts, developers often need to feed their codebase files into the LLM. Doing this manually file-by-file is tedious.",
          "CWM introduces a `cwm context` command. It traverses the active directory, respects `.gitignore` rules, parses file hierarchies, and merges code contents into a single markdown block, automatically adding token-reducing trees. It puts the condensed project context directly onto the clipboard, making AI-accelerated programming seamless."
        ]
      }
    ]
  },
  "eggshell": {
    subtitle: "A local-first, visual database pipeline workspace to stitch and clean spreadsheet data using an in-browser SQLite Web Worker and React Flow canvas.",
    images: Array.from({ length: 7 }, (_, i) => `./project_pictures/eggshell/${i + 1}.png`),
    metrics: [
      { value: "React Flow", label: "Interactive DAG Canvas" },
      { value: "SQLite WASM", label: "In-Browser Web Worker" },
      { value: "100% Client", label: "Zero-Server Privacy" },
      { value: "OPFS", label: "Origin Private File System" }
    ],
    techSpecs: [
      { label: "Frontend Library", value: "React / Vite" },
      { label: "DAG Canvas Editor", value: "React Flow" },
      { label: "SQL WASM Engine", value: "SQLite3 + Web Worker" },
      { label: "State Store", value: "Zustand" },
      { label: "Browser Storage", value: "OPFS (Fast I/O)" },
      { label: "Data Import", value: "CSV / Excel parser" }
    ],
    architectureTitle: "Pipeline Processing Flow",
    architectureNodes: [
      { title: "CSV/Excel Ingestion", desc: "User uploads tables in UI", icon: "upload-cloud" },
      { title: "React Flow Canvas", desc: "Visual pipeline node connections", icon: "layout" },
      { title: "SQLite WASM Worker", desc: "Runs SQL joins, transforms in worker", icon: "cpu" },
      { title: "Local OPFS Storage", desc: "Stores temporary databases securely", icon: "hard-drive" },
      { title: "Clean Export Gateway", desc: "Downloads clean CSV / Excel tables", icon: "download" }
    ],
    narratives: [
      {
        heading: "SQLite-Powered Local-First Engine",
        paragraphs: [
          "Data cleaning and ingestion are usually performed either in clumsy spreadsheets or by sending private company data to cloud-based ETL pipelines. EggShell solves both problems by bringing a full relational database engine directly into the browser.",
          "Using SQLite compiled to WebAssembly (WASM) running inside a background Web Worker, EggShell lets users import massive CSV or Excel files, run complex SQL transformations, and execute joins locally. Because all operations run in the browser's memory and OPFS, data never leaves the client's machine, satisfying strict data privacy constraints."
        ]
      },
      {
        heading: "Visual DAG Pipeline & React Flow Canvas",
        paragraphs: [
          "To make SQL operations accessible, EggShell wraps the database engine in an interactive node-based canvas powered by React Flow. Users represent operations (Imports, SQL Queries, Joins, Filters, and Exports) as visual nodes.",
          "By dragging connections between nodes, users establish a Directed Acyclic Graph (DAG) representing the data pipeline. Behind the scenes, EggShell parses the visual graph, translates the node links into a structured SQL script execution chain, and triggers queries sequentially inside the SQLite worker, providing live progress feedback."
        ]
      },
      {
        heading: "Grid Editor & Live Preview Monitor",
        paragraphs: [
          "To debug pipelines instantly, users can click any node in the canvas to open a spreadsheet-like grid editor. This grid queries the temporary SQLite tables created at that stage of the pipeline, displaying live previews of the data.",
          "If a query contains a syntax error, EggShell highlights the specific SQL query node in red and displays database compiler logs in the panel, allowing users to correct statements and re-run pipelines instantly."
        ]
      }
    ]
  },
  "seven5": {
    subtitle: "An offline-first attendance tracking and prediction application utilizing Google Drive API sync and predictive leave/attendance simulation algorithms.",
    images: Array.from({ length: 6 }, (_, i) => `./project_pictures/seven5/${i + 1}.jpeg`),
    metrics: [
      { value: "Flutter / Dart", label: "App Framework" },
      { value: "Hive DB", label: "High-Speed Local Storage" },
      { value: "Python API", label: "Holiday Analytics Engine" },
      { value: "Google Sync", label: "Drive Cloud Backups" }
    ],
    techSpecs: [
      { label: "Mobile Stack", value: "Flutter (Dart)" },
      { label: "Local Database", value: "Hive Key-Value Box" },
      { label: "Analytics Service", value: "FastAPI / Python" },
      { label: "Cloud Storage", value: "Google Drive OAuth2 API" },
      { label: "UI Library", value: "Tailored Material 3" },
      { label: "Deployment", value: "Google Play Store / Release" }
    ],
    architectureTitle: "Data Synchronization Sync",
    architectureNodes: [
      { title: "Flutter Client UI", desc: "Material 3 interface & offline input", icon: "smartphone" },
      { title: "Hive Local DB", desc: "Instant local lookups and updates", icon: "database" },
      { title: "FastAPI Holiday Engine", desc: "Checks region holidays & clusters", icon: "server" },
      { title: "Google Drive API Sync", desc: "Uploads/restores JSON backup sync", icon: "cloud" }
    ],
    narratives: [
      {
        heading: "Timetable & Daily Schedule Dashboard",
        paragraphs: [
          "For college students, maintaining the mandatory 75% attendance is a constant planning puzzle. Seven5 was created to automate this tracking. The app provides a daily schedule dashboard showing active courses, classes scheduled, and current attendance statistics.",
          "Students log their attendance status (Attended, Absent, Cancelled, or Holiday) with one-click actions. The app updates statistics instantly, showing how many classes the student can miss before falling below the threshold."
        ]
      },
      {
        heading: "Python Holidays Engine & Long Weekend Planner",
        paragraphs: [
          "The Holiday Planner module allows students to select their country and state or region (such as India and Tamil Nadu). The app queries the server backend to fetch region-specific official holiday lists, local observances, and weekends. These holiday arrays are cached locally in the app database, making the planner fully functional even in areas with poor internet connectivity. The backend then analyzes the academic calendar to locate holiday clusters, highlighting the best periods for long weekends."
        ]
      },
      {
        heading: "Predictive Bunk & Leave Simulation",
        paragraphs: [
          "The core differentiator of Seven5 is its predictive simulator. Students can input future plans (e.g. 'I want to go on a trip from Tuesday to Friday'). The simulation engine projects the future schedule, incorporates historical attendance, and predicts whether taking those leaves will drop their percentage below 75%.",
          "This proactive simulation allows students to make informed decisions about taking leaves without risking academic penalties."
        ]
      },
      {
        heading: "Offline-First Sync & Google Play Publishing",
        paragraphs: [
          "Because college campus networks can be notoriously unstable, Seven5 is architected as an offline-first app. All attendance entries, timetables, and notes are saved in a high-speed Hive database on the phone.",
          "When a connection is detected, the app performs a silent backup to the user's private Google Drive storage via Google Drive API, ensuring absolute privacy since no student records are ever saved on our own servers. The app was published and widely used by classmates."
        ]
      }
    ]
  },
  "virtuallab": {
    subtitle: "A web simulator for physical Profile Projector metrology experiments, combining 12 decoupled microservices routed via NGINX reverse proxy.",
    images: Array.from({ length: 6 }, (_, i) => `./project_pictures/virtuallab/${i + 1}.png`),
    metrics: [
      { value: "12 Services", label: "Dockerized Microservices" },
      { value: "React SPA", label: "Interactive Canvas UI" },
      { value: "NGINX Proxy", label: "Subdomain Route Gateway" },
      { value: "XAMPP Host", label: "MIT Institutional Server" }
    ],
    techSpecs: [
      { label: "Frontend Stack", value: "React / Vite" },
      { label: "Routing Gateway", value: "NGINX Reverse Proxy" },
      { label: "Orchestrator", value: "Docker Compose" },
      { label: "Host Platform", value: "Windows Server / XAMPP" },
      { label: "Canvas Engine", value: "HTML5 Canvas / Interaction" },
      { label: "API Framework", value: "FastAPI (Python)" }
    ],
    architectureTitle: "Metrology Virtual Lab Architecture",
    architectureNodes: [
      { title: "Student Web Browser", desc: "Interactive SPA canvas dashboard", icon: "monitor" },
      { title: "NGINX Gateway Proxy", desc: "Resolves subdirectories & paths", icon: "shield" },
      { title: "React Microservices", desc: "12 Decoupled experiment apps", icon: "grid" },
      { title: "FastAPI Math Engine", desc: "Computes tolerances & calibrations", icon: "cpu" }
    ],
    narratives: [
      {
        heading: "Overview & Simulation Concept",
        paragraphs: [
          "Physical metrology labs have expensive, specialized equipment like Profile Projectors which measure dimensions of mechanical parts to micro-tolerances. Because student access to these machines is limited by lab hours, the Madras Institute of Technology needed a virtual metrology lab simulator.",
          "I designed a React-based simulator that replicates the exact micrometer controls, focal adjustments, and measurements of a physical profile projector. Students adjust sliders, align vernier scales on a canvas, and make dimension readings just like they would in the physical lab."
        ]
      },
      {
        heading: "The Profile Projector Simulator",
        paragraphs: [
          "The simulator renders mechanical components (screws, gear teeth, template profiles) on a dynamic HTML5 canvas. Students can translate the component, scale the projection lens, rotate the protractor ring, and line up the crosshair overlay.",
          "The system compares the student's measurements against the actual mathematical parameters, providing real-time accuracy scoring and error analysis."
        ]
      },
      {
        heading: "My Role: Compiling, Structuring, & Gateway Design",
        paragraphs: [
          "I served as the lead developer for the frontend simulation mechanics and system integration. I took 12 independent, decoupled React metrology services developed by different lab groups and unified them under a single deployment structure.",
          "I wrote the Docker Compose orchestration scripts to spin up each service in its own isolated container, avoiding environment conflicts on the hosting server."
        ]
      },
      {
        heading: "Institutional Publishing via XAMPP & NGINX",
        paragraphs: [
          "To make the virtual labs publicly accessible on the institute's domain, I designed a multi-stage routing layout. The host machine runs XAMPP, which routes public traffic to our Docker Compose container network.",
          "Inside Docker, an NGINX container acts as a central reverse proxy, routing specific subfolder paths (e.g. `/virtuallab/projector`) to the corresponding React microservice container, providing a seamless single-domain user experience."
        ]
      }
    ]
  },
  "billgenie": {
    subtitle: "A containerized, secure database and financial transaction registry deployed for a local masjid trust. Features single/batch high-speed entries, spreadsheet data imports, automatic calculation engines, and A4 print engines.",
    images: Array.from({ length: 8 }, (_, i) => `./project_pictures/billgenie/${i + 1}.png`),
    metrics: [
      { value: "Masjid trust", label: "Active Local Deployment" },
      { value: "Zero-Source", label: "Docker Hub Secure Deploy" },
      { value: "Auto-Calculate", label: "Total Ingestion Engine" },
      { value: "A4 Print PDF", label: "Single & Bulk Invoicing" }
    ],
    techSpecs: [
      { label: "Client Stack", value: "React / Vite" },
      { label: "Styling Model", value: "CSS Modules" },
      { label: "Server API", value: "FastAPI (Python)" },
      { label: "Auth & DB Engine", value: "PocketBase DB" },
      { label: "SSL & Gateway", value: "Nginx / SSL / DuckDNS" },
      { label: "Container Stack", value: "Docker Compose" },
      { label: "Image Repository", value: "Docker Hub" }
    ],
    architectureTitle: "Deployment Architecture",
    architectureNodes: [
      { title: "Trust Domain", desc: "HTTPS via DuckDNS", icon: "globe" },
      { title: "Nginx Proxy", desc: "Let's Encrypt SSL Certs", icon: "shield-check" },
      { title: "React Client SPA", desc: "Vite production bundle", icon: "smartphone" },
      { title: "FastAPI Backend", desc: "Pydantic models & Local Cache", icon: "server" },
      { title: "PocketBase Container", desc: "SQLite local db & admin tools", icon: "database" }
    ],
    narratives: [
      {
        heading: "Masjid Trust & Locality Deployment",
        paragraphs: [
          "Managing contributions, annual collection records, and memberships in local community organizations can be incredibly challenging without modern software. BillGenie was designed from the ground up to solve these administrative friction points for community trusts, and it is currently actively utilized by a masjid trust in my neighborhood.",
          "The application provides a comprehensive donor registry that tracks Name, Gender, Address, Mobile number, and toggleable membership plans with dedicated, custom Member IDs. Users can catalog every transaction, organize donor profiles by locality/street, and track contributions with extreme speed."
        ]
      },
      {
        heading: "Zero-Source Deployment via Docker & Nginx",
        paragraphs: [
          "Because the application is deployed on local institutional servers where source code security and ease of setup are top priorities, I designed a containerized production pipeline. The React frontend, FastAPI backend, and local PocketBase database are bundled using Docker. These images are pushed to a Docker Hub repository.",
          "To publish the service on the trust's server, the container runner pulls the pre-built images directly from Docker Hub, ensuring that no raw source code files are ever stored or exposed on the server machine. A containerized Nginx instance acts as a reverse proxy, routing incoming traffic from a dynamic DuckDNS domain and securing connection payloads using automated Let's Encrypt SSL certificates."
        ]
      },
      {
        heading: "High-Speed Batch Ledger Entry & Excel Ingestion",
        paragraphs: [
          "Community donation collections are often collected in high volume during specific seasons or events, making traditional form submissions too slow. BillGenie provides a tailored ledger entry interface supporting two modes:"
        ],
        bullets: [
          "Single Entry Mode: A clean, modern interface for inputting one contribution at a time.",
          "Batch Entry Mode: A rapid ledger input matrix with vertical and horizontal keyboard grid navigation, enabling developers or trust members to quickly tab through cells and insert rows in bulk.",
          "Excel Template Import: Users can upload a standard Excel spreadsheet containing raw collections. The FastAPI parsing engine reads the grid, maps columns to active donors, and automatically computes totals dynamically, removing the need for manual mathematical auditing."
        ]
      },
      {
        heading: "Multi‑User Data Isolation",
        paragraphs: [
          "BillGenie leverages PocketBase's built‑in authentication and record ownership model to ensure that each user's data is isolated. When a user creates a donor or ledger entry, PocketBase automatically tags the record with the creator's user ID. Security rules and collection filters then enforce that users can only query, view, or modify records where the ownerId matches their own ID. This prevents one user's donor list or financial entries from being visible to another, supporting true multi‑tenant usage within the same database instance.",
          "Administrative users can define custom rules in PocketBase to grant read‑only access or elevated permissions as needed, while regular users remain confined to their own records."
        ]
      },
      {
        heading: "Annual History Audits & Print Engine",
        paragraphs: [
          "Auditing historical records is made simple with a powerful annual ledger browser. Admin users can filter transactions by trust organizations, localized streets, specific payment date ranges, genders, and Hijri calendar years.",
          "To support physical record keeping and distribution, the UI links to a high-performance print engine. Users can generate individual payment receipts or execute bulk-page printing, which automatically formats thousands of ledger items into print-ready, clean A4 PDFs with trust headers."
        ]
      }
    ]
  }
};
