import mongoose from 'mongoose';

const cache = globalThis as unknown as { _mongo?: Promise<typeof mongoose> };

export function connectDB() {
  cache._mongo ??= mongoose.connect(process.env.MONGO_URI!);
  return cache._mongo;
}