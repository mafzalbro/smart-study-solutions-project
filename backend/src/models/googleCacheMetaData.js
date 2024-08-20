// models/CacheMetadata.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const googleCacheMetaData = new Schema({
  pdfUrl: { type: String, required: true },
  cacheUri: { type: String, required: true },
  mimeType: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
});

module.exports = mongoose.model('CacheMetadata', googleCacheMetaData);
