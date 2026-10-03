import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

type GlobalWithMongoose = typeof globalThis & {
  mongoose?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

const globalForMongoose = globalThis as GlobalWithMongoose;

export async function connectDB() {
  if (!MONGODB_URI) throw new Error("MONGODB_URI is not configured");
  if (globalForMongoose.mongoose?.conn) {
    return globalForMongoose.mongoose.conn;
  }

  if (!globalForMongoose.mongoose) {
    globalForMongoose.mongoose = {
      conn: null,
      promise: null,
    };
  }

  if (!globalForMongoose.mongoose.promise) {
    globalForMongoose.mongoose.promise = mongoose.connect(MONGODB_URI).catch((error) => {
      if (globalForMongoose.mongoose) globalForMongoose.mongoose.promise = null;
      throw error;
    });
  }

  globalForMongoose.mongoose.conn =
    await globalForMongoose.mongoose.promise;

  return globalForMongoose.mongoose.conn;
}
