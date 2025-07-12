import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { User, Customer, Voucher, Plan, Router, Log } from '../models/index.js';

const router = express.Router();

// Admin Dashboard
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    if (req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin required.'
      });
    }

    // Get statistics with error handling
    const totalCustomers = await Customer.count().catch(() => 0);
    const activeCustomers = await Customer.count({
      where: { status: 'Active' }
    }).catch(() => 0);
    const totalVouchers = await Voucher.count().catch(() => 0);
    const usedVouchers = await Voucher.count({
      where: { status: '1' }
    }).catch(() => 0);
    const totalPlans = await Plan.count().catch(() => 0);
    const totalRouters = await Router.count().catch(() => 0);

    // Get recent activities
    const recentLogs = await Log.findAll({
      limit: 10,
      order: [['created_at', 'DESC']]
    }).catch(() => []);

    // Get recent customers
    const recentCustomers = await Customer.findAll({
      limit: 5,
      order: [['created_at', 'DESC']],
      attributes: ['id', 'username', 'fullname', 'email', 'status', 'created_at']
    }).catch(() => []);

    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      user: req.user,
      stats: {
        totalCustomers,
        activeCustomers,
        totalVouchers,
        usedVouchers,
        totalPlans,
        totalRouters
      },
      recentLogs: recentLogs || [],
      recentCustomers: recentCustomers || []
    });

  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).render('errors/500', {
      title: 'Server Error',
      message: 'Failed to load dashboard'
    });
  }
});

// Admin management placeholder
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin required.'
      });
    }

    const users = await User.findAll({
      order: [['created_at', 'DESC']],
      attributes: ['id', 'username', 'fullname', 'email', 'user_type', 'status', 'last_login']
    });

    res.render('admin/users', {
      title: 'Admin Users',
      user: req.user,
      users
    });

  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).render('errors/500', {
      title: 'Server Error',
      message: 'Failed to load admin users'
    });
  }
});

export default router;
