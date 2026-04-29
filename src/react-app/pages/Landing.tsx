import Navbar from "@/react-app/components/landing/Navbar";
import Hero from "@/react-app/components/landing/Hero";
import LogoMarquee from "@/react-app/components/landing/LogoMarquee";
import Problem from "@/react-app/components/landing/Problem";
import Solution from "@/react-app/components/landing/Solution";
import Features from "@/react-app/components/landing/Features";
import HowItWorks from "@/react-app/components/landing/HowItWorks";
import ThreatRadar from "@/react-app/components/landing/ThreatRadar";
import Security from "@/react-app/components/landing/Security";
import Pricing from "@/react-app/components/landing/Pricing";
import Testimonials from "@/react-app/components/landing/Testimonials";
import AttackMap from "@/react-app/components/landing/AttackMap";
import Footer from "@/react-app/components/landing/Footer";
import StickyMobileCTA from "@/react-app/components/landing/StickyMobileCTA";

export function Landing() {
  return (
    <div data-testid="landing-page" className="relative min-h-screen overflow-x-hidden text-[#E0D4FF]">
      <Navbar />
      <main>
        <Hero />
        <LogoMarquee />
        <Problem />
        <Solution />
        <Features />
        <HowItWorks />
        <ThreatRadar />
        <Security />
        <Pricing />
        <Testimonials />
        <AttackMap />
      </main>
      <Footer />
      <StickyMobileCTA />
    </div>
  );
}
