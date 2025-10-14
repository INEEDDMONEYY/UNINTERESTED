// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

// 🧩 Models
const User = require('./models/User');

// 🧭 Routes
const adminSettingsRoutes = require('./routes/adminSettings');
const adminUserRoutes = require('./routes/adminUsers');
const adminProfileRoutes = require('./routes/adminProfile');
const messageRoutes = require('./routes/messageRoutes'); // ✅ Messages
const conversationRoutes = require('./routes/conversationRoutes'); // ✅ Conversations
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes'); // ✅ Users

const app = express();
const port = process.env.PORT || 5020;

/* ------------------------------ 🌐 CORS Setup ------------------------------ */
const allowedOrigins = [
  'https://uninterested.vercel.app',
  'http://localhost:5173',
  'http://localhost:5020',
  'https://glorious-space-trout-9vw7vw7pvgphxvq5-5173.app.github.dev',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      console.warn('CORS blocked origin:', origin);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  })
);

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
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
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

    if (!token) {
      console.warn('No token supplied - request blocked:', req.method, req.originalUrl);
      return res.status(401).json({ error: 'Unauthorized - no token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log('✅ Token verified for user:', decoded.id, 'role:', decoded.role);
    next();
  } catch (err) {
    console.warn('Token verification failed:', err.message);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

const verifyAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  if (req.user.role !== 'admin') {
    console.warn('Access denied - non-admin user attempted admin route:', req.user.id);
    return res.status(403).json({ error: 'Admins only' });
  }
  next();
};

/* -------------------------- 🧩 Protected Admin Routes ---------------------- */
app.use('/api/admin/settings', authenticateToken, verifyAdmin, adminSettingsRoutes);
app.use('/api/admin/users', authenticateToken, verifyAdmin, adminUserRoutes);
app.use('/api/admin/profile', authenticateToken, verifyAdmin, adminProfileRoutes);

/* -------------------------- 💬 Message Routes (Step 2) --------------------- */
app.use('/api/messages', authenticateToken, messageRoutes);

/* -------------------------- 🗨️ Conversation Routes (Step 2) --------------- */
app.use('/api/conversations', authenticateToken, conversationRoutes);

/* -------------------------- 📝 Post Routes (NEW) --------------------------- */
app.use('/api/posts', postRoutes);

/* -------------------------- 👤 User Routes ------------------------------- */
app.use('/api/user', authenticateToken, userRoutes);

/* ----------------------------- 🔑 Auth Routes ------------------------------ */
app.post('/signin', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username: new RegExp(`^${username}$`, 'i') });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    });

    return res.status(200).json({
      message: 'Signin successful',
      user: { username: user.username, role: user.role, profilePic: user.profilePic },
      token,
    });
  } catch (err) {
    console.error('❌ Signin error:', err);
    return res.status(500).json({ error: 'Signin failed' });
  }
});

app.post('/signup', async (req, res) => {
  const { username, password, role = 'user' } = req.body;
  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ error: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, password: hashed, role });

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    });

    return res.status(201).json({
      message: 'Signup successful',
      user: { username: newUser.username, role: newUser.role, profilePic: newUser.profilePic },
      token,
    });
  } catch (err) {
    console.error('❌ Signup error:', err);
    return res.status(500).json({ error: 'Signup failed' });
  }
});

app.post('/logout', (req, res) => {
  res.clearCookie('token', { sameSite: 'None', secure: true });
  return res.status(200).json({ message: 'Logged out successfully' });
});

/* ----------------------------- 📊 Admin Stats ------------------------------ */
app.get('/admin/stats', authenticateToken, verifyAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    return res.json({ totalUsers, totalAdmins });
  } catch (err) {
    console.error('Stats error:', err);
    return res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

/* ---------------------------- 🧭 Utility Routes ---------------------------- */
app.get('/', (req, res) => res.send(`✅ Server running on port ${port}`));
app.get('/test-admin-route', (req, res) => res.send('✅ Admin routes working'));

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
