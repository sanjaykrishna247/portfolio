import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import Globe3D from "./Globe3D";

const roles = ["Agentic AI Engineer", "ML Engineer", "Full Stack Developer", "Cloud Architect"];

const useTypingEffect = (text: string, speed = 50) => {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    let i = 0;
    setDisplayed("");
    setDone(false);
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        setDone(true);
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);
  return { displayed, done };
};

const Counter = ({ target, suffix = "", label }: { target: number; suffix?: string; label: string }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let current = 0;
    const step = Math.ceil(target / 40);
    const interval = setInterval(() => {
      current += step;
      if (current >= target) { setCount(target); clearInterval(interval); }
      else setCount(current);
    }, 35);
    return () => clearInterval(interval);
  }, [target]);

  return (
    <div className="text-center">
      <span className="text-2xl md:text-3xl font-bold text-primary text-glow">{count}{suffix}</span>
      <p className="text-[10px] text-muted-foreground font-mono mt-1">{label}</p>
    </div>
  );
};

const HeroSection = () => {
  const tagline = "Building systems that think, learn, adapt, and scale.";
  const { displayed, done } = useTypingEffect(tagline, 40);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Animated gradient mesh blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="hero-blob blob-1" />
        <div className="hero-blob blob-2" />
        <div className="hero-blob blob-3" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-3">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <p className="text-xs font-mono text-accent mb-3 text-glow-ember tracking-widest uppercase">Agentic AI &amp; ML Engineer</p>
              {/* Glitch text name */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-2 leading-tight tracking-tight">
                <span className="text-foreground">Sanjay</span><br />
                <span className="glitch-text text-primary text-glow" data-text="Krishna K">Krishna K</span>
              </h1>
              <p className="text-sm text-muted-foreground mb-6 font-mono">BE Computer Science Engineering – 2nd Year | SKCET</p>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-wrap gap-2 mb-8">
              {roles.map((role, i) => (
                <motion.span
                  key={role}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  whileHover={{ scale: 1.08, borderColor: "hsl(24, 95%, 53%)", boxShadow: "0 0 16px hsl(24 95% 53% / 0.25)" }}
                  className="text-xs px-3 py-1.5 rounded-md border border-primary/20 text-primary/80 font-mono cursor-pointer"
                >
                  {role}
                </motion.span>
              ))}
            </motion.div>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="text-base text-foreground/60 font-mono h-7 mb-10">
              {displayed}{!done && <span className="animate-pulse text-primary">|</span>}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }} className="flex gap-8 md:gap-12 mb-8">
              <Counter target={20} suffix="+" label="Projects Built" />
              <Counter target={12} label="AI/ML Systems" />
              <Counter target={8} label="Platforms" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.7 }} className="flex flex-wrap gap-3">
              <motion.a
                href="/resume.pdf"
                download
                whileHover={{ scale: 1.05, boxShadow: "0 0 25px hsl(24 95% 53% / 0.35)" }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-mono font-semibold transition-all duration-200"
              >
                ↓ Download Resume
              </motion.a>
              <motion.a
                href="#contact-form"
                whileHover={{ scale: 1.05, borderColor: "hsl(24, 95%, 53%)", boxShadow: "0 0 20px hsl(24 95% 53% / 0.2)" }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2.5 rounded-lg border border-primary/30 text-primary text-sm font-mono font-semibold transition-all duration-200"
              >
                → Get In Touch
              </motion.a>
            </motion.div>
          </div>

          {/* 3D Globe */}
          <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.7, type: "spring" }} className="lg:col-span-2 flex justify-center">
            <Globe3D />
          </motion.div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <ChevronDown className="w-5 h-5 text-primary/30 animate-bounce" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
