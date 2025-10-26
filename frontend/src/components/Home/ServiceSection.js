import { motion } from 'framer-motion';
import { Recycle, Truck, Megaphone, Users } from 'lucide-react';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const services = [
  {
    icon: Recycle,
    title: 'Waste Sorting',
    description: 'Smart categorization of waste types for efficient recycling and disposal.',
  },
  {
    icon: Truck,
    title: 'Collection Tracking',
    description: 'Real-time updates on waste collection schedules and routes in your area.',
  },
  {
    icon: Megaphone,
    title: 'Community Alerts',
    description: 'Stay informed about cleanup drives, recycling events, and local initiatives.',
  },
  {
    icon: Users,
    title: 'Team Coordination',
    description: 'Connect with local volunteers and organize community cleanup events.',
  },
];

export default function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our <span className="text-green-600">Services</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive tools to empower your community's environmental efforts.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
              />

              <motion.div
                className="relative"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-lg transition-shadow"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <service.icon className="text-white" size={32} />
                </motion.div>
              </motion.div>

              <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-green-600 transition-colors">
                {service.title}
              </h3>

              <p className="text-gray-600 leading-relaxed">
                {service.description}
              </p>

              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-600"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                style={{ transformOrigin: 'left' }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}