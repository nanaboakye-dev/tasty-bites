const Worker = require('../models/Worker');
const Schedule = require('../models/Schedule');

// GET /api/workers (admin)
const getWorkers = async (req, res) => {
  try {
    const workers = await Worker.find().sort({ createdAt: -1 });
    res.json(workers);
  } catch (error) {
    console.error('getWorkers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/workers (admin)
const createWorker = async (req, res) => {
  try {
    const { name, role, phone, active } = req.body;

    if (!name || !role) {
      return res.status(400).json({ message: 'Name and role are required' });
    }

    const worker = await Worker.create({
      name,
      role,
      phone,
      active: active !== undefined ? active : true,
    });

    res.status(201).json(worker);
  } catch (error) {
    console.error('createWorker error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/workers/:id (admin)
const deleteWorker = async (req, res) => {
  try {
    const { id } = req.params;

    const worker = await Worker.findByIdAndDelete(id);

    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    res.json({ message: 'Worker removed successfully' });
  } catch (error) {
    console.error('deleteWorker error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ===================================
//       SCHEDULER CONTROLLERS
// ===================================

// POST /api/workers/:id/schedules (admin)
// body: { start, end }  (ISO strings or anything Date can parse)
const createWorkerSchedule = async (req, res) => {
  try {
    const { id: workerId } = req.params;
    const { start, end } = req.body;

    if (!start || !end) {
      return res
        .status(400)
        .json({ message: 'Start and end times are required.' });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res
        .status(400)
        .json({ message: 'Invalid date format for start or end.' });
    }

    if (endDate <= startDate) {
      return res
        .status(400)
        .json({ message: 'End time must be after start time.' });
    }

    // Ensure worker exists
    const worker = await Worker.findById(workerId);
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found.' });
    }

    // Check for overlapping shifts:
    // Overlap if existing.start < newEnd AND existing.end > newStart
    const overlapping = await Schedule.findOne({
      worker: workerId,
      start: { $lt: endDate },
      end: { $gt: startDate },
    });

    if (overlapping) {
      return res.status(400).json({
        message: 'This worker already has a shift during that time.',
      });
    }

    const schedule = await Schedule.create({
      worker: workerId,
      start: startDate,
      end: endDate,
    });

    const populated = await Schedule.findById(schedule._id).populate(
      'worker',
      'name role phone'
    );

    res.status(201).json(populated);
  } catch (error) {
    console.error('createWorkerSchedule error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/workers/schedules (admin)
const getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find()
      .populate('worker', 'name role phone')
      .sort({ start: 1 });

    res.json(schedules);
  } catch (error) {
    console.error('getAllSchedules error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/workers/schedules/:id (admin)
const deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;

    const schedule = await Schedule.findByIdAndDelete(id);

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found.' });
    }

    res.json({ message: 'Schedule removed successfully.' });
  } catch (error) {
    console.error('deleteSchedule error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getWorkers,
  createWorker,
  deleteWorker,
  createWorkerSchedule,
  getAllSchedules,
  deleteSchedule,
};
