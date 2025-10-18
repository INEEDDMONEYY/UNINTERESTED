const env = require('./config/env'); // ✅ central env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require('multer');

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

const app = express();
const port = env.PORT;

/* ------------------------------ 🌐 CORS Setup ------------------------------ */
const allowedOrigins = [
  env.CLIENT_URL,
  'https://uninterested.vercel.app',
  'https://uninterested.onrender.com',
  'https://glorious-space-trout-9vw7vw7pvgphxvq5-5173.app.github.dev',
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || allowedOrigins.includes(origin) || env.NODE_ENV !== 'production') {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
    );
  } else {
    return res.status(403).json({ error: 'Not allowed by CORS' });
  }

  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

/* --------------------------- 🌍 Global Middleware -------------------------- */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

/* ---------------------------- ⚙️ MongoDB Setup ----------------------------- */
mongoose
  .connect(env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

/* --------------------------- 🔐 Auth Middleware ---------------------------- */
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) return res.status(401).json({ error: 'Unauthorized - no token provided' });

    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

const verifyAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admins only' });
  next();
};

/* -------------------------- 🧩 Admin Routes ---------------------- */
app.use('/api/admin/settings', authenticateToken, verifyAdmin, adminSettingsRoutes);
app.use('/api/admin/users', authenticateToken, verifyAdmin, adminUserRoutes);
app.use('/api/admin/profile', authenticateToken, verifyAdmin, adminProfileRoutes);

/* -------------------------- 💬 Message Routes --------------------- */
app.use('/api/messages', authenticateToken, messageRoutes);

/* -------------------------- 🗨️ Conversation Routes --------------- */
app.use('/api/conversations', authenticateToken, conversationRoutes);

/* -------------------------- 📝 Post Routes --------------------------- */
app.use('/api/posts', postRoutes);

/* -------------------------- 👤 User Routes ------------------------------- */
app.use('/api/user', authenticateToken, userRoutes);

/* ----------------------------- 🔑 Auth Routes ------------------------------ */
// Signin, Signup, Logout routes remain unchanged and use env.JWT_SECRET

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
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
