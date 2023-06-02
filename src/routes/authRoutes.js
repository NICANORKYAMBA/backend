const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Route to register a new user
router.post('/signup', authController.registerUser);

// Route to log in a user
router.post('/login', authController.loginUser);

// Route to log out a user
router.get('/logout', authMiddleware, authController.logoutUser);

// Route to sign up with Google
router.get('/google/signup', authController.googleSignup);

// Route to log in with Google
router.get('/google/login', authController.googleLogin);

// Route for Google sign up callback
router.get('/google/signup/callback', authController.googleSignupCallback);

// Route for Google log in callback
router.get('/google/login/callback', authController.googleLoginCallback);

module.exports = router;