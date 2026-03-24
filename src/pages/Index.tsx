import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CommandsSection from "@/components/CommandsSection";
import DetectionSection from "@/components/DetectionSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import TryItSection from "@/components/TryItSection";
import TechStackSection from "@/components/TechStackSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <CommandsSection />
      <DetectionSection />
      <HowItWorksSection />
      <TryItSection />
      <TechStackSection />
      <Footer />
    </div>
  );
};

export default Index;
