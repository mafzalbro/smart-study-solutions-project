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
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');

// Import the cache middleware
const { cacheMiddleware, clearExpiredCache } = require('./src/middlewares/cacheMiddleware');


clearExpiredCache()

const app = express();

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

console.log(process.env.FRONTEND_ORIGIN, process.env.FRONTEND_ORIGIN_1, process.env.MONGODB_URI)

// Session configuration
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: {
    maxAge: 3600000,
    // sameSite: None,
    // secure: true,
    // httpOnly: true
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Use the cache middleware for all GET routes
app.use(cacheMiddleware); // Apply globally to cache GET requests

// Routes
app.use('/api/admin', adminAuthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/chat', chatWithPdfRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/qna', qnaRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/user', userRoutes);
app.use('/api/contact', contactRoutes);

// Error handling middleware
app.use(errorHandler);

// Swagger UI setup
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Start the server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
