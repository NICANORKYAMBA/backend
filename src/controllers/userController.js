const bcrypt = require('bcrypt');
const User = require('../models/User');
const Task = require('../models/Task');

exports.getAllUsersTasks = async (req, res) => {
  try {
    const users = await User.find({}).lean();
    const userIds = users.map(user => user._id);

    const tasks = await Task.find({ user: { $in: userIds } }).lean();

    const usersWithTasks = users.map(user => ({
      _id: user._id,
      email: user.email,
      tasks: tasks.filter(task => task.user.toString() === user._id.toString())
    }));

    res.json(usersWithTasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving users with tasks', error: error.message });
  }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const tasks = await Task.find({ userId: user._id });

    const userWithTasks = {
      _id: user._id,
      email: user.email,
      tasks: tasks,
    };

    res.json(userWithTasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userId = req.params.id;

    // Validate input data
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user fields
    const updatedFields = { email, password: hashedPassword };
    // Add more fields to update if needed (e.g., name, profile picture)

    // Find and update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updatedFields,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return updated user fields
    const { _id, email: updatedEmail } = updatedUser;
    res.json({ message: 'User updated successfully', user: { _id, email: updatedEmail } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully', user: deletedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
