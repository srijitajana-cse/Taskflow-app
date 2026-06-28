const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  deleteAllTasks,
} = require('../controllers/taskController');
const { taskValidationRules } = require('../middleware/validators');

// GET  /api/tasks          — list all (with filters, search, sort, pagination)
// POST /api/tasks          — create new task
router.route('/')
  .get(getTasks)
  .post(taskValidationRules, createTask)
  .delete(deleteAllTasks);

// GET    /api/tasks/:id    — get single task
// PUT    /api/tasks/:id    — full update
// DELETE /api/tasks/:id    — delete
router.route('/:id')
  .get(getTaskById)
  .put(taskValidationRules, updateTask)
  .delete(deleteTask);

// PATCH /api/tasks/:id/status — quick status toggle
router.patch('/:id/status', updateTaskStatus);

module.exports = router;
