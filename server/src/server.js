const app = require('./app');
const connectDB = require('./config/db');
const { PORT } = require('./config/env');
const mongoose = require('mongoose');
const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`RentEase API running on port ${PORT}`);
    });
    const gracefulShutdown = async (signal) => {
      console.log(`\n${signal} received. Shutting down...`);
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
      server.close(() => {
        console.log('HTTP server stopped');
        process.exit(0);
      });
    };
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};
startServer();