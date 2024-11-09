const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const { adminAuth } = require("../middlewares/adminAuth");

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

module.exports = router;
