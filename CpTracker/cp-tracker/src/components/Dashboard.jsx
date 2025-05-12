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
        <div className="min-h-screen bg-black text-white relative overflow-hidden flex justify-between items-start pt-16 px-10">
            <BackgroundSymbols /> {/* ✅ background animation */}

            {/* Left Section - User Profile */}
            <div className="w-1/3 z-10">
                <h1 className="text-3xl font-bold text-cyan-500 font-serif shadow-cyan-500 hover:text-blue-400 transition duration-300 mb-5">
                    User Profile
                </h1>

                {loading ? (
                    <p className="text-lg">⏳ Loading user data...</p>
                ) : error ? (
                    <p className="text-red-500 text-lg">{error}</p>
                ) : (
                    <div className="bg-black p-6 rounded-lg shadow-lg flex flex-col items-center border border-gray-700">
                        <img src={userData.titlePhoto} alt="Title Badge" className="w-20 h-20 mb-4 rounded-lg border border-yellow-500" />
                        <h2 className="text-2xl font-semibold hover:text-sky-300">{userData.handle}</h2>
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
            <div className="w-1/2 flex flex-col justify-center items-start z-10">
                <h2 className="text-4xl font-serif text-white mb-6">"Code. Compete. Conquer. Let’s see how far you’ve come!"</h2>
                <p className="text-lg text-gray-300 mb-6">
                    Unleash your potential and explore your competitive programming journey.
                </p>
                <button
                    onClick={() => navigate(`/performance/${handle}`)}
                    className="px-6 py-3 bg-white text-black font-semibold text-lg rounded-full shadow-lg hover:bg-gray-200 transition duration-300"
                >
                    Explore Your Performance
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
