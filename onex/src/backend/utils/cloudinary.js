// backend/utils/cloudinary.js

// Force dotenv to load FIRST — BEFORE env.js
require("dotenv").config();

const cloudinary = require("cloudinary").v2;

// Directly use process.env instead of env.js to avoid load ordering issues
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

// Debug: show raw env (this prints BEFORE cloudinary.config)
console.log("All ENV keys:", Object.keys(process.env));

console.log("🧪 Cloudinary ENV Loaded:", {
  cloud_name: cloudName,
  api_key: apiKey ? "✅ Loaded" : "❌ Missing",
  api_secret: apiSecret ? "✅ Loaded" : "❌ Missing",
});

if (!cloudName || !apiKey || !apiSecret) {
  console.error("❌ Missing Cloudinary environment variables.");
}

// Apply config
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

// Debug: confirm Cloudinary internal config
console.log("🟦 Final Cloudinary Config:", cloudinary.config());

module.exports = cloudinary;
