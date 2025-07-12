import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import RedisStore from 'connect-redis';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import { connectDB } from './src/config/database.js';
import { connectRedis } from './src/config/redis.js';
import { errorHandler } from './src/middleware/errorHandler.js';
import { authMiddleware } from './src/middleware/auth.js';
import { maintenanceMiddleware } from './src/middleware/maintenance.js';

// Routes
import authRoutes from './src/routes/auth.js';
import dashboardRoutes from './src/routes/dashboard.js';
import customerRoutes from './src/routes/customers.js';
import adminRoutes from './src/routes/admin.js';
import routerRoutes from './src/routes/routers.js';
import planRoutes from './src/routes/plans.js';
import networkRoutes from './src/routes/network.js';
import orderRoutes from './src/routes/orders.js';
import settingsRoutes from './src/routes/settings.js';
import reportsRoutes from './src/routes/reports.js';
import whatsappRoutes from './src/routes/whatsapp.js';
import apiRoutes from './src/routes/api.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy for Vercel
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://unpkg.com"],
      scriptSrc: ["'self'", "https://cdn.jsdelivr.net", "https://unpkg.com"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'"]
    }
  }
}));

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 
    process.env.ALLOWED_ORIGINS?.split(',') || ['https://robdius.vercel.app'] : 
    ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// More restrictive rate limiting for authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/auth', authLimiter);
app.use('/auth', authLimiter);
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Initialize Redis and session
let redisClient;
(async () => {
  try {
    redisClient = await connectRedis();
    console.log('Redis connected successfully');
  } catch (error) {
    console.error('Redis connection failed:', error);
  }
})();

// Session configuration
app.use(session({
  store: redisClient ? new RedisStore({ client: redisClient }) : undefined,
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Custom middleware
app.use(maintenanceMiddleware);

// Routes
app.use('/auth', authRoutes);
app.use('/dashboard', authMiddleware, dashboardRoutes);
app.use('/customers', authMiddleware, customerRoutes);
app.use('/admin', authMiddleware, adminRoutes);
app.use('/routers', authMiddleware, routerRoutes);
app.use('/plans', authMiddleware, planRoutes);
app.use('/network', authMiddleware, networkRoutes);
app.use('/orders', authMiddleware, orderRoutes);
app.use('/settings', authMiddleware, settingsRoutes);
app.use('/reports', authMiddleware, reportsRoutes);
app.use('/whatsapp', authMiddleware, whatsappRoutes);
app.use('/api', apiRoutes);

// Default route
app.get('/', (req, res) => {
  if (req.session.user) {
    if (req.session.user.userType === 'admin') {
      return res.redirect('/dashboard');
    } else {
      return res.redirect('/home');
    }
  }
  res.redirect('/auth/login');
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).render('errors/404', { 
    title: 'Page Not Found',
    message: 'The requested page could not be found.'
  });
});

// Connect to database and start server
async function startServer() {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`\n🚀 Robdius Server running on port ${PORT}`);
      console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard`);
      console.log(`🔐 Admin: http://localhost:${PORT}/admin`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`💾 Database: ${process.env.DB_NAME}@${process.env.DB_HOST}:${process.env.DB_PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

export default app;
