


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
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section
      ref={ref}
      className="relative w-full py-12 sm:py-16 md:py-20 flex flex-col justify-center items-center bg-white"
      id="about"
    >
      <div className="w-full h-full px-4 sm:px-6 md:px-8 lg:px-16 flex flex-col justify-center">
        {/* Title + Subtitle */}
        <motion.div
          className="text-center mb-8 sm:mb-10 md:mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 sm:mb-4">
            Why Choose <span className="text-green-600">CityZen Clean</span>?
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-xs sm:max-w-md md:max-w-2xl mx-auto leading-relaxed">
            We're more than a platform — we're a movement transforming waste management through citizen engagement.
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 w-full max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group bg-white border border-green-100 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ scale: 1.02, boxShadow: '0 10px 25px rgba(16, 185, 129, 0.15)' }}
            >
              <motion.div
                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-hover:shadow-md"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <feature.icon 
                  className="text-white" 
                  size={24} 
                />
              </motion.div>

              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2 sm:mb-3 leading-tight">
                {feature.title}
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              <motion.div
                className="mt-4 sm:mt-5 md:mt-6 h-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                transition={{ duration: 0.8, delay: index * 0.15 + 0.2 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}