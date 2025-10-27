import { motion } from "framer-motion";
import { TrendingUp, Clock, Users, Award } from "lucide-react";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

export default function LiveDashboard() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [stats, setStats] = useState([
    { icon: TrendingUp, label: "Issues This Month", value: 1247, suffix: "" },
    { icon: Clock, label: "Avg. Resolution Time", value: 48, suffix: "hrs" },
    { icon: Users, label: "Active Contributors", value: 2456, suffix: "+" },
    { icon: Award, label: "Neighborhoods Helped", value: 89, suffix: "" },
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
    <section
      ref={ref}
      // MODIFICATION 1: Replaced 'min-h-screen' with 'py-20' to reduce top/bottom padding significantly and let the section height be determined by its content.
      className="flex flex-col justify-center items-center bg-transparent text-center px-6 py-20"
    >
      <motion.div
        // MODIFICATION 2: Reduced the bottom margin from 'mb-16' to 'mb-12' to pull the stats closer to the text.
        className="mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Live <span className="text-green-600">Dashboard</span>
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Real-time insights into our community’s impact.
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

      {/* Stats Grid - No external changes needed here */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 max-w-6xl">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <motion.div
              className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <stat.icon className="text-white" size={30} />
            </motion.div>

            <div className="text-lg font-medium text-gray-600 mb-1">
              {stat.label}
            </div>

            <motion.div
              className="text-4xl font-bold text-gray-900"
              key={stat.value}
              initial={{ scale: 1.2, color: "rgb(22, 163, 74)" }}
              animate={{ scale: 1, color: "rgb(31, 41, 55)" }}
              transition={{ duration: 0.3 }}
            >
              {stat.value.toLocaleString()}
              {stat.suffix}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

