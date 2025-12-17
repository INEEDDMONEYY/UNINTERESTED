const cloudinary = require('cloudinary').v2;
const env = require('../config/env');

// Debug: Always print ENV
console.log("Cloudinary ENV:", {
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY ? "✅ Loaded" : "❌ Missing",
  api_secret: env.CLOUDINARY_API_SECRET ? "✅ Loaded" : "❌ Missing",
});

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
