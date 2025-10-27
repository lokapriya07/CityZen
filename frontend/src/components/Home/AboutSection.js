import { motion } from 'framer-motion';
import { Users, Target, Sprout } from 'lucide-react';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const features = [
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Powered by citizens who care. Every report makes a difference in building cleaner neighborhoods.',
  },
  {
    icon: Target,
    title: 'Targeted Solutions',
    description: 'Smart routing ensures waste issues reach the right authorities for fast, effective resolution.',
  },
  {
    icon: Sprout,
    title: 'Environmental Impact',
    description: 'Track real-time impact metrics and see how your actions contribute to a greener planet.',
  },
];

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      className="relative w-screen py-16 md:py-20 flex flex-col justify-center items-center bg-white -mt-30"
    >
      <div className="w-full h-full px-8 md:px-16 flex flex-col justify-center">
        {/* Title + Subtitle */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Why Choose <span className="text-green-600">CityZen Clean</span>?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            We're more than a platform — we're a movement transforming waste management through citizen engagement.
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-8 w-full max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group bg-white border border-green-100 rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.05, boxShadow: '0 15px 30px rgba(16, 185, 129, 0.2)' }}
            >
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-lg"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <feature.icon className="text-white" size={32} />
              </motion.div>

              <h3 className="text-2xl font-bold text-gray-800 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>

              <motion.div
                className="mt-6 h-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                transition={{ duration: 0.8, delay: index * 0.2 + 0.3 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
