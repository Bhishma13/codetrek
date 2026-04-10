import React from "react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      {/* Heading */}
      <h1 className="text-4xl font-bold mb-4 text-blue-600">About CodeTrek</h1>

      {/* Description */}
      <p className="text-lg max-w-2xl text-gray-700 mb-10">
        CodeTrek is a platform that helps coders analyze their performance on Codeforces.
        It provides real-time data, insights, and personalized recommendations to improve your problem-solving skills.
      </p>

      {/* Features List */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
        {/* Feature 1 */}
        <div className="glass-card p-8 shadow-sm">
          <h2 className="text-2xl font-semibold mb-3 text-blue-600">📊 Real-time Data</h2>
          <p className="text-gray-600">Fetch & analyze Codeforces stats instantly.</p>
        </div>

        {/* Feature 2 */}
        <div className="glass-card p-8 shadow-sm">
          <h2 className="text-2xl font-semibold mb-3 text-blue-600">📈 Performance Insights</h2>
          <p className="text-gray-600">See your strengths, weaknesses & improvement areas.</p>
        </div>

        {/* Feature 3 */}
        <div className="glass-card p-8 shadow-sm">
          <h2 className="text-2xl font-semibold mb-3 text-blue-600">🎯 Goal Tracking</h2>
          <p className="text-gray-600">Set coding goals & track your improvement over time.</p>
        </div>

        {/* Feature 4 */}
        <div className="glass-card p-8 shadow-sm">
          <h2 className="text-2xl font-semibold mb-3 text-blue-600">🔍 Compare with Friends</h2>
          <p className="text-gray-600">See how you rank among your coding peers.</p>
        </div>
      </div>
    </div>
  );
};

export default About;
