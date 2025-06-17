//Maps task endpoints to controllers.
//uses auth middleware for protection.

const express = require('express');
const router = express.Router();
const {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const auth = require('../middleware/auth');

router.route('/').get(auth, getAllTasks).post(auth, createTask);
router.route('/:id').get(auth, getTask).put(auth, updateTask).delete(auth, deleteTask);

module.exports = router;