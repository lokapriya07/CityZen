// src/components/HomePage.js

import HeroSection from "./HeroSection"
import AboutSection from "./AboutSection"
import HowItWorksSection from "./HowItWorksSection"
import LiveDashboard from "./LiveDashboard"
import ServicesSection from "./ServicesSection"
import CommunityImpact from "./CommunityImpact"
import TestimonialsSection from "./TestimonialsSection"
import CallToAction from "./CallToAction"
import Footer from "./Footer"

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <HowItWorksSection />
      <LiveDashboard />
      <ServicesSection />
      <CommunityImpact />
      <TestimonialsSection />
      <CallToAction />
      <Footer />
    </>
  )
}

export default HomePage