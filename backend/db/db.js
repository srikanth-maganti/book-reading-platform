import mongoose from "mongoose"
export async function db_connection()
{
    await mongoose.connect('mongodb://127.0.0.1:27017/buyabook');
}