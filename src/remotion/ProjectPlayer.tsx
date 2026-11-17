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

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = box.current;
    if (!el) return;
    if (reduced) {
      ref.current?.seekTo(150);
      return;
    }
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? ref.current?.play() : ref.current?.pause()), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

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
