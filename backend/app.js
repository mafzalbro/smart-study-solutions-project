const express = require("express");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const passport = require("./src/config/passport");
const { connect } = require("./src/config/db");
require("dotenv").config();
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json");

// Import the cache middleware
const { cacheMiddleware } = require("./src/middlewares/cacheMiddleware");

const app = express();

app.use(express.static(path.join(__dirname, "./public")));

// Import Routes
const adminAuthRoutes = require("./src/routes/adminAuthRoutes");
const authRoutes = require("./src/routes/authRoutes");
const chatWithPdfRoutes = require("./src/routes/chatWithPdfRoutes");
const notificationRoutes = require("./src/routes/notificationRoutes");
const qnaRoutes = require("./src/routes/qnaRoutes");
const resourceRoutes = require("./src/routes/resourceRoutes");
const userRoutes = require("./src/routes/userRoutes");
const contactRoutes = require("./src/routes/contactRoutes");
const paymentsRoutes = require("./src/routes/paymentsRoutes");

// Database Connection
connect(); // Connect to MongoDB

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

// CORS middleware
app.use(
  cors({
    origin: [process.env.FRONTEND_ORIGIN, process.env.FRONTEND_ORIGIN_1],
    credentials: true,
  })
);

console.log({
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN,
  FRONTEND_ORIGIN_1: process.env.FRONTEND_ORIGIN_1,
  MONGODB_URI: process.env.MONGODB_URI,
});

// Session configuration
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: {
      maxAge: 3600000,
      // sameSite: None,
      // secure: true,
      // httpOnly: true
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Use the cache middleware for all GET routes
app.use(cacheMiddleware);
// Apply globally to cache GET requests

// Routes
app.use("/api/admin", adminAuthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatWithPdfRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/qna", qnaRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/user", userRoutes);
app.use("/api/contact", contactRoutes);
// app.use("/api/payments", paymentsRoutes);

// Swagger UI setup
app.use("/api/docs-setup", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// redirect to frontend
app.use("/frontend", (req, res) => {
  res.redirect(`${process.env.FRONTEND_ORIGIN}`);
});
app.use("/admin-auth-error", (req, res) => {
  res.redirect(`${process.env.FRONTEND_ORIGIN}/admin/login`);
});
app.use("/api", (req, res) => {
  res.redirect(`${process.env.FRONTEND_ORIGIN}`);
});

// Start the server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
