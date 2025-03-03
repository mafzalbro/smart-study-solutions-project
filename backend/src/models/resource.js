const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const NotificationService = require('../services/notificationService');

const resourceSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String },
  semester: { type: String, required: true },
  degree: { type: String, required: true },
  type: { type: String, required: true },
  slug: { type: String, required: true },
  description: { type: String, required: true },
  profileImage: { type: String, default: "/resources/default.png" },
  tags: [{ type: String }],
  pdfLink: [{ type: String, default: null }],
  status: { type: Boolean, required: true },
  source: { type: String, required: true },
  rating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  likedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  dislikedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  ratings: [
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      rating: { type: Number, required: true }
    }
  ]
}, { timestamps: true });

let isNewResource = true; // Custom flag to track new resource state

// Pre-save hook to track new resource state
resourceSchema.pre('save', function(next) {
  if (this.isNew) {
    isNewResource = true; // Mark as new if isNew flag is true
  } else {
    isNewResource = false; // Mark as not new for existing documents
  }
  next();
});

// Post-save hook to create notification for new resources
resourceSchema.post('save', async function(doc) {
  if (isNewResource && doc._id) {
    try {
      await NotificationService.createNotification(doc._id, `New resource "${doc.title}" added.`, 'new_resource');
      console.log('Notification created successfully'); // Debug log
    } catch (error) {
      console.error('Failed to create notification:', error);
      // Handle error appropriately
    }
  }
});

module.exports = mongoose.model('Resource', resourceSchema);
