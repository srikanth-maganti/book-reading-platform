import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, Sparkles, Shield, CheckCircle, AlertCircle } from 'lucide-react';

function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const {token}=useParams();

    const navigate=useNavigate();
    const validatePassword = (password) => {
        if (password.length < 8) {
            return "Password must be at least 8 characters long";
        }
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            return "Password must contain at least one uppercase letter, one lowercase letter, and one number";
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Validate password
        const passwordError = validatePassword(password);
        if (passwordError) {
            
            setError(passwordError);
            setIsLoading(false);
            return;
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        try {
            // Replace with your actual API endpoint
            const res = await fetch('http://localhost:3000/users/resetpassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    token: token, // This would come from URL params in real app
                    password: password 
                }),
            });

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => {
                    // In real app, this would navigate to login
                    console.log('Navigate to login');
                }, 3000);
            } else {
              
                const data = await res.json();
                setError(data.message || 'Password reset failed');
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const getPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    };

    const passwordStrength = getPasswordStrength(password);
    const strengthColors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-lime-400', 'bg-green-400'];
    const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center p-4">
                <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-3xl shadow-2xl w-full max-w-md p-8 text-center relative overflow-hidden">
                    {/* Floating decorative elements */}
                    <div className="absolute top-4 right-16 w-6 h-6 bg-green-200 rounded-full opacity-30 animate-bounce"></div>
                    <div className="absolute bottom-8 left-8 w-4 h-4 bg-emerald-200 rounded-full opacity-40 animate-pulse"></div>
                    <div className="absolute top-12 left-12 w-3 h-3 bg-teal-200 rounded-full opacity-50 animate-bounce delay-300"></div>
                    
                    <div className="mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                            Password Reset Successful!
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Your password has been successfully updated.
                        </p>
                        <p className="text-sm text-gray-500">
                            Redirecting you to login in 3 seconds...
                        </p>
                    </div>
                    
                    <button
                        onClick={() => navigate("/login")}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 relative overflow-hidden">
                {/* Floating decorative elements */}
                <div className="absolute top-4 right-16 w-6 h-6 bg-amber-200 rounded-full opacity-30 animate-bounce"></div>
                <div className="absolute bottom-8 left-8 w-4 h-4 bg-rose-200 rounded-full opacity-40 animate-pulse"></div>
                <div className="absolute top-12 left-12 w-3 h-3 bg-orange-200 rounded-full opacity-50 animate-bounce delay-300"></div>
                
                {/* Header */}
                <div className="relative p-8 pb-6">
                    <div className="text-center">
                        <div className="mb-4">
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                                <Shield className="w-4 h-4" />
                                Secure Reset
                            </span>
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent mb-2">
                            Reset Password
                        </h2>
                        <p className="text-gray-600">Create a new secure password for your account</p>
                    </div>
                </div>

                {/* Form */}
                <div className="px-8 pb-8">
                    <div className="space-y-5">
                        {/* New Password Input */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-amber-500" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="New Password"
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

                        {/* Password Strength Indicator */}
                        {password && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Password Strength:</span>
                                    <span className="text-sm font-medium text-gray-700">
                                        {strengthLabels[passwordStrength - 1] || 'Very Weak'}
                                    </span>
                                </div>
                                <div className="flex space-x-1">
                                    {[1, 2, 3, 4, 5].map((level) => (
                                        <div
                                            key={level}
                                            className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                                                level <= passwordStrength 
                                                    ? strengthColors[passwordStrength - 1] 
                                                    : 'bg-gray-200'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Confirm Password Input */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-amber-500" />
                            </div>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm New Password"
                                className="w-full pl-12 pr-14 py-4 border-2 border-amber-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-white/70 focus:bg-white placeholder-gray-500"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-4 flex items-center"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-5 w-5 text-amber-500 hover:text-amber-600" />
                                ) : (
                                    <Eye className="h-5 w-5 text-amber-500 hover:text-amber-600" />
                                )}
                            </button>
                        </div>

                        {/* Password Match Indicator */}
                        {confirmPassword && (
                            <div className="flex items-center space-x-2">
                                {password === confirmPassword ? (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                    <AlertCircle className="w-4 h-4 text-red-500" />
                                )}
                                <span className={`text-sm ${
                                    password === confirmPassword ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {password === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                                </span>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-4">
                                <p className="text-rose-600 text-sm font-medium">{error}</p>
                            </div>
                        )}

                        {/* Reset Button */}
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isLoading || !password || !confirmPassword}
                            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-2xl font-semibold hover:from-amber-600 hover:to-orange-600 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Resetting Password...</span>
                                </div>
                            ) : (
                                "Reset Password"
                            )}
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <div className="text-gray-600 text-sm">
                            Remember your password?{' '}
                            <button
                                onClick={() => navigate("/login")}
                                className="text-amber-600 hover:text-amber-800 font-medium transition-colors duration-200"
                            >
                                Back to Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;