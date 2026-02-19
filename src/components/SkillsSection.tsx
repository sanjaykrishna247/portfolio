import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Brain, Server, Monitor, Cloud, Code2, Database } from "lucide-react";

const tabs = [
  {
    id: "ai", label: "AI & ML", icon: Brain,
    badges: ["TensorFlow", "Scikit-learn", "NLP", "Pandas", "NumPy"],
    skills: [
      { name: "Predictive Modeling & Scoring", level: 90 },
      { name: "NLP & Sentiment Analysis", level: 85 },
      { name: "Fraud & Anomaly Detection", level: 80 },
      { name: "Recommendation Systems", level: 75 },
      { name: "Monte Carlo Simulations", level: 70 },
      { name: "Performance Forecasting", level: 85 },
    ],
  },
  {
    id: "backend", label: "Backend", icon: Server,
    badges: ["FastAPI", "Django REST", "Spring Boot"],
    skills: [
      { name: "RESTful API Architecture", level: 92 },
      { name: "JWT Auth & RBAC", level: 88 },
      { name: "Middleware Engineering", level: 80 },
      { name: "WebSockets / Real-Time", level: 78 },
      { name: "Database Design", level: 85 },
      { name: "API Rate Limiting", level: 75 },
    ],
  },
  {
    id: "frontend", label: "Frontend", icon: Monitor,
    badges: ["React + Vite", "Angular", "Streamlit"],
    skills: [
      { name: "React Component Architecture", level: 90 },
      { name: "Interactive Data Visualization", level: 82 },
      { name: "State Management", level: 85 },
      { name: "Analytics Dashboards", level: 80 },
      { name: "Responsive Design", level: 88 },
    ],
  },
  {
    id: "languages", label: "Languages", icon: Code2,
    badges: ["Python", "Java", "C++", "JavaScript", "TypeScript"],
    skills: [
      { name: "Python", level: 95 },
      { name: "Java", level: 85 },
      { name: "JavaScript / TypeScript", level: 88 },
      { name: "C++", level: 72 },
    ],
  },
  {
    id: "cloud", label: "Cloud", icon: Cloud,
    badges: ["Docker", "AWS", "CI/CD", "Git"],
    skills: [
      { name: "Docker Containerization", level: 82 },
      { name: "AWS (EC2, S3, RDS)", level: 70 },
      { name: "CI/CD & Git Workflows", level: 80 },
      { name: "Cloud Deployment", level: 75 },
    ],
  },
  {
    id: "data", label: "Data", icon: Database,
    badges: ["PostgreSQL", "MongoDB", "Redis", "Postman"],
    skills: [
      { name: "PostgreSQL / MongoDB", level: 85 },
      { name: "Redis Caching", level: 72 },
      { name: "API Testing (Postman)", level: 88 },
      { name: "Data Pipeline Architecture", level: 78 },
    ],
  },
];

const SkillBar = ({ name, level, delay }: { name: string; level: number; delay: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -8 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay }}
      whileHover={{ x: 4 }}
      className="group cursor-pointer"
    >
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-150">{name}</span>
        <span className="text-xs font-mono text-primary/60">{level}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 1, delay: delay + 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, hsl(16 90% 48%), hsl(24 95% 53%), hsl(35 100% 55%))`,
            boxShadow: "0 0 6px hsl(24 95% 53% / 0.3)",
          }}
        />
      </div>
    </motion.div>
  );
};

const SkillsSection = () => {
  const [activeTab, setActiveTab] = useState("ai");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const active = tabs.find((t) => t.id === activeTab)!;

  return (
    <section id="skills" className="py-24 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
          <h2 className="text-xs font-mono text-primary mb-2 text-glow tracking-widest uppercase">// Tech Stack</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-10">
            What I <span className="text-primary text-glow">Build</span> With
          </h3>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: 0.15 }} className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                className={`flex flex-col items-center gap-1.5 px-2 py-3 rounded-lg text-xs font-mono transition-all duration-200 border ${activeTab === tab.id
                    ? "border-primary bg-primary/8 text-primary box-glow"
                    : "border-border text-muted-foreground hover:border-primary/15 hover:text-foreground hover:bg-card"
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </motion.button>
            );
          })}
        </motion.div>

        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="border border-border rounded-xl p-6 md:p-8 bg-card/40">
          {active.badges && (
            <div className="flex flex-wrap gap-2 mb-6">
              {active.badges.map((b) => (
                <motion.span key={b} whileHover={{ scale: 1.08, borderColor: "hsl(24, 95%, 53%)", boxShadow: "0 0 12px hsl(24 95% 53% / 0.2)" }} className="px-3 py-1 rounded-md text-xs font-mono border border-primary/20 text-primary/80 bg-primary/5 cursor-pointer transition-all duration-150">{b}</motion.span>
              ))}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {active.skills.map((skill, i) => (
              <SkillBar key={skill.name} name={skill.name} level={skill.level} delay={i * 0.05} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;
