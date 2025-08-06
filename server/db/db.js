import mongoose from "mongoose";

const MONGODB_URI = process.env.DB_URL;

if (!MONGODB_URI) {
    throw new Error("Please define the DB_URL env variable");
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }

    try {
        cached.conn = await cached.promise;
        console.log("MongoDB connected");
    } catch (err) {
        cached.promise = null;
        console.error("MongoDB connection failed:", err);
        throw err;
    }

    return cached.conn;
};
