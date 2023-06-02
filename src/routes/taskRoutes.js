const express = require('express');
const router = express.Router();

const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

// Route to get all tasks
router.get('/', authMiddleware, taskController.getAllTasks);

// Route to create a new task
router.post('/', authMiddleware, taskController.createTask);

// Route to get a task by id
router.get('/:id', authMiddleware, taskController.getTaskById);

// Route to update a task by id
router.put('/:id', authMiddleware, taskController.updateTask);

// Route to delete a task by id
router.delete('/:id', authMiddleware, taskController.deleteTask);

// Route to extend due date of a task
router.put('/extend-due-date/:id', authMiddleware, taskController.extendDueDate);

// Route to sort tasks by due date
router.get('/sort/due-date', authMiddleware, taskController.getTasksSortedByField);

// Route to sort tasks by importance
router.get('/sort/importance', authMiddleware, taskController.getTasksSortedByField);

// Route to sort tasks by completion
router.get('/sort/completion', authMiddleware, taskController.getTasksSortedByField);

// Route to sort tasks by created date
router.get('/sort/created', authMiddleware, taskController.getTasksSortedByField);

// Route to sort tasks by updated date
router.get('/sort/updated', authMiddleware, taskController.getTasksSortedByField);

// Route to sort tasks by completed date
router.get('/sort/completed-date', authMiddleware, taskController.getTasksSortedByField);

// Route to sort tasks by title
router.get('/sort/title', authMiddleware, taskController.getTasksSortedByField);

module.exports = router;