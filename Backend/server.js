const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');

// Load environment variables from .env file
require('dotenv').config({ path: '../.env' });

const app = express();

/*
 * Enable Cross-Origin Resource Sharing (CORS)
 * Allows requests from the frontend application
 */

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3001",
    credentials: true
}));

// Parse incoming JSON request bodies
app.use(express.json());

/*
 * Configure session middleware
 * Used to store user session data securely
 */
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        // Prevent client-side JavaScript from accessing cookies
        httpOnly: true,

        // Use secure cookies only in production (HTTPS)
        secure: process.env.NODE_ENV === 'production',

        // Protect against CSRF attacks
        sameSite: 'lax',

        // Cookie expiration time (24 hours)
        maxAge: 1000 * 60 * 60 * 24
    }
}));

// Connect to MongoDB database
const connectDB = require('./config/db');
connectDB();

/*
 * Default route
 * Returns a welcome message to verify API is running
 */
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the E-Commerce API' });
});

/*
 * 404 Handler
 * Executes when no matching route is found
 */
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

/*
 * Global Error Handler
 * Catches and handles application errors
 */
app.use((err, req, res, next) => {
    console.error(`[ERROR] ${err.message}`);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

// Define server port
const PORT = process.env.PORT || 3000;

/*
 * Start Express server
 */
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

/*
 * Graceful shutdown handler
 * Closes MongoDB connection and HTTP server before exit
 */
const gracefulShutdown = async (signal) => {
    console.log(`\n${signal} received. Shutting down...`);
    await mongoose.connection.close();
    console.log('MongoDB disconnected');
    server.close(() => {
        console.log('Server stopped');
        process.exit(0);
    });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));