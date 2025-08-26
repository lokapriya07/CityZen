import React, { useState } from 'react';
import { BarChart, ChevronDown, Menu, X, Recycle, Truck, Leaf, Users, Phone, Star } from 'lucide-react';

// Helper component for Stats
const StatCard = ({ icon, value, label, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300">
    <div className={`rounded-full p-3 mb-4 ${color}`}>
      {icon}
    </div>
    <p className="text-3xl md:text-4xl font-bold text-gray-800">{value}</p>
    <p className="text-gray-500 mt-1">{label}</p>
  </div>
);

// Navigation Component
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "#about", label: "About Us" },
    { href: "#services", label: "Services" },
    { href: "#impact", label: "Impact" },
    { href: "#testimonials", label: "Testimonials" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-lg fixed top-0 left-0 right-0 z-50 shadow-md">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <a href="#" className="flex items-center space-x-2 text-2xl font-bold text-gray-800">
            <Recycle className="h-8 w-8 text-green-600" />
            <span>EcoWaste</span>
          </a>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map(link => (
              <a key={link.href} href={link.href} className="text-gray-600 hover:text-green-600 transition-colors duration-300 font-medium">
                {link.label}
              </a>
            ))}
          </div>
          <div className="hidden lg:flex">
             <a href="#contact" className="bg-green-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-green-700 transition-all duration-300 shadow-lg">
              Get a Quote
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 focus:outline-none">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden mt-4 animate-fade-in-down">
            <div className="flex flex-col space-y-4">
              {navLinks.map(link => (
                <a key={link.href} href={link.href} className="text-gray-600 hover:text-green-600 py-2 text-center rounded-md bg-gray-50" onClick={() => setIsOpen(false)}>
                  {link.label}
                </a>
              ))}
              <a href="#contact" className="bg-green-600 text-white font-semibold text-center px-6 py-3 rounded-full hover:bg-green-700 transition-all duration-300 shadow-lg">
                Get a Quote
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};


// Hero Section Component
const HeroSection = () => (
  <section className="pt-32 pb-20 bg-gradient-to-b from-green-50 to-white text-center">
    <div className="container mx-auto px-6">
      <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 leading-tight mb-6">
        Smart Waste Management for a <span className="text-green-600">Greener Tomorrow</span>
      </h1>
      <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10">
        Leveraging technology to create efficient, sustainable, and community-focused waste solutions. Join us in making our cities cleaner, one bin at a time.
      </p>
      <div className="flex justify-center items-center space-x-4">
        <a href="#services" className="bg-green-600 text-white font-semibold px-8 py-4 rounded-full hover:bg-green-700 transition-all duration-300 shadow-lg transform hover:scale-105">
          Explore Our Services
        </a>
        <a href="#how-it-works" className="bg-white text-green-600 font-semibold px-8 py-4 rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg transform hover:scale-105 border-2 border-green-600">
          How It Works
        </a>
      </div>
    </div>
  </section>
);

// About Section Component
const AboutSection = () => (
  <section id="about" className="py-20 bg-white">
    <div className="container mx-auto px-6">
      <div className="flex flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-1/2">
          <img src="https://placehold.co/600x400/A0E9A3/333333?text=Our+Mission" alt="Eco-friendly waste collection" className="rounded-2xl shadow-2xl w-full h-auto" />
        </div>
        <div className="lg:w-1/2">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Pioneering a Sustainable Future</h2>
          <p className="text-gray-600 mb-4 leading-relaxed">
            EcoWaste was founded on a simple principle: waste is not just waste; it's a resource. We are dedicated to transforming the waste management industry through innovation, technology, and a deep commitment to environmental stewardship.
          </p>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Our mission is to build smarter, cleaner cities by providing data-driven solutions that optimize collection, increase recycling rates, and reduce environmental impact. We believe in a circular economy where waste is minimized and resources are conserved for future generations.
          </p>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-center"><Leaf className="h-5 w-5 text-green-500 mr-3" /><span>Reducing landfill waste by 40%</span></li>
            <li className="flex items-center"><Recycle className="h-5 w-5 text-green-500 mr-3" /><span>Promoting recycling and composting</span></li>
            <li className="flex items-center"><Users className="h-5 w-5 text-green-500 mr-3" /><span>Engaging communities in sustainable practices</span></li>
          </ul>
        </div>
      </div>
    </div>
  </section>
);

