import mongoose from "mongoose"

const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongodb:27017/bookreadingplatform';

export async function db_connection() {
    await mongoose.connect(MONGO_URI);
}