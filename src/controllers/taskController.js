const express = require('express');
const Task = require('../models/Task');
const moment = require('moment-timezone');

const router = express.Router();

// Get all tasks
const getAllTasks = async (req, res) => {
  try {
    const { userId } = req.params;

    const tasks = await Task.find({ user: userId });
    const tasksWithTimezone = tasks.map((task) => {
      const { dueDate, createdAt, updatedAt, completedDate } = task;
      const formatDateTime = (dateTime) =>
        moment(dateTime).tz(req.user.timezone).format('YYYY-MM-DD HH:mm:ss');
      return {
        ...task._doc,
        dueDate: dueDate ? formatDateTime(dueDate) : null,
        createdAt: formatDateTime(createdAt),
        updatedAt: formatDateTime(updatedAt),
        completedDate: completedDate ? formatDateTime(completedDate) : null,
      };
    });
    res.json(tasksWithTimezone);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server error' });
  }
};

// Create a new task
const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, importance } = req.body;
    const utcDueDate = moment.tz(dueDate, req.user.timezone).utc().format('YYYY-MM-DD HH:mm:ss');
    const newTask = new Task({
      title,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
      dueDate: dueDate ? utcDueDate : null,
      originalDueDate: dueDate ? utcDueDate : null,
      importance,
      completedDate: null,
      completed: false,
      user: req.user._id,
    });
    await newTask.save();
    res.status(201).json({ message: 'Task created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server error' });
  }
};

// Update a task
const updateTask = async (req, res) => {
  try {
    const { title, description, dueDate, importance, completed } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const utcDueDate = moment.tz(dueDate, req.user.timezone).utc().format('YYYY-MM-DD HH:mm:ss');

    if (utcDueDate < task.originalDueDate) {
      return res.status(400).json({ message: 'Due date cannot be before the original due date' });
    }

    task.title = title;
    task.description = description;
    task.updatedAt = new Date();
    task.dueDate = dueDate ? utcDueDate : null;
    task.importance = importance;
    task.completed = completed;
    task.completedDate = completed ? new Date() : null;

    await task.save();
    res.json({ message: 'Task updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server error' });
  }
};

// Extend due date of a task by the specified number of days
const extendDueDate = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (task.completed) {
      return res.status(400).json({ message: 'Task is already completed' });
    }

    if (task.dueDate < task.originalDueDate) {
      return res.status(400).json({ message: 'Due date cannot be before the original due date' });
    }

    const { days } = req.body;
    const utcDueDate = moment.utc(task.dueDate).add(days, 'days').format('YYYY-MM-DD HH:mm:ss');

    task.dueDate = utcDueDate;
    task.updatedAt = new Date();

    await task.save();
    res.json({ message: 'Due date extended successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server error' });
  }
};

// Get a specific task
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { dueDate, createdAt, updatedAt, completedDate } = task;
    const formatDateTime = (dateTime) => moment(dateTime, req.user.timezone).format('YYYY-MM-DD HH:mm:ss');

    const taskWithTimezone = {
      ...task._doc,
      dueDate: dueDate ? formatDateTime(dueDate) : null,
      createdAt: formatDateTime(createdAt),
      updatedAt: formatDateTime(updatedAt),
      completedDate: completedDate ? formatDateTime(completedDate) : null,
    };
    res.json(taskWithTimezone);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server error' });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await task.remove();
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server error' });
  }
};

// Get tasks sorted by a specific field
const getTasksSortedByField = async (req, res) => {
  try {
    const { field } = req.params;
    const tasks = await Task.find({ user: req.user._id }).sort({ [field]: 1 });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server error' });
  }
};

module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  getTaskById,
  deleteTask,
  extendDueDate,
  getTasksSortedByField,
};