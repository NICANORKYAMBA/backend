const express = require("express");
const router = express.Router();

const taskController = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");

// Route to get all tasks for a specific user
router.get("/:userId", taskController.getAllTasks);

// Route to create a new task
router.post("/", authMiddleware, taskController.createTask);

// Route to get a task by id
router.get("/:userId/:taskId", authMiddleware, taskController.getTaskById);

// Route to update a task by id
router.put(
  "/update/:userId/:taskId",
  authMiddleware,
  taskController.updateTask
);

// Route to delete a task by id
router.delete(
  "/delete/:userId/:taskId",
  authMiddleware,
  taskController.deleteTask
);

// Route to extend due date of a task
router.put(
  "/extend-due-date/:id",
  authMiddleware,
  taskController.extendDueDate
);

// Route to sort tasks by different fields
router.get(
  "/sort/:field",
  authMiddleware,
  taskController.getTasksSortedByField
);

module.exports = router;
