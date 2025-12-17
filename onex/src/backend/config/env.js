// backend/config/env.js
require("dotenv").config();
const path = require("path");

// Validate required env variables
const requiredVars = [
  "MONGO_URI",
  "JWT_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "RESEND_API_KEY",
];

requiredVars.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`⚠️ Warning: ${key} is not defined in environment`);
  }
});

const env = {
  PORT: process.env.PORT || 5020,
  NODE_ENV: process.env.NODE_ENV || "development",

  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,

  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",

  // ☁️ Cloudinary
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  // ✉️ Email (Resend)
  RESEND_API_KEY: process.env.RESEND_API_KEY,

  // 📁 Uploads
  UPLOAD_PATH: path.join(__dirname, "../uploads"),
  PROFILE_PICS_PATH: path.join(__dirname, "../uploads/profile-pics"),
};

module.exports = env;
