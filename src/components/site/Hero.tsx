import { createContext, useContext, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, type TargetAndTransition } from "framer-motion";
import { ArrowDownRight, Command, Github, Linkedin, Mail, Pause, Play } from "lucide-react";
import { Magnetic, openPalette } from "./Extras";
import { profile, projects } from "@/data/portfolio";

const base = import.meta.env.BASE_URL;
const ease = [0.22, 1, 0.36, 1] as const;

// Entrance animations only start once the intro loader has lifted
const StartCtx = createContext(true);
const useA = () => {
  const start = useContext(StartCtx);
  return (t: TargetAndTransition) => (start ? t : undefined);
};

const SplitWord = ({ text, delay, className }: { text: string; delay: number; className?: string }) => {
  const A = useA();
  return (
  <span className={`inline-block overflow-hidden pb-[0.08em] align-bottom ${className ?? ""}`}>
    {[...text].map((c, i) => (
      <motion.span
        key={i}
        className="inline-block"
        initial={{ y: "110%" }}
        animate={A({ y: 0 })}
        transition={{ duration: 0.65, delay: delay + i * 0.022, ease }}
      >
        {c}
      </motion.span>
    ))}
  </span>
  );
};

/** Circular "open to work" badge that slowly rotates */
const Badge = () => {
  const text = "OPEN TO INTERNSHIPS • AVAILABLE NOW • ";
  return (
    <div className="relative h-28 w-28 shrink-0 sm:h-32 sm:w-32">
      <svg viewBox="0 0 120 120" className="spin-slow absolute inset-0 h-full w-full">
        <defs>
          <path id="circle" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
        </defs>
        <text fontFamily="JetBrains Mono, monospace" fontSize="9" fill="currentColor">
          {/* textLength = circumference (2π·46 ≈ 289) so the phrase wraps the circle exactly once */}
          <textPath href="#circle" textLength="287" lengthAdjust="spacing">{text}</textPath>
        </text>
      </svg>
      <div className="absolute inset-0 m-auto grid h-12 w-12 place-items-center rounded-full bg-flame text-white">
        <ArrowDownRight className="h-5 w-5" />
      </div>
    </div>
  );
};

const Showreel = () => {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.current?.pause();
      setPlaying(false);
    }
  }, []);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); } else { v.pause(); setPlaying(false); }
  };

  return (
    <figure>
      <div className="group relative overflow-hidden rounded-[22px] border border-foreground/10 bg-card shadow-[0_30px_60px_-30px_rgba(40,25,10,0.45)]">
        <video
          ref={video}
          className="block aspect-video w-full"
          src={`${base}showreel-720.mp4`}
          poster={`${base}showreel-poster.jpg`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label="Showreel: name, five featured projects, and contact"
        />
        <button
          onClick={toggle}
          className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-foreground/85 text-background opacity-0 backdrop-blur transition group-hover:opacity-100 focus-visible:opacity-100"
          aria-label={playing ? "Pause showreel" : "Play showreel"}
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
      </div>
      <figcaption className="mt-3 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-flame" /> Showreel · 0:20
        </span>
        <span>Made with HyperFrames</span>
      </figcaption>
    </figure>
  );
};

const Hero = ({ start = true }: { start?: boolean }) => (
  <StartCtx.Provider value={start}>
    <HeroInner />
  </StartCtx.Provider>
);

