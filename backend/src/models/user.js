const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const NotificationService = require('../services/notificationService'); // Ensure the correct path
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const googleCacheMetaData = require('./googleCacheMetaData'); // Ensure correct path

const ChatSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  slug: { type: String, required: true, unique: true, default: uuidv4 },
  title: { type: String, required: true, default: "New Chat" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  pdfText: { type: String, default: '' },
  pdfUrls: { type: [String], default: [] },
  googleCacheMetaData: [{ type: Schema.Types.ObjectId, ref: 'googleCacheMetaData' }], // Add this line
  
  chatHistory: [
    {
      _id: { type: Schema.Types.ObjectId, auto: true },
      user_query: { type: String, required: true },
      model_response: { type: String, required: true }
    }
  ]
});

const userSchema = new Schema({
  fullname: {
    type: String,
    required: true,
  },
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
    default: null, // Make password optional
  },
  role: {
    type: String,
    enum: ['student', 'teacher'],
    required: true,
  },
  profileImage: {
    type: String,
    default: null,
  },
  isMember: 
  {
     type: Boolean,
     default: false
  },
  slug: {
    type: String,
    default: null,
  },
  apiKey: {
    type: String,
    default: null,
  },
  favoriteGenre: {
    type: String,
    required: true,
  },
  chatOptions: {
    type: [ChatSchema],
    default: function() {
      return [{ title: 'Default Chat', chatHistory: [] }];
    }
  },
  resetTokenExpiry: {
    type: Date,
    default: null,
  },
  googleId: {
    type: String,
    default: null, // Store Google ID if user signs in with Google
  }
}, { timestamps: true });

// Middleware to update updatedAt in chatOptions when user document is updated
userSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update && update.$set && update.$set['chatOptions']) {
    update.$set['chatOptions.$.updatedAt'] = new Date();
  }
  next();
});

// Post-save hook to create notification for new users
userSchema.post('save', async function(doc) {
  if (doc.isNew) {
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
