const mongoose = require('mongoose');
const Resource = require('../src/models/resource');
const fs = require('fs');
const { connect } = require('../src/config/db')

// Database connection
connect()
// Read resources data from JSON file
const resourcesData = JSON.parse(fs.readFileSync('backend/Settings/sample data/resourcesData.json', 'utf-8'));



// Insert resources data into the database
const insertResources = async () => {
  try {
    await Resource.insertMany(resourcesData);
    console.log('Resources data inserted successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error inserting resources data:', error);
  }
};

insertResources();
