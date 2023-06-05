const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/User");

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email: { $regex: new RegExp(email, "i") } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    console.log("User created successfully!");

    return res
      .status(201)
      .json({ message: "User registered successfully", user: savedUser, userId: savedUser._id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Login a user
exports.loginUser = async (req, res) => {
  try {
    passport.authenticate("local", { session: false }, (error, user, info) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
      }

      if (!user) {
        return res.status(401).json({ message: info.message });
      }

      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.SESSION_SECRET,
        { expiresIn: "1h" }
      );

      const message = `Welcome back, ${user.email}! You have successfully logged in.`;

      return res.json({ message, token, userId: user._id });
    })(req, res);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Logout a user
exports.logoutUser = (req, res) => {
  if (req.isAuthenticated()) {
    req.logout();
    return res.json({ message: "User logged out successfully" });
  } else {
    return res.status(401).json({ message: "User not logged in" });
  }
};

// Google OAuth signup
exports.googleSignup = passport.authenticate("google", {
  scope: ["profile", "email"],
});

// Google OAuth signup callback
exports.googleSignupCallback = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.user.email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      email: req.user.email,
      password: req.user.password,
    });

    const savedUser = await newUser.save();

    const token = jwt.sign(
      { userId: savedUser._id, email: savedUser.email },
      process.env.SESSION_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({ message: "User registered successfully", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Google OAuth login
exports.googleLogin = passport.authenticate("google", {
  scope: ["profile", "email"],
});

// Google OAuth login callback
exports.googleLoginCallback = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.SESSION_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({ message: "User logged in successfully", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};