// app.js
const env = require('./config/env');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

// Models
const User = require('./models/User');

// Routes
const adminSettingsRoutes = require('./routes/adminSettings');
const adminUserRoutes = require('./routes/adminUsers');
const adminProfileRoutes = require('./routes/adminProfile');
const messageRoutes = require('./routes/messageRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

/* CORS, Middleware, Routes, MongoDB, etc. — keep all your logic here */

// (Paste everything from your current server.js EXCEPT the app.listen part)

module.exports = app;
