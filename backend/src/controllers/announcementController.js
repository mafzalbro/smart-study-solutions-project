const Announcement = require("../models/announcement");
const { paginateResults } = require("../utils/pagination");

// Get all announcements with pagination, sorting, filtering, and query
exports.getAllAnnouncements = async (req, res) => {
  try {
    // Extract query parameters
    const {
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "desc",
      query,
      showAll = false,
    } = req.query;

    // Base query
    let announcements = Announcement.find();

    // Search filter
    if (query) {
      announcements = announcements.find({
        $or: [
          { title: { $regex: query, $options: "i" } }, // case-insensitive search in title
          { description: { $regex: query, $options: "i" } }, // case-insensitive search in description
        ],
      });
    }

    // Sorting
    const sortOrder = order === "desc" ? -1 : 1;
    announcements = announcements.sort({ [sort]: sortOrder });

    // Paginate results
    const paginatedResults = await paginateResults(
      announcements,
      parseInt(page),
      parseInt(limit),
      showAll === "true"
    );

    res.status(200).json(paginatedResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve announcements" });
  }
};

// Get a single announcement by ID
exports.getAnnouncementById = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ error: "Announcement not found" });
    }
    res.status(200).json(announcement);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve announcement" });
  }
};

// Create a new announcement
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, description, btnText, btnLink, icon, image } = req.body;

    const newAnnouncement = new Announcement({
      title,
      description,
      btnText,
      btnLink,
      icon,
      image,
    });

    await newAnnouncement.save();
    res.status(201).json(newAnnouncement);
  } catch (error) {
    res.status(500).json({ error: "Failed to create announcement" });
  }
};

// Update an existing announcement
exports.updateAnnouncement = async (req, res) => {
  try {
    const { title, description, btnText, btnLink, icon, image } = req.body;

    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { title, description, btnText, btnLink, icon, image },
      { new: true }
    );

    if (!announcement) {
      return res.status(404).json({ error: "Announcement not found" });
    }

    res.status(200).json(announcement);
  } catch (error) {
    res.status(500).json({ error: "Failed to update announcement" });
  }
};

// Delete an announcement
exports.deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) {
      return res.status(404).json({ error: "Announcement not found" });
    }
    res.status(200).json({ message: "Announcement deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete announcement" });
  }
};
