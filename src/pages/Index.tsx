import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import VisionSection from "@/components/VisionSection";
import ContactForm from "@/components/ContactForm";
import FooterSection from "@/components/FooterSection";
import CursorFollower from "@/components/CursorFollower";
import ParticleGrid from "@/components/ParticleGrid";
import ScrollProgress from "@/components/ScrollProgress";
import BackToTop from "@/components/BackToTop";
import SectionDivider from "@/components/SectionDivider";
import NoiseOverlay from "@/components/NoiseOverlay";
import EasterEgg from "@/components/EasterEgg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Full-page animated particle background */}
      <div className="fixed inset-0 z-0">
        <ParticleGrid />
      </div>

      <NoiseOverlay />
      <ScrollProgress />
      <CursorFollower />
      <BackToTop />
      <EasterEgg />

      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <SectionDivider />
        <AboutSection />
        <SectionDivider />
        <SkillsSection />
        <SectionDivider />
        <ProjectsSection />
        <SectionDivider />
        <VisionSection />
        <SectionDivider />
        <ContactForm />
        <SectionDivider />
        <FooterSection />
      </div>
    </div>
  );
};

export default Index;
