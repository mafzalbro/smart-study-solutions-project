const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const NotificationService = require("../services/notificationService");

const adminSchema = new Schema(
  {
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
    profileImage: {
      type: String,
      required: true,
      default: "/avatars/default.png",
    },
    role: {
      type: String,
      enum: ["super_admin", "admin"],
      required: true,
      default: "admin",
    },
  },
  { timestamps: true }
);

let isNewAdmin = true; // Custom flag to track new admin state

// Pre-save hook to track new admin state
adminSchema.pre("save", function (next) {
  if (this.isNew) {
    isNewAdmin = true; // Mark as new if isNew flag is true
  } else {
    isNewAdmin = false; // Mark as not new for existing documents
  }
  next();
});

// Post-save hook to create notification for new admins
adminSchema.post("save", async function (doc) {
  if (isNewAdmin && doc._id) {
    try {
      await NotificationService.createNotification(
        doc._id,
        `New admin "${doc.username}" registered.`,
        "new_admin"
      );
      console.log("Notification created successfully"); // Debug log
    } catch (error) {
      console.error("Failed to create notification:", error);
      // Handle error appropriately
    }
  }
});

module.exports = mongoose.model("Admin", adminSchema);
