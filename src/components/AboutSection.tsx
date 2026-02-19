import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, BarChart3, Brain, Zap, Rocket } from "lucide-react";

const pipeline = [
  { label: "Data", icon: BarChart3 },
  { label: "Intelligence", icon: Brain },
  { label: "Automation", icon: Zap },
  { label: "Impact", icon: Rocket },
];

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" className="py-24 px-6" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
          <h2 className="text-xs font-mono text-primary mb-2 text-glow tracking-widest uppercase">// About Me</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Systems-first engineer driven by{" "}
            <span className="text-primary text-glow">intelligence</span>,{" "}
            <span className="text-accent text-glow-ember">automation</span>, and scalable architecture.
          </h3>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.1 }} className="mb-10">
          <p className="text-xl md:text-2xl font-semibold text-foreground/80 mb-1">I don't build features.</p>
          <p className="text-xl md:text-2xl font-bold text-primary text-glow">I design systems.</p>
        </motion.div>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.2 }} className="text-muted-foreground text-base md:text-lg leading-relaxed mb-4 max-w-3xl">
          As a Computer Science student focused on <span className="text-primary">Agentic AI</span>, <span className="text-primary">Machine Learning</span>, <span className="text-primary">Full Stack Engineering</span>, and <span className="text-primary">Cloud Architecture</span>, I engineer intelligent platforms that transform raw data into autonomous decision systems.
        </motion.p>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.3 }} className="text-muted-foreground text-base md:text-lg leading-relaxed mb-14 max-w-3xl">
          From <span className="text-primary">Python</span> and <span className="text-primary">Java</span> backends with <span className="text-primary">FastAPI</span>, <span className="text-primary">Django</span>, and <span className="text-primary">Spring Boot</span> — to interactive <span className="text-primary">React</span> dashboards and production-ready ML pipelines — I build systems that think, learn, adapt, and scale.
        </motion.p>

        {/* Data → Intelligence → Automation → Impact */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.4 }} className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
          {pipeline.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.label} className="flex items-center gap-2 md:gap-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ delay: 0.5 + i * 0.12, type: "spring", stiffness: 400 }}
                  whileHover={{ y: -6, scale: 1.06, boxShadow: "0 0 20px hsl(24 95% 53% / 0.25)" }}
                  className="flex flex-col items-center gap-2 px-4 py-3 md:px-6 md:py-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-all duration-200 cursor-pointer"
                >
                  <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.4 }}>
                    <Icon className="w-5 h-5 text-primary" />
                  </motion.div>
                  <span className="text-sm font-mono text-foreground">{step.label}</span>
                </motion.div>
                {i < pipeline.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-primary/25 hidden md:block" />}
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
