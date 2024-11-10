const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  btnText: {
    type: String,
    required: true,
    trim: true,
  },
  btnLink: {
    type: String,
    required: true,
    trim: true,
  },
  icon: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "/home/header.png",
  }
}, {timestamps: true});

module.exports = mongoose.model("Announcement", announcementSchema);
