const mongoose = require('mongoose');
const moment = require('moment-timezone');

const UserSchema = new mongoose.Schema({
	email: { type: String, unique: true, required: true },
	password: { type: String, required: true },
	timezone: { type: String },
});

UserSchema.pre('save', function (next) {
	// Check if the timezone field is not already set
	if (!this.timezone) {
		// Use moment-timezone library to get the user's current timezone
		this.timezone = moment.tz.guess();
	}
	next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
