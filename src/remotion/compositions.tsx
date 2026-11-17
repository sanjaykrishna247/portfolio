// Remotion compositions used as live, code-drawn illustrations for each featured project.
// Everything is deterministic (no Math.random) so every loop looks the same.
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const W = 800;
export const H = 520;
export const FPS = 30;
export const DURATION = 210; // 7s loop

const MONO = "'JetBrains Mono', Menlo, monospace";
const SANS = "'Inter', Helvetica, Arial, sans-serif";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
/** fade the whole scene out at the end so the loop restarts cleanly */
const useLoopFade = () => {
  const f = useCurrentFrame();
  return interpolate(f, [0, 4, DURATION - 14, DURATION - 1], [0, 1, 1, 0], clamp);
};

const Label = ({ children, color = "rgba(255,255,255,0.75)" }: { children: string; color?: string }) => (
  <div style={{ position: "absolute", left: 32, top: 26, fontFamily: MONO, fontSize: 17, letterSpacing: 2, textTransform: "uppercase", color }}>{children}</div>
);

/* ───────────────── 1. NEXUS — dependency graph + blast radius + agents ───────────────── */

const NODES: [number, number][] = [
  [400, 150], [250, 110], [560, 105], [170, 230], [330, 255], [480, 250], [640, 220],
  [230, 345], [390, 360], [560, 350], [690, 330], [110, 140],
];
const EDGES: [number, number][] = [
  [0, 1], [0, 2], [1, 3], [1, 4], [0, 4], [0, 5], [2, 5], [2, 6], [4, 7], [4, 8], [5, 8], [5, 9], [6, 10], [9, 10], [3, 11], [3, 7],
];
const VULN = 5;
const hops = (() => {
  // BFS distance from the vulnerable node → drives the "blast radius" colouring
  const d = Array(NODES.length).fill(Infinity);
  d[VULN] = 0;
  const q = [VULN];
  while (q.length) {
    const n = q.shift()!;
    EDGES.forEach(([a, b]) => {
      const m = a === n ? b : b === n ? a : -1;
      if (m >= 0 && d[m] === Infinity) { d[m] = d[n] + 1; q.push(m); }
    });
  }
  return d;
})();

export const NexusGraph = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fade = useLoopFade();
  const agents = ["Scanner", "Reasoner", "Planner"];

  return (
    <AbsoluteFill style={{ background: "#3730a3", opacity: fade }}>
      <Label>dependency graph</Label>
      <svg width={W} height={H} style={{ position: "absolute" }}>
        {EDGES.map(([a, b], i) => {
          const [x1, y1] = NODES[a];
          const [x2, y2] = NODES[b];
          const len = Math.hypot(x2 - x1, y2 - y1);
          const p = interpolate(f, [3 + i * 0.8, 14 + i * 0.8], [len, 0], clamp);
          const hot = f > 45 && Math.max(hops[a], hops[b]) <= 1 + Math.floor((f - 45) / 14);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={hot ? "#fdba74" : "rgba(255,255,255,0.45)"} strokeWidth={hot ? 3 : 2} strokeDasharray={len} strokeDashoffset={p} />;
        })}
        {f > 40 &&
          [0, 1, 2].map((r) => {
            const t = (f - 40 - r * 14) / 50;
            if (t < 0 || t > 1) return null;
            return <circle key={r} cx={NODES[VULN][0]} cy={NODES[VULN][1]} r={20 + t * 190} fill="none" stroke="#fb923c" strokeWidth={3} opacity={1 - t} />;
          })}
        {NODES.map(([x, y], i) => {
          const s = spring({ frame: f - i * 1, fps, config: { damping: 12 } });
          const reached = f > 45 && hops[i] <= Math.floor((f - 45) / 14);
          const fill = i === VULN && f > 36 ? "#f97316" : reached ? "#fed7aa" : "#ffffff";
          return <circle key={i} cx={x} cy={y} r={(i === VULN ? 15 : 11) * s} fill={fill} />;
        })}
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, display: "flex", justifyContent: "center", gap: 14, alignItems: "center" }}>
        {agents.map((a, i) => {
          const on = f > 80 + i * 14;
          const s = spring({ frame: f - (80 + i * 14), fps, config: { damping: 14 } });
          return (
            <div key={a} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 20, padding: "10px 20px", borderRadius: 999, background: on ? "#fff" : "rgba(255,255,255,0.12)", color: on ? "#3730a3" : "rgba(255,255,255,0.6)", transform: `scale(${0.9 + 0.1 * Math.min(1, s)})` }}>
                {a}
              </div>
              {i < 2 && <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 22 }}>→</div>}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ───────────────── 2. MedFollow — risk scoring + outreach ───────────────── */

