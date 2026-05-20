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
      description: "CGPA: 7.73/10. Currently in III Year."
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
      title: "BillGenie",
      description: "A containerized, high-performance web application designed for community organizations and trusts to streamline donor registry management, financial ledger entries (with fast Single & Batch modes), and automated receipt printing. Features a performance-optimized local state caching engine, annual ledgers with advanced filtering, and a print engine for compiling bulk A4 PDF documents.",
      tags: ["React", "FastAPI", "PocketBase", "Docker", "Pydantic", "Excel Import"],
      link: "https://github.com/Isu-Ismail/BillGenie/",
      status: "Completed"
    },
    {
      title: "Sri Energy Industrial Automation",
      description: "Deployed a local-first IoT overhead crane telemetry control system featuring real-time hardware orchestration. Containerized a React dashboard and FastAPI middleware connected to a secure self-hosted Pocketbase backend using NGINX. Achieved low-latency safety controls by driving multiple ESP32 microcontrollers via a local Mosquitto MQTT broker.",
      tags: ["ESP32", "MQTT", "FastAPI", "Pocketbase", "React", "NGINX", "Docker", "XAMPP"],
      link: "https://srienergy.com/",
      status: "Completed"
    },
    {
      title: "Ct Ski (ML-Cloud Computing)",
      description: "Architected a high-availability server cluster delivering high-performance cloud environments to CS students. Configured distributed storage and full infrastructure metric monitoring using Prometheus and Grafana stacks. Programmed a slot-based booking platform powered by FastAPI automation; launched and inaugurated by the CEO of Tekion.",
      tags: ["Docker Swarm", "GlusterFS", "JupyterHub", "FastAPI", "Prometheus", "Grafana", "NFS"],
      link: "https://ct.mitindia.edu/ctskii/",
      status: "Completed"
    },
    {
      title: "Virtual Lab for Metrology",
      description: "Designed a comprehensive web simulator handling physical Profile Projector operations and fundamental experiments. Consolidated 12 decoupled web microservices into a production ecosystem using NGINX file-based reverse proxy routing.",
      tags: ["React", "Docker", "NGINX", "Simulation"],
      link: "https://pt.mitindia.edu/virtuallab/",
      status: "Completed"
    },
    {
      title: "Seven5: Attendance Tracking App",
      description: "Built an offline-first tracking mobile application syncing seamlessly with cloud dashboards via Google Drive API wrappers. Engineered dynamic predictive algorithms allowing users to run simulation strategies on personal leave and attendance metrics.",
      tags: ["Flutter", "Hive", "Dart", "Google Drive API", "Cloud Run"],
      link: "https://github.com/Isu-Ismail/ATTENDER_APP",
      status: "Completed"
    },
    {
      title: "EggShell: Visual File Stitching Engine",
      description: "Engineered a visual data pipeline editor that maps, filters, and stitches multi-format datasets into target outputs. Built a declarative JSON-driven pipeline architecture enabling multi-file transformations via a single config block. Integrated an inline SQLite custom script utility to parse string modifications and complex data-cleaning logic.",
      tags: ["React", "JavaScript", "SQLite", "Data Pipeline"],
      link: "https://isu-ismail.github.io/eggshell/",
      status: "Completed"
    },
    {
      title: "CWM (CLI Workspace Manager)",
      description: "Engineered an automated command-line developer environment utility handling workspace state session mapping and task logs.",
      tags: ["Python", "CLI", "Click", "Rich"],
      link: "https://isu-ismail.github.io/cwm-docwebsite/index.html",
      status: "Completed"
    },
    {
      title: "Anna University App",
      description: "Contributed to frontend implementation and UI asset scaling on the official enterprise e-Governance mobile workspace.",
      tags: ["Flutter", "Dart", "Hive", "Mobile"],
      link: "https://play.google.com/store/apps/details?id=com.cegov.AUeGov",
      status: "Completed"
    }
  ]
};