import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight, Check, Command, Copy, Github, Linkedin, Mail, Menu, X } from "lucide-react";
import { GitHubActivity, Magnetic, openPalette } from "./Extras";
import { experience, profile, projects, skills } from "@/data/portfolio";
import { SectionTitle } from "./Work";

const ease = [0.22, 1, 0.36, 1] as const;
const links = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#resume", label: "Resume" },
  { href: "#contact", label: "Contact" },
];

/* ── floating nav ─────────────────────────────────────── */
export const Nav = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease }}
        className={`relative mx-auto flex max-w-3xl items-center justify-between overflow-hidden rounded-full border px-2 py-2 transition-all duration-500 ${
          scrolled ? "border-foreground/10 bg-background/80 shadow-[0_10px_30px_-15px_rgba(40,25,10,0.35)] backdrop-blur-xl" : "border-transparent bg-transparent"
        }`}
      >
        <a href="#top" className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-foreground font-serif text-lg italic text-background">sk</span>
          <span className="hidden text-sm font-semibold text-foreground sm:block">Sanjay Krishna K</span>
        </a>
        <div className="hidden items-center gap-1 sm:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="rounded-full px-4 py-2 text-sm font-medium text-foreground/70 transition hover:bg-foreground/5 hover:text-foreground">
              {l.label}
            </a>
          ))}
          <button onClick={openPalette} className="ml-1 hidden items-center gap-1 rounded-full border border-foreground/15 px-2.5 py-2 font-mono text-[11px] text-foreground/70 transition hover:border-foreground hover:text-foreground md:inline-flex" aria-label="Open command palette">
            <Command className="h-3 w-3" />K
          </button>
          <a href={`mailto:${profile.email}`} className="ml-1 rounded-full bg-flame px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-foreground">
            Hire me
          </a>
        </div>
        <button onClick={() => setOpen((o) => !o)} className="grid h-10 w-10 place-items-center rounded-full bg-foreground text-background sm:hidden" aria-label="Menu" aria-expanded={open}>
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
        <motion.span style={{ scaleX: progress }} className="absolute inset-x-6 bottom-0 h-[2px] origin-left bg-flame" />
      </motion.nav>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mx-auto mt-2 max-w-3xl rounded-3xl border border-foreground/10 bg-background/95 p-3 backdrop-blur-xl sm:hidden">
            {[...links, { href: `mailto:${profile.email}`, label: "Email me" }].map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3 font-serif text-2xl text-foreground hover:bg-foreground/5">
                {l.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

/* ── tech marquee ─────────────────────────────────────── */
export const Marquee = () => {
  const tech = Array.from(new Set(projects.flatMap((p) => p.stack))).slice(0, 18);
  const row = [...tech, ...tech];
  return (
    <div className="marquee -rotate-1 overflow-hidden border-y border-foreground bg-foreground py-5 text-background">
      <div className="marquee-track flex w-max items-center">
        {row.map((t, i) => (
          <span key={i} className="flex items-center whitespace-nowrap font-serif text-3xl italic sm:text-4xl">
            {t}
            <span className="mx-8 text-xl not-italic text-flame">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
};

/* ── about, experience, skills ─────────────────────────── */
export const About = () => (
  <section id="about" className="py-24 sm:py-32">
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      <SectionTitle index="02" title="About" />

      <div className="grid gap-12 lg:grid-cols-12">
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease }}
          className="font-serif text-4xl leading-[1.1] text-foreground sm:text-5xl lg:col-span-7"
        >
          I like the whole journey: shaping the data, writing the API, training a model when it's needed, and then spending{" "}
          <span className="italic text-primary">far too long</span> getting the interface right.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.1, ease }}
          className="space-y-4 leading-relaxed text-muted-foreground lg:col-span-5 lg:pt-3"
        >
          <p>
            I'm studying {profile.degree} at {profile.college}. Most of my recent work is applied AI: agents that reason over a
            codebase's dependencies, models that predict missed hospital follow-ups, and assistants that answer from a project's own data.
          </p>
          <p>
            For Smart India Hackathon 2026 I built the software side of our team's robot: a 3D product site and a browser console with path
            planning and arm kinematics. My usual stack is Python and FastAPI on the backend, React and TypeScript on the front.
          </p>
        </motion.div>
      </div>

      <div className="mt-24 grid gap-16 lg:grid-cols-2">
        <div>
          <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Experience & education</h3>
          <ol className="mt-6">
            {experience.map((e) => (
              <li key={e.title} className="group grid grid-cols-[110px_1fr] gap-4 border-t border-foreground/15 py-7">
                <span className="pt-1 font-mono text-xs text-muted-foreground">{e.period}</span>
                <div>
                  <h4 className="font-serif text-3xl leading-tight text-foreground">
                    {e.link ? (
                      <a href={e.link} target="_blank" rel="noopener noreferrer" className="link-underline">{e.title}</a>
                    ) : (
                      e.title
                    )}
                  </h4>
                  <p className="mt-1 text-sm font-semibold text-primary">{e.org}</p>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{e.text}</p>
                </div>
              </li>
            ))}
          </ol>
          {profile.resume && (
            <a href={`${import.meta.env.BASE_URL}${profile.resume}`} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 font-semibold text-foreground hover:text-primary">
              Full resume <ArrowUpRight className="h-4 w-4" />
            </a>
          )}
        </div>

        <div>
          <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Toolkit</h3>
          <div className="mt-6">
            {skills.map((g, i) => (
              <motion.div
                key={g.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.6, ease }}
                className="grid grid-cols-[110px_1fr] gap-4 border-t border-foreground/15 py-5"
              >
                <span className="pt-1 font-mono text-xs text-muted-foreground">{g.title}</span>
                <div className="flex flex-wrap gap-2">
                  {g.items.map((s) => (
                    <span key={s} className="rounded-full bg-foreground/[0.06] px-3 py-1.5 text-sm text-foreground transition hover:bg-foreground hover:text-background">
                      {s}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <GitHubActivity />
    </div>
  </section>
);

/* ── contact + footer ─────────────────────────────────── */
export const Contact = () => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked; the mailto link still works */
    }
  };

  return (
    <section id="contact" className="px-3 pb-3 sm:px-4 sm:pb-4">
      <div className="relative overflow-hidden rounded-[28px] bg-foreground px-6 py-20 text-background sm:px-12 sm:py-28">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border-[40px] border-flame/90 sm:h-[28rem] sm:w-[28rem] sm:border-[60px]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-background/60">04 · Contact</p>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease }}
            className="mt-6 font-serif text-[15vw] leading-[0.9] sm:text-8xl lg:text-[9rem]"
          >
            Let's build
            <br />
            <span className="italic text-flame">something.</span>
          </motion.h2>
          <p className="mt-8 max-w-lg text-lg leading-relaxed text-background/70">
            I'm looking for internships in AI and full-stack development. Email is the quickest way to reach me.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Magnetic strength={0.25}>
            <a href={`mailto:${profile.email}`} className="group inline-flex items-center gap-2 rounded-full bg-flame px-7 py-4 font-semibold text-white transition hover:bg-background hover:text-foreground">
              <Mail className="h-5 w-5" /> {profile.email}
            </a>
            </Magnetic>
            <button onClick={copy} className="inline-flex items-center gap-2 rounded-full border border-background/25 px-5 py-4 text-sm font-medium transition hover:border-background" aria-label="Copy email address">
              {copied ? <Check className="h-4 w-4 text-flame" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Magnetic strength={0.25}>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" data-cursor="Open" className="inline-flex items-center gap-3 rounded-full border-2 border-background/30 px-8 py-4 text-lg font-semibold transition hover:border-background hover:bg-background hover:text-foreground">
              <Github className="h-6 w-6" /> GitHub
            </a>
            </Magnetic>
            <Magnetic strength={0.25}>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" data-cursor="Open" className="inline-flex items-center gap-3 rounded-full border-2 border-background/30 px-8 py-4 text-lg font-semibold transition hover:border-[#0a66c2] hover:bg-[#0a66c2] hover:text-white">
              <Linkedin className="h-6 w-6" /> LinkedIn
            </a>
            </Magnetic>
          </div>

          <div className="mt-20 flex flex-col justify-between gap-6 border-t border-background/15 pt-8 text-sm text-background/60 sm:flex-row sm:items-center">
            <p>© {new Date().getFullYear()} {profile.name}. Designed and built by me.</p>
            <div className="flex gap-6">
              <a href="#top" className="transition hover:text-background">Back to top ↑</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
