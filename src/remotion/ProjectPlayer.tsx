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
        if (e.isIntersecting && !p.isPlaying()) p.play();
        else if (!e.isIntersecting && p.isPlaying()) p.pause();
      },
      { threshold: 0.1 },
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
        // start part-way in so the panel is never an empty colour block, even before it plays
        initialFrame={reduced ? 150 : 40}
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
