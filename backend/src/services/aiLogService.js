const AILog = require('../models/aiLog'); // Ensure the correct path

const createAILog = async (resourceId, aiApproval, adminApproval, reason = null) => {
  try {
    const aiLog = new AILog({
      resource_id: resourceId,
      ai_approval: aiApproval,
      admin_approval: adminApproval,
      reason: reason
    });
    await aiLog.save();
    console.log('AI Log saved:', aiLog); // Debug log
    return aiLog;
  } catch (error) {
    console.error('Error saving AI Log:', error);
    throw error;
  }
};

module.exports = { createAILog };
