const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AILogsService = require('../services/aiLogService');

const AILogSchema = new Schema({
  resource_id: { type: Schema.Types.ObjectId, ref: 'Resource', required: true },
  ai_approval: { type: Boolean, required: true },
  admin_approval: { type: Boolean, required: true },
  reason: { type: String },
  created_at: { type: Date, default: Date.now }
});

let isNewAILog = true; // Custom flag to track new AI log state

// Pre-save hook to track new AI log state
AILogSchema.pre('save', function(next) {
  if (this.isNew) {
    isNewAILog = true; // Mark as new if isNew flag is true
  } else {
    isNewAILog = false; // Mark as not new for existing documents
  }
  next();
});

// Post-save hook to create notifications based on AI approval status
AILogSchema.post('save', async function(doc) {
  if (isNewAILog && doc._id) {
    
    if (doc.ai_approval && !doc.admin_approval) {
      try {
        await AILogsService.createAILog(doc.resource_id, `AI approval required for resource "${doc.resource_id.title}".`, 'ai_approval');
        console.log('AI approval notification created successfully'); // Debug log
      } catch (error) {
        console.error('Failed to create AI approval notification:', error);
        // Handle error appropriately
      }
    } else if (!doc.ai_approval && doc.reason) {
      try {
        await AILogsService.createAILog(doc.resource_id, `AI not approved for resource "${doc.resource_id.title}". Reason: ${doc.reason}`, 'ai_not_approved');
        console.log('AI not approved notification created successfully'); // Debug log
      } catch (error) {
        console.error('Failed to create AI not approved notification:', error);
        // Handle error appropriately
      }
    }
  }
});

module.exports = mongoose.model('AILog', AILogSchema);
