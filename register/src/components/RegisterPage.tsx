import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MazeEditor from '../components/MazeEditor';
import { register } from '../services/api';

interface Point {
    x: number;
    y: number;
}

interface MazeConfig {
    gridSize: number;
    walls: Point[];
    start: Point;
    exit: Point;
    path: Point[];
}

const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSaveMaze = async (mazeConfig: MazeConfig) => {
        if (!username) {
            setError('Username is required');
            return;
        }
        try {
            const response = await register(username, mazeConfig);
            localStorage.setItem('username', username);
            if (response.token) {
                localStorage.setItem('token', response.token);
            }
            navigate('/dashboard');
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            setError(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-4 lg:p-8">
            {/* Main Card Container */}
            <div className="w-full max-w-[1200px] h-[800px] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex relative">

                {/* Left Side - Visual Area */}
                <div className="hidden md:flex md:w-1/2 relative bg-gray-900 overflow-hidden flex-col justify-between p-12 text-white">
                    {/* Abstract Background */}
                    <div className="absolute inset-0">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('/src/public/images/bakground.png')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
                        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-nird-blue opacity-20 blur-[100px] animate-pulse"></div>
                        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-nird-purple opacity-20 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                    </div>

                    {/* Content Overlay */}
                    <div className="relative z-10">
                        <h2 className="text-xl font-bold tracking-wider uppercase mb-2">MazeID</h2>
                        <div className="h-1 w-12 bg-nird-pink rounded-full"></div>
                    </div>

                    <div className="relative z-10 mb-12">
                        <h1 className="text-5xl font-bold mb-6 leading-tight">
                            Secure Access,<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-nird-blue via-nird-purple to-nird-pink">
                                Reimagined.
                            </span>
                        </h1>
                        <p className="text-gray-300 text-lg max-w-md leading-relaxed">
                            Experience the future of authentication with our pattern-based security system. Simple, intuitive, and secure.
                        </p>
                    </div>

                    <div className="relative z-10 flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex -space-x-2">
                            <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-900"></div>
                            <div className="w-8 h-8 rounded-full bg-gray-600 border-2 border-gray-900"></div>
                            <div className="w-8 h-8 rounded-full bg-gray-500 border-2 border-gray-900"></div>
                        </div>
                        <p>Join thousands of secure users</p>
                    </div>
                </div>

                {/* Right Side - Form Area */}
                <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 lg:p-12 relative overflow-y-auto">
                    <div className="w-full max-w-md">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
                            <p className="text-gray-500">Design your unique maze pattern to get started.</p>
                        </div>

                        <div className="space-y-6">
                            {/* Username Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-nird-blue focus:ring-4 focus:ring-nird-blue/10 transition-all outline-none bg-gray-50"
                                    placeholder="Enter your username"
                                />
                            </div>

                            {/* Maze Editor Section */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Security Pattern</label>
                                <div className="p-1 rounded-2xl bg-gradient-to-br from-nird-blue via-nird-purple to-nird-pink">
                                    <div className="bg-white rounded-xl overflow-hidden">
                                        <MazeEditor onSave={handleSaveMaze} />
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-2 text-center">
                                    Draw a path from Start (Green) to Exit (Red)
                                </p>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {error}
                                </div>
                            )}

                            {/* Login Link */}
                            <div className="text-center mt-6">
                                <p className="text-gray-600">
                                    Already have an account?{' '}
                                    <Link to="/login" className="font-semibold text-nird-blue hover:text-nird-purple transition-colors">
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
