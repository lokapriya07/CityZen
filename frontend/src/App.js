import Navigation from "./components/Navigation"
import HeroSection from "./components/HeroSection"
import AboutSection from "./components/AboutSection"
import HowItWorksSection from "./components/HowItWorksSection"
import LiveDashboard from "./components/LiveDashboard"
import ServicesSection from "./components/ServicesSection"
import CommunityImpact from "./components/CommunityImpact"
import TestimonialsSection from "./components/TestimonialsSection"
import CallToAction from "./components/CallToAction"
import Footer from "./components/Footer"

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <HowItWorksSection />
      <LiveDashboard />
      <ServicesSection />
      <CommunityImpact />
      <TestimonialsSection />
      <CallToAction />
      <Footer />
    </div>
  )
}

export default App
