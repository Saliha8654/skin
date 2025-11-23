// Load environment variables from .env file
require('dotenv').config();

// Load additional environment variables if not already set
if (!process.env.PORT) process.env.PORT = '5000';
if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';
if (!process.env.FRONTEND_URL) process.env.FRONTEND_URL = 'http://localhost:5173';

// Start the server
require('./backend/src/server.js');