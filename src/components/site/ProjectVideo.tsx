import { useEffect, useRef } from "react";

const base = import.meta.env.BASE_URL;

/**
 * A project animation, rendered from the Remotion compositions in src/remotion to MP4
 * (scripts/render-projects.mjs). A muted, inline <video> autoplays in every browser without
 * a click, and its poster is a fully drawn frame, so the card is never empty.
 */
const ProjectVideo = ({ slug, label }: { slug: string; label: string }) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.pause();
      return;
    }
    // Some browsers (e.g. Low Power Mode) refuse autoplay; retry on the first interaction.
    const tryPlay = () => v.play().catch(() => {});
    tryPlay();
    const events = ["pointerdown", "keydown", "touchstart", "scroll"] as const;
    const once = () => { tryPlay(); events.forEach((e) => window.removeEventListener(e, once)); };
    events.forEach((e) => window.addEventListener(e, once, { passive: true }));
    const onVis = () => (document.hidden ? v.pause() : tryPlay());
    document.addEventListener("visibilitychange", onVis);
    return () => {
      events.forEach((e) => window.removeEventListener(e, once));
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <video
      ref={ref}
      className="block aspect-[800/520] w-full"
      src={`${base}projects/${slug}.mp4`}
      poster={`${base}projects/${slug}.jpg`}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      disablePictureInPicture
      aria-label={label}
    />
  );
};

export default ProjectVideo;
