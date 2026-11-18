import { useCallback, useState } from "react";
import Hero from "@/components/site/Hero";
import Work from "@/components/site/Work";
import { About, Contact, Marquee, Nav } from "@/components/site/Sections";
import { CommandPalette, Cursor, Preloader } from "@/components/site/Extras";

// Show the intro loader once per browser session
const seenIntro = () => {
  try { return sessionStorage.getItem("intro") === "1"; } catch { return false; }
};

const Index = () => {
  const [ready, setReady] = useState(seenIntro);
  const done = useCallback(() => {
    try { sessionStorage.setItem("intro", "1"); } catch { /* storage blocked */ }
    setReady(true);
  }, []);

  return (
    <div className="grain min-h-screen overflow-x-clip bg-background">
      {!ready && <Preloader onDone={done} />}
      <Cursor />
      <CommandPalette />
      <a href="#work" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-background">
        Skip to projects
      </a>
      {/* The page mounts behind the loader's curtain so the hero animation starts as it lifts */}
      <Nav />
      <main>
        <Hero start={ready} />
        <Marquee />
        <Work />
        <About />
        <Contact />
      </main>
    </div>
  );
};

export default Index;
