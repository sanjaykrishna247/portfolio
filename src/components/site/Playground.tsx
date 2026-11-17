import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Eraser, Play, Shuffle } from "lucide-react";
import { SectionTitle } from "./Work";

/* A small, real path-planning demo: the same idea used in the ARCEUX Control console. */

export type Algo = "astar" | "dijkstra";
type Cell = number; // index = r * cols + c

const useCols = () => {
  const [cols, setCols] = useState(30);
  useEffect(() => {
    const set = () => setCols(window.innerWidth < 640 ? 16 : window.innerWidth < 1024 ? 24 : 30);
    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, []);
  return cols;
};

/** Deterministic pseudo-random generator so "Shuffle" mazes are reproducible */
const mulberry32 = (seed: number) => () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

export const search = (algo: Algo, cols: number, rows: number, walls: Set<Cell>, start: Cell, goal: Cell) => {
  const t0 = performance.now();
  const gx = goal % cols, gy = Math.floor(goal / cols);
  const h = (i: Cell) => (algo === "astar" ? Math.abs((i % cols) - gx) + Math.abs(Math.floor(i / cols) - gy) : 0);
  const g = new Map<Cell, number>([[start, 0]]);
  const came = new Map<Cell, Cell>();
  const closed = new Set<Cell>();
  const explored: Cell[] = [];
  // binary heap keyed on f = g + h (ties broken towards larger g)
  const heap: [number, number, Cell][] = [[h(start), 0, start]];
  const push = (n: [number, number, Cell]) => {
    heap.push(n);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[p][0] < n[0] || (heap[p][0] === n[0] && heap[p][1] >= n[1])) break;
      heap[i] = heap[p]; i = p;
    }
    heap[i] = n;
  };
  const pop = () => {
    const top = heap[0], last = heap.pop()!;
    if (heap.length) {
      let i = 0;
      for (;;) {
        const l = 2 * i + 1, r = l + 1;
        let m = i;
        const better = (a: number, b: [number, number, Cell]) => heap[a][0] < b[0] || (heap[a][0] === b[0] && heap[a][1] > b[1]);
        if (l < heap.length && better(l, m === i ? last : heap[m])) m = l;
        if (r < heap.length && better(r, m === i ? last : heap[m])) m = r;
        if (m === i) break;
        heap[i] = heap[m]; i = m;
      }
      heap[i] = last;
    }
    return top;
  };

  let found = false;
  while (heap.length) {
    const [, gc, cur] = pop();
    if (closed.has(cur)) continue;
    closed.add(cur);
    explored.push(cur);
    if (cur === goal) { found = true; break; }
    const c = cur % cols, r = Math.floor(cur / cols);
    for (const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nc = c + dc, nr = r + dr;
      if (nc < 0 || nr < 0 || nc >= cols || nr >= rows) continue;
      const n = nr * cols + nc;
      if (walls.has(n) || closed.has(n)) continue;
      const ng = gc + 1;
      if (ng < (g.get(n) ?? Infinity)) { g.set(n, ng); came.set(n, cur); push([ng + h(n), ng, n]); }
    }
  }
  const path: Cell[] = [];
  if (found) for (let k: Cell | undefined = goal; k !== undefined; k = came.get(k)) path.unshift(k);
  return { explored, path, ms: performance.now() - t0 };
};

