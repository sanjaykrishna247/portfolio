// ─────────────────────────────────────────────────────────────
// Single source of truth for the portfolio content.
// Every project maps to a real repository on github.com/sanjaykrishna247.
// ─────────────────────────────────────────────────────────────

export const GITHUB_USER = "sanjaykrishna247";
const gh = (repo: string) => `https://github.com/${GITHUB_USER}/${repo}`;

export const profile = {
  name: "Sanjay Krishna K",
  role: "AI & Full-Stack Developer",
  tagline: "I build AI-backed web products, from the model and the API to the interface.",
  college: "Sri Krishna College of Engineering and Technology",
  collegeShort: "SKCET",
  degree: "B.E. Computer Science & Engineering",
  location: "Coimbatore, India",
  email: "sanjaykrishna.k.07@gmail.com",
  github: `https://github.com/${GITHUB_USER}`,
  linkedin: "https://www.linkedin.com/in/sanjaykrishna-k",
  // PDF in /public; set to "" to hide the Résumé section
  resume: "resume.pdf",
  photo: "profile.jpg",
};

export interface Project {
  slug: string;
  title: string;
  year: string;
  context: string; // where / why it was built
  description: string;
  highlights: string[];
  stack: string[];
  repo: string;
  live?: string;
  featured?: boolean;
  /** brand colour for the project panel (featured projects) */
  color?: string;
}

export const projects: Project[] = [
  {
    slug: "nexus",
    color: "#3730a3",
    title: "NEXUS: Tech Debt Analyzer",
    year: "2026",
    context: "",
    description:
      "Scans a codebase's dependencies, checks them against known vulnerabilities and predicts which upgrades are risky. Three LLM agents (scanner, reasoner, planner) then turn the findings into a prioritised upgrade plan and sprint tickets.",
    highlights: [
      "Agent pipeline runs on a local Ollama model and streams progress to the UI over Server-Sent Events",
      "Vulnerability data from the OSV database; dependency graph and blast-radius analysis with NetworkX",
      "Upgrade-risk model built with scikit-learn and XGBoost, plus changelog embeddings",
      "Exports the plan as sprint tickets sized to the team's capacity",
    ],
    stack: ["Python", "FastAPI", "XGBoost", "NetworkX", "Ollama", "React", "D3.js"],
    repo: gh("Tech-Debt-Analyzer"),
    featured: true,
  },
  {
    slug: "medfollow",
    color: "#0f766e",
    title: "MedFollow AI",
    year: "2026",
    context: "",
    description:
      "Predicts which patients are likely to miss a follow-up and contacts them automatically by phone call, WhatsApp or email, using messages written by an LLM. Admins, nurses and receptionists each get their own dashboard, and patients get a self-service portal.",
    highlights: [
      "scikit-learn risk model trained on appointment history",
      "Outreach through Twilio Voice, WhatsApp, Gmail SMTP and ElevenLabs text-to-speech",
      "Four separate apps, each with its own JWT auth domain",
      "Runs in a demo mode that logs messages instead of sending them when no API keys are set",
    ],
    stack: ["FastAPI", "scikit-learn", "SQLAlchemy", "APScheduler", "React", "Twilio"],
    repo: gh("medfollow"),
    featured: true,
  },
  {
    slug: "arceux",
    color: "#1f2937",
    title: "ARCEUX Robot Website",
    year: "2026",
    context: "Smart India Hackathon 2026",
    description:
      "Product site for our team's autonomous mobile robot. The robot is a real-time 3D model built part by part in code, so the wheels, arm joints and LiDAR head all move independently. Scrolling pulls it apart into an exploded view.",
    highlights: [
      "Robot modelled in Three.js through React Three Fiber",
      "3D scenes are lazy-loaded and stop rendering when off screen",
      "Falls back to a 2D SVG drawing when WebGL isn't available and respects reduced-motion settings",
    ],
    stack: ["React", "Three.js", "React Three Fiber", "Framer Motion"],
    repo: gh("arceux-website"),
    live: "https://arceux-website.vercel.app",
    featured: true,
  },
  {
    slug: "arceux-control",
    color: "#b45309",
    title: "ARCEUX Control Console",
    year: "2026",
    context: "Smart India Hackathon 2026",
    description:
      "The operator app for the same robot. It runs entirely in the browser with a built-in simulator, so you can plan routes, drive the robot, move the inspection arm and queue missions without any hardware.",
    highlights: [
      "A* path planning on a SLAM occupancy map, with simulated LiDAR",
      "Forward and inverse kinematics for a 4-joint arm: tap a point and the arm reaches it",
      "Installable PWA that works offline",
    ],
    stack: ["React", "Vite", "PWA", "A* / IK"],
    repo: gh("AMR-CONTROLLER-APP"),
    live: "https://amr-controller-app.vercel.app",
    featured: true,
  },
  {
    slug: "dribble-ai",
    color: "#e4572e",
    title: "Dribble AI",
    year: "2026",
    context: "",
    description:
      "Tracks how ready a student is for campus placements. It notices when someone starts slipping, estimates their placement chances and suggests a plan for the week, with a chatbot running on a local LLM.",
    highlights: [
      "Drift detection across 15+ metrics over 90-day windows",
      "Background jobs with Celery and Redis; live updates over WebSockets",
      "Full stack runs with one Docker Compose command",
    ],
    stack: ["FastAPI", "PostgreSQL", "Celery", "scikit-learn", "Ollama", "React"],
    repo: gh("Dribble-AI"),
    featured: true,
  },
  {
    slug: "yojana",
    title: "Yojana",
    year: "2026",
    context: "Team project",
    description:
      "Matches a family's details against 31 central government welfare schemes and shows which ones they qualify for, with a checklist of documents to bring. Available in English, Hindi and Tamil.",
    highlights: [
      "Rule-based eligibility engine, plus an optional LLM step that writes a personalised action plan",
      "Accessibility built in: text sizing, high-contrast mode and large touch targets",
    ],
    stack: ["React", "FastAPI", "SQLite", "LLM"],
    repo: gh("CODERS-NEXT-DOOR-yojana-"),
  },
  {
    slug: "urbanshield",
    title: "UrbanShield AI",
    year: "2026",
    context: "",
    description: "Dashboard for monitoring bridges, water pumps and transformers, with health scores, risk levels, anomaly simulation and a local LLM assistant.",
    highlights: [],
    stack: ["React", "TypeScript", "FastAPI", "Ollama"],
    repo: gh("u-arch"),
  },
  {
    slug: "doc-extraction",
    title: "Document Extraction API",
    year: "2026",
    context: "",
    description: "Turns PDFs, Word files and images into a summary, named entities and sentiment as JSON. Scanned pages go through OCR automatically.",
    highlights: [],
    stack: ["FastAPI", "Gemini", "Tesseract", "Docker"],
    repo: gh("AI-Powered-Document-Analysis-Extraction"),
  },
  {
    slug: "vedikshaya",
    title: "Vedikshaya",
    year: "2026",
    context: "",
    description: "Website, brew dashboard and companion app for a smart Ayurvedic kadha maker, with login, pod scanning and brew history.",
    highlights: [],
    stack: ["React", "FastAPI", "MySQL"],
    repo: gh("Vedhikshaya"),
    live: "https://vedhikshaya.vercel.app",
  },
  {
    slug: "aktp",
    title: "AKTP Monitor",
    year: "2026",
    context: "",
    description: "Monitoring dashboard for an energy-harvesting road surface, with a 3D cross-section, simulated sensors and a cost model.",
    highlights: [],
    stack: ["React", "Three.js", "Zustand", "Recharts"],
    repo: gh("ADAPTIVE-KINETIC-THERMAL-PAVEMENT"),
  },
  {
    slug: "boutique",
    title: "Boutique Inventory System",
    year: "2025",
    context: "College team project",
    description: "Spring Boot REST API for products, categories, warehouses and stock movements.",
    highlights: [],
    stack: ["Java", "Spring Boot", "JPA"],
    repo: gh("PREMIUM-BOUTIQUE-GIFT-SHOP-INVENTORY-MANAGEMENT-SYSTEM"),
  },
];

