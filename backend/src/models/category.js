const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Category Schema
const categorySchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    slug: {type: String, unique: true, required: true}
  });

  const Category = mongoose.model('Category', categorySchema);

  module.exports = Category;
