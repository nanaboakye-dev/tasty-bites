const Order = require('../models/Order');
const Worker = require('../models/Worker');

// GET /api/orders/my   (user)
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.foodItem')
      .populate('assignedWorker', 'name role phone') // ✅ NEW
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('getMyOrders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/orders       (admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.foodItem')
      .populate('assignedWorker', 'name role phone')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('getAllOrders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// PATCH /api/orders/:id/status   (admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // ORIGINAL allowed statuses (includes "delivered")
    const allowedStatuses = [
      'pending',
      'preparing',
      'delivered',
      'completed',
      'cancelled',
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate('user', 'name email')
      .populate('items.foodItem')
      .populate('assignedWorker', 'name role phone');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('updateOrderStatus error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ===============================
//     SALES METRICS (ADMIN)
// ===============================

// Daily: 12:00am–11:59pm (calendar day)
// Weekly: last 7 days (rolling, completed + delivered only)
// Monthly: last 30 days (rolling, completed + delivered only)
const getSalesStats = async (req, res) => {
  try {
    // Daily can include all paid/active states
    const DAILY_STATUSES = ['paid', 'preparing', 'completed', 'delivered'];

    // Weekly / Monthly should only count finished orders
    const FINISHED_STATUSES = ['completed', 'delivered'];

    const now = new Date();

    // ----- DAILY: from 12:00am today to just before 12:00am tomorrow -----
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

    // ----- WEEKLY / MONTHLY (rolling) -----
    const weeklyStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthlyStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const getStats = async (startDate, endDate = null, statuses) => {
      const createdAtQuery = { $gte: startDate };
      if (endDate) {
        createdAtQuery.$lt = endDate;
      }

      const orders = await Order.find({
        status: { $in: statuses },
        createdAt: createdAtQuery,
      });

      const total = orders.reduce((sum, o) => sum + o.totalAmount, 0);
      return { total, count: orders.length };
    };

    // Daily = calendar day (12:00am–11:59pm), all active/paid-like
    const daily = await getStats(startOfToday, startOfTomorrow, DAILY_STATUSES);
    // Weekly / Monthly = rolling windows, only completed + delivered
    const weekly = await getStats(weeklyStart, null, FINISHED_STATUSES);
    const monthly = await getStats(monthlyStart, null, FINISHED_STATUSES);

    res.json({ daily, weekly, monthly });
  } catch (error) {
    console.error('getSalesStats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ===============================
//   ASSIGN WORKER TO AN ORDER
// ===============================
// PATCH /api/orders/:id/assign   (admin)
// body: { workerId }  (or null/"" to unassign)
const assignOrderWorker = async (req, res) => {
  try {
    const { id } = req.params;
    const { workerId } = req.body;

    // If workerId is provided, verify worker exists
    let update = { assignedWorker: null };

    if (workerId) {
      const worker = await Worker.findById(workerId);
      if (!worker) {
        return res.status(404).json({ message: 'Worker not found' });
      }
      update.assignedWorker = worker._id;
    }

    const order = await Order.findByIdAndUpdate(id, update, {
      new: true,
    })
      .populate('user', 'name email')
      .populate('items.foodItem')
      .populate('assignedWorker', 'name role phone');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('assignOrderWorker error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getSalesStats,
  assignOrderWorker,
};
