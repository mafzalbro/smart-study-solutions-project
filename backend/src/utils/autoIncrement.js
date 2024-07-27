const Counter = require('../models/counter');
const mongoose = require('mongoose');

const getNextSequenceValue = async (sequenceName, collectionName) => {
  try {
    // Get the current count of documents in the collection
    const count = await mongoose.model(collectionName).estimatedDocumentCount();

    // Update or insert the sequence document in the Counter collection
    const sequenceDocument = await Counter.findOneAndUpdate(
      { _id: sequenceName },
      { $set: { sequenceValue: count } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return sequenceDocument.sequenceValue;
  } catch (error) {
    console.error('Error fetching next sequence value:', error);
    throw error;
  }
};

module.exports = { getNextSequenceValue };
