// backend/utils/cloudinary.js
const { v2: cloudinary } = require("cloudinary");

console.log("📝 Cloudinary env vars at import:", {
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  CLOUDINARY_URL: process.env.CLOUDINARY_URL,
});

// Prefer CLOUDINARY_URL if present, otherwise use individual keys
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({ secure: true });
  console.log("✅ Cloudinary configured using CLOUDINARY_URL");
} else if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  console.log("✅ Cloudinary configured using individual env variables");
} else {
  console.error(
    "❌ Cloudinary not configured! Please set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME + CLOUDINARY_API_KEY + CLOUDINARY_API_SECRET"
  );
}

console.log("🔹 Cloudinary runtime config:", cloudinary.config());

module.exports = cloudinary;