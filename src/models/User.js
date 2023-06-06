const mongoose = require('mongoose');
const moment = require('moment-timezone');

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
});

const User = mongoose.model('User', UserSchema);

module.exports = User;