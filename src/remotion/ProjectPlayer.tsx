import { useEffect, useRef, type ComponentType } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { AStarConsole, ArceuxRobot, DURATION, DriftChart, FPS, H, MedFollowFlow, NexusGraph, W } from "./compositions";

const bySlug: Record<string, ComponentType> = {
  nexus: NexusGraph,
  medfollow: MedFollowFlow,
  arceux: ArceuxRobot,
  "arceux-control": AStarConsole,
  "dribble-ai": DriftChart,
};

export const hasAnimation = (slug: string) => slug in bySlug;

/** Plays a project's Remotion composition only while it is on screen. */
const ProjectPlayer = ({ slug, label }: { slug: string; label: string }) => {
  const ref = useRef<PlayerRef>(null);
  const box = useRef<HTMLDivElement>(null);

  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const el = box.current;
    if (!el || reduced) return;
    // The player autoplays on its own; this only pauses it while it is off screen to save CPU,
    // and resumes it when it comes back. If the observer never fires, the animation still plays.
    const io = new IntersectionObserver(
      ([e]) => {
        const p = ref.current;
        if (!p) return;
        if (e.isIntersecting) { if (!p.isPlaying()) p.play(); }
        else if (p.isPlaying()) p.pause();
      },
      { threshold: 0, rootMargin: "200px 0px" }, // start just before it scrolls into view
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  const Comp = bySlug[slug];
  if (!Comp) return null;

  return (
    <div ref={box} role="img" aria-label={label} className="overflow-hidden">
      <Player
        ref={ref}
        component={Comp}
        durationInFrames={DURATION}
        fps={FPS}
        compositionWidth={W}
        compositionHeight={H}
        loop
        autoPlay={!reduced}
        // every frame is fully drawn, so frame 0 is a complete scene
        initialFrame={reduced ? 150 : 0}
        controls={false}
        clickToPlay={false}
        doubleClickToFullscreen={false}
        spaceKeyToPlayOrPause={false}
        acknowledgeRemotionLicense
        style={{ width: "100%", aspectRatio: `${W} / ${H}` }}
      />
    </div>
  );
};

export default ProjectPlayer;
