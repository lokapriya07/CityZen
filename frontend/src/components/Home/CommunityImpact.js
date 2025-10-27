import { motion, useScroll, useTransform } from 'framer-motion';
import { TreePine, Droplets, Wind, Zap } from 'lucide-react';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const impacts = [
  { icon: TreePine, label: 'Trees Planted', value: 5420, suffix: '+' },
  { icon: Droplets, label: 'Water Saved (Liters)', value: 128000, suffix: '+' },
  { icon: Wind, label: 'CO₂ Reduced (kg)', value: 34200, suffix: '+' },
  { icon: Zap, label: 'Energy Saved (kWh)', value: 12800, suffix: '+' },
];

export default function CommunityImpact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  const [counters, setCounters] = useState(impacts.map(() => 0));

  useEffect(() => {
    if (isInView) {
      const intervals = impacts.map((impact, index) => {
        const increment = Math.ceil(impact.value / 50);
        return setInterval(() => {
          setCounters((prev) => {
            const newCounters = [...prev];
            if (newCounters[index] < impact.value) {
              newCounters[index] = Math.min(newCounters[index] + increment, impact.value);
            }
            return newCounters;
          });
        }, 30);
      });

      return () => intervals.forEach(clearInterval);
    }
  }, [isInView]);

  return (
    <section ref={ref} className="relative py-24 overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600"
        style={{ y: backgroundY }}
      />

      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Community Impact
          </h2>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">
            Together, we're creating measurable change for our planet.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {impacts.map((impact, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <motion.div
                className="relative inline-block mb-6"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="absolute inset-0 bg-white opacity-20 rounded-full blur-xl"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                />
                <div className="relative w-20 h-20 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white border-opacity-30">
                  <impact.icon className="text-white" size={36} />
                </div>
              </motion.div>

              <motion.div
                className="text-5xl font-bold text-white mb-2"
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
              >
                {counters[index].toLocaleString()}
                {impact.suffix}
              </motion.div>

              <div className="text-green-100 text-lg font-medium">
                {impact.label}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="text-green-100 text-lg max-w-3xl mx-auto">
            Every action counts. Join our growing community and be part of the environmental revolution.
          </p>
        </motion.div>
      </div>
    </section>
  );
}


