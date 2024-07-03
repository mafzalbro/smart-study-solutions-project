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
  // const { userId } = req.params;
  const { page = 1, limit = 10, sortBy, filterBy, query } = req.query;
  // let queryOptions = { user_id: userId };
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

    const results = await paginateResults(Notification.find(queryOptions), parseInt(page), parseInt(limit));
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
};
