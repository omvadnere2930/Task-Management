import mongoose from 'mongoose';

export const dbStatus = {
  isConnected: false,
  mode: 'memory',
  uri: undefined,
  error: undefined,
};

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cognevance_task_db';
  dbStatus.uri = uri;

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });

    dbStatus.isConnected = true;
    dbStatus.mode = 'mongodb';
    dbStatus.error = undefined;
    console.log(`[MongoDB] Connected successfully to: ${uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);
  } catch (err) {
    dbStatus.isConnected = false;
    dbStatus.mode = 'memory';
    dbStatus.error = err.message;
    console.warn(
      `[MongoDB] Notice: Could not connect to MongoDB server (${err.message}). ` +
      `Activating High-Speed In-Memory Data Store fallback so the application works seamlessly. ` +
      `To connect real MongoDB, start your local mongod or set MONGODB_URI in .env`
    );
  }
};

mongoose.connection.on('disconnected', () => {
  if (dbStatus.mode === 'mongodb') {
    dbStatus.isConnected = false;
    console.warn('[MongoDB] Disconnected from MongoDB server.');
  }
});
