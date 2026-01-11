import mongoose from 'mongoose';
import { config } from './index';

export const connectDB = async () => {
  try {
    // Attempt to establish connection using the URI from our config
    await mongoose.connect(config.mongodbUri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    // Log the specific error and shut down the process if the DB is unreachable
    console.error('MongoDB connection error:', error);
    process.exit(1); 
  }
};