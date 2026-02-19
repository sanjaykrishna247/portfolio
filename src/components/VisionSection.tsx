import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Database, Brain, Zap, Rocket } from "lucide-react";

const VisionSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="vision" className="py-24 px-6" ref={ref}>
      <div className="max-w-5xl mx-auto">
        {/* WHAT DRIVES ME */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
          <h2 className="text-xs font-mono text-primary mb-2 text-glow tracking-widest uppercase">// What Drives Me</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What <span className="text-primary text-glow">Drives</span> Me
          </h3>
          <p className="text-muted-foreground text-base mb-8 max-w-2xl">I am deeply interested in building:</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.15 }} className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
          {[
            "AI systems that make decisions, not just predictions",
            "Backends that remain clean and stable under scale",
            "Cloud-native architectures designed for growth",
            "Intelligence layers that integrate seamlessly with real-world applications",
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.25 + i * 0.08 }}
              whileHover={{ x: 6, borderColor: "hsl(24, 95%, 53%, 0.3)", boxShadow: "0 0 15px hsl(24 95% 53% / 0.12)" }}
              className="flex items-start gap-3 p-4 border border-border rounded-xl bg-card/30 cursor-pointer transition-all duration-200"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <span className="text-sm text-foreground/80">{item}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.55 }} className="mb-20">
          <p className="text-muted-foreground text-sm mb-1">My mindset is <span className="text-primary font-semibold">architectural</span>.</p>
          <p className="text-muted-foreground text-sm">Every API, model, and UI component is part of a larger ecosystem.</p>
        </motion.div>

        {/* ENGINEERING PHILOSOPHY */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.65 }}>
          <h2 className="text-xs font-mono text-accent mb-2 text-glow-ember tracking-widest uppercase">// My Engineering Philosophy</h2>
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
            Engineering <span className="text-primary text-glow">Philosophy</span>
          </h3>
        </motion.div>

        {/* Quote */}
        <motion.blockquote
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.75 }}
          whileHover={{ x: 8, borderColor: "hsl(24, 95%, 53%)", boxShadow: "inset 3px 0 12px hsl(24 95% 53% / 0.08)" }}
          className="border-l-2 border-primary/30 pl-6 mb-10 cursor-pointer transition-all duration-200"
        >
          <p className="text-xl md:text-2xl text-foreground/85 italic leading-relaxed">
            "Intelligence is not added to a system. It is{" "}
            <span className="text-primary text-glow not-italic font-semibold">architected</span> into it."
          </p>
        </motion.blockquote>

        {/* Explanation */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.85 }} className="mb-10 max-w-3xl">
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-4">
            I believe great engineering begins at the <span className="text-primary font-semibold">architecture layer</span>. Machine learning models, APIs, and cloud infrastructure must operate as a unified ecosystem — not isolated components.
          </p>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            My focus is on designing systems where:
          </p>
        </motion.div>

        {/* Four pillars: Data → Intelligence → Automation → Scale */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.95 }} className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-10">
          {[
            { label: "Data flows seamlessly", icon: Database },
            { label: "Intelligence drives decisions", icon: Brain },
            { label: "Automation reduces friction", icon: Zap },
            { label: "Architecture enables scale", icon: Rocket },
          ].map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.label} className="flex items-center gap-2 md:gap-3">
                <motion.div
                  whileHover={{ y: -5, scale: 1.04, boxShadow: "0 0 20px hsl(24 95% 53% / 0.2)", borderColor: "hsl(24, 95%, 53%, 0.35)" }}
                  className="flex flex-col items-center gap-2 px-4 py-3 md:px-5 md:py-4 rounded-xl border border-border bg-card/30 hover:border-primary/30 transition-all duration-200 cursor-pointer min-w-[130px]"
                >
                  <Icon className="w-5 h-5 text-primary" />
                  <span className="text-xs font-mono text-foreground text-center leading-snug">{step.label}</span>
                </motion.div>
                {i < 3 && <ArrowRight className="w-3 h-3 text-primary/25 hidden md:block" />}
              </div>
            );
          })}
        </motion.div>

        {/* Closing statement */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 1.05 }}
          whileHover={{ x: 6, borderColor: "hsl(24, 95%, 53%)", boxShadow: "inset 3px 0 12px hsl(24 95% 53% / 0.08)" }}
          className="border-l-2 border-primary/30 pl-5 mb-10 cursor-pointer transition-all duration-200"
        >
          <p className="text-sm md:text-base text-foreground/75 leading-relaxed">
            Every system I build is structured to <span className="text-primary font-semibold">evolve</span>, <span className="text-primary font-semibold">adapt</span>, and <span className="text-primary font-semibold">grow</span>.
          </p>
        </motion.div>

        {/* Goal */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 1.15 }}
          className="p-5 rounded-xl border border-primary/15 bg-primary/3"
        >
          <p className="text-sm md:text-base text-foreground/80 leading-relaxed">
            I'm currently building toward becoming an{" "}
            <span className="text-primary font-bold text-glow">Agentic AI Systems Architect</span> — capable of designing adaptive platforms that operate autonomously and scale globally.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default VisionSection;
