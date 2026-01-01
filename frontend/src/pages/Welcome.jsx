import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BookOpen, ArrowRight, Sparkles, Users, Star } from "lucide-react";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";

function Welcome() {
    const navigate = useNavigate();
    const location = useLocation();

    // Determine modal type from the current route
    const modal = location.pathname.endsWith('/login')
        ? 'login'
        : location.pathname.endsWith('/signup')
        ? 'signup'
        : null;

    // Close modal and navigate back to /welcome
    const handleCloseModal = () => {
        navigate('/', { replace: true });
    };

    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* Background content with optional blur */}
            <div className={`flex flex-row w-full h-full bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 relative overflow-hidden transition-all duration-300 ${modal ? 'blur-sm pointer-events-none' : ''}`}>
                {/* Floating decorative elements */}
                <div className="absolute top-10 left-10 w-20 h-20 bg-amber-200 rounded-full opacity-30 animate-bounce"></div>
                <div className="absolute top-40 right-20 w-16 h-16 bg-rose-200 rounded-full opacity-40 animate-pulse"></div>
                <div className="absolute bottom-20 left-20 w-12 h-12 bg-orange-200 rounded-full opacity-50 animate-bounce delay-300"></div>
                <div className="absolute bottom-40 right-40 w-8 h-8 bg-amber-300 rounded-full opacity-60 animate-pulse delay-500"></div>

                {/* Left Section */}
                <div className="w-1/2 flex flex-col items-center justify-center p-8 relative">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                        <div className="relative bg-white rounded-3xl p-8 shadow-2xl transform group-hover:scale-105 transition-transform duration-300">
                            <div className="w-80 h-80 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center">
                                <img src="images/image.png" alt="Book Bazaar" />
                            </div>
                        </div>
                        <Sparkles className="absolute -top-4 -right-4 w-8 h-8 text-amber-500 animate-spin" />
                        <Star className="absolute -bottom-4 -left-4 w-6 h-6 text-orange-500 animate-pulse" />
                    </div>

                    <div className="mt-8 flex gap-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-amber-600">15K+</div>
                            <div className="text-sm text-gray-600">Books Listed</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">8K+</div>
                            <div className="text-sm text-gray-600">Active Users</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-rose-600">12K+</div>
                            <div className="text-sm text-gray-600">Connections</div>
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="w-1/2 flex flex-col items-center justify-center p-12 relative">
                    <div className="text-center max-w-md">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-6">
                            <Sparkles className="w-4 h-4" />
                            Connect • Share • Discover
                        </span>

                        <h1 className="text-6xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent mb-4 leading-tight">
                            Book Bazaar
                        </h1>

                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            Connect with fellow readers to sell, exchange, or donate books in your community
                        </p>

                        <div className="flex flex-col gap-4 w-full">
                            <button
                                className="group relative px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                                onClick={() => navigate('/signup')}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative flex items-center justify-center gap-2">
                                    <span>Get Started</span>
                                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </div>
                            </button>

                            <button
                                className="group px-8 py-4 bg-white text-amber-600 font-semibold rounded-2xl border-2 border-amber-200 hover:border-amber-300 hover:bg-amber-50 transform hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-lg"
                                onClick={() => navigate('/login')}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <Users className="w-5 h-5" />
                                    <span>Login</span>
                                </div>
                            </button>
                        </div>

                        <div className="mt-12 grid grid-cols-2 gap-4 text-sm">
                            {[
                                ['Sell books easily', 'bg-amber-400'],
                                ['Exchange with others', 'bg-orange-400'],
                                ['Donate to community', 'bg-rose-400'],
                                ['In-app chat', 'bg-amber-400'],
                            ].map(([text, color], i) => (
                                <div key={i} className="flex items-center gap-2 text-gray-600">
                                    <div className={`w-2 h-2 ${color} rounded-full`}></div>
                                    <span>{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal rendering via route check */}
            {modal === 'login' && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl p-8 w-[90%] max-w-md">
                        <Login isOpen={true} onClose={handleCloseModal} />
                    </div>
                </div>
            )}

            {modal === 'signup' && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl p-8 w-[90%] max-w-md">
                        <Signup onClose={handleCloseModal} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Welcome;
