import { motion } from 'framer-motion';
// Replaced Home with ChevronLeft as it's more common, but kept it top-right
import { Info, Home, ScanEye, MapPin, CheckCircle, Target, Users } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

// Animation variants for staggering children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Animation variants for child items
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

export default function LearnMore() {
  const navigate = useNavigate();

  return (
    <motion.div
      // 1. Changed background to a very light teal/cyan gradient
      className="min-h-screen w-full bg-gradient-to-b from-cyan-50 to-teal-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative w-full bg-white pt-8 md:pt-12 pb-8 md:pb-12">
        
        <div className="relative max-w-4xl mx-auto px-8">
          {/* 2. Kept Home Button, top right, changed hover color */}
          <motion.button
            onClick={() => navigate('/')} // Navigates to home
            className="absolute top-0 right-0 p-2 text-gray-400 hover:text-teal-500 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Home size={28} />
          </motion.button>
          
          {/* --- Header --- */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            {/* 3. Changed icon color to teal */}
            <Info size={48} className="mx-auto text-teal-500" />
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mt-4">
              How It Works
            </h1>
            <p className="text-xl text-slate-600 mt-2">
              Making our city cleaner, together.
            </p>
          </motion.div>

          {/* --- How It Works Section --- */}
          <motion.div
            className="grid md:grid-cols-3 gap-8 mb-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Step 1: Report */}
            <motion.div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-lg" variants={itemVariants}>
              <ScanEye size={40} className="text-teal-500" />
              <h3 className="text-2xl font-semibold text-slate-900 mt-4 mb-2">1. Report</h3>
              <p className="text-slate-700">
                See an issue? Snap a photo, add details, and tag the location directly in the app.
              </p>
            </motion.div>
            
            {/* Step 2: Track */}
            <motion.div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-lg" variants={itemVariants}>
              <MapPin size={40} className="text-teal-500" />
              <h3 className="text-2xl font-semibold text-slate-900 mt-4 mb-2">2. Track</h3>
              <p className="text-slate-700">
                Your report is sent to the nearest municipal team. Track its status from "Pending" to "Resolved".
              </p>
            </motion.div>
            
            {/* Step 3: Resolve */}
            <motion.div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-lg" variants={itemVariants}>
              <CheckCircle size={40} className="text-teal-500" />
              <h3 className="text-2xl font-semibold text-slate-900 mt-4 mb-2">3. Resolve</h3>
              <p className="text-slate-700">
                Get notified when the issue is cleaned up. See the "after" photo and help keep our city accountable.
              </p>
            </motion.div>
          </motion.div>
        </div> 
        {/* End of centered wrapper */}


        {/* --- Our Mission Section --- */}
        {/* 4. Changed banner color to teal */}
        <motion.div
          className="text-center bg-teal-500 text-white p-8 md:p-12 shadow-lg mb-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="max-w-4xl mx-auto">
            <Target size={40} className="mx-auto" />
            <h2 className="text-3xl font-bold mt-4 mb-2">Our Mission</h2>
            {/* 5. Changed text color to light teal */}
            <p className="text-lg text-teal-50 max-w-2xl mx-auto">
              To empower citizens and municipal workers with simple, effective tools to create a cleaner, healthier, and more sustainable urban environment for everyone.
            </p>
          </div>
        </motion.div>

        {/* --- Call to Action --- */}
        <div className="relative max-w-4xl mx-auto px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <Users size={40} className="mx-auto text-teal-500" />
            <h2 className="text-3xl font-bold text-slate-900 mt-4">Join the Movement</h2>
            <p className="text-lg text-slate-700 mt-2 mb-6">
              Ready to make a difference? Create your account today.
            </p>
            {/* 6. Changed button gradient and shadow color */}
            <motion.button
              onClick={() => navigate('/signup')}
              className="px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-full font-semibold shadow-lg flex items-center gap-2 group mx-auto"
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(20, 184, 166, 0.3)' }} // Teal-500 shadow
              whileTap={{ scale: 0.95 }}
            >
              Get Started Now
            </motion.button>
          </motion.div>
        </div> 
        {/* End of centered wrapper */}
        
      </div>
    </motion.div>
  );
}