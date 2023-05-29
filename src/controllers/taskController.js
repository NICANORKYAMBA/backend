const express = require('express');
const Task = require('../models/Task');
const moment = require('moment-timezone');

const router = express.Router();

// Get all tasks
const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id });
        const tasksWithTimezone = tasks.map(task => {
            const localDueDate = task.dueDate ? moment(task.dueDate).tz(req.user.timezone).format('YYYY-MM-DD HH:mm:ss') : null;
            const localCreatedAt = moment(task.createdAt).tz(req.user.timezone).format('YYYY-MM-DD HH:mm:ss');
            const localUpdatedAt = moment(task.updatedAt).tz(req.user.timezone).format('YYYY-MM-DD HH:mm:ss');
            const localCompletedDate = task.completedDate ? moment(task.completedDate).tz(req.user.timezone).format('YYYY-MM-DD HH:mm:ss') : null;
            return {
                ...task._doc,
                dueDate: localDueDate,
                createdAt: localCreatedAt,
                updatedAt: localUpdatedAt,
                completedDate: localCompletedDate,
            };
        });
        res.json(tasksWithTimezone);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server error\n' });
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
            dueDate: req.body.dueDate ? utcDueDate : null,
            originalDueDate: req.body.dueDate ? utcDueDate : null,
            importance,
            completedDate: null,
            completed: false,
            user: req.user._id,
        });
        await newTask.save();
        res.status(201).json({ message: 'Task created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server error\n' });
    }
};

// Update a task
const updateTask = async (req, res) => {
    try {
        const { title, description, dueDate, importance, completed } = req.body;
        const task = await Task.findById(req.params.id);

        // Check if task exists
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check if user owns task
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

        if (completed) {
            task.completedDate = new Date();
            task.completed = true;
        } else {
            task.completedDate = null;
            task.completed = false;
        }

        // Update the updatedAt field
        task.updatedAt = new Date();

        // Save updated task
        await task.save();
        res.json({ message: 'Task updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server error' });
    }
};

// Extending due date of a task by the specified number of days by the user
const extendDueDate = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        // Check if task exists
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check if user owns task
        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Check if task is already completed
        if (task.completed) {
            return res.status(400).json({ message: 'Task is already completed' });
        }

        // Check if task is already overdue
        if (task.dueDate < task.originalDueDate) {
            return res.status(400).json({ message: 'Due date cannot be before the original due date' });
        }

        // Extend due date by the specified number of days
        const { days } = req.body;

        // Convert due date to UTC
        const utcDueDate = moment.utc(task.dueDate).add(days, 'days').format('YYYY-MM-DD HH:mm:ss');

        // Update the due date
        task.dueDate = utcDueDate;

        // Update the updatedAt field
        task.updatedAt = new Date();

        // Save updated task
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

        // Check if task exists
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check if user owns task
        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Convert due date to local time
        const localDueDate = moment.tz(task.dueDate, req.user.timezone).format('YYYY-MM-DD HH:mm:ss');
        const localCreatedAt = moment.tz(task.createdAt, req.user.timezone).format('YYYY-MM-DD HH:mm:ss');
        const localUpdatedAt = moment.tz(task.updatedAt, req.user.timezone).format('YYYY-MM-DD HH:mm:ss');
        const localCompletedDate = task.completedDate ? moment.tz(task.completedDate, req.user.timezone).format('YYYY-MM-DD HH:mm:ss') : null;
        const tasksWithTimezone = {
            ...task._doc,
            dueDate: localDueDate,
            createdAt: localCreatedAt,
            updatedAt: localUpdatedAt,
            completedDate: localCompletedDate,
        };
        res.json(tasksWithTimezone);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server error' });
    }
};

// Delete a task
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        // Check if task exists
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check if user owns task
        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Delete task
        await task.remove();
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server error' });
    }
};

// Get tasks sorted by due date
const getTasksSortedByDueDate = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id }).sort({ dueDate: 1 });
        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server error\n' });
    }
};

// Get tasks sorted by importance
const getTasksSortedByImportance = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id }).sort({ importance: -1 });
        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server error\n' });
    }
};

// Get tasks sorted by completion status
const getTasksSortedByCompletionStatus = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id }).sort({ completed: 1 });
        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server error\n' });
    }
};

// Get tasks sorted by creation date
const getTasksSortedByCreationDate = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: 1 });
        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server error\n' });
    }
};

// Get tasks sorted by last updated date
const getTasksSortedByLastUpdatedDate = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id }).sort({ updatedAt: 1 });
        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server error\n' });
    }
};

// Get tasks sorted by completed date
const getTasksSortedByCompletedDate = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id }).sort({ completedDate: 1 });
        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server error\n' });
    }
};

// Get tasks sorted by title
const getTasksSortedByTitle = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id }).sort({ title: 1 });
        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server error\n' });
    }
};

// Get tasks sorted by description
const getTasksSortedByDescription = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id }).sort({ description: 1 });
        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server error\n' });
    }
};

module.exports = {
    getAllTasks,
    createTask,
    updateTask,
    getTaskById,
    deleteTask,
    extendDueDate,
    getTasksSortedByDueDate,
    getTasksSortedByImportance,
    getTasksSortedByCompletionStatus,
    getTasksSortedByCreationDate,
    getTasksSortedByLastUpdatedDate,
    getTasksSortedByCompletedDate,
    getTasksSortedByTitle,
    getTasksSortedByDescription,
};