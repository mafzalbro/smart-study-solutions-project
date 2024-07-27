const AdminLog = require('../models/adminLog');

exports.createAdminLog = async (req, res) => {
  try {
    const adminLog = new AdminLog(req.body);
    await adminLog.save();
    res.status(201).send(adminLog);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getAdminLogs = async (req, res) => {
  try {
    const adminLogs = await AdminLog.find();
    res.status(200).send(adminLogs);
  } catch (error) {
    res.status(400).send(error);
  }
};
