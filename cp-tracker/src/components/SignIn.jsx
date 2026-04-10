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
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-card p-10 w-full max-w-md z-10"
            >
                <h2 className="text-3xl font-bold text-emerald-600 mb-6 text-center">
                    Welcome Back
                </h2>
                {error && <p className="text-red-500 text-sm mb-4 text-center font-semibold">{error}</p>}

                <form onSubmit={handleLogin} className="flex flex-col space-y-4">
                    <input type="text" placeholder="Username" required
                        className="p-4 rounded-xl bg-white border border-gray-300 text-gray-900 focus:ring-2 focus:ring-emerald-500/50 focus:outline-none placeholder-gray-500 transition-all duration-300"
                        value={username} onChange={(e) => setUsername(e.target.value)} />
                    <input type="password" placeholder="Password" required
                        className="p-4 rounded-xl bg-white border border-gray-300 text-gray-900 focus:ring-2 focus:ring-emerald-500/50 focus:outline-none placeholder-gray-500 transition-all duration-300"
                        value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type="submit" disabled={loading}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-md text-white font-bold py-3 px-6 rounded-lg transition duration-200 mt-4 disabled:opacity-50"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 text-center text-gray-600">
                    Don't have an account? <Link to="/signup" className="text-blue-600 hover:text-blue-700 hover:underline">Sign Up</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default SignIn;
