// Dev-only page (render.html) that shows one frame of one composition at a time.
// scripts/render-projects.mjs drives it with window.__setFrame and screenshots #stage.
import { useState, type ComponentType } from "react";
import { createRoot } from "react-dom/client";
import { Thumbnail } from "@remotion/player";
import { AStarConsole, ArceuxRobot, DURATION, DriftChart, FPS, H, MedFollowFlow, NexusGraph, W } from "./compositions";

const bySlug: Record<string, ComponentType> = {
  nexus: NexusGraph,
  medfollow: MedFollowFlow,
  arceux: ArceuxRobot,
  "arceux-control": AStarConsole,
  "dribble-ai": DriftChart,
};

declare global {
  interface Window { __setFrame?: (slug: string, frame: number) => Promise<void>; __meta?: object }
}

const App = () => {
  const [state, setState] = useState({ slug: "nexus", frame: 0 });
  window.__meta = { slugs: Object.keys(bySlug), duration: DURATION, fps: FPS, width: W, height: H };
  window.__setFrame = (slug, frame) =>
    new Promise((resolve) => {
      setState({ slug, frame });
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });
  return (
    <div id="stage" style={{ width: W, height: H }}>
      <Thumbnail
        component={bySlug[state.slug]}
        compositionWidth={W}
        compositionHeight={H}
        frameToDisplay={state.frame}
        durationInFrames={DURATION}
        fps={FPS}
        style={{ width: W, height: H }}
      />
    </div>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
