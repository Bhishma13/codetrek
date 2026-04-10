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
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
            <BackgroundSymbols />

            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 mb-8 z-10 tracking-wider">ENTER YOUR HANDLE</h1>

            <form onSubmit={handleSubmit} className="relative w-[400px] mb-8 z-10 glass-card p-1 rounded-full flex items-center">
                <input
                    type="text"
                    placeholder="e.g. tourist"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    className="p-4 text-gray-900 bg-transparent w-full pl-6 pr-12 focus:outline-none placeholder-gray-500 font-semibold text-lg"
                />
                {handle && (
                    <button
                        type="button"
                        onClick={() => setHandle("")}
                        className="absolute right-4 text-gray-500 hover:text-red-500 text-2xl font-bold transition duration-300"
                    >
                        ×
                    </button>
                )}
            </form>

            {error && <p className="text-red-500 font-semibold mb-4 z-10">{error}</p>}

            {loading ? (
                <p className="text-emerald-600 text-xl font-bold z-10 animate-pulse">⏳ Analyzing Profile...</p>
            ) : (
                <button
                    onClick={handleSubmit}
                    className="z-10 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg rounded-xl shadow-md hover:from-emerald-600 hover:to-teal-600 hover:-translate-y-1 transition-all duration-300"
                >
                    Track Performance
                </button>
            )}
        </div>
    );
};

export default UserInput;
