const env = require('./config/env'); // ✅ central env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

// 🧩 Models
const User = require('./models/User');

// 🧭 Routes
const adminSettingsRoutes = require('./routes/adminSettings');
const adminUserRoutes = require('./routes/adminUsers');
const adminProfileRoutes = require('./routes/adminProfile');
const messageRoutes = require('./routes/messageRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const platformUpdatesRoutes = require('./routes/PlatformUpdatesRoutes'); // ✅ Platform Updates Routes

// 🛡️ Middleware
const { authMiddleware, adminOnlyMiddleware } = require('./middleware/authMiddleware');

const app = express();
const port = env.PORT;

/* ------------------------------ 🌐 CORS Setup ------------------------------ */
const allowedOrigins = [
  env.CLIENT_URL,
  'http://localhost:5173',
  'https://uninterested.vercel.app',
  'https://uninterested.onrender.com',
  'https://glorious-space-trout-9vw7vw7pvgphxvq5-5173.app.github.dev',
  'https://mysterymansion.xyz',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
}));

app.options('', cors());

/* --------------------------- 🌍 Global Middleware -------------------------- */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Cache-Control middleware for API responses
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    res.setHeader('Cache-Control', 'no-store');
  }
  next();
});

// ✅ Static uploads with cache headers
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, filePath) => {
    res.setHeader('Cache-Control', 'public, max-age=31536000');
  }
}));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

/* ---------------------------- ⚙️ MongoDB Setup ----------------------------- */
if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));
}

/* -------------------------- 🧩 Admin Routes ---------------------- */
// Simplified: group all admin routes under /api/admin with auth + admin middleware
const adminRouter = express.Router();
adminRouter.use(authMiddleware, adminOnlyMiddleware);

adminRouter.use('/settings', adminSettingsRoutes);
adminRouter.use('/users', adminUserRoutes);
adminRouter.use('/profile', adminProfileRoutes);

app.use('/api/admin', adminRouter);

/* -------------------------- 💬 Message Routes --------------------- */
app.use('/api/messages', authMiddleware, messageRoutes);

/* -------------------------- 🗨️ Conversation Routes --------------- */
app.use('/api/conversations', authMiddleware, conversationRoutes);

/* -------------------------- 📝 Post Routes --------------------------- */
app.use('/api/posts', postRoutes);

/* -------------------------- 👤 User Routes ------------------------------- */
app.use('/api/users', authMiddleware, userRoutes);

/* -------------------------- 🔐 Auth Routes -------------------------- */
app.use('/api', authRoutes);

/* ---------------------- 🆕 Platform Updates Routes --------------------- */
// Anyone authenticated can view updates, only admins can create
app.use('/api/updates', platformUpdatesRoutes);

/* -------------------------- 🧭 Serve Frontend Build ------------------------ */
const frontendPath = path.join(__dirname, 'client', 'build');

if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath, {
    setHeaders: (res, filePath) => {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
  }));

  app.get('*', (req, res) => {
    const indexPath = path.join(frontendPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.setHeader('Cache-Control', 'no-store');
      res.sendFile(indexPath);
    } else {
      res.status(500).send('❌ index.html not found in build folder');
    }
  });
}

/* ------------------------ ❌ 404 & Global Error Handlers -------------------- */
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('🚨 Global error handler:', err?.message || err);
  if (err instanceof SyntaxError && 'body' in err)
    return res.status(400).json({ error: 'Invalid JSON payload' });
  return res.status(500).json({ error: 'Server error', details: err.message || err });
});

/* ------------------------------ 🚀 Server Init ----------------------------- */
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
}

module.exports = app;
