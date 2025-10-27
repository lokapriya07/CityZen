import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function HeroSection() {
  const [counters, setCounters] = useState({
    issuesResolved: 0,
    communities: 0,
    successRate: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCounters((prev) => ({
        issuesResolved: prev.issuesResolved < 12847 ? prev.issuesResolved + 127 : 12847,
        communities: prev.communities < 156 ? prev.communities + 2 : 156,
        successRate: prev.successRate < 94 ? prev.successRate + 1 : 94,
      }));
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    // Section lifted slightly higher
    <section className="relative flex items-center justify-center min-h-[90vh] w-full bg-gradient-to-b from-green-50 to-green-100 overflow-hidden">

      {/* Container with better vertical padding */}
      <div className="w-full h-full px-8 md:px-16 flex items-start justify-center py-12">

        <div className="grid md:grid-cols-2 gap-12 items-center w-full">
          {/* Left: Text Content - Shifted slightly left */}
          <motion.div
            className='md:-ml-4' // Subtly moves the content to the left
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              // 1. REFINEMENT: Changed mb-20 to mb-8 to reduce space between the heading and the paragraph.
              className="text-5xl md:text-7xl font-bold text-gray-800 mb-8 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Clean Communities,
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent block mt-4">
                Brighter Future
              </span>
            </motion.h1>

            <motion.p
              // 2. REFINEMENT: Changed mb-10 to mb-12 to slightly increase space between the paragraph and buttons.
              className="text-xl text-gray-600 mb-12 max-w-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Join thousands of citizens making a real difference.
              Report waste issues, track progress, and help build cleaner, healthier communities.
            </motion.p>


            {/* Buttons */}
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full font-semibold shadow-lg flex items-center gap-2 group"
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(16, 185, 129, 0.4)' }}
                whileTap={{ scale: 0.95 }}
              >
                Report Waste Now
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </motion.div>
              </motion.button>

              <motion.button
                className="px-8 py-4 bg-white text-green-600 rounded-full font-semibold shadow-lg border-2 border-green-200"
                whileHover={{ scale: 1.05, borderColor: 'rgb(16, 185, 129)' }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              // 3. REFINEMENT: Changed mt-12 to mt-10 to slightly reduce space above the stats.
              className="grid grid-cols-3 gap-6 mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-600">
                  {counters.issuesResolved.toLocaleString()}+
                </div>
                <div className="text-sm text-gray-600 mt-1">Issues Resolved</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-600">
                  {counters.communities}+
                </div>
                <div className="text-sm text-gray-600 mt-1">Communities</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-600">
                  {counters.successRate}%
                </div>
                <div className="text-sm text-gray-600 mt-1">Success Rate</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Image (No changes needed here) */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.div
              className="relative w-full aspect-square max-w-lg mx-auto"
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <img
                src="https://images.pexels.com/photos/3850512/pexels-photo-3850512.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Community Cleanup"
                className="relative rounded-3xl shadow-2xl w-full h-full object-cover"
              />
              <motion.div
                className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <div className="text-3xl font-bold text-green-600">2.4K+</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}