import { useState } from "react";
import { motion } from "framer-motion";
import { Download, ExternalLink, Eye, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { profile } from "@/data/portfolio";
import { SectionTitle } from "./Work";

const base = import.meta.env.BASE_URL;
const ease = [0.22, 1, 0.36, 1] as const;
export const RESUME_URL = `${base}${profile.resume}`;
const DOWNLOAD_NAME = "Sanjay-Krishna-K-Resume.pdf";

/** Opens the résumé: an in-page viewer on larger screens, the browser's PDF viewer on phones
 *  (mobile browsers can't show a PDF inside a page). */
export const openResume = (showDialog: () => void) => {
  if (window.matchMedia("(min-width: 768px)").matches) showDialog();
  else window.open(RESUME_URL, "_blank", "noopener,noreferrer");
};

const highlights = [
  { k: "Education", v: "B.E. Computer Science & Engineering, SKCET · 2024 – 2028" },
  { k: "Internship", v: "AI Development Intern, Aparajitha Software Services · May – Jun 2026" },
  { k: "Focus", v: "AI agents, RAG pipelines, ML and full-stack (FastAPI + React)" },
];

const Resume = () => {
  const [open, setOpen] = useState(false);
  if (!profile.resume) return null;

  return (
    <section id="resume" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionTitle index="03" title="Résumé" note="One page, PDF. View it right here or download a copy." />

        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-serif text-4xl leading-[1.1] text-foreground sm:text-5xl">
              Everything on <span className="italic text-primary">one page.</span>
            </p>
            <dl className="mt-8">
              {highlights.map((h) => (
                <div key={h.k} className="grid grid-cols-[110px_1fr] gap-4 border-t border-foreground/15 py-4">
                  <dt className="pt-0.5 font-mono text-xs uppercase tracking-widest text-muted-foreground">{h.k}</dt>
                  <dd className="text-foreground">{h.v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => openResume(() => setOpen(true))}
                className="inline-flex items-center gap-2.5 rounded-full bg-foreground px-7 py-4 text-base font-semibold text-background transition hover:bg-flame"
              >
                <Eye className="h-5 w-5" /> View résumé
              </button>
              <a
                href={RESUME_URL}
                download={DOWNLOAD_NAME}
                className="inline-flex items-center gap-2.5 rounded-full border-2 border-foreground/25 bg-card px-7 py-4 text-base font-semibold text-foreground transition hover:border-foreground"
              >
                <Download className="h-5 w-5" /> Download PDF
              </a>
            </div>
          </div>

          {/* Preview: a sheet of paper on a small stack; click to open */}
          <motion.button
            type="button"
            onClick={() => openResume(() => setOpen(true))}
            data-cursor="View"
            aria-label="Open résumé"
            initial={{ opacity: 0, y: 40, rotate: 2 }}
            whileInView={{ opacity: 1, y: 0, rotate: 1.5 }}
            viewport={{ once: true, margin: "0px 0px 200px 0px" }}
            transition={{ duration: 0.8, ease }}
            className="group relative mx-auto block w-full max-w-xl text-left lg:col-span-7"
          >
            <span className="absolute inset-0 translate-x-3 translate-y-3 rotate-[2deg] rounded-2xl bg-foreground/10" aria-hidden />
            <span className="absolute inset-0 translate-x-1.5 translate-y-1.5 rotate-[-1.5deg] rounded-2xl bg-card shadow-sm" aria-hidden />
            <span className="relative block overflow-hidden rounded-2xl border border-foreground/10 bg-white shadow-[0_30px_60px_-30px_rgba(40,25,10,0.5)] transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-[-1.5deg]">
              <img
                src={`${base}resume-preview.jpg`}
                alt="Preview of Sanjay Krishna K's résumé"
                width={1004}
                height={1300}
                loading="lazy"
                className="block w-full"
              />
              <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-gradient-to-t from-foreground/85 to-transparent pb-6 pt-24 text-sm font-semibold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                <FileText className="h-4 w-4" /> Click to open the full PDF
              </span>
            </span>
          </motion.button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex h-[92vh] max-w-5xl flex-col gap-0 overflow-hidden rounded-2xl p-0">
          <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-3 pr-14">
            <div>
              <DialogTitle className="font-serif text-2xl">Résumé</DialogTitle>
              <DialogDescription className="text-xs">{profile.name} · PDF</DialogDescription>
            </div>
            <div className="flex gap-2">
              <a href={RESUME_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-foreground/20 px-4 py-2 text-sm font-semibold transition hover:border-foreground">
                <ExternalLink className="h-4 w-4" /> New tab
              </a>
              <a href={RESUME_URL} download={DOWNLOAD_NAME} className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:bg-flame">
                <Download className="h-4 w-4" /> Download
              </a>
            </div>
          </div>
          <iframe src={`${RESUME_URL}#view=FitH`} title="Résumé PDF" className="h-full w-full flex-1 bg-muted" />
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Resume;
