import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from './components/HeroSection';
import { StatsSection } from './components/StatsSection';
import { FeaturesSection } from './components/FeaturesSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { PricingSection } from './components/PricingSection';
import { FAQSection } from './components/FAQSection';
import { ContactSection } from './components/ContactSection';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/30">
      <Navbar />
      
      <main className="flex-grow">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}
