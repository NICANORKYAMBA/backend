const express = require("express");
const Task = require("../models/Task");
const moment = require("moment-timezone");

const router = express.Router();

// Get all user tasks
const getAllTasks = async (req, res) => {
  try {
    const { userId } = req.params;
    const tasks = await Task.find({ userId: userId });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server error" });
  }
};

// Create a new task
const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, importance } = req.body;
    const utcDueDate = moment
      .tz(dueDate, req.user.timezone)
      .utc()
      .format("YYYY-MM-DD HH:mm:ss");
    const newTask = new Task({
      title,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
      dueDate: utcDueDate ? utcDueDate : null,
      originalDueDate: utcDueDate ? utcDueDate : null,
      importance,
      completedDate: null,
      completed: false,
      userId: req.user._id,
    });

    await newTask.save();
    res.status(201).json({ message: "Task created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server error" });
  }
};

// Get task by Id
const getTaskById = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const task = await Task.findOne({ _id: taskId, userId: req.user._id });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const {
      _id,
      title,
      description,
      createdAt,
      updatedAt,
      dueDate,
      originalDueDate,
      importance,
      completed,
      completedDate,
    } = task;

    const taskWithTimezone = {
      _id,
      title,
      description,
      createdAt,
      updatedAt,
      dueDate,
      originalDueDate,
      importance,
      completed,
      completedDate,
    };

    res.json(taskWithTimezone);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server error" });
  }
};

// Update Task
const updateTask = async (req, res) => {
  try {
    const { title, description, dueDate, importance, completed } = req.body;
    const taskId = req.params.taskId;
    const task = await Task.findOne({ _id: taskId, userId: req.user._id });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Check if any changes were made to the task
    if (
      !title &&
      !description &&
      !dueDate &&
      !importance &&
      completed === undefined
    ) {
      return res.json({ message: "No changes made to the task" });
    }

    // Update task properties if provided
    if (title) {
      task.title = title;
    }

    if (description) {
      task.description = description;
    }

    if (dueDate) {
      const utcDueDate = moment
        .tz(dueDate, req.user.timezone)
        .utc()
        .format("YYYY-MM-DD HH:mm:ss");

      if (!moment(utcDueDate, "YYYY-MM-DD HH:mm:ss", true).isValid()) {
        return res.status(400).json({ message: "Invalid due date format" });
      }

      if (utcDueDate < task.originalDueDate) {
        return res
          .status(400)
          .json({ message: "Due date cannot be before the original due date" });
      }

      task.dueDate = utcDueDate;
    }

    if (importance) {
      task.importance = importance;
    }

    if (completed !== undefined) {
      task.completed = completed;
      task.completedDate = completed ? new Date() : null;
    }

    task.updatedAt = new Date();

    await task.save();
    res.json({ message: "Task updated successfully", task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server error" });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const userId = req.user._id;
    const taskId = req.params.taskId;

    const task = await Task.findOneAndDelete({ _id: taskId, userId: userId });
    console.log(task);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server error" });
  }
};
