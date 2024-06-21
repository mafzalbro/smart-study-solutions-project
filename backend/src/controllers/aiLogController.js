const AILog = require('../models/aiLog');

exports.createAILog = async (req, res) => {
  try {
    const aiLog = new AILog(req.body);
    await aiLog.save();
    res.status(201).send(aiLog);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getAILogs = async (req, res) => {
  try {
    const aiLogs = await AILog.find();
    res.status(200).send(aiLogs);
  } catch (error) {
    res.status(400).send(error);
  }
};
