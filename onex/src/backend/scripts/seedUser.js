const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const env = require("../config/env"); // adjust path if needed
const User = require("../models/User");

async function seed() {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Hash a password for the test user
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Create a new user with default availability
    const user = new User({
      username: "testuser",
      email: "testuser@example.com",
      password: hashedPassword,
      role: "user",
      availability: {
        Monday: "Unavailable",
        Tuesday: "Unavailable",
        Wednesday: "Unavailable",
        Thursday: "Unavailable",
        Friday: "Unavailable",
        Saturday: "Unavailable",
        Sunday: "Unavailable",
      },
    });

    await user.save();
    console.log("🎉 User seeded successfully:", user);

    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error seeding user:", err);
    mongoose.disconnect();
  }
}

seed();