const Playground = () => {
  const cols = useCols();
  const rows = cols === 16 ? 14 : 15;
  const start = useMemo(() => Math.floor(rows / 2) * cols + 1, [rows, cols]);
  const goal = useMemo(() => Math.floor(rows / 2) * cols + cols - 2, [rows, cols]);

  const [walls, setWalls] = useState<Set<Cell>>(new Set());
  const [algo, setAlgo] = useState<Algo>("astar");
  const [shownExplored, setShownExplored] = useState<Cell[]>([]);
  const [shownPath, setShownPath] = useState<Cell[]>([]);
  const [stats, setStats] = useState<{ explored: number; path: number; ms: number } | null>(null);
  const [running, setRunning] = useState(false);
  const seed = useRef(7);
  const timer = useRef<number>();
  const drawMode = useRef<"add" | "remove" | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const reset = useCallback(() => {
    window.clearInterval(timer.current);
    setRunning(false);
    setShownExplored([]);
    setShownPath([]);
    setStats(null);
  }, []);

  const shuffle = useCallback(() => {
    reset();
    const rand = mulberry32(seed.current++);
    const w = new Set<Cell>();
    for (let i = 0; i < cols * rows; i++) if (rand() < 0.28 && i !== start && i !== goal) w.add(i);
    setWalls(w);
  }, [cols, rows, start, goal, reset]);

  // start with a maze whenever the grid size changes
  useEffect(() => { shuffle(); }, [cols]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => window.clearInterval(timer.current), []);

  const run = () => {
    reset();
    const res = search(algo, cols, rows, walls, start, goal);
    setRunning(true);
    // on small screens the grid sits below the controls, so bring it into view
    const top = gridRef.current?.getBoundingClientRect().top ?? 0;
    if (window.innerWidth < 1024 && (top < 0 || top > window.innerHeight * 0.6)) gridRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const perTick = Math.max(2, Math.ceil(res.explored.length / 60));
    let i = reduced ? res.explored.length : 0;
    timer.current = window.setInterval(() => {
      i += perTick;
      setShownExplored(res.explored.slice(0, i));
      if (i >= res.explored.length) {
        window.clearInterval(timer.current);
        setShownPath(res.path);
        setStats({ explored: res.explored.length, path: Math.max(0, res.path.length - 1), ms: res.ms });
        setRunning(false);
      }
    }, 16);
  };

  const paint = (i: Cell) => {
    if (i === start || i === goal || !drawMode.current) return;
    setWalls((w) => {
      const n = new Set(w);
      if (drawMode.current === "add") n.add(i);
      else n.delete(i);
      return n;
    });
  };

  const exploredSet = useMemo(() => new Set(shownExplored), [shownExplored]);
  const pathOrder = useMemo(() => new Map(shownPath.map((c, i) => [c, i])), [shownPath]);

  return (
    <section id="playground" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionTitle index="02" title="Playground" note="A live path planner, the same idea behind the ARCEUX Control console. Draw walls, then race A* against Dijkstra." />

        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-serif text-3xl leading-tight text-foreground sm:text-4xl">
              Both find the shortest path. <span className="italic text-primary">A*</span> just looks in far fewer places.
            </p>
            <ol className="mt-6 space-y-2 text-sm text-muted-foreground">
              <li><span className="font-mono text-foreground">1.</span> Click or drag on the grid to draw or erase walls.</li>
              <li><span className="font-mono text-foreground">2.</span> Pick an algorithm and press Run.</li>
              <li><span className="font-mono text-foreground">3.</span> Compare how many cells each one explored.</li>
            </ol>

            <div className="mt-8 inline-flex rounded-full border border-foreground/15 p-1" role="radiogroup" aria-label="Algorithm">
              {(["astar", "dijkstra"] as Algo[]).map((a) => (
                <button
                  key={a}
                  role="radio"
                  aria-checked={algo === a}
                  onClick={() => { setAlgo(a); reset(); }}
                  className={`relative rounded-full px-5 py-2 text-sm font-semibold transition-colors ${algo === a ? "text-background" : "text-foreground/70 hover:text-foreground"}`}
                >
                  {algo === a && <motion.span layoutId="algo" className="absolute inset-0 rounded-full bg-foreground" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                  <span className="relative">{a === "astar" ? "A*" : "Dijkstra"}</span>
                </button>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={run} disabled={running} className="inline-flex items-center gap-2 rounded-full bg-flame px-6 py-3 text-sm font-semibold text-white transition hover:bg-foreground disabled:opacity-60">
                <Play className="h-4 w-4" /> {running ? "Searching…" : "Run"}
              </button>
              <button onClick={shuffle} className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-5 py-3 text-sm font-semibold text-foreground transition hover:border-foreground">
                <Shuffle className="h-4 w-4" /> New maze
              </button>
              <button onClick={() => { reset(); setWalls(new Set()); }} className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-5 py-3 text-sm font-semibold text-foreground transition hover:border-foreground">
                <Eraser className="h-4 w-4" /> Clear
              </button>
            </div>

            <dl className="mt-8 grid grid-cols-3 border-t border-foreground/15 pt-5" aria-live="polite">
              {[
                ["Explored", stats ? String(stats.explored) : "–"],
                ["Path", stats ? (stats.path ? String(stats.path) : "none") : "–"],
                ["Time", stats ? `${stats.ms.toFixed(2)}ms` : "–"],
              ].map(([l, v]) => (
                <div key={l}>
                  <dt className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{l}</dt>
                  <dd className="mt-1 font-serif text-4xl text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-8">
            <div
              ref={gridRef}
              className="grid touch-none select-none gap-[3px] rounded-[22px] bg-[#b45309] p-3 shadow-[0_30px_60px_-35px_rgba(40,25,10,0.5)] sm:p-4"
              style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
              onPointerUp={() => (drawMode.current = null)}
              onPointerLeave={() => (drawMode.current = null)}
              role="application"
              aria-label="Path-finding grid. Click cells to toggle walls."
            >
              {Array.from({ length: cols * rows }).map((_, i) => {
                const isWall = walls.has(i);
                const isStart = i === start, isGoal = i === goal;
                const onPath = pathOrder.has(i);
                const seen = exploredSet.has(i);
                let bg = "rgba(255,255,255,0.10)";
                if (seen) bg = algo === "astar" ? "rgba(254,215,170,0.55)" : "rgba(253,186,116,0.45)";
                if (onPath) bg = "#ffffff";
                if (isWall) bg = "#451a03";
                if (isStart) bg = "#38bdf8";
                if (isGoal) bg = "#141414";
                return (
                  <div
                    key={i}
                    onPointerDown={(e) => {
                      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
                      if (isStart || isGoal || running) return;
                      reset();
                      drawMode.current = isWall ? "remove" : "add";
                      paint(i);
                    }}
                    onPointerEnter={() => paint(i)}
                    className="aspect-square cursor-crosshair rounded-[3px] transition-colors duration-150"
                    style={{ background: bg, transitionDelay: onPath ? `${pathOrder.get(i)! * 12}ms` : "0ms" }}
                  />
                );
              })}
            </div>
            <div className="mt-3 flex flex-wrap gap-5 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-sky-400" /> Start</span>
              <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-[#141414]" /> Goal</span>
              <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-[#451a03]" /> Wall</span>
              <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-orange-200" /> Explored</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Playground;
