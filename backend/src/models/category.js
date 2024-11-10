const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Category Schema
const categorySchema = new Schema(
  {
    name: { type: String, required: true, default: "General" },
    description: { type: String },
    slug: { type: String, unique: true, required: true, default: "general" },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
