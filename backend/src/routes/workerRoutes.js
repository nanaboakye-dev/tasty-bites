const express = require('express');
const {
  getWorkers,
  createWorker,
  deleteWorker,
  createWorkerSchedule,
  getAllSchedules,
  deleteSchedule,
} = require('../controllers/workerController');
const {
  authMiddleware,
  requireAdmin,
} = require('../middleware/authMiddleware');

const router = express.Router();

// Workers CRUD
router.get('/', authMiddleware, requireAdmin, getWorkers);
router.post('/', authMiddleware, requireAdmin, createWorker);
router.delete('/:id', authMiddleware, requireAdmin, deleteWorker);

// Schedules
router.get('/schedules', authMiddleware, requireAdmin, getAllSchedules);
router.post(
  '/:id/schedules',
  authMiddleware,
  requireAdmin,
  createWorkerSchedule
);
router.delete(
  '/schedules/:id',
  authMiddleware,
  requireAdmin,
  deleteSchedule
);

module.exports = router;
