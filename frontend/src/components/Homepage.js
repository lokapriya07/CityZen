

import HeroSection from './Home/HeroSection';
import AboutSection from './Home/AboutSection';
import HowItWorksSection from './Home/HowItWorksSection';
import LiveDashboard from './Home/LiveDashboard';
import ServicesSection from './Home/ServiceSection';
import TestimonialsSection from './Home/TestimonialsSection';
import Footer from './Home/Footer';
import ScrollToTop from './Home/ScrollToTop';

function HomePage() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <HeroSection />
      <section id="about">
        <AboutSection />
      </section>
      <HowItWorksSection />
      <LiveDashboard />
      <section id="services">
        <ServicesSection />
      </section>
      <section id="community">
        <TestimonialsSection />
      </section>
      <section id="contact">
        <Footer />
      </section>
      <ScrollToTop />
    </div>
  );
}

export default HomePage;


