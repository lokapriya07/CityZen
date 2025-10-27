// // src/components/HomePage.js

// import HeroSection from "./HeroSection"
// import AboutSection from "./AboutSection"
// import HowItWorksSection from "./HowItWorksSection"
// import LiveDashboard from "./LiveDashboard"
// import ServicesSection from "./ServicesSection"
// import CommunityImpact from "./CommunityImpact"
// import TestimonialsSection from "./TestimonialsSection"
// import CallToAction from "./CallToAction"
// import Footer from "./Footer"

// const HomePage = () => {
//   return (
//     <>
//       <HeroSection />
//       <AboutSection />
//       <HowItWorksSection />
//       <LiveDashboard />
//       <ServicesSection />
//       <CommunityImpact />
//       <TestimonialsSection />
//       <CallToAction />
//       <Footer />
//     </>
//   )
// }

// export default HomePage

import HeroSection from './Home/HeroSection';
import AboutSection from './Home/AboutSection';
import HowItWorksSection from './Home/HowItWorksSection';
import LiveDashboard from './Home/LiveDashboard';
import ServicesSection from './Home/ServiceSection';
import TestimonialsSection from './Home/TestimonialsSection';
import Footer from './Home/Footer';
import ScrollToTop from './Home/ScrollToTop';

function App() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <HowItWorksSection />
      <LiveDashboard />
      <ServicesSection />
      <TestimonialsSection />
      <div className="bg-transparent m-0 p-0 w-screen overflow-hidden">
        <Footer />
      </div>
      <ScrollToTop />
    </div>
  );
}

export default App;