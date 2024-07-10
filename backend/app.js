const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { errorHandler } = require('./src/middlewares/errorHandler');
const passport = require('./src/config/passport');
const { connect } = require('./src/config/db');
require('dotenv').config();
const cors = require('cors');

// Import Routes
const adminAuthRoutes = require('./src/routes/adminAuthRoutes');
const authRoutes = require('./src/routes/authRoutes');
const bookRoutes = require('./src/routes/bookRoutes');
const chatWithPdfRoutes = require('./src/routes/chatWithPdfRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const qnaRoutes = require('./src/routes/qnaRoutes');
const resourceRoutes = require('./src/routes/resourceRoutes');
const userRoutes = require('./src/routes/userRoutes');
const contactRoutes = require('./src/routes/contactRoutes');

const app = express();

// Database Connection
connect(); // Connect to MongoDB

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

// CORS middleware
app.use(cors({
  origin: [process.env.FRONTEND_ORIGIN, process.env.FRONTEND_ORIGIN_1],
  credentials: true
}));

// Session configuration

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  // cookie: { maxAge: 3600000, secure: false } // Session expires after 1 hour
}));


// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());


// Routes
app.use('/api/admin', adminAuthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/chat', chatWithPdfRoutes); // Adjusted to match your route path
app.use('/api/notifications', notificationRoutes);
app.use('/api/qna', qnaRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/user', userRoutes);
app.use('/api/contact', contactRoutes);


// Error handling middleware
app.use(errorHandler);


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
