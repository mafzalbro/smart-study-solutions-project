const Notification = require("../models/notification");
const Question = require("../models/qna");
const { paginateResults } = require("../utils/pagination");

exports.createNotification = async (req, res) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    res.status(201).send(notification);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getNotifications = async (req, res) => {
  const { page = 1, limit = 10, sortBy, filterBy, query, read } = req.query;
  let queryOptions = {};

  try {
    if (sortBy) {
      queryOptions.sort = sortBy;
    }

    if (filterBy) {
      const filter = JSON.parse(filterBy);
      Object.assign(queryOptions, filter);
    }

    if (query) {
      queryOptions.$or = [
        { title: { $regex: query, $options: "i" } },
        { _id: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ];
    }

    if (read !== undefined) {
      queryOptions.read = read === "true"; // Filter by read/unread status
    }

    const results = await paginateResults(
      Notification.find(queryOptions),
      parseInt(page),
      parseInt(limit)
    );
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching notifications" });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    // Optionally, you can filter by user_id or other criteria
    // const { userId } = req.params;  // You can use `req.user` if you use JWT-based authentication
    const updateResult = await Notification.updateMany(
      // { user_id: userId }, // You can remove this line to apply to all users
      { $set: { read: true } }
    );
    res
      .status(200)
      .json({ message: "All notifications marked as read", updateResult });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error marking notifications as read" });
  }
};

exports.deleteAllNotifications = async (req, res) => {
  try {
    // const { userId } = req.params; // You can filter by user_id if necessary
    const deleteResult = await Notification
      .deleteMany
      // { user_id: userId }  // Remove this line to delete all notifications
      ();
    res
      .status(200)
      .json({ message: "All notifications deleted", deleteResult });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting notifications" });
  }
}; // Fetch notifications for the current user
// Fetch notifications for the current user
exports.getCurrentUserNotifications = async (req, res) => {
  try {
    // Find notifications for the user and sort them by created_at in descending order
    const notifications = await Notification.find({
      user_id: req.user.id,
    }).sort({ created_at: -1 });

    const notificationsParsed = JSON.parse(JSON.stringify(notifications));
    // Modify the result to assign the slug or a fallback value if no questionId exists
    const formattedNotifications = await Promise.all(
      notificationsParsed.map(async (notification) => {
        // If notification has questionId, fetch the corresponding Question document
        if (notification.questionId) {
          try {
            const question = await Question.findById(notification.questionId);
            console.log({ question });
            if (question) {
              notification.questionId = question.slug; // Replace questionId with the slug
            } else {
              notification.questionId = ""; // If no question found, set as empty string
            }
          } catch (error) {
            console.error("Error fetching question:", error);
            notification.questionId = ""; // If error occurs in fetching question, set as empty string
          }
        } else {
          notification.questionId = ""; // If no questionId, set as empty string
        }
        return notification;
      })
    );
    console.log(formattedNotifications);

    res.status(200).json(formattedNotifications);
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

// Mark all notifications as read for the current user
exports.markUserAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user_id: req.user.id, read: false },
      { $set: { read: true } }
    );
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Failed to mark notifications as read", error);
    res.status(500).json({ message: "Failed to mark notifications as read" });
  }
};

// Delete all notifications for the current user
exports.deleteAllUserNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ user_id: req.user.id });
    res.status(200).json({ message: "All notifications deleted" });
  } catch (error) {
    console.error("Failed to delete notifications", error);
    res.status(500).json({ message: "Failed to delete notifications" });
  }
};
