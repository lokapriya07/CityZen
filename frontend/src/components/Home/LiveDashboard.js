import { motion } from 'framer-motion';
import { TrendingUp, Clock, Users, Award } from 'lucide-react';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

export default function LiveDashboard() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const [stats, setStats] = useState([
    { icon: TrendingUp, label: 'Issues This Month', value: 1247, suffix: '' },
    { icon: Clock, label: 'Avg. Resolution Time', value: 48, suffix: 'hrs' },
    { icon: Users, label: 'Active Contributors', value: 2456, suffix: '+' },
    { icon: Award, label: 'Neighborhoods Helped', value: 89, suffix: '' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) =>
        prev.map((stat) => ({
          ...stat,
          value: stat.value + Math.floor(Math.random() * 5),
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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
            Live <span className="text-green-600">Dashboard</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real-time insights into our community's impact.
          </p>
          <motion.div
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Live Updates
          </motion.div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <motion.div
                className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <stat.icon className="text-white" size={24} />
              </motion.div>

              <div className="text-sm text-gray-600 mb-2">{stat.label}</div>

              <motion.div
                className="text-3xl font-bold text-gray-800"
                key={stat.value} // This key is important for the re-render animation
                initial={{ scale: 1.2, color: 'rgb(22, 163, 74)' }}
                animate={{ scale: 1, color: 'rgb(31, 41, 55)' }}
                transition={{ duration: 0.3 }}
              >
                {stat.value.toLocaleString()}
                {stat.suffix}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

