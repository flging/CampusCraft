import HeroSection from "@/components/sections/HeroSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import UniversityShowcase from "@/components/sections/UniversityShowcase";
import PreRegisterForm from "@/components/sections/PreRegisterForm";
import FAQSection from "@/components/sections/FAQSection";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <UniversityShowcase />
      <PreRegisterForm />
      <FAQSection />
      <Footer />
    </main>
  );
}
