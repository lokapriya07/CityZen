import React from 'react';
import { Recycle, Truck, Megaphone, Users } from 'lucide-react';

const ServicesSection = () => {
  const services = [
    {
      icon: Recycle,
      title: "Recycling Programs",
      description: "Comprehensive recycling initiatives to reduce waste and promote sustainability in your community."
    },
    {
      icon: Truck,
      title: "Waste Collection",
      description: "Efficient waste collection services with optimized routes and scheduled pickups."
    },
    {
      icon: Megaphone,
      title: "Awareness Campaigns",
      description: "Educational programs to raise awareness about proper waste management practices."
    },
    {
      icon: Users,
      title: "Community Clean-ups",
      description: "Organized community events bringing neighbors together for large-scale cleanup efforts."
    }
  ];

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive waste management solutions for cleaner, healthier communities
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="card text-center group">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-500 transition-colors">
                <service.icon className="h-8 w-8 text-green-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
