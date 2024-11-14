const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const { adminAuth } = require("../middlewares/adminAuth");
const { auth } = require("../middlewares/auth");

router.get("/", adminAuth, notificationController.getNotifications);
router.post("/", adminAuth, notificationController.createNotification);
router.patch(
  "/mark-all-as-read",
  adminAuth,
  notificationController.markAllAsRead
);
router.delete(
  "/delete-all",
  adminAuth,
  notificationController.deleteAllNotifications
);

// Normal User Routes
router.get("/user", auth, notificationController.getCurrentUserNotifications); // Fetch notifications for the authenticated user
router.patch(
  "/user/mark-all-as-read",
  auth,
  notificationController.markUserAllAsRead
); // Mark all notifications as read for the authenticated user
router.delete(
  "/user/delete-all",
  auth,
  notificationController.deleteAllUserNotifications
); // Delete all notifications for the authenticated user

module.exports = router;
