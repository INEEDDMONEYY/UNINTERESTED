// app.js
import 'dotenv/config';// ✅ central env

import env from './config/env.js';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';

// Models
import User from './models/User.js';

// Routes
import adminSettingsRoutes from './routes/adminSettings.js';
import adminUserRoutes from './routes/adminUsers.js';
import adminProfileRoutes from './routes/adminProfile.js';
import messageRoutes from './routes/messageRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';
import postRoutes from './routes/postRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

/* CORS, Middleware, Routes, MongoDB, etc. — keep all your logic here */

// (Paste everything from your current server.js EXCEPT the app.listen part)

export default app;
