const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    googleId: { type: String, default: null },
    timezone: { type: String, default: 'Africa/Nairobi' },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;