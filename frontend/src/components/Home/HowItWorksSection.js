import { motion } from 'framer-motion';
import { MapPin, Send, CheckCircle } from 'lucide-react';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const steps = [
  {
    icon: MapPin,
    title: 'Report',
    description: 'Snap a photo and pin the location of waste issues in your community.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Send,
    title: 'Assign',
    description: 'Our smart system routes the issue to the right local authorities instantly.',
    color: 'from-yellow-500 to-orange-600',
  },
  {
    icon: CheckCircle,
    title: 'Resolve',
    description: 'Track progress in real-time and see your impact as issues get resolved.',
    color: 'from-green-500 to-emerald-600',
  },
];

export default function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            How It <span className="text-green-600">Works</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Three simple steps to make a real difference in your community.
          </p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-orange-500 to-green-500 transform -translate-y-1/2 hidden md:block">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 via-orange-500 to-green-500"
              initial={{ width: 0 }}
              animate={isInView ? { width: '100%' } : {}}
              transition={{ duration: 2, delay: 0.5 }}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, x: -50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.3 }}
              >
                <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300 relative z-10">
                  <motion.div
                    className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center mx-auto mb-6 relative`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <step.icon className="text-white" size={36} />
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${step.color} rounded-full opacity-50`}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>

                  <div className="text-center">
                    <div className="text-gray-400 font-bold text-sm mb-2">
                      STEP {index + 1}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