const PATIENTS = [
  { id: "P-1042", risk: 0.22 },
  { id: "P-1043", risk: 0.86 },
  { id: "P-1044", risk: 0.41 },
  { id: "P-1045", risk: 0.15 },
];

export const MedFollowFlow = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fade = useLoopFade();
  const channels = ["Call", "WhatsApp", "Email"];

  // heartbeat line
  const pts: string[] = [];
  for (let x = 0; x <= W; x += 8) {
    const phase = (x + f * 6) % 200;
    const y = phase > 90 && phase < 100 ? 40 : phase >= 100 && phase < 110 ? 92 : phase >= 110 && phase < 118 ? 58 : 70;
    pts.push(`${x},${y}`);
  }

  return (
    <AbsoluteFill style={{ background: "#0f766e", opacity: fade }}>
      <svg width={W} height={110} style={{ position: "absolute", top: 0 }}>
        <polyline points={pts.join(" ")} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={2.5} />
      </svg>
      <div style={{ position: "absolute", left: 40, top: 120, width: 400, display: "flex", flexDirection: "column", gap: 14 }}>
        {PATIENTS.map((p, i) => {
          const s = spring({ frame: f - 1 - i * 3, fps, config: { damping: 16 } });
          const w = interpolate(f, [6 + i * 3, 36 + i * 3], [0, p.risk], { ...clamp, easing: Easing.out(Easing.cubic) });
          const high = p.risk > 0.7 && f > 42;
          return (
            <div key={p.id} style={{ background: high ? "#fff7ed" : "rgba(255,255,255,0.95)", borderRadius: 14, padding: "14px 18px", transform: `translateX(${(1 - s) * -40}px)`, opacity: s, outline: high ? "3px solid #fb923c" : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 17, color: "#134e4a" }}>
                <span>{p.id}</span>
                <span style={{ color: high ? "#c2410c" : "#134e4a", fontWeight: 600 }}>{Math.round(w * 100)}% risk</span>
              </div>
              <div style={{ marginTop: 10, height: 8, borderRadius: 8, background: "#ccfbf1" }}>
                <div style={{ width: `${w * 100}%`, height: "100%", borderRadius: 8, background: high ? "#f97316" : "#14b8a6" }} />
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", right: 40, top: 150, width: 270, display: "flex", flexDirection: "column", gap: 16 }}>
        {channels.map((c, i) => {
          const start = 52 + i * 12;
          const s = spring({ frame: f - start, fps, config: { damping: 13 } });
          const done = f > start + 15;
          return (
            <div key={c} style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: SANS, fontSize: 20, fontWeight: 600, color: "#fff", background: "rgba(255,255,255,0.14)", borderRadius: 14, padding: "14px 18px", transform: `translateX(${(1 - s) * -160}px)`, opacity: Math.min(1, s) }}>
              <span style={{ display: "grid", placeItems: "center", width: 28, height: 28, borderRadius: 99, background: done ? "#fff" : "transparent", border: "2px solid #fff", color: "#0f766e", fontSize: 16 }}>{done ? "✓" : ""}</span>
              {c} reminder
            </div>
          );
        })}
        <div style={{ fontFamily: MONO, fontSize: 15, color: "rgba(255,255,255,0.75)", opacity: interpolate(f, [95, 108], [0, 1], clamp) }}>
          message written by LLM
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ───────────────── 3. ARCEUX — robot drives in, unfolds arm, LiDAR sweeps ───────────────── */

export const ArceuxRobot = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fade = useLoopFade();
  const x = interpolate(f, [0, 32], [-260, 250], { ...clamp, easing: Easing.out(Easing.cubic) });
  const wheelRot = x * 1.6;
  const arm = spring({ frame: f - 30, fps, config: { damping: 14, mass: 1.2 } });
  const sweep = f > 50 ? Math.sin((f - 50) / 10) * 35 : 0;
  const lidarOn = interpolate(f, [46, 54], [0, 1], clamp);
  const groundY = 420;

  return (
    <AbsoluteFill style={{ background: "#1f2937", opacity: fade }}>
      <Label>autonomous mobile robot</Label>
      <svg width={W} height={H} style={{ position: "absolute" }}>
        {/* ground */}
        <line x1={0} y1={groundY} x2={W} y2={groundY} stroke="rgba(255,255,255,0.25)" strokeWidth={2} />
        {Array.from({ length: 22 }).map((_, i) => (
          <line key={i} x1={((i * 40 - x * 0.4) % 880 + 880) % 880 - 40} y1={groundY + 14} x2={((i * 40 - x * 0.4) % 880 + 880) % 880 - 20} y2={groundY + 14} stroke="rgba(255,255,255,0.15)" strokeWidth={2} />
        ))}
        {/* target crate */}
        <g opacity={interpolate(f, [10, 24], [0, 1], clamp)}>
          <rect x={640} y={330} width={90} height={90} rx={6} fill="none" stroke="#f59e0b" strokeWidth={3} />
          <line x1={640} y1={375} x2={730} y2={375} stroke="#f59e0b" strokeWidth={2} />
          <text x={685} y={445} textAnchor="middle" fill="#f59e0b" fontFamily={MONO} fontSize={14}>INSPECT</text>
        </g>
        <g transform={`translate(${x},0)`}>
          {/* LiDAR cone */}
          <g transform={`rotate(${sweep} 120 222)`} opacity={lidarOn}>
            <path d="M120 222 L520 160 L520 284 Z" fill="rgba(56,189,248,0.16)" />
            <line x1={120} y1={222} x2={520} y2={222} stroke="rgba(56,189,248,0.8)" strokeWidth={2} strokeDasharray="6 6" />
          </g>
          {/* body */}
          <rect x={0} y={270} width={240} height={110} rx={18} fill="#e5e7eb" />
          <rect x={18} y={290} width={110} height={56} rx={8} fill="#111827" />
          <rect x={30} y={302} width={86} height={8} rx={4} fill="#34d399" />
          <rect x={30} y={318} width={60} height={8} rx={4} fill="#60a5fa" />
          <rect x={150} y={296} width={70} height={60} rx={8} fill="#cbd5e1" />
          {/* mast + lidar */}
          <rect x={112} y={226} width={16} height={46} fill="#9ca3af" />
          <rect x={98} y={208} width={44} height={24} rx={8} fill="#38bdf8" />
          {/* arm */}
          <g transform={`rotate(${-80 + 55 * arm} 210 272)`}>
            <rect x={204} y={190} width={14} height={86} rx={7} fill="#f59e0b" />
            <g transform={`rotate(${-70 + 100 * arm} 211 196)`}>
              <rect x={205} y={120} width={12} height={80} rx={6} fill="#fbbf24" />
              <circle cx={211} cy={118} r={10} fill="#fde68a" />
            </g>
            <circle cx={211} cy={196} r={9} fill="#d97706" />
          </g>
          <circle cx={210} cy={272} r={10} fill="#d97706" />
          {/* wheels */}
          {[52, 188].map((cx) => (
            <g key={cx} transform={`rotate(${wheelRot} ${cx} 386)`}>
              <circle cx={cx} cy={386} r={32} fill="#111827" />
              <circle cx={cx} cy={386} r={12} fill="#6b7280" />
              <rect x={cx - 3} y={358} width={6} height={18} fill="#6b7280" />
            </g>
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/* ───────────────── 4. ARCEUX Control — real A* on a grid ───────────────── */

const COLS = 20;
const ROWS = 11;
const WALLS = new Set<string>([
  ...[2, 3, 4, 5, 6, 7].map((r) => `5,${r}`),
  ...[0, 1, 2, 3, 4, 5].map((r) => `10,${r}`),
  ...[5, 6, 7, 8, 9, 10].map((r) => `14,${r}`),
  ...[1, 2, 3].map((c) => `${c},8`),
  ...[16, 17, 18].map((c) => `${c},3`),
]);
const START = [1, 2];
const GOAL = [18, 8];

const aStar = () => {
  const key = (c: number, r: number) => `${c},${r}`;
  const h = (c: number, r: number) => Math.abs(c - GOAL[0]) + Math.abs(r - GOAL[1]);
  const open: { c: number; r: number; g: number; f: number }[] = [{ c: START[0], r: START[1], g: 0, f: h(START[0], START[1]) }];
  const came = new Map<string, string>();
  const g = new Map<string, number>([[key(START[0], START[1]), 0]]);
  const explored: string[] = [];
  const closed = new Set<string>();
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
      if (ng < (g.get(nk) ?? Infinity)) {
        g.set(nk, ng);
        came.set(nk, k);
        open.push({ c, r, g: ng, f: ng + h(c, r) });
      }
    }
  }
  const path: [number, number][] = [];
  let k: string | undefined = key(GOAL[0], GOAL[1]);
  while (k) {
    const [c, r] = k.split(",").map(Number);
    path.unshift([c, r]);
    k = came.get(k);
  }
  return { explored, path };
};
const SEARCH = aStar();

export const AStarConsole = () => {
  const f = useCurrentFrame();
  const fade = useLoopFade();
  const cell = 34;
  const ox = (W - COLS * cell) / 2;
  const oy = 92;
  const exploredCount = Math.floor(interpolate(f, [4, 50], [0, SEARCH.explored.length], clamp));
  const exploredSet = new Set(SEARCH.explored.slice(0, exploredCount));
  const pathLen = interpolate(f, [52, 70], [0, SEARCH.path.length], clamp);
  const pos = interpolate(f, [72, 165], [0, SEARCH.path.length - 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const i0 = Math.floor(pos), i1 = Math.min(SEARCH.path.length - 1, i0 + 1), t = pos - i0;
  const rx = ox + (SEARCH.path[i0][0] * (1 - t) + SEARCH.path[i1][0] * t) * cell + cell / 2;
  const ry = oy + (SEARCH.path[i0][1] * (1 - t) + SEARCH.path[i1][1] * t) * cell + cell / 2;
  const pathPts = SEARCH.path.slice(0, Math.max(1, Math.ceil(pathLen))).map(([c, r]) => `${ox + c * cell + cell / 2},${oy + r * cell + cell / 2}`).join(" ");

  return (
    <AbsoluteFill style={{ background: "#b45309", opacity: fade }}>
      <Label>A* path planning</Label>
      <div style={{ position: "absolute", right: 32, top: 24, fontFamily: MONO, fontSize: 16, color: "rgba(255,255,255,0.85)" }}>
        explored {exploredCount} · path {SEARCH.path.length - 1}
      </div>
      <svg width={W} height={H} style={{ position: "absolute" }}>
        {Array.from({ length: ROWS }).map((_, r) =>
          Array.from({ length: COLS }).map((_, c) => {
            const k = `${c},${r}`;
            const wall = WALLS.has(k);
            return <rect key={k} x={ox + c * cell + 1} y={oy + r * cell + 1} width={cell - 2} height={cell - 2} rx={4} fill={wall ? "#451a03" : exploredSet.has(k) ? "rgba(255,237,213,0.45)" : "rgba(255,255,255,0.08)"} />;
          }),
        )}
        <polyline points={pathPts} fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
        <rect x={ox + GOAL[0] * cell + 4} y={oy + GOAL[1] * cell + 4} width={cell - 8} height={cell - 8} rx={6} fill="none" stroke="#fff" strokeWidth={3} />
        <circle cx={rx} cy={ry} r={12} fill="#38bdf8" stroke="#fff" strokeWidth={3} />
      </svg>
    </AbsoluteFill>
  );
};

/* ───────────────── 5. Dribble AI — readiness score with drift detection ───────────────── */

const SCORES = [52, 58, 63, 67, 71, 74, 72, 66, 59, 54, 57, 64];
const THRESH = 60;

export const DriftChart = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fade = useLoopFade();
  const x0 = 70, x1 = 520, y0 = 420, y1 = 110;
  const px = (i: number) => x0 + (i / (SCORES.length - 1)) * (x1 - x0);
  const py = (v: number) => y0 - ((v - 40) / 40) * (y0 - y1);
  const shown = interpolate(f, [3, 60], [1, SCORES.length], clamp);
  const n = Math.floor(shown);
  const pts = SCORES.slice(0, n).map((v, i) => `${px(i)},${py(v)}`);
  if (n < SCORES.length) {
    const t = shown - n;
    pts.push(`${px(n - 1) + (px(n) - px(n - 1)) * t},${py(SCORES[n - 1]) + (py(SCORES[n]) - py(SCORES[n - 1])) * t}`);
  }
  const crossed = shown > 8.6;
  const alert = spring({ frame: f - 46, fps, config: { damping: 11 } });
  const plan = spring({ frame: f - 70, fps, config: { damping: 15 } });
  const tasks = ["2 mock interviews", "DSA: graphs, 5 problems", "Rest day on Sunday"];

  return (
    <AbsoluteFill style={{ background: "#e4572e", opacity: fade }}>
      <Label>placement readiness · 12 weeks</Label>
      <svg width={W} height={H} style={{ position: "absolute" }}>
        {[50, 60, 70, 80].map((v) => (
          <text key={v} x={x0 - 16} y={py(v) + 5} textAnchor="end" fill="rgba(255,255,255,0.6)" fontFamily={MONO} fontSize={13}>{v}</text>
        ))}
        <line x1={x0} y1={py(THRESH)} x2={x1} y2={py(THRESH)} stroke="rgba(255,255,255,0.7)" strokeWidth={2} strokeDasharray="8 8" />
        <text x={x1} y={py(THRESH) - 10} textAnchor="end" fill="rgba(255,255,255,0.8)" fontFamily={MONO} fontSize={13}>drift threshold</text>
        <polyline points={pts.join(" ")} fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
        {SCORES.slice(0, n).map((v, i) => (
          <circle key={i} cx={px(i)} cy={py(v)} r={6} fill={v < THRESH && i > 5 ? "#7c2d12" : "#fff"} stroke="#fff" strokeWidth={2} />
        ))}
      </svg>
      {crossed && (
        <div style={{ position: "absolute", left: px(8) - 70, top: py(SCORES[8]) + 22, transform: `scale(${alert})`, background: "#7c2d12", color: "#fff", fontFamily: SANS, fontWeight: 700, fontSize: 17, padding: "8px 14px", borderRadius: 10 }}>
          ⚠ Drift detected
        </div>
      )}
      <div style={{ position: "absolute", right: 30, top: 110, width: 230, background: "#fff", borderRadius: 18, padding: 20, transform: `translateY(${(1 - plan) * 40}px)`, opacity: Math.min(1, Math.max(0, plan)) }}>
        <div style={{ fontFamily: MONO, fontSize: 13, color: "#c2410c", letterSpacing: 1.5 }}>THIS WEEK'S PLAN</div>
        {tasks.map((t, i) => (
          <div key={t} style={{ marginTop: 14, display: "flex", gap: 10, fontFamily: SANS, fontSize: 16, color: "#1c1917", opacity: interpolate(f, [82 + i * 8, 92 + i * 8], [0, 1], clamp) }}>
            <span style={{ color: "#e4572e" }}>●</span>
            {t}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
