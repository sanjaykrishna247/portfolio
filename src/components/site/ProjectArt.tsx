// Animated project illustrations, written as plain SVG with SVG's own animation elements
// (<animate>, <animateTransform>, <animateMotion>). They are part of the page itself: no video,
// no player, no JavaScript timers, so they start the moment the page renders, in every browser,
// without a click. Every element's resting value is the finished scene, so a card is never empty,
// and when the visitor prefers reduced motion we simply render that finished scene.
import type { ReactNode } from "react";

const W = 800;
const H = 520;
const DUR = "7s";
const MONO = "'JetBrains Mono', Menlo, monospace";
const SANS = "'Inter', Helvetica, Arial, sans-serif";

/** Looping <animate> on one attribute. `times` must start at 0 and end at 1. */
const A = ({ attr, values, times, dur = DUR, begin = "0s" }: { attr: string; values: (string | number)[]; times: number[]; dur?: string; begin?: string }) => (
  <animate attributeName={attr} values={values.join(";")} keyTimes={times.join(";")} dur={dur} begin={begin} repeatCount="indefinite" calcMode="linear" />
);

/** Looping <animateTransform>. */
const T = ({ type, values, times, dur = DUR, begin = "0s" }: { type: "rotate" | "translate" | "scale"; values: string[]; times: number[]; dur?: string; begin?: string }) => (
  <animateTransform attributeName="transform" type={type} values={values.join(";")} keyTimes={times.join(";")} dur={dur} begin={begin} repeatCount="indefinite" additive="sum" calcMode="linear" />
);

const Frame = ({ bg, label, children, title }: { bg: string; label?: string; title: string; children: ReactNode }) => (
  <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label={title} style={{ background: bg }}>
    {label && (
      <text x={32} y={44} fill="rgba(255,255,255,0.75)" fontFamily={MONO} fontSize={17} letterSpacing={2}>
        {label.toUpperCase()}
      </text>
    )}
    {children}
  </svg>
);

/* ─────────────── 1. NEXUS: dependency graph, blast radius, three agents ─────────────── */

const NODES: [number, number][] = [
  [400, 150], [250, 110], [560, 105], [170, 230], [330, 255], [480, 250], [640, 220],
  [230, 345], [390, 360], [560, 350], [690, 330], [110, 140],
];
const EDGES: [number, number][] = [
  [0, 1], [0, 2], [1, 3], [1, 4], [0, 4], [0, 5], [2, 5], [2, 6], [4, 7], [4, 8], [5, 8], [5, 9], [6, 10], [9, 10], [3, 11], [3, 7],
];
const VULN = 5;
const HOPS = (() => {
  const d = Array(NODES.length).fill(Infinity);
  d[VULN] = 0;
  const q = [VULN];
  while (q.length) {
    const n = q.shift()!;
    for (const [a, b] of EDGES) {
      const m = a === n ? b : b === n ? a : -1;
      if (m >= 0 && d[m] === Infinity) { d[m] = d[n] + 1; q.push(m); }
    }
  }
  return d as number[];
})();

