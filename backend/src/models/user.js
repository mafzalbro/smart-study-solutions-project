const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const NotificationService = require('../services/notificationService'); // Ensure the correct path
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  slug: { type: String, required: true, unique: true, default: uuidv4() },
  title: { type: String, required: true, default: "Title Here" },
  chatHistory: [
    {
      _id: { type: Schema.Types.ObjectId, auto: true },
      user_query: { type: String, required: true },
      model_response: { type: String, required: true }
    }
  ]
});

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'teacher'],
    required: true,
  },
  profileImage: {
    type: String,
  },
  favoriteGenre: {
    type: String,
  },
  chatOptions: {
    type: [ChatSchema],
    default: () => ([{ title: 'Default Chat', chatHistory: [] }])
  }
}, { timestamps: true });

let isNewUser = true; // Custom flag to track new user state

// Pre-save hook to track new user state
userSchema.pre('save', function(next) {
  if (this.isNew) {
    isNewUser = true; // Mark as new if isNew flag is true
  } else {
    isNewUser = false; // Mark as not new for existing documents
  }
  next();
});

// Post-save hook to create notification for new users
userSchema.post('save', async function(doc) {
  if (isNewUser && doc._id) {
    try {
      await NotificationService.createNotification(doc._id, `New user "${doc.username}" registered.`, 'new_user');
      console.log('Notification created successfully'); // Debug log
    } catch (error) {
      console.error('Failed to create notification:', error);
      // Handle error appropriately
    }
  }
});

module.exports = mongoose.model('User', userSchema);
