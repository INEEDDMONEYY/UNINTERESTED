// server.js (ESM version)

import 'dotenv/config'; // ✅ loads env variables first
import './utils/cloudinary.js'; // ✅ runs Cloudinary config at import
import env from './config/env.js'; // central env

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import path from 'path';
import multer from 'multer';
import fs from 'fs';
import { fileURLToPath } from 'url';

// 🧩 Models
import User from './models/User.js';

// 🧭 Routes
import adminSettingsRoutes from './routes/adminSettings.js';
import adminUserRoutes from './routes/adminUsers.js';
import adminProfileRoutes from './routes/adminProfile.js';
import messageRoutes from './routes/messageRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';
import postRoutes from './routes/postRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import platformUpdatesRoutes from './routes/PlatformUpdatesRoutes.js';
import forgotPasswordRoutes from './routes/forgotPasswordRoutes.js';
import adminPromoCodeRoutes from './routes/adminPromoCodes.js';
import promoCodeRoutes from './routes/promoCodeRoutes.js';

// 🛡️ Middleware
import { authMiddleware, adminOnlyMiddleware } from './middleware/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = env.PORT;

/* ------------------------------ 🌐 CORS Setup ------------------------------ */
const allowedOrigins = [
  env.CLIENT_URL,
  'http://localhost:5173',
  'https://uninterested.vercel.app',
  'https://uninterested.onrender.com',
  'https://urban-rotary-phone-9vw7vw7prww26j4-5173.app.github.dev',
  'https://mysterymansion.xyz',
];

app.use(
  cors({
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
  })
);

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
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res, filePath) => {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    },
  })
);

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
const adminRouter = express.Router();
adminRouter.use(authMiddleware, adminOnlyMiddleware);

adminRouter.use('/settings', adminSettingsRoutes);
adminRouter.use('/users', adminUserRoutes);
adminRouter.use('/profile', adminProfileRoutes);
adminRouter.use('/promo-codes', adminPromoCodeRoutes);

app.use('/api/admin', adminRouter);

/* -------------------------- 💬 Message Routes --------------------- */
app.use('/api/messages', authMiddleware, messageRoutes);

/* -------------------------- 🗨️ Conversation Routes --------------- */
app.use('/api/conversations', authMiddleware, conversationRoutes);

/* -------------------------- 📝 Post Routes --------------------------- */
app.use('/api/posts', postRoutes);

/* -------------------------- 👤 User Routes ------------------------------- */
app.use('/api/users', authMiddleware, userRoutes);

/* -------------------------- 🎟️ Promo Code Routes ------------------------- */
app.use('/api/promo-codes', authMiddleware, promoCodeRoutes);

/* -------------------------- 🔐 Auth Routes -------------------------- */
app.use('/api', authRoutes);

/* -------------------------- 🔑 Forgot Password Routes -------------------------- */
app.use('/api', forgotPasswordRoutes);

/* ---------------------- 🆕 Platform Updates Routes --------------------- */
app.use('/api/updates', platformUpdatesRoutes);

/* -------------------------- 🧭 Serve Frontend Build ------------------------ */
const frontendPath = path.join(__dirname, 'client', 'build');

if (fs.existsSync(frontendPath)) {
  app.use(
    express.static(frontendPath, {
      setHeaders: (res, filePath) => {
        res.setHeader('Cache-Control', 'public, max-age=31536000');
      },
    })
  );

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

export default app;