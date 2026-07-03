export const data = {
  name: "A.M. Ismail",
  role: "System Architect & Developer",
  resume: "./assets/resume_ismail-8.pdf",
  gamePath: [
    { "Dino": "./games/dino/dino.html" },
    { "Pacman": "./games/pacman/pacman.html" },
    { "Tetris": "./games/tetris/tetris.html" }
  ],
  images: {
    profile: "./assets/me.jpeg",
    hero: "./assets/hero.jpeg"
  },
  contact: {
    email: "ismailsims1@gmail.com",
    phone: "81248 14896",
    location: "Chennai, India",
    github: "https://github.com/Isu-Ismail",
    linkedin: "https://www.linkedin.com/in/ismail-am"
  },
  about: "Production Engineering student focused on the software behind automation. I sit right between hardware and software. My engineering background gives me a solid grasp of how machines work, but my main focus is on designing the software systems that run them. I map out the overall logic, figure out how data should flow, and design how things connect. I use AI to handle the actual coding syntax, which lets me focus 100% on building reliable, smart automation systems without getting slowed down by the typing.",
  education: [
    {
      degree: "B.E. Production Engineering",
      institution: "Madras Institute of Technology",
      period: "Aug 2023 - 2027",
      description: "CGPA: 7.73/10. Currently in IV Year."
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
      role: "Chassis Design & Maintenance",
      company: "MITONAUR Motorsports (Go-Kart Team)",
      period: "Dec 2024 - 2025",
      description: "Structured structural simulations and engineering parameters on racing frames designed for the TNKC and KEC championships."
    }
  ],
  skills: [
    "MQTT", "Docker", "Docker Swarm", "NGINX", "Pocketbase", "Prometheus", "Grafana", "JupyterHub", "Git", "XAMPP", "GlusterFS", "FireBase", "Python", "FastAPI", "React", "Flutter", "Arduino", "SolidWorks", "Creo", "NX CAD", "CATIA", "Abaqus CAE"
  ],
  interests: ["3D Printing", "Home Server Administration", "Karting", "Tech Exploration"],
  certificates: [
    {
      title: "RUSA 2.0 AI in Smart BMS",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
      desc: "Hands-on training on AI applications in Smart Battery Management Systems."
    },
    {
      title: "Arduino Bootcamp",
      image: "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80",
      desc: "Comprehensive bootcamp on microcontroller programming and hardware interaction."
    },
    {
      title: "Python for Data Science",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      desc: "Foundational course on Python libraries including Pandas and NumPy by IBM."
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
      duration: "Oct 2025 – Marhch 2026",
      stars: 5
    },
    {
      title: "Middleman: Serverless Sourcing & RFQ Engine",
      description: "An automated RFQ sourcing engine connecting mail streams to React Flow timelines and a serverless PocketBase backend.",
      tags: ["React", "PocketBase", "React Flow", "Sourcing Engine", "Serverless", "Webhooks"],
      link: "https://github.com/Isu-Ismail/middleman",
      detailsLink: "./project_details/middleman.html",
      status: "Completed",
      duration: "Jan 2026 - May 2026",
      stars: 5
    },
    {
      title: "Quran Competition Management System (SQLC)",
      description: "A web application suite designed to manage Quran competition registrations, venue allocations, dynamic marksheets, and interactive tie-resolution.",
      tags: ["React", "TypeScript", "PocketBase", "Docker", "Nginx", "Leaderboards"],
      link: "https://github.com/Isu-Ismail/quran-competition-system",
      detailsLink: "./project_details/slqc.html",
      status: "Completed",
      duration: "Mar 2026 - Jun 2026",
      stars: 5
    },
    {
      title: "CWM (Command Watch Manager)",
      description: "A complete workspace and shell history manager for developers. Catalog projects, quick-jump to editors, search history banks, switch GitHub accounts, and copy token-condensed codebase contexts.",
      tags: ["Python", "CLI", "Click", "Rich", "AI Integration", "Workspace Manager", "Developer Tools"],
      link: "https://isu-ismail.github.io/cwm-docwebsite/index.html",
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
      title: "EggShell: Visual Relational Data Pipeline Builder",
      description: "A local-first, visual database pipeline workspace to stitch and clean spreadsheet data using an in-browser SQLite Web Worker and React Flow canvas.",
      tags: ["React", "SQLite", "React Flow", "Web Worker", "OPFS", "Data Pipeline", "Client-Side Privacy"],
      link: "https://isu-ismail.github.io/eggshell/",
      detailsLink: "./project_details/eggshell.html",
      status: "Completed",
      duration: "May 2026",
      stars: 3
    },

    {
      title: "Virtual Lab for Metrology",
      description: "A web simulator for physical Profile Projector metrology experiments. Combines 12 decoupled microservices routed via NGINX reverse proxy.",
      tags: ["React", "Docker", "NGINX", "Simulation"],
      link: "https://pt.mitindia.edu/virtuallab/",
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