import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BackgroundSymbols from './BackgroundSymbols'; // ✅ import animations

const Dashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [handle, setHandle] = useState("");

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const handleParam = searchParams.get("handle");

        if (!handleParam) {
            setError("No handle provided!");
            setLoading(false);
            return;
        }

        setHandle(handleParam);

        const fetchUserData = async () => {
            try {
                const response = await fetch(`https://codeforces.com/api/user.info?handles=${handleParam}`);
                const data = await response.json();

                if (data.status !== "OK") {
                    setError("User not found!");
                } else {
                    setUserData(data.result[0]);
                }
            } catch (error) {
                setError("Something went wrong! Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [location.search]);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden flex justify-between items-start pt-16 px-10">
            <BackgroundSymbols /> {/* ✅ background animation */}

            {/* Left Section - User Profile */}
            <div className="w-1/3 z-10">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-6 tracking-wide">
                    User Profile
                </h1>

                {loading ? (
                    <p className="text-lg">⏳ Loading user data...</p>
                ) : error ? (
                    <p className="text-red-500 text-lg">{error}</p>
                ) : (
                    <div className="glass-card p-8 flex flex-col items-center w-full">
                        <img src={userData.titlePhoto} alt="Title Badge" className="w-24 h-24 mb-6 rounded-full border-2 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)] object-cover" />
                        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500 mb-2">{userData.handle}</h2>
                        <p className="text-gray-300">{userData.firstName ? `${userData.firstName} ${userData.lastName}` : "No Name Provided"}</p>
                        <p className="text-gray-300">Country: {userData.country || "N/A"}</p>
                        <p className="text-gray-300">City: {userData.city || "N/A"}</p>
                        <p className="text-gray-300">Organization: {userData.organization || "N/A"}</p>
                        <p className="text-blue-400 font-semibold">Current Rating: {userData.rating}</p>
                        <p className="text-yellow-400 font-semibold">Max Rating: {userData.maxRating}</p>
                        <p className="text-purple-400 font-semibold">Title: {userData.rank || "Unrated"}</p>
                        <p className="text-purple-500 font-semibold">Max Title: {userData.maxRank || "Unrated"}</p>
                        <p className={`text-lg font-semibold ${userData.contribution >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            Contribution: {userData.contribution}
                        </p>
                    </div>
                )}
            </div>

            {/* Right Section - Motivational Text + Button */}
            <div className="w-1/2 flex flex-col justify-center items-start z-10 mt-20">
                <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-6 leading-tight">
                    Code. Compete. Conquer. <br />
                    <span className="text-cyan-400">See how far you've come!</span>
                </h2>
                <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-lg">
                    Unleash your potential and explore your competitive programming journey with deep analytics and stunning visualizations.
                </p>
                <button
                    onClick={() => navigate(`/performance/${handle}`)}
                    className="px-8 py-4 bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 font-bold text-lg rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:bg-cyan-500/40 hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:-translate-y-1 transition duration-300 transform"
                >
                    Explore Your Performance
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
