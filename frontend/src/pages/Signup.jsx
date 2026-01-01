import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../utils/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { GoogleLogin } from '@react-oauth/google';
import { X, Mail, Lock, User, Eye, EyeOff, Sparkles, Star } from 'lucide-react';

function Signup({ onClose }) {
    const [name, setname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { setisauthenticated } = useContext(AuthContext);
    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            let res = await fetch('http://localhost:3000/users/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            if (res.ok) {
                const data = await res.json();
                console.log('Signup successful');
                localStorage.setItem("token", data.token);
                setisauthenticated(true);
                onClose(); // Close modal on successful signup
                navigate('/books');
            } else {
                throw new Error("Sign up failed");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignUpSuccess = async (credentialResponse) => {
        const token = credentialResponse.credential;
        const userInfo = jwtDecode(token);
        console.log("Google user:", userInfo);

        // Send token to backend
        const res = await fetch(`http://localhost:3000/api/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
        });

        const data = await res.json();
        localStorage.setItem("token", data.token);
        setisauthenticated(true);
        onClose(); // Close modal on successful signup
        navigate("/books");
    };

    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose} >
            <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 relative  max-h-[90vh] " onClick={handleModalClick}>
                {/* Floating decorative elements */}
                <div className="absolute top-4 right-16 w-6 h-6 bg-amber-200 rounded-full opacity-30 animate-bounce"></div>
                <div className="absolute bottom-8 left-8 w-4 h-4 bg-rose-200 rounded-full opacity-40 animate-pulse"></div>
                <div className="absolute top-12 left-12 w-3 h-3 bg-orange-200 rounded-full opacity-50 animate-bounce delay-300"></div>
                
                {/* Header */}
                <div className="relative p-8 pb-6">
                    <button 
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/20 transition-colors duration-200"
                    >
                        <X size={20} className="text-gray-600" />
                    </button>
                    <div className="text-center">
                        <div className="mb-3">
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                                <Sparkles className="w-4 h-4" />
                                Join Book Bazaar
                            </span>
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent ">Create Account</h2>
                        {/* <p className="text-gray-600">Start your book journey today!</p> */}
                    </div>
                </div>

                {/* Form */}
                <div className="px-8 pb-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Full Name Input */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-amber-500" />
                            </div>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Enter your full name"
                                className="w-full pl-12 pr-4 py-4 border-2 border-amber-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-white/70 focus:bg-white placeholder-gray-500"
                                value={name}
                                onChange={(e) => setname(e.target.value)}
                                required
                            />
                        </div>

                        {/* Email Input */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-amber-500" />
                            </div>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter your email"
                                className="w-full pl-12 pr-4 py-4 border-2 border-amber-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-white/70 focus:bg-white placeholder-gray-500"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-amber-500" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                placeholder="Create a strong password"
                                className="w-full pl-12 pr-14 py-4 border-2 border-amber-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-white/70 focus:bg-white placeholder-gray-500"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-4 flex items-center"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-amber-500 hover:text-amber-600" />
                                ) : (
                                    <Eye className="h-5 w-5 text-amber-500 hover:text-amber-600" />
                                )}
                            </button>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-4">
                                <p className="text-rose-600 text-sm font-medium">{error}</p>
                            </div>
                        )}

                        {/* Signup Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-2xl font-semibold hover:from-amber-600 hover:to-orange-600 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Creating Account...</span>
                                </div>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center my-4">
                        <div className="flex-1 border-t border-amber-200"></div>
                        <span className="px-4 text-gray-500 text-sm">or</span>
                        <div className="flex-1 border-t border-amber-200"></div>
                    </div>

                    {/* Google Signup */}
                    <div className="flex justify-center">
                        <div className="w-full">
                            <GoogleLogin
                                onSuccess={handleSignUpSuccess}
                                onError={() => console.log("Signup Failed")}
                                theme="outline"
                                size="large"
                                width="100%"
                            />
                        </div>
                    </div>

                    {/* Footer Links */}
                    <div className="mt-4 text-center">
                        <div className="text-gray-600 text-sm">
                            Already have an account?{' '}
                            <button
                                onClick={() => {
                                    onClose();
                                    navigate('/login');
                                }}
                                className="text-amber-600 hover:text-amber-800 font-medium transition-colors duration-200"
                            >
                                Log In
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;