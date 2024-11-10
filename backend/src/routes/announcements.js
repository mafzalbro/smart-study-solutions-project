const express = require("express");
const router = express.Router();
const announcementController = require("../controllers/announcementController");
const { adminAuth } = require("../middlewares/adminAuth");

// Get all announcements
router.get("/", announcementController.getAllAnnouncements);

// Get a single announcement by ID
router.get("/:id", adminAuth, announcementController.getAnnouncementById);

// Create a new announcement
router.post("/create", adminAuth, announcementController.createAnnouncement);

// Update an existing announcement
router.put("/:id", adminAuth, announcementController.updateAnnouncement);

// Delete an announcement
router.delete("/:id", adminAuth, announcementController.deleteAnnouncement);

module.exports = router;
