// backend/utils/firebase.js
const admin = require("firebase-admin");

const serviceAccount = process.env.FIREBASE_CREDENTIALS
  ? JSON.parse(process.env.FIREBASE_CREDENTIALS)
  : require("../config/firebase-key.json"); // fallback for local dev

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_BUCKET || "mysterymansion-2f698.appspot.com",
});

const bucket = admin.storage().bucket();
module.exports = bucket;