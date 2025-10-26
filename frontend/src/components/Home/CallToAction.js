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
    <section ref={ref} className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Why Choose <span className="text-green-600">CityZen Clean</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're more than a platform—we're a movement transforming waste management through citizen engagement.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(16, 185, 129, 0.2)' }}
            >
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-lg"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <feature.icon className="text-white" size={32} />
              </motion.div>

              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

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