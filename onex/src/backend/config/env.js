// backend/config/env.js
require('dotenv').config();
const path = require('path');
const fs = require('fs');

// Validate required env variables
const requiredVars = ['MONGO_URI', 'JWT_SECRET'];
requiredVars.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`⚠️ Warning: ${key} is not defined in .env`);
  }
});

const env = {
  PORT: process.env.PORT || 5020,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/yourdb',
  JWT_SECRET: process.env.JWT_SECRET || 'default_secret_key',
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173', // for CORS
  UPLOAD_PATH: path.join(__dirname, '../uploads'), // central upload path
  PROFILE_PICS_PATH: path.join(__dirname, '../uploads/profile-pics'), // profile pictures
};

module.exports = env;
