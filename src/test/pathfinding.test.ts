import { describe, expect, it } from "vitest";
import { search } from "@/components/site/Playground";

// Reference: plain BFS shortest-path length on a 4-connected grid
const bfs = (cols: number, rows: number, walls: Set<number>, s: number, g: number) => {
  const dist = new Map([[s, 0]]);
  const q = [s];
  while (q.length) {
    const cur = q.shift()!;
    if (cur === g) return dist.get(cur)!;
    const c = cur % cols, r = Math.floor(cur / cols);
    for (const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nc = c + dc, nr = r + dr, n = nr * cols + nc;
      if (nc < 0 || nr < 0 || nc >= cols || nr >= rows || walls.has(n) || dist.has(n)) continue;
      dist.set(n, dist.get(cur)! + 1);
      q.push(n);
    }
  }
  return -1;
};

describe("path planner", () => {
  it("A* and Dijkstra both return optimal paths on 300 random grids", () => {
    let seed = 1;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let t = 0; t < 300; t++) {
      const cols = 20, rows = 12, s = 6 * cols + 1, g = 6 * cols + 18;
      const walls = new Set<number>();
      for (let i = 0; i < cols * rows; i++) if (rand() < 0.3 && i !== s && i !== g) walls.add(i);
      const want = bfs(cols, rows, walls, s, g);
      for (const algo of ["astar", "dijkstra"] as const) {
        const { path } = search(algo, cols, rows, walls, s, g);
        expect(path.length ? path.length - 1 : -1).toBe(want);
        // path must be contiguous and avoid walls
        for (let i = 1; i < path.length; i++) {
          const a = path[i - 1], b = path[i];
          expect(Math.abs((a % cols) - (b % cols)) + Math.abs(Math.floor(a / cols) - Math.floor(b / cols))).toBe(1);
          expect(walls.has(b)).toBe(false);
        }
      }
    }
  });

  it("A* explores no more cells than Dijkstra on an open grid", () => {
    const a = search("astar", 30, 15, new Set(), 7 * 30 + 1, 7 * 30 + 28);
    const d = search("dijkstra", 30, 15, new Set(), 7 * 30 + 1, 7 * 30 + 28);
    expect(a.explored.length).toBeLessThan(d.explored.length);
  });
});
