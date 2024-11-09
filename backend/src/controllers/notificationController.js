const Notification = require('../models/notification');
const { paginateResults } = require('../utils/pagination');

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
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }

    if (read !== undefined) {
      queryOptions.read = read === 'true';  // Filter by read/unread status
    }

    const results = await paginateResults(Notification.find(queryOptions), parseInt(page), parseInt(limit));
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching notifications' });
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
    res.status(200).json({ message: 'All notifications marked as read', updateResult });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error marking notifications as read' });
  }
};

exports.deleteAllNotifications = async (req, res) => {
  try {
    // const { userId } = req.params; // You can filter by user_id if necessary
    const deleteResult = await Notification.deleteMany(
      // { user_id: userId }  // Remove this line to delete all notifications
    );
    res.status(200).json({ message: 'All notifications deleted', deleteResult });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting notifications' });
  }
};

