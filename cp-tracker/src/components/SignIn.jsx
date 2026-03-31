import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const SignIn = ({ setAuth }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, { username, password });
            setAuth(res.data);
            navigate(`/dashboard?handle=${res.data.linkedHandle}`);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to sign in. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 relative overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-card p-10 w-full max-w-md z-10"
            >
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-6 text-center">
                    Welcome Back
                </h2>
                {error && <p className="text-red-500 text-sm mb-4 text-center font-semibold">{error}</p>}

                <form onSubmit={handleLogin} className="flex flex-col space-y-4">
                    <input type="text" placeholder="Username" required
                        className="p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-cyan-500/50 focus:outline-none placeholder-gray-500 transition-all duration-300"
                        value={username} onChange={(e) => setUsername(e.target.value)} />
                    <input type="password" placeholder="Password" required
                        className="p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-cyan-500/50 focus:outline-none placeholder-gray-500 transition-all duration-300"
                        value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type="submit" disabled={loading}
                        className="p-4 mt-2 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all duration-300 disabled:opacity-50"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 text-center text-gray-400">
                    Don't have an account? <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 hover:underline">Sign Up</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default SignIn;