const Nexus = ({ still }: { still: boolean }) => {
  const hot = (hop: number) => 0.2 + hop * 0.06; // when the "blast" reaches this distance (fraction of loop)
  return (
    <Frame bg="#3730a3" label="dependency graph" title="Animated dependency graph: a vulnerable package lights up and the impact spreads, then three AI agents run">
      {EDGES.map(([a, b], i) => {
        const [x1, y1] = NODES[a], [x2, y2] = NODES[b];
        const t = hot(Math.max(HOPS[a], HOPS[b]));
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fdba74" strokeWidth={2.5}>
            {!still && <A attr="stroke" values={["rgba(255,255,255,0.45)", "rgba(255,255,255,0.45)", "#fdba74", "#fdba74", "rgba(255,255,255,0.45)"]} times={[0, t, t + 0.04, 0.86, 0.94]} />}
          </line>
        );
      })}
      {/* data packets travelling towards the vulnerable package */}
      {!still &&
        [[0, 5], [2, 5], [8, 5], [9, 5]].map(([a, b], i) => (
          <circle key={i} r={5} fill="#fff">
            <animateMotion dur="1.8s" begin={`${i * 0.45}s`} repeatCount="indefinite" path={`M${NODES[a][0]},${NODES[a][1]} L${NODES[b][0]},${NODES[b][1]}`} />
            <A attr="opacity" values={[0, 1, 1, 0]} times={[0, 0.15, 0.8, 1]} dur="1.8s" begin={`${i * 0.45}s`} />
          </circle>
        ))}
      {/* blast-radius ripples */}
      {!still &&
        [0, 0.8, 1.6].map((b) => (
          <circle key={b} cx={NODES[VULN][0]} cy={NODES[VULN][1]} r={18} fill="none" stroke="#fb923c" strokeWidth={3} opacity={0}>
            <A attr="r" values={[18, 200]} times={[0, 1]} dur="2.4s" begin={`${b}s`} />
            <A attr="opacity" values={[0.9, 0]} times={[0, 1]} dur="2.4s" begin={`${b}s`} />
          </circle>
        ))}
      {NODES.map(([x, y], i) => {
        const isV = i === VULN;
        const t = hot(HOPS[i]);
        return (
          <circle key={i} cx={x} cy={y} r={isV ? 15 : 11} fill={isV ? "#f97316" : "#fed7aa"}>
            {!still && (isV
              ? <A attr="fill" values={["#ffffff", "#ffffff", "#f97316", "#f97316", "#ffffff"]} times={[0, 0.12, 0.16, 0.88, 0.95]} />
              : <A attr="fill" values={["#ffffff", "#ffffff", "#fed7aa", "#fed7aa", "#ffffff"]} times={[0, t, t + 0.04, 0.86, 0.94]} />)}
            {!still && <A attr="r" values={isV ? [15, 17, 15] : [11, 12.5, 11]} times={[0, 0.5, 1]} dur={`${2 + (i % 4) * 0.3}s`} />}
          </circle>
        );
      })}
      {["Scanner", "Reasoner", "Planner"].map((a, i) => {
        const x = 175 + i * 165;
        const t = 0.5 + i * 0.07;
        return (
          <g key={a}>
            <rect x={x} y={440} width={130} height={44} rx={22} fill="#ffffff">
              {!still && <A attr="fill" values={["rgba(255,255,255,0.14)", "rgba(255,255,255,0.14)", "#ffffff", "#ffffff", "rgba(255,255,255,0.14)"]} times={[0, t, t + 0.03, 0.88, 0.95]} />}
            </rect>
            <text x={x + 65} y={468} textAnchor="middle" fontFamily={SANS} fontWeight={600} fontSize={19} fill="#3730a3">
              {a}
              {!still && <A attr="fill" values={["rgba(255,255,255,0.6)", "rgba(255,255,255,0.6)", "#3730a3", "#3730a3", "rgba(255,255,255,0.6)"]} times={[0, t, t + 0.03, 0.88, 0.95]} />}
            </text>
            {i < 2 && <text x={x + 148} y={469} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize={20}>→</text>}
          </g>
        );
      })}
    </Frame>
  );
};

/* ─────────────── 2. MedFollow: heartbeat, risk scores, outreach ─────────────── */

const ecg = (() => {
  let d = "";
  for (let k = 0; k < 6; k++) {
    const o = k * 200;
    d += `${k ? "L" : "M"}${o},70 L${o + 90},70 L${o + 98},40 L${o + 106},96 L${o + 114},58 L${o + 122},70 L${o + 200},70 `;
  }
  return d;
})();

const PATIENTS = [
  { id: "P-1042", risk: 0.22 },
  { id: "P-1043", risk: 0.86 },
  { id: "P-1044", risk: 0.41 },
  { id: "P-1045", risk: 0.15 },
];

