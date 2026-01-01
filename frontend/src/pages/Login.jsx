import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../utils/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { GoogleLogin } from '@react-oauth/google';
import { X, Mail, Lock, Eye, EyeOff, Sparkles, Star } from 'lucide-react';

function Login({ isOpen, onClose }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { isauthenticated, setisauthenticated } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await fetch('http://localhost:3000/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem("token", data.token);
                setisauthenticated(true);
                onClose(); // Close modal on successful login
                navigate('/books');
            } else {
                setError('Login failed');
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoginSuccess = async (credentialResponse) => {
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
        onClose(); // Close modal on successful login
        navigate("/books");
    };

    const handleForgotPassword = async () => {
        const res = await fetch(`http://localhost:3000/users/forgotpassword`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "magantisatyanarayana100@gmail.com" }),
        });
        if (!res.ok) {
            console.log("verification token sent failed");
        }
        console.log("verification sent successfully");
    };

    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0  bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 relative overflow-hidden" onClick={handleModalClick}>
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
                        <div className="mb-4">
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                                <Sparkles className="w-4 h-4" />
                                Welcome Back
                            </span>
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent mb-2">Login</h2>
                        <p className="text-gray-600">Sign in to your Book Bazaar account</p>
                    </div>
                </div>

                {/* Form */}
                <div className="px-8 pb-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Input */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-amber-500" />
                            </div>
                            <input
                                type="email"
                                placeholder="Email address"
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
                                placeholder="Password"
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

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-2xl font-semibold hover:from-amber-600 hover:to-orange-600 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Signing in...</span>
                                </div>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center my-6">
                        <div className="flex-1 border-t border-amber-200"></div>
                        <span className="px-4 text-gray-500 text-sm">or</span>
                        <div className="flex-1 border-t border-amber-200"></div>
                    </div>

                    {/* Google Login */}
                    <div className="flex justify-center">
                        <div className="w-full">
                            <GoogleLogin
                                onSuccess={handleLoginSuccess}
                                onError={() => console.log("Login Failed")}
                                theme="outline"
                                size="large"
                                width="100%"
                            />
                        </div>
                    </div>

                    {/* Footer Links */}
                    <div className="mt-8 text-center space-y-3">
                        <button
                            onClick={handleForgotPassword}
                            className="text-amber-600 hover:text-amber-800 text-sm font-medium transition-colors duration-200"
                        >
                            Forgot password?
                        </button>
                        <div className="text-gray-600 text-sm">
                            Don't have an account?{' '}
                            <button
                                onClick={() => {
                                    onClose();
                                    navigate('/signup');
                                }}
                                className="text-amber-600 hover:text-amber-800 font-medium transition-colors duration-200"
                            >
                                Create New Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;