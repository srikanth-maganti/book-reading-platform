import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import jwt from "jsonwebtoken"
import { db_connection } from "./db/db.js"
import { OAuth2Client } from "google-auth-library";
import User from "./models/user.js";
import { ApiError } from "./utils/api_error.js";

// Import routes
import userRouter from "./routes/users.routes.js"
import notesRouter from "./routes/notes.routes.js"
import libraryRouter from "./routes/library.routes.js"
import recommendationsRouter from "./routes/recommendations.routes.js"
import booksRouter from "./routes/books.routes.js"

dotenv.config();

const app = express();

// Connect to MongoDB and start server
db_connection()
    .then(() => {
        console.log("✅ Connected to database");
        app.listen(process.env.PORT, () => {
            console.log(`🚀 Server running on port: ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log("❌ Database connection failed:", err);
        process.exit(1);
    });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: process.env.BASE_URL,
        methods: "GET, POST, PUT, PATCH, DELETE",
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// API Routes
app.use("/api/users", userRouter);
app.use("/api/notes", notesRouter);
app.use("/api/library", libraryRouter);
app.use("/api/recommendations", recommendationsRouter);
app.use("/api/books", booksRouter);

// Google OAuth authentication
const client = new OAuth2Client(process.env.CLIENT_ID);
app.post("/api/auth/google", async (req, res) => {
    const { token } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name } = payload;

        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({ name, email });
        }

        // Create JWT token for session
        const appToken = await user.generateAccessToken();

        res.json({
            success: true,
            token: appToken,
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
        res.status(401).json({ success: false, message: "Invalid Google token" });
    }
});

// Health check
app.get("/api/health", (req, res) => {
    res.json({ success: true, message: "PageTurn API is running", timestamp: new Date().toISOString() });
});

// 404 handler
app.all("*", (req, res, next) => {
    next(new ApiError(404, "Endpoint not found"));
});

// Error handling
app.use((err, req, res, next) => {
    let { status = 500, message = "Unknown Error" } = err;

    // Handle multer errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        status = 400;
        message = "File too large. Maximum size is 50MB.";
    }

    res.status(status).json({ message, success: false });
});
