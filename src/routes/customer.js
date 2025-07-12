import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { Customer, Plan, Voucher, PaymentGateway } from '../models/index.js';

const router = express.Router();

// Customer Dashboard
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    if (req.user.userType !== 'customer') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Customer access required.'
      });
    }

    // Get customer details
    const customer = await Customer.findByPk(req.user.id);
    if (!customer) {
      return res.status(404).render('errors/404', {
        title: 'Customer Not Found',
        message: 'Customer account not found'
      });
    }

    // Get available plans
    const plans = await Plan.findAll({
      where: { enabled: 1 },
      order: [['price', 'ASC']]
    }).catch(() => []);

    // Get customer's vouchers
    const vouchers = await Voucher.findAll({
      where: { user: customer.username },
      order: [['generated_date', 'DESC']],
      limit: 10
    }).catch(() => []);

    // Get payment history
    const payments = await PaymentGateway.findAll({
      where: { username: customer.username },
      order: [['created_date', 'DESC']],
      limit: 10
    }).catch(() => []);

    res.render('customer/dashboard', {
      title: 'Customer Dashboard',
      user: customer,
      customer,
      plans: plans || [],
      vouchers: vouchers || [],
      payments: payments || []
    });

  } catch (error) {
    console.error('Customer dashboard error:', error);
    res.status(500).render('errors/500', {
      title: 'Server Error',
      message: 'Failed to load dashboard'
    });
  }
});

// Customer Profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    if (req.user.userType !== 'customer') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Customer access required.'
      });
    }

    const customer = await Customer.findByPk(req.user.userId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.render('customer/profile', {
      title: 'My Profile',
      user: req.user,
      customer
    });

  } catch (error) {
    console.error('Customer profile error:', error);
    res.status(500).render('errors/500', {
      title: 'Server Error',
      message: 'Failed to load profile'
    });
  }
});

// Customer Plans
router.get('/plans', authMiddleware, async (req, res) => {
  try {
    if (req.user.userType !== 'customer') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Customer access required.'
      });
    }

    const plans = await Plan.findAll({
      where: { enabled: 1 },
      order: [['price', 'ASC']]
    });

    res.render('customer/plans', {
      title: 'Available Plans',
      user: req.user,
      plans
    });

  } catch (error) {
    console.error('Customer plans error:', error);
    res.status(500).render('errors/500', {
      title: 'Server Error',
      message: 'Failed to load plans'
    });
  }
});

export default router;