const MedFollow = ({ still }: { still: boolean }) => (
  <Frame bg="#0f766e" title="Animated patient risk dashboard: risk scores fill in, the high-risk patient is flagged, and call, WhatsApp and email reminders go out">
    <g>
      <path d={ecg} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={2.5} />
      {!still && <T type="translate" values={["0 0", "-200 0"]} times={[0, 1]} dur="2s" />}
    </g>
    {PATIENTS.map((p, i) => {
      const y = 120 + i * 88;
      const high = p.risk > 0.7;
      const bar = 364 * p.risk;
      return (
        <g key={p.id}>
          <rect x={40} y={y} width={400} height={74} rx={14} fill={high ? "#fff7ed" : "rgba(255,255,255,0.95)"} />
          {high && (
            <rect x={38.5} y={y - 1.5} width={403} height={77} rx={15} fill="none" stroke="#fb923c" strokeWidth={3}>
              {!still && <A attr="opacity" values={[0, 0, 1, 1, 0]} times={[0, 0.2, 0.24, 0.88, 0.94]} />}
            </rect>
          )}
          <text x={58} y={y + 30} fontFamily={MONO} fontSize={17} fill="#134e4a">{p.id}</text>
          <text x={422} y={y + 30} textAnchor="end" fontFamily={MONO} fontSize={17} fontWeight={600} fill={high ? "#c2410c" : "#134e4a"}>
            {Math.round(p.risk * 100)}% risk
          </text>
          <rect x={58} y={y + 46} width={364} height={8} rx={4} fill="#ccfbf1" />
          <rect x={58} y={y + 46} width={bar} height={8} rx={4} fill={high ? "#f97316" : "#14b8a6"}>
            {!still && <A attr="width" values={[bar * 0.25, bar * 0.25, bar, bar, bar * 0.25]} times={[0, 0.02 + i * 0.02, 0.16 + i * 0.02, 0.9, 1]} />}
          </rect>
        </g>
      );
    })}
    {["Call", "WhatsApp", "Email"].map((c, i) => {
      const y = 150 + i * 74;
      const t = 0.3 + i * 0.07;
      return (
        <g key={c}>
          {!still && <T type="translate" values={["-60 0", "-60 0", "0 0", "0 0"]} times={[0, t, t + 0.05, 1]} />}
          {!still && <A attr="opacity" values={[0, 0, 1, 1, 0]} times={[0, t, t + 0.05, 0.88, 0.94]} />}
          <rect x={480} y={y} width={280} height={58} rx={14} fill="rgba(255,255,255,0.14)" />
          <circle cx={510} cy={y + 29} r={13} fill="#ffffff" stroke="#fff" strokeWidth={2} />
          <path d={`M${503},${y + 29} l5,5 l9,-10`} fill="none" stroke="#0f766e" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
          <text x={536} y={y + 36} fontFamily={SANS} fontWeight={600} fontSize={20} fill="#ffffff">{c} reminder</text>
        </g>
      );
    })}
    <text x={482} y={392} fontFamily={MONO} fontSize={15} fill="rgba(255,255,255,0.75)">
      message written by LLM
      {!still && <A attr="opacity" values={[0, 0, 1, 1, 0]} times={[0, 0.52, 0.58, 0.88, 0.94]} />}
    </text>
  </Frame>
);

/* ─────────────── 3. ARCEUX: robot drives, unfolds its arm, scans ─────────────── */

