const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register a new user
exports.registerUser = async (req, res,) => {
    try {
        const { username, email, password } = req.body;

        // Check if the user already exists
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Check if the email already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        // Save the user and return the response
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
        res.json({ message: 'User registered successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });   
    }
};

// Login a user
exports.loginUser = async (req, res) => {
    try {
        passport.authenticate('local', { session: false }, (error, user, info) => {
            // Check for errors
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }

            // Check if the user exists
            if (!user) {
                return res.status(401).json({ message: info.message });
            }

            // Log in the user
            req.login(user, { session: false }, async (error) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: 'Internal server error' });
                }
            
            // Generate a signed json web token and return it in the response
            const token = jwt.sign({ userId: user._id, username: user.username },
                    process.env.SESSION_SECRET,
                    { expiresIn: '1h' }
            );
            
            // Send token to client
                return res.json({ message: 'User logged in sucessfully', token });
            });
        })(req, res);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Logout a user
exports.logoutUser = async (req, res) => {
    try {
        req.logout();
        res.json({ message: 'User logged out successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Google OAuth signnup
exports.googleSignup = async (req, res) => {
    try {
        passport.authenticate('google', { scope: ['profile', 'email'] })(req, res);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Google OAuth signup callback
exports.googleSignupCallback = async (req, res) => {
    try {
        // Check if the user exists
        const existingUser = await User.findOne({ email: req.user.email });
        if (existingUser) {
// Redirect to login page
            return res.redirect('/login');
        }

// Create a new user
        const newUser = new User({
            username: req.user.username,
            email: req.user.email,
            password: req.user.password
        });

// Save the user and return the response
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
        res.json({ message: 'User registered successfully' });

// Generate a signed json web token and return it in the response
        const token = jwt.sign({ userId: savedUser._id, username: savedUser.username },
            process.env.SESSION_SECRET,
            { expiresIn: '1h' }
        );

// Redirect user to frontend URL with JWT token as query parameter
        return res.redirect(`/auth-success?token=${token}`);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Google OAuth login
exports.googleLogin = async (req, res) => {
    try {
        passport.authenticate('google', { scope: ['profile', 'email'] })(req, res);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Google OAuth login callback
exports.googleLoginCallback = async (req, res) => {
    try {
        // Find user in database using email
        const user = await User.findOne({ email: req.user.email });
        if (!user) {
            return res.status(401).json({ message: 'User not registered' });
            return res.redirect('/signup');
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id, username: user.username },
            process.env.SESSION_SECRET,
            { expiresIn: '1h' }
        );

        // Redirect user to frontend URL with JWT token as query parameter
        return res.redirect(`/auth-success?token=${token}`);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};