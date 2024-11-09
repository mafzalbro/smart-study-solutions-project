const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");

// List of restricted paths based on the origin
const restrictedOrigins = [
  process.env.FRONTEND_ORIGIN + "/api/admin/create",
  process.env.FRONTEND_ORIGIN + "/api/admin/",
];

const adminAuth = async (req, res, next) => {
  try {

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized, token missing" });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the admin by the ID from the token
    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) {
      return res.status(401).json({ message: "Unauthorized, not an admin" });
    }

    // Check if the request's origin is restricted
    const origin = req.url;
    if (restrictedOrigins.includes(origin)) {
      return res.status(403).json({ message: "Forbidden, origin restricted" });
    }

    // Attach admin data to request object
    req.admin = admin;

    // Proceed to the next middleware
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // Send a custom response if the token has expired
      res.redirect(`/admin-auth-error`);
      return res.status(401).json({ message: "Unauthorized, token expired" });
    } else {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

module.exports = { adminAuth };
