import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    passwordresettoken: {
        type: String,
        default: undefined,
    },
    passwordresetexpiry: {
        type: Date,
        default: undefined,
    },
    // Reading platform specific fields
    preferences: {
        genres: [{ type: String }],
        readingTheme: {
            type: String,
            enum: ['light', 'dark', 'sepia'],
            default: 'dark'
        },
        fontSize: {
            type: Number,
            default: 18
        }
    },
    readingStats: {
        totalBooksRead: { type: Number, default: 0 },
        totalNotesCreated: { type: Number, default: 0 },
        totalReadingTime: { type: Number, default: 0 } // in minutes
    }
}, { timestamps: true })

UserSchema.pre("save", async function (next) {
    if (this.isModified("password") && this.password) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})

UserSchema.methods.verifyPassword = async function (password) {
    if (!this.password) return false;
    const passwordmatch = await bcrypt.compare(password, this.password);
    return passwordmatch;
}

UserSchema.methods.generateAccessToken = async function () {
    const token = await jwt.sign(
        { userId: this._id, email: this.email, name: this.name },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
    return token;
}

const User = mongoose.model("User", UserSchema);
export default User;