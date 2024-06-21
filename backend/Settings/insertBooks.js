const mongoose = require('mongoose');
const Book = require('../src/models/book');
const fs = require('fs');
const { connect } = require('../src/config/db')

// Database connection
connect()
// Read books data from JSON file
const booksData = JSON.parse(fs.readFileSync('src/sample data/booksData.json', 'utf-8'));

// Insert books data into the database
const insertBooks = async () => {
  try {
    await Book.insertMany(booksData);
    console.log('Books data inserted successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error inserting books data:', error);
  }
};

insertBooks();
