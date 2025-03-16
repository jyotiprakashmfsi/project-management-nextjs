"use server"

import mongoose from "mongoose";
declare global {
  var mongoose: any;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  const MONGODB_URI = process.env.MONGODB_URI!;
  console.log("Connecting to MongoDB")

  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local",
    );
  }

  if (cached.conn) {
    console.log("Using cached connection");
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("Connected to MongoDB");
      return mongoose;
    });
  }
  try {
    cached.conn = await cached.promise;
    console.log("Using cached connection");
  } catch (e) {
    console.error("Failed to connect to MongoDB:", e);
    cached.promise = null;
    throw e;
  }
  return cached.conn;
}

export default dbConnect;