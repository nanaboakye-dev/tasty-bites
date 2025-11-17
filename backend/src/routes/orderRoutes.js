const express = require('express');
const {
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getSalesStats,
  assignOrderWorker,
} = require('../controllers/orderController');
const {
  authMiddleware,
  requireUser,
  requireAdmin,
} = require('../middleware/authMiddleware');

const router = express.Router();

// User orders
router.get('/my', authMiddleware, requireUser, getMyOrders);

// Admin sales stats
router.get('/stats', authMiddleware, requireAdmin, getSalesStats);

// Admin orders - list all
router.get('/', authMiddleware, requireAdmin, getAllOrders);

// Admin order worker assignment
router.patch('/:id/assign', authMiddleware, requireAdmin, assignOrderWorker);

// Admin order status update
router.patch('/:id/status', authMiddleware, requireAdmin, updateOrderStatus);

module.exports = router;
