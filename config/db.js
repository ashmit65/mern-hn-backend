const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.DATABASE_URL || process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('Missing MongoDB URI. Set DATABASE_URL (or MONGODB_URI) in .env');
  }

  await mongoose.connect(mongoUri);
  console.log('MongoDB connected');
};

module.exports = connectDB;