// How It Works Section Component
const HowItWorksSection = () => {
    const steps = [
        {
            icon: <Phone className="h-10 w-10 mb-4 text-green-600" />,
            title: "1. Schedule Pickup",
            description: "Use our simple app or website to schedule a waste or recycling pickup at your convenience."
        },
        {
            icon: <Truck className="h-10 w-10 mb-4 text-green-600" />,
            title: "2. Smart Collection",
            description: "Our GPS-optimized trucks collect your waste efficiently, reducing fuel consumption and emissions."
        },
        {
            icon: <Recycle className="h-10 w-10 mb-4 text-green-600" />,
            title: "3. Sort & Recycle",
            description: "We transport waste to our advanced facilities for sorting, processing, and recycling."
        },
        {
            icon: <BarChart className="h-10 w-10 mb-4 text-green-600" />,
            title: "4. Track Your Impact",
            description: "Monitor your recycling contributions and environmental impact through your personal dashboard."
        }
    ];

    return (
        <section id="how-it-works" className="py-20 bg-gray-50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Simple Steps to a Cleaner Planet</h2>
                    <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Our process is designed for maximum convenience and environmental benefit. Here's how we make a difference together.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="bg-white p-8 rounded-2xl shadow-lg text-center transform hover:-translate-y-2 transition-transform duration-300">
                            {step.icon}
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">{step.title}</h3>
                            <p className="text-gray-500">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Live Dashboard Component
const LiveDashboard = () => (
    <section className="py-20 bg-green-600 text-white">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Live Impact Dashboard</h2>
            <p className="text-green-100 max-w-3xl mx-auto mb-12">
                We believe in transparency. See the real-time impact our collective efforts are making on the environment.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white/20 p-8 rounded-2xl backdrop-blur-sm">
                    <p className="text-4xl md:text-5xl font-bold">1,250+</p>
                    <p className="mt-2 text-green-50">Tons of Waste Recycled</p>
                </div>
                <div className="bg-white/20 p-8 rounded-2xl backdrop-blur-sm">
                    <p className="text-4xl md:text-5xl font-bold">850+</p>
                    <p className="mt-2 text-green-50">Tons of CO2 Saved</p>
                </div>
                <div className="bg-white/20 p-8 rounded-2xl backdrop-blur-sm">
                    <p className="text-4xl md:text-5xl font-bold">15,000+</p>
                    <p className="mt-2 text-green-50">Happy Homes & Businesses</p>
                </div>
            </div>
        </div>
    </section>
);

// Services Section Component
const ServicesSection = () => {
    const services = [
        {
            title: "Residential Collection",
            description: "Reliable, scheduled curbside pickup for household waste and recycling.",
            icon: <Users className="h-8 w-8 text-green-600" />,
            img: "https://placehold.co/400x300/A0E9A3/333333?text=Residential"
        },
        {
            title: "Commercial Solutions",
            description: "Customized waste management plans for businesses of all sizes.",
            icon: <Truck className="h-8 w-8 text-green-600" />,
            img: "https://placehold.co/400x300/79D8A5/333333?text=Commercial"
        },
        {
            title: "Organics & Composting",
            description: "Specialized collection for food scraps and yard waste, turning it into valuable compost.",
            icon: <Leaf className="h-8 w-8 text-green-600" />,
            img: "https://placehold.co/400x300/53C6A2/333333?text=Organics"
        }
    ];

    return (
        <section id="services" className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Comprehensive Waste Solutions</h2>
                    <p className="text-gray-600 mt-4 max-w-2xl mx-auto">We offer a range of services tailored to meet the needs of our communities and the planet.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div key={index} className="bg-gray-50 rounded-2xl shadow-lg overflow-hidden group">
                            <img src={service.img} alt={service.title} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" />
                            <div className="p-8">
                                <div className="flex items-center mb-4">
                                    {service.icon}
                                    <h3 className="text-xl font-semibold text-gray-800 ml-3">{service.title}</h3>
                                </div>
                                <p className="text-gray-500">{service.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Community Impact Component
const CommunityImpact = () => (
    <section id="impact" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Our Community Impact</h2>
                <p className="text-gray-600 mt-4 max-w-2xl mx-auto">We're more than a service provider; we're a community partner dedicated to creating lasting positive change.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <StatCard icon={<Recycle size={32} className="text-white"/>} value="40%" label="Reduction in Landfill Waste" color="bg-blue-500" />
                <StatCard icon={<Leaf size={32} className="text-white"/>} value="12,000" label="Trees Saved Annually" color="bg-green-500" />
                <StatCard icon={<Users size={32} className="text-white"/>} value="50+" label="Local Community Cleanups" color="bg-yellow-500" />
            </div>
        </div>
    </section>
);

// Testimonials Section Component
const TestimonialsSection = () => {
    const testimonials = [
        {
            quote: "EcoWaste has revolutionized how our business handles waste. Their service is reliable, and their impact reporting is a fantastic tool for our sustainability goals.",
            name: "Sarah L.",
            title: "Restaurant Owner"
        },
        {
            quote: "Switching to EcoWaste was the best decision for our family. The app is so easy to use, and it feels great knowing we're contributing to a cleaner city.",
            name: "Michael B.",
            title: "Homeowner"
        },
        {
            quote: "The team is professional, friendly, and truly passionate about what they do. They've helped our entire neighborhood become more eco-conscious.",
            name: "Jessica P.",
            title: "Community Organizer"
        }
    ];

    return (
        <section id="testimonials" className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800">What Our Clients Say</h2>
                    <p className="text-gray-600 mt-4 max-w-2xl mx-auto">We're proud to serve our community. Here's what people are saying about their experience with EcoWaste.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="bg-gray-50 p-8 rounded-2xl shadow-lg flex flex-col">
                            <div className="flex mb-4">
                                {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />)}
                            </div>
                            <p className="text-gray-600 mb-6 flex-grow">"{testimonial.quote}"</p>
                            <div>
                                <p className="font-bold text-gray-800">{testimonial.name}</p>
                                <p className="text-sm text-gray-500">{testimonial.title}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Call To Action Component
const CallToAction = () => (
    <section id="contact" className="py-20 bg-green-600">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Make a Difference?</h2>
            <p className="text-green-100 text-lg max-w-2xl mx-auto mb-8">
                Join thousands of homes and businesses in our mission for a sustainable future. Get a personalized quote today and start your journey with EcoWaste.
            </p>
            <a href="#" className="bg-white text-green-600 font-bold px-10 py-4 rounded-full hover:bg-gray-100 transition-all duration-300 shadow-xl text-lg transform hover:scale-105">
                Request a Free Quote
            </a>
        </div>
    </section>
);

// Footer Component
const Footer = () => (
    <footer className="bg-gray-800 text-white">
        <div className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-xl font-bold mb-4">EcoWaste</h3>
                    <p className="text-gray-400">Smart solutions for a cleaner planet.</p>
                </div>
                <div>
                    <h4 className="font-semibold mb-4">Quick Links</h4>
                    <ul className="space-y-2">
                        <li><a href="#about" className="text-gray-400 hover:text-white">About Us</a></li>
                        <li><a href="#services" className="text-gray-400 hover:text-white">Services</a></li>
                        <li><a href="#impact" className="text-gray-400 hover:text-white">Community Impact</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold mb-4">Support</h4>
                    <ul className="space-y-2">
                        <li><a href="#" className="text-gray-400 hover:text-white">FAQs</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold mb-4">Stay Connected</h4>
                    <p className="text-gray-400">Sign up for our newsletter.</p>
                    <div className="flex mt-2">
                        <input type="email" placeholder="Your Email" className="w-full px-4 py-2 rounded-l-md text-gray-800 focus:outline-none" />
                        <button className="bg-green-600 px-4 py-2 rounded-r-md hover:bg-green-700">Go</button>
                    </div>
                </div>
            </div>
            <div className="mt-12 border-t border-gray-700 pt-6 text-center text-gray-500">
                <p>&copy; {new Date().getFullYear()} EcoWaste. All Rights Reserved.</p>
            </div>
        </div>
    </footer>
);


// Main App Component that ties everything together
export default function App() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <HowItWorksSection />
        <LiveDashboard />
        <ServicesSection />
        <CommunityImpact />
        <TestimonialsSection />
        <CallToAction />
      </main>
      <Footer />
    </div>
  )
}
