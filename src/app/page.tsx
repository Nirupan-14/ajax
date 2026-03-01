import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import ServicesStrip from '@/components/sections/ServicesStrip';
import AboutSection from '@/components/sections/AboutSection';
import WhySection from '@/components/sections/WhySection';
import GallerySection from '@/components/sections/GallerySection';
import PricingSection from '@/components/sections/PricingSection';
import StatsCounter from '@/components/sections/StatsCounter';
import ReviewsSection from '@/components/sections/ReviewsSection';
import FAQSection from '@/components/sections/FAQSection';
import ContactSection from '@/components/sections/ContactSection';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ServicesStrip />
        <AboutSection />
        <WhySection />
        <GallerySection />
        <PricingSection />
        <StatsCounter />
        <ReviewsSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
