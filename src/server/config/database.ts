import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tempo';

export const connectDatabase = async () => {
  try {
    console.log('⏳ Connecting to MongoDB...');
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    
    console.log('✓ MongoDB connected successfully');
    console.log(`  Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('✗ MongoDB connection failed');
    if (error instanceof Error) {
      console.error(`  Error: ${error.message}`);
    }
    if (!process.env.MONGODB_URI) {
      console.error('  Hint: Set MONGODB_URI in your .env file for Atlas connection');
    } else {
      console.error('  Hint: Check your Atlas connection string, username, password, and IP whitelist');
    }
    process.exit(1);
  }

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠ MongoDB disconnected');
  });

  mongoose.connection.on('error', (err) => {
    console.error('✗ MongoDB error:', err.message);
  });
};
