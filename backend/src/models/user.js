const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const NotificationService = require("../services/notificationService"); // Ensure the correct path
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const googleCacheMetaData = require("./googleCacheMetaData"); // Ensure correct path
const ChatSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },

    // Unique identifier for each chat
    slug: {
      type: String,
      required: true,
      unique: true,
      default: uuidv4,
    },

    // Title for the chat
    title: {
      type: String,
      required: true,
      default: "New Chat",
    },

    // Automatic timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },

    // Text extracted from the PDF (latest extraction)
    pdfText: {
      type: String,
      default: "",
    },

    // Array of unique URLs of PDFs related to this chat
    pdfUrls: {
      type: [String],
      default: [],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.every((url, i) => v.indexOf(url) === i);
        },
        message: "PDF URLs must be unique.",
      },
    },

    // Metadata reference for Google cache
    googleCacheMetaData: [
      {
        type: Schema.Types.ObjectId,
        ref: "googleCacheMetaData",
      },
    ],

    // Array to store texts extracted from multiple PDFs with their indices
    pdfTexts: [
      {
        text: {
          type: String,
          required: true,
        },
        index: {
          type: Number,
          required: true,
        },
      },
    ],

    // Array of chat history entries, each entry has user_query and model_response
    chatHistory: [
      {
        _id: {
          type: Schema.Types.ObjectId,
          auto: true,
        },
        user_query: {
          type: String,
          required: true,
        },
        model_response: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    // Enables automatic updating of timestamps on updates
    timestamps: true,
  }
);

const userSchema = new Schema(
  {
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
      enum: ["student", "teacher"],
      required: true,
    },
    profileImage: {
      type: String,
      default: null,
    },
    isMember: {
      type: Boolean,
      default: false,
    },
    isNewsLetterHolder: {
      type: Boolean,
      default: false,
    },
    subscriptionEndDate: {
      type: Date,
      default: null,
    },
    subscriptionStartDate: {
      type: Date,
      default: null,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: String,
      default: uuidv4,
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
      default: function () {
        return [{ title: "Default Chat", chatHistory: [] }];
      },
    },
    queriesUsed: {
      type: Number,
      default: 0,
    },
    chatOptionsUsed: {
      type: Number,
      default: 0,
    },
    lastResetDate: {
      type: Date,
      default: Date.now,
    },
    downloadsToday: { type: Number, default: 0 },
    viewedResources: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Resource" },
    ],
    resourceResetDate: { type: Date, default: Date.now },
    lastResetDate: { type: Date, default: Date.now },
    resetTokenExpiry: {
      type: Date,
      default: null,
    },
    googleId: {
      type: String,
      default: null, // Store Google ID if user signs in with Google
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  // Check if chatOptions has been modified
  if (!this.isNew) {
    if (this.isModified("chatOptions")) {
      // Get the path of the modified chatOption
      const modifiedPaths = this.modifiedPaths();

      // Find the modified option within chatOptions
      const modifiedOption = modifiedPaths.find((path) =>
        path.startsWith("chatOptions.")
      );

      // If a specific chatOption is modified, update only its updatedAt field
      if (modifiedOption) {
        const index = parseInt(modifiedOption.match(/\d+/)[0]); // Extract the index from modifiedOption path
        this.chatOptions[index].updatedAt = new Date();
      }
    }
  }
  next();
});

// Post-save hook to create notification for new users
userSchema.post("save", async function (doc) {
  if (doc.isNew) {
    try {
      await NotificationService.createNotification(
        doc._id,
        `New user "${doc.username}" registered.`,
        "new_user"
      );
      console.log("Notification created successfully"); // Debug log
    } catch (error) {
      console.error("Failed to create notification:", error);
      // Handle error appropriately
    }
  }
});

// userSchema.methods.resetDailyLimitsIfNeeded = function () {
//   const currentDate = new Date();
//   const lastResetDate = new Date(this.lastResetDate);

//   // Check if it's a new day (ignoring time part)
//   if (currentDate.toDateString() !== lastResetDate.toDateString()) {
//     this.queriesUsed = 0;
//     this.chatOptionsUsed = 0;
//     this.lastResetDate = currentDate;
//     return this.save(); // Save the updated user document
//   }

//   return Promise.resolve();
// };
userSchema.methods.resetDailyLimitsIfNeeded = async function () {
  const currentDate = new Date();

  // If the user is a member, skip the date checks and check subscription dates
  if (this.isMember) {
    const subscriptionStartDate = new Date(this.subscriptionStartDate);
    const subscriptionEndDate = new Date(this.subscriptionEndDate);

    // // Check if the subscription has ended, and update the membership status
    if (currentDate > subscriptionEndDate) {
      this.isMember = false;
      this.downloadsToday = 0; // Reset daily downloads
      this.viewedResources = []; // Reset viewed resources
      this.resourceResetDate = currentDate; // Update resource reset timestamp
      this.queriesUsed = 0;
      this.chatOptionsUsed = 0;
      this.lastResetDate = currentDate; // Update limit reset timestamp
      console.log("Subscription has ended. Membership status updated.");
    }
    // If the subscription hasn't ended, skip further checks
    else {
      return true; // Membership is valid, so no changes are needed
    }
  }

  // Check if it's been more than 24 hours for resource-related reset (downloads and resources)
  const resourceResetDate = new Date(this.resourceResetDate);
  const timeSinceResourceReset = currentDate - resourceResetDate;
  if (timeSinceResourceReset >= 24 * 60 * 60 * 1000) {
    // 24 hours
    this.downloadsToday = 0; // Reset daily downloads
    this.viewedResources = []; // Reset viewed resources
    this.resourceResetDate = currentDate; // Update resource reset timestamp
  }

  // Check if it's been more than 2 hours for resetting usage limits (queries and chat options)
  const lastResetDate = new Date(this.lastResetDate);
  const timeSinceLastReset = currentDate - lastResetDate;
  if (timeSinceLastReset >= 2 * 60 * 60 * 1000) {
    // 2 hours
    this.queriesUsed = 0;
    this.chatOptionsUsed = 0;
    this.lastResetDate = currentDate; // Update limit reset timestamp
  }

  try {
    // Save all changes in one save call to avoid parallel save errors
    await this.save();
    return true;
  } catch (error) {
    console.error("Error saving user limits:", error);
    return false;
  }
};
// Add this to your user schema methods
userSchema.methods.canCreateQuery = function (slug) {
  // Find the chatOption based on slug
  if (this.isMember) {
    return true;
  }
  const chatOption = this.chatOptions.find((option) => option.slug === slug);

  // If no chatOption is found or there's no pdfText, allow query creation
  if (!chatOption || !chatOption.pdfText) {
    return true;
  }

  // If pdfText exists, enforce query limit of 10
  return this.queriesUsed < 10;
};

userSchema.methods.canCreateChatOption = function () {
  if (this.isMember) {
    return true;
  }

  return this.chatOptionsUsed < 2; // Limit: 2 chat options per 2 hours
};

module.exports = mongoose.model("User", userSchema);
