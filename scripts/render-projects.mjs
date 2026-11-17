// Renders the Remotion project animations (src/remotion/compositions.tsx) to MP4 + poster JPG
// in public/projects/. Needs: `npm run dev` running, playwright + Chrome, and ffmpeg on PATH.
//   node scripts/render-projects.mjs [http://localhost:8080]
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const base = process.argv[2] || "http://localhost:8080";
const out = path.resolve("public/projects");
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 900, height: 600 }, deviceScaleFactor: 1.5 });
await page.goto(`${base}/render.html`, { waitUntil: "networkidle" });
await page.waitForFunction(() => window.__setFrame && document.fonts.status === "loaded");
const meta = await page.evaluate(() => window.__meta);
const stage = page.locator("#stage");

for (const slug of meta.slugs) {
  const dir = mkdtempSync(path.join(tmpdir(), `frames-${slug}-`));
  for (let f = 0; f < meta.duration; f++) {
    await page.evaluate(([s, n]) => window.__setFrame(s, n), [slug, f]);
    await stage.screenshot({ path: path.join(dir, `${String(f).padStart(4, "0")}.png`) });
  }
  // H.264 MP4 that every browser can autoplay (muted, inline); ~1200x780
  execFileSync("ffmpeg", ["-y", "-v", "error", "-framerate", String(meta.fps), "-i", path.join(dir, "%04d.png"),
    "-c:v", "libx264", "-preset", "slow", "-crf", "27", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an",
    path.join(out, `${slug}.mp4`)]);
  // Poster: a fully drawn frame shown instantly (and if a browser refuses to autoplay)
  execFileSync("ffmpeg", ["-y", "-v", "error", "-i", path.join(dir, "0120.png"), "-q:v", "4", path.join(out, `${slug}.jpg`)]);
  rmSync(dir, { recursive: true, force: true });
  console.log(`rendered ${slug}`);
}
await browser.close();
