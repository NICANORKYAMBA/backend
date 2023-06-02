const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Route to fetch all users
router.get('/', userController.getAllUsers);

// Route to fetch a single user by ID
router.get('/:id', userController.getUserById);

// Route to update a user
router.put('/:id', authMiddleware, userController.updateUser);

// Route to delete a user
router.delete('/:id', authMiddleware, userController.deleteUser);

module.exports = router;