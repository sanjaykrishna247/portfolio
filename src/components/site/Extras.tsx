import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight, Code2, Copy, FileCode2, Github, Hash, Linkedin, Mail } from "lucide-react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandShortcut } from "@/components/ui/command";
import { GITHUB_USER, profile, projects } from "@/data/portfolio";

const ease = [0.22, 1, 0.36, 1] as const;
const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ── Intro loader: counter to 100, then the curtain lifts ───────────────── */
export const Preloader = ({ onDone }: { onDone: () => void }) => {
  const [n, setN] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (reducedMotion()) { onDone(); return; }
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 550);
      setN(Math.round(100 * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setLeaving(true);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[300] flex flex-col justify-between bg-foreground p-6 text-background sm:p-10"
      initial={{ clipPath: "inset(0 0 0% 0)" }}
      animate={leaving ? { clipPath: "inset(0 0 100% 0)" } : {}}
      transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={() => leaving && onDone()}
      aria-hidden
    >
      <div className="flex justify-between font-mono text-xs uppercase tracking-[0.25em] text-background/60">
        <span>Sanjay Krishna K</span>
        <span>Portfolio 2026</span>
      </div>
      <div className="flex items-end justify-between gap-6">
        <p className="max-w-xs font-serif text-3xl italic text-background/80 sm:text-4xl">AI &amp; full-stack developer</p>
        <span className="font-serif text-[28vw] leading-[0.8] sm:text-[16rem]">
          {n}
          <span className="text-flame">%</span>
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1 origin-left bg-flame" style={{ transform: `scaleX(${n / 100})` }} />
    </motion.div>
  );
};

