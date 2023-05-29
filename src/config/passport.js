const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Local strategy
passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
        const user = await User.findOne().or([{ email }, { username: email }]);

        // Check if user exists
        if (!user) {
            return done(null, false, { message: 'Invalid email or username' });
        }

        // Check if password is correct
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return done(null, false, { message: 'Invalid password' });
        }

        // Return user
        return done(null, user);
    } catch (err) {
        console.error(err);
        return done(err);
    }
}));

// Google strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await User.findOne({ googleId: profile.id });

        // Check if user exists
        if (!user) {
            // Create new user
            const newUser = new User({
                username: profile.displayName,
                email: profile.emails[0].value,
                googleId: profile.id,
            });

            // Save new user
            await newUser.save();
            return done(null, newUser);
        }
    } catch (err) {
        console.error(err);
        return done(err);
    }
}));

// Serialize user
passport.serializeUser((user, done) => {
    done(null, user._id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        console.error(err);
        done(err);
    }
});

module.exports = passport;