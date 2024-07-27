const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const morgan = require('morgan');
const cors = require('cors');
const passport = require('./backend/src/config/passport');
const { connect } = require('./backend/src/config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./backend/swagger-output.json');
require('dotenv').config();

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Database Connection
  connect(); // Connect to MongoDB

  // Middleware
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(morgan('dev'));

  // CORS middleware
  server.use(cors({
    origin: [process.env.FRONTEND_ORIGIN, process.env.FRONTEND_ORIGIN_1],
    credentials: true
  }));

  // Session configuration
  server.use(session({
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
  server.use(passport.initialize());
  server.use(passport.session());

  // Import and use backend routes
  const adminAuthRoutes = require('./backend/src/routes/adminAuthRoutes');
  const authRoutes = require('./backend/src/routes/authRoutes');
  const bookRoutes = require('./backend/src/routes/bookRoutes');
  const chatWithPdfRoutes = require('./backend/src/routes/chatWithPdfRoutes');
  const notificationRoutes = require('./backend/src/routes/notificationRoutes');
  const qnaRoutes = require('./backend/src/routes/qnaRoutes');
  const resourceRoutes = require('./backend/src/routes/resourceRoutes');
  const userRoutes = require('./backend/src/routes/userRoutes');
  const contactRoutes = require('./backend/src/routes/contactRoutes');

  server.use('/api/admin', adminAuthRoutes);
  server.use('/api/auth', authRoutes);
  server.use('/api/books', bookRoutes);
  server.use('/api/chat', chatWithPdfRoutes);
  server.use('/api/notifications', notificationRoutes);
  server.use('/api/qna', qnaRoutes);
  server.use('/api/resources', resourceRoutes);
  server.use('/api/user', userRoutes);
  server.use('/api/contact', contactRoutes);

  // Swagger UI setup
  server.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

  // Handle Next.js routes
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const port = process.env.PORT || 3000;
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
