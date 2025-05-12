import React from "react";

const About = () => {
  return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center text-white px-6 text-center">
      {/* Heading */}
      <h1 className="text-4xl font-bold mb-4 text-white">About CodeTrek</h1>

      {/* Description */}
      <p className="text-lg max-w-2xl text-white">
        CodeTrek is a platform that helps coders analyze their performance on Codeforces.
        It provides real-time data, insights, and personalized recommendations to improve your problem-solving skills.
      </p>

      {/* Features List */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Feature 1 */}
        <div className="p-6 bg-black border border-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-2 text-white">📊 Real-time Data</h2>
          <p className="text-white">Fetch & analyze Codeforces stats instantly.</p>
        </div>

        {/* Feature 2 */}
        <div className="p-6 bg-black border border-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-2 text-white">📈 Performance Insights</h2>
          <p className="text-white">See your strengths, weaknesses & improvement areas.</p>
        </div>

        {/* Feature 3 */}
        <div className="p-6 bg-black border border-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-2 text-white">🎯 Goal Tracking</h2>
          <p className="text-white">Set coding goals & track your improvement over time.</p>
        </div>

        {/* Feature 4 */}
        <div className="p-6 bg-black border border-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-2 text-white">🔍 Compare with Friends</h2>
          <p className="text-white">See how you rank among your coding peers.</p>
        </div>
      </div>
    </div>
  );
};

export default About;
