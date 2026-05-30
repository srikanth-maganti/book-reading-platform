import User from "../models/user.js";
import { ApiError } from "../utils/api_error.js";

// Register a new user
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already registered" });
        }

        const user = await User.create({ name, email, password });
        const token = await user.generateAccessToken();

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                preferences: user.preferences,
                readingStats: user.readingStats
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Registration failed" });
    }
};

// Login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const isPasswordValid = await user.verifyPassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = await user.generateAccessToken();

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                preferences: user.preferences,
                readingStats: user.readingStats
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Login failed" });
    }
};

// Get current user profile
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password -passwordresettoken -passwordresetexpiry');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to fetch profile" });
    }
};

// Update user preferences
export const updatePreferences = async (req, res) => {
    try {
        const { genres, readingTheme, fontSize } = req.body;
        const updateData = {};

        if (genres) updateData['preferences.genres'] = genres;
        if (readingTheme) updateData['preferences.readingTheme'] = readingTheme;
        if (fontSize) updateData['preferences.fontSize'] = fontSize;

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { $set: updateData },
            { new: true }
        ).select('-password -passwordresettoken -passwordresetexpiry');

        res.json({ success: true, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to update preferences" });
    }
};