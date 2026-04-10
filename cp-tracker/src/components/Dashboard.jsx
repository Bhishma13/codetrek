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
        <div className="min-h-screen relative overflow-hidden flex flex-col items-center pt-16 px-10">
            <BackgroundSymbols /> {/* ✅ background animation */}

            {/* Left Section - User Profile */}
            <div className="w-full max-w-4xl z-10">
                <h1 className="text-4xl font-bold text-emerald-600 mb-8 tracking-wide z-10 flex items-center space-x-3">
                    User Profile
                </h1>

                {loading ? (
                    <p className="text-lg">⏳ Loading user data...</p>
                ) : error ? (
                    <p className="text-red-500 text-lg">{error}</p>
                ) : (
                    <div className="glass-card p-8 flex flex-col items-center w-full">
                        <img src={userData.titlePhoto} alt="Title Badge" className="w-24 h-24 mb-6 rounded-full border-2 border-emerald-400 shadow-md object-cover" />
                        <h2 className="text-3xl font-extrabold text-gray-900 mt-4 mb-2 tracking-tight">{userData.handle}</h2>
                        <div className="px-4 py-1.5 rounded-full bg-emerald-100/50 border border-emerald-300 text-emerald-700 font-bold mb-4 shadow-sm text-sm uppercase tracking-wider">
                            {userData.rank || "Unrated"}
                        </div>
                        <p className="text-gray-600">{userData.firstName ? `${userData.firstName} ${userData.lastName}` : "No Name Provided"}</p>
                        <p className="text-gray-600">Country: {userData.country || "N/A"}</p>
                        <p className="text-gray-600">City: {userData.city || "N/A"}</p>
                        <p className="text-gray-600">Organization: {userData.organization || "N/A"}</p>
                        <p className="text-emerald-600 font-semibold">Current Rating: {userData.rating}</p>
                        <p className="text-yellow-600 font-semibold">Max Rating: {userData.maxRating}</p>

                        <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3 block">Quick Actions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            <button
                                onClick={() => navigate(`/performance/${userData.handle}`)}
                                className="px-6 py-4 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-semibold rounded-xl transition duration-300 shadow-sm flex items-center justify-center space-x-2"
                            >
                                <span>📊 View Deep Performance Analytics</span>
                            </button>
                            <button
                                onClick={() => navigate(`/compare/${userData.handle}`)}
                                className="px-6 py-4 bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-700 font-semibold rounded-xl transition duration-300 shadow-sm flex items-center justify-center space-x-2"
                            >
                                <span>⚔️ Compare vs Friends/Rivals</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Motivational / Bottom Info */}
                {!loading && !error && (
                    <div className="w-full glass-card p-6 mt-8 flex sm:flex-row flex-col justify-between items-center z-10 animate-fade-in-up delay-200">
                        <div>
                            <h3 className="text-xl font-bold text-emerald-600 mb-1">Consistency is Key</h3>
                            <p className="text-gray-600">Keep solving problems, analyzing weaknesses, and your rating will naturally grow.</p>
                        </div>
                        <button
                            onClick={() => navigate("/")}
                            className="px-6 py-3 mt-4 sm:mt-0 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 font-semibold rounded-xl transition duration-300 shadow-sm flex items-center space-x-2"
                        >
                            <span>Back to Home</span>
                            <span>🏠</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
