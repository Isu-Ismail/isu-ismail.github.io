export const data = {
  name: "A.M. Ismail",
  role: "System Architect & Engineer",
  resume: "https://firebasestorage.googleapis.com/v0/b/portfolio-c1025.firebasestorage.app/o/about%2Fresume_pdf.pdf?alt=media&token=440db090-b11d-4ccf-b518-72b7ac621eae",
  gamePath: [
    { "Dino": "./games/dino/dino.html" },
    { "Pacman": "./games/pacman/pacman.html" },
    { "Tetris": "./games/tetris/tetris.html" }
  ],
  images: {
    profile: "https://firebasestorage.googleapis.com/v0/b/portfolio-c1025.firebasestorage.app/o/about%2Fprofile.webp?alt=media&token=7542b95c-14c9-4afa-8c3b-bff270962e90",
    hero: "",
    resume_image: "https://firebasestorage.googleapis.com/v0/b/portfolio-c1025.firebasestorage.app/o/about%2Fresume_image.webp?alt=media&token=bf9d04c1-7645-4ee2-8715-e69619176967"
  },
  contact: {
    email: "ismailisims1@gmail.com",
    phone: "+91 81248 14896",
    location: "Chennai, India",
    github: "https://github.com/Isu-Ismail",
    linkedin: "https://www.linkedin.com/in/ismail-am",
    instagram: "https://www.instagram.com/ismail_isims"
  },
  about: "Engineering student driven by practical problem-solving, continuous process improvement, and rapid learning agility. Experienced in applying engineering fundamentals to solve shop-floor bottlenecks, optimize workflows, and deploy cost-effective automated solutions that deliver measurable productivity gains. Demonstrated track record of collaborating across multidisciplinary teams, with exceptional adaptability to quickly master new processes, tools, and technical domains.",
  hero_about: "Engineer driven by practical problem-solving and continuous process improvement — applying engineering fundamentals to optimize workflows and deliver measurable results across real industrial environments.",
  stats: [
    { value: "Entry", label: "Talent Ready" },
    { value: "11+", label: "Projects Completed" }
  ],
  education: [
    {
      degree: "B.E. Production Engineering",
      institution: "Madras Institute of Technology",
      period: "Aug 2023 - 2027",
      description: "Currently in IV Year."
    },
    {
      degree: "Higher Secondary (HSC)",
      institution: "L K Higher Secondary School",
      period: "2022 - 2023",
      description: "Score: 545/600 (90.8%)"
    }
  ],
  experience: [
    {
      role: "Industrial Intern (Production & Operations)",
      company: "SRI Energy Valves Private Limited",
      period: "June 2026",
      description: "Underwent focused observational training in industrial valve assembly and shop-floor inventory operations; studied step-by-step mechanical workflows, defect inspection, and systematic part transport logistics.",
      certificateLink: "https://firebasestorage.googleapis.com/v0/b/portfolio-c1025.firebasestorage.app/o/about%2Fexperience_certificate_1.png?alt=media&token=96aad004-fb25-4334-a0b1-dbf93c39b6de"
    },
    {
      role: "Chassis Design & Maintenance",
      company: "MITONAUR Motorsports (Go-Kart Team)",
      period: "Dec 2024 - 2025",
      description: "Assisted in the design and assembly of structural members on racing go-kart frames for the TNKC and KEC championships."
    }
  ],
  skills: [
    "MQTT", "Docker", "Docker Swarm", "NGINX", "Pocketbase", "Prometheus", "Grafana", "JupyterHub", "Git", "XAMPP", "GlusterFS", "FireBase", "Python", "FastAPI", "React", "Flutter", "Arduino", "SolidWorks", "Creo", "NX CAD", "CATIA", "Abaqus CAE"
  ],
  skillCards: [
    {
      title: "Systems & DevOps",
      items: ["Docker", "Docker Swarm", "NGINX", "Pocketbase", "Prometheus", "Grafana", "JupyterHub", "GlusterFS", "Git", "XAMPP", "FireBase"]
    },
    {
      title: "Software & Protocols",
      items: ["Python", "FastAPI", "React", "Flutter", "Arduino", "MQTT"]
    },
    {
      title: "CAD/CAE Engineering",
      items: ["SolidWorks", "Creo", "NX CAD", "CATIA", "Abaqus CAE"]
    }
  ],
  interests: ["3D Printing", "Home Server Administration", "Karting", "Tech Exploration"],
  certificates: [
    {
      title: "Manufacturing Strategy",
      image: "https://firebasestorage.googleapis.com/v0/b/portfolio-c1025.firebasestorage.app/o/about%2Fcertificate1.webp?alt=media&token=9c0b0645-b670-4986-9de2-188934011278",
      desc: "NPTEL Elite Certification by IIT Roorkee. Covered manufacturing planning, competitive strategy, and operational decision-making frameworks. Score: 66% (Jul–Sep 2025)."
    },
    {
      title: "Navigating the Latest Trends in Additive Manufacturing Landscape",
      image: "https://firebasestorage.googleapis.com/v0/b/portfolio-c1025.firebasestorage.app/o/about%2Fcertificate2.webp?alt=media&token=f80c9c24-a411-4d07-9aab-a1c79a358646",
      desc: "NPTEL Elite Certification by IIT Bombay. Explored current advancements and industry applications in additive manufacturing and 3D printing technologies. Score: 80% (Feb–Mar 2026)."
    }
  ],
  projects: [

    {
      title: "Sri Energy Industrial Automation",
      description: "A local-first IoT crane telemetry and real-time control system. Features containerized React/FastAPI services connected to a self-hosted Pocketbase backend and ESP32 nodes via MQTT.",
      tags: ["ESP32", "MQTT", "FastAPI", "Pocketbase", "React", "NGINX", "Docker", "XAMPP"],
      link: "https://srienergy.com/",
      detailsLink: "./project_details/sriautoamtion.html",
      status: "Completed",
      duration: "Oct 2024 – May 2026",
      stars: 5
    },
    {
      title: "CTSKII (ML-Cloud Computing)",
      description: "A high-availability server cluster offering GPU cloud environments to students. Built with Docker Swarm, GlusterFS, and a slot-based FastAPI booking platform.",
      tags: ["Docker Swarm", "GlusterFS", "JupyterHub", "FastAPI", "Prometheus", "Grafana", "NFS"],
      link: "https://ct.mitindia.edu/ctskii/",
      detailsLink: "./project_details/ctskii.html",
      status: "Completed",
      duration: "Oct 2025 – March 2026",
      stars: 5
    },
    {
      title: "Middleman: Serverless Sourcing & RFQ Engine",
      description: "An automated RFQ sourcing engine connecting mail streams to React Flow timelines and a serverless PocketBase backend.",
      tags: ["React", "PocketBase", "React Flow", "Sourcing Engine", "Serverless", "Webhooks"],
      link: "https://github.com/Isu-Ismail/middleman",
      detailsLink: "./project_details/middleman.html",
      status: "Completed",
      duration: "June 2026 - July 2026",
      stars: 5
    },
    {
      title: "Quran Competition Management System (SQLC)",
      description: "A web application suite designed to manage Quran competition registrations, venue allocations, dynamic marksheets, and interactive tie-resolution.",
      tags: ["React", "TypeScript", "PocketBase", "Docker", "Nginx", "Leaderboards"],
      link: "https://github.com/Isu-Ismail/quran-competition-system",
      detailsLink: "./project_details/slqc.html",
      status: "Completed",
      duration: "June 2026 - June 2026",
      stars: 5
    },
    {
      title: "CWM (Command Watch Manager)",
      description: "A complete workspace and shell history manager for developers. Catalog projects, quick-jump to editors, search history banks, switch GitHub accounts, and copy token-condensed codebase contexts.",
      tags: ["Python", "CLI", "Click", "Rich", "AI Integration", "Workspace Manager", "Developer Tools"],
      link: "https://cwm.codism.in/",
      detailsLink: "./project_details/cwm.html",
      status: "Completed",
      duration: "Nov 2025 – Dec 2025",
      stars: 4
    },

    {
      title: "Seven5: Attendance Tracking App",
      description: "An offline-first Flutter application utilizing Google Drive API sync and predictive leave/attendance simulation algorithms.",
      tags: ["Flutter", "Hive", "Dart", "Google Drive API", "Cloud Run"],
      link: "https://github.com/Isu-Ismail/ATTENDER_APP",
      detailsLink: "./project_details/seven5.html",
      status: "Completed",
      duration: "Dec 2025 – May 2026",
      stars: 4
    },
    {
      title: "NeoCGPA: Intelligent GPA/CGPA Calculator & Target Planner",
      description: "A client-side GPA/CGPA tracker built with Svelte 5. Features instant calculations, in-browser Tesseract.js OCR marksheet scanning, vector PDF export, and target CGPA goal planning.",
      tags: ["Svelte 5", "Vite", "Tesseract.js", "OCR", "jsPDF", "Firebase", "Neo-Brutalism"],
      link: "https://cgpa.codism.in/",
      detailsLink: "./project_details/cgpa.html",
      status: "Completed",
      duration: "Aug 2026 – Sep 2026",
      stars: 3
    },
    {
      title: "EggShell: Visual Relational Data Pipeline Builder",
      description: "A local-first, visual database pipeline workspace to stitch and clean spreadsheet data using an in-browser SQLite Web Worker and React Flow canvas.",
      tags: ["React", "SQLite", "React Flow", "Web Worker", "OPFS", "Data Pipeline", "Client-Side Privacy"],
      link: "https://eggshell.codism.in/",
      detailsLink: "./project_details/eggshell.html",
      status: "Completed",
      duration: "May 2026",
      stars: 3
    },

    {
      title: "Virtual Lab for Metrology",
      description: "A web simulator for physical Profile Projector metrology experiments. Combines 12 decoupled microservices routed via NGINX reverse proxy.",
      tags: ["React", "Docker", "NGINX", "Simulation"],
      link: "https://ptmit-org.github.io/virtuallab/",
      detailsLink: "./project_details/virtuallab.html",
      status: "Completed",
      duration: "Sep 2025 – Apr 2026",
      stars: 3
    },
    {
      title: "BillGenie",
      description: "A containerized donor registry and ledger system for community organizations. Features single/batch entry modes, local caching, and bulk PDF invoicing.",
      tags: ["React", "FastAPI", "PocketBase", "Docker", "Pydantic", "Excel Import"],
      link: "https://github.com/Isu-Ismail/BillGenie/",
      detailsLink: "./project_details/billgenie.html",
      status: "Completed",
      duration: "May 2026",
      stars: 3
    },
    {
      title: "Anna University App",
      description: "Mobile application frontend contributions for the official e-Governance workspace at Anna University.",
      tags: ["Flutter", "Dart", "Hive", "Mobile"],
      link: "https://play.google.com/store/apps/details?id=com.cegov.AUeGov",
      status: "Completed",
      duration: "Aug 2025 – Nov 2025",
      stars: 3
    }
  ]
};