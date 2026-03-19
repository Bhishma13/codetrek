import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const SignUp = ({ setAuth }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [linkedHandle, setLinkedHandle] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axios.post('http://localhost:8080/auth/register', { username, password, linkedHandle });
            setAuth(res.data);
            navigate(`/dashboard?handle=${res.data.linkedHandle}`);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create account.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 relative overflow-hidden">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="glass-card p-10 w-full max-w-md z-10"
            >
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500 mb-6 text-center">
                    Create Account
                </h2>
                <p className="text-gray-400 text-center mb-6 text-sm">Link your Codeforces handle to unlock a personalized dashboard.</p>
                {error && <p className="text-red-500 text-sm mb-4 text-center font-semibold">{error}</p>}

                <form onSubmit={handleRegister} className="flex flex-col space-y-4">
                    <input type="text" placeholder="Username" required
                        className="p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-pink-500/50 focus:outline-none placeholder-gray-500 transition-all duration-300"
                        value={username} onChange={(e) => setUsername(e.target.value)} />
                    <input type="password" placeholder="Password" required
                        className="p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-pink-500/50 focus:outline-none placeholder-gray-500 transition-all duration-300"
                        value={password} onChange={(e) => setPassword(e.target.value)} />
                    <input type="text" placeholder="Codeforces Handle (e.g. tourist)" required
                        className="p-4 rounded-xl bg-white/5 border border-white/10 text-cyan-300 focus:ring-2 focus:ring-pink-500/50 focus:outline-none placeholder-gray-600 transition-all duration-300"
                        value={linkedHandle} onChange={(e) => setLinkedHandle(e.target.value)} />

                    <button type="submit" disabled={loading}
                        className="p-4 mt-2 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-all duration-300 disabled:opacity-50"
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>
                <div className="mt-6 text-center text-gray-400">
                    Already have an account? <Link to="/signin" className="text-pink-400 hover:text-pink-300 hover:underline">Sign In</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default SignUp;
