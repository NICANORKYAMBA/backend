const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        // Get token from request header
        const token = req.header('Authorization');
        
        // Check if token exists
        if (!token || !token.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authentication failed: Invalid Token!' });
        }
        
        // Extract token
        const extractedToken = token.replace('Bearer ', '');

        try {
            // Verify token
            const decoded = jwt.verify(extractedToken, process.env.SESSION_SECRET);
            console.log('decode: ', decoded);
        
            // Find user
            const user = await User.findOne({ _id: decoded.userId });
            console.log('user', user);

            // Check if user exists
            if (!user) {
                return res.status(401).json({ message: 'Authentication failed: User not found!' });
            }

            // Add user to request
            req.user = user;
            next();
        } catch (err) {
            res.status(401).json({ message: 'Authentication failed: Invalid Token!' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error!' });
    }
};

module.exports = auth;