// backend/utils/firebase.js
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // Replace escaped newlines with actual newlines
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
  storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
});

const bucket = admin.storage().bucket();
module.exports = bucket;