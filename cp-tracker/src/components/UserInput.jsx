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
        <div className="bg-[#0a0a0a] min-h-screen flex flex-col items-center justify-center text-white relative overflow-hidden">
          <BackgroundSymbols/>

            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-8 z-10 tracking-wider">ENTER YOUR HANDLE</h1>

            <form onSubmit={handleSubmit} className="relative w-[400px] mb-8 z-10 glass-card p-1 rounded-full flex items-center">
                <input
                    type="text"
                    placeholder="e.g. tourist"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    className="p-4 text-white bg-transparent w-full pl-6 pr-12 focus:outline-none placeholder-gray-400 font-semibold text-lg"
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
                <p className="text-cyan-400 text-xl font-bold z-10 animate-pulse">⏳ Analyzing Profile...</p>
            ) : (
                <button
                    onClick={handleSubmit}
                    className="z-10 px-8 py-4 bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 font-bold text-lg rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:bg-cyan-500/40 hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:-translate-y-1 transition-all duration-300"
                >
                    Track Performance
                </button>
            )}
        </div>
    );
};

export default UserInput;