export const experience = [
  {
    period: "May — Jun 2026",
    title: "AI Development Intern",
    org: "Aparajitha Software Services Pvt. Ltd., Madurai",
    text: "Contributed to Knowledge Analyzer, which parses Acts, Rules and Amendments into actionable controls and checklists for the compliance audit team. Built ML retraining pipelines so risk and compliance scores stay up to date with the latest regulations, and customised an analytics engine showing risk posture across the organisation's verticals.",
    tags: ["React 19", "TypeScript", "FastAPI", "PostgreSQL", "Claude 3.5 Sonnet"],
  },
  {
    period: "2026",
    title: "Smart India Hackathon 2026",
    org: "Team Krenoviantz",
    text: "Built the software side of our autonomous mobile robot entry: the 3D product website and the operator console with its path-planning and arm simulator.",
    link: "https://arceux-website.vercel.app",
    tags: ["React", "Three.js", "Robotics UI"],
  },
  {
    period: "2024 — 2028",
    title: "B.E. Computer Science & Engineering",
    org: "SKCET, Coimbatore",
    text: "Studying computer science while building projects in applied AI and full-stack development.",
    tags: [] as string[],
  },
];

export const skills: { title: string; items: string[] }[] = [
  { title: "Languages", items: ["Python", "TypeScript", "JavaScript", "Java", "SQL"] },
  { title: "AI / ML", items: ["scikit-learn", "XGBoost", "LLM agents", "Ollama", "Gemini API", "OCR"] },
  { title: "Backend", items: ["FastAPI", "Spring Boot", "SQLAlchemy", "Celery", "WebSockets", "JWT"] },
  { title: "Frontend", items: ["React", "Tailwind CSS", "Three.js", "Framer Motion", "D3.js"] },
  { title: "Data & Tools", items: ["PostgreSQL", "MySQL", "Redis", "Docker", "Git", "Vercel"] },
];
