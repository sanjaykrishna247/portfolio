import { useRef, useState, MouseEvent } from "react";
import { motion, useInView, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Project {
  title: string;
  description: string;
  tags: string[];
  tech: string[];
}

const aiMlProjects: Project[] = [
  { title: "AI Placement Readiness & Skill Gap Intelligence Platform", description: "Predicts placement readiness (0–100) with personalized improvement roadmaps.", tags: ["ML", "Analytics"], tech: ["Python", "Scikit-learn", "FastAPI", "React"] },
  { title: "AI Resume Intelligence & Job Matching Engine", description: "Resume-to-job similarity scoring with automated skill extraction.", tags: ["NLP", "Matching"], tech: ["Python", "NLP", "FastAPI", "Streamlit"] },
  { title: "AI Interview Simulator with Behavioral Analysis", description: "NLP-based confidence scoring and performance analytics.", tags: ["NLP", "Simulation"], tech: ["Python", "TensorFlow", "FastAPI", "React"] },
  { title: "AI Financial Fraud Detection System", description: "Anomaly detection with fraud probability scoring.", tags: ["Fraud Detection", "ML"], tech: ["Python", "Scikit-learn", "Django", "React"] },
  { title: "AI Academic Performance Prediction System", description: "Semester forecasting using behavioral and academic modeling.", tags: ["Prediction", "Education"], tech: ["Python", "Pandas", "FastAPI", "Streamlit"] },
  { title: "AI Code Quality & Bug Risk Analyzer", description: "Risk heatmaps and bug-prone module detection.", tags: ["Code Analysis", "Risk"], tech: ["Python", "AST", "FastAPI", "React + Vite"] },
  { title: "AI Health Risk Prediction Dashboard", description: "Disease risk modeling with trend tracking.", tags: ["Healthcare", "ML"], tech: ["Python", "Scikit-learn", "Django", "Angular"] },
  { title: "AI Startup Idea Risk Analyzer", description: "Market similarity scoring with SWOT intelligence.", tags: ["Business", "Risk"], tech: ["Python", "NLP", "FastAPI", "React"] },
  { title: "AI Personalized News Recommendation System", description: "Collaborative filtering with engagement analytics.", tags: ["RecSys", "NLP"], tech: ["Python", "TensorFlow", "Django REST", "React"] },
  { title: "AI Attendance Dropout Prediction System", description: "Department-level dropout risk dashboards.", tags: ["Prediction", "Education"], tech: ["Python", "Pandas", "Spring Boot", "Angular"] },
  { title: "AI Portfolio Optimization & Risk Simulator", description: "Monte Carlo simulations for optimized asset allocation.", tags: ["Finance", "Monte Carlo"], tech: ["Python", "NumPy", "FastAPI", "Streamlit"] },
  { title: "AI Campus Complaint Sentiment Analyzer", description: "Sentiment clustering with priority prediction.", tags: ["NLP", "Sentiment"], tech: ["Python", "NLTK", "Django", "React + Vite"] },
];

const platformProjects: Project[] = [
  { title: "Distributed Task Management Platform", description: "Multi-org Kanban system with RBAC and activity logging.", tags: ["Kanban", "RBAC"], tech: ["Java", "Spring Boot", "React", "PostgreSQL"] },
  { title: "Real-Time Collaborative Notes App", description: "Live editing via WebSockets with sync and versioning.", tags: ["WebSockets", "Real-Time"], tech: ["JavaScript", "FastAPI", "React + Vite", "Redis"] },
  { title: "Event Ticket Booking System", description: "Real-time seat locking with lifecycle management.", tags: ["Booking", "Real-Time"], tech: ["Java", "Spring Boot", "Angular", "PostgreSQL"] },
  { title: "API Rate Limiting Dashboard", description: "Custom middleware API usage tracking.", tags: ["API", "Middleware"], tech: ["Python", "FastAPI", "React", "Redis"] },
  { title: "Expense Analytics & Budget Tracker", description: "Financial trend visualization and overspending detection.", tags: ["Finance", "Analytics"], tech: ["Python", "Django", "React + Vite", "PostgreSQL"] },
  { title: "Smart Campus Complaint System", description: "Automated escalation with resolution analytics.", tags: ["Automation", "Campus"], tech: ["Java", "Spring Boot", "Angular", "MySQL"] },
  { title: "SaaS Subscription Billing Platform", description: "Usage-based billing with invoice tracking.", tags: ["SaaS", "Billing"], tech: ["Python", "Django REST", "React", "PostgreSQL"] },
  { title: "Academic Resource Exchange Platform", description: "Full-text search with contributor ranking.", tags: ["Education", "Search"], tech: ["JavaScript", "FastAPI", "React + Vite", "MongoDB"] },
];

// Extract all unique tech for filter
const getAllTech = (projects: Project[]) => {
  const techSet = new Set<string>();
  projects.forEach((p) => p.tech.forEach((t) => techSet.add(t)));
  return Array.from(techSet).sort();
};

const ProjectCard = ({ project, index, accent }: { key?: React.Key; project: Project; index: number; accent: "orange" | "ember" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });
  const [isHovered, setIsHovered] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useTransform(my, [-150, 150], [8, -8]);
  const rotateY = useTransform(mx, [-150, 150], [-8, 8]);
  const cardGlow = useTransform(
    [mx, my],
    ([latestX, latestY]: number[]) => {
      const x = ((latestX as number) + 150) / 300 * 100;
      const y = ((latestY as number) + 150) / 300 * 100;
      return `radial-gradient(circle at ${x}% ${y}%, hsl(${accent === "orange" ? "24 95% 53%" : "16 90% 48%"} / 0.12), transparent 60%)`;
    }
  );

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - r.left - r.width / 2);
    my.set(e.clientY - r.top - r.height / 2);
  };
  const handleMouseLeave = () => { mx.set(0); my.set(0); setIsHovered(false); };
  const glowHsl = accent === "orange" ? "24 95% 53%" : "16 90% 48%";

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{ duration: 0.45, delay: index * 0.06, type: "spring", stiffness: 100, damping: 15 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, perspective: 900, transformStyle: "preserve-3d" }}
      whileHover={{
        scale: 1.03,
        boxShadow: `0 8px 32px hsl(${glowHsl} / 0.2), 0 0 60px hsl(${glowHsl} / 0.08), inset 0 1px 0 hsl(${glowHsl} / 0.1)`,
        borderColor: `hsl(${glowHsl} / 0.5)`,
      }}
      className="group relative border border-border rounded-xl p-5 bg-card/30 backdrop-blur-sm flex flex-col cursor-pointer overflow-hidden"
    >
      {/* Animated spotlight that follows cursor */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"
        style={{ background: cardGlow }}
      />

      {/* Shimmer sweep on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-xl"
        initial={{ x: "-100%", opacity: 0 }}
        animate={isHovered ? { x: "200%", opacity: 1 } : { x: "-100%", opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        style={{
          background: `linear-gradient(90deg, transparent, hsl(${glowHsl} / 0.08), hsl(${glowHsl} / 0.15), hsl(${glowHsl} / 0.08), transparent)`,
          width: "50%",
        }}
      />

      {/* Animated top border gradient */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isHovered ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{
          background: `linear-gradient(90deg, transparent, hsl(${glowHsl}), transparent)`,
          transformOrigin: "left",
        }}
      />

      {/* Floating micro-particles on hover */}
      {isHovered && (
        <>
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full pointer-events-none"
              initial={{
                x: 30 + i * 60,
                y: 80,
                scale: 0,
                opacity: 0,
              }}
              animate={{
                y: [80, 20 + i * 10, -10],
                scale: [0, 1, 0.5],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 1.5 + i * 0.3,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeOut",
              }}
              style={{
                width: 3 + (i % 2) * 2,
                height: 3 + (i % 2) * 2,
                background: `hsl(${glowHsl} / 0.5)`,
                boxShadow: `0 0 6px hsl(${glowHsl} / 0.3)`,
              }}
            />
          ))}
        </>
      )}

      {/* Title with underline animation */}
      <div className="relative z-10">
        <h4 className="text-sm font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors duration-200 leading-snug">
          {project.title}
        </h4>
        <motion.div
          className="h-[1px] mb-2"
          initial={{ scaleX: 0 }}
          animate={isHovered ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{
            background: `linear-gradient(90deg, hsl(${glowHsl} / 0.5), transparent)`,
            transformOrigin: "left",
          }}
        />
      </div>

      <p className="relative z-10 text-xs text-muted-foreground mb-3 flex-1 leading-relaxed group-hover:text-muted-foreground/90 transition-colors duration-200">{project.description}</p>

      {/* Tags with staggered reveal */}
      <div className="relative z-10 flex flex-wrap gap-1 mb-2.5">
        {project.tags.map((tag, i) => (
          <motion.span
            key={tag}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: index * 0.06 + 0.3 + i * 0.08, type: "spring", stiffness: 200 }}
            whileHover={{
              scale: 1.12,
              backgroundColor: `hsl(${glowHsl} / 0.15)`,
              borderColor: `hsl(${glowHsl} / 0.4)`,
            }}
            className="text-[10px] font-mono px-2 py-0.5 rounded-md border border-primary/15 text-primary/60 transition-all duration-150 cursor-pointer"
          >
            {tag}
          </motion.span>
        ))}
      </div>

      {/* Tech stack with staggered reveal */}
      <div className="relative z-10 flex flex-wrap gap-1 pt-2.5 border-t border-border/40">
        {project.tech.map((t, i) => (
          <motion.span
            key={t}
            initial={{ opacity: 0, x: -8 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: index * 0.06 + 0.4 + i * 0.06, type: "spring", stiffness: 150 }}
            whileHover={{
              scale: 1.12,
              borderColor: `hsl(${glowHsl})`,
              color: `hsl(${glowHsl})`,
              boxShadow: `0 0 10px hsl(${glowHsl} / 0.2)`,
            }}
            className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-secondary/40 text-muted-foreground/80 border border-transparent cursor-pointer transition-all duration-150"
          >
            {t}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
};

const FilterableProjectSection = ({
  id, label, sublabel, count, projects, accent, accentHsl,
}: {
  id: string; label: string; sublabel: string; count: number;
  projects: Project[]; accent: "orange" | "ember"; accentHsl: string;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const allTech = getAllTech(projects);
  const [filters, setFilters] = useState<string[]>([]);

  const toggleFilter = (tech: string) => {
    setFilters((f) => f.includes(tech) ? f.filter((t) => t !== tech) : [...f, tech]);
  };

  const filtered = filters.length === 0
    ? projects
    : projects.filter((p) => filters.every((f) => p.tech.includes(f)));

  return (
    <section id={id} className="py-24 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="mb-6">
          <h2 className={`text-xs font-mono mb-2 tracking-widest uppercase ${accent === "orange" ? "text-primary text-glow" : "text-accent text-glow-ember"}`}>// {label}</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-foreground">
            <span className={accent === "orange" ? "text-primary text-glow" : "text-accent text-glow-ember"}>{count}</span> {sublabel}
          </h3>
        </motion.div>

        {/* Tech Filters */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: 0.15 }} className="flex flex-wrap gap-1.5 mb-6">
          {filters.length > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setFilters([])}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-mono bg-destructive/15 text-destructive border border-destructive/20 hover:bg-destructive/25 transition-all duration-150"
            >
              <X className="w-3 h-3" /> Clear
            </motion.button>
          )}
          {allTech.map((tech) => (
            <motion.button
              key={tech}
              onClick={() => toggleFilter(tech)}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              className={`px-2.5 py-1 rounded-md text-[10px] font-mono border transition-all duration-150 ${filters.includes(tech)
                ? "border-primary bg-primary/15 text-primary"
                : "border-border text-muted-foreground hover:border-primary/20 hover:text-foreground"
                }`}
            >
              {tech}
            </motion.button>
          ))}
        </motion.div>

        {/* Count */}
        <p className="text-xs text-muted-foreground mb-4 font-mono">
          Showing {filtered.length} of {projects.length} projects
          {filters.length > 0 && ` · Filtered by: ${filters.join(", ")}`}
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <ProjectCard key={p.title} project={p} index={i} accent={accent} />
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-muted-foreground text-sm py-12 font-mono">
            No projects match the selected filters.
          </motion.p>
        )}
      </div>
    </section>
  );
};

const ProjectsSection = () => (
  <>
    <FilterableProjectSection
      id="ai-ml-projects" label="AI & ML Projects" sublabel="Intelligent AI/ML Systems"
      count={12} projects={aiMlProjects} accent="orange" accentHsl="24 95% 53%"
    />
    <FilterableProjectSection
      id="platforms" label="Scalable Platforms" sublabel="Full-Stack Platforms"
      count={8} projects={platformProjects} accent="ember" accentHsl="16 90% 48%"
    />
  </>
);

export default ProjectsSection;
