//Implements CRUD operations for tasks.
//This is a controller in MVC , it hands the business logic

const Task = require('../models/Task');
const { body, validationResult } = require('express-validator'); //validates inputs

const validateTask = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().optional().isLength({ max: 500 }).withMessage('Description too long'),
];

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createTask = [
  validateTask,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const task = await Task.create({ ...req.body, user: req.user.id });
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ message: 'Invalid task data', error: error.message });
    }
  },
];

const updateTask = [
  validateTask,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const task = await Task.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id }, //ensures tasks are user- specific
        req.body,
        { new: true, runValidators: true }
      );
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.status(200).json(task);
    } catch (error) {
      res.status(400).json({ message: 'Invalid task data', error: error.message });
    }
  },
];

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};