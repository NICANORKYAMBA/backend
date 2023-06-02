const User = require('../models/User');
const Task = require('../models/Task');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});

    const usersWithTasks = await Promise.all(
      users.map(async (user) => {
        const tasks = await Task.find({ userId: user._id });

        return {
          _id: user._id,
          email: user.email,
          tasks: tasks,
        };
      })
    );

    res.json(usersWithTasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Get a single user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
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

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { email, password },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully', user: deletedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};