import React from 'react';
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import BackgroundSymbols from '../BackgroundSymbols';


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.5,
      duration: 1.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1
    }
  }
};

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="relative bg-black min-h-screen overflow-hidden">
     <BackgroundSymbols/>

      <motion.div
        className="relative z-10 flex flex-col items-center justify-center text-white px-6 text-center min-h-screen"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 className="text-5xl font-bold mb-4 text-white" variants={itemVariants}>
          🚀 Welcome to CodeTrek
        </motion.h1>

        <motion.p className="text-lg max-w-2xl text-white" variants={itemVariants}>
          Track your Codeforces progress with real-time data & insightful analytics.
        </motion.p>

        <motion.button
          onClick={() => navigate("/enter-handle")}
          className="mt-6 px-6 py-3 bg-white text-black font-semibold text-lg rounded-lg shadow-lg hover:bg-gray-200 transition duration-300"
          variants={itemVariants}
        >
          Get Started
        </motion.button>

        <motion.div
          className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={containerVariants}
        >
          <motion.div className="p-6 bg-black border border-white rounded-lg shadow-lg" variants={itemVariants}>
            <h2 className="text-2xl font-semibold mb-2 text-white">📊 Real-time Data</h2>
            <p className="text-white">
              Fetch and analyze your Codeforces stats instantly.
            </p>
          </motion.div>

          <motion.div className="p-6 bg-black border border-white rounded-lg shadow-lg" variants={itemVariants}>
            <h2 className="text-2xl font-semibold mb-2 text-white">📈 Performance Insights</h2>
            <p className="text-white">
              See your strengths, weaknesses & improvement areas.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;
