import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Community Leader',
    location: 'Portland, OR',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
    text: "CityZen Clean transformed how our neighborhood tackles waste management. We've resolved over 200 issues in just 3 months!",
  },
  {
    name: 'Michael Chen',
    role: 'Environmental Activist',
    location: 'San Francisco, CA',
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200',
    text: 'The real-time tracking and community engagement features make it incredibly easy to organize cleanup drives. Truly game-changing.',
  },
  {
    name: 'Emma Rodriguez',
    role: 'Local Resident',
    location: 'Austin, TX',
    image: 'https.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
    text: "I love seeing the impact of my reports. It's empowering to know that my voice matters and leads to real change in my community.",
  },
];

export default function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section ref={ref} className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            What Our <span className="text-green-600">Community</span> Says
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real stories from real people making a difference.
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <motion.div
            className="absolute -top-10 -left-10 text-green-200 opacity-20"
            animate={{ rotate: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Quote size={100} />
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-12 shadow-2xl"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col md:flex-row items-center gap-8">
                <motion.img
                  src={testimonials[currentIndex].image}
                  alt={testimonials[currentIndex].name}
                  className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />

                <div className="flex-1 text-center md:text-left">
                  <motion.p
                    className="text-xl text-gray-700 mb-6 leading-relaxed italic"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    "{testimonials[currentIndex].text}"
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <div className="font-bold text-gray-800 text-lg">
                      {testimonials[currentIndex].name}
                    </div>
                    <div className="text-green-600 font-medium">
                      {testimonials[currentIndex].role}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {testimonials[currentIndex].location}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-4 mt-8">
            <motion.button
              onClick={handlePrev}
              className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-green-600 hover:bg-green-50 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft size={24} />
            </motion.button>

            <div className="flex gap-2 items-center">
              {testimonials.map((_, index) => (
                <motion.div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex ? 'w-8 bg-green-600' : 'w-2 bg-gray-300'
                  }`}
                  onClick={() => setCurrentIndex(index)}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </div>

            <motion.button
              onClick={handleNext}
              className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-green-600 hover:bg-green-50 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight size={24} />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}