/* ── Custom cursor: a dot + ring that grows into a label over [data-cursor] ── */
export const Cursor = () => {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [down, setDown] = useState(false);
  const x = useMotionValue(-100), y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40 }), sy = useSpring(y, { stiffness: 500, damping: 40 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches || reducedMotion()) return;
    setEnabled(true);
    document.documentElement.classList.add("custom-cursor");
    const move = (e: PointerEvent) => {
      x.set(e.clientX); y.set(e.clientY);
      const t = (e.target as HTMLElement).closest?.("[data-cursor]") as HTMLElement | null;
      setLabel(t?.dataset.cursor ?? null);
    };
    const d = () => setDown(true), u = () => setDown(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", d);
    window.addEventListener("pointerup", u);
    return () => {
      document.documentElement.classList.remove("custom-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", d);
      window.removeEventListener("pointerup", u);
    };
  }, [x, y]);

  if (!enabled) return null;
  return (
    <>
      <motion.div className="pointer-events-none fixed left-0 top-0 z-[250] h-1.5 w-1.5 rounded-full bg-foreground" style={{ x, y, translateX: "-50%", translateY: "-50%" }} animate={{ opacity: label ? 0 : 1 }} />
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[249] grid place-items-center rounded-full font-mono text-[11px] font-medium uppercase tracking-widest"
        style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: label ? 92 : 34,
          height: label ? 92 : 34,
          backgroundColor: label ? "hsl(14 76% 54%)" : "rgba(0,0,0,0)",
          borderColor: label ? "rgba(0,0,0,0)" : "rgba(20,20,20,0.35)",
          scale: down ? 0.85 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
      >
        <span className="absolute inset-0 rounded-full border" style={{ borderColor: "inherit" }} />
        <AnimatePresence>
          {label && (
            <motion.span initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} className="text-white">
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

/* ── Magnetic wrapper: the child is pulled gently towards the pointer ─────── */
export const Magnetic = ({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 250, damping: 18 }), y = useSpring(0, { stiffness: 250, damping: 18 });
  return (
    <motion.div
      ref={ref}
      className="inline-block"
      style={{ x, y }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onPointerLeave={() => { x.set(0); y.set(0); }}
    >
      {children}
    </motion.div>
  );
};

/* ── ⌘K command palette ─────────────────────────────────────────────────── */
export const openPalette = () => window.dispatchEvent(new Event("open-palette"));

export const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen((o) => !o); }
    };
    const ev = () => setOpen(true);
    window.addEventListener("keydown", key);
    window.addEventListener("open-palette", ev);
    return () => { window.removeEventListener("keydown", key); window.removeEventListener("open-palette", ev); };
  }, []);

  const go = (fn: () => void) => { setOpen(false); setTimeout(fn, 50); };
  const jump = (id: string) => go(() => document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth" }));
  const visit = (url: string) => go(() => window.open(url, "_blank", "noopener,noreferrer"));

  return (
    <CommandDialog open={open} onOpenChange={(o) => { setOpen(o); setCopied(false); }}>
      <CommandInput placeholder="Search projects, sections, links…" />
      <CommandList className="max-h-[420px]">
        <CommandEmpty>Nothing found.</CommandEmpty>
        <CommandGroup heading="Go to">
          {[["work", "Selected work"], ["about", "About"], ["contact", "Contact"]].map(([id, l]) => (
            <CommandItem key={id} onSelect={() => jump(id)}>
              <Hash className="mr-2 h-4 w-4" /> {l}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Projects">
          {projects.map((p) => (
            <CommandItem key={p.slug} value={`${p.title} ${p.stack.join(" ")}`} onSelect={() => visit(p.live ?? p.repo)}>
              {p.featured ? <FileCode2 className="mr-2 h-4 w-4" /> : <Code2 className="mr-2 h-4 w-4" />}
              {p.title}
              <CommandShortcut>{p.live ? "live ↗" : "code ↗"}</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Contact">
          <CommandItem
            onSelect={async () => {
              try { await navigator.clipboard.writeText(profile.email); setCopied(true); } catch { /* ignore */ }
            }}
          >
            <Copy className="mr-2 h-4 w-4" /> {copied ? "Email copied ✓" : "Copy email address"}
          </CommandItem>
          <CommandItem onSelect={() => go(() => (window.location.href = `mailto:${profile.email}`))}>
            <Mail className="mr-2 h-4 w-4" /> Send an email
          </CommandItem>
          <CommandItem onSelect={() => visit(profile.github)}>
            <Github className="mr-2 h-4 w-4" /> GitHub <CommandShortcut>↗</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => visit(profile.linkedin)}>
            <Linkedin className="mr-2 h-4 w-4" /> LinkedIn <CommandShortcut>↗</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

/* ── Live GitHub activity (public API, no token; hides itself on failure) ─── */
interface Repo { name: string; html_url: string; pushed_at: string; language: string | null; fork: boolean }

const ago = (iso: string) => {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  const units: [number, string][] = [[31536000, "year"], [2592000, "month"], [604800, "week"], [86400, "day"], [3600, "hour"], [60, "minute"]];
  for (const [sec, u] of units) if (s >= sec) { const v = Math.floor(s / sec); return `${v} ${u}${v > 1 ? "s" : ""} ago`; }
  return "just now";
};

export const GitHubActivity = () => {
  const [repos, setRepos] = useState<Repo[] | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=pushed&per_page=12`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: Repo[]) => {
        const shown = new Set(projects.map((p) => p.repo.toLowerCase()));
        // only repos that are on this site, so the list matches the projects above
        setRepos(data.filter((r) => !r.fork && shown.has(r.html_url.toLowerCase())).slice(0, 4));
      })
      .catch(() => setRepos([]));
    return () => ctrl.abort();
  }, []);

  if (!repos || repos.length === 0) return null;
  const titleFor = (url: string) => projects.find((p) => p.repo.toLowerCase() === url.toLowerCase())?.title ?? "";

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease }} className="mt-20">
      <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        Live from GitHub · recently pushed
      </div>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {repos.map((r) => (
          <li key={r.name}>
            <a href={r.html_url} target="_blank" rel="noopener noreferrer" data-cursor="Code" className="group flex h-full flex-col rounded-2xl border border-foreground/15 p-5 transition hover:-translate-y-1 hover:border-foreground hover:bg-card">
              <span className="flex items-start justify-between gap-2">
                <span className="font-semibold leading-snug text-foreground">{titleFor(r.html_url)}</span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:rotate-45 group-hover:text-flame" />
              </span>
              <span className="mt-1 font-mono text-[11px] text-muted-foreground">{r.name}</span>
              <span className="mt-auto flex items-center justify-between pt-5 text-xs text-muted-foreground">
                <span>{r.language ?? "—"}</span>
                <span>{ago(r.pushed_at)}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};
