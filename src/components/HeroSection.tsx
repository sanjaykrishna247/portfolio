import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronDown, User } from "lucide-react";

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
      <span className="text-2xl md:text-3xl font-bold text-primary text-glow font-heading">{count}{suffix}</span>
      <p className="text-[10px] text-muted-foreground font-mono mt-1 tracking-wider uppercase">{label}</p>
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
          <div className="lg:col-span-3 order-2 lg:order-1">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              {/* Subtitle tag */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xs font-mono text-accent mb-4 tracking-[0.3em] uppercase"
                style={{ textShadow: "0 0 20px hsl(24 95% 53% / 0.3)" }}
              >
                // Agentic AI &amp; ML Engineer
              </motion.p>

              {/* Name with glitch effect */}
              <h1 className="mb-3 leading-[1.1]">
                <span className="block text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground font-heading">
                  Sanjay
                </span>
                <span
                  className="block text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight glitch-text text-primary font-heading"
                  data-text="Krishna K"
                  style={{ textShadow: "0 0 40px hsl(24 95% 53% / 0.2)" }}
                >
                  Krishna K
                </span>
              </h1>

              {/* Info line */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-muted-foreground/70 mb-7 font-mono tracking-wide"
              >
                BE Computer Science Engineering – 2nd Year | SKCET
              </motion.p>
            </motion.div>

            {/* Role badges */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-wrap gap-2 mb-8">
              {roles.map((role, i) => (
                <motion.span
                  key={role}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  whileHover={{ scale: 1.08, borderColor: "hsl(24, 95%, 53%)", boxShadow: "0 0 16px hsl(24 95% 53% / 0.25)" }}
                  className="text-xs px-3 py-1.5 rounded-full border border-primary/20 text-primary/80 font-mono cursor-pointer backdrop-blur-sm bg-primary/[0.03] tracking-wide"
                >
                  {role}
                </motion.span>
              ))}
            </motion.div>

            {/* Typing tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-base md:text-lg text-foreground/50 font-mono h-8 mb-10 tracking-wide"
            >
              {displayed}{!done && <span className="animate-pulse text-primary">|</span>}
            </motion.p>

            {/* Counters */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }} className="flex gap-8 md:gap-12 mb-10">
              <Counter target={20} suffix="+" label="Projects Built" />
              <Counter target={12} label="AI/ML Systems" />
              <Counter target={8} label="Platforms" />
            </motion.div>

            {/* CTA Buttons */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.7 }} className="flex flex-wrap gap-3">
              <motion.a
                href="/resume.pdf"
                download
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px hsl(24 95% 53% / 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-mono font-semibold transition-all duration-200 tracking-wide"
              >
                ↓ Download Resume
              </motion.a>
              <motion.a
                href="#contact-form"
                whileHover={{ scale: 1.05, borderColor: "hsl(24, 95%, 53%)", boxShadow: "0 0 25px hsl(24 95% 53% / 0.2)" }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-xl border border-primary/30 text-primary text-sm font-mono font-semibold transition-all duration-200 tracking-wide backdrop-blur-sm"
              >
                → Get In Touch
              </motion.a>
            </motion.div>
          </div>

          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7, type: "spring" }}
            className="lg:col-span-2 flex justify-center order-1 lg:order-2"
          >
            <div className="relative">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 via-accent/10 to-transparent blur-2xl scale-125" />

              {/* Animated border ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-1 rounded-full"
                style={{
                  background: "conic-gradient(from 0deg, transparent, hsl(24 95% 53% / 0.3), transparent, hsl(24 95% 53% / 0.1), transparent)",
                }}
              />

              <motion.div
                whileHover={{ scale: 1.04 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="relative w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full border-2 border-primary/20 overflow-hidden bg-card/50 backdrop-blur-sm flex items-center justify-center group cursor-pointer"
              >
                {/* Replace src with your photo: <img src="/your-photo.jpg" alt="Sanjay Krishna K" className="w-full h-full object-cover" /> */}
                <div className="flex flex-col items-center gap-3 text-muted-foreground group-hover:text-primary transition-colors duration-300">
                  <User className="w-16 h-16 md:w-20 md:h-20" />
                  <span className="text-xs font-mono tracking-wider uppercase">Add Photo</span>
                </div>
              </motion.div>

              {/* Floating accent dots */}
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }} className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-primary/30" />
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -bottom-1 -left-3 w-2.5 h-2.5 rounded-full bg-accent/30" />
              <motion.div animate={{ x: [0, 6, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute top-1/2 -right-4 w-2 h-2 rounded-full bg-primary/20" />
            </div>
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
