const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Route to regisdter new user
router.get('/register', authController.registerUser);

// Route to login user
router.post('/login', authController.loginUser);

// Route to logout user
router.get('/logout', authMiddleware, authController.logoutUser);

// Route to signup with google
router.get('/google/signup', authController.googleSignup);

// Route to login with google
router.get('/google/login', authController.googleLogin);

// Route to google signup callback
router.get('/google/signup/callback', authController.googleSignupCallback);

// Route to google login callback
router.get('/google/login/callback', authController.googleLoginCallback);

module.exports = router;