const Arceux = ({ still }: { still: boolean }) => {
  const gy = 420;
  return (
    <Frame bg="#1f2937" label="autonomous mobile robot" title="Animated robot: it drives to a crate, unfolds its inspection arm and sweeps its LiDAR scanner">
      <line x1={0} y1={gy} x2={W} y2={gy} stroke="rgba(255,255,255,0.25)" strokeWidth={2} />
      <g>
        {!still && <T type="translate" values={["0 0", "-200 0", "-200 0"]} times={[0, 0.4, 1]} />}
        {Array.from({ length: 26 }).map((_, i) => (
          <line key={i} x1={i * 40} y1={gy + 14} x2={i * 40 + 20} y2={gy + 14} stroke="rgba(255,255,255,0.18)" strokeWidth={2} />
        ))}
      </g>
      {/* target crate slides in as the robot "drives" */}
      <g>
        {!still && <T type="translate" values={["240 0", "0 0", "0 0", "0 0"]} times={[0, 0.4, 0.95, 1]} />}
        {!still && <A attr="opacity" values={[0, 1, 1, 0]} times={[0, 0.1, 0.93, 1]} />}
        <rect x={640} y={330} width={90} height={90} rx={6} fill="none" stroke="#f59e0b" strokeWidth={3} />
        <line x1={640} y1={375} x2={730} y2={375} stroke="#f59e0b" strokeWidth={2} />
        <text x={685} y={445} textAnchor="middle" fill="#f59e0b" fontFamily={MONO} fontSize={14}>INSPECT</text>
      </g>
      <g transform="translate(250,0)">
        {/* gentle suspension bob while driving */}
        {!still && <T type="translate" values={["0 0", "0 -3", "0 0", "0 -3", "0 0", "0 0"]} times={[0, 0.1, 0.2, 0.3, 0.4, 1]} />}
        {/* LiDAR cone */}
        <g transform="rotate(0 120 222)">
          {!still && <T type="rotate" values={["0 120 222", "0 120 222", "-25 120 222", "25 120 222", "-25 120 222", "0 120 222", "0 120 222"]} times={[0, 0.5, 0.58, 0.68, 0.78, 0.86, 1]} />}
          {!still && <A attr="opacity" values={[0, 0, 1, 1, 0, 0]} times={[0, 0.46, 0.5, 0.84, 0.88, 1]} />}
          <path d="M120 222 L520 160 L520 284 Z" fill="rgba(56,189,248,0.16)" />
          <line x1={120} y1={222} x2={520} y2={222} stroke="rgba(56,189,248,0.8)" strokeWidth={2} strokeDasharray="6 6" />
        </g>
        <rect x={0} y={270} width={240} height={110} rx={18} fill="#e5e7eb" />
        <rect x={18} y={290} width={110} height={56} rx={8} fill="#111827" />
        <rect x={30} y={302} width={86} height={8} rx={4} fill="#34d399">
          {!still && <A attr="width" values={[30, 86, 60, 86]} times={[0, 0.3, 0.6, 1]} dur="2.2s" />}
        </rect>
        <rect x={30} y={318} width={60} height={8} rx={4} fill="#60a5fa" />
        <rect x={150} y={296} width={70} height={60} rx={8} fill="#cbd5e1" />
        <rect x={112} y={226} width={16} height={46} fill="#9ca3af" />
        <rect x={98} y={208} width={44} height={24} rx={8} fill="#38bdf8" />
        {/* two-joint inspection arm: folded while driving, reaches out to inspect */}
        <g transform="rotate(-25 210 272)">
          {!still && <T type="rotate" values={["-55 210 272", "-55 210 272", "0 210 272", "0 210 272", "-55 210 272", "-55 210 272"]} times={[0, 0.42, 0.52, 0.84, 0.94, 1]} />}
          <rect x={204} y={190} width={14} height={86} rx={7} fill="#f59e0b" />
          <g transform="rotate(30 211 196)">
            {!still && <T type="rotate" values={["-100 211 196", "-100 211 196", "0 211 196", "0 211 196", "-100 211 196", "-100 211 196"]} times={[0, 0.44, 0.55, 0.84, 0.94, 1]} />}
            <rect x={205} y={120} width={12} height={80} rx={6} fill="#fbbf24" />
            <circle cx={211} cy={118} r={10} fill="#fde68a">
              {!still && <A attr="r" values={[10, 10, 13, 10, 13, 10, 10]} times={[0, 0.58, 0.62, 0.66, 0.7, 0.74, 1]} />}
            </circle>
          </g>
          <circle cx={211} cy={196} r={9} fill="#d97706" />
        </g>
        <circle cx={210} cy={272} r={10} fill="#d97706" />
        {[52, 188].map((cx) => (
          <g key={cx}>
            {!still && <T type="rotate" values={[`0 ${cx} 386`, `720 ${cx} 386`, `720 ${cx} 386`]} times={[0, 0.4, 1]} />}
            <circle cx={cx} cy={386} r={32} fill="#111827" />
            <circle cx={cx} cy={386} r={12} fill="#6b7280" />
            <rect x={cx - 3} y={358} width={6} height={18} fill="#6b7280" />
          </g>
        ))}
      </g>
    </Frame>
  );
};

/* ─────────────── 4. ARCEUX Control: a real A* search on a grid ─────────────── */

const COLS = 20;
const ROWS = 11;
const WALLS = new Set<string>([
  ...[2, 3, 4, 5, 6, 7].map((r) => `5,${r}`),
  ...[0, 1, 2, 3, 4, 5].map((r) => `10,${r}`),
  ...[5, 6, 7, 8, 9, 10].map((r) => `14,${r}`),
  ...[1, 2, 3].map((c) => `${c},8`),
  ...[16, 17, 18].map((c) => `${c},3`),
]);
const START: [number, number] = [1, 2];
const GOAL: [number, number] = [18, 8];

const SEARCH = (() => {
  const key = (c: number, r: number) => `${c},${r}`;
  const h = (c: number, r: number) => Math.abs(c - GOAL[0]) + Math.abs(r - GOAL[1]);
  const open = [{ c: START[0], r: START[1], g: 0, f: h(...START) }];
  const came = new Map<string, string>();
  const g = new Map([[key(...START), 0]]);
  const closed = new Set<string>();
  const explored: string[] = [];
  while (open.length) {
    open.sort((a, b) => a.f - b.f || b.g - a.g);
    const cur = open.shift()!;
    const k = key(cur.c, cur.r);
    if (closed.has(k)) continue;
    closed.add(k);
    explored.push(k);
    if (cur.c === GOAL[0] && cur.r === GOAL[1]) break;
    for (const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const c = cur.c + dc, r = cur.r + dr, nk = key(c, r);
      if (c < 0 || r < 0 || c >= COLS || r >= ROWS || WALLS.has(nk) || closed.has(nk)) continue;
      const ng = cur.g + 1;
      if (ng < (g.get(nk) ?? Infinity)) { g.set(nk, ng); came.set(nk, k); open.push({ c, r, g: ng, f: ng + h(c, r) }); }
    }
  }
  const path: [number, number][] = [];
  for (let k: string | undefined = key(...GOAL); k; k = came.get(k)) path.unshift(k.split(",").map(Number) as [number, number]);
  return { explored, path };
})();

const AStar = ({ still }: { still: boolean }) => {
  const cell = 34, ox = (W - COLS * cell) / 2, oy = 92;
  const cx = (c: number) => ox + c * cell + cell / 2;
  const cy = (r: number) => oy + r * cell + cell / 2;
  const order = new Map(SEARCH.explored.map((k, i) => [k, i]));
  const n = SEARCH.explored.length;
  const pathD = SEARCH.path.map(([c, r], i) => `${i ? "L" : "M"}${cx(c)},${cy(r)}`).join(" ");
  const pathLen = (SEARCH.path.length - 1) * cell;
  const [ec, er] = SEARCH.path[SEARCH.path.length - 1];
  const base = "rgba(255,255,255,0.08)", seen = "rgba(255,237,213,0.45)";

  return (
    <Frame bg="#b45309" label="A* path planning" title="Animated A* search: the planner explores the grid, finds the shortest path around walls, and the robot follows it">
      <text x={W - 32} y={44} textAnchor="end" fill="rgba(255,255,255,0.85)" fontFamily={MONO} fontSize={16}>
        explored {n} · path {SEARCH.path.length - 1}
      </text>
      {Array.from({ length: ROWS }).map((_, r) =>
        Array.from({ length: COLS }).map((_, c) => {
          const k = `${c},${r}`;
          const wall = WALLS.has(k);
          const o = order.get(k);
          const t = o === undefined ? 0 : 0.03 + (o / n) * 0.36; // search sweeps across ~2.5s
          return (
            <rect key={k} x={ox + c * cell + 1} y={oy + r * cell + 1} width={cell - 2} height={cell - 2} rx={4} fill={wall ? "#451a03" : o !== undefined ? seen : base}>
              {!still && o !== undefined && <A attr="fill" values={[base, base, seen, seen, base]} times={[0, t, t + 0.015, 0.86 + (o / n) * 0.06, 0.95]} />}
            </rect>
          );
        }),
      )}
      <path d={pathD} fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={pathLen} strokeDashoffset={0}>
        {!still && <A attr="stroke-dashoffset" values={[pathLen, pathLen, 0, 0]} times={[0, 0.4, 0.5, 1]} />}
        {!still && <A attr="opacity" values={[1, 1, 0, 0]} times={[0, 0.9, 0.95, 1]} />}
      </path>
      <rect x={ox + GOAL[0] * cell + 4} y={oy + GOAL[1] * cell + 4} width={cell - 8} height={cell - 8} rx={6} fill="none" stroke="#fff" strokeWidth={3} />
      {still ? (
        <circle cx={cx(ec)} cy={cy(er)} r={12} fill="#38bdf8" stroke="#fff" strokeWidth={3} />
      ) : (
        <circle r={12} fill="#38bdf8" stroke="#fff" strokeWidth={3}>
          <animateMotion dur={DUR} repeatCount="indefinite" path={pathD} keyPoints="0;0;1;1" keyTimes="0;0.52;0.9;1" calcMode="linear" />
        </circle>
      )}
    </Frame>
  );
};

/* ─────────────── 5. Dribble AI: readiness chart with drift detection ─────────────── */

const SCORES = [52, 58, 63, 67, 71, 74, 72, 66, 59, 54, 57, 64];
const THRESH = 60;

const Drift = ({ still }: { still: boolean }) => {
  const x0 = 70, x1 = 520, y0 = 420, y1 = 110;
  const px = (i: number) => x0 + (i / (SCORES.length - 1)) * (x1 - x0);
  const py = (v: number) => y0 - ((v - 40) / 40) * (y0 - y1);
  const pts = SCORES.map((v, i) => `${px(i)},${py(v)}`).join(" ");
  let len = 0;
  for (let i = 1; i < SCORES.length; i++) len += Math.hypot(px(i) - px(i - 1), py(SCORES[i]) - py(SCORES[i - 1]));
  const drawEnd = 0.42;
  const last = SCORES.length - 1;
  const tasks = ["2 mock interviews", "DSA: graphs, 5 problems", "Rest day on Sunday"];

  return (
    <Frame bg="#e4572e" label="placement readiness · 12 weeks" title="Animated readiness chart: the score drops below the drift threshold, an alert fires and a weekly plan appears">
      {[50, 60, 70, 80].map((v) => (
        <text key={v} x={x0 - 16} y={py(v) + 5} textAnchor="end" fill="rgba(255,255,255,0.6)" fontFamily={MONO} fontSize={13}>{v}</text>
      ))}
      <line x1={x0} y1={py(THRESH)} x2={x1} y2={py(THRESH)} stroke="rgba(255,255,255,0.7)" strokeWidth={2} strokeDasharray="8 8" />
      <text x={x1} y={py(THRESH) - 10} textAnchor="end" fill="rgba(255,255,255,0.8)" fontFamily={MONO} fontSize={13}>drift threshold</text>
      <polyline points={pts} fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={0}>
        {!still && <A attr="stroke-dashoffset" values={[len * 0.55, 0, 0, len * 0.55]} times={[0, drawEnd, 0.94, 1]} />}
      </polyline>
      {SCORES.map((v, i) => {
        const t = i < 6 ? 0 : ((i - 5) / 6) * drawEnd;
        return (
          <circle key={i} cx={px(i)} cy={py(v)} r={6} fill={v < THRESH && i > 5 ? "#7c2d12" : "#fff"} stroke="#fff" strokeWidth={2}>
            {!still && i >= 6 && <A attr="opacity" values={[0, 0, 1, 1, 0]} times={[0, t, t + 0.02, 0.94, 1]} />}
          </circle>
        );
      })}
      {/* live pulse on the latest reading */}
      {!still &&
        [0, 0.5].map((b) => (
          <circle key={b} cx={px(last)} cy={py(SCORES[last])} r={8} fill="none" stroke="#fff" strokeWidth={2} opacity={0}>
            <A attr="r" values={[8, 30]} times={[0, 1]} dur="1s" begin={`${b}s`} />
            <A attr="opacity" values={[0.8, 0]} times={[0, 1]} dur="1s" begin={`${b}s`} />
          </circle>
        ))}
      <g>
        {!still && <A attr="opacity" values={[0, 0, 1, 1, 0]} times={[0, 0.3, 0.33, 0.9, 0.95]} />}
        {!still && <T type="translate" values={["0 8", "0 8", "0 0", "0 0"]} times={[0, 0.3, 0.34, 1]} />}
        <rect x={px(8) - 70} y={py(SCORES[8]) + 22} width={150} height={34} rx={10} fill="#7c2d12" />
        <text x={px(8) + 5} y={py(SCORES[8]) + 45} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={16} fill="#fff">⚠ Drift detected</text>
      </g>
      <g>
        {!still && <A attr="opacity" values={[0, 0, 1, 1, 0]} times={[0, 0.44, 0.49, 0.9, 0.95]} />}
        {!still && <T type="translate" values={["0 30", "0 30", "0 0", "0 0"]} times={[0, 0.44, 0.5, 1]} />}
        <rect x={540} y={110} width={232} height={176} rx={18} fill="#fff" />
        <text x={560} y={142} fontFamily={MONO} fontSize={13} letterSpacing={1.5} fill="#c2410c">THIS WEEK'S PLAN</text>
        {tasks.map((t, i) => (
          <g key={t}>
            {!still && <A attr="opacity" values={[0, 0, 1, 1]} times={[0, 0.52 + i * 0.04, 0.55 + i * 0.04, 1]} />}
            <circle cx={566} cy={176 + i * 34} r={4} fill="#e4572e" />
            <text x={580} y={181 + i * 34} fontFamily={SANS} fontSize={15} fill="#1c1917">{t}</text>
          </g>
        ))}
      </g>
    </Frame>
  );
};

/* ───────────────────────────────────────────────────────── */

const bySlug: Record<string, (p: { still: boolean }) => JSX.Element> = {
  nexus: Nexus,
  medfollow: MedFollow,
  arceux: Arceux,
  "arceux-control": AStar,
  "dribble-ai": Drift,
};

// Read synchronously so animations are never mounted at all when reduced motion is requested
const prefersReduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const ProjectArt = ({ slug }: { slug: string }) => {
  const Art = bySlug[slug];
  return Art ? <Art still={prefersReduced()} /> : null;
};

export default ProjectArt;
