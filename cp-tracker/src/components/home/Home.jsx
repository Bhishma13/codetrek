import React from 'react';
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import BackgroundSymbols from '../BackgroundSymbols';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
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

const Home = ({ auth }) => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <BackgroundSymbols />

      <motion.div
        className="relative z-10 flex flex-col items-center pt-32 pb-10 px-6 text-center min-h-[120vh]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 className="text-6xl font-extrabold mb-6 text-blue-600 tracking-tight" variants={itemVariants}>
          CodeTrek
        </motion.h1>

        <motion.p className="text-xl max-w-2xl text-gray-600 mb-10" variants={itemVariants}>
          Track your Codeforces progress with incredibly fast, real-time data & insightful, beautiful analytics.
        </motion.p>

        {auth ? (
          <motion.button
            onClick={() => navigate("/dashboard?handle=" + auth.linkedHandle)}
            className="mt-2 px-8 py-4 bg-blue-600 text-white font-bold text-xl rounded-xl shadow-lg hover:bg-blue-700 transition duration-300 transform hover:-translate-y-1"
            variants={itemVariants}
          >
            Go to your Dashboard 🎉
          </motion.button>
        ) : (
          <motion.button
            onClick={() => navigate("/enter-handle")}
            className="mt-2 px-10 py-4 bg-blue-600 text-white font-bold text-xl rounded-xl shadow-lg hover:bg-blue-700 transition duration-300 transform hover:-translate-y-1"
            variants={itemVariants}
          >
            Get Started
          </motion.button>
        )}

        {auth && (
          <motion.button
            onClick={() => navigate("/enter-handle")}
            className="mt-6 px-6 py-3 bg-white border border-gray-200 text-blue-600 font-semibold text-md rounded-xl shadow-sm hover:bg-gray-50 flex items-center space-x-2 transition p-2"
            variants={itemVariants}
          >
            <span>🔍 Manually search another handle</span>
          </motion.button>
        )}

        {/* Feature Grid */}
        <motion.div
          className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl"
          variants={containerVariants}
        >
          <motion.div className="glass-card p-8 transition duration-300" variants={itemVariants}>
            <div className="text-4xl mb-4">📊</div>
            <h2 className="text-2xl font-bold mb-3 text-blue-600">Real-time Data</h2>
            <p className="text-gray-600 leading-relaxed">
              Fetch and analyze your Codeforces stats instantly with our high-speed, 5-minute TTL optimized caching system.
            </p>
          </motion.div>

          <motion.div className="glass-card p-8 transition duration-300" variants={itemVariants}>
            <div className="text-4xl mb-4">📈</div>
            <h2 className="text-2xl font-bold mb-3 text-blue-600">Performance Insights</h2>
            <p className="text-gray-600 leading-relaxed">
              Dive deep into your strengths, weaknesses, and improvement areas using beautifully rendered, interactive glassmorphism charts.
            </p>
          </motion.div>

          <motion.div className="glass-card p-8 transition duration-300" variants={itemVariants}>
            <div className="text-4xl mb-4">🆚</div>
            <h2 className="text-2xl font-bold mb-3 text-blue-600">Track Rivals</h2>
            <p className="text-gray-600 leading-relaxed">
              Directly compare your submission stats and rating against your friends and rivals to secure your global ranking position.
            </p>
          </motion.div>

          <motion.div className="glass-card p-8 transition duration-300" variants={itemVariants}>
            <div className="text-4xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold mb-3 text-blue-600">Secure Accounts</h2>
            <p className="text-gray-600 leading-relaxed">
              Link your Codeforces handle to your private CodeTrek account. Sign in seamlessly and instantly jump to your tailored dashboard.
            </p>
          </motion.div>
        </motion.div>

        {/* Scrollable Spacer & Footer */}
        <motion.div className="flex-grow w-full mt-24" variants={itemVariants}>
          <footer className="w-full text-center border-t border-gray-200 pt-10 pb-6 mt-auto">
            <p className="text-gray-600 text-lg">
              Made with <span className="text-red-500 animate-pulse">❤️</span> by{' '}
              <a
                href="https://www.linkedin.com/in/bhishma-padhayay-9541ab254/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 hover:underline font-bold transition-all"
              >
                Bhishma Padhayay
              </a>
            </p>
          </footer>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;
