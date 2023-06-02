const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization');

    if (!token || !token.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication failed: Invalid Token!' });
    }

    const extractedToken = token.replace('Bearer ', '');

    try {
      const decoded = jwt.verify(extractedToken, process.env.SESSION_SECRET);
      const user = await User.findById(decoded.userId);

      if (!user) {
        return res.status(401).json({ message: 'Authentication failed: User not found!' });
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Authentication failed: Invalid Token!' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error!' });
  }
};

module.exports = auth;