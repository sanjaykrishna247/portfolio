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

/** Plays a project's Remotion composition from page load, looping. */
const ProjectPlayer = ({ slug, label }: { slug: string; label: string }) => {
  const ref = useRef<PlayerRef>(null);

  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (reduced) return;
    // Play from the moment the site loads; only pause while the browser tab is hidden.
    ref.current?.play();
    const onVis = () => (document.hidden ? ref.current?.pause() : ref.current?.play());
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [reduced]);

  const Comp = bySlug[slug];
  if (!Comp) return null;

  return (
    <div role="img" aria-label={label} className="overflow-hidden">
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
