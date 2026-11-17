import { motion } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import { projects } from "@/data/portfolio";
// Remotion lives in its own chunk (see vite.config.ts) that downloads in parallel with the page
import ProjectPlayer from "@/remotion/ProjectPlayer";

const ease = [0.22, 1, 0.36, 1] as const;

/** Title that reveals word by word when it scrolls into view */
const RevealTitle = ({ text, className }: { text: string; className?: string }) => (
  <motion.h3
    className={className}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, margin: "0px 0px 200px 0px" }}
    transition={{ staggerChildren: 0.05 }}
    aria-label={text}
  >
    {text.split(" ").map((w, i) => (
      <span key={i} className="mr-[0.25em] inline-block overflow-hidden pb-[0.1em] align-bottom" aria-hidden>
        <motion.span
          className="inline-block"
          variants={{ hidden: { y: "105%", rotate: 4 }, show: { y: 0, rotate: 0 } }}
          transition={{ duration: 0.6, ease }}
        >
          {w}
        </motion.span>
      </span>
    ))}
  </motion.h3>
);

export const SectionTitle = ({ index, title, note }: { index: string; title: string; note?: string }) => (
  <div className="mb-14 flex flex-wrap items-end justify-between gap-4 border-b border-foreground/15 pb-6">
    <h2 className="font-serif text-5xl leading-none text-foreground sm:text-7xl">
      <span className="mr-4 align-top font-mono text-sm tracking-widest text-primary">{index}</span>
      {title}
    </h2>
    {note && <p className="max-w-sm text-sm text-muted-foreground">{note}</p>}
  </div>
);

const Work = () => {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <section id="work" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionTitle index="01" title="Selected work" note="The animations are drawn live in code with Remotion and show what each project does." />

        <div className="space-y-24 sm:space-y-32">
          {featured.map((p, i) => {
            const flip = i % 2 === 1;
            return (
              <article
                key={p.slug}
                className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14"
              >
                <a
                  href={p.live ?? p.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor={p.live ? "Live" : "Code"}
                  className={`group relative block overflow-hidden rounded-[22px] shadow-[0_30px_60px_-35px_rgba(40,25,10,0.5)] lg:col-span-7 ${flip ? "lg:order-2" : ""}`}
                  style={{ background: p.color }}
                  aria-label={`${p.title}: open ${p.live ? "live site" : "source code"}`}
                >
                  <div className="transition-transform duration-700 ease-out group-hover:scale-[1.03]">
                    <ProjectPlayer slug={p.slug} label={`Animated illustration of ${p.title}`} />
                  </div>
                  <span className="absolute right-4 top-4 grid h-11 w-11 scale-75 place-items-center rounded-full bg-white text-foreground opacity-0 transition duration-300 group-hover:scale-100 group-hover:opacity-100">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                </a>

                <div className={`lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
                  <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "0px 0px 200px 0px" }}
                      transition={{ duration: 0.7, ease }}
                      className="font-serif text-4xl normal-case tracking-normal"
                      style={{ color: p.color }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </motion.span>
                    <motion.span
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true, margin: "0px 0px 200px 0px" }}
                      transition={{ duration: 0.8, delay: 0.2, ease }}
                      className="h-px w-8 origin-left bg-foreground/25"
                    />
                    <span>{p.context || p.year}</span>
                  </div>
                  <RevealTitle text={p.title} className="mt-4 font-serif text-4xl leading-[1.02] text-foreground sm:text-5xl" />
                  <p className="mt-4 leading-relaxed text-muted-foreground">{p.description}</p>
                  <ul className="mt-5 space-y-2">
                    {p.highlights.slice(0, 3).map((h) => (
                      <li key={h} className="flex gap-3 text-[15px] leading-relaxed text-foreground/85">
                        <span className="mt-[11px] h-px w-4 shrink-0" style={{ background: p.color }} />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {p.stack.map((t) => (
                      <li key={t} className="rounded-full border border-foreground/15 px-3 py-1 font-mono text-[11px] text-foreground/80">{t}</li>
                    ))}
                  </ul>
                  <div className="mt-7 flex flex-wrap gap-3">
                    {p.live && (
                      <a href={p.live} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90" style={{ background: p.color }}>
                        Live site <ArrowUpRight className="h-4 w-4" />
                      </a>
                    )}
                    <a href={p.repo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-foreground/20 px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-foreground">
                      <Github className="h-4 w-4" /> Source code
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-32">
          <h3 className="font-serif text-4xl text-foreground sm:text-5xl">
            More <span className="italic text-primary">projects</span>
          </h3>
          <div className="mt-10 grid gap-px overflow-hidden rounded-[22px] border border-foreground/15 bg-foreground/15 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p, i) => (
              <motion.a
                key={p.slug}
                href={p.live ?? p.repo}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.6 }}
                data-cursor="Open"
                className="group relative flex flex-col bg-background p-7 transition-colors duration-300 hover:bg-foreground"
              >
                <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground group-hover:text-background/60">
                  <span>{p.year}{p.live ? " · live" : ""}</span>
                  <ArrowUpRight className="h-5 w-5 text-foreground transition group-hover:rotate-45 group-hover:text-flame" />
                </div>
                <h4 className="mt-8 font-serif text-3xl leading-tight text-foreground transition-transform duration-500 group-hover:translate-x-2 group-hover:text-background">{p.title}</h4>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground group-hover:text-background/70">{p.description}</p>
                <p className="mt-6 font-mono text-[11px] text-foreground/70 group-hover:text-flame">{p.stack.join("  /  ")}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Work;
