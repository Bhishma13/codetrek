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
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
            <h1 className="text-3xl font-bold text-white shadow-lg mb-5">
                Compare Performance
            </h1>

            <div className="bg-white text-black p-6 rounded-lg shadow-lg w-3/4">
                <h2 className="text-2xl font-semibold mb-4">Comparing: {handle} vs ?</h2>

                <input
                    type="text"
                    placeholder="Enter another handle"
                    className="p-2 rounded bg-gray-100 text-black focus:outline-none w-full mb-4"
                    value={secondHandle}
                    onChange={(e) => setSecondHandle(e.target.value)}
                />

                {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

                <button
                    className={`p-2 rounded transition duration-300 w-full ${
                        secondHandle
                            ? "bg-cyan-600 hover:bg-cyan-500 text-white"
                            : "bg-gray-400 text-gray-200 cursor-not-allowed"
                    }`}
                    onClick={validateHandle}
                    disabled={!secondHandle || loading}
                >
                    {loading ? "Checking..." : "Compare"}
                </button>
            </div>
        </div>
    );
};

export default ComparePerformance;
