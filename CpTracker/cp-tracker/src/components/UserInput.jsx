import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import BackgroundSymbols from './BackgroundSymbols';


const UserInput = () => {
    const [handle, setHandle] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (handle.trim() === "") {
            setError("⚠️ Please enter your handle before proceeding!");
            return;
        }
        setError("");
        setLoading(true);

        try {
            const response = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);
            const data = await response.json();

            if (data.status === "FAILED") {
                setError("⚠️ User not found on Codeforces!");
                setLoading(false);
                return;
            }

            setTimeout(() => {
                setLoading(false);
                navigate(`/dashboard?handle=${handle}`);
            }, 500);
        } catch (error) {
            setError("⚠️ Something went wrong! Please try again later.");
            setLoading(false);
        }
    };

    return (
        <div className="bg-black min-h-screen flex flex-col items-center justify-center text-white relative overflow-hidden">
          <BackgroundSymbols/>

            <h1 className="text-3xl font-light text-white mb-4 z-10">Enter Your Handle</h1>

            <form onSubmit={handleSubmit} className="relative w-80 mb-4 z-10">
                <input
                    type="text"
                    placeholder=" Enter your Handle"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    className="p-3 text-black bg-white rounded-full w-full pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {handle && (
                    <button
                        type="button"
                        onClick={() => setHandle("")}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-red-700 text-2xl font-semibold"
                    >
                        X
                    </button>
                )}
            </form>

            {error && <p className="text-red-500 font-semibold mb-4 z-10">{error}</p>}

            {loading ? (
                <p className="text-cyan-400 text-lg font-semibold z-10">⏳ Loading...</p>
            ) : (
                <button
                    onClick={handleSubmit}
                    className="z-10 px-6 py-3 bg-white text-black font-semibold text-lg rounded-lg shadow-lg hover:bg-gray-200 transition duration-300"
                >
                    Submit
                </button>
            )}
        </div>
    );
};

export default UserInput;
