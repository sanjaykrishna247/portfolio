import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "AI/ML", href: "#ai-ml-projects" },
  { label: "Platforms", href: "#platforms" },
  { label: "Vision", href: "#vision" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass" : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="font-mono text-primary font-bold text-lg text-glow tracking-wider"
          whileHover={{ scale: 1.12, rotate: -2 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
        >
          SK<span className="text-accent">.</span>
        </motion.button>
        <div className="hidden md:flex gap-1">
          {navItems.map((item) => (
            <motion.button
              key={item.href}
              onClick={() => handleClick(item.href)}
              className="text-sm text-muted-foreground font-mono px-3 py-1.5 rounded-md transition-colors"
              whileHover={{
                backgroundColor: "hsl(24, 95%, 53%, 0.08)",
                color: "hsl(24, 95%, 75%)",
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15 }}
            >
              {item.label}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
