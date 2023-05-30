const { MONGODB_URI, SESSION_SECRET, PORT } = require('./config/config');
const connectDB = require('./config/db');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const cors = require('cors');

// Passport config
require('./config/passport');

// Initialize app
const app = express();

// Connect to database
connectDB();

// Set up session middleware
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongoUrl: MONGODB_URI,
        collectionName: 'sessions',
    }),
}));

// Set up passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set up body parser middleware
app.use(express.json());

// Set up CORS middleware
app.use(cors());

// Set up routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// Start server
const port = PORT || 8000;
app.listen(port, () => console.log(`Server started on port ${port}`));