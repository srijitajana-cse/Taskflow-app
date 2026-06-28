const { validationResult } = require('express-validator');
const Task = require('../models/Task');

// ─── GET /api/tasks ───────────────────────────────────────────────────────────
const getTasks = async (req, res) => {
  try {
    const {
      status,
      priority,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 50,
    } = req.query;

    const filter = {};

    if (status && status !== 'all') filter.status = status;
    if (priority && priority !== 'all') filter.priority = priority;
    if (search && search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const validSortFields = ['createdAt', 'updatedAt', 'title', 'dueDate', 'priority', 'status'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortDir = sortOrder === 'asc' ? 1 : -1;

    const skip = (Math.max(1, parseInt(page)) - 1) * Math.min(100, parseInt(limit));
    const limitNum = Math.min(100, parseInt(limit));

    const [tasks, total] = await Promise.all([
      Task.find(filter).sort({ [sortField]: sortDir }).skip(skip).limit(limitNum).lean({ virtuals: true }),
      Task.countDocuments(filter),
    ]);

    // Stats summary
    const stats = await Task.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const statusCounts = { todo: 0, 'in-progress': 0, done: 0 };
    stats.forEach(({ _id, count }) => {
      if (_id in statusCounts) statusCounts[_id] = count;
    });

    res.json({
      success: true,
      data: tasks,
      meta: {
        total,
        page: parseInt(page),
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
        stats: statusCounts,
      },
    });
  } catch (error) {
    console.error('getTasks error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch tasks', error: error.message });
  }
};

// ─── GET /api/tasks/:id ───────────────────────────────────────────────────────
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).lean({ virtuals: true });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, data: task });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid task ID format' });
    }
    res.status(500).json({ success: false, message: 'Failed to fetch task', error: error.message });
  }
};

// ─── POST /api/tasks ──────────────────────────────────────────────────────────
const createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, message: 'Validation failed', errors: errors.array() });
  }

  try {
    const { title, description, status, priority, dueDate, tags } = req.body;
    const task = await Task.create({ title, description, status, priority, dueDate, tags });
    res.status(201).json({ success: true, message: 'Task created successfully', data: task });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(422).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Failed to create task', error: error.message });
  }
};

// ─── PUT /api/tasks/:id ───────────────────────────────────────────────────────
const updateTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, message: 'Validation failed', errors: errors.array() });
  }

  try {
    const { title, description, status, priority, dueDate, tags } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status, priority, dueDate, tags },
      { new: true, runValidators: true }
    ).lean({ virtuals: true });

    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, message: 'Task updated successfully', data: task });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid task ID format' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(422).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Failed to update task', error: error.message });
  }
};

// ─── PATCH /api/tasks/:id/status ──────────────────────────────────────────────
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['todo', 'in-progress', 'done'];
    if (!validStatuses.includes(status)) {
      return res.status(422).json({ success: false, message: 'Invalid status value' });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).lean({ virtuals: true });

    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, message: 'Status updated', data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update status', error: error.message });
  }
};

// ─── DELETE /api/tasks/:id ────────────────────────────────────────────────────
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid task ID format' });
    }
    res.status(500).json({ success: false, message: 'Failed to delete task', error: error.message });
  }
};

// ─── DELETE /api/tasks ────────────────────────────────────────────────────────
const deleteAllTasks = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status && status !== 'all' ? { status } : {};
    const result = await Task.deleteMany(filter);
    res.json({ success: true, message: `Deleted ${result.deletedCount} tasks` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete tasks', error: error.message });
  }
};

module.exports = { getTasks, getTaskById, createTask, updateTask, updateTaskStatus, deleteTask, deleteAllTasks };
