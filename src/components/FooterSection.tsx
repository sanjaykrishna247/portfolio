import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Github, Linkedin, Mail, Heart, ExternalLink } from "lucide-react";
import MagneticElement from "./MagneticElement";

const links = [
  { icon: Github, label: "GitHub", href: "https://github.com/sanjaykrishna247", tag: "@sanjaykrishna247" },
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/sanjaykrishna-k", tag: "sanjaykrishna-k" },
  { icon: Mail, label: "Email", href: "mailto:sanjaykrishna.k.07@gmail.com", tag: "sanjaykrishna.k.07@gmail.com" },
];

const FooterSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <footer id="contact" className="py-20 px-6 border-t border-border/30" ref={ref}>
      <div className="max-w-4xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 25 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
          <h2 className="text-xs font-mono text-primary mb-2 text-glow tracking-widest uppercase">// Connect</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Let's <span className="text-primary text-glow">Build</span> Together
          </h3>
          <p className="text-sm text-muted-foreground mb-10 max-w-lg mx-auto">
            Open to collaborations, open-source contributions, and interesting conversations about AI, architecture, and engineering.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.15 }} className="flex flex-col md:flex-row items-center justify-center gap-3 mb-14">
          {links.map((link, i) => {
            const Icon = link.icon;
            return (
              <MagneticElement key={link.label} strength={0.2} radius={120}>
                <motion.a
                  href={link.href}
                  target={link.label !== "Email" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 15 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  whileHover={{ y: -4, borderColor: "hsl(24, 95%, 53%, 0.4)", boxShadow: "0 0 20px hsl(24 95% 53% / 0.15)" }}
                  className="flex items-center gap-3 px-5 py-3.5 rounded-xl border border-border bg-card/30 w-full md:w-auto min-w-[240px] group transition-all duration-200"
                >
                  <Icon className="w-4.5 h-4.5 text-primary shrink-0" />
                  <div className="flex flex-col items-start text-left flex-1">
                    <span className="text-xs font-mono text-muted-foreground group-hover:text-foreground transition-colors">{link.label}</span>
                    <span className="text-sm text-foreground/80 font-mono truncate max-w-[180px]">{link.tag}</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-muted-foreground/30 group-hover:text-primary/60 transition-colors shrink-0" />
                </motion.a>
              </MagneticElement>
            );
          })}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 0.5, delay: 0.5 }} className="space-y-2">
          <p className="text-xs text-muted-foreground/40 font-mono">
            Designed & Built by <span className="text-primary/50">Sanjay Krishna K</span>
          </p>
          <p className="text-xs text-muted-foreground/30 font-mono flex items-center justify-center gap-1">
            Made with <Heart className="w-3 h-3 text-primary/40" /> and a lot of caffeine
          </p>
          <p className="text-[10px] text-muted-foreground/20 font-mono">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default FooterSection;