const HeroInner = () => {
  const A = useA();
  const live = projects.filter((p) => p.live).length;
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end start"] });
  const nameY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const nameOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.15]);

  return (
    <section ref={section} id="top" className="relative overflow-hidden pb-20 pt-32 sm:pt-36">
      <div className="paper-grid pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,#000,transparent_85%)]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <motion.p initial={{ opacity: 0 }} animate={A({ opacity: 1 })} transition={{ delay: 0.1 }} className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Portfolio · {profile.location}
        </motion.p>

        <div className="mt-5 flex flex-col-reverse gap-8 md:flex-row md:items-end md:justify-between">
          <motion.h1 style={{ y: nameY, opacity: nameOpacity }} className="font-serif text-[17vw] leading-[0.86] tracking-[-0.02em] text-foreground sm:text-[12vw] lg:text-[10.5rem]">
            <SplitWord text="Sanjay" delay={0} />
            <br />
            <SplitWord text="Krishna" delay={0.08} /> <SplitWord text="K" delay={0.22} className="italic text-flame" />
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: 6 }}
            animate={A({ opacity: 1, y: 0, rotate: 3 })}
            transition={{ delay: 0.15, duration: 0.8, ease }}
            className="relative w-36 shrink-0 self-start sm:w-48 md:mb-2 md:mr-6 md:w-56 md:self-auto lg:w-64"
          >
            <div className="overflow-hidden rounded-[26px] border-[6px] border-card bg-card shadow-[0_30px_60px_-30px_rgba(40,25,10,0.55)] transition-transform duration-500 hover:rotate-[-3deg] hover:scale-[1.02]">
              <img
                src={`${base}${profile.photo}`}
                alt={`Portrait of ${profile.name}`}
                width={900}
                height={900}
                fetchPriority="high"
                className="aspect-[4/5] w-full object-cover object-top"
              />
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.6, rotate: -40 }}
              animate={A({ opacity: 1, scale: 1, rotate: -3 })}
              transition={{ delay: 0.45, duration: 0.7, ease }}
              className="absolute -bottom-10 -left-14 hidden text-foreground md:block"
            >
              <div className="rounded-full bg-background/90 p-1 backdrop-blur">
                <Badge />
              </div>
            </motion.div>
          </motion.div>
        </div>

        <div className="mt-12 grid items-start gap-12 lg:grid-cols-12">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={A({ opacity: 1, y: 0 })} transition={{ delay: 0.2, duration: 0.6, ease }} className="lg:col-span-5">
            <p className="text-2xl font-medium leading-snug text-foreground sm:text-[28px]">
              AI &amp; full-stack developer. I build web products with{" "}
              <span className="font-serif text-[1.15em] italic text-primary">real intelligence</span> inside, from the model to the interface.
            </p>
            <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">
              Computer science student at {profile.collegeShort}. I've shipped LLM agent pipelines, ML risk models, a robot control
              console and more, and I'm looking for an internship where I can do it on a real team.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Magnetic>
              <a href="#work" data-cursor="Go" className="group inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-4 text-base font-semibold text-background transition hover:bg-flame">
                See my work <ArrowDownRight className="h-5 w-5 transition-transform group-hover:rotate-[-45deg]" />
              </a>
              </Magnetic>
              <Magnetic>
              <a href={profile.github} target="_blank" rel="noopener noreferrer" data-cursor="Open" className="inline-flex items-center gap-2.5 rounded-full border-2 border-foreground/25 bg-card px-7 py-4 text-base font-semibold text-foreground transition hover:border-foreground hover:bg-foreground hover:text-background">
                <Github className="h-5 w-5" /> GitHub
              </a>
              </Magnetic>
              <Magnetic>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" data-cursor="Open" className="inline-flex items-center gap-2.5 rounded-full border-2 border-[#0a66c2]/40 bg-card px-7 py-4 text-base font-semibold text-[#0a66c2] transition hover:border-[#0a66c2] hover:bg-[#0a66c2] hover:text-white">
                <Linkedin className="h-5 w-5" /> LinkedIn
              </a>
              </Magnetic>
              <Magnetic>
              <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2.5 rounded-full border-2 border-foreground/25 bg-card px-7 py-4 text-base font-semibold text-foreground transition hover:border-foreground">
                <Mail className="h-5 w-5" /> Email
              </a>
              </Magnetic>
            </div>
            <button onClick={openPalette} className="mt-5 hidden items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground sm:inline-flex">
              Press <kbd className="inline-flex items-center gap-0.5 rounded-md border border-foreground/20 bg-card px-1.5 py-0.5 font-mono text-[11px] text-foreground"><Command className="h-3 w-3" />K</kbd> to search projects or copy my email
            </button>

            <dl className="mt-12 grid grid-cols-3 border-t border-foreground/15 pt-6">
              {[
                [String(projects.length), "Projects"],
                [String(live), "Live sites"],
                ["SIH", "2026 team"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="sr-only">{l}</dt>
                  <dd className="font-serif text-5xl leading-none text-foreground">{v}</dd>
                  <dd className="mt-2 text-sm text-muted-foreground">{l}</dd>
                </div>
              ))}
            </dl>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 40, rotate: 1.5 }} animate={A({ opacity: 1, y: 0, rotate: 0 })} transition={{ delay: 0.1, duration: 0.7, ease }} className="lg:col-span-7">
            <Showreel />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
