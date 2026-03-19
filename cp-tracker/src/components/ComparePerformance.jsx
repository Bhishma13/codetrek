import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ComparePerformance = () => {
    const { handle } = useParams(); // First user's handle
    const [secondHandle, setSecondHandle] = useState(""); // Input for second handle
    const [error, setError] = useState(""); // Error state
    const [loading, setLoading] = useState(false); // Loading state
    const navigate = useNavigate();

    // Function to validate handle
    const validateHandle = async () => {
        setError(""); // Reset error

        if (handle === secondHandle) {
            setError("Please enter a different user.");
            return;
        }

        setLoading(true); // Show loading state

        try {
            const response = await axios.get(`https://codeforces.com/api/user.info?handles=${secondHandle}`);
            if (response.data.status === "OK") {
                navigate(`/compareWithOthers/${handle}/${secondHandle}`); // Navigate if valid
            }
        } catch (err) {
            setError("User not found on Codeforces.");
        }

        setLoading(false); // Remove loading state
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-8 tracking-wide z-10 text-center">
                Compare Performance
            </h1>

            <div className="glass-card p-10 w-full max-w-2xl text-center z-10">
                <h2 className="text-2xl font-semibold mb-6 text-gray-200 tracking-wide">
                    Comparing: <span className="text-cyan-400">{handle}</span> vs <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-red-500">?</span>
                </h2>

                <input
                    type="text"
                    placeholder="Enter another handle (e.g. tourist)"
                    className="p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none w-full mb-6 placeholder-gray-500 text-lg transition duration-300"
                    value={secondHandle}
                    onChange={(e) => setSecondHandle(e.target.value)}
                />

                {error && <p className="text-red-500 text-sm mb-4 font-semibold">{error}</p>}

                <button
                    className={`p-4 rounded-xl font-bold text-lg transition-all duration-300 w-full ${secondHandle
                            ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 hover:bg-cyan-500/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transform hover:-translate-y-1"
                            : "bg-white/5 text-gray-500 cursor-not-allowed border border-white/10"
                        }`}
                    onClick={validateHandle}
                    disabled={!secondHandle || loading}
                >
                    {loading ? "Analyzing..." : "Compare"}
                </button>
            </div>
        </div>
    );
};

export default ComparePerformance;
