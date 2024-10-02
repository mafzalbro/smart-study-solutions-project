const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Category Schema
const genreSchema = new Schema({
  name: {
    type: String,
    required: true,
    default: "General",
    enum: ["Computer Science", "Tech"],
  },
  description: { type: String },
  slug: { type: String, unique: true, required: true, default: uuidv4 },
});

const Genre = mongoose.model("Genre", genreSchema);

module.exports = Genre